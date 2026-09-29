import { FullPortfolioData, User } from '../types/portfolio';

const TOKEN_KEY = 'portfolio_builder_token';
const PORTFOLIO_CACHE_KEY = 'portfolio_builder_cache';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Auth
  async register(email: string, password: string, username?: string): Promise<{ user: User; token: string; portfolio: FullPortfolioData }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'inscription');
    this.setToken(data.token);
    this.cachePortfolio(data.portfolio);
    return data;
  },

  async login(email: string, password: string): Promise<{ user: User; token: string; portfolio: FullPortfolioData }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Identifiants invalides');
    this.setToken(data.token);
    this.cachePortfolio(data.portfolio);
    return data;
  },

  async demoSession(): Promise<{ user: User; token: string; portfolio: FullPortfolioData }> {
    const res = await fetch('/api/auth/demo-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur session démo');
    this.setToken(data.token);
    this.cachePortfolio(data.portfolio);
    return data;
  },

  async getMe(): Promise<{ user: User; portfolio: FullPortfolioData } | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        if (res.status === 401) {
          this.removeToken();
        }
        return null;
      }
      const data = await res.json();
      this.cachePortfolio(data.portfolio);
      return data;
    } catch {
      // Offline fallback: check cached portfolio
      const cached = this.getCachedPortfolio();
      if (cached) {
        return { user: cached.user, portfolio: cached };
      }
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } catch {
      // Ignore network errors during logout
    } finally {
      this.removeToken();
      localStorage.removeItem(PORTFOLIO_CACHE_KEY);
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la demande');
    return data;
  },

  // Portfolio
  async getPortfolio(): Promise<FullPortfolioData> {
    const res = await fetch('/api/portfolio', {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Impossible de charger le portfolio');
    const data = await res.json();
    this.cachePortfolio(data);
    return data;
  },

  async savePortfolio(portfolio: FullPortfolioData): Promise<FullPortfolioData> {
    this.cachePortfolio(portfolio);
    const res = await fetch('/api/portfolio', {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(portfolio),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la sauvegarde');
    }
    const data = await res.json();
    this.cachePortfolio(data.portfolio);
    return data.portfolio;
  },

  // Username validation & update
  async checkUsername(username: string, userId?: string): Promise<{ available: boolean; error?: string }> {
    const url = `/api/check-username?username=${encodeURIComponent(username)}${userId ? `&userId=${userId}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  },

  async updateUsername(username: string): Promise<{ username: string; portfolio: FullPortfolioData }> {
    const res = await fetch('/api/user/username', {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors du changement d\'identifiant');
    this.cachePortfolio(data.portfolio);
    return data;
  },

  // Public portfolio fetch (no auth required)
  async getPublicPortfolio(username: string): Promise<{ isPublished: boolean; isOwner?: boolean; portfolio?: FullPortfolioData; profile?: any }> {
    const res = await fetch(`/api/p/${encodeURIComponent(username)}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Ce portfolio n\'existe pas.');
      }
      throw new Error('Erreur lors du chargement du portfolio public.');
    }
    return res.json();
  },

  async trackCvDownload(username: string): Promise<void> {
    try {
      await fetch(`/api/p/${encodeURIComponent(username)}/track-download`, {
        method: 'POST',
      });
    } catch {
      // Ignore network errors in analytics tracking
    }
  },

  async trackLinkClick(username: string): Promise<void> {
    try {
      await fetch(`/api/p/${encodeURIComponent(username)}/track-link-click`, {
        method: 'POST',
      });
    } catch {
      // Ignore network errors in analytics tracking
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors du changement de mot de passe');
    return data;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const res = await fetch('/api/user/account', {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la suppression du compte');
    this.removeToken();
    localStorage.removeItem(PORTFOLIO_CACHE_KEY);
    return data;
  },

  // Local cache helpers
  cachePortfolio(portfolio: FullPortfolioData): void {
    try {
      localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(portfolio));
    } catch {
      // localstorage full or blocked
    }
  },

  getCachedPortfolio(): FullPortfolioData | null {
    try {
      const raw = localStorage.getItem(PORTFOLIO_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
