
class Particle{
    constructor(x,y){
        this.position = new Vector(x,y);
        this.velocity = new Vector(0,0);
        this.acceleration = fluidSimulator.gravity
        this.radius = radius;
        this.smoothinglength = smoothinglength
        this.mass =1;
        this.density = 1;
        this.pressure =1;
        this.userball = false
    }
    intersects(particle){

        let d = particle.position.distanceFrom(this.position)
        return ( d< this.radius + particle.radius)
    }
    updatespeeds(){
        this.velocity = this.velocity.add(this.acceleration.mulScalar(fluidSimulator.timestep))
        this.position = this.position.add(this.velocity.mulScalar(fluidSimulator.timestep));

    }
    updateacceleration(nearbypoints){
        this.calcdensityandpressure(nearbypoints);
        this.updateforces(nearbypoints);
        this.currentforce = fluidSimulator.gravity
        this.currentforce = this.currentforce.add(this.viscosityforce).sub(this.pressureforce)
        this.acceleration = this.currentforce.divScalar(this.density);



    }
    calcdensityandpressure(nearbypoints){
        let density = 0;
        for (let cparticle of nearbypoints){
            if (cparticle.userball == false){
                    
                if (cparticle != self){
                    let distance = this.position.distanceFrom(cparticle.position);
                    density += cparticle.mass * fluidSimulator.poly6kernel(distance,this.smoothinglength,this.numX)
                    }
                }
                this.density = density ;
                let densityerror =this.density-fluidSimulator.restdensity
                if (densityerror < 0){
                    densityerror = 0
                }
                this.pressure = fluidSimulator.pressuremultiplier*(densityerror);
        
        }
    }

    updateforces(nearbypoints){
        let pressureforce = new Vector;
        var pressurecontribution = 0;
        var viscositycontribution = new Vector;
  
        for (let cparticle of nearbypoints) {


            if (cparticle.particle != this.position && cparticle.userball == false){
                let distance = this.position.distanceFrom(cparticle.position);
                if (distance !== 0){
                    
                let directionvector = cparticle.position.sub(this.position).normalize();
                pressurecontribution = ((this.pressure + cparticle.pressure)/(2*cparticle.density) * cparticle.mass * fluidSimulator.spikykernelderrivative(distance, this.smoothinglength));
                pressureforce = pressureforce.sub(directionvector.mulScalar(pressurecontribution));
                viscositycontribution = viscositycontribution.add(cparticle.velocity.sub(this.velocity).mulScalar(fluidSimulator.viscoscity * cparticle.mass * fluidSimulator.viscositykernelsecondderivative(distance,this.smoothinglength)/cparticle.density));


                }
                     
            }
        }

        this.viscosityforce = viscositycontribution;
        this.pressureforce = pressureforce;


    }
    checkboundarys(){
        if (this.position.x - this.radius < 0.0) {
          this.position.x = 0.0 + this.radius;
          this.velocity.x = -fluidSimulator.collisionDamping*this.velocity.x;
        }
      
        if (this.position.x + this.radius > simWidth) {
            this.position.x = simWidth - this.radius;
            this.velocity.x = -fluidSimulator.collisionDamping*this.velocity.x;
        }
        
        if (this.position.y - this.radius < 0.0) {
            this.position.y = 0.0 + this.radius;
            this.velocity.y = -fluidSimulator.collisionDamping*this.velocity.y;
        }
        
        if (this.position.y + this.radius > simHeight) {
            this.position.y = simHeight - this.radius; 
            this.velocity.y = -fluidSimulator.collisionDamping*this.velocity.y;
        }
      }
  
    show(){
        if (speedcolors) {

            let speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        

            let normalizedSpeed = speed / 3; // Assuming maxSpeed is the m
        

            let redComponent = Math.floor(255 * normalizedSpeed);
            let blueComponent = Math.floor(255 * (1 - normalizedSpeed));
        

            c.fillStyle = `rgb(${redComponent}, 0, ${blueComponent})`;
        } else {

            c.fillStyle = "#005493";
        }
        c.beginPath();
        c.arc(cX(this.position), cY(this.position), cScale * this.radius, 0.0, 2 * Math.PI);
        c.closePath();
        c.fill();
    }
    handlecollision(particle) {
        if(this != particle){

            let distance = this.position.distanceFrom(particle.position);
            let minDistance = this.radius + particle.radius;
    
            
            if(distance <= minDistance){

              let normal = particle.position.sub(this.position).normalize();
              let relativeVelocity = particle.velocity.sub(this.velocity);
              let impulse = normal.mulScalar(relativeVelocity.dot(normal) );
    

              let repulsion = normal.mulScalar( minDistance - distance);
    
            
              this.velocity = this.velocity.add(impulse);
              particle.velocity = particle.velocity.sub(impulse);  
                if (!this.userball){
                    this.position = this.position.sub(repulsion);
                }

              particle.position = particle.position.add(repulsion);
          
          }
        }

    
}
}