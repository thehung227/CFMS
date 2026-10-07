// Tiện ích cho login.mjs: đọc .env.sso, mở Chrome có cổng DevTools, gọi CDP.
// Không phụ thuộc package ngoài (Node >= 22: có sẵn fetch và WebSocket).
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

export const DEBUG_PORT = 9222; // phải khớp --browserUrl của chrome-devtools trong .mcp.json
export const DEVTOOLS_URL = `http://127.0.0.1:${DEBUG_PORT}`;
export const PROFILE_DIR = path.join(homedir(), '.cache', 'cfms-sso-chrome-profile');

// Tự parse thay vì process.loadEnvFile: parser của Node cắt giá trị không bọc nháy
// tại ký tự '#', làm hỏng password có '#'.
export function parseEnv(text) {
  const result = {};
  for (const rawLine of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    let value = line.slice(eq + 1).trim();
    const quote = value[0];
    if (value.length >= 2 && (quote === '"' || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
    }
    result[line.slice(0, eq).trim()] = value;
  }
  return result;
}

export function loadSsoConfig(file) {
  if (!existsSync(file)) {
    throw new Error(`Chưa có ${file}. Copy .env.sso.example thành .env.sso rồi điền SSO_EMAIL, SSO_PASSWORD.`);
  }
  const env = parseEnv(readFileSync(file, 'utf8'));
  const missing = ['SSO_EMAIL', 'SSO_PASSWORD'].filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`${file} còn thiếu: ${missing.join(', ')}`);
  }
  return {
    email: env.SSO_EMAIL,
    password: env.SSO_PASSWORD,
    appUrl: (env.APP_URL || 'http://localhost:4200').replace(/\/+$/, ''),
  };
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findChrome() {
  const candidates = [
    path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Google\\Chrome\\Application\\chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Google\\Chrome\\Application\\chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
  ];
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) throw new Error('Không tìm thấy chrome.exe. Cần cài Google Chrome.');
  return found;
}

async function devtoolsReady() {
  try {
    return (await fetch(`${DEVTOOLS_URL}/json/version`)).ok;
  } catch {
    return false;
  }
}

// Dùng lại Chrome đang mở ở DEBUG_PORT, nếu chưa có thì mở mới (tách khỏi process
// Node để cửa sổ vẫn còn sau khi script kết thúc).
export async function ensureBrowser() {
  if (await devtoolsReady()) return;
  const args = [
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${PROFILE_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ];
  spawn(findChrome(), args, { detached: true, stdio: 'ignore' }).unref();
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    if (await devtoolsReady()) return;
  }
  throw new Error(`Chrome không mở cổng DevTools ${DEBUG_PORT}. Đóng cửa sổ Chrome của profile ${PROFILE_DIR} rồi chạy lại.`);
}

function connectCdp(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    let nextId = 0;
    ws.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      const call = pending.get(message.id);
      if (!call) return;
      pending.delete(message.id);
      if (message.error) call.reject(new Error(message.error.message));
      else call.resolve(message.result);
    };
    ws.onerror = () => reject(new Error(`Không kết nối được DevTools WebSocket ${wsUrl}`));
    ws.onopen = () => resolve({
      send(method, params = {}) {
        return new Promise((res, rej) => {
          const id = ++nextId;
          pending.set(id, { resolve: res, reject: rej });
          ws.send(JSON.stringify({ id, method, params }));
        });
      },
      close: () => ws.close(),
    });
  });
}

// Kết nối vào tab đầu tiên của Chrome (tạo tab mới nếu không có).
export async function openPage() {
  const targets = await (await fetch(`${DEVTOOLS_URL}/json/list`)).json();
  let target = targets.find((t) => t.type === 'page');
  if (!target) {
    target = await (await fetch(`${DEVTOOLS_URL}/json/new?about:blank`, { method: 'PUT' })).json();
  }
  return connectCdp(target.webSocketDebuggerUrl);
}

export async function evaluate(cdp, expression) {
  const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', { expression, returnByValue: true });
  if (exceptionDetails) throw new Error(exceptionDetails.text);
  return result.value;
}
