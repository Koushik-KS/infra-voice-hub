import { cn } from "@/lib/utils";

export function Card({ className, children }) {
  return <div className={cn("surface-card", className)}>{children}</div>;
}

export function SectionCard({ title, subtitle, icon: Icon, action, className, bodyClassName, children }) {
  return (
    <section className={cn("surface-card flex flex-col", className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <span className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
            )}
            <div>
              <h2 className="text-sm font-semibold">{title}</h2>
              {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {action}
        </header>
      )}
      <div className={cn("px-5 py-4", bodyClassName)}>{children}</div>
    </section>
  );
}
