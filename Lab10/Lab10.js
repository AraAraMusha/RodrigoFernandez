"use strict";

var canvas;
var gl;

var numPositions = 36;
var positions = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];
var thetaLoc;

var flag = false; // Flag to control rotation

init();

function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // Position buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    // Event listeners for buttons
    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ToggleButton").onclick = function () { // Toggle rotation
        flag = !flag;
    };

    render();
}

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
    var vertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

    // Updated vertexColors array with swapped colors
    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 0.0, 1.0, 1.0)   // magenta
    ];

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
        positions.push(vertices[indices[i]]);
        // Assign unique colors for each vertex
        colors.push(vertexColors[indices[i]]);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (flag) theta[axis] += 2.0; // Rotate only if flag is true
    gl.uniform3fv(thetaLoc, theta);

    // Draw the cube
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

    // Draw the axes
    drawAxes();

    requestAnimationFrame(render);
}

// Function to draw axes
function drawAxes() {
    var axisPositions = [
        vec4(-1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, -1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 0.0, -1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0)
    ];

    var axisColors = [
        vec4(1.0, 0.0, 0.0, 1.0), // Red for X
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0), // Green for Y
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0), // Blue for Z
        vec4(0.0, 0.0, 1.0, 1.0)
    ];

    // Create buffers for axes
    var aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(axisPositions), gl.STATIC_DRAW);
    var axisPositionLoc = gl.getAttribLocation(thetaLoc, "aPosition");
    gl.vertexAttribPointer(axisPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(axisPositionLoc);

    var acBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, acBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(axisColors), gl.STATIC_DRAW);
    var axisColorLoc = gl.getAttribLocation(thetaLoc, "aColor");
    gl.vertexAttribPointer(axisColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(axisColorLoc);

    gl.drawArrays(gl.LINES, 0, 6);
}
