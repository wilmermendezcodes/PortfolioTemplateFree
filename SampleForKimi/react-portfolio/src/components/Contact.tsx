import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';

export function Contact() {
  return (
    <section id="contact" className="py-20">
      <div className="container">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">Let’s build something great together.</p>
        </div>
        <form className="glass grid gap-4 p-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Jane Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="jane@company.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Hello! I’d like to…" rows={5} />
          </div>
          <div className="flex items-center gap-3">
            <a className="inline-flex h-10 items-center rounded-md border bg-transparent px-4 text-sm font-semibold hover:bg-muted" href="mailto:hello@example.com?subject=Portfolio%20Inquiry">Email Me</a>
            <Button type="submit">Send Message</Button>
          </div>
          <p className="text-xs text-muted-foreground">This demo form does not submit anywhere. Use the Email button or wire it to your backend.</p>
        </form>
      </div>
    </section>
  );
}
