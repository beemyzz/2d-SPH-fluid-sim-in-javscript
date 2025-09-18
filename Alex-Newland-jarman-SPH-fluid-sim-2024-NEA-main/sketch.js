const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let simMinWidth = 20.0;
let cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
let simWidth = canvas.width / cScale;
let simHeight = canvas.height / cScale;
let boundary = new Rectangle(simWidth/2, simHeight/2, simWidth, simHeight);
let numParticles = 1000;
let radius =0.1;
let paused = false;
let skips = 0;
let speedcolors = false;
const MAX_DT = 0.1;     // clamp at 100 ms
let userparticleradius =2
const canvasWidthInput  = document.getElementById('canvas_width');
const canvasHeightInput = document.getElementById('canvas_height');
const fpsDisplay        = document.getElementById('fps-display');
let fluidSimulator = new SPHFluidSimulator(numParticles,simWidth,simHeight);

let userparticle = new Particle(simWidth/2,simHeight/2);
userparticle.radius = userparticleradius ;
userparticle.userball = true;
let qtree;
function cX(position){
  return position.x * cScale;
}

function cY(position){
  return position.y * cScale;
}

function resizeCanvas() {
    const w = +canvasWidthInput.value;
    const h = +canvasHeightInput.value;
    canvas.width  = w;
    canvas.height = h;

    cScale = Math.min(w, h) / simMinWidth;
    simWidth  = w / cScale;
    simHeight = h / cScale;
    boundary  = new Rectangle(simWidth/2, simHeight/2, simWidth, simHeight);

    resetSimulation();
}

canvasWidthInput.addEventListener('change', resizeCanvas);
canvasHeightInput.addEventListener('change', resizeCanvas);

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



function updateuserparticle(e){
  let rect = canvas.getBoundingClientRect();
  let x =( e.clientX - rect.left)/(cScale);
  let y = (e.clientY - rect.top)/(cScale);
  userparticle.position  = new Vector(x,y)

}


function buildqtree(){

  qtree = new QuadTree(boundary, 60);
  let p = new Point(userparticle.position.x,userparticle.position.y,userparticle)
  qtree.insert(p)
  for (const particle of fluidSimulator.particles){
    let p = new Point(particle.position.x,particle.position.y,particle)
    qtree.insert(p)
  }
}
function physics(){
  let particles = fluidSimulator.particles

  for (let p of particles){
    p.updateacceleration();

  }

  let range = new Circle(userparticle.position.x,userparticle.position.y,userparticle.radius*2)
  let others = qtree.query(range);
  for (let p of others){
    userparticle.handlecollision(p)

  }


  


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

let lastFrameTime = 0;  
let lastFpsTime   = 0;  
let frameCount    = 0;
// --- FPS tracking state ---
let frameTimes = [];          
let FPS_SAMPLES = 60;       
let FPS_UPDATE_INTERVAL = 500; 
let lastFpsUpdate = 0;

let rafId = null;
function simulate(now) {
    buildqtree();

    if (!lastFrameTime) {
        lastFrameTime = now;
        lastFpsTime   = now;
        lastFpsUpdate = now;
        rafId = requestAnimationFrame(simulate);
        return;
    }

    let dt = (now - lastFrameTime) / 1000;
    dt =  Math.min(dt, MAX_DT);
    lastFrameTime = now;

    frameTimes.push(dt);
    if (frameTimes.length > FPS_SAMPLES) {
        frameTimes.shift(); 
    }

    if (now - lastFpsUpdate >= FPS_UPDATE_INTERVAL) {
        const avgDt = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const avgFps = (1 / avgDt).toFixed(1);
        fpsDisplay.textContent = `FPS: ${avgFps}`;
        lastFpsUpdate = now;
    }

    fluidSimulator.timestep = dt;
    if (!paused || skips > 0) {
        physics();
        draw();
        if (skips > 0) skips--;
    }

    rafId = requestAnimationFrame(simulate);
}
function resetSimulation() {
    // Stop any existing loop
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    lastFrameTime = 0;
    lastFpsTime   = 0;
    frameCount    = 0;
    frameTimes = [];
    lastFpsUpdate = 0;

    paused = false;
    skips = 0;

    const n = document.getElementById("numparticles").value;
    
    fluidSimulator = new SPHFluidSimulator(n, simWidth, simHeight);
    fluidSimulator.generateParticlesGrid();

    userparticle = new Particle(simWidth / 2, simHeight / 2);
    userparticle.radius = userparticleradius;
    userparticle.userball = true;

    qtree = null;

    simulate(0);
}

document.getElementById("Restart").addEventListener("click", resetSimulation);


fluidSimulator.generateParticlesGrid();

simulate(lastFrameTime);