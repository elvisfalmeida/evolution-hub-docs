// server.js - Script para rodar Mintlify em produção
const { spawn } = require('child_process');
const path = require('path');

// Configurações
const PORT = process.env.PORT || 3333;
const HOST = '0.0.0.0';

console.log(`Starting Mintlify documentation server on ${HOST}:${PORT}`);

// Spawn do processo mintlify
const mintlify = spawn('mintlify', ['dev', '--port', PORT.toString(), '--host', HOST], {
  cwd: path.resolve(__dirname),
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

// Tratamento de erros
mintlify.on('error', (err) => {
  console.error('Failed to start Mintlify:', err);
  process.exit(1);
});

// Quando o processo principal morrer, mate o mintlify também
process.on('SIGINT', () => {
  console.log('Shutting down Mintlify...');
  mintlify.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down Mintlify...');
  mintlify.kill('SIGTERM');
  process.exit(0);
});

// Manter o processo rodando
mintlify.on('close', (code) => {
  console.log(`Mintlify process exited with code ${code}`);
  process.exit(code);
});
