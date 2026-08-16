(() => {
  'use strict';
  const form = document.getElementById('whatsappForm');
  if (!form) return;
  const country = document.getElementById('countryCode');
  const phone = document.getElementById('phone');
  const message = document.getElementById('message');
  const counter = document.getElementById('messageCount');
  const error = document.getElementById('phoneError');
  const empty = document.getElementById('emptyState');
  const result = document.getElementById('resultContent');
  const linkOutput = document.getElementById('generatedLink');
  const openBtn = document.getElementById('openBtn');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const qr = document.getElementById('qrcode');
  const status = document.getElementById('status');

  function normalizePhone(raw, code) {
    let digits = Wasla.digitsOnly(raw);
    if (digits.startsWith('00')) digits = digits.slice(2);
    if (digits.startsWith(code)) return digits;
    digits = digits.replace(/^0+/, '');
    return code + digits;
  }

  function renderQr(text) {
    qr.innerHTML = '';
    if (typeof QRCode === 'undefined') throw new Error('تعذر تحميل مولد QR. أعد تحميل الصفحة.');
    try {
      new QRCode(qr, { text, width: 220, height: 220, colorDark: '#10231f', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.L });
    } catch (err) {
      if (/code length overflow/i.test(String(err && err.message ? err.message : err))) {
        throw new Error('الرسالة طويلة جدًا بالنسبة إلى QR. اختصرها ثم أعد المحاولة.');
      }
      throw err;
    }
  }

  function compactQrLink(number, msg) {
    if (!msg) return `https://wa.me/${number}`;
    const safe = msg
      .replace(/%/g, '%25').replace(/#/g, '%23').replace(/&/g, '%26')
      .replace(/\+/g, '%2B').replace(/\?/g, '%3F').replace(/=/g, '%3D')
      .replace(/\r\n|\r|\n/g, '%0A');
    return `https://wa.me/${number}?text=${safe}`;
  }

  function updateCounter() { counter.textContent = `${message.value.length} / 220`; }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    error.textContent = '';
    status.textContent = '';
    const number = normalizePhone(phone.value, country.value);
    if (number.length < 8 || number.length > 15) {
      error.textContent = number.length < 8 ? 'الرقم قصير جدًا. راجعه وحاول مرة أخرى.' : 'الرقم أطول من الحد الدولي المسموح.';
      phone.focus();
      return;
    }
    const msg = message.value.trim();
    const link = `https://wa.me/${number}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
    try {
      renderQr(compactQrLink(number, msg));
      linkOutput.value = link;
      openBtn.href = link;
      empty.hidden = true;
      result.hidden = false;
      Wasla.setStatus(status, 'تم إنشاء الرابط والـQR بنجاح.');
      if (innerWidth < 900) result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      error.textContent = err.message || 'تعذر إنشاء QR.';
    }
  });

  document.querySelectorAll('[data-message]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-message]').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      message.value = button.dataset.message || '';
      updateCounter();
    });
  });
  phone.addEventListener('input', () => { phone.value = Wasla.toEnglishDigits(phone.value); error.textContent = ''; });
  message.addEventListener('input', updateCounter);
  copyBtn.addEventListener('click', async () => { const ok = await Wasla.copy(linkOutput.value); Wasla.setStatus(status, ok ? 'تم نسخ الرابط.' : 'تعذر النسخ.', !ok); });
  downloadBtn.addEventListener('click', () => {
    const canvas = qr.querySelector('canvas');
    const image = qr.querySelector('img');
    const dataUrl = canvas ? canvas.toDataURL('image/png') : image ? image.src : '';
    if (!dataUrl) return Wasla.setStatus(status, 'أنشئ QR أولًا.', true);
    Wasla.downloadDataUrl(dataUrl, 'wasla-whatsapp-qr.png');
    Wasla.setStatus(status, 'بدأ تحميل الصورة.');
  });
  updateCounter();
})();
