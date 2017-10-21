

//
//   Globals
//
var camera, scene, renderer;
var geometry, material, mesh;
var isMoving = false;

//init();
//animate();

//
//   Key Control Section
//
function keyDownHandler(event){
	var keyPressed = String.fromCharCode(event.keyCode);
	//console.log(keyPressed);
	if (keyPressed == "W"){		
		mesh.position.y+=0.02;
		isMoving = true;
	}
	else if (keyPressed == "D"){
		mesh.position.x+=0.02;	
		isMoving = true;		
	}
	else if (keyPressed == "S"){
		mesh.position.y-=0.02;	
		isMoving = true;		
	}
	else if (keyPressed == "A"){	
		mesh.position.x-=0.02;
		isMoving = true;		
	}
}
function keyUpHandler(event){
	var keyPressed = String.fromCharCode(event.keyCode);
	if ((keyPressed == "W") || (keyPressed == "A") || (keyPressed == "S") || (keyPressed == "D")){
		isMoving = false;
	}
}
//   Key listeners
document.addEventListener("keydown",keyDownHandler, false);	
document.addEventListener("keyup",keyUpHandler, false);	



//
//   Server Connection and Handles
//
// use vanilla JS because why not
window.addEventListener("load", function() {
    
    // create websocket instance
    var mySocket = new WebSocket("ws://localhost:8080/ws");
    
    // add event listener reacting when message is received
    mySocket.onmessage = function (event) {
        var output = document.getElementById("output");
        // put text into our output div
        //output.textContent = event.data;
        console.log(event.data);
    };
    /*
    var form = document.getElementsByClassName("foo");
    var input = document.getElementById("input");
    form[0].addEventListener("submit", function (e) {
        // on forms submission send input to our server
        input_text = input.value;
        mySocket.send(input_text);
        e.preventDefault()
    })*/
});



//
//  Setting up game 
//
function init() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry( 0.05, 0.05, 0.05 );
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
    animate();
}


//
//   Main Game/Animation Loop
//
function animate() {

	requestAnimationFrame( animate );
	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.02;
	renderer.render( scene, camera );
}