/**
 * Created by Sebastien on 03/04/2016.
 */

THREE.FellowControls = function ( camera, target ) {
    var keysAlias = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
    var clock = new THREE.Clock();

    // TODO: extraire ces constantes qui sont propres à un type de vehicule
    var acceleration = 2.0;
    var deceleration = 10.0;
    var friction = 0.25;

    var velocity = 0.0;
    var rotation = 0.0;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = true;

    this.camera = camera;
    this.target = target;

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);


    this.update = function() {
        var delta = clock.getDelta();

        if ( moveForward ) {
            velocity += (velocity + acceleration * delta) * delta;
        } else {
            velocity -= friction * delta;
        }
        if ( moveBackward ) velocity -= (velocity + deceleration * delta) * delta;
        if ( moveLeft ) rotation += Math.PI / 180;
        if ( moveRight ) rotation -= Math.PI / 180;

        if ( velocity >= 0.8 ) velocity = 0.8;
        if ( velocity < 0.0 ) velocity = 0.0;

        this.target.translateZ(velocity);
        this.target.rotateY(rotation);

        var relativeCameraOffset = new THREE.Vector3(0, 5, -12);
        var cameraOffset = relativeCameraOffset.applyMatrix4(this.target.matrixWorld);
        this.camera.position.x = cameraOffset.x;
        this.camera.position.y = cameraOffset.y;
        this.camera.position.z = cameraOffset.z;
        this.camera.lookAt(this.target.position);

        rotation = 0.0;
    }


    function onKeyDown( event ) {
        switch ( event.keyCode ) {
            case keysAlias.UP:
                moveForward = true;
                break;
            case keysAlias.LEFT:
                moveLeft = true;
                break;
            case keysAlias.BOTTOM:
                moveBackward = true;
                break;
            case keysAlias.RIGHT:
                moveRight = true;
                break;
            case keysAlias.SPACE:
                // TODO : handle correctly the impulsion
                //if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;
        }
    }

    function onKeyUp( event ) {
        switch( event.keyCode ) {
            case keysAlias.UP:
                moveForward = false;
                break;
            case keysAlias.LEFT:
                moveLeft = false;
                break;
            case keysAlias.BOTTOM:
                moveBackward = false;
                break;
            case keysAlias.RIGHT:
                moveRight = false;
                break;
        }
    }
};