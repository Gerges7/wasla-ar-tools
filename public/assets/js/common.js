(() => {
  'use strict';
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  window.Wasla = {
    arabicDigits: '٠١٢٣٤٥٦٧٨٩',
    persianDigits: '۰۱۲۳۴۵۶۷۸۹',
    toEnglishDigits(value) {
      return String(value ?? '')
        .replace(/[٠-٩]/g, d => this.arabicDigits.indexOf(d))
        .replace(/[۰-۹]/g, d => this.persianDigits.indexOf(d));
    },
    digitsOnly(value) {
      return this.toEnglishDigits(value).replace(/\D/g, '');
    },
    utf8Bytes(value) {
      return new TextEncoder().encode(String(value ?? '')).length;
    },
    async copy(value) {
      if (!value) return false;
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (_) {
        const area = document.createElement('textarea');
        area.value = value;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        area.remove();
        return ok;
      }
    },
    downloadDataUrl(dataUrl, filename) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    setStatus(element, message, isError = false) {
      if (!element) return;
      element.textContent = message;
      element.style.color = isError ? 'var(--danger)' : 'var(--success)';
    },
    formatMoney(value, currency = 'EGP') {
      const amount = Number.isFinite(value) ? value : 0;
      try {
        return new Intl.NumberFormat('ar-EG', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
      } catch (_) {
        return `${amount.toFixed(2)} ${currency}`;
      }
    }
  };

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
