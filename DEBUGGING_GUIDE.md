# 🔧 LeetCode Clone - Debugging & Testing Guide

## ✅ What Was Fixed

### 1. **Dynamic Function Name Detection**
- **Before**: Hardcoded function names (`isPowerOfThree`, `isPowerOfTwo`, `minDistance`)
- **After**: Automatically extracts function name from your code
- **File**: `frontend/src/tester.js` - `extractFunctionName()` function

### 2. **Improved Piston API Error Handling**
- **Before**: Generic 401 errors with no debugging info
- **After**: Detailed error logging with response status and data
- **File**: `frontend/src/api.js` - Enhanced `executeCode()` function

### 3. **Fixed Response Parsing**
- **Before**: Expected `res.output` but API returns `res.stdout`
- **After**: Handles both `stdout` and `output` formats
- **File**: `frontend/src/tester.js` - Updated `runCode()` function

### 4. **Better Test Input Handling**
- **Before**: Array inputs not properly converted
- **After**: Smart handling for JavaScript, Python, C++, Java
- **File**: `frontend/src/tester.js` - Language-specific test code generation

---

## 🧪 How to Test the Fixes

### Step 1: Write Your Solution
Write a function in the code editor. Example:
```javascript
function isPowerOfThree(n) {
  if (n <= 0) return false;
  while (n % 3 === 0) n /= 3;
  return n === 1;
}
```

### Step 2: Click "Run Code"
- Runs sample test cases
- Should show test results and pass/fail status
- Check browser console (F12) for detailed logs

### Step 3: Click "Submit"
- Runs all test cases
- If all pass, submits to database
- Shows submission status

---

## 🐛 Debugging Tips

### If Tests Still Fail:

1. **Open Browser DevTools** (F12 → Console tab)
2. **Look for these messages**:
   - `"Could not find function definition in your code"` → Your function name isn't recognized
   - `"Piston API Error: 401"` → API authentication issue
   - `"Error: Request failed with status code 401"` → Backend connection issue

3. **Check Your Function**:
   - Must be defined at top level (not inside another function)
   - Use standard declaration: `function name()` or `const name = ()`
   - Python functions: use `def function_name():`

4. **Test Input Format**:
   - **Arrays**: `[1, 2, 3]` or `[1]`
   - **Strings**: `"hello"` (with quotes in test cases)
   - **Numbers**: `27`, `0`, `1024`

5. **Check Console Output**:
   - Sample Test 1: ✓ PASSED | Expected: true | Got: true
   - Sample Test 2: ✗ FAILED | Expected: false | Got: true
   - Look for "Error:" messages for issues

---

## 🔍 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Could not find function" | Function name not detected | Ensure function is at top level |
| Test output mismatch | Boolean/string format | Check expected output format |
| API 401 error | Piston API issue | Check browser console, restart app |
| Empty output | Function not printing result | Add `console.log()` for JS, `print()` for Python |
| Wrong language | Language selector issue | Verify language is set correctly before running |

---

## 📝 Example Solutions

### Power of Three (JavaScript)
```javascript
function isPowerOfThree(n) {
  if (n <= 0) return false;
  while (n % 3 === 0) n /= 3;
  return n === 1;
}
```

### Power of Three (Python)
```python
def isPowerOfThree(n):
    if n <= 0:
        return False
    while n % 3 == 0:
        n //= 3
    return n == 1
```

---

## 📊 Test Output Format

### Sample Test Case:
```
INPUT: 27
EXPECTED: true
ACTUAL: true
STATUS: ✓ PASSED
```

### All Test Cases View:
```
Test 1: ✓ PASSED | Expected: true | Got: true
Test 2: ✗ FAILED | Expected: false | Got: true
Test 3: ✓ PASSED | Expected: false | Got: false
Test 4: ✓ PASSED | Expected: true | Got: true

Result: 3/4 test cases passed
```

---

## 🔗 Backend Connection Issues

If code isn't submitting after passing tests:

1. **Check Backend is Running**:
   ```bash
   npm start  # in backend folder
   ```

2. **Check MongoDB Connection**:
   - Backend should connect to MongoDB
   - Check `.env` file for connection string

3. **Check Frontend API Config** (`frontend/src/api.js`):
   ```javascript
   baseURL: "http://localhost:4000/api"
   ```

---

## 💡 Tips for Writing Testable Code

1. **Always define functions at top level** (not nested)
2. **Use correct return types** (boolean, number, string)
3. **Test locally first** (F12 → Console)
4. **Check console output** matches expected format
5. **For arrays, handle edge cases** (empty, single element)

---

Last Updated: April 2026
