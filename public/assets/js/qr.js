(() => {
  'use strict';
  const form = document.getElementById('qrForm');
  if (!form) return;
  const type = document.getElementById('qrType');
  const mainValue = document.getElementById('qrValue');
  const extraWrap = document.getElementById('wifiFields');
  const ssid = document.getElementById('wifiName');
  const password = document.getElementById('wifiPassword');
  const security = document.getElementById('wifiSecurity');
  const error = document.getElementById('qrError');
  const empty = document.getElementById('emptyState');
  const result = document.getElementById('resultContent');
  const qr = document.getElementById('qrcode');
  const contentOutput = document.getElementById('qrContent');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const status = document.getElementById('status');
  const labels = {
    url: ['الرابط', 'https://example.com'],
    text: ['النص', 'اكتب النص الذي تريد تحويله إلى QR'],
    phone: ['رقم الهاتف', '+201012345678'],
    email: ['البريد الإلكتروني', 'name@example.com'],
    wifi: ['اسم الشبكة', 'اسم شبكة Wi‑Fi']
  };

  function escapeWifi(value) { return String(value).replace(/([\\;,:"])/g, '\\$1'); }
  function getPayload() {
    const value = mainValue.value.trim();
    if (!value) throw new Error(type.value === 'wifi' ? 'اكتب اسم الشبكة.' : 'اكتب المحتوى أولًا.');
    if (type.value === 'url') {
      const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      try { new URL(url); } catch (_) { throw new Error('اكتب رابطًا صحيحًا.'); }
      return url;
    }
    if (type.value === 'phone') return `tel:${Wasla.toEnglishDigits(value).replace(/\s/g, '')}`;
    if (type.value === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('اكتب بريدًا إلكترونيًا صحيحًا.');
      return `mailto:${value}`;
    }
    if (type.value === 'wifi') {
      const pass = password.value;
      const sec = security.value;
      return `WIFI:T:${sec};S:${escapeWifi(value)};P:${escapeWifi(pass)};;`;
    }
    return value;
  }

  function updateType() {
    const [label, placeholder] = labels[type.value];
    document.querySelector('label[for="qrValue"]').textContent = label;
    mainValue.placeholder = placeholder;
    extraWrap.hidden = type.value !== 'wifi';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    error.textContent = '';
    status.textContent = '';
    try {
      const payload = getPayload();
      if (Wasla.utf8Bytes(payload) > 900) throw new Error('المحتوى طويل جدًا. اختصره إلى أقل من 900 بايت.');
      qr.innerHTML = '';
      new QRCode(qr, { text: payload, width: 230, height: 230, colorDark: '#10231f', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.L });
      contentOutput.value = payload;
      empty.hidden = true;
      result.hidden = false;
      Wasla.setStatus(status, 'تم إنشاء QR بنجاح.');
      if (innerWidth < 900) result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      error.textContent = /code length overflow/i.test(String(err)) ? 'المحتوى طويل جدًا لإنشاء QR.' : (err.message || 'تعذر إنشاء QR.');
    }
  });
  type.addEventListener('change', updateType);
  copyBtn.addEventListener('click', async () => { const ok = await Wasla.copy(contentOutput.value); Wasla.setStatus(status, ok ? 'تم نسخ المحتوى.' : 'تعذر النسخ.', !ok); });
  downloadBtn.addEventListener('click', () => {
    const canvas = qr.querySelector('canvas');
    const image = qr.querySelector('img');
    const dataUrl = canvas ? canvas.toDataURL('image/png') : image ? image.src : '';
    if (!dataUrl) return Wasla.setStatus(status, 'أنشئ QR أولًا.', true);
    Wasla.downloadDataUrl(dataUrl, 'wasla-qr.png');
    Wasla.setStatus(status, 'بدأ تحميل الصورة.');
  });
  updateType();
})();
