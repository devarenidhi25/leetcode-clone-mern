import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, '../../temp');

// Ensure temp directory exists
try {
  await fs.mkdir(TEMP_DIR, { recursive: true });
} catch (err) {
  console.log('Temp directory exists or could not be created');
}

export const executeCode = async (req, res) => {
  try {
    const { language, version, files } = req.body;

    // Validate input
    if (!language || !files || files.length === 0) {
      return res.status(400).json({
        error: 'Missing language or files',
      });
    }

    const code = files[0].content;
    const timestamp = Date.now();
    let filename, command, timeout = 10000; // 10 second timeout

    try {
      // Determine file extension and command based on language
      switch (language) {
        case 'javascript':
        case 'nodejs':
          filename = `script_${timestamp}.js`;
          command = `node ${path.join(TEMP_DIR, filename)}`;
          break;

        case 'python':
          filename = `script_${timestamp}.py`;
          command = `python ${path.join(TEMP_DIR, filename)}`;
          break;

        case 'cpp':
          filename = `script_${timestamp}.cpp`;
          const exeName = `script_${timestamp}`;
          command = `g++ -o ${path.join(TEMP_DIR, exeName)} ${path.join(TEMP_DIR, filename)} && ${path.join(TEMP_DIR, exeName)}`;
          break;

        case 'c':
          filename = `script_${timestamp}.c`;
          const cExeName = `script_${timestamp}`;
          command = `gcc -o ${path.join(TEMP_DIR, cExeName)} ${path.join(TEMP_DIR, filename)} && ${path.join(TEMP_DIR, cExeName)}`;
          break;

        case 'java':
          filename = `Main_${timestamp}.java`;
          command = `javac ${path.join(TEMP_DIR, filename)} && java -cp ${TEMP_DIR} Main_${timestamp}`;
          break;

        default:
          return res.status(400).json({
            error: `Language ${language} not supported`,
          });
      }

      // Write code to temp file
      const filePath = path.join(TEMP_DIR, filename);
      await fs.writeFile(filePath, code);

      // Execute with timeout
      let stdout = '';
      let stderr = '';
      let timedOut = false;

      try {
        const { stdout: out, stderr: err } = await new Promise((resolve, reject) => {
          const proc = exec(command, {
            timeout: timeout,
            maxBuffer: 10 * 1024 * 1024, // 10MB max output
            cwd: TEMP_DIR,
          }, (error, stdout, stderr) => {
            if (error && error.code !== 0 && !timedOut) {
              // Handle runtime errors
              resolve({ stdout, stderr: error.message || stderr });
            } else {
              resolve({ stdout, stderr });
            }
          });

          // Handle timeout
          proc.on('error', (error) => {
            timedOut = true;
            reject(new Error(`Execution timeout or error: ${error.message}`));
          });
        });

        stdout = out || '';
        stderr = err || '';
      } catch (error) {
        stderr = error.message || 'Execution timeout (max 10 seconds)';
      }

      // Clean up temp files
      try {
        await fs.unlink(filePath);
        if (language === 'cpp' || language === 'c') {
          const exePath = path.join(TEMP_DIR, `script_${timestamp}`);
          await fs.unlink(exePath).catch(() => {});
        }
        if (language === 'java') {
          const classPath = path.join(TEMP_DIR, `Main_${timestamp}.class`);
          await fs.unlink(classPath).catch(() => {});
        }
      } catch (err) {
        console.log('Cleanup error:', err.message);
      }

      // Return Piston-compatible response format
      return res.status(200).json({
        language: language,
        version: version,
        run: {
          stdout: stdout,
          stderr: stderr,
          output: stdout || stderr,
          code: stderr ? 1 : 0,
        },
      });
    } catch (error) {
      console.error('Code execution error:', error);
      return res.status(500).json({
        error: 'Code execution failed',
        message: error.message,
      });
    }
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
