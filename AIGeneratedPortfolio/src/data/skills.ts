import { Skill } from "../types";

export const skills: Skill[] = [
  // Web Development
  {
    id: "react",
    name: "React",
    category: "Web Development",
    description:
      "A popular library for building user interfaces with components and declarative rendering.",
    experience:
      "Built responsive, component-driven SPAs with hooks, context, and performance optimizations. Shipped production UIs with reusable design systems and accessibility in mind.",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Web Development",
    description:
      "A typed superset of JavaScript that compiles to plain JavaScript, enabling safer, large-scale apps.",
    experience:
      "Adopted strong typing across apps, leveraging generics, utility types, and strict configs to reduce bugs and improve DX.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Web Development",
    description:
      "The language of the web used to create dynamic, interactive experiences in the browser.",
    experience:
      "Deep understanding of ESNext features, async patterns, modules, and runtime performance. Comfortable across browsers and Node.js.",
  },
  {
    id: "node",
    name: "Node.js",
    category: "Web Development",
    description:
      "A JavaScript runtime built on Chrome's V8 engine for server-side applications.",
    experience:
      "Built CLI tools, API servers, and background workers. Familiar with streams, clustering, and deployment best practices.",
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "Web Development",
    description:
      "A reliable open-source relational database widely used for transactional workloads.",
    experience:
      "Designed schemas, authored migrations, optimized queries with indexes, and implemented relational patterns.",
  },
  {
    id: "mui",
    name: "Material UI",
    category: "Web Development",
    description:
      "A React component library implementing Google's Material Design system.",
    experience:
      "Created custom themes, extended components, and integrated responsive layouts aligned with product branding.",
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    category: "Web Development",
    description:
      "A collection of reusable, unstyled components built on Tailwind, meant to be copied and customized.",
    experience:
      "Adopted shadcn patterns to compose accessible dialogs, cards, and forms with Tailwind, ensuring consistent design tokens.",
  },

  // Backend & APIs
  {
    id: "rest",
    name: "REST",
    category: "Backend & APIs",
    description:
      "A standard architectural style for designing stateless web APIs.",
    experience:
      "Designed clean endpoints, pagination, and error handling. Documented contracts and ensured backward compatibility.",
  },
  {
    id: "express",
    name: "Express",
    category: "Backend & APIs",
    description:
      "A minimal and flexible Node.js web framework for building APIs and web apps.",
    experience:
      "Built REST APIs with middleware, validation, and auth. Structured modular routers and services for maintainability.",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Backend & APIs",
    description:
      "An open-source Firebase alternative offering Postgres, auth, storage, and real-time APIs.",
    experience:
      "Leveraged Postgres, RLS, and Auth for rapid prototyping, then optimized queries for production workloads.",
  },
  {
    id: "drizzle",
    name: "Drizzle ORM",
    category: "Backend & APIs",
    description:
      "A type-safe ORM for TypeScript with a focus on schema-first development and SQL-first ergonomics.",
    experience:
      "Used Drizzle schema and migrations with Postgres/MySQL, benefiting from end-to-end type safety and DX.",
  },

  // Tools & Platforms
  {
    id: "git",
    name: "Git",
    category: "Tools & Platforms",
    description:
      "A distributed version control system for tracking changes in code.",
    experience:
      "Daily use of branching strategies, code reviews, and clean commit history. Comfortable with CLI and advanced workflows.",
  },
  {
    id: "github",
    name: "GitHub",
    category: "Tools & Platforms",
    description:
      "A platform for hosting code, collaboration, and automation via Actions.",
    experience:
      "Maintained CI pipelines, issue templates, and release flows. Participated in PR reviews and project planning.",
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Tools & Platforms",
    description:
      "A platform for frontend frameworks and static sites, featuring fast global deployments.",
    experience:
      "Deployed SSR/SPA apps with previews, environment variables, and edge caching for performance.",
  },
  {
    id: "docker",
    name: "Docker",
    category: "Tools & Platforms",
    description:
      "A platform for building, shipping, and running applications in containers.",
    experience:
      "Containerized services, wrote multi-stage Dockerfiles, and orchestrated local dev environments.",
  },

  // Other
  {
    id: "automation",
    name: "Automation scripts",
    category: "Other",
    description:
      "Scripting tasks to streamline workflows, reduce manual steps, and improve reliability.",
    experience:
      "Automated deploys, data migrations, and reporting with Node scripts and npm toolchains.",
  },
  {
    id: "uiux",
    name: "UI/UX principles",
    category: "Other",
    description:
      "Design heuristics focused on usability, accessibility, and visual hierarchy.",
    experience:
      "Shipped accessible interfaces using semantic HTML, keyboard navigation, and consistent spacing/typography.",
  },
  {
    id: "devops",
    name: "Basic DevOps",
    category: "Other",
    description:
      "Core practices for building, testing, and shipping software reliably.",
    experience:
      "Set up CI pipelines, environment configs, and observability basics to ensure smooth releases.",
  },
  {
    id: "cloud",
    name: "Cloud deployment",
    category: "Other",
    description:
      "Deploying and scaling applications on cloud platforms with best practices.",
    experience:
      "Configured environments, variables, and monitored performance to keep apps healthy post-deploy.",
  },
];