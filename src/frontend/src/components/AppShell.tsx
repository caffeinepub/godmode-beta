import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, Home, Plus, Activity, Map, Settings } from 'lucide-react';
import AuthButton from './AuthButton';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useCurrentUser();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home, public: true },
    { path: '/new-session', label: 'New Session', icon: Plus, public: false },
    { path: '/timeline-fracture', label: 'Timeline Fracture', icon: Map, public: true },
    { path: '/settings', label: 'Settings', icon: Settings, public: false },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        if (!item.public && !isAuthenticated) return null;
        const isActive = currentPath === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            } ${mobile ? 'text-base' : 'text-sm'}`}
            onClick={() => mobile && setMobileMenuOpen(false)}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/generated/godmode-logo.dim_512x512.png" alt="GODMODE" className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight">GODMODE</span>
              <span className="text-xs text-muted-foreground font-medium">(Beta)</span>
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              <NavLinks />
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <AuthButton />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} GODMODE (Beta). Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
