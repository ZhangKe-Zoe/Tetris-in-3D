"use strict";
//Initialize webGL with camera and lights
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('black');
renderer.shadowMap.enabled = true;
//Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(13, 11, 16);
camera.lookAt(scene.position);
//Add lights
const ambientLight = new THREE.AmbientLight(0x505050);
scene.add(ambientLight);
const light = new THREE.SpotLight(0xffffff);
light.position.set(5, 3, 20);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 40;
scene.add(light);

//1. Create a playing field of 5*6*12 units.
const length = 5;
const width = 6;
const height = 12;

let piece;
let isAutomode;
let isAxes;

function createGrid(length, width, color) {
    const grid = new THREE.Object3D();
    for (let i = length; i >= 0; i--) {
        const material = new THREE.LineBasicMaterial({
            color: color
        });
        const geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, i * length / length, 0), new THREE.Vector3(width, i * length / length, 0));
        const line = new THREE.Line(geometry, material);
        grid.add(line);
    }
    for (let i = width; i >= 0; i--) {
        const material = new THREE.LineBasicMaterial({
            color: color
        });
        const geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(i * width / width, 0, 0), new THREE.Vector3(i * width / width, length, 0));
        const line = new THREE.Line(geometry, material);
        grid.add(line);
    }
    return grid;
}
const gridBlue = createGrid(6, 5, "blue");
scene.add(gridBlue);
const gridRed = createGrid(12, 5, "red");
gridRed.rotation.x = Math.PI / 2;
scene.add(gridRed);
const gridgGreen = createGrid(6, 12, "green");
gridgGreen.rotation.y = -Math.PI / 2;
scene.add(gridgGreen);
//Create a 2D array to record grid's state
function setGrids(length, width, step) {
    const grids = new Array();
    for (let z = height - step; z >= 0; z -= step) {
        for (let y = width - step; y >= 0; y -= step) {
            for (let x = length - step; x >= 0; x -= step) {
                grids[z * width * length + y * length + x] = new Array(2);
                grids[z * width * length + y * length + x] = [new THREE.Vector3(x, y, z), false];
            }
        }
    }
    return grids;
}
const grids = setGrids(length, width, 1);

// 2. Create pieces with different color
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
        const material = new THREE.MeshPhongMaterial({
            color: color
        });
        const mesh = new THREE.Mesh(geometry, material);
        cubes[i] = mesh;
    }

    return cubes;
}

function createI() {
    const piece = new Array(2);
    const positions = new Array(4); //relative positions
    const I = new THREE.Object3D();
    const cubes = createCubes("cyan");
    for (let i = 0; i <= cubes.length - 1; i++) {
        cubes[i].position.set(0, i + 0.1, 0);
        positions[i] = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y - 0.1, cubes[i].position.z);
        I.add(cubes[i]);
    }
    I.position.set(0, 0, height - 2);
    piece[0] = I;
    piece[1] = positions;
    return piece;
}

function createJ() {
    const piece = new Array(2);
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
    return piece;
}

function createL() {
    const piece = new Array(2);
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
    return piece;
}

function createO() {
    const piece = new Array(2);
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
    return piece;
}

function createS() {
    const piece = new Array(2);
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
    return piece;
}

function createT() {
    const piece = new Array(2);
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
    return piece;
}

function createZ() {
    const piece = new Array(2);
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
    return piece;
}
//create piece randomly 
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

function getGridIndexs(piece) {
    const gridIndexs = new Array(piece[1].length);
    const worldPosition = new THREE.Vector3();
    piece[0].getWorldPosition(worldPosition);
    let x,
        y,
        z; // world positions
    for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
        x = piece[1][cubeIndex].x + worldPosition.x;
        y = piece[1][cubeIndex].y + worldPosition.y;
        z = piece[1][cubeIndex].z + worldPosition.z;
        gridIndexs[cubeIndex] = z * width * length + y * length + x;
    }
    return gridIndexs;
}

function inFeild(piece) {
    let inFeild = true;
    let x,
        y,
        z;
    for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
        x = piece[1][cubeIndex].x + piece[0].position.x;
        y = piece[1][cubeIndex].y + piece[0].position.y;
        z = piece[1][cubeIndex].z + piece[0].position.z;
        inFeild = x >= 0 && x < length && y >= 0 && y < width && z >= 0 && z < height;
        if (!inFeild) break;
    }
    return inFeild;
}

function isOccupied(gridIndex) {
    return grids[gridIndex][1];
}

function isAvilable(piece) {
    let isAvilable = true;

    if (inFeild(piece)) {
        const gridIndexs = getGridIndexs(piece);
        for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
            if (isOccupied(gridIndexs[cubeIndex])) {
                isAvilable = false;
                break;
            }
        }
    } else {
        isAvilable = false;
    }
    return isAvilable;
}

function fixPiece(piece) {
    const gridIndexs = getGridIndexs(piece);
    for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
        grids[gridIndexs[cubeIndex]][1] = true;
    }
}

// 3. Add the key controls
function mycb(event) {
    event.preventDefault();
    switch (event.keyCode) {
        // left
        case 37:
            {
                piece[0].position.x++;
                if (!isAvilable(piece)) piece[0].position.x--;
                break;
            }
            // right
        case 39:
            {
                piece[0].position.x--;
                if (!isAvilable(piece)) piece[0].position.x++;
                break;
            }
            // forward
        case 38:
            {
                piece[0].position.y++;
                if (!isAvilable(piece)) piece[0].position.y--;
                break;
            }
            //back
        case 40:
            {
                piece[0].position.y--;
                if (!isAvilable(piece)) piece[0].position.y++;
                break;
            }
            //x 
        case 88:
            {
                piece[0].rotation.x += Math.PI / 2;
                let temp;
                for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
                    if (piece[1][cubeIndex].z == 0) temp = piece[1][cubeIndex].z;
                    else temp = -piece[1][cubeIndex].z;
                    piece[1][cubeIndex].z = piece[1][cubeIndex].y;
                    piece[1][cubeIndex].y = temp;
                }
                break;
            }
            //y 
        case 89:
            {
                piece[0].rotation.y += Math.PI / 2;
                let temp;
                for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
                    if (piece[1][cubeIndex].x == 0) temp = piece[1][cubeIndex].x;
                    else temp = -piece[1][cubeIndex].x;
                    piece[1][cubeIndex].x = piece[1][cubeIndex].z;
                    piece[1][cubeIndex].z = temp;
                }

                break;
            }
            //z
        case 90:
            {
                piece[0].rotation.z += Math.PI / 2;
                let temp;
                for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
                    if (piece[1][cubeIndex].y == 0) temp = piece[1][cubeIndex].y;
                    else temp = -piece[1][cubeIndex].y;
                    piece[1][cubeIndex].y = piece[1][cubeIndex].x;
                    piece[1][cubeIndex].x = temp;
                }

                break;
            }
            //a
        case 65:
            {
                if (!isAutomode) {
                    piece[0].position.z--;
                    if (!isAvilable(piece)) piece[0].position.z++;
                }

                break;
            }
            //q
        case 81:
            {
                piece[0].position.z++;
                if (!isAvilable(piece)) piece[0].position.z--;
                break;
            }
            //space
        case 32:
            {
                if (isAutomode) {
                    piece[0].position.z--;
                    while (isAvilable(piece)) {
                        piece[0].position.z--;
                    }
                    piece[0].position.z++;
                }
                fixPiece(piece);
                piece = createPiece();
                if (isAvilable(piece)) {
                    if (isAxes) piece[0].add(new THREE.AxesHelper(4));
                    if (isAutomode) drop();
                    scene.add(piece[0]);
                } else alert("GAME OVER!");
                break;
            }
    }

}
document.addEventListener('keydown', mycb)

function start() {
    piece = createPiece();
    if (isAxes) piece[0].add(new THREE.AxesHelper(4));
    scene.add(piece[0]);
    if (isAutomode) drop();
}

//4. Implement two playing modes which can be chosen with some check box
function myControls() {
    isAutomode = document.getElementById("mode").checked;
    isAxes = document.getElementById("axes").checked;
}

function drop() {
    setInterval(function() {
            if (isAutomode)
                piece[0].position.z--;
            if (!isAvilable(piece)) piece[0].position.z++;
        },
        1000);
}

//* Render loop
const controls = new THREE.TrackballControls(camera, canvas);
controls.rotateSpeed = 2;

const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

function render() {
    requestAnimationFrame(render);
    controls.update();
    myControls();
    renderer.render(scene, camera);
}
render();
start();