'use strict';

/* ---------- Год в футере ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Бургер-меню ---------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(isOpen));
  burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});

/* Закрыть меню после клика по ссылке (мобильные) */
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
    }
  });
});

/* ---------- Анимация появления при скролле ---------- */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  /* Фолбэк для старых браузеров */
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- Валидация формы ---------- */
const form = document.getElementById('contactForm');
const successEl = document.getElementById('formSuccess');

const fields = {
  name: {
    input: document.getElementById('name'),
    error: document.getElementById('name-error'),
    validate: (v) => v.trim().length >= 2 || 'Введите имя (минимум 2 символа).',
  },
  email: {
    input: document.getElementById('email'),
    error: document.getElementById('email-error'),
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Введите корректный email.',
  },
  message: {
    input: document.getElementById('message'),
    error: document.getElementById('message-error'),
    validate: (v) => v.trim().length >= 10 || 'Сообщение должно быть не короче 10 символов.',
  },
};

function validateField(field) {
  const value = field.input.value;
  const result = field.validate(value);

  if (result === true) {
    field.error.textContent = '';
    field.input.setAttribute('aria-invalid', 'false');
    return true;
  }

  field.error.textContent = result;
  field.input.setAttribute('aria-invalid', 'true');
  return false;
}

/* Валидация в реальном времени после первого ввода */
Object.values(fields).forEach((field) => {
  field.input.addEventListener('blur', () => validateField(field));
  field.input.addEventListener('input', () => {
    if (field.input.getAttribute('aria-invalid') === 'true') {
      validateField(field);
    }
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  successEl.hidden = true;

  let isValid = true;
  let firstInvalid = null;

  Object.values(fields).forEach((field) => {
    const ok = validateField(field);
    if (!ok) {
      isValid = false;
      if (!firstInvalid) firstInvalid = field.input;
    }
  });

  if (!isValid) {
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  /* Имитация успешной отправки */
  successEl.hidden = false;
  form.reset();

  Object.values(fields).forEach((field) => {
    field.error.textContent = '';
    field.input.removeAttribute('aria-invalid');
  });
});