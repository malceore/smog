//
//   Globals
//
var camera, scene, renderer;
var geometry, material, plane, cube, selection;
var isMoving = false;
var DEBUG = true; function dbPrint(contents){ if(DEBUG){console.log(contents);}};0
var ENTITIES = [];
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
//var projector = new THREE.Projector();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	//console.log(("x:"+mouse.x + ", y:"+mouse.y));
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( ENTITIES );
	//var intersects = raycaster.intersectObjects( scene.children );
	for ( var i = 0; i < intersects.length; i++ ) {
		dbPrint("hovering");
	}
}
function onMouseDown( event ) {
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );
	for ( var i = 0; i < intersects.length; i++ ) {
		if(intersects[i].object !== null){
			if(intersects[i].object.name == "floor"){
				// We want to check if selection is null and if not make the collision with the ground the new x,z?
				dbPrint("That's the floor!");
				if(selection !== null){
					//console.log(intersects[i].point);
					selection.position.x = intersects[i].point.x
					selection.position.z = intersects[i].point.z
				}
			}else{
				selection=intersects[i].object;
				console.log("clicked: " + selection.name)
			}
		}
	}
	// If nothing is clicked on
	if(intersects.length == 0){
		console.log("Clicked: " + null);
		selection=null;
	}
}



//
// Entity controls
//
//Testing entity engine.
function spawnEntity(){
	var geometry = new THREE.BoxGeometry( 150, 150, 150 );
	for (var i = 0; i < geometry.faces.length; i += 2) {
		var hex = Math.random() * 0xffffff;
		geometry.faces[ i ].color.setHex( hex );
		geometry.faces[ i + 1 ].color.setHex( hex );
	}
	var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
	cube = new THREE.Mesh( geometry, material );
	cube.position.y = 150;
	cube.name ="CUBE_#" + ENTITIES.length;
	scene.add( cube );
	ENTITIES.push(cube);
}

// Testing entity engine.
function deleteEntity(){
	// Loop through ENTITIES
	for (var i = 0; i < ENTITIES.length; i++) {
		if(ENTITIES[i] !== null && ENTITIES[i].name === selection.name){

			dbPrint("Found him! Delete and remove");
			ENTITIES[i] = null;
			scene.remove(selection);
		}
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
    createBtn.onclick = function(){spawnEntity();};
 
	// Delete Entity Button
	var deleteBtn = document.createElement( 'div' );
	deleteBtn.style.position = 'absolute';
	deleteBtn.style.top = '50px';
	deleteBtn.style.width = '20%%';
	deleteBtn.style.textAlign = 'left';
	deleteBtn.innerHTML = '<button id="mybutton"> Delete Entity </button>';
	container.appendChild(deleteBtn);
    deleteBtn.onclick = function(){deleteEntity();};

    // Camera and Scene Configs
	camera = new THREE.PerspectiveCamera( 72, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.y = 725;
	camera.position.z = 600;
	camera.rotation.x = 150;
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );

	// Setting up raycasted selector
	raycaster = new THREE.Raycaster();

	// Initial cube spawning.
	spawnEntity();

	// Plane
	var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
	geometry.rotateX( - Math.PI / 2 );
	var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
	plane = new THREE.Mesh( geometry, material );
	plane.name = "floor"
	scene.add(plane);

    //Start Listeners
	document.addEventListener("keydown",keyDownHandler, false);	
	document.addEventListener("keyup",keyUpHandler, false);	

    // Render
 	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );

    // More listeners
	renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
	container.appendChild( renderer.domElement );
    animate();
}

//
//   Main Game/Animation Loop
//
function animate() {
    try{
        requestAnimationFrame( animate );
        //controls.update();
        renderer.render( scene, camera );
    }
    catch(err){
        alert("animate error. " + err.message);
    }
}
