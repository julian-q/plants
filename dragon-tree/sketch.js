// seaweed

let s = 'FFFFF[---X][-X][+X][+++X]'; // the string we will manipulate
let x, y, th; // xy coordinates and angle of travel
let blue, green; // colors to lerp between
let t = -5;

function setup() {
    // set some drawing parameters
    createCanvas(1000, 1000);
    colorMode(HSL, 500)
    noStroke()
    background("black");
    strokeWeight(2);
    angleMode(DEGREES);
    // use the grammar to generate a string
    console.log('generating...');
    for (let iter = 0; iter < 8; iter++) {
        let next = '';
        let order = 0;
        for (let i = 0; i < s.length; i++) {
            let c = s.charAt(i);
            if (c === '[') {
                order += 0.5;
            } else if (c === ']') {
                order -= 0.5;
            }
            if (c === 'X') {
                let prob = 0.8;
                if (order > 3) {
                    prob = 0.3;
                }
                if (Math.random() < prob) {
                    next += '[[-FX]+[FX]]';
                } else {
                    next += 'FX';
                }
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

    blue = color("blue");
    green = color("green");
}



let i = 0; // string index
let stack = []; // to store configs when encountering brackets
const dl = 50; // forward draw distance (pixels)
const dth = 25; // average rotation angle (degrees)
const max_inc_th = 10 // maximum deviation from average rotationg angle (degrees)
const ath = 10; // adjustment angle (degrees)


function draw() {
    function gradientLine(x1, y1, x2, y2, c1, c2, sz) {
        const d = dist(x1, y1, x2, y2)
        for (let i = 0; i < d; i++) {
          const step = map(i, 0, d, 0, 1)
          const x = lerp(x1, x2, step)
          const y = lerp(y1, y2, step)
          const c = lerpColor(c1, c2, step)
          fill(c)
          ellipse(x, y, sz, sz)
        }
    }

    function normal(n=8) {
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += Math.random();
        }
        return ((sum / n) * 2) - 1; // mean is 0, output in [-1, 1]
    }

    function boundary(i) {
        return ((i - width / 2)**2) * 0.0005 + 500
        // return 140 * log(i) - 300
    }

    function pre_boundary(i, width=dl/2) {
        return boundary(i) + width; 
    }

    for (let i = 0; i < width; i++) {
        point(i, boundary(i));
        point(i, pre_boundary(i));
    }


    let c = s.charAt(i);
    if (c === 'F') {
        // draw forward
        let xp = x + dl * cos(th);
        // while (y - dl * sin(th) < boundary(xp)) {
        //     th -= ath * (normal() + 1);
        // }
        let yp = y - dl * sin(th);
        if (yp >= boundary(xp)) {
            if (y >= pre_boundary(xp)) {
                while (y - dl * sin(th) < boundary(xp)) {
                        th -= ath * (normal() + 1);
                    }
                yp = y - dl * sin(th);
            }
            // stroke(lerpColor(green, blue, sigmoid(t)));
            gradientLine(x, y, xp, yp, color(1000 - y, 200, 200), color(1000 - yp, 200, 200), 3);
            // line(x, y, xp, yp);
            x = xp;
            y = yp;
        }   
    } else if (c === '-') {
        // rotate left
        while (th - dth < 0) {
            th += ath * (normal() + 1);
        }
        th -= dth + max_inc_th * (Math.random() * 2 - 1);
    } else if (c === '+') {
        // rotate right
        while (th + dth > 180) {
            th -= ath * (normal() + 1);
        }
        th += dth + max_inc_th * (Math.random() * 2 - 1);
    } else if (c === '[') {
        // save current config
        stack.push([x, y, th]);
        t += 2;
    } else if (c === ']') {
        // get last saved config
        [x, y, th] = stack.pop();
        t -= 2;
    } else if (c === 'X') {
    
    }

    i++;
    if (i == s.length) {
        // i = 0;
        // // clear the screen and reset coords
        // background("white");
        // console.log('reseting...');
        // x = width / 2;
        // y = height;
        // th = 90;
    }
}

function sigmoid(x) {
    return 1 / (1 + exp(-x));
}
