import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext';
import { CodeExecutionContext } from '../Context';
import { ArrowLeft, Trophy, Zap, TrendingUp } from 'lucide-react';

const UserStat = () => {
  const [loading, setLoading] = useState(true);
  const { data, setData } = useContext(CodeExecutionContext);
  const [solvedStatus, setSolvedStatus] = useState({});
  const [solvedCount, setSolvedCount] = useState(0);
  const [AllCount, setAllCount] = useState(0);
  const [solvedCountsByDifficulty, setSolvedCountsByDifficulty] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const fetchAllProblemsSolvedCount = async () => {
    try {
      const res = await fetch(`https://coding-engine-trial.onrender.com/api/submit/${Authuser._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const result = await res.json();
      setAllCount(result.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchData = async () => {
    try {
      const res = await fetch('https://coding-engine-trial.onrender.com/api/problems/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      setData(result);

      let easySolvedCount = 0, easy = 0, hard = 0;
      let mediumSolvedCount = 0, medium = 0;
      let hardSolvedCount = 0;

      const statusPromises = result.map(async problem => {
        const isSolved = await fetchData_solved(problem._id);
        if (isSolved) {
          if (problem.category === 'easy') {
            easySolvedCount++;
            easy++;
          } else if (problem.category === 'medium') {
            mediumSolvedCount++;
            medium++;
          } else if (problem.category === 'hard') {
            hardSolvedCount++;
            hard++;
          }
        } else {
          if (problem.category === 'easy') {
            easy++;
          } else if (problem.category === 'medium') {
            medium++;
          } else if (problem.category === 'hard') {
            hard++;
          }
        }
        return { id: problem._id, isSolved };
      });

      const statusResults = await Promise.all(statusPromises);
      const statusMap = statusResults.reduce((acc, { id, isSolved }) => {
        acc[id] = isSolved;
        return acc;
      }, {});
      const solvedCount = statusResults.filter(({ isSolved }) => isSolved).length;

      setSolvedStatus(statusMap);
      setSolvedCount(solvedCount);
      setSolvedCountsByDifficulty({
        easy: easySolvedCount,
        medium: mediumSolvedCount,
        hard: hardSolvedCount,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchData_solved = async (prob) => {
    try {
      const res = await fetch(`https://coding-engine-trial.onrender.com/api/submit/${Authuser._id}/${prob}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      const hasSuccess = result.some(item => item.result.status === "success");
      return hasSuccess;
    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllProblemsSolvedCount();
  }, [])

  const { Authuser } = useAuthContext();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Animated background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob'></div>
        <div className='absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000'></div>
      </div>

      <div className='relative z-10 max-w-4xl mx-auto px-6 py-8'>
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className='flex items-center gap-2 text-slate-400 hover:text-slate-200 transition mb-8 group'
        >
          <ArrowLeft size={20} className='group-hover:-translate-x-1 transition' />
          Back to Editor
        </button>

        {/* Header */}
        <div className='mb-12'>
          <h1 className='gradient-text text-5xl font-bold mb-2'>Your Profile</h1>
          <p className='text-slate-400'>Track your progress and achievements</p>
        </div>

        {/* Profile Card */}
        <div className='backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl p-8 mb-8'>
          <div className='flex items-center gap-6 mb-8'>
            {Authuser?.profilePic && (
              <img
                src={Authuser.profilePic}
                alt={Authuser.username}
                className='w-24 h-24 rounded-full border-2 border-blue-500'
              />
            )}
            <div>
              <h2 className='text-3xl font-bold text-white mb-2'>{Authuser?.username}</h2>
              <p className='text-slate-400'>{Authuser?.email}</p>
              <p className='text-slate-400 capitalize'>{Authuser?.gender}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid md:grid-cols-2 gap-6 mb-8'>
          {/* Total Stats Card */}
          <div className='backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl p-8'>
            <div className='flex items-center gap-4 mb-6'>
              <Trophy className='text-yellow-400' size={32} />
              <h3 className='text-2xl font-bold text-white'>Overall Progress</h3>
            </div>
            {loading ? (
              <p className='text-slate-400'>Calculating your stats...</p>
            ) : (
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-300'>Problems Solved</span>
                  <span className='text-2xl font-bold gradient-text'>{solvedCount}/7</span>
                </div>
                <div className='w-full bg-slate-700 rounded-full h-2'>
                  <div
                    className='bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all'
                    style={{ width: `${(solvedCount / 7) * 100}%` }}
                  ></div>
                </div>
                <p className='text-slate-400 text-sm'>{Math.round((solvedCount / 7) * 100)}% Complete</p>
              </div>
            )}
          </div>

          {/* Submissions Card */}
          <div className='backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl p-8'>
            <div className='flex items-center gap-4 mb-6'>
              <Zap className='text-orange-400' size={32} />
              <h3 className='text-2xl font-bold text-white'>Activity</h3>
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-slate-300'>Total Submissions</span>
                <span className='text-2xl font-bold gradient-text'>{AllCount}</span>
              </div>
              <div className='text-slate-400 text-sm'>Keep coding to build your streak!</div>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className='backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl p-8'>
          <div className='flex items-center gap-4 mb-6'>
            <TrendingUp className='text-green-400' size={32} />
            <h3 className='text-2xl font-bold text-white'>Difficulty Breakdown</h3>
          </div>

          {loading ? (
            <p className='text-slate-400'>Loading difficulty stats...</p>
          ) : (
            <div className='grid md:grid-cols-3 gap-6'>
              {/* Easy */}
              <div className='bg-green-900/20 border border-green-700/30 rounded-lg p-6'>
                <h4 className='text-lg font-semibold text-green-400 mb-3'>Easy</h4>
                <div className='text-3xl font-bold text-white mb-2'>
                  {solvedCountsByDifficulty.easy}
                </div>
                <div className='text-sm text-slate-400'>problems solved</div>
              </div>

              {/* Medium */}
              <div className='bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-6'>
                <h4 className='text-lg font-semibold text-yellow-400 mb-3'>Medium</h4>
                <div className='text-3xl font-bold text-white mb-2'>
                  {solvedCountsByDifficulty.medium}
                </div>
                <div className='text-sm text-slate-400'>problems solved</div>
              </div>

              {/* Hard */}
              <div className='bg-red-900/20 border border-red-700/30 rounded-lg p-6'>
                <h4 className='text-lg font-semibold text-red-400 mb-3'>Hard</h4>
                <div className='text-3xl font-bold text-white mb-2'>
                  {solvedCountsByDifficulty.hard}
                </div>
                <div className='text-sm text-slate-400'>problems solved</div>
              </div>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <div className='mt-12 backdrop-blur-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center'>
          <p className='text-xl font-semibold text-slate-100 mb-2'>
            🎉 Keep Coding, Keep Growing!
          </p>
          <p className='text-slate-400'>Every problem solved makes you a better programmer. Push your limits!</p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  )
}

export default UserStat
