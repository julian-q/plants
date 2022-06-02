const r1 = 0.9;
const r2 = 0.7;
const a0 = 10;
const a2 = 60;
const wr = 0.707;

let s = [
    ['A', 100, 10]
]

function setup() {
    createCanvas(1000, 1000, WEBGL);
    colorMode(HSL, 800);
    noStroke();
    background('black');

    for (let iter = 0; iter < 10; iter++) {
        let next = [];
        for (let i = 0; i < s.length; i++) {
            let c = s[i];
            if (c[0] === 'A') {
                let [l, w] = [c[1], c[2]];
                next.push(
                    ['!', w],
                    ['F', l],
                    ['['],
                    ['&', a0],
                    ['B', l*r1, w*wr],
                    [']'],
                    ['/', 180],
                    ['['],
                    ['&', a2],
                    ['B', l*r2, w*wr],
                    [']']
                );
            } else if (c[0] === 'B') {
                let [l, w] = [c[1], c[2]];
                next.push(
                    ['!', w],
                    ['F', l],
                    ['['],
                    ['+', a0],
                    ['$'],
                    ['B', l*r1, w*wr],
                    [']'],
                    ['['],
                    ['+', -a2],
                    ['$'],
                    ['B', l*r2, w*wr],
                    [']']
                );
            } else {
                next.push(c);
            }
        }
        s = next;
    }
}


let x = 0;
let y = 500;
let z = 0;
let H = [0, -1, 0];
let L = [-1, 0, 0];
let U = math.cross(H, L);

let stack = [];

const V = [0, -1, 0];

let i = 0;
let brush_size = 7;
function draw() {
    // stroke("white");
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
    

    let c = s[i];
    
    if (c[0] === 'F') {
        let a = c[1];
        let xp = x + a * H[0];
        let yp = y + a * H[1];
        let zp = z + a * H[2];
        // line(x, y, z, xp, yp, zp);
        gradientLine(x, y, xp, yp, color(y, 200, 200), color(yp, 200, 200), brush_size)
        x = xp;
        y = yp;
        z = zp;
    } 
    else if (c[0] === 'f') {
        let a = c[1];
        x += a * H[0];
        y += a * H[1];
        z += a * H[2];
    } 
    else if (c[0] === '+') {
        let a = c[1];
        let mat = getMat(U, a);
        H = math.multiply(mat, H);
        L = math.multiply(mat, L);
        U = math.cross(H, L);
    } 
    else if (c[0] === '&') {
        let a = c[1];
        let mat = getMat(L, a);
        H = math.multiply(mat, H);
        L = math.multiply(mat, L);
        U = math.cross(H, L);
    } 
    else if (c[0] === '/') {
        let a = c[1];
        let mat = getMat(H, a);
        H = math.multiply(mat, H);
        L = math.multiply(mat, L);
        U = math.cross(H, L);
    } 
    else if (c[0] === '$') {
        L = math.divide(math.cross(V, L), math.norm(math.cross(V, L)));
        U = math.cross(H, L);
    } 
    else if (c[0] === '!') {
        let w = c[1];
        // strokeWeight(w);
        brush_size = w
    } 
    else if (c[0] === '[') {
        stack.push([x, y, z, H, L, U]);
    } 
    else if (c[0] === ']') {
        [x, y, z, H, L, U] = stack.pop();
    }

    i++;
    if (i == s.length) {
        background('black');
        i = 0;
    }
}

function getMat(axis, a) {
    let ux = axis[0];
    let uy = axis[1];
    let uz = axis[2];
    a *= math.pi / 180;

    return [
        [math.cos(a) + ux * ux * (1 - math.cos(a)), ux * uy * (1 - math.cos(a)) - uz * math.sin(a), ux * uz * (1 - math.cos(a)) + uy * math.sin(a)],
        [uy * ux * (1 - math.cos(a)) + uz * math.sin(a), math.cos(a) + uy * uy * (1 - math.cos(a)), uy * uz * (1 - math.cos(a)) - ux * math.sin(a)],
        [uz * uz * (1 - math.cos(a)) - uy * math.sin(a), uz * uy * (1 - math.cos(a)) + ux * math.sin(a), math.cos(a) + uz * uz * (1 - math.cos(a))]
    ];
}
