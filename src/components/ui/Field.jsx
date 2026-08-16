import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25 disabled:opacity-60";

export function Label({ children, htmlFor, hint }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-xs font-semibold">
      {children}
      {hint && <span className="font-normal text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function TextInput({ className, ...props }) {
  return <input className={cn(control, className)} {...props} />;
}

export function TextArea({ className, ...props }) {
  return <textarea className={cn(control, "min-h-36 resize-y leading-relaxed", className)} {...props} />;
}

export function Select({ className, options = [], placeholder, ...props }) {
  return (
    <div className="relative">
      <select className={cn(control, "appearance-none pr-9", className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const label = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function Button({ variant = "primary", size = "md", className, ...props }) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
    navy: "bg-navy text-navy-foreground hover:bg-navy/90 shadow-xs",
    outline: "border border-border bg-card text-foreground hover:bg-accent",
    ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-sm",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
