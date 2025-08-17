type Project = {
  title: string;
  description: string;
  tags: string[];
  link?: string;
};

const projects: Project[] = [
  {
    title: 'Bento Analytics',
    description: 'Interactive dashboards with buttery-smooth micro-interactions and real-time data.',
    tags: ['React', 'TS', 'Vite']
  },
  {
    title: 'Glossy UI Kit',
    description: 'A glassmorphism-inspired design system focused on accessibility and speed.',
    tags: ['Design System', 'CSS', 'A11y']
  },
  {
    title: 'Motion Gallery',
    description: 'Showcase of physics-based animations and gesture interactions.',
    tags: ['Animations', 'Framer-ish']
  }
];

import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="container">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <p className="text-muted-foreground">Selected work — focused and refined.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.title} className="overflow-hidden glass transition will-change-transform hover:translate-y-[-2px] hover:shadow-xl">
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 scale-[1.1] blur-md bg-gradient-to-tr from-primary/30 to-secondary/30" />
                <div className="absolute inset-auto left-3 bottom-3 h-9 w-4/5 rounded-full bg-gradient-to-r from-white/20 to-transparent blur-md" />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="outline" className="bg-white/5 text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
