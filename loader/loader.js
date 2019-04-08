var loader = document.querySelector('.loader');
var loadingAnim = new Moveit(loader, {
  start: '0%',
  end: '0%'
});
function animate() {
  loadingAnim.set({
    start: '0%',
    end: '70%',
    duration: 0.5,
    callback: function() {
      loadingAnim.set({
        start: '100%',
        end: '101%',
        duration: 0.8,
        follow: true,
        callback: function() {
          animate();
        }
      });
    }
  })
}
animate();
