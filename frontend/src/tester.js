import { useContext, useState } from "react";
import { executeCode } from "./api.js";
import { CodeExecutionContext } from "./Context.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";
import toast from "react-hot-toast";

// Extract first function name from code
const extractFunctionName = (code) => {
  // Match function definitions: function name, const/let/var name = ..., export function, etc.
  const patterns = [
    /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/,     // Python function definition
    /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/,   // JavaScript function declaration
    /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/,  // JavaScript const function
    /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/,    // JavaScript let function
    /var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/,    // JavaScript var function
  ];

  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const runCode = async (code, lang) => {
  try {
    const { run: res } = await executeCode(lang, code);
    if (!res || (!res.stdout && !res.output)) {
      console.warn("Unexpected response format:", res);
      return res?.output || res?.stdout || "";
    }
    
    let output = res.stdout || res.output || "";
    
    // Normalize output for consistent comparison
    output = output.trim();
    // Convert Python True/False to lowercase for compatibility
    output = output.replace(/^True$/i, 'true');
    output = output.replace(/^False$/i, 'false');
    
    return output;
  } catch (error) {
    console.error("Code execution error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || "Unable to run code");
  }
};

// Custom hook
export const useTestCaseRunner = () => {
  const [load, setLoad] = useState(false);
  const [load1, setload1] = useState(false);
  const { Authuser } = useAuthContext();
  const { ResArr, setResArr, probId, language, currentProblem } = useContext(CodeExecutionContext);

  // Run sample test cases
  const run_sample_testcases = async (code, lang) => {
    if (!currentProblem?.testcases?.sample || currentProblem.testcases.sample.length === 0) {
      toast.error("No sample test cases available");
      return { allPassed: false };
    }

    setload1(true);
    setResArr([]);
    let passedCount = 0;

    try {
      const functionName = extractFunctionName(code);
      if (!functionName) {
        toast.error("Could not find function definition in your code");
        setload1(false);
        return { allPassed: false };
      }

      const sampleTests = currentProblem.testcases.sample;

      for (let i = 0; i < sampleTests.length; i++) {
        const testCase = sampleTests[i];
        const inputVal = testCase.input;
        const expectedOutput = testCase.output.toString().trim();

        try {
          // Create test code with dynamic function call
          let testCode = code;
          
          if (lang === "python") {
            // For Python, handle tuple inputs
            if (Array.isArray(inputVal)) {
              const inputStr = inputVal.map(v => {
                // Try to convert string numbers to integers
                if (typeof v === 'string' && !isNaN(v)) {
                  return v; // Already a number string
                }
                return typeof v === 'string' ? `"${v}"` : v;
              }).join(', ');
              testCode += `\nprint(${functionName}(${inputStr}))`;
            } else {
              let inputStr;
              if (typeof inputVal === 'string' && !isNaN(inputVal)) {
                inputStr = inputVal;
              } else {
                inputStr = typeof inputVal === 'string' ? `"${inputVal}"` : inputVal;
              }
              testCode += `\nprint(${functionName}(${inputStr}))`;
            }
          } else {
            // For JavaScript and other languages
            if (Array.isArray(inputVal)) {
              const inputStr = JSON.stringify(inputVal);
              testCode += `\nconsole.log(${functionName}(...${inputStr}));`;
            } else {
              const inputStr = typeof inputVal === 'string' ? `"${inputVal}"` : inputVal;
              testCode += `\nconsole.log(${functionName}(${inputStr}));`;
            }
          }

          const actualOutput = (await runCode(testCode, lang)).trim();
          const passed = actualOutput === expectedOutput;

          if (passed) {
            passedCount++;
          }
          
          setResArr((prev) => [...prev, actualOutput]);
          console.log(`Sample Test ${i + 1}: ${passed ? "✓ PASSED" : "✗ FAILED"} | Expected: ${expectedOutput} | Got: ${actualOutput}`);
        } catch (error) {
          console.error(`Sample Test ${i + 1} Error:`, error.message);
          setResArr((prev) => [...prev, `Error: ${error.message}`]);
        }
      }

      if (passedCount === sampleTests.length) {
        toast.success("✅ All sample test cases passed!");
      } else {
        toast.error(`❌ ${sampleTests.length - passedCount}/${sampleTests.length} test cases failed`);
      }

      return { allPassed: passedCount === sampleTests.length };
    } catch (error) {
      console.error("Error running sample tests:", error);
      toast.error("Error running sample test cases");
      return { allPassed: false };
    } finally {
      setload1(false);
    }
  };

  // Run all test cases
  const run_all_testcases = async (code, lang) => {
    if (!currentProblem?.testcases?.all_test_cases || currentProblem.testcases.all_test_cases.length === 0) {
      toast.error("No test cases available");
      return { allPassed: false };
    }

    setLoad(true);
    let passedCount = 0;
    const results = [];

    try {
      const functionName = extractFunctionName(code);
      if (!functionName) {
        toast.error("Could not find function definition in your code");
        setLoad(false);
        return { allPassed: false };
      }

      const allTests = currentProblem.testcases.all_test_cases;

      for (let i = 0; i < allTests.length; i++) {
        const testCase = allTests[i];
        const inputVal = testCase.input;
        const expectedOutput = testCase.output.toString().trim();

        try {
          // Create test code with dynamic function call
          let testCode = code;
          
          if (lang === "python") {
            if (Array.isArray(inputVal)) {
              const inputStr = inputVal.map(v => {
                // Try to convert string numbers to integers
                if (typeof v === 'string' && !isNaN(v)) {
                  return v; // Already a number string
                }
                return typeof v === 'string' ? `"${v}"` : v;
              }).join(', ');
              testCode += `\nprint(${functionName}(${inputStr}))`;
            } else {
              let inputStr;
              if (typeof inputVal === 'string' && !isNaN(inputVal)) {
                inputStr = inputVal;
              } else {
                inputStr = typeof inputVal === 'string' ? `"${inputVal}"` : inputVal;
              }
              testCode += `\nprint(${functionName}(${inputStr}))`;
            }
          } else {
            if (Array.isArray(inputVal)) {
              const inputStr = JSON.stringify(inputVal);
              testCode += `\nconsole.log(${functionName}(...${inputStr}));`;
            } else {
              const inputStr = typeof inputVal === 'string' ? `"${inputVal}"` : inputVal;
              testCode += `\nconsole.log(${functionName}(${inputStr}));`;
            }
          }

          const actualOutput = (await runCode(testCode, lang)).trim();
          const passed = actualOutput === expectedOutput;

          if (passed) passedCount++;

          results.push({
            testNum: i + 1,
            expected: expectedOutput,
            actual: actualOutput,
            passed,
          });

          console.log(`Test ${i + 1}: ${passed ? "✓ PASSED" : "✗ FAILED"} | Expected: ${expectedOutput} | Got: ${actualOutput}`);
        } catch (error) {
          console.error(`Test ${i + 1} Error:`, error.message);
          results.push({
            testNum: i + 1,
            expected: expectedOutput,
            actual: "Error",
            passed: false,
          });
        }
      }

      const allPassed = passedCount === allTests.length;

      if (allPassed) {
        toast.success(`✅ All ${allTests.length} test cases passed!`);
      } else {
        toast.error(`❌ ${allTests.length - passedCount}/${allTests.length} test cases failed`);
      }

      return { allPassed, passedCount, totalTests: allTests.length, results };
    } catch (error) {
      console.error("Error running tests:", error);
      toast.error("Error running test cases");
      return { allPassed: false };
    } finally {
      setLoad(false);
    }
  };

  return {
    run_sample_testcases,
    run_all_testcases,
    load,
    load1,
  };
};
