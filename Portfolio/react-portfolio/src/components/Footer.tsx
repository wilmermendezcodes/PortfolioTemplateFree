export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-16">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="text-sm text-muted-foreground">
          © {year} Your Name
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
          <a href="#home" className="hover:text-foreground">Top ↑</a>
        </div>
      </div>
    </footer>
  );
}
