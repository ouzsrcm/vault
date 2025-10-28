import 'dotenv/config';
import { spawn } from 'node:child_process';
import { z } from 'zod';

const env = z.object({
  RERUN_ALLOWED: z.string().default('true'),
  RERUN_TIMEOUT_MS: z.coerce.number().default(15000)
}).parse(process.env);

export function canRerun() {
  return env.RERUN_ALLOWED === 'true';
}

export function runCommand(cmd: string, args: string[] | null, opts?: { cwd?: string; env?: NodeJS.ProcessEnv }) {
  if (!canRerun()) throw Object.assign(new Error('Komut çalıştırma devre dışı.'), { status: 403 });

  return new Promise<{ code: number; stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(cmd, args ?? [], {
      shell: false,
      cwd: opts?.cwd,
      env: { ...process.env, ...opts?.env }
    });

    let out = '';
    let err = '';

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
    }, env.RERUN_TIMEOUT_MS);

    child.stdout.on('data', (d) => (out += d.toString()));
    child.stderr.on('data', (d) => (err += d.toString()));

    child.on('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? -1, stdout: out, stderr: err });
    });
  });
}
