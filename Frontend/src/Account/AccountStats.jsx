import { useEffect, useState } from 'react';

import { apiFetch } from '../Api/api';
import { useAuth } from '../Hooks/useAuth';
import { CardContainer, ListContainer } from '../Components/Containers';

export function AccountStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function loadStats() {
      try {
        const data = await apiFetch('/api/statistics');
        console.log(data);
        if (!cancelled) setStats(data);
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

  if (loading) {
    return <div className="page">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="page">Erreur: {error}</div>;
  }

  if (!stats) {
    return <div className="page">Statistiques introuvables</div>;
  }

  const totalPlayed = stats.custom.reduce((sum, item) => sum + item.played, 0);
  const averagePercent = stats.custom.length > 0 
    ? stats.custom.reduce((sum, item) => sum + item.averagePercent, 0) / stats.custom.length
    : 0;

  const categoryStats = stats.custom.reduce((acc, item) => {
    const existing = acc.find(c => c.category === item.category);
    if (existing) {
      existing.played += item.played;
      existing.totalPercent += item.averagePercent;
      existing.count += 1;
    } else {
      acc.push({
        category: item.category,
        played: item.played,
        totalPercent: item.averagePercent,
        count: 1,
        averagePercent: item.averagePercent
      });
    }
    return acc;
  }, []);

  categoryStats.sort((a, b) => b.played - a.played);

  const difficultyStats = stats.custom.reduce((acc, item) => {
    const difficulty = item.difficulty || 'Non défini';
    if (!acc[difficulty]) {
      acc[difficulty] = { played: 0, totalPercent: 0, count: 0 };
    }
    acc[difficulty].played += item.played;
    acc[difficulty].totalPercent += item.averagePercent;
    acc[difficulty].count += 1;
    return acc;
  }, {});

  Object.keys(difficultyStats).forEach(diff => {
    difficultyStats[diff].averagePercent = 
      difficultyStats[diff].totalPercent / difficultyStats[diff].count;
  });

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 0:
        return 'Aleatoire';
      case 1:
        return 'Facile';
      case 2:
        return 'Normal';
      case 3:
        return 'Difficile';
      default:
        return 'Aleatoire';
    }
  };

  const getStars = (percentage) => {
    const starCount = Math.round(percentage / 20);
    return '⭐'.repeat(starCount) + '☆'.repeat(5 - starCount);
  };

  return (
    <div className='w-full flex h-full justify-between gap-4 flex-col'>      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardContainer>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Quizs Joués</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalPlayed}</p>
        </CardContainer>
        <CardContainer>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Réussite</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{Math.round(averagePercent)}%</p>
        </CardContainer>
      </div>

      <div className='h-full bg-blue-950 p-2'>
        <ListContainer>
          {categoryStats.map((category, index) => (
            <div key={index} className="w-full border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
              <div className="flex justify-between mb-1 " >
                <span className="font-medium text-gray-300 dark:text-gray-300">{category.category}</span>
                <span className="text-sm text-gray-300 dark:text-gray-300">Moyenne: {Math.round(category.averagePercent)}% ({category.played} quizs)</span>
              </div>
              <div className="flex items-center">
                {/* <span className="text-xl mr-2">{getStars(category.averagePercent)}</span> */}
              </div>
            </div>
          ))}
        </ListContainer>
      </div>

      <CardContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {Object.entries(difficultyStats).map(([difficulty, stats]) => (
            <div key={difficulty} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{getDifficultyText(parseInt(difficulty))}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Quizs : {stats.played}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Moy. : {Math.round(stats.averagePercent)}%</p>
              <div className="flex items-center">
                <span className="text-xl mr-2">{getStars(stats.averagePercent)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContainer>
    </div>
  );
}
