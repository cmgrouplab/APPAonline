// This function is for gernerating normal distribution numbers

function getNumberInNormalDistribution(mean, std_dev) {
  return mean + (randomNormalDistribution() * std_dev);
}

function randomNormalDistribution() {
  var u = 0.0, v = 0.0, w = 0.0, c = 0.0;
  do {
    //get two random variables in range（-1,1）
    u = Math.random() * 2 - 1.0;
    v = Math.random() * 2 - 1.0;
    w = u * u + v * v;
  } while (w == 0.0 || w >= 1.0)
  // Box-Muller
  c = Math.sqrt((-2 * Math.log(w)) / w);

  //return [u*c,v*c];
  return u * c;
}