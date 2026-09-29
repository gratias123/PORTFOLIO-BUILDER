import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { FullPortfolioData, User, createEmptyPortfolio } from './src/types/portfolio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Interface for DB
interface StoredUser extends User {
  passwordHash: string;
  salt: string;
  token?: string;
  tokenExpiry?: number;
}

interface DatabaseSchema {
  users: StoredUser[];
  portfolios: Record<string, FullPortfolioData>; // userId -> portfolio
}

// Ensure DB directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = { users: [], portfolios: {} };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning empty', err);
    return { users: [], portfolios: {} };
  }
}

function writeDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json', err);
  }
}

// Crypto utilities
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function sanitizeUser(u: StoredUser): User {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Helper Auth Middleware
  function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
      return;
    }
    const token = authHeader.split(' ')[1];
    const db = readDB();
    const user = db.users.find(
      (u) => u.token === token && u.tokenExpiry && u.tokenExpiry > Date.now()
    );

    if (!user) {
      res.status(401).json({ error: 'Session expirée ou invalide. Veuillez vous reconnecter.' });
      return;
    }

    (req as any).user = user;
    (req as any).userId = user.id;
    next();
  }

  // Optional Auth Middleware (for previewing own non-published portfolio)
  function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const db = readDB();
      const user = db.users.find(
        (u) => u.token === token && u.tokenExpiry && u.tokenExpiry > Date.now()
      );
      if (user) {
        (req as any).user = user;
        (req as any).userId = user.id;
      }
    }
    next();
  }

  // -------------------------------------------------------------
  // AUTH API
  // -------------------------------------------------------------

  // Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'L\'email et le mot de passe sont requis.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Le mot de passe doit comporter au moins 6 caractères.' });
      return;
    }

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();

    if (db.users.some((u) => u.email === cleanEmail)) {
      res.status(409).json({ error: 'Un compte avec cet email existe déjà.' });
      return;
    }

    // Determine unique username
    let chosenUsername = (username || cleanEmail.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!chosenUsername) {
      chosenUsername = `user-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    let finalUsername = chosenUsername;
    let counter = 1;
    while (db.users.some((u) => u.username === finalUsername)) {
      finalUsername = `${chosenUsername}-${counter}`;
      counter++;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const userId = crypto.randomUUID();
    const token = generateToken();
    const tokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      id: userId,
      email: cleanEmail,
      username: finalUsername,
      passwordHash,
      salt,
      token,
      tokenExpiry,
      createdAt: now,
      updatedAt: now,
    };

    // Generic initial empty portfolio
    const initialPortfolio = createEmptyPortfolio(sanitizeUser(newUser));

    db.users.push(newUser);
    db.portfolios[userId] = initialPortfolio;
    writeDB(db);

    res.status(201).json({
      message: 'Compte créé avec succès',
      user: sanitizeUser(newUser),
      token,
      portfolio: initialPortfolio,
    });
  });

  // Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis.' });
      return;
    }

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();
    const user = db.users.find((u) => u.email === cleanEmail);

    if (!user) {
      res.status(401).json({ error: 'Identifiants invalides.' });
      return;
    }

    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      res.status(401).json({ error: 'Identifiants invalides.' });
      return;
    }

    const token = generateToken();
    user.token = token;
    user.tokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    user.updatedAt = new Date().toISOString();
    writeDB(db);

    const portfolio = db.portfolios[user.id] || createEmptyPortfolio(sanitizeUser(user));

    res.json({
      message: 'Connexion réussie',
      user: sanitizeUser(user),
      token,
      portfolio,
    });
  });

  // Quick Demo / Discovery Session (creates an isolated generic workspace)
  app.post('/api/auth/demo-session', (_req: Request, res: Response) => {
    const db = readDB();
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const userId = crypto.randomUUID();
    const finalUsername = `portfolio-${randomId}`;
    const token = generateToken();
    const tokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      id: userId,
      email: `demo.${randomId}@portfoliobuilder.local`,
      username: finalUsername,
      passwordHash: '',
      salt: '',
      token,
      tokenExpiry,
      createdAt: now,
      updatedAt: now,
    };

    const initialPortfolio = createEmptyPortfolio(sanitizeUser(newUser));

    db.users.push(newUser);
    db.portfolios[userId] = initialPortfolio;
    writeDB(db);

    res.json({
      message: 'Session de démonstration initialisée',
      user: sanitizeUser(newUser),
      token,
      portfolio: initialPortfolio,
    });
  });

  // Current User Session
  app.get('/api/auth/me', authMiddleware, (req: Request, res: Response) => {
    const user = (req as any).user as StoredUser;
    const db = readDB();
    const portfolio = db.portfolios[user.id] || createEmptyPortfolio(sanitizeUser(user));

    res.json({
      user: sanitizeUser(user),
      portfolio,
    });
  });

  // Forgot password
  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Veuillez saisir votre email.' });
      return;
    }
    // Return friendly reassurance without leaking whether account exists
    res.json({
      message: 'Si cette adresse email est enregistrée, les instructions de réinitialisation vous ont été transmises.',
    });
  });

  // Logout
  app.post('/api/auth/logout', authMiddleware, (req: Request, res: Response) => {
    const user = (req as any).user as StoredUser;
    const db = readDB();
    const target = db.users.find((u) => u.id === user.id);
    if (target) {
      delete target.token;
      delete target.tokenExpiry;
      writeDB(db);
    }
    res.json({ message: 'Déconnexion réussie.' });
  });

  // -------------------------------------------------------------
  // USERNAME / PROFILE SETTINGS API
  // -------------------------------------------------------------

  // Check username availability
  app.get('/api/check-username', (req: Request, res: Response) => {
    const username = ((req.query.username as string) || '').trim().toLowerCase();
    const currentUserId = req.query.userId as string;

    if (!username) {
      res.status(400).json({ available: false, error: 'Identifiant requis.' });
      return;
    }

    if (!/^[a-z0-9_-]{3,30}$/.test(username)) {
      res.status(400).json({
        available: false,
        error: 'L\'identifiant doit faire entre 3 et 30 caractères (lettres, chiffres, tirets).',
      });
      return;
    }

    const db = readDB();
    const exists = db.users.some((u) => u.username === username && u.id !== currentUserId);

    res.json({
      available: !exists,
      username,
    });
  });

  // Update username
  app.put('/api/user/username', authMiddleware, (req: Request, res: Response) => {
    const user = (req as any).user as StoredUser;
    const newUsername = (req.body.username || '').trim().toLowerCase();

    if (!/^[a-z0-9_-]{3,30}$/.test(newUsername)) {
      res.status(400).json({
        error: 'L\'identifiant doit comporter entre 3 et 30 caractères alphanumériques ou tirets.',
      });
      return;
    }

    const db = readDB();
    const conflict = db.users.some((u) => u.username === newUsername && u.id !== user.id);
    if (conflict) {
      res.status(409).json({ error: 'Cet identifiant est déjà utilisé par un autre utilisateur.' });
      return;
    }

    const targetUser = db.users.find((u) => u.id === user.id);
    if (targetUser) {
      targetUser.username = newUsername;
      targetUser.updatedAt = new Date().toISOString();
    }

    if (db.portfolios[user.id]) {
      db.portfolios[user.id].user.username = newUsername;
      db.portfolios[user.id].settings.updatedAt = new Date().toISOString();
    }

    writeDB(db);

    res.json({
      message: 'Identifiant public mis à jour avec succès.',
      username: newUsername,
      portfolio: db.portfolios[user.id],
    });
  });

  // -------------------------------------------------------------
  // PORTFOLIO CRUD API (Authenticated)
  // -------------------------------------------------------------

  // Get current user portfolio
  app.get('/api/portfolio', authMiddleware, (req: Request, res: Response) => {
    const userId = (req as any).userId as string;
    const db = readDB();
    const portfolio = db.portfolios[userId] || createEmptyPortfolio(sanitizeUser((req as any).user));
    res.json(portfolio);
  });

  // Save current user portfolio (Persist everything)
  app.put('/api/portfolio', authMiddleware, (req: Request, res: Response) => {
    const userId = (req as any).userId as string;
    const updatedData = req.body as FullPortfolioData;

    if (!updatedData) {
      res.status(400).json({ error: 'Données de portfolio manquantes.' });
      return;
    }

    const db = readDB();
    const currentUser = db.users.find((u) => u.id === userId);
    if (!currentUser) {
      res.status(404).json({ error: 'Utilisateur introuvable.' });
      return;
    }

    // Enforce security: always tie to authenticated user
    updatedData.user = sanitizeUser(currentUser);
    updatedData.settings.updatedAt = new Date().toISOString();

    db.portfolios[userId] = updatedData;
    currentUser.updatedAt = new Date().toISOString();
    writeDB(db);

    res.json({
      message: 'Portfolio enregistré avec succès.',
      portfolio: updatedData,
    });
  });

  // -------------------------------------------------------------
  // PUBLIC PORTFOLIO API (Accessible without login)
  // -------------------------------------------------------------
  app.get('/api/p/:username', optionalAuth, (req: Request, res: Response) => {
    const requestedUsername = (req.params.username || '').toLowerCase();
    const currentUserId = (req as any).userId;

    const db = readDB();
    const targetUser = db.users.find((u) => u.username === requestedUsername);

    if (!targetUser) {
      res.status(404).json({ error: 'Aucun portfolio trouvé pour cet identifiant.' });
      return;
    }

    const portfolio = db.portfolios[targetUser.id];
    if (!portfolio) {
      res.status(404).json({ error: 'Portfolio introuvable.' });
      return;
    }

    const isOwner = currentUserId === targetUser.id;

    // Check if published or owner viewing preview
    if (!portfolio.settings.isPublished && !isOwner) {
      res.status(200).json({
        isPublished: false,
        username: requestedUsername,
        profile: {
          firstName: portfolio.profile.firstName || 'Utilisateur',
          lastName: portfolio.profile.lastName || '',
          professionalTitle: portfolio.profile.professionalTitle || '',
        },
      });
      return;
    }

    // If not owner, track view count and visit timestamp
    if (!isOwner) {
      if (!portfolio.analytics) {
        portfolio.analytics = { viewsCount: 0, cvDownloadsCount: 0, linkClicksCount: 0, recentVisits: [] };
      }
      portfolio.analytics.viewsCount = (portfolio.analytics.viewsCount || 0) + 1;
      portfolio.analytics.lastVisitedAt = new Date().toISOString();
      const visitRecord = {
        timestamp: new Date().toISOString(),
        referrer: (req.get('referrer') || 'Direct').substring(0, 100),
      };
      portfolio.analytics.recentVisits = [visitRecord, ...(portfolio.analytics.recentVisits || [])].slice(0, 30);
      writeDB(db);
    }

    // Return sanitized public portfolio
    res.json({
      isPublished: portfolio.settings.isPublished,
      isOwner,
      portfolio,
    });
  });

  // Track CV Download on public portfolio
  app.post('/api/p/:username/track-download', (req: Request, res: Response) => {
    const requestedUsername = (req.params.username || '').toLowerCase();
    const db = readDB();
    const targetUser = db.users.find((u) => u.username === requestedUsername);
    if (targetUser && db.portfolios[targetUser.id]) {
      const p = db.portfolios[targetUser.id];
      if (!p.analytics) {
        p.analytics = { viewsCount: 0, cvDownloadsCount: 0, linkClicksCount: 0, recentVisits: [] };
      }
      p.analytics.cvDownloadsCount = (p.analytics.cvDownloadsCount || 0) + 1;
      writeDB(db);
    }
    res.json({ success: true });
  });

  // Track Link Click on public portfolio
  app.post('/api/p/:username/track-link-click', (req: Request, res: Response) => {
    const requestedUsername = (req.params.username || '').toLowerCase();
    const db = readDB();
    const targetUser = db.users.find((u) => u.username === requestedUsername);
    if (targetUser && db.portfolios[targetUser.id]) {
      const p = db.portfolios[targetUser.id];
      if (!p.analytics) {
        p.analytics = { viewsCount: 0, cvDownloadsCount: 0, linkClicksCount: 0, recentVisits: [] };
      }
      p.analytics.linkClicksCount = (p.analytics.linkClicksCount || 0) + 1;
      writeDB(db);
    }
    res.json({ success: true });
  });

  // Change Password API (Authenticated)
  app.post('/api/user/change-password', authMiddleware, (req: Request, res: Response) => {
    const user = (req as any).user as StoredUser;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
      return;
    }

    const db = readDB();
    const targetUser = db.users.find((u) => u.id === user.id);
    if (!targetUser) {
      res.status(404).json({ error: 'Utilisateur introuvable.' });
      return;
    }

    // If existing account has passwordHash, verify currentPassword
    if (targetUser.passwordHash) {
      const computedHash = hashPassword(currentPassword || '', targetUser.salt);
      if (computedHash !== targetUser.passwordHash) {
        res.status(401).json({ error: 'Le mot de passe actuel est incorrect.' });
        return;
      }
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    targetUser.salt = newSalt;
    targetUser.passwordHash = hashPassword(newPassword, newSalt);
    targetUser.updatedAt = new Date().toISOString();
    writeDB(db);

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  });

  // Delete Account API (Authenticated)
  app.delete('/api/user/account', authMiddleware, (req: Request, res: Response) => {
    const user = (req as any).user as StoredUser;
    const db = readDB();

    db.users = db.users.filter((u) => u.id !== user.id);
    delete db.portfolios[user.id];
    writeDB(db);

    res.json({ message: 'Votre compte et votre portfolio ont été définitivement supprimés.' });
  });

  // -------------------------------------------------------------
  // VITE / STATIC SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Portfolio Builder Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
