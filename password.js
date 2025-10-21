// password.js
// simple formatted password prompt: () () - () () - () () () ()  (8 single-digit boxes)
// returns a promise that resolves true when correct password entered, false otherwise

export function requestPassword({ promptText = '请输入密码', correct = '30-07-2025' } = {}) {
  return new Promise((resolve) => {
    if (document.getElementById('__pwd_modal__')) return resolve(false);

    let failCount = 0;

    const wrap = document.createElement('div');
    wrap.id = '__pwd_modal__';
    wrap.style = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.36);z-index:21000';
    wrap.innerHTML = `
      <div role="dialog" aria-label="${promptText}" style="background:#fff;padding:16px;border-radius:10px;border:1px solid #ddd;min-width:320px;max-width:92vw;text-align:center;">
        <div style="font-weight:700;margin-bottom:8px">${promptText}</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px;align-items:center;">
          <input id="__pwd_1__" maxlength="1" inputmode="numeric" style="width:38px;padding:8px;border:1px solid #ccc;border-radius:6px;text-align:center;font-weight:700"/>
          <input id="__pwd_2__" maxlength="1" inputmode="numeric" style="width:38px;padding:8px;border:1px solid #ccc;border-radius:6px;text-align:center;font-weight:700"/>
          <span style="align-self:center">-</span>
          <input id="__pwd_3__" maxlength="1" inputmode="numeric" style="width:38px;padding:8px;border:1px solid #ccc;border-radius:6px;text-align:center;font-weight:700"/>
          <input id="__pwd_4__" maxlength="1" inputmode="numeric" style="width:38px;padding:8px;border:1px solid #ccc;border-radius:6px;text-align:center;font-weight:700"/>
          <span style="align-self:center">-</span>
          <input id="__pwd_5__" maxlength="1" inputmode="numeric" style="width:38px;padding:8px;border:1px solid #ccc;border-radius:6px;text-align:center;font-weight:700"/>
          <input id="__pwd_6__" maxlength="1" inputmode="numeric" style="width:38px;padding:8px;border:1px solid #ccc;border-radius:6px;text-align:center;font-weight:700"/>
          <input id="__pwd_7__" maxlength="1" inputmode="numeric" style="width:38px;padding:8px;border:1px solid #ccc;border-radius:6px;text-align:center;font-weight:700"/>
          <input id="__pwd_8__" maxlength="1" inputmode="numeric" style="width:38px;padding:8px;border:1px solid #ccc;border-radius:6px;text-align:center;font-weight:700"/>
        </div>
        <div id="__pwd_msg__" style="min-height:18px;color:#e44;font-weight:700;margin-bottom:8px;font-size:13px"></div>
        <div style="display:flex;gap:8px;justify-content:center;">
          <button id="__pwd_ok__" style="padding:8px 12px;border-radius:8px;border:1px solid #111;background:#111;color:#fff;font-weight:700;cursor:pointer">确定</button>
          <button id="__pwd_cancel__" style="padding:8px 12px;border-radius:8px;border:1px solid #bbb;background:#fff;color:#111;cursor:pointer;font-weight:700">取消</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const inputs = [
      wrap.querySelector('#__pwd_1__'),
      wrap.querySelector('#__pwd_2__'),
      wrap.querySelector('#__pwd_3__'),
      wrap.querySelector('#__pwd_4__'),
      wrap.querySelector('#__pwd_5__'),
      wrap.querySelector('#__pwd_6__'),
      wrap.querySelector('#__pwd_7__'),
      wrap.querySelector('#__pwd_8__')
    ];
    const ok = wrap.querySelector('#__pwd_ok__');
    const cancel = wrap.querySelector('#__pwd_cancel__');
    const msg = wrap.querySelector('#__pwd_msg__');

    function clean(result) {
      if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      resolve(result);
    }

    function assembled() {
      // assemble as "AA-BB-CCCC"
      const a = inputs[0].value || '0';
      const b = inputs[1].value || '0';
      const c = inputs[2].value || '0';
      const d = inputs[3].value || '0';
      const e = inputs[4].value || '0';
      const f = inputs[5].value || '0';
      const g = inputs[6].value || '0';
      const h = inputs[7].value || '0';
      const first = `${a}${b}`;
      const second = `${c}${d}`;
      const last = `${e}${f}${g}${h}`;
      return `${first}-${second}-${last}`;
    }

    function showError(text) {
      msg.textContent = text;
      // brief shake on panel
      const panel = wrap.querySelector('[role="dialog"]');
      if (panel) {
        panel.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 260 });
      }
    }

    async function triggerFailureShock() {
      // remove password modal if still present
      if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      // create full-screen image overlay
      if (document.getElementById('__pwd_fail_shock__')) return resolve(false);
      const ov = document.createElement('div');
      ov.id = '__pwd_fail_shock__';
      ov.style = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;z-index:22000';
      ov.innerHTML = `<img src="daipai.png" alt="代拍" style="max-width:170%;max-height:170%;display:block">`;
      document.body.appendChild(ov);
      // audio: loop dadongbei.mp3 at max permitted volume
      try {
        const a = new Audio('dadongbei.mp3');
        a.loop = true;
        a.volume = 1; // browsers clamp max to 1
        await a.play().catch(()=>{});
        // store to DOM for potential future control
        ov.dataset._audio = '1';
        // clicking the overlay will stop audio and remove it
        ov.addEventListener('click', () => {
          try { a.pause(); a.currentTime = 0; } catch(e) {}
          if (ov.parentNode) ov.parentNode.removeChild(ov);
        }, { once: true });
      } catch (e) {
        // ignore audio errors
      }
      resolve(false);
    }

    ok.addEventListener('click', () => {
      const entered = assembled();
      if (entered === correct) {
        clean(true);
      } else {
        failCount++;
        if (failCount >= 3) {
          // show message briefly then trigger shock
          showError('密码错误，请重试');
          setTimeout(() => {
            triggerFailureShock();
          }, 420);
        } else {
          showError('密码错误，请重试');
        }
      }
    });

    cancel.addEventListener('click', () => clean(false));
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) clean(false);
    });

    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') ok.click();
      if (e.key === 'Escape') clean(false);
      // handle numeric entry auto-advance
      if (/^[0-9]$/.test(e.key)) {
        // find first focused input or first empty
        const active = document.activeElement;
        const idx = inputs.indexOf(active);
        if (idx >= 0) {
          // allow input normally; advance after tiny delay so value is set
          setTimeout(() => {
            const next = inputs[idx + 1];
            if (next) next.focus();
          }, 10);
        } else {
          // focus first empty
          const firstEmpty = inputs.find(i => !i.value);
          if (firstEmpty) firstEmpty.focus();
        }
      }
    });

    // make inputs advance on input and allow backspace to go back
    inputs.forEach((inp, i) => {
      inp.addEventListener('input', (e) => {
        inp.value = (inp.value || '').slice(-1).replace(/[^\d]/g, '');
        const next = inputs[i + 1];
        if (inp.value && next) next.focus();
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !inp.value) {
          const prev = inputs[i - 1];
          if (prev) { prev.focus(); prev.value = ''; }
        }
      });
    });

    inputs[0].focus();
  });
}
