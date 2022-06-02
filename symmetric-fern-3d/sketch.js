// symmetric fern

let s = 'X'; // the string we will manipulate
let x, y, th; // xy coordinates and angle of travel
let brown, green; // colors to lerp between
let t = -5;

function setup() {
    // set some drawing parameters
    createCanvas(500, 500, WEBGL);
    // background("white");
    strokeWeight(2);
    angleMode(DEGREES);
    // use the grammar to generate a string
    console.log('generating...');
    for (let iter = 0; iter < 8; iter++) {
        let next = '';
        for (let i = 0; i < s.length; i++) {
            let c = s.charAt(i);
            if (c === 'X') {
                next += 'F[+X][-X]FX';
            } else if (c === 'F') {
                next += 'FF';
            } else {
                next += c;
            }
        }
        s = next;
        console.log(s);
    }
    // start at the bottom middle
    x = 0;
    y = height / 2;
    // start pointing up
    th = 90;

    brown = color("brown");
    green = color("green");
}

let i = 0; // string index
let stack = []; // to store configs when encountering brackets
const dl = 2; // forward draw distance (pixels)
const dth = 25.7; // rotation angle (degrees)

function draw() {
    push();
    // rotateY(mouseX);
    beginShape(LINES);
    let c = s.charAt(i);
    if (c === 'F') {
        // draw forward
        let xp = x + dl * cos(th);
        let yp = y - dl * sin(th);
        // stroke(lerpColor(brown, green, sigmoid(t)));
        stroke("white");
        line(x, y, 0, xp, yp, 0);
        x = xp;
        y = yp;
    } else if (c === '-') {
        // rotate left
        th -= dth;
    } else if (c === '+') {
        // rotate right
        th += dth;
    } else if (c === '[') {
        // save current config
        stack.push([x, y, th]);
        t += 2;
    } else if (c === ']') {
        // get last saved config
        [x, y, th] = stack.pop();
        t -= 2;
    }

    i++;
    if (i == s.length) {
        i = 0;
        // clear the screen and reset coords
        background("white");
        console.log('reseting...');
        x = width / 2;
        y = height;
        th = 90;
    }
    endShape();
    pop();
}


function sigmoid(x) {
    return 1 / (1 + exp(-x));
}
