"use strict";

let gl;
let tParam = 0.0;
let deltaT = 0.05;
let colorLoc;
let morph = true;

function createBuffer(vertices, positionLoc) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    return buffer;
}

function init() {
    const canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) {
        alert("WebGL not available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    const rectangle = [
        vec2(-0.75, 0.5),
        vec2(0.75, 0.5),
        vec2(0.75, -0.5),
        vec2(-0.75, -0.5)
    ];

    const diamond = [
        vec2(0.0, 0.75),
        vec2(0.75, 0.0),
        vec2(0.0, -0.75),
        vec2(-0.75, 0.0)
    ];

    const rectPositionLoc = gl.getAttribLocation(program, "rectPosition");
    createBuffer(rectangle, rectPositionLoc);

    const diamondPositionLoc = gl.getAttribLocation(program, "diamondPosition");
    createBuffer(diamond, diamondPositionLoc);

    const tLoc = gl.getUniformLocation(program, "t");
    colorLoc = gl.getUniformLocation(program, "inColor");

    document.getElementById("Morph").onclick = toggleMorph;

    render(tLoc);
}

function toggleMorph() {
    morph = !morph;
}

function render(tLoc) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (morph) {
        tParam += deltaT;
    }

    if (tParam >= 1.0 || tParam <= 0.0) {
        deltaT = -deltaT;
    }

    gl.uniform1f(tLoc, tParam);

    const yellow = vec4(1.0, 1.0, 0.0, 1.0);
    const green = vec4(0.0, 1.0, 0.0, 1.0);
    const color = mix(yellow, green, tParam);
    gl.uniform4fv(colorLoc, color);
    gl.drawArrays(gl.LINE_LOOP, 0, 4);
    const wait = 75;
    setTimeout(() => requestAnimationFrame(() => render(tLoc)), wait);
}

init();


























