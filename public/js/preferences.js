const budget = document.getElementById('budgetRange');
const budgetValue = document.getElementById('budgetValue');

budget.addEventListener('input', () => {
  budgetValue.textContent = `₹${parseInt(budget.value).toLocaleString()}`;
});

document.getElementById('preferenceForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Preferences submitted successfully!');
});
