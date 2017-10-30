//
//   Globals
//
var camera, scene, renderer;
var geometry, material, plane, cube, selection=null;
var isMoving = false;
var DEBUG = true; function dbPrint(contents){ if(DEBUG){console.log(contents);}};0
var ENTITIES = []
var PREV_ENTITES = null;
var UPDATE_INTERVAL;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var MISSION = { 
	"name":"Default",
	"entities":[
		{
			"type":"cube",
			"x":1,
			"y":15,
			"z":1
		},
		{
			"type":"cube",
			"x":100,
			"y":15,
			"z":45
		}
	],
	"height_map":"61.png",
	"texture_map":"61.png"
}


//
//   Server Connection and Handles
//
window.addEventListener("load", function() {
    
    // create websocket instance
    var mySocket = new WebSocket("ws://localhost:8080/ws");
    
    mySocket.onconnect = function (event) {
        mySocket.send("Hello, my name is client");
        dbPrint("sending hello...");
    };

    // add event listener reacting when message is received
    mySocket.onmessage = function (event) {
    	// Parse out what we recieved and deal with contents
        data = event.data.split("|"); 

        if(data[0] === "hello"){
        	console.log("Hello recieved!")
        }else if(data[0] === "update"){
        	updateMap(data[1]);
		}else if(data[0] === "end"){
			clearInterval(UPDATE_INTERVAL);
			mySocket.close();
			//Game is over champ.
        }else if(data[0] === "mission"){
	        MISSION = jQuery.parseJSON(data[1])
	        loadMission();
	        PREV_ENTITIES = ENTITIES[0].position.x;
	        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>" +  PREV_ENTITIES);

	        //UPDATE_INTERVAL = setInterval(packageChanges, 500);

	    }else{
	    	console.log("Unknown message type, discarding...");
	    }

        dbPrint("What I heard: " + event.data);
    };
});

// Basically run in an interval, checks changes since last update and sends them to the server for processing
function packageChanges(){
	if(PREV_ENTITIES != null){
		//console.log("Does this work?");
		/* Find longest
		var longestLength = Math.max(PREV_ENTITIES.length, ENTITIES.length);
		for (var i = 0; i < longestLength; i++) {
			console.log("Does this work?");
			// if prev is shorter than current, new entites need to be added.
			if(i > PREV_ENTITIES.length){
				dbPrint("Add every things in this category as change.");
			}else{
				//compare index of both arrays for changes, 
				//if names are different than we can assume that variable in prev is gone.
				if(PREV_ENTITIES[i].name === ENTITIES[i].name){
					// then we can check x, y and z for changes.
					console.log(PREV_ENTITIES[i].position.x +":" + ENTITIES[i].position.x);
					if(PREV_ENTITIES[i].position.x != ENTITIES[i].position.x){
						dbPrint("x change.");
					}
					if(PREV_ENTITIES[i].position.y != ENTITIES[i].position.y){
						dbPrint("y change.");
					}
					if(PREV_ENTITIES[i].position.z != ENTITIES[i].position.z){
						dbPrint("z change.");
					}
				}

			}
			// if prev is longer than current, entites have been remove, but we already know which ones as we compare.
		}*/

	}else{
		console.log("ERROR >>> CHECKED ENTITES WERE NULL!!!");
	}

	//PREV_ENTITIES = ENTITIES;
	//dbPrint("Packaging changes...");
}



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
//  Mouse controls
//
function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	//console.log(("x:"+mouse.x + ", y:"+mouse.y));
	raycaster.setFromCamera( mouse, camera );
	//var intersects = raycaster.intersectObjects( ENTITIES );
	var intersects = raycaster.intersectObjects( scene.children );
	//for ( var i = 0; i < intersects.length; i++ ) {
	//	dbPrint("hovering");
	//}
}

function onMouseDown( event ) {
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );
	for ( var i = 0; i < intersects.length; i++ ) {
		if(intersects[i].object !== null){
			if(intersects[i].object.name == "floor"){
				// We want to check if selection is null and if not make the collision with the ground the new x,z?
				//dbPrint("That's the floor!");
				if(selection !== null){
					//console.log(intersects[i].point);
					selection.position.x = intersects[i].point.x
					selection.position.z = intersects[i].point.z
				}
			}else{
				selection=intersects[i].object;
				//console.log("clicked: " + selection.name)
			}
		}
	}
	// If nothing is clicked on
	if(intersects.length == 0){
		//console.log("Clicked: " + null);
		selection=null;
	}
}



//
// Entity controls
//
//Testing entity engine.
function spawnEntity(type, x, y, z){
	switch (type) {
	    case "cube":
			dbPrint("Spawning generic cube!");
			var geometry = new THREE.BoxGeometry( 20, 20, 20 );
			for (var i = 0; i < geometry.faces.length; i += 2) {
				var hex = Math.random() * 0xffffff;
				geometry.faces[ i ].color.setHex( hex );
				geometry.faces[ i + 1 ].color.setHex( hex );
			}
			var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
			cube = new THREE.Mesh( geometry, material );
			cube.position.x = x;
			cube.position.y = y;
			cube.position.z = z;
			cube.name ="CUBE_#" + ENTITIES.length;
			scene.add( cube );
			ENTITIES.push(cube);
			break;
		default: 
		 	console.log("ERROR >>> Null entity type!!");
		 	break;
	}
}

// Testing entity engine.
function deleteEntity(){
	// Loop through ENTITIES
	for (var i = 0; i < ENTITIES.length; i++) {
		if(ENTITIES[i] != null && ENTITIES[i].name === selection.name){
			dbPrint("Found him! Delete and remove");
			if (i > -1) {
 			   ENTITIES.splice(i, 1);
			}
			//ENTITIES[i] = null;
			scene.remove(selection);
			selection=null;
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
    createBtn.onclick = function(){spawnEntity("cube",15,15,15);};
 
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
	camera.position.y = 125;
	camera.position.z = 100;
	camera.rotation.x = 150;
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );

	// Setting up raycasted selector
	raycaster = new THREE.Raycaster();

	// Initial cube spawning.
	//spawnEntity("cube", 1, 15, 1);

	// Plane
	var geometry = new THREE.PlaneBufferGeometry( 300, 300 );
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

// Basically takse mission object(from server), loads assets and sets up the map.
function loadMission(){
	console.log("Loading mission :" + MISSION.name)
	for(var i=0; i<MISSION.entities.length ;i++){
		spawnEntity(MISSION.entities[i].type, MISSION.entities[i].x, MISSION.entities[i].y, MISSION.entities[i].z);
	}
}

//Applies corrections from the server to entites on map.
function updateMap(data){
	dbPrint("Update revieved :" + data);
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
