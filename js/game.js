//
//   Globals
//
var camera, scene, renderer;
var geometry, material, mesh, plane, cube;
var isMoving = false;
var DEBUG = true; function dbPrint(contents){ if(DEBUG){console.log(contents);}};0

//init();
//animate();
//
//   Server Connection and Handles
//
/* use vanilla JS because why not
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
    
    var form = document.getElementsByClassName("foo");
    var input = document.getElementById("input");
    form[0].addEventListener("submit", function (e) {
        // on forms submission send input to our server
        input_text = input.value;
        mySocket.send(input_text);
        e.preventDefault()
    })
});
*/
//
//   Key Control Section
//
function keyDownHandler(event){
	var keyPressed = String.fromCharCode(event.keyCode);
	//console.log(keyPressed);
	if (keyPressed == "W"){		
		camera.position.z-=20;
		isMoving = true;
	}
	else if (keyPressed == "D"){
		camera.position.x+=20;	
		isMoving = true;		
	}
	else if (keyPressed == "S"){
		camera.position.z+=20;	
		isMoving = true;		
	}
	else if (keyPressed == "A"){	
		camera.position.x-=20;
		isMoving = true;		
	}
}
function keyUpHandler(event){
	var keyPressed = String.fromCharCode(event.keyCode);
	if ((keyPressed == "W") || (keyPressed == "A") || (keyPressed == "S") || (keyPressed == "D")){
		isMoving = false;
	}
}


//
//  Setting up game 
//
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

    // Title
	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = 'SMOG Version 0.03';
	container.appendChild(info);

    // Create Entity Button
	var createBtn = document.createElement( 'div' );
	createBtn.style.position = 'absolute';
	createBtn.style.top = '10px';
	createBtn.style.width = '20%%';
	createBtn.style.textAlign = 'left';
	createBtn.innerHTML = '<button id="mybutton"> Create Entity </button>';
	container.appendChild(createBtn);

	// Delete Entity Button
	var deleteBtn = document.createElement( 'div' );
	deleteBtn.style.position = 'absolute';
	deleteBtn.style.top = '10px';
	deleteBtn.style.width = '20%%';
	deleteBtn.style.textAlign = 'left';
	deleteBtn.innerHTML = '<button id="mybutton"> Create Entity </button>';
	container.appendChild(deleteBtn);

	camera = new THREE.PerspectiveCamera( 72, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.y = 725;
	camera.position.z = 600;
	camera.rotation.x = 150;

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );

	// Cube
	var geometry = new THREE.BoxGeometry( 200, 200, 200 );
	for ( var i = 0; i < geometry.faces.length; i += 2 ) {
		var hex = Math.random() * 0xffffff;
		geometry.faces[ i ].color.setHex( hex );
		geometry.faces[ i + 1 ].color.setHex( hex );

	}
	var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
	cube = new THREE.Mesh( geometry, material );
	cube.position.y = 150;
	scene.add( cube );

	// Plane
	var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
	geometry.rotateX( - Math.PI / 2 );
	var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
	plane = new THREE.Mesh( geometry, material );
	scene.add( plane );


    //Start Listeners
	document.addEventListener("keydown",keyDownHandler, false);	
	document.addEventListener("keyup",keyUpHandler, false);	

    // Render
 	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	//document.body.appendChild( renderer.domElement );
	//dbPrint("Here also");
		container.appendChild( renderer.domElement );
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