import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="container">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold">About</h2>
          <p className="text-muted-foreground">Designer-minded engineer. Engineer-minded designer.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Bio</CardTitle>
              <CardDescription>Thoughtful, polished, and accessible.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                I craft polished, performant interfaces with a focus on clarity, motion, and accessibility. I love bringing ideas to life and collaborating with teams to ship delightful products.
              </p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Tools I enjoy using</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Vite', 'Node', 'CSS', 'Animations', 'Testing', 'Design Systems'].map((s) => (
                <Badge key={s} variant="outline" className="bg-white/5">
                  {s}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
