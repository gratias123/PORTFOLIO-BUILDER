import React, { useEffect, useState } from 'react';
import { FullPortfolioData } from '../../types/portfolio';
import { api } from '../../services/api';
import { TemplateEngine } from '../templates/TemplateEngine';
import { CVView } from '../cv/CVView';
import { EyeOff, AlertCircle, FileText, ArrowLeft, Loader2, Share2, Check, QrCode, Linkedin, Twitter, MessageCircle, X } from 'lucide-react';
import { copyToClipboard, generateQrCodeDataUrl } from '../../utils/helpers';

interface PublicPortfolioPageProps {
  username: string;
  onNavigateHome?: () => void;
}

export const PublicPortfolioPage: React.FC<PublicPortfolioPageProps> = ({ username, onNavigateHome }) => {
  const [data, setData] = useState<FullPortfolioData | null>(null);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCV, setShowCV] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getPublicPortfolio(username);
        if (!mounted) return;
        setIsPublished(res.isPublished);
        setIsOwner(!!res.isOwner);
        if (res.portfolio) {
          setData(res.portfolio);
          // Set dynamic page title
          const name = [res.portfolio.profile.firstName, res.portfolio.profile.lastName].filter(Boolean).join(' ');
          const title = res.portfolio.profile.professionalTitle;
          document.title = `${name || username} ${title ? `— ${title}` : ''} | Portfolio Builder`;

          // Generate QR code for sharing
          generateQrCodeDataUrl(window.location.href).then((url) => {
            if (mounted) setQrCodeUrl(url);
          });
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Impossible de charger ce portfolio.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();

    return () => {
      mounted = false;
      document.title = 'Portfolio Builder — Générateur de portfolios professionnels';
    };
  }, [username]);

  const handleShare = async () => {
    setShareModalOpen(true);
  };

  const handleToggleCV = () => {
    const nextState = !showCV;
    setShowCV(nextState);
    if (nextState) {
      api.trackCvDownload(username);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Chargement du portfolio de @{username}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Portfolio introuvable</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <div className="pt-2">
            <button
              onClick={() => onNavigateHome ? onNavigateHome() : (window.location.hash = '#/')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isPublished && !isOwner) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <EyeOff className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Portfolio en préparation</h2>
          <p className="text-sm text-slate-600">
            Ce portfolio est actuellement en cours de finalisation par son auteur. Revenez très bientôt pour le découvrir !
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigateHome ? onNavigateHome() : (window.location.hash = '#/')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Créer mon propre portfolio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="relative min-h-screen">
      {/* Floating Action Top Bar for Public Visitors */}
      <div className="no-print sticky top-3 z-40 max-w-xl mx-auto px-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-200 shadow-lg flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="truncate max-w-[150px]">@{username}</span>
            {isOwner && !isPublished && (
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Brouillon (visible par vous)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleCV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>{showCV ? 'Voir Portfolio' : 'Voir CV (A4)'}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Partager ce portfolio"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Either CV mode or Portfolio Template Engine */}
      {showCV ? (
        <div className="pt-16 pb-12 max-w-5xl mx-auto px-4">
          <CVView data={data} onBack={() => setShowCV(false)} />
        </div>
      ) : (
        <TemplateEngine data={data} />
      )}

      {/* Share Modal for Visitors */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Partager ce portfolio</h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="flex flex-col items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img src={qrCodeUrl} alt="QR Code" className="w-36 h-36" />
                <span className="text-[10px] text-slate-400 mt-1 font-mono">Scannez pour ouvrir sur mobile</span>
              </div>
            )}

            {/* Direct copy */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono truncate"
              />
              <button
                onClick={async () => {
                  const ok = await copyToClipboard(window.location.href);
                  if (ok) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>

            {/* Social icons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0A66C2] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Portfolio de @${username} : ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 transition-colors"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Découvrez ce portfolio : ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#25D366] transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
