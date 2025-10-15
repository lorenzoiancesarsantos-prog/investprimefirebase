import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="flex items-center justify-end gap-4">{children}</div>
    </header>
  );
}
