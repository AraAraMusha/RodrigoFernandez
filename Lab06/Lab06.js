"use strict";
var gl;
var points;
var colors;
var sliderVal = 1;

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points=[
    vec2(-0.95,0.95),
    vec2(0,0.95),
    vec2(0.95,0.95),
    vec2(-0.95,0.0),
    vec2(0,0.0),
    vec2(0.95,0.0),
    vec2(-0.95,-0.95),
    vec2(0.0,-0.95),
    vec2(0.95,-0.95)
    ];

    colors=[
    vec4( 0.5 , 0.9 , 0.3 , 1.0 ),
    vec4( 0.4 , 1.0 , 0.3 , 1.0 ),
    vec4( 1.0 , 0.7 , 1.0 , 1.0 ),
    vec4( 0.6 , 0.9 , 0.8 , 1.0 ),
    vec4( 0.6 , 0.3 , 1.0 , 1.0 ),
    vec4( 0.3 , 0.8 , 0.6 , 1.0 ),
    vec4( 0.8 , 0.5 , 0.5 , 1.0 ),
    vec4( 0.2 , 0.4 , 0.8 , 1.0 ),
    vec4( 1.0 , 0.5 , 0.5 , 1.0 )
    ];
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    var cbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    document.getElementById("slider").onchange = function(event) {
        sliderVal = parseInt(event.target.value);
        render();
    };

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, sliderVal );
}