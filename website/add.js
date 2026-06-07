import { spawn } from 'child_process';

const proc = spawn('npx', ['--yes', 'uilayouts@latest', 'add', 'swapy'], {
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});

proc.stdout.on('data', (data) => {
  const out = data.toString();
  process.stdout.write(out);
  if (out.includes('Select the language')) {
    proc.stdin.write('\x1B[B\r\n');
  }
  if (out.includes('proceed?')) {
     proc.stdin.write('y\r\n');
  }
});

proc.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

proc.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});
