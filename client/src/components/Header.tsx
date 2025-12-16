import { Link, useLocation } from "wouter";
import { Sun, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between gap-4 px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Sun className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold" data-testid="text-logo">SolarPro</span>
        </Link>
        
        <nav className="flex items-center gap-2 flex-wrap">
          <Link href="/propostas">
            <Button 
              variant={location === "/propostas" ? "secondary" : "ghost"}
              className="gap-2"
              data-testid="link-proposals"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Propostas</span>
            </Button>
          </Link>
          <Link href="/">
            <Button 
              variant={location === "/" ? "default" : "outline"}
              className="gap-2"
              data-testid="link-new-proposal"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Proposta</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
