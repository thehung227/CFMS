// Đăng nhập CFMS qua SSO Keycloak (sso.newtecons.vn) bằng tài khoản trong .env.sso,
// trên Chrome profile riêng mở cổng DevTools 9222 để MCP chrome-devtools gắn vào.
// Password chỉ đi từ file -> script -> trình duyệt, không in ra console.
//
//   node tools/browser-sso/login.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureBrowser, evaluate, loadSsoConfig, openPage, sleep } from './lib.mjs';

const ENV_FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '.env.sso');
const LOGIN_TIMEOUT_MS = 3 * 60 * 1000;

const READ_STATE = `(() => ({
  href: location.href,
  loginForm: !!document.querySelector('#kc-form-login #username'),
  otpForm: !!document.querySelector('#otp'),
  error: ((document.querySelector('#input-error, .kc-feedback-text') || {}).textContent || '').trim(),
}))()`;

function fillLoginForm(email, password) {
  return `(() => {
    document.querySelector('#username').value = ${JSON.stringify(email)};
    document.querySelector('#password').value = ${JSON.stringify(password)};
    document.querySelector('#kc-login').click();
  })()`;
}

async function main() {
  const { email, password, appUrl } = loadSsoConfig(ENV_FILE);
  await ensureBrowser();
  const cdp = await openPage();
  try {
    await cdp.send('Page.bringToFront');
    const navigation = await cdp.send('Page.navigate', { url: `${appUrl}/` });
    if (navigation.errorText) {
      throw new Error(`Không mở được ${appUrl} (${navigation.errorText}). Với localhost cần chạy "npm start" trước.`);
    }

    let submitted = false;
    let otpNotified = false;
    const deadline = Date.now() + LOGIN_TIMEOUT_MS;
    while (Date.now() < deadline) {
      await sleep(1000);
      // Lỗi evaluate = trang đang chuyển hướng giữa app và SSO, thử lại ở vòng sau.
      const state = await evaluate(cdp, READ_STATE).catch(() => null);
      if (!state) continue;

      if (state.href.startsWith(appUrl) && state.href.includes('#/main/')) {
        console.log(`Đã đăng nhập: ${state.href}`);
        return;
      }
      if (state.loginForm && submitted && state.error) {
        // Chỉ gửi form một lần để không làm khoá tài khoản vì sai password.
        throw new Error(`SSO từ chối đăng nhập: ${state.error}. Kiểm tra lại .env.sso.`);
      }
      if (state.loginForm && !submitted) {
        await evaluate(cdp, fillLoginForm(email, password));
        submitted = true;
        console.log(`Đã gửi form SSO cho ${email}, đang chờ chuyển về ứng dụng...`);
      }
      if (state.otpForm && !otpNotified) {
        otpNotified = true;
        console.log('SSO yêu cầu OTP: nhập mã trên cửa sổ Chrome, script tiếp tục chờ.');
      }
    }
    throw new Error(`Sau ${LOGIN_TIMEOUT_MS / 1000}s vẫn chưa vào được ${appUrl}/#/main/. Xem cửa sổ Chrome để biết đang dừng ở đâu.`);
  } finally {
    cdp.close();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
