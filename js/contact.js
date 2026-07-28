/**
 * VATZ - Contact Page
 * Form Validation & Interaction
 */

'use strict';

/* ============================================
   CONTACT FORM
   ============================================ */
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields   = form.querySelectorAll('[data-required]');
  const submitBtn = form.querySelector('[type="submit"]');

  /* --- Validation helpers --- */
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v) => v === '' || /^[+\d\s\-()]{7,20}$/.test(v);

  const setError = (input, msg) => {
    const group = input.closest('.form-group');
    const existing = group?.querySelector('.field-error');
    if (existing) existing.remove();

    input.classList.add('input-error');
    input.classList.remove('input-success');
    input.setAttribute('aria-invalid', 'true');

    if (msg && group) {
      const err  = document.createElement('p');
      err.className = 'field-error';
      err.textContent = msg;
      err.setAttribute('role', 'alert');
      err.id = `${input.id}-error`;
      err.style.cssText = 'font-size:0.78rem;color:#f87171;margin-top:4px;';
      group.appendChild(err);
      input.setAttribute('aria-describedby', err.id);
    }
  };

  const setSuccess = (input) => {
    const group = input.closest('.form-group');
    const existing = group?.querySelector('.field-error');
    if (existing) existing.remove();
    input.classList.remove('input-error');
    input.classList.add('input-success');
    input.setAttribute('aria-invalid', 'false');
    input.removeAttribute('aria-describedby');
  };

  const validateField = (input) => {
    const val  = input.value.trim();
    const type = input.dataset.required;

    if (!val) { setError(input, 'This field is required.'); return false; }
    if (type === 'email' && !isEmail(val))  { setError(input, 'Enter a valid email address.'); return false; }
    if (type === 'phone' && !isPhone(val))  { setError(input, 'Enter a valid phone number.'); return false; }
    if (type === 'message' && val.length < 20) { setError(input, 'Message must be at least 20 characters.'); return false; }

    setSuccess(input);
    return true;
  };

  // Real-time validation
  fields.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('input-error')) validateField(input);
    });
  });

  /* --- Character counter for textarea --- */
  const textarea = form.querySelector('textarea');
  if (textarea) {
    const counter = document.createElement('p');
    counter.style.cssText = 'font-size:0.75rem;color:var(--text-muted);text-align:right;margin-top:4px;';
    textarea.closest('.form-group')?.appendChild(counter);

    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / 1000`;
      if (len > 1000) textarea.value = textarea.value.slice(0, 1000);
    });
  }

  /* --- Submit --- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });

    if (!valid) {
      // Shake the form
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 600);
      return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Sending...
      </span>`;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Show success
    submitBtn.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Message Sent!
      </span>`;
    submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';

    showSuccessToast();

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      fields.forEach(f => { f.classList.remove('input-error', 'input-success'); });
      form.querySelectorAll('.field-error').forEach(el => el.remove());
    }, 3000);
  });
};

/* ============================================
   SUCCESS TOAST
   ============================================ */
const showSuccessToast = () => {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(20px);
    background:rgba(16,185,129,0.15); backdrop-filter:blur(20px);
    border:1px solid rgba(16,185,129,0.4); color:#D1FAE5;
    border-radius:40px; padding:14px 28px;
    font-size:0.9rem; font-weight:600;
    display:flex; align-items:center; gap:10px;
    z-index:9999; opacity:0;
    transition: all 0.4s ease;
  `;
  toast.innerHTML = `
    <span style="font-size:1.2rem">✓</span>
    Message sent! We'll get back to you shortly.
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
};

/* ============================================
   SHAKE ANIMATION
   ============================================ */
if (!document.getElementById('shake-style')) {
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = `
    .shake { animation: shake-anim 0.5s ease; }
    @keyframes shake-anim {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
    .input-error { border-color: #f87171 !important; }
    .input-success { border-color: #34d399 !important; }
  `;
  document.head.appendChild(style);
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', initContactForm);
