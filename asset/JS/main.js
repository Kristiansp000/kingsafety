const buttons = document.querySelectorAll('.size-btn');
const displayModel = document.getElementById('product-preview');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    displayModel.src = button.dataset.src;
  });
});
