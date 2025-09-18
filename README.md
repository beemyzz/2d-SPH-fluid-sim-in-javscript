# 2d-SPH-fluid-sim-in-javscript
I implemented a 2d fluid simulation in javascript using a particle based approach A fluid is a substance that has no fixed shape and is able to flow (water is a fluid). In smoothed particle hydrodynamics the fluid is divided into discrete particles with mass. You could imagine them as water droplets. The effect of each particle on another particle drastically decreases as the distance gets higher until it is 0. We can determine the exact influence of a particle using a smoothing kernel.This allows for realistic fluid physics with limited equations. If you would like to learn more I have attached a pdf with references I have used to assist me.

# disclaimer
The code presented is not perfect and can be greatly improved I don't recommend using it as a perfect example instead more as inspiration.

# Problems
## Going greatly above 2000 particles can cause lag or erratic behaviour because the particles are tightly packed
you may find above the default 2000 particles the simulation may behave strangely this can be fixed by increasing the canvas size or temporarily decreasing pressure multiplier usually.

# Steps to Use
Simply download the whole contents of the folder and open index.html in your browser from their you will see various settings to customize the experience in real time

## Simulation User Interface features
* Pause/Play and Step 
* Canvas size adjustmants
* Viscosity Scale bar
* Rest Density Scale bar
* Pressure Multiplier Scale bar
* Gravity Scale bar
* Ball Radius Scale bar 
* Switchable speed colours (colors which represent how fast the particles are moving)
* Number of Particles (text box)
*Restart Simulation

Hopefully this interests or helps someone else just as much as previous resources and implementations assisted me when i was making this project for my exam!
