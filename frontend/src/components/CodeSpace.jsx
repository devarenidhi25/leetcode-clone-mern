import { Box } from '@chakra-ui/react'
import { Editor } from '@monaco-editor/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import LanguageSelector from './LanguageSelector.jsx';
import { CODE_SNIPPETS } from '../constant.js';
import { CodeExecutionContext } from '../Context.jsx';
import { getProblemById, submitCode } from '../api.js';
import { useAuthContext } from '../context/AuthContext';
import { useTestCaseRunner } from '../tester';
import { Play, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CodeSpace = () => {
  const [def, setdef] = useState('javascript');
  const { language, setLanguage, code, setCode, setOutput,
    currentProblem, setCurrentProblem, editorRef, data, setData, probId } = useContext(CodeExecutionContext);
  const { Authuser } = useAuthContext();
  const { run_sample_testcases, run_all_testcases, load, load1 } = useTestCaseRunner();
  const [submitting, setSubmitting] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  }

  const fetchData1 = async (probId, language) => {
    try {
      const result = await getProblemById(probId);
      setCode(result.solution_skeleton[language]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onSelect = (l) => {
    setLanguage(l);
    setCode(currentProblem.solution_skeleton[l]);
  }

  const handleRunCode = async () => {
    await run_sample_testcases(code, language);
  };

  const handleSubmitCode = async () => {
    if (!Authuser) {
      toast.error('Please login to submit code');
      return;
    }

    setSubmitting(true);
    try {
      const result = await run_all_testcases(code, language);
      
      // If all tests pass, submit to database
      if (result && result.allPassed) {
        const submitResult = await submitCode(
          Authuser._id,
          probId,
          code,
          language,
          result
        );
        toast.success('Code submitted successfully!');
      } else {
        toast.error('Some test cases failed. Please fix your code.');
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      toast.error('Failed to submit code');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProblemDetails = async () => {
      await fetchData1(probId, language);
    };

    if (probId) {
      fetchProblemDetails();
    }
  }, [probId, language]);

  return (
    <Box className='h-[300px]'>
      <Box w={'100%'}>
        <div className='flex items-center justify-between mb-2'>
          <LanguageSelector Language={language} onSelect={onSelect} />
          <div className='flex gap-2'>
            <button
              onClick={handleRunCode}
              disabled={load1}
              className='flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50'
            >
              <Play size={18} />
              <span>Run Code</span>
            </button>
            <button
              onClick={handleSubmitCode}
              disabled={load || submitting}
              className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50'
            >
              <Send size={18} />
              <span>{submitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </div>
        <Editor
          height="44vh"
          className='border border-slate-700 mt-2 rounded-lg overflow-hidden'
          language={language}
          defaultValue={code}
          value={code}
          onChange={(newcode) => { setCode(newcode) }}
          onMount={onMount}
          theme='vs-dark'
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Monaco, Courier New',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </Box>
    </Box>
  )
}

export default CodeSpace


