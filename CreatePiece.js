"use static";
function createCubes(color) {
    const cubes = new Array(4);
    const length = 0.9,
          width = 0.9;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);
    const extrudeSettings = {
        steps: 1,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 1
    };

    for (let i = cubes.length - 1; i >= 0; i--) {
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial({color: color});
        const mesh = new THREE.Mesh(geometry, material);
        cubes[i] = mesh;
    }
    return cubes;
}
//Create different shapes 
function createI() {
    const piece = new Array(3); //Piece and Cubes
    const positions = new Array(4); //Relative positions
    const I = new THREE.Object3D();
    const cubes = createCubes("cyan");
    for (let i = 0; i <= cubes.length - 1; i++) {
        cubes[i].position.set(0, i + 0.1, 0);
        I.add(cubes[i]);
        cubes[i] = cubes[i];
        positions[i] = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y - 0.1, cubes[i].position.z);
    }
    I.position.set(0, 0, height - 2);
    piece[0] = I;
    piece[1] = positions;
    piece[2] = cubes;
    return piece;
}

function createJ() {
    const piece = new Array(3);
    const positions = new Array(4);
    const J = new THREE.Object3D();
    const cubes = createCubes("blue");
    for (let i = 0; i <= cubes.length - 1; i++) {
        cubes[i].position.set(0, i + 0.1, 1);
        if (i == cubes.length - 1) cubes[i].position.set(0, i - 1 + 0.1, 0);
        positions[i] = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y - 0.1, cubes[i].position.z);
        J.add(cubes[i]);
    }
    J.position.set(0, 0, height - 2);
    piece[0] = J;
    piece[1] = positions;
    piece[2] = cubes;
    return piece;
}

function createL() {
    const piece = new Array(3);
    const positions = new Array(4);
    const L = new THREE.Object3D();
    const cubes = createCubes("orange");
    for (let i = 0; i <= cubes.length - 1; i++) {
        cubes[i].position.set(0, i + 0.1, 1);
        if (i == cubes.length - 1) cubes[i].position.set(0, 0.1, 0);
        positions[i] = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y - 0.1, cubes[i].position.z);
        L.add(cubes[i]);
    }
    L.position.set(0, 0, height - 2);
    piece[0] = L;
    piece[1] = positions;
    piece[2] = cubes;
    return piece;
}

function createO() {
    const piece = new Array(3);
    const positions = new Array(4);
    const O = new THREE.Object3D();
    const cubes = createCubes("yellow");
    for (let i = 0; i <= cubes.length - 1; i++) {
        cubes[i].position.set(0, i + 0.1, 0);
        if (i > 2) cubes[i].position.set(0, i - 2 + 0.1, 1);
        positions[i] = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y - 0.1, cubes[i].position.z);
        O.add(cubes[i]);
    }
    O.position.set(0, 0, height - 2);
    piece[0] = O;
    piece[1] = positions;
    piece[2] = cubes;
    return piece;
}

function createS() {
    const piece = new Array(3);
    const positions = new Array(4);
    const S = new THREE.Object3D();
    const cubes = createCubes("green");
    for (let i = 0; i <= cubes.length - 1; i++) {
        cubes[i].position.set(0, i + 0.1, 0);
        if (i > 2) cubes[i].position.set(0, i - 1 + 0.1, 1);
        positions[i] = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y - 0.1, cubes[i].position.z);
        S.add(cubes[i]);
    }
    S.position.set(0, 0, height - 2);
    piece[0] = S;
    piece[1] = positions;
    piece[2] = cubes;
    return piece;
}

function createT() {
    const piece = new Array(3);
    const positions = new Array(4);
    const T = new THREE.Object3D();
    const cubes = createCubes("purple");
    for (let i = 0; i <= cubes.length - 1; i++) {
        cubes[i].position.set(0, i + 0.1, 1);
        if (i == cubes.length - 1) cubes[i].position.set(0, i - 2 + 0.1, 0);
        positions[i] = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y - 0.1, cubes[i].position.z);
        T.add(cubes[i]);
    }
    T.position.set(0, 0, height - 2);
    piece[0] = T;
    piece[1] = positions;
    piece[2] = cubes;
    return piece;
}

function createZ() {
    const piece = new Array(3);
    const positions = new Array(4);
    const Z = new THREE.Object3D();
    const cubes = createCubes("red");
    for (let i = 0; i <= cubes.length - 1; i++) {
        cubes[i].position.set(0, i + 0.1, 1);
        if (i >= 2) cubes[i].position.set(0, i - 1 + 0.1, 0);
        positions[i] = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y - 0.1, cubes[i].position.z);
        Z.add(cubes[i]);
    }
    Z.position.set(0, 0, height - 2);
    piece[0] = Z;
    piece[1] = positions;
    piece[2] = cubes;
    return piece;
}
//Create piece randomly 
function createPiece() {
    const flag = Math.random() * 80;
    let piece;
    if (flag <= 10) piece = createI();
    else if (flag > 10 && flag <= 20) piece = createJ();
    else if (flag > 20 && flag <= 30) piece = createL();
    else if (flag > 30 && flag <= 40) piece = createO();
    else if (flag > 50 && flag <= 60) piece = createS();
    else if (flag > 60 && flag <= 70) piece = createT();
    else piece = createZ();
    return piece;
}
