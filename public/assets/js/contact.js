(() => {
  'use strict';
  const form = document.getElementById('contactForm');
  if (!form) return;
  const email = document.body.dataset.contactEmail || '';
  const status = document.getElementById('contactStatus');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!email || email.includes('YOUR_EMAIL')) {
      Wasla.setStatus(status, 'لم يتم ضبط بريد التواصل بعد. عدّل قيمة data-contact-email داخل contact.html قبل النشر النهائي.', true);
      return;
    }
    const subject = encodeURIComponent(document.getElementById('contactSubject').value.trim() || 'رسالة من موقع وصلة');
    const name = document.getElementById('contactName').value.trim();
    const body = encodeURIComponent(`الاسم: ${name}\n\n${document.getElementById('contactMessage').value.trim()}`);
    location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
})();
