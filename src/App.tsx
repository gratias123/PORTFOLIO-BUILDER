import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './components/auth/AuthPages';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { PublicPortfolioPage } from './components/public/PublicPortfolioPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, isLoading } = usePortfolio();

  // Parse current route from window.location.hash or pathname
  const getRouteFromUrl = (): { route: string; param?: string } => {
    const hash = window.location.hash.replace(/^#\/?/, '/');
    const path = window.location.pathname;

    // Check public portfolio route e.g. /p/username or #/p/username
    const publicMatch = hash.match(/^\/p\/([a-zA-Z0-9_-]+)/) || path.match(/^\/p\/([a-zA-Z0-9_-]+)/);
    if (publicMatch) {
      return { route: '/p', param: publicMatch[1] };
    }

    if (hash === '/login' || path === '/login') return { route: '/login' };
    if (hash === '/register' || path === '/register') return { route: '/register' };
    if (hash === '/forgot-password' || path === '/forgot-password') return { route: '/forgot-password' };
    if (hash === '/onboarding' || path === '/onboarding') return { route: '/onboarding' };
    if (hash === '/dashboard' || path === '/dashboard') return { route: '/dashboard' };
    if (hash === '/settings' || path === '/settings') return { route: '/settings' };

    return { route: '/' };
  };

  const [currentRoute, setCurrentRoute] = useState<{ route: string; param?: string }>(getRouteFromUrl());

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getRouteFromUrl());
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (newRoute: string) => {
    if (newRoute.startsWith('/p/')) {
      window.location.hash = `#${newRoute}`;
    } else {
      window.location.hash = `#${newRoute}`;
    }
  };

  // If loading session on first turn
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">Chargement de Portfolio Builder...</p>
      </div>
    );
  }

  // 1. Public Portfolio View (/p/:username)
  if (currentRoute.route === '/p' && currentRoute.param) {
    return (
      <PublicPortfolioPage
        username={currentRoute.param}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  // 2. Auth Routes
  if (currentRoute.route === '/login') {
    if (user) {
      navigate('/dashboard');
      return null;
    }
    return (
      <LoginPage
        onNavigate={navigate}
        onSuccess={() => navigate('/dashboard')}
      />
    );
  }

  if (currentRoute.route === '/register') {
    if (user) {
      navigate('/dashboard');
      return null;
    }
    return (
      <RegisterPage
        onNavigate={navigate}
        onSuccess={() => navigate('/onboarding')}
      />
    );
  }

  if (currentRoute.route === '/forgot-password') {
    return (
      <ForgotPasswordPage
        onNavigate={navigate}
        onSuccess={() => navigate('/login')}
      />
    );
  }

  // 3. Protected Routes: Onboarding & Dashboard
  if (currentRoute.route === '/onboarding') {
    if (!user) {
      navigate('/login');
      return null;
    }
    return (
      <OnboardingWizard
        onComplete={() => navigate('/dashboard')}
        onExit={() => navigate('/dashboard')}
      />
    );
  }

  if (currentRoute.route === '/dashboard' || currentRoute.route === '/settings') {
    if (!user) {
      navigate('/login');
      return null;
    }
    return (
      <DashboardLayout
        initialTab={currentRoute.route === '/settings' ? 'settings' : undefined}
        onLogout={() => navigate('/')}
        onOpenPublicPortfolio={(uname) => navigate(`/p/${uname}`)}
        onStartOnboarding={() => navigate('/onboarding')}
      />
    );
  }

  // 4. Default Home: Landing page (or if logged in, option to go to dashboard)
  return (
    <LandingPage
      onNavigate={(r) => {
        if (r === '/dashboard' || r === '/register' || r === '/login') {
          if (user && (r === '/login' || r === '/register')) {
            navigate('/dashboard');
            return;
          }
        }
        navigate(r);
      }}
    />
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
