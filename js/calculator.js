// ============ KB Agency — calculator.js ============
// Живой калькулятор пакета услуг на странице services.html

document.addEventListener('DOMContentLoaded', () => {

  const grid = document.getElementById('calcGrid');
  if (!grid) return;

  const checkboxes = grid.querySelectorAll('.calc__checkbox');
  const totalEl = document.getElementById('calcTotal');
  const listEl = document.getElementById('calcList');
  const submitBtn = document.getElementById('calcSubmit');
  const servicesField = document.getElementById('ctaServices');

  const formatPrice = (n) => n.toLocaleString('ru-RU') + ' ₽';

  const update = () => {
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    const total = selected.reduce((sum, cb) => sum + Number(cb.dataset.price), 0);
    const names = selected.map(cb => cb.dataset.name);

    totalEl.textContent = names.length === 0 ? '—' : formatPrice(total);

    if (names.length === 0) {
      listEl.textContent = 'Выберите услуги выше, чтобы собрать пакет';
      submitBtn.disabled = true;
    } else {
      listEl.textContent = names.join(' + ');
      submitBtn.disabled = false;
    }

    if (servicesField) servicesField.value = names.join(', ');
  };

  checkboxes.forEach(cb => cb.addEventListener('change', update));

  submitBtn.addEventListener('click', () => {
    const contact = document.getElementById('contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const nameInput = document.querySelector('#ctaForm input[name="name"]');
    if (nameInput) setTimeout(() => nameInput.focus(), 500);
  });

  update();
});
