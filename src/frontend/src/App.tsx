import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import NewSessionPage from './pages/NewSessionPage';
import SessionDetailPage from './pages/SessionDetailPage';
import ContextScanPage from './pages/ContextScanPage';
import TimelineFracturePage from './pages/TimelineFracturePage';
import SettingsAboutPage from './pages/SettingsAboutPage';
import AppShell from './components/AppShell';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const newSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-session',
  component: NewSessionPage,
});

const sessionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/session/$sessionId',
  component: SessionDetailPage,
});

const contextScanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/session/$sessionId/context',
  component: ContextScanPage,
});

const timelineFractureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/timeline-fracture',
  component: TimelineFracturePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsAboutPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  newSessionRoute,
  sessionDetailRoute,
  contextScanRoute,
  timelineFractureRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
