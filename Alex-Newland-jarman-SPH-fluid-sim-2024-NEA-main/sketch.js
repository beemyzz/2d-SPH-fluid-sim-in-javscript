var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var simMinWidth = 20.0;
var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;
var boundary = new Rectangle(simWidth/2, simHeight/2, simWidth, simHeight);
var numParticles = 1000;
var radius =0.1;
var restitution =1;
var smoothinglength = radius*3
var paused = false;
var skips = 0;
var speedcolors = false;

function cX(position){
  return position.x * cScale;
}

function cY(position){
  return position.y * cScale;
}
document.getElementById("pause").addEventListener("click", function(){ 
  paused = !paused;
});
document.getElementById("skip").addEventListener("click", function(){ 
  skips +=1
});
document.getElementById("particlecolours").addEventListener("click", function(){ 
  speedcolors = !speedcolors;

});
const sliders = document.querySelectorAll('.slider input[type="range"]');
sliders.forEach(slider => {
    const variableName = slider.id.replace('-', '_');
    window[variableName] = parseInt(slider.value);
});


sliders.forEach(slider => {
    slider.addEventListener('input', function() {
        const variableName = this.id.replace('-', '_');
        window[variableName] = parseInt(this.value); 
        console.log(variableName + ": " + window[variableName]); 
        fluidSimulator.viscoscity = window.viscoscity
        fluidSimulator.pressuremultiplier = window.pressuremultiplier         
        fluidSimulator.restdensity = window.restdensity   
        fluidSimulator.gravity.y = window.gravity     
        userparticle.radius = window.ballradius   
                                                                                           
    });
});

document.getElementById("Restart").addEventListener("click", function () {

  fluidSimulator.numParticles = document.getElementById("numparticles").value
  fluidSimulator.particles = [];
  fluidSimulator.generateParticlesGrid();


  simulate();
});

function updateuserparticle(e){
  let rect = canvas.getBoundingClientRect();
  let x =( e.clientX - rect.left)/(cScale);
  let y = (e.clientY - rect.top)/(cScale);
  userparticle.position  = new Vector(x,y)

}


function buildqtree(){

  qtree = new QuadTree(boundary, 18);
  p = new Point(userparticle.position.x,userparticle.position.y,userparticle)
  qtree.insert(p)
  for (const particle of fluidSimulator.particles){
    let p = new Point(particle.position.x,particle.position.y,particle)
    qtree.insert(p)
  }
}
function physics(){
  let particles = fluidSimulator.particles

  for (let p of particles){
    let range = new Circle(p.position.x,p.position.y,p.smoothinglength)
    let others = qtree.query(range);
    p.updateacceleration(others);

  }

  let range = new Circle(userparticle.position.x,userparticle.position.y,userparticle.radius)
  let others = qtree.query(range);
  for (let p of others){
    userparticle.velocity = new Vector
    userparticle.handlecollision(p)

  }
  userparticle.velocity = new Vector

  


}


function draw() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  userparticle.show()

  for (const p of fluidSimulator.particles){

    p.updatespeeds()
    p.checkboundarys()

    p.show()
    



  }

}
function simulate(){
  buildqtree()

  if (!paused || skips > 0){
    physics();
    draw();

    if (skips > 0){
      skips -=1
    }
  }


  
  requestAnimationFrame(simulate);
}
var fluidSimulator = new SPHFluidSimulator();
let userparticle = new Particle(simWidth/2,simHeight/2)
userparticle.radius = 2
userparticle.userball = true
let qtree;
fluidSimulator.generateParticlesGrid()

simulate();