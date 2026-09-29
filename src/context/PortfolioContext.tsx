import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { FullPortfolioData, User } from '../types/portfolio';
import { api } from '../services/api';

interface PortfolioContextType {
  user: User | null;
  portfolio: FullPortfolioData | null;
  isLoading: boolean;
  isSaving: boolean;
  saveStatus: 'saved' | 'saving' | 'error' | 'unsaved';
  lastSaved: Date | null;
  saveError: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, username?: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  updatePortfolio: (updater: (prev: FullPortfolioData) => FullPortfolioData) => void;
  saveNow: () => Promise<void>;
  updateUsername: (newUsername: string) => Promise<void>;
  reloadPortfolio: () => Promise<void>;
  publishPortfolio: () => Promise<void>;
  unpublishPortfolio: () => Promise<void>;
  changePassword: (curr: string, next: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [portfolio, setPortfolio] = useState<FullPortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestPortfolioRef = useRef<FullPortfolioData | null>(null);

  latestPortfolioRef.current = portfolio;

  // Initial session check
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const session = await api.getMe();
        if (session) {
          setUser(session.user);
          setPortfolio(session.portfolio);
          setLastSaved(new Date());
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const saveToServer = useCallback(async (dataToSave: FullPortfolioData) => {
    setIsSaving(true);
    setSaveStatus('saving');
    setSaveError(null);
    try {
      const saved = await api.savePortfolio(dataToSave);
      setPortfolio(saved);
      setSaveStatus('saved');
      setLastSaved(new Date());
    } catch (err: any) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      setSaveError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Update portfolio with auto-save debounce (600ms)
  const updatePortfolio = useCallback((updater: (prev: FullPortfolioData) => FullPortfolioData) => {
    setPortfolio((current) => {
      if (!current) return current;
      const updated = updater(current);
      setSaveStatus('unsaved');

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        saveToServer(updated);
      }, 600);

      return updated;
    });
  }, [saveToServer]);

  // Immediate save trigger
  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (latestPortfolioRef.current) {
      await saveToServer(latestPortfolioRef.current);
    }
  }, [saveToServer]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
      setPortfolio(res.portfolio);
      setLastSaved(new Date());
      setSaveStatus('saved');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string, username?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(email, pass, username);
      setUser(res.user);
      setPortfolio(res.portfolio);
      setLastSaved(new Date());
      setSaveStatus('saved');
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.demoSession();
      setUser(res.user);
      setPortfolio(res.portfolio);
      setLastSaved(new Date());
      setSaveStatus('saved');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setPortfolio(null);
    setSaveStatus('saved');
  };

  const updateUsername = async (newUsername: string) => {
    const res = await api.updateUsername(newUsername);
    if (user) {
      setUser({ ...user, username: res.username });
    }
    setPortfolio(res.portfolio);
    setLastSaved(new Date());
  };

  const reloadPortfolio = async () => {
    if (!user) return;
    try {
      const data = await api.getPortfolio();
      setPortfolio(data);
      setLastSaved(new Date());
      setSaveStatus('saved');
    } catch (err) {
      console.error('Reload portfolio error:', err);
    }
  };

  const publishPortfolio = async () => {
    if (!portfolio) return;
    const updated: FullPortfolioData = {
      ...portfolio,
      settings: {
        ...portfolio.settings,
        isPublished: true,
        publishedAt: portfolio.settings.publishedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    await saveToServer(updated);
  };

  const unpublishPortfolio = async () => {
    if (!portfolio) return;
    const updated: FullPortfolioData = {
      ...portfolio,
      settings: {
        ...portfolio.settings,
        isPublished: false,
        updatedAt: new Date().toISOString(),
      },
    };
    await saveToServer(updated);
  };

  const changePassword = async (curr: string, next: string) => {
    await api.changePassword(curr, next);
  };

  const deleteAccount = async () => {
    await api.deleteAccount();
    setUser(null);
    setPortfolio(null);
  };

  return (
    <PortfolioContext.Provider
      value={{
        user,
        portfolio,
        isLoading,
        isSaving,
        saveStatus,
        lastSaved,
        saveError,
        login,
        register,
        demoLogin,
        logout,
        updatePortfolio,
        saveNow,
        updateUsername,
        reloadPortfolio,
        publishPortfolio,
        unpublishPortfolio,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return ctx;
};
