/**
 * @author Sébastien PASSIER / http://github.com/spassier
 * Created by Sebastien on 02/04/2016.
 */

'use strict';
(function(exports) {

    function CoreJS() {
        var camera, scene, renderer;
        var mesh;
        var meshKart;
        var controls;
        var controlsEnabled = false;
        var moveForward = false;
        var moveBackward = false;
        var moveLeft = false;
        var moveRight = false;
        var canJump = false;
        var prevTime = performance.now();
        var velocity = new THREE.Vector3();
        var velocityKart = new THREE.Vector3();
        var rotationKart = new THREE.Vector3();
        var keysAlias = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

        init();
        animate();

        function init() {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
            //camera.position.z = 400;

            scene.add(camera);

            // FIXME : Il faudrait utiliser une promise car si la texture n'est pas chargé assez rapidement alors on obtient une erreur "cross origin requests"
            // http://stackoverflow.com/questions/35540880/three-textureloader-is-not-loading-images-files
            var textureManager = new THREE.TextureLoader().setCrossOrigin('*');
            var texture = textureManager.load('assets/map_1.png');
            var geometry = new THREE.PlaneBufferGeometry(256, 256);
            geometry.rotateX( - Math.PI / 2 );

            var material = new THREE.MeshBasicMaterial( {map:texture} );
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            geometry = new THREE.BoxBufferGeometry(2, 2, 2);
            material = new THREE.MeshBasicMaterial( {color:0xffff00} );
            meshKart = new THREE.Mesh(geometry, material);
            meshKart.position.y = 1;
            meshKart.position.x = 110;
            meshKart.position.z = 24;

            setFocus(meshKart);
            //meshKart.add(camera);

            scene.add(meshKart);

            controls = new THREE.FellowControls(camera, meshKart);


            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);


            document.body.appendChild(renderer.domElement);

            //document.addEventListener('keydown', onKeyDown, false);
            //document.addEventListener('keyup', onKeyUp, false);

            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);

            if ( controlsEnabled ) {

                var time = performance.now();
                var delta = ( time - prevTime ) / 1000;
                velocity.x -= velocity.x * 10.0 * delta;
                velocity.z -= velocity.z * 10.0 * delta;
                velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                if ( moveForward ) velocity.z -= 400.0 * delta;
                if ( moveBackward ) velocity.z += 400.0 * delta;
                if ( moveLeft ) velocity.x -= 400.0 * delta;
                if ( moveRight ) velocity.x += 400.0 * delta;

                /*
                if ( isOnObject === true ) {
                    velocity.y = Math.max( 0, velocity.y );
                    canJump = true;
                }
                */

                controls.getObject().translateX( velocity.x * delta );
                controls.getObject().translateY( velocity.y * delta );
                controls.getObject().translateZ( velocity.z * delta );
                if ( controls.getObject().position.y < 10 ) {
                    velocity.y = 0;
                    controls.getObject().position.y = 10;
                    canJump = true;
                }

                prevTime = time;
            } else {

                if ( moveForward ) velocityKart.z += 1.0;
                if ( moveBackward ) velocityKart.z -= 1.0;
                if ( moveLeft ) rotationKart.y += Math.PI / 180;
                if ( moveRight ) rotationKart.y -= Math.PI / 180;

                meshKart.translateZ( velocityKart.z );
                meshKart.rotateY( rotationKart.y );

                var relativeCameraOffset = new THREE.Vector3(0, 5, -12);
                var cameraOffset = relativeCameraOffset.applyMatrix4( meshKart.matrixWorld );
                camera.position.x = cameraOffset.x;
                camera.position.y = cameraOffset.y;
                camera.position.z = cameraOffset.z;
                camera.lookAt( meshKart.position );

                //camera.translate();
                velocityKart.z = 0.0;
                //setFocus(meshKart);
                rotationKart.y = 0.0;
            }

            controls.update();

            renderer.render(scene, camera);
        }

        // Updating the camera to follow and look at a given Object3D / Mesh
        function setFocus( object ) {
            camera.position.set(object.position.x, object.position.y + 10, object.position.z - 24);
            //camera.rotation.y = 10;
            //camera.rotation.y += rotationKart.y;
            camera.lookAt(object.position);

        }

        function onKeyDown( event ) {
            switch ( event.keyCode ) {
                case 38: // up
                case 87: // w
                    moveForward = true;
                    break;
                case 37: // left
                case 65: // a
                    moveLeft = true;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;
                case 32: // space
                    if ( canJump === true ) velocity.y += 350;
                    canJump = false;
                    break;
            }
        }

        function onKeyUp( event ) {
            switch( event.keyCode ) {
                case 38: // up
                case 87: // w
                    moveForward = false;
                    break;
                case 37: //
                case 65: // a
                    moveLeft = false;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;
            }
        }
    }

    window.addEventListener('DOMContentLoaded', function() {
        exports.TestThreeJS = new CoreJS();
    });

})(self);

/**
 * Utilisties
 *
 * - site qui permet de retrouver le keycode d'une touche
 * http://www.asquare.net/javascript/tests/KeyCode.html
 *
 * - code de gestion keyboard par etat et pas par event
 * http://learningthreejs.com/blog/2011/09/12/lets-Make-a-3D-game-keyboard/
 */

/**
 * Exemple pour generer une grille 2d de cell
 *
 * function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 500;
    scene.add(camera);

    // geometry
    var geometry = new THREE.PlaneGeometry(500, 500, 10, 10);

    // materials
    var materials = [];
    materials.push(new THREE.MeshBasicMaterial({
        color: 0xff0000, side:THREE.DoubleSide
    }));
    materials.push(new THREE.MeshBasicMaterial({
        color: 0x00ff00, side:THREE.DoubleSide
    }));
    materials.push(new THREE.MeshBasicMaterial({
        color: 0x0000ff, side:THREE.DoubleSide
    }));

    // Add materialIndex to face
    var l = geometry.faces.length / 2;
    for (var i = 0; i < l; i++) {
        var j = 2 * i;
        geometry.faces[j].materialIndex = i % 3;
        geometry.faces[j + 1].materialIndex = i % 3;
    }

    // mesh
    mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}*/