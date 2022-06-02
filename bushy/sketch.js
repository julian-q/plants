const d1 = 94.74;
const d2 = 132.63;
const a0 = 18.95;
const lr = 1.109;
const vr = 1.732;
const df = 50;

let s = [
    ['!', 1],
    ['F', 200],
    ['/', 45],
    ['A']
]

function setup() {
    createCanvas(1000, 1000, WEBGL);
    background('black');

    for (let iter = 0; iter < 10; iter++) {
        let next = [];
        for (let i = 0; i < s.length; i++) {
            let c = s[i];
            if (c[0] === 'A') {
                next.push(
                    ['!', vr],
                    ['F', df],
                    ['['],
                    ['&', a0],
                    ['F', df],
                    ['A'],
                    [']'],
                    ['/', d1],
                    ['['],
                    ['&', a0],
                    ['F', df],
                    ['A'],
                    [']'],
                    ['/', d2],
                    ['['],
                    ['&', a0],
                    ['F', df],
                    ['A'],
                    [']']
                );
            } else if (c[0] === 'F') {
                let l = c[1];
                next.push(
                    ['F', l*lr]
                );
            } else if (c[0] === '!') {
                let w = c[1];
                next.push(
                    ['!', w*vr]
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

function draw() {
    stroke("white");

    let c = s[i];
    if (c[0] === 'F') {
        let a = c[1];
        let xp = x + a * H[0];
        let yp = y + a * H[1];
        let zp = z + a * H[2];
        line(x, y, z, xp, yp, zp);
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
        strokeWeight(w);
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
