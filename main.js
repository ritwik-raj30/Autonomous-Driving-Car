const canvas=document.getElementById("myCanvas");
canvas.width=200;
//canvas.height=window.innerHeight;
// isse dikkat hoga 
const ctx = canvas.getContext("2d");
const car=new Car(100,100,30,50);

animate();
// test1
function animate(){
  car.update();
canvas.height=window.innerHeight;
  car.draw(ctx);
  requestAnimationFrame(animate);
}