// node --test tools/browser-sso/lib.test.mjs
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { loadSsoConfig, parseEnv } from './lib.mjs';

test('parseEnv bỏ qua dòng trống và comment', () => {
  assert.deepEqual(parseEnv('# ghi chú\n\nSSO_EMAIL=a@newtecons.vn\n'), { SSO_EMAIL: 'a@newtecons.vn' });
});

test('parseEnv giữ nguyên # và = trong password không bọc nháy', () => {
  assert.equal(parseEnv('SSO_PASSWORD=Ab#12=x!').SSO_PASSWORD, 'Ab#12=x!');
});

test('parseEnv bỏ cặp nháy bao ngoài', () => {
  const env = parseEnv(`A="p a#ss"\nB='it"s'\nC="lẻ`);
  assert.equal(env.A, 'p a#ss');
  assert.equal(env.B, 'it"s');
  assert.equal(env.C, '"lẻ');
});

test('parseEnv xử lý BOM và CRLF của file tạo trên Windows', () => {
  assert.deepEqual(parseEnv('﻿SSO_EMAIL=a@x.vn\r\nSSO_PASSWORD=p\r\n'), { SSO_EMAIL: 'a@x.vn', SSO_PASSWORD: 'p' });
});

function writeTemp(content) {
  const file = path.join(mkdtempSync(path.join(tmpdir(), 'browser-sso-')), '.env.sso');
  writeFileSync(file, content);
  return file;
}

test('loadSsoConfig báo lỗi khi thiếu file hoặc thiếu giá trị', () => {
  assert.throws(() => loadSsoConfig(path.join(tmpdir(), 'khong-ton-tai', '.env.sso')), /Chưa có/);
  assert.throws(() => loadSsoConfig(writeTemp('SSO_EMAIL=a@x.vn\nSSO_PASSWORD=\n')), /SSO_PASSWORD/);
});

test('loadSsoConfig mặc định APP_URL localhost và bỏ dấu / cuối', () => {
  assert.equal(loadSsoConfig(writeTemp('SSO_EMAIL=a\nSSO_PASSWORD=b\n')).appUrl, 'http://localhost:4200');
  assert.equal(loadSsoConfig(writeTemp('SSO_EMAIL=a\nSSO_PASSWORD=b\nAPP_URL=https://cfms.newtecons.vn/\n')).appUrl, 'https://cfms.newtecons.vn');
});
