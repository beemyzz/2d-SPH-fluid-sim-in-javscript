

class SPHFluidSimulator{
    constructor(){
        this.timestep = 1/30;
        this.gravity = new Vector(0,50);
        this.collisionDamping =0.7;
        this.particleSpacing = 0.1;
        this.pressuremultiplier = 3.2;
        this.restdensity = 0.2;
        this.viscoscity = 6;
        this.numParticles = 2000
        this.particles = [];

      

    }
    generateParticlesGrid() {
      const numRows = Math.floor(Math.sqrt(this.numParticles));
      const numCols = Math.ceil(this.numParticles / numRows);
    
      for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
              let particleX = (radius * i)*(-1)**i + simWidth / 2;
              let particleY = (radius * j)*(-1)**j + simHeight / 2;
    
    
              let particle = new Particle(particleX, particleY);
              this.initialiseParticle(particle);
    
          }
      }
    
    
    }

     generateParticlesRandom(){
      const randomGauss = () => {
        const theta = 2 * Math.PI * Math.random();
        const rho = Math.sqrt(-2 * Math.log(1 - Math.random()));
        return (rho * Math.cos(theta)) / 10.0 + 0.5;
      };
      for (let i = 0 ; i < this.numParticles ; i++){
        let particle = new Particle(simWidth*randomGauss(), simHeight*randomGauss());
        this.initialiseParticle(particle);
    
      }
    }
    poly6kernel(r,h){
      let influence = 0
      if ( r>= 0 & r<= h ){
        influence = (h**2 - r**2)**3

      }
      return (4/(Math.PI*h**8))*influence
  
    }
    spikykernelderrivative(r,h){
      let influence = 0
      if (r>= 0 & r<= h){
        influence = -3*(h-r)**2
      }
      return (30/(Math.PI*h**5))*influence
  

    }
    viscositykernelsecondderivative(r,h){
      let influence = 0
      if (r>= 0 & r<= h){
        influence = (h-r)
      }
      return (20/(Math.PI*h**5))*influence
    }
    initialiseParticle(particle) {
        this.particles.push(particle);
    }

    
}