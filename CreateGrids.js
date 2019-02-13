"use static";
function createLine(start, end, color) {
    const material = new THREE.LineBasicMaterial({ color: color });
    const geometry = new THREE.Geometry();
    geometry.vertices.push(start, end, 0);
    const line = new THREE.Line(geometry, material);
    return line;
}

function createGrid(length, width, color) {
    const grid = new THREE.Object3D();
    for (let i = length; i >= 0; i--) {
        grid.add(createLine(new THREE.Vector3(0, i * length / length, 0), new THREE.Vector3(width, i * length / length), color));
    }
    for (let i = width; i >= 0; i--) {
        grid.add(createLine(new THREE.Vector3(i * width / width, 0, 0), new THREE.Vector3(i * width / width, length), color));
    }
    return grid;
}

function setGrids(length, width, step) {
    const grids = new Array();
    for (let z = height - step; z >= 0; z-=step) {
        for (let y = width - step; y >= 0; y-=step) {
            for (let x = length - step; x >= 0; x-=step) {
                grids[z * width * length + y * length + x] = new Array(2);
                grids[z * width * length + y * length + x] = [new THREE.Vector3(x, y, z), false];
            }
        }
    }
    return grids;
}