# RAG Performance Guide

This guide standardizes how to evaluate Retrieval‑Augmented Generation (RAG) systems:
what to measure, how to run experiments, and how to report results.

> If you already have experiment logs, drop them into the schema below and
> copy the result table templates in this doc.


## Overview

- **Goal:** Measure how well a RAG pipeline retrieves relevant context and produces
  grounded, correct answers efficiently.
- **Scope:** Retrieval quality, answer quality, efficiency, and cost. Includes
  ablations for chunking, top‑k, rerankers, and embedding models.
- **Deliverable:** A concise results table (per dataset), supporting plots, and a
  short narrative of insights and trade‑offs.


## What To Measure

- **Retrieval quality:** How often the retrieved context actually contains
  the gold evidence.
- **Answer quality:** How correct and faithful answers are to the retrieved
  context and query.
- **Efficiency:** Latency and throughput for retrieval+generation.
- **Cost:** Token usage and $ for model calls (if applicable).


## Datasets

- **Format:** Each example has `id`, `question`, `gold_answer`, and one of:
  - `gold_passages` (texts known to contain the answer), or
  - `gold_citations` (document IDs/spans), or
  - a rubric for matching (regex, string set, etc.).
- **Sources:** Use your domain data and at least one public set (e.g.,
  NQ‑Open, HotpotQA, FiQA, MS MARCO) to sanity‑check generality.
- **Splits:** Train (for retrieval tuning) / Dev (for selection) / Test (report only).


## Experimental Setup (record every item)

- **Embedding model:** Name + version (e.g., `text-embedding-3-large`, `bge-base`),
  dimensionality, normalization.
- **Indexer/Vector DB:** FAISS/Chroma/PGVector/etc., index type, search params.
- **Chunking:** Strategy (by sentence, token), `chunk_tokens`, `chunk_overlap`.
- **Retriever:** `top_k`, filters, MIPS/ANN params.
- **Reranker (optional):** Model name, cross‑encoder settings, `rerank_k`.
- **Generator:** Model name/version, temperature, max tokens.
- **Prompting:** System + user templates, citation format, grounding instructions.
- **Hardware:** CPU/GPU, batch sizes, concurrency.
- **Randomness:** Seeds, sampling settings.


## Metrics

Retrieval (at k):

- **Hit@k / Recall@k:** Fraction of queries where any retrieved passage contains
  gold evidence.
- **Precision@k (optional):** Fraction of retrieved passages that are relevant.
- **MRR@k:** Mean Reciprocal Rank of first relevant passage.
- **nDCG@k:** Gain‑weighted ranking quality.

Answering:

- **Exact Match (EM):** Binary match against normalized gold answer.
- **F1:** Token‑level F1 against gold answer.
- **ROUGE‑L / BLEU (optional):** String overlap for generative answers.
- **Faithfulness / Groundedness:** Does the answer only use retrieved context?
  (LLM judge or rule‑based citation checks.)
- **Hallucination Rate:** 1 − Faithfulness.

Operational:

- **Latency:** p50/p90 for retrieval, generation, and end‑to‑end.
- **Cost:** Prompt + completion tokens, $ per query.


## Evaluation Procedure

1. Build the index with the chosen chunking and embeddings.
2. For each query, retrieve top‑k passages; optionally rerank.
3. Compute retrieval metrics vs. gold evidence.
4. Run the generator with a grounded prompt over the retrieved passages.
5. Compute answer metrics vs. gold answer; assess faithfulness to retrieved context.
6. Log per‑query details (schema below). Aggregate by mean/percentiles with CIs.


## Logging Schema (JSONL per query)

Each line is one evaluation example.

```json
{
  "id": "str",
  "question": "str",
  "gold_answer": "str|[str]",
  "retrieved": [
    {"doc_id": "str", "rank": 1, "score": 23.1, "text": "..."}
  ],
  "answer": {
    "text": "str",
    "citations": ["doc_id#span"],
    "usage": {"prompt_tokens": 0, "completion_tokens": 0}
  },
  "metrics": {
    "hit@5": true,
    "mrr@10": 0.5,
    "em": 1,
    "f1": 0.83,
    "faithfulness": 0.9,
    "latency_ms": {"retrieve": 45, "generate": 320, "total": 380},
    "cost_usd": 0.0019
  },
  "setup": {
    "embed": "bge-base-en-v1.5",
    "db": "faiss:IVF1024,Flat",
    "chunk": {"size": 512, "overlap": 64},
    "retriever": {"top_k": 10},
    "reranker": {"model": "cross-encoder/ms-marco-MiniLM-L-6-v2", "k": 50},
    "generator": "gpt-4o-mini",
    "prompt_id": "v3_citations"
  }
}
```

Tips:

- Keep raw `text` fields for audit; for heavy logs, store only `doc_id` and a
  separate mapping file.
- Include `prompt_id` and model versions to ensure reproducibility.


## Reporting Results (templates)

Fill in a small set of k values (e.g., 1/5/10) and the primary answer metric.

### Single‑dataset summary

| Setup | Hit@5 | MRR@10 | EM | F1 | Faithfulness | p90 Latency (ms) | $ / query |
|---|---:|---:|---:|---:|---:|---:|---:|
| Baseline (bge, k=5) | 0.78 | 0.61 | 0.54 | 0.67 | 0.88 | 690 | 0.0021 |
| + Reranker (CE, k=5) | 0.84 | 0.68 | 0.58 | 0.70 | 0.92 | 780 | 0.0026 |
| + Larger embed (1024d) | 0.86 | 0.71 | 0.60 | 0.72 | 0.93 | 800 | 0.0029 |

### Ablation: chunk size

| Chunk tokens | Hit@5 | EM | F1 | Faithfulness |
|---:|---:|---:|---:|---:|
| 256 | 0.80 | 0.55 | 0.68 | 0.90 |
| 512 | 0.84 | 0.58 | 0.70 | 0.92 |
| 1024 | 0.82 | 0.57 | 0.69 | 0.91 |

### Per‑topic breakdown (optional)

| Topic | n | Hit@5 | EM | F1 |
|---|---:|---:|---:|---:|
| API | 120 | 0.88 | 0.61 | 0.73 |
| Pricing | 85 | 0.76 | 0.49 | 0.63 |
| Policies | 40 | 0.70 | 0.43 | 0.58 |


## Interpreting Results

- **Retrieval vs. generation trade‑off:** Stronger retrieval often boosts EM/F1 more
  than tweaking the generator. If faithfulness is low, focus on retrieval and prompts.
- **Chunking:** Too small → fragmented context; too large → diluted relevance.
- **Top‑k:** Higher k can help recall but may hurt latency/cost; reranking helps.
- **Prompting:** Cite sources and instruct grounding to reduce hallucinations.
- **Regression protection:** Track a small smoke set in CI to catch drift.


## Reproducibility Checklist

- Dataset commit hash and split IDs.
- Model names/versions for embedder, reranker, generator.
- All hyperparameters (chunking, k, temperature, etc.).
- Prompt templates and any system messages.
- Hardware, concurrency, seeds.
- Exact code version/commit.


## Example CLI (pseudo‑commands)

Use your evaluation runner; these are illustrative.

```bash
# Build index
rag index \
  --docs data/corpus.jsonl \
  --embedder bge-base-en-v1.5 \
  --chunk-tokens 512 --chunk-overlap 64 \
  --out indexes/bge_base_512

# Evaluate (retrieval + generation)
rag eval \
  --index indexes/bge_base_512 \
  --questions data/dev.jsonl \
  --retriever.top_k 10 \
  --reranker cross-encoder/ms-marco-MiniLM-L-6-v2 \
  --generator gpt-4o-mini \
  --prompt prompts/cite_v3.yaml \
  --out logs/dev_eval.jsonl

# Aggregate
rag report \
  --in logs/dev_eval.jsonl \
  --metrics hit@5,mrr@10,em,f1,faithfulness,latency_p90,cost_per_query \
  --md docs/RAG-Results.md
```


## Troubleshooting

- Low EM/F1 but high Hit@k → prompt or generator issue; add grounding, cite spans.
- Low Hit@k → revisit chunking, embeddings, top‑k, or add a reranker.
- Slow latency → pre‑filtering, ANN tuning, batching, or smaller models.
- High hallucination → stricter prompts, shorter answers, or enforce citations.


---

Maintainers: keep this guide close to the results you publish. If you need a
filled‑in results file, create `docs/RAG-Results.md` from the templates above.

