import React, { useContext, useEffect, useState } from 'react';
import { CodeExecutionContext } from '../Context';
import topics from '../assets/tags.svg';
import UserSubmission from './UserSubmission';
import { BookOpen, Award, Code2 } from 'lucide-react';
import { getProblems, getProblemById } from '../api';

const ProblemDesc = () => {
  const [desc, setDesc] = useState(true);
  const [sub, setSub] = useState(false);
  const [sol, setSol] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSolutionLang, setSelectedSolutionLang] = useState('javascript');
  const { data, setData, setprobId, probId, setCurrentProblem, currentProblem } = useContext(CodeExecutionContext);

  const fetchData = async () => {
    try {
      const result = await getProblems();
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
      const result = await getProblemById(probId);
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
        setSol(false);
        break;
      case 2:
        setDesc(false);
        setSub(true);
        setSol(false);
        break;
      case 3:
        setDesc(false);
        setSub(false);
        setSol(true);
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
        <button
          onClick={() => handleClick(3)}
          className={`px-4 py-3 font-semibold transition border-b-2 ${
            sol
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className='flex items-center gap-2'>
            <Code2 size={18} />
            Solutions
          </div>
        </button>
      </div>

      {/* Content */}
      {desc && !sub && !sol ? (
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
      ) : sub && !desc && !sol ? (
        <div className='p-6'>
          <UserSubmission />
        </div>
      ) : sol && !desc && !sub ? (
        <div className='p-6 max-h-screen overflow-y-auto'>
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-bold text-white mb-4'>Solutions</h2>
              <p className='text-slate-400 mb-4'>View solutions in different programming languages:</p>
            </div>

            {/* Language Selector */}
            <div className='flex gap-2 flex-wrap'>
              {currentProblem?.solution_skeleton ? Object.keys(currentProblem.solution_skeleton).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedSolutionLang(lang)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedSolutionLang === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              )) : null}
            </div>

            {/* Solution Code */}
            {currentProblem?.solution_skeleton?.[selectedSolutionLang] ? (
              <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-4'>
                <div className='bg-slate-800/50 rounded p-4 text-slate-200 font-mono text-sm overflow-x-auto'>
                  <pre>{currentProblem.solution_skeleton[selectedSolutionLang]}</pre>
                </div>
              </div>
            ) : (
              <div className='bg-slate-800/30 border border-slate-700 rounded-lg p-4 text-slate-400'>
                No solution available for this language
              </div>
            )}

            {/* Alternative Solutions Info */}
            <div className='bg-blue-900/20 border border-blue-700 rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-blue-300 mb-2'>💡 Tips</h3>
              <ul className='text-slate-300 space-y-2 list-disc list-inside'>
                <li>Try to solve this problem on your own first</li>
                <li>Use hints if you're stuck</li>
                <li>Compare your solution with the optimal solution</li>
                <li>Understand the time and space complexity</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProblemDesc;
