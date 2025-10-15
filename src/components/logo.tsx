import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span className="font-headline text-lg font-bold">IP</span>
      </div>
      <span className="text-xl font-bold font-headline text-primary">
        Invest Prime
      </span>
    </div>
  );
}
