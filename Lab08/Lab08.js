"use strict";

var canvas;
var gl;

var maxNumPositions  = 200;

var t;
var points=[vec2(  0.00 ,  0.00 )];

init();

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    var savePoints = document.getElementById("Button1")
    savePoints.addEventListener("click", function(){
    savePoints = !savePoints;
    points=[vec2(  0.00 ,  0.00 )];
    render();
    });

    canvas.addEventListener("mousedown", function(event){
       if (!savePoints) points=[vec2(  0.00 ,  0.00 )];
       t  = vec2(2*event.clientX/canvas.width-1,
         2*(canvas.height-event.clientY)/canvas.height-1);
       points.push(t);
       render();
    });

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8*Math.pow(3, 6) , gl.STATIC_DRAW);
    var postionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(postionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(postionLoc);

    render();
}

function render() {
    gl.bufferSubData(gl.ARRAY_BUFFER , 0 , flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS , 1 , points.length-1 );
}
