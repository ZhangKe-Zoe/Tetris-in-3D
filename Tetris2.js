"use strict";
///* Initialize webGL with camera and lights
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
window.onresize = resizeCanvas;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('black');
renderer.shadowMap.enabled = true;
// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(13, 11, 16);
camera.lookAt(scene.position);
// Add lights
const ambientLight = new THREE.AmbientLight(0x505050);
scene.add(ambientLight);
const light = new THREE.SpotLight(0xffffff);
light.position.set(5, 3, 20);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 40;
scene.add(light);

const length = 5;
const width = 6;
const height = 12;

let piece;
let isAtuomode;
let isAxes;

//1. Create a playing field of 5*6*12 units.
const gridBlue = createGrid(width, length, "blue");
scene.add(gridBlue);
const gridRed = createGrid(height, length, "red");
gridRed.rotation.x = Math.PI / 2;
scene.add(gridRed);
const gridgGreen = createGrid(width, height, "green");
gridgGreen.rotation.y = -Math.PI / 2;
scene.add(gridgGreen);

//1.Create a 2D array to record grid's position and state
const grids = setGrids(length,width,1);

//2. Create pieces 
function start() {
    piece = createPiece();
    if (isAxes) piece[0].add(new THREE.AxisHelper(4));
    scene.add(piece[0]);
    if (isAtuomode) drop();
}
function getcubePositin(objposition,cube)
{
    return cube.clone().add(objposition);
}
function getGridIndexs(piece) {
    const gridIndexs = new Array(piece[1].length);
    let cubePositin;
    for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
        cubePositin = getcubePositin(piece[0].position,piece[1][cubeIndex]);
        gridIndexs[cubeIndex] = cubePositin.z * width * length + cubePositin.y * length + cubePositin.x;
    }
    return gridIndexs;
}

function inFeild(piece) {
    let inFeild = true;
    let cubePositin;
    for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
        cubePositin = getcubePositin(piece[0].position,piece[1][cubeIndex]);
        inFeild = cubePositin.x >= 0 && cubePositin.x < length 
               && cubePositin.y >= 0 && cubePositin.y < width 
               && cubePositin.z >= 0 && cubePositin.z < height;
        if (!inFeild) break;
    }
    return inFeild;
}

function isOccupied(gridIndex) {
    return grids[gridIndex][1];
}

function isAvailable(piece) {
    let isAvailable = true;

    if (inFeild(piece)) {
        const gridIndexs = getGridIndexs(piece);
        for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
            if (isOccupied(gridIndexs[cubeIndex])) {
                isAvailable = false;
                break;
            }
        }
    } else {
        isAvailable = false;
    }
    return isAvailable;
}

function fixPiece(piece) {
    const gridIndexs = getGridIndexs(piece);
    for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
        grids[gridIndexs[cubeIndex]][1] = true;
    }
}

// 3. Add the following key controls
function mycb(event) {
    event.preventDefault();
    switch (event.keyCode) {
        //Left
        case 37:
            {
                piece[0].position.x++;
                if (!isAvailable(piece)) piece[0].position.x--;
                break;
            }
            //Right
        case 39:
            {
                piece[0].position.x--;
                if (!isAvailable(piece)) piece[0].position.x++;
                break;
            }
            //Forward
        case 38:
            {
                piece[0].position.y++;
                if (!isAvailable(piece)) piece[0].position.y--;
                break;
            }
            //Backword
        case 40:
            {
                piece[0].position.y--;
                if (!isAvailable(piece)) piece[0].position.y++;
                break;
            }
            //x
        case 88:
            {
                piece[0].rotation.x += Math.PI / 2;
                for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
                    const eu = new THREE.Euler(Math.PI / 2, 0, 0, "XYZ");
                    const m = new THREE.Matrix4();
                    m.makeRotationFromEuler(eu);
                    piece[1][cubeIndex].applyMatrix4(m).round();
                }
                break;
            }
            //y
        case 89:
            {
                piece[0].rotation.y += Math.PI / 2;
                for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
                    const eu = new THREE.Euler(0, Math.PI / 2, 0, "XYZ");
                    const m = new THREE.Matrix4();
                    m.makeRotationFromEuler(eu);
                    piece[1][cubeIndex].applyMatrix4(m).round();
                }
                break;
            }
            //z
        case 90:
            {
                piece[0].rotation.z += Math.PI / 2;
                for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
                    const eu = new THREE.Euler(0, 0, Math.PI / 2, "XYZ");
                    const m = new THREE.Matrix4();
                    m.makeRotationFromEuler(eu);
                    piece[1][cubeIndex].applyMatrix4(m).round();
                }
            }
            //a, drop an unit
        case 65:
            {
                if (!isAtuomode) {
                    piece[0].position.z--;
                    if (!isAvailable(piece)) piece[0].position.z++;
                }
                for (let cubeIndex = 0; cubeIndex < piece[1].length; cubeIndex++) {
                    piece[2][cubeIndex].rotation.x += Math.PI / 2;
                }

                break;
            }
            //q, up an unit
        case 81:
            {
                piece[0].position.z++;
                if (!isAvailable(piece)) piece[0].position.z--;
                break;
            }
            //Space
        case 32:
            {
                if (isAtuomode) {
                    piece[0].position.z--;
                    while (isAvailable(piece)) {
                        piece[0].position.z--;
                    }
                    piece[0].position.z++;
                }
                fixPiece(piece);
                piece = createPiece();
                if (isAvailable(piece)) {
                    if (isAxes) piece[0].add(new THREE.AxisHelper(4));
                    if (isAtuomode) drop();
                    scene.add(piece[0]);
                } else alert("GAME OVER!");
                break;
            }
    }

}
document.addEventListener('keydown', mycb)

//// 4. Implement two playing modes which can be chosen with some check box
function myControls() {
    isAtuomode = document.getElementById("mode").checked;
    isAxes = document.getElementById("axes").checked;
}

function drop() {
    setInterval(function() {
            piece[0].position.z--;
            if (!isAvailable(piece)) piece[0].position.z++;
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