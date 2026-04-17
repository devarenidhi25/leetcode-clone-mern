import React, { useState, useContext, useEffect } from 'react';
import { CodeExecutionContext } from '../Context';
import { CheckCircle2, XCircle } from 'lucide-react';

const TestSpace = () => {
  const [case1, setCase1] = useState(true);
  const [case2, setCase2] = useState(false);
  const [case3, setCase3] = useState(false);
  const [loading, setLoading] = useState(true);

  const { language, code, Output, setOutput, data, setData,
    currentProblem, setCurrentProblem, ResArr, setResArr
  } = useContext(CodeExecutionContext);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  const handleButtonClick = (caseNumber) => {
    switch (caseNumber) {
      case 1:
        setCase1(true);
        setCase2(false);
        setCase3(false);
        break;
      case 2:
        setCase1(false);
        setCase2(true);
        setCase3(false);
        break;
      case 3:
        setCase1(false);
        setCase2(false);
        setCase3(true);
        break;
      default:
        break;
    }
  };

  const sampleTestCase = (caseNumber) => {
    if (currentProblem && currentProblem.testcases && currentProblem.testcases.sample) {
      const testCase = currentProblem.testcases.sample[caseNumber - 1];
      return testCase ? `Input: ${testCase.input} | Expected Output: ${testCase.output}` : 'No input data';
    }
    return 'No input data';
  };

  if (loading) {
    return <div className='text-slate-300 p-4'>Loading test cases...</div>;
  }

  return (
    <div className='overflow-y-auto w-full'>
      {/* Test Case Buttons */}
      <div className='flex gap-2 p-4 border-b border-slate-700 sticky top-0 bg-slate-800/50 backdrop-blur-sm'>
        {[1, 2, 3].map((testNum) => (
          <button
            key={testNum}
            onClick={() => handleButtonClick(testNum)}
            className={`px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105 ${
              (testNum === 1 && case1) || (testNum === 2 && case2) || (testNum === 3 && case3)
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Test Case {testNum}
          </button>
        ))}
      </div>

      {/* Test Case Output */}
      <div className='p-4 space-y-4'>
        {(case1 && !case2 && !case3) && (
          <div className='space-y-3'>
            <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-4'>
              <p className='text-xs font-semibold text-slate-400 mb-2 uppercase'>Input 1</p>
              <div className='bg-slate-800/50 rounded p-3 text-slate-200 font-mono text-sm'>
                {sampleTestCase(1)}
              </div>
            </div>
            <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-4'>
              <p className='text-xs font-semibold text-slate-400 mb-2 uppercase'>Output</p>
              <div className='bg-slate-800/50 rounded p-3 text-slate-200 font-mono text-sm min-h-12 flex items-center'>
                {ResArr[0] ? (
                  <span className='flex items-center gap-2'>
                    <CheckCircle2 size={16} className='text-green-400' />
                    {ResArr[0]}
                  </span>
                ) : (
                  <span className='text-slate-400'>No output yet</span>
                )}
              </div>
            </div>
          </div>
        )}

        {(case2 && !case1 && !case3) && (
          <div className='space-y-3'>
            <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-4'>
              <p className='text-xs font-semibold text-slate-400 mb-2 uppercase'>Input 2</p>
              <div className='bg-slate-800/50 rounded p-3 text-slate-200 font-mono text-sm'>
                {sampleTestCase(2)}
              </div>
            </div>
            <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-4'>
              <p className='text-xs font-semibold text-slate-400 mb-2 uppercase'>Output</p>
              <div className='bg-slate-800/50 rounded p-3 text-slate-200 font-mono text-sm min-h-12 flex items-center'>
                {ResArr[1] ? (
                  <span className='flex items-center gap-2'>
                    <CheckCircle2 size={16} className='text-green-400' />
                    {ResArr[1]}
                  </span>
                ) : (
                  <span className='text-slate-400'>No output yet</span>
                )}
              </div>
            </div>
          </div>
        )}

        {(case3 && !case1 && !case2) && (
          <div className='space-y-3'>
            <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-4'>
              <p className='text-xs font-semibold text-slate-400 mb-2 uppercase'>Input 3</p>
              <div className='bg-slate-800/50 rounded p-3 text-slate-200 font-mono text-sm'>
                {sampleTestCase(3)}
              </div>
            </div>
            <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-4'>
              <p className='text-xs font-semibold text-slate-400 mb-2 uppercase'>Output</p>
              <div className='bg-slate-800/50 rounded p-3 text-slate-200 font-mono text-sm min-h-12 flex items-center'>
                <span className='text-slate-400'>Run code to see output</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSpace;
