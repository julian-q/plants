// symmetric fern

let s = 'X'; // the string we will manipulate
let x, y, th; // xy coordinates and angle of travel
let brown, green; // colors to lerp between
let t = -5;
let prob = 1;

function setup() {
    // set some drawing parameters
    createCanvas(1000, 1000);
    background("white");
    strokeWeight(2);
    angleMode(DEGREES);
    // use the grammar to generate a string
    console.log('generating...');
    let order = 0;
    for (let iter = 0; iter < 5; iter++) {
        let next = '';
        for (let i = 0; i < s.length; i++) {
            let c = s.charAt(i);
            switch (c) {
                case 'X':
                    next += 'F[+B][-B]FX';
                    break;
                case 'F':
                    next += 'F';
                    break;
                case 'B':
                    next += 'W[,W][.W]B'
                default:
                    next += c;
            }
        }
        s = next;
        console.log(s);
    }
    // start at the bottom middle
    x = width / 2;
    y = height;
    // start pointing up
    th = 90;

    brown = color("brown");
    green = color("green");
}

let i = 0; // string index
let stack = []; // to store configs when encountering brackets
let dl1 = 10; // forward draw distance (pixels)
let dl2 = 6;
let dth1 = 90; // rotation angle (degrees)
let dth2 = 30;

function draw() {
    let c = s.charAt(i);
    if (c === 'F' || c === 'W') {
        // draw forward
        let dl = c === 'F' ? dl1 : dl2;
        let xp = x + dl * cos(th);
        let yp = y - dl * sin(th);
        stroke(lerpColor(brown, green, sigmoid(t)));
        line(x, y, xp, yp);
        x = xp;
        y = yp;
    } else if (c === '-') {
        // rotate left
        th -= dth1;
    } else if (c === '+') {
        // rotate right
        th += dth1;
    } else if (c === ',') {
        th += dth2;
    } else if (c === '.') {
        th -= dth2;
    } else if (c === '[') {
        // save current config
        stack.push([x, y, th]);
        t += 2;
        // dth -= 2;
    } else if (c === ']') {
        // get last saved config
        [x, y, th] = stack.pop();
        t -= 2;
        // dth += 2;
    }

    i++;
    // if (i == s.length) {
    //     i = 0;
    //     // clear the screen and reset coords
    //     background("white");
    //     console.log('reseting...');
    //     x = width / 2;
    //     y = height;
    //     th = 90;
    // }
}


function sigmoid(x) {
    return 1 / (1 + exp(-x));
}
