const LENGTH = 1;
const AREAOFBOX = LENGTH * LENGTH;
const DELTATIME = 1;

var DENSITY, RADIUS, NUMBER, V, STEP, STD, ANGLE, KECM, stepforCorr;
var PARTICLES;

function getInputs() {
    DENSITY = parseFloat(document.getElementById("density").value);
    RADIUS = parseFloat(document.getElementById("radius").value);
    STD = parseFloat(document.getElementById("std").value * Math.PI / 180);
    ANGLE = parseFloat(document.getElementById("angle").value);
    STEP = parseInt(document.getElementById("step").value);

    V = 0.05 * RADIUS;
    KECM = RADIUS * 0.0001;
    NUMBER = Math.round(AREAOFBOX * DENSITY / (Math.PI * RADIUS * RADIUS));
}

function getInputs2() {
    stepforCorr = parseFloat(document.getElementById("calVcorr").value);
}

function boundaryDisPlacementX(particleA, particleB) {
    let deltax = particleA.position[0] - particleB.position[0];
    if (Math.abs(deltax) > LENGTH / 2) {
        if (deltax > 0)
            deltax -= LENGTH;
        else
            deltax += LENGTH;
    }
    return deltax;
}

function boundaryDisPlacementY(particleA, particleB) {
    let deltay = particleA.position[1] - particleB.position[1];
    if (Math.abs(deltay) > LENGTH / 2) {
        if (deltay > 0)
            deltay -= LENGTH;
        else
            deltay += LENGTH;
    }
    return deltay;
}

function boundaryDistance(particleA, particleB) {
    let deltax = boundaryDisPlacementX(particleA, particleB);
    let deltay = boundaryDisPlacementY(particleA, particleB);
    return Math.sqrt(deltax * deltax + deltay * deltay);
}

function boundaryCondition(particle) {
    if (particle.position[0] >= LENGTH)
        particle.position[0] -= LENGTH
    if (particle.position[0] < 0)
        particle.position[0] += LENGTH
    if (particle.position[1] >= LENGTH)
        particle.position[1] -= LENGTH
    if (particle.position[1] < 0)
        particle.position[1] += LENGTH
}



function isOverlap(particleA, particleB) {
    return (boundaryDistance(particleA, particleB) < 2 * RADIUS);
}

function isOppositeMove(particleA, particleB) {
    let d = boundaryDistance(particleA, particleB);
    let dv = Math.sqrt(particleA.velocity[0] * particleA.velocity[0] + particleA.velocity[1] * particleA.velocity[1]);

    let deltax = boundaryDisPlacementX(particleA, particleB);
    let deltay = boundaryDisPlacementY(particleA, particleB);
    let cosTheta = (-deltax * particleA.velocity[0] + (-deltay) * particleA.velocity[1]) / (d * dv);
    return (cosTheta >= Math.cos(ANGLE * Math.PI / 180) && (particleA.velocity[0] * particleB.velocity[0] + particleA.velocity[1] * particleB.velocity[1] < 0));
}

function initialization(particles) {
    document.getElementById("showmsg").innerHTML = "NUMBER is: " + NUMBER;
    let i = 0;
    while (i < NUMBER) {
        let x = Math.random() * (LENGTH - 0) + 0;
        let y = Math.random() * (LENGTH - 0) + 0;
        let vx = V * LENGTH * ((Math.random() * (LENGTH - 0)) - 0.5);
        let vy = V * LENGTH * ((Math.random() * (LENGTH - 0)) - 0.5);
        let particle = { position: [x, y], velocity: [vx, vy], force: [0, 0], correctMove: [0, 0] };
        particles[0][i] = particle;
        let hasOverlap = false;
        for (j = 0; j < i; j++) {
            //console.log(isOverlap(particles[0][i], particles[0][j]));
            if (i != j && isOverlap(particles[0][i], particles[0][j])) {
                hasOverlap = true;
                break;
            }
        }
        if (!hasOverlap) {
            i++;
        }
    }
    //document.getElementById("outputText").innerHTML = "particles" + i + "," + x;
    //return particles;
}

function forceECM(step, particles) {
    for (i = 0; i < NUMBER; i++) {
        for (j = 0; j < NUMBER; j++) {
            if (isOppositeMove(particles[step][i], particles[step][j]) & (i != j)) {
                let d = boundaryDistance(particles[step][i], particles[step][j]);
                let deltax = boundaryDisPlacementX(particles[step][i], particles[step][j]);
                let deltay = boundaryDisPlacementY(particles[step][i], particles[step][j]);

                particles[step][i].force[0] += KECM / d * (-deltax / d);
                particles[step][i].force[1] += KECM / d * (-deltay / d);
                //console.log(particles[step][i].force);
            }
        }
    }

}

function move(step, particles) {
    for (i = 0; i < NUMBER; i++) {
        let newX = particles[step][i].position[0] + DELTATIME * particles[step][i].velocity[0];
        let newY = particles[step][i].position[1] + DELTATIME * particles[step][i].velocity[1];


        let oldVx = particles[step][i].velocity[0];
        let oldVy = particles[step][i].velocity[1];
        let v = Math.sqrt(oldVx * oldVx + oldVy * oldVy);

        //Add Force
        let newVx = particles[step][i].velocity[0] + particles[step][i].force[0];
        let newVy = particles[step][i].velocity[1] + particles[step][i].force[1];
        //console.log(particles[step][i].force);
        let velocityAngle = Math.atan2(newVy, newVx);
        newVx = v * Math.cos(velocityAngle);
        newVy = v * Math.sin(velocityAngle);

        //Rotation diffusion
        velocityAngle += getNumberInNormalDistribution(0, STD);
        newVx = v * Math.cos(velocityAngle);
        newVY = v * Math.sin(velocityAngle);
        let newParticle = { position: [newX, newY], velocity: [newVx, newVy], force: [0, 0], correctMove: particles[step][i].correctMove };

        boundaryCondition(newParticle);
        particles[step + 1][i] = newParticle;
        //console.log(particles[1][0]);
    }
}

function correctOverlap(particleA, particleB) {
    let d = boundaryDistance(particleA, particleB);
    let deltax = boundaryDisPlacementX(particleA, particleB);
    let deltay = boundaryDisPlacementY(particleA, particleB);
    let deltaD = 2 * RADIUS - d;

    particleA.correctMove[0] += 0.5 * deltaD * deltax / d;
    particleA.correctMove[1] += 0.5 * deltaD * deltay / d;
    //console.log(particleA.correctMove);
    //return particleA.correctMove;
}

function recordCorrectOverlap(step, particles) {
    for (i = 0; i < NUMBER; i++) {
        for (j = 0; j < NUMBER; j++) {
            if (j != i) {
                if (isOverlap(particles[step][i], particles[step][j])) {
                    correctOverlap(particles[step][i], particles[step][j]);
                    //console.log(particles[step][i].correctMove);
                    //particles[step][i] = { position: particles[step][i].position, velocity: particles[step][i].velocity, force: [0, 0], correctMove: correctOverlap(particles[step][i], particles[step][j]) };
                }
            }
        }
    }
}

function moveCorrectOverlap(step, particles) {
    for (i = 0; i < NUMBER; i++) {
        particles[step][i].position[0] += particles[step][i].correctMove[0];
        particles[step][i].position[1] += particles[step][i].correctMove[1];
        //console.log(newX, newY);
        //console.log(particles[step][i].position);
        particles[step][i].correctMove = [0, 0];
        boundaryCondition(particles[step][i]);
    }
}


function simulation() {
    var start = Date.now();

    getInputs();
    let particles = new Array(STEP + 1);
    for (i = 0; i < STEP + 1; i++) {
        particles[i] = new Array(NUMBER);
    }
    initialization(particles);
    for (step = 0; step < STEP; step++) {

        forceECM(step, particles);
        move(step, particles);
        //console.log(getNumberInNormalDistribution(0, 0.1));

        recordCorrectOverlap(step + 1, particles);
        moveCorrectOverlap(step + 1, particles);
    }

    //console.log(particles);
    //console.log(PARTICLES);
    plotGraphs(particles);
    PARTICLES = particles;

    var duration = MillisecondToTime(Date.now() - start);
    document.getElementById("showmsg").innerHTML = "Running time is: " + duration;
    //console.log(particles);

}

function checkParameters() {
    let d = parseFloat(document.getElementById("density").value);
    let r = parseFloat(document.getElementById("radius").value);
    let s = parseFloat(document.getElementById("std").value * Math.PI / 180);
    let a = parseFloat(document.getElementById("angle").value);
    let stepp = parseInt(document.getElementById("step").value);

    function dIsAccepted(d) {
        return (d > 0 && d <= 0.5)
    }
    function rIsAccepted(r) {
        return (r >= 0.001 && r <= 0.5)
    }
    function sIsAccepted(s) {
        return (s >= 0 && s < 360)
    }
    function aIsAccepted(a) {
        return (a >= 0 && a <= 360)
    }
    function stepIsAccepted(stepp) {
        return (stepp >= 10 && d <= 20000)
    }

    if (dIsAccepted(d) != true)
        alert("Density should be >0 and <= 0.5");
    else if (rIsAccepted(r) != true)
        alert("Radius should be >=0.001 and <= 0.5");
    else if (sIsAccepted(s) != true)
        alert("Strength of Dr should be >=0 and <= 360");
    else if (aIsAccepted(d) != true)
        alert("Angle tolerance should be >=0 and <= 360");
    else if (stepIsAccepted(stepp) != true)
        alert("Run Step should be >=10 and <= 20000");
    else simulation();
}





function coorelationPlot() {
    getInputs2();
    let velocityCorrelation = getCorrelation(stepforCorr - 1, PARTICLES);
    var trace1 = {
        x: velocityCorrelation[0],
        y: velocityCorrelation[1],
        mode: 'lines+markers',
        type: 'scatter'
    };
    var layout = {
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        width: 500,
        height: 500,
        margin: {
            l: 80,
            r: 80,
            b: 80,
            t: 80,
            // pad: 4
        },

        xaxis: {
            title: {
                text: 'Distance(r)'
            },
            range: [0, 0.7],
            showgrid: false,
            mirror: 'ticks',
            zerolinecolor: '#000000',
            // zerolinewidth: 1,
            // linecolor: '#000000',
            // linewidth: 1,
            showticklabels: true
        },
        yaxis: {
            title: {
                text: 'C(r)'
            },
            range: [-1, 1],
            showgrid: false,
            mirror: 'ticks',
            zerolinecolor: '#000000',
            // zerolinewidth: 1,
            // linecolor: '#000000',
            // linewidth: 1,
            showticklabels: true

        }
    };
    var data = [trace1];
    Plotly.newPlot('outputText2', data, layout);
}

