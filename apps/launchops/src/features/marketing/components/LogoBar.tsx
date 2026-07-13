const techLogos = ['Next.js', 'React', 'NestJS', 'LangGraph', 'Terraform', 'AWS', 'Vercel']

export function LogoBar() {
  return (
    <section className="border-y border-border bg-card py-8">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Built on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {techLogos.map((name) => (
            <span
              key={name}
              className="font-mono text-sm font-semibold text-muted-foreground/50 transition-opacity duration-200 hover:text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
