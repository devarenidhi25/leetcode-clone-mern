import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { getProblems, getAllTags, getRecommendedProblems } from '../api';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const ProblemsPage = ({ onSelectProblem }) => {
  const { Authuser } = useAuthContext();
  const [problems, setProblems] = useState([]);
  const [recommendedProblems, setRecommendedProblems] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tags: [],
    search: '',
  });

  const [showRecommended, setShowRecommended] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allTags = await getAllTags();
        setTags(allTags);

        const data = await getProblems({
          ...filters,
          userId: Authuser?._id,
          tags: filters.tags.length > 0 ? filters.tags : undefined,
          difficulty: filters.difficulty !== 'all' ? filters.difficulty : undefined,
        });
        setProblems(data);

        if (Authuser && showRecommended) {
          try {
            const recommended = await getRecommendedProblems();
            setRecommendedProblems(recommended.recommendedProblems || []);
          } catch (err) {
            console.log('No recommendations yet');
          }
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
        toast.error('Failed to fetch problems');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, Authuser, showRecommended]);

  const handleDifficultyChange = (difficulty) => {
    setFilters({ ...filters, difficulty });
  };

  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ difficulty: 'all', tags: [], search: '' });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>Coding Problems</h1>
          <p className='text-slate-400'>Master coding with our curated problem set</p>
        </div>

        {/* Search Bar */}
        <div className='mb-6'>
          <div className='flex items-center bg-slate-700/50 rounded-lg px-4 py-3 border border-slate-600'>
            <Search size={20} className='text-slate-400 mr-2' />
            <input
              type='text'
              placeholder='Search problems...'
              value={filters.search}
              onChange={handleSearchChange}
              className='bg-transparent w-full text-white placeholder-slate-500 outline-none'
            />
          </div>
        </div>

        {/* Filters */}
        <div className='bg-slate-700/50 rounded-lg p-4 mb-6 border border-slate-600'>
          <div className='flex items-center gap-2 mb-4'>
            <Filter size={18} className='text-slate-300' />
            <h2 className='text-white font-semibold'>Filters</h2>
            {(filters.difficulty !== 'all' || filters.tags.length > 0 || filters.search) && (
              <button
                onClick={resetFilters}
                className='ml-auto text-sm text-blue-400 hover:text-blue-300 underline'
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className='mb-4'>
            <p className='text-slate-300 text-sm mb-2'>Difficulty</p>
            <div className='flex gap-2'>
              {['all', 'easy', 'medium', 'hard'].map(diff => (
                <button
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filters.difficulty === diff
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <p className='text-slate-300 text-sm mb-2'>Tags</p>
            <div className='flex flex-wrap gap-2'>
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    filters.tags.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className='grid gap-4'>
          {/* Recommended Section */}
          {showRecommended && recommendedProblems.length > 0 && (
            <div>
              <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
                <span className='text-2xl'>⭐</span> Recommended For You
              </h2>
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 pb-8 border-b border-slate-600'>
                {recommendedProblems.map(problem => (
                  <div
                    key={problem._id}
                    onClick={() => onSelectProblem(problem._id)}
                    className='bg-slate-700/50 border border-slate-600 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition transform hover:scale-105'
                  >
                    <h3 className='text-white font-semibold mb-2'>{problem.problem_name}</h3>
                    <div className='flex items-center justify-between'>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.category)}`}>
                        {problem.category.charAt(0).toUpperCase() + problem.category.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowRecommended(false)}
                className='text-slate-400 text-sm hover:text-slate-300 mb-6'
              >
                Hide Recommended
              </button>
            </div>
          )}

          {/* All Problems */}
          <div>
            <h2 className='text-xl font-bold text-white mb-4'>All Problems</h2>
            {loading ? (
              <div className='text-center text-slate-400 py-8'>Loading problems...</div>
            ) : problems.length === 0 ? (
              <div className='text-center text-slate-400 py-8'>No problems found. Try adjusting your filters.</div>
            ) : (
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {problems.map(problem => (
                  <div
                    key={problem._id}
                    onClick={() => onSelectProblem(problem._id)}
                    className='bg-slate-700/50 border border-slate-600 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition'
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <h3 className='text-white font-semibold flex-1'>{problem.problem_name}</h3>
                      {problem.isSolved && <span className='text-green-400 text-xl ml-2'>✓</span>}
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.category)}`}>
                        {problem.category.charAt(0).toUpperCase() + problem.category.slice(1)}
                      </span>
                    </div>
                    {problem.tags && problem.tags.length > 0 && (
                      <div className='flex flex-wrap gap-1 mt-3'>
                        {problem.tags.slice(0, 2).map(tag => (
                          <span key={tag} className='text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded'>
                            {tag}
                          </span>
                        ))}
                        {problem.tags.length > 2 && (
                          <span className='text-xs text-slate-400'>+{problem.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
