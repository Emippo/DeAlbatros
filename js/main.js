function filterAlbums(tak, btn) {
  document.querySelectorAll('.filter-btn').forEach(function(b){
    b.classList.remove('active');
  });

  btn.classList.add('active');

  document.querySelectorAll('.album-card').forEach(function(card){
    card.style.display =
      (tak === 'alle' || card.dataset.tak === tak)
      ? 'block'
      : 'none';
  });
}
