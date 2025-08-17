import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function Hero() {
  return (
    <section id="home" className="relative py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-orb-a absolute -left-20 -top-10 h-[360px] w-[360px] opacity-60" />
        <div className="bg-orb-b absolute -right-28 top-28 h-[420px] w-[420px] opacity-60" />
      </div>
      <div className="container grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight md:text-6xl">
            <span className="block text-muted-foreground text-base font-semibold">Hello, I’m</span>
            <span className="bg-gradient-to-tr from-[hsl(var(--primary)/.95)] to-[hsl(var(--secondary)/.95)] dark:from-[hsl(var(--primary)/.70)] dark:to-[hsl(var(--secondary)/.70)] bg-clip-text text-transparent">Your Name</span>
          </h1>
          <p className="mb-5 max-w-xl text-lg text-muted-foreground">Building delightful web experiences with React & TypeScript.</p>
          <div className="flex gap-3">
            <Button>View Projects</Button>
            <Button variant="ghost" className="border">
              Contact Me
            </Button>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub ↗</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn ↗</a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="hover:text-foreground">Resume ↗</a>
          </div>
        </div>
        <Card className="glass">
          <CardContent className="grid grid-cols-3 gap-3 p-4">
            <div className="rounded-lg border bg-white/5 p-4 text-center">
              <div className="text-xl font-extrabold">5+ yrs</div>
              <div className="text-xs text-muted-foreground">Experience</div>
            </div>
            <div className="rounded-lg border bg-white/5 p-4 text-center">
              <div className="text-xl font-extrabold">20+</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </div>
            <div className="rounded-lg border bg-white/5 p-4 text-center">
              <div className="text-xl font-extrabold">100%</div>
              <div className="text-xs text-muted-foreground">Passion</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
