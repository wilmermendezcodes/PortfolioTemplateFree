type Props = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export function Navbar({ theme, onToggleTheme }: Props) {
  return (
    <header className="sticky top-3 z-50 mx-auto w-[min(1100px,92%)] rounded-xl border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="flex items-center justify-between px-4 py-2">
        <a href="#home" className="inline-flex items-center gap-2 font-bold tracking-wide text-foreground no-underline">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: 'radial-gradient(circle at 40% 40%, white, hsl(var(--primary)))', boxShadow: '0 0 16px hsl(var(--primary))' }} />
          <span>MyPortfolio</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#about" className="hover:text-foreground">About</a>
          <a href="#experience" className="hover:text-foreground">Experience</a>
          <a href="#projects" className="hover:text-foreground">Projects</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <a className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-95" href="#contact">Let’s Talk</a>
          <button aria-label="Toggle theme" className="h-9 w-9 rounded-md border bg-background hover:bg-muted" onClick={onToggleTheme}>
            {theme === 'dark' ? '🌤️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
