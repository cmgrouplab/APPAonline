const average = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;


function calculateInnerProduct(step, particles, distanceForCorr, innerProduct) {
    for (i = 0; i < NUMBER; i++) {
        for (j = 0; j < NUMBER; j++) {
            //console.log(distanceForCorr);
            distanceForCorr[i][j] = boundaryDistance(particles[step][i], particles[step][j]);


            let innerV = particles[step][i].velocity[0] * particles[step][j].velocity[0] + particles[step][i].velocity[1] * particles[step][j].velocity[1];
            let Vxi = particles[step][i].velocity[0];
            let Vyi = particles[step][i].velocity[1];
            let vi = Math.sqrt(Vxi * Vxi + Vyi * Vyi);
            let Vxj = particles[step][j].velocity[0];
            let Vyj = particles[step][j].velocity[1];
            let vj = Math.sqrt(Vxj * Vxj + Vyj * Vyj);
            innerProduct[i][j] = innerV / (vi * vj);
        }
    }
}

function correlationValue(r, distanceForCorr, innerProduct) {
    let inner = [];
    for (i = 0; i < NUMBER; i++) {
        for (j = 0; j < NUMBER; j++) {
            if (i != j && distanceForCorr[i][j] <= (r + 0.04) && distanceForCorr[i][j] > r) {
                inner.push(innerProduct[i][j]);
                //console.log('yes');

            }
        }
    }
    let averageInner = average(inner);
    //console.log(r, averageInner);
    return averageInner;
}

function correlationFunction(correlationX, correlationY, distanceForCorr, innerProduct) {
    let initr = 2 * RADIUS;
    for (r = initr; r < Math.sqrt(2) * LENGTH / 2; r += 0.04) {
        correlationX.push(r + 0.04 / 2);
        correlationY.push(correlationValue(r, distanceForCorr, innerProduct));
        //console.log(r);

    }
}

function getCorrelation(step, particles) {
    var correlationX = [];
    var correlationY = [];

    var distanceForCorr = new Array(NUMBER);
    for (i = 0; i < NUMBER; i++) {
        distanceForCorr[i] = new Array(NUMBER);
    }
    var innerProduct = new Array(NUMBER);
    for (i = 0; i < NUMBER; i++) {
        innerProduct[i] = new Array(NUMBER);
    }
    //console.log(distanceForCorr[0][0]);
    calculateInnerProduct(step, particles, distanceForCorr, innerProduct);
    correlationFunction(correlationX, correlationY, distanceForCorr, innerProduct);


    return [correlationX, correlationY];
}