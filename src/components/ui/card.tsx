import { cn } from "@/lib/cn";

export function Card({
  title,
  description,
  children,
  className
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-soft", className)}>
      {(title || description) && (
        <div className="mb-3">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm text-slate-600">{description}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

