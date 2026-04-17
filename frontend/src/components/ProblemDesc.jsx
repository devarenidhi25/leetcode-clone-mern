import React, { useContext, useEffect, useState } from 'react';
import { CodeExecutionContext } from '../Context';
import topics from '../assets/tags.svg';
import UserSubmission from './UserSubmission';
import { BookOpen, Award } from 'lucide-react';

const ProblemDesc = () => {
  const [desc, setDesc] = useState(true);
  const [sub, setSub] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data, setData, setprobId, probId, setCurrentProblem, currentProblem } = useContext(CodeExecutionContext);

  const fetchData = async () => {
    try {
      const res = await fetch('https://coding-engine-trial.onrender.com/api/problems/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      setCurrentProblem(result[0]);
      setprobId(result[0]._id);
      setData(result)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchData1 = async (probId) => {
    try {
      const res = await fetch(`https://coding-engine-trial.onrender.com/api/problems/${probId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      setCurrentProblem(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    initializeData();
  }, []);

  useEffect(() => {
    fetchData1(probId);
  }, [probId])

  const handleClick = (num) => {
    switch (num) {
      case 1:
        setDesc(true);
        setSub(false);
        break;
      case 2:
        setDesc(false);
        setSub(true);
        break;
      default:
        break;
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'easy':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'hard':
        return 'bg-red-900/30 text-red-400 border-red-700';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className='flex gap-4 border-b border-slate-700 sticky top-0 bg-slate-800/50 backdrop-blur-sm'>
        <button
          onClick={() => handleClick(1)}
          className={`px-4 py-3 font-semibold transition border-b-2 ${
            desc
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className='flex items-center gap-2'>
            <BookOpen size={18} />
            Description
          </div>
        </button>
        <button
          onClick={() => handleClick(2)}
          className={`px-4 py-3 font-semibold transition border-b-2 ${
            sub
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className='flex items-center gap-2'>
            <Award size={18} />
            Submissions
          </div>
        </button>
      </div>

      {/* Content */}
      {desc && !sub ? (
        <div className='p-6 max-h-screen overflow-y-auto'>
          <div className='space-y-6'>
            {loading || !currentProblem ? (
              <div className='flex items-center justify-center py-12'>
                <p className='text-slate-400'>Loading problem...</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {/* Problem Title and Difficulty */}
                <div>
                  <h1 className='text-3xl font-bold text-white mb-4'>
                    {currentProblem?.problem_name}
                  </h1>
                  <div className={`inline-block px-4 py-2 rounded-lg border font-semibold ${getCategoryColor(currentProblem?.category)}`}>
                    {currentProblem?.category}
                  </div>
                </div>

                {/* Description */}
                <div className='bg-slate-800/30 border border-slate-700 rounded-lg p-4'>
                  <h2 className='text-lg font-semibold text-slate-200 mb-3'>Problem Description</h2>
                  <div className='text-slate-300 space-y-3 prose prose-invert max-w-none'>
                    <div dangerouslySetInnerHTML={{ __html: currentProblem?.problem_desc }} />
                  </div>
                </div>

                {/* Examples */}
                <div className='bg-slate-800/30 border border-slate-700 rounded-lg p-4'>
                  <h2 className='text-lg font-semibold text-slate-200 mb-3'>Examples</h2>
                  <div className='text-slate-300 prose prose-invert max-w-none'>
                    <div dangerouslySetInnerHTML={{ __html: currentProblem?.problem_examples }} />
                  </div>
                </div>

                {/* Constraints */}
                <div className='bg-slate-800/30 border border-slate-700 rounded-lg p-4'>
                  <h2 className='text-lg font-semibold text-slate-200 mb-3'>Constraints</h2>
                  <div className='text-slate-300 prose prose-invert max-w-none'>
                    <div dangerouslySetInnerHTML={{ __html: currentProblem?.constraints }} />
                  </div>
                </div>

                {/* Tags */}
                <div className='bg-slate-800/30 border border-slate-700 rounded-lg p-4'>
                  <h2 className='text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2'>
                    <Award size={18} /> Topics
                  </h2>
                  <div className='text-slate-300 prose prose-invert max-w-none'>
                    <div dangerouslySetInnerHTML={{ __html: currentProblem?.tags }} />
                  </div>
                </div>

                {/* Hints */}
                <div className='bg-slate-800/30 border border-slate-700 rounded-lg p-4'>
                  <h2 className='text-lg font-semibold text-slate-200 mb-3'>Hints</h2>
                  <div className='text-slate-300 prose prose-invert max-w-none'>
                    <div dangerouslySetInnerHTML={{ __html: currentProblem?.hints?.length > 0 ? currentProblem?.hints : 'No hints available' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='p-6'>
          <UserSubmission />
        </div>
      )}
    </>
  );
};

export default ProblemDesc;
