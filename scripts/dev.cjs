const { spawn } = require('child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = new Set();
let shuttingDown = false;

const run = (name, args) => {
  const child = spawn(npmCommand, args, {
    cwd: __dirname + '/..',
    stdio: 'inherit',
  });

  children.add(child);

  child.on('exit', (code, signal) => {
    children.delete(child);

    if (shuttingDown) return;

    shuttingDown = true;
    for (const runningChild of children) {
      runningChild.kill('SIGTERM');
    }

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    console.error(`[dev] Failed to start ${name}:`, error);
    process.exit(1);
  });
};

const shutdown = () => {
  if (shuttingDown) return;

  shuttingDown = true;
  for (const child of children) {
    child.kill('SIGTERM');
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

run('server', ['--prefix', 'server', 'run', 'dev']);
run('client', ['--prefix', 'client', 'run', 'dev']);
