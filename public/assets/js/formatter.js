(() => {
  'use strict';
  const form = document.getElementById('formatterForm');
  if (!form) return;
  const input = document.getElementById('numbersInput');
  const code = document.getElementById('formatCountry');
  const tbody = document.getElementById('resultsBody');
  const resultWrap = document.getElementById('formatterResult');
  const empty = document.getElementById('emptyState');
  const summary = document.getElementById('formatSummary');
  const copyBtn = document.getElementById('copyAllBtn');
  const csvBtn = document.getElementById('csvBtn');
  const clearBtn = document.getElementById('clearBtn');
  const status = document.getElementById('status');
  let rows = [];

  function normalize(raw, countryCode) {
    let digits = Wasla.digitsOnly(raw);
    if (digits.startsWith('00')) digits = digits.slice(2);
    if (!digits) return '';
    if (!digits.startsWith(countryCode)) digits = countryCode + digits.replace(/^0+/, '');
    return digits;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = input.value.split(/[\n,;]+/).map(v => v.trim()).filter(Boolean);
    if (!values.length) return Wasla.setStatus(status, 'أضف رقمًا واحدًا على الأقل.', true);
    const seen = new Set();
    rows = values.map(original => {
      const normalized = normalize(original, code.value);
      const valid = normalized.length >= 8 && normalized.length <= 15;
      const duplicate = valid && seen.has(normalized);
      if (valid) seen.add(normalized);
      return { original, normalized, valid, duplicate };
    });
    tbody.innerHTML = rows.map(row => `
      <tr>
        <td class="ltr">${escapeHtml(row.original)}</td>
        <td class="ltr">${row.valid ? '+' + escapeHtml(row.normalized) : '—'}</td>
        <td>${row.valid ? `<a class="btn btn-secondary btn-sm" href="https://wa.me/${row.normalized}" target="_blank" rel="noopener">فتح</a>` : '—'}</td>
        <td><span class="badge ${row.valid ? 'badge-ok' : 'badge-bad'}">${row.valid ? (row.duplicate ? 'مكرر' : 'صحيح') : 'غير صالح'}</span></td>
      </tr>`).join('');
    const validCount = rows.filter(r => r.valid && !r.duplicate).length;
    const invalidCount = rows.filter(r => !r.valid).length;
    summary.textContent = `${validCount} رقم صالح وفريد — ${invalidCount} غير صالح`;
    empty.hidden = true;
    resultWrap.hidden = false;
    Wasla.setStatus(status, 'تم تنسيق القائمة.');
    if (innerWidth < 900) resultWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  copyBtn.addEventListener('click', async () => {
    const text = rows.filter(r => r.valid && !r.duplicate).map(r => `+${r.normalized}`).join('\n');
    Wasla.setStatus(status, await Wasla.copy(text) ? 'تم نسخ الأرقام الصالحة.' : 'تعذر النسخ.', !text);
  });
  csvBtn.addEventListener('click', () => {
    if (!rows.length) return Wasla.setStatus(status, 'نسّق الأرقام أولًا.', true);
    const csv = ['original,normalized,status', ...rows.map(r => `"${r.original.replace(/"/g,'""')}","${r.valid ? '+'+r.normalized : ''}","${r.valid ? (r.duplicate ? 'duplicate' : 'valid') : 'invalid'}"`)].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    Wasla.downloadDataUrl(url, 'wasla-formatted-numbers.csv');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    Wasla.setStatus(status, 'بدأ تحميل CSV.');
  });
  clearBtn.addEventListener('click', () => {
    input.value = ''; rows = []; tbody.innerHTML = ''; resultWrap.hidden = true; empty.hidden = false; status.textContent = '';
  });
})();
