import { useContext, useState } from "react";
import { executeCode } from "./api.js";
import { CodeExecutionContext } from "./Context.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";
import toast from "react-hot-toast";

const runCode = async (code, lang) => {
  try {
    const { run: res } = await executeCode(lang, code);
    return res.output || "";
  } catch (error) {
    throw new Error(error.message || "Unable to run code");
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
      const sampleTests = currentProblem.testcases.sample;

      for (let i = 0; i < sampleTests.length; i++) {
        const testCase = sampleTests[i];
        const inputVal = testCase.input;
        const expectedOutput = testCase.output.toString().trim();

        try {
          // Create test code
          const inputStr = typeof inputVal === 'string' ? `"${inputVal}"` : JSON.stringify(inputVal);
          const testCode = `
            ${code}
            const result = isPowerOfThree(${inputStr}) || isPowerOfTwo(${inputStr}) || minDistance(${inputStr});
            console.log(result);
          `;

          const actualOutput = (await runCode(testCode, lang)).trim();
          const passed = actualOutput === expectedOutput;

          if (passed) {
            passedCount++;
            setResArr((prev) => [...prev, actualOutput]);
          } else {
            setResArr((prev) => [...prev, actualOutput]);
          }

          console.log(`Sample Test ${i + 1}: ${passed ? "✓ PASSED" : "✗ FAILED"}`);
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
      const allTests = currentProblem.testcases.all_test_cases;

      for (let i = 0; i < allTests.length; i++) {
        const testCase = allTests[i];
        const inputVal = testCase.input;
        const expectedOutput = testCase.output.toString().trim();

        try {
          const inputStr = typeof inputVal === 'string' ? `"${inputVal}"` : JSON.stringify(inputVal);
          const testCode = `
            ${code}
            const result = isPowerOfThree(${inputStr}) || isPowerOfTwo(${inputStr}) || minDistance(${inputStr});
            console.log(result);
          `;

          const actualOutput = (await runCode(testCode, lang)).trim();
          const passed = actualOutput === expectedOutput;

          if (passed) passedCount++;

          results.push({
            testNum: i + 1,
            expected: expectedOutput,
            actual: actualOutput,
            passed,
          });

          console.log(`Test ${i + 1}: ${passed ? "✓ PASSED" : "✗ FAILED"}`);
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
