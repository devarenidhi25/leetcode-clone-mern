import { Box } from '@chakra-ui/react'
import { Editor } from '@monaco-editor/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import LanguageSelector from './LanguageSelector.jsx';
import { CODE_SNIPPETS } from '../constant.js';
import { CodeExecutionContext } from '../Context.jsx';

const CodeSpace = () => {
  const [def, setdef] = useState('javascript');
  const { language, setLanguage, code, setCode, setOutput,
    currentProblem, setCurrentProblem, editorRef, data, setData, probId } = useContext(CodeExecutionContext);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  }

  const fetchData1 = async (probId, language) => {
    try {
      const res = await fetch(`https://coding-engine-trial.onrender.com/api/problems/${probId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      setCode(result.solution_skeleton[language]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onSelect = (l) => {
    setLanguage(l);
    setCode(currentProblem.solution_skeleton[l]);
  }

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
        <LanguageSelector Language={language} onSelect={onSelect} />
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

