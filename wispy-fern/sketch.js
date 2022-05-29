// wispy fern

let s = 'X'; // the string we will manipulate
let x, y, th; // xy coordinates and angle of travel
let brown, green; // colors to lerp between
let t = 0;

function setup() {
    // set some drawing parameters
    createCanvas(1000, 1000);
    background("white");
    stroke("black");
    strokeWeight(2);
    angleMode(DEGREES);
    // use the grammar to generate a string
    console.log('generating...');
    for (let iter = 0; iter < 5; iter++) {
        let next = '';
        for (let i = 0; i < s.length; i++) {
            let c = s.charAt(i);
            if (c === 'X') {
                next += 'F+[[X]-X]-F[-FX]+X';
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
    x = width / 2;
    y = height;
    // start pointing up
    th = 90;

    brown = color("brown");

}

let i = 0; // string index
let stack = []; // to store configs when encountering brackets
const dl = 10; // forward draw distance (pixels)
const dth = 25; // rotation angle (degrees)

function draw() {
    let c = s.charAt(i);
    if (c === 'F') {
        // draw forward
        let xp = x + dl * cos(th);
        let yp = y - dl * sin(th);
        line(x, y, xp, yp);
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
    } else if (c === ']') {
        // get last saved config
        [x, y, th] = stack.pop();
    }

    i++;
    if (i == s.length) {
        i = 0;
        // clear the screen and reset coords
        background("black");
        console.log('reseting...');
        x = width / 2;
        y = height;
        th = 90;
    }
}
