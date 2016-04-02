/**
 * Created by Sebastien on 02/04/2016.
 */
'use strict';
(function(exports) {

    function TestThreeJS() {
        var camera, scene, renderer;
        var mesh;
        var keyboard;

        init();
        animate();

        function init() {
            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.z = 400;
            scene = new THREE.Scene();
            var texture = new THREE.TextureLoader().load('assets/map_1.png');
            var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
            var material = new THREE.MeshBasicMaterial({map: texture});
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            //keyboard = new THREE.KeyboardState();

            document.body.appendChild(renderer.domElement);
            //document.addEventListener('keydown', onKeyDown, false);
            //
            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.01;

            renderer.render(scene, camera);
        }

        function onKeyDown(event) {
            switch (event) {
                case 37 : // left
                    camera.position.x += 10;
                    console.log("keydown");
                    // DO SOMETHING
                    break;
                case 38 : // up
                    camera.position.z += 10;
                    console.log("keydown");
                    // DO SOMETHING
                    break;
                case 39 : // right
                    camera.position.x -= 10;
                    console.log("keydown");
                    // DO SOMETHING
                    break;
                case 40 : // down
                    camera.position.z -= 10;
                    console.log("keydown");
                    // DO SOMETHING
                    break;
            }
            camera.updateProjectionMatrix();
        }
    }

    window.addEventListener('DOMContentLoaded', function() {
        exports.TestThreeJS = new TestThreeJS();

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