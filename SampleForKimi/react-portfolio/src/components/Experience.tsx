const timeline = [
  {
    role: 'Senior Frontend Engineer',
    company: 'Acme Inc.',
    period: '2023 — Present',
    summary: 'Led design system efforts, improved performance by 30%, mentored juniors.'
  },
  {
    role: 'Frontend Engineer',
    company: 'Startly',
    period: '2021 — 2023',
    summary: 'Built customer portal, introduced E2E tests, accessibility champion.'
  },
  {
    role: 'UI Developer',
    company: 'Freelance',
    period: '2019 — 2021',
    summary: 'Delivered bespoke sites for startups with a focus on polish.'
  }
];

export function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="container">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold">Experience</h2>
          <p className="text-muted-foreground">A quick hop through time.</p>
        </div>
        <div className="grid gap-3">
          {timeline.map((t) => (
            <article key={t.role + t.company} className="grid grid-cols-[180px_1fr] gap-4 rounded-xl border bg-background/50 p-4 backdrop-blur md:grid-cols-1">
              <div className="text-sm text-muted-foreground">
                <div className="font-medium">{t.period}</div>
                <div>{t.company}</div>
              </div>
              <div>
                <h3 className="m-0 text-lg font-semibold">{t.role}</h3>
                <p className="m-0 text-muted-foreground">{t.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
