document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const siteName = urlParams.get('site');
    const stateName = urlParams.get('state');

    // Initialize Three.js scene
    initThreeJS();

    // Populate site-specific information
    document.getElementById('text-info').innerHTML = `<h3>${siteName} - Text Information</h3><p>Details about ${siteName} in ${stateName}...</p>`;
    document.getElementById('pdf-info').innerHTML = `<h3>${siteName} - PDF Information</h3><p>PDF information for ${siteName}...</p>`;
    document.getElementById('additional-info').innerHTML = `<h3>${siteName} - Additional Information</h3><p>Additional details about ${siteName}...</p>`;
    document.getElementById('text-image-info').innerHTML = `<h3>${siteName} - Text and Images</h3><p>Text and images for ${siteName}...</p><img src="site-image.jpg" alt="Site Image">`;
});

function initThreeJS() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, window.innerHeight - 60); // Adjust to fit within the left side
    document.getElementById('3d-model').appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    var animate = function() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };

    animate();

    // Adjust renderer size on window resize
    window.addEventListener('resize', function() {
        var width = document.getElementById('3d-model').clientWidth;
        var height = document.getElementById('3d-model').clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}