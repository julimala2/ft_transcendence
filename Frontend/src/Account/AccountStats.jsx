import { useEffect, useMemo, useState } from 'react';

import { motion } from 'motion/react';

import { apiFetch } from '../Api/api';
import { getAllCategories } from '../Api/quiz';
import { StyledDiv } from '../Components/Containers';
import { useAuth } from '../Hooks/useAuth';

const TABS = [
  { id: 'offline', label: 'Hors ligne' },
  { id: 'online', label: 'En ligne' },
];

const svgProps = {
  className: 'w-7 h-7',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const ICONS = {
  played: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  success: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  trophy: (
    <svg {...svgProps}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 5H4v1a3 3 0 0 0 3 3" />
      <path d="M17 5h3v1a3 3 0 0 1-3 3" />
    </svg>
  ),
};

function StatCard({ icon, label, value, sub, bar, valueClass = 'text-4xl md:text-5xl', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex-1 min-w-0"
    >
      <StyledDiv className="items-center gap-2 p-6 h-full">
        <span className="text-amber-400">{icon}</span>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center">
          {label}
        </p>
        <p
          className={`font-[Slackey] ${valueClass} text-center break-words bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0px_0px_10px_rgba(234,179,8,0.4)]`}
        >
          {value}
        </p>
        {typeof bar === 'number' && (
          <div className="w-full h-3 rounded-full bg-slate-800 border border-slate-600 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400 shadow-[0px_0px_8px_2px_rgba(234,179,8,0.5)]"
              style={{ width: `${bar}%` }}
            />
          </div>
        )}
        {sub && <p className="text-sm text-gray-400 text-center">{sub}</p>}
      </StyledDiv>
    </motion.div>
  );
}

function StatsRow({ played, success, bestCategory, bestCategoryPlayed, labels }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full items-stretch">
      <StatCard icon={ICONS.played} label={labels.played} value={played} delay={0} />
      <StatCard
        icon={ICONS.success}
        label={labels.success}
        value={success !== null && success !== undefined ? `${success}%` : '—'}
        bar={typeof success === 'number' ? success : undefined}
        delay={0.08}
      />
      <StatCard
        icon={ICONS.trophy}
        label={labels.best}
        value={bestCategory || '—'}
        valueClass="text-2xl md:text-3xl"
        sub={bestCategory ? `${bestCategoryPlayed} quizs joués` : undefined}
        delay={0.16}
      />
    </div>
  );
}

export function AccountStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('offline');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function loadStats() {
      try {
        const [data, cats] = await Promise.all([
          apiFetch('/api/statistics'),
          getAllCategories(),
        ]);
        if (!cancelled) {
          setStats(data);
          setCategories(cats || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.error || 'Failed to load stats');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadStats();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const offline = useMemo(() => {
    if (!stats) return null;
    const rush = stats.rush || [];
    const custom = stats.custom || [];
    const rows = [...rush, ...custom];

    const played = rows.reduce((sum, r) => sum + (r.played || 0), 0);

    const customPlayed = custom.reduce((sum, r) => sum + (r.played || 0), 0);
    const success =
      customPlayed > 0
        ? Math.round(
            custom.reduce((sum, r) => sum + (r.averagePercent || 0) * (r.played || 0), 0) /
              customPlayed
          )
        : null;

    const byCategory = {};
    for (const r of rows) {
      if (r.categoryId === null || r.categoryId === undefined) continue;
      byCategory[r.categoryId] = (byCategory[r.categoryId] || 0) + (r.played || 0);
    }
    const best = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const bestCategory = best
      ? categories.find(c => c.id === best[0])?.name || `Catégorie #${best[0]}`
      : null;

    return { played, success, bestCategory, bestCategoryPlayed: best ? best[1] : 0 };
  }, [stats, categories]);

  // Pas encore exposé par l'API : on branche stats.online quand il existera
  const online = stats?.online ?? null;

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <StyledDiv className="items-center gap-4 p-10">
          <svg className="w-10 h-10 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          <p className="font-bold text-xl text-amber-200 animate-pulse">Chargement des statistiques...</p>
        </StyledDiv>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="font-bold text-red-400 bg-red-950/60 border-2 border-red-500 rounded-md p-3 shadow-[0px_0px_10px_2px_rgba(239,68,68,0.35)]">
          Erreur : {error}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 flex-1 min-h-0 w-full overflow-y-auto p-2">
      <h1 className="font-[Slackey] text-3xl md:text-4xl text-center bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0px_0px_12px_rgba(234,179,8,0.45)]">
        Statistiques
      </h1>

      <div className="self-center p-1 rounded-md bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 shadow-[0px_0px_10px_2px_rgba(234,179,8,0.5)] flex gap-1 w-full max-w-md">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 px-4 rounded-sm font-bold text-lg transition-all ${
              tab === t.id
                ? 'bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 text-blue-900 border-2 border-amber-300 shadow-[0px_0px_12px_3px_rgba(234,179,8,0.5)]'
                : 'bg-gradient-to-br from-blue-900 via-blue-950 to-blue-800 text-white border-2 border-slate-700 hover:border-amber-400/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'offline' ? (
        <motion.div
          key="offline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4 w-full"
        >
          <StatsRow
            played={offline?.played ?? 0}
            success={offline?.success ?? null}
            bestCategory={offline?.bestCategory ?? null}
            bestCategoryPlayed={offline?.bestCategoryPlayed ?? 0}
            labels={{ played: 'Quizs joués', success: 'Taux de réussite', best: 'Meilleure catégorie' }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="online"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4 w-full"
        >
          {online ? (
            <StatsRow
              played={online.played ?? 0}
              success={online.success ?? null}
              bestCategory={online.bestCategory ?? null}
              bestCategoryPlayed={online.bestCategoryPlayed ?? 0}
              labels={{ played: 'Duels joués', success: 'Taux de victoire', best: 'Meilleure catégorie' }}
            />
          ) : (
            <>
              <StatsRow
                played="—"
                success={null}
                bestCategory={null}
                bestCategoryPlayed={0}
                labels={{ played: 'Duels joués', success: 'Taux de victoire', best: 'Meilleure catégorie' }}
              />
              <StyledDiv className="items-center p-5">
                <p className="text-gray-300 text-center">
                  Implementer les stats online dans la backend lol
                </p>
              </StyledDiv>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
