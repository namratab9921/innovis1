import * as THREE from 'three';
// import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
// import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'; // Import TrackballControls



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let object;
let controls;

// const mtlloader = new MTLLoader();
// mtlloader.load(
//     'Model/Model.mtl',
//     function (materials) {
//         materials.preload();
//         const objLoader = new OBJLoader();
//         objLoader.setMaterials(materials);
//         objLoader.load(
//             'Model/Model_center.obj',
//             function (obj) {
//                 object = obj;
//                 object.scale.set(3, 3, 2);
//                 object.rotation.x += -Math.PI / 2;
//                 object.rotation.z += -Math.PI / 2;
//                 scene.add(object);
//             },
//             function (xhr) {
//                 console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//             },
//             function (error) {
//                 console.log('An error happened:', error);
//             }
//         );
//     },
//     function (xhr) {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     function (error) {
//         console.log('An error happened:', error);
//     }
// );

const loader = new GLTFLoader();
loader.load(
    'Model/Model_center.gltf', // Path to your GLTF file
    function (gltf) {
        object = gltf.scene;
        object.scale.set(3, 3, 2);
        object.rotation.x += -Math.PI / 2;
        object.rotation.z += -Math.PI / 2;
        scene.add(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened:', error);
    }
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.getElementById("container3D").appendChild(renderer.domElement);
camera.position.set(50, -10, 0);

const pivot = new THREE.Group();

// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(-500, 500, -500);
scene.add(backLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);

const spotLight = new THREE.SpotLight(0xaaaaaa, 500, 100, Math.PI / 2, 0.8, 1); // Lower intensity
spotLight.position.set(0, 100, 0); // Positioned high and center

spotLight.target.position.set(0, 0, 0); // Target the center of the scene
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 4096; // Increased shadow map size
spotLight.shadow.mapSize.height = 4096; // Increased shadow map size
spotLight.shadow.camera.near = 0.5; // Adjust shadow camera near plane
spotLight.shadow.camera.far = 100; // Adjust shadow camera far plane
spotLight.shadow.camera.fov = 90; // Adjust shadow camera field of view
scene.add(spotLight);


const ambientLight = new THREE.AmbientLight(0x404040, 25);
scene.add(ambientLight);

controls = new TrackballControls(camera, renderer.domElement); // Use TrackballControls
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

// Function to create a circle representing a trackball axis
function createTrackballCircle(radius, axis, color) {
    const segments = 64;
    const material = new THREE.LineBasicMaterial({ color: color });
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        let x = 0, y = 0, z = 0;

        if (axis === 'x') {
            y = Math.cos(angle) * radius;
            z = Math.sin(angle) * radius;
        } else if (axis === 'y') {
            x = Math.cos(angle) * radius;
            z = Math.sin(angle) * radius;
        } else if (axis === 'z') {
            x = Math.cos(angle) * radius;
            y = Math.sin(angle) * radius;
        }

        vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const circle = new THREE.LineLoop(geometry, material);

    return circle;
}

// Create trackball circles for x, y, and z axes
const trackballRadius = 15; // Adjusted radius for a smaller trackball
const trackballX = createTrackballCircle(trackballRadius, 'x', 'hotpink'); // Light red for X axis
const trackballY = createTrackballCircle(trackballRadius, 'y', 'darkviolet'); // Light green for Y axis
const trackballZ = createTrackballCircle(trackballRadius, 'z', 'mediumblue');  // Light blue for Z axis

// Group trackball circles and add to the scene
const trackballGroup = new THREE.Group();
trackballGroup.add(trackballX);
trackballGroup.add(trackballY);
trackballGroup.add(trackballZ);
scene.add(trackballGroup);

// Update trackball position based on camera
function updateTrackballPosition() {
    // Set trackballGroup to be in front of the camera at a fixed distance
    const distance = 50; // Adjust distance from the camera
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.multiplyScalar(distance);
    trackballGroup.position.copy(camera.position).add(cameraDirection);
}


function animate() {
    requestAnimationFrame(animate);
    updateTrackballPosition();
    controls.update(); // Update controls (panning, zooming, etc.)
    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let isChanging = false;
let changeTimeout;
let sortedZXYList = [];
let sortedYawPitchList = [];
let currentZXYIndex = 0;    // Index for vertical navigation
let currentYawPitchIndex = 0; // Index for horizontal navigation



// Utility function to update the image and info display
function updateImageDisplay(image) {
    const container2D = document.getElementById("container2D");
    const imgElement = document.createElement('img');
    imgElement.src = image.filePath;
    container2D.innerHTML = ''; // Clear existing content
    container2D.appendChild(imgElement);

    initializeZoomAndPan(imgElement);

    document.getElementById('2D-info').innerHTML = `
        <div>Image: ${image.filePath.split('/').pop()} ,
            Altitude: ${image.altitude || 'N/A'} ,
            Yaw: ${image.gimbal_Yaw?.toFixed(2) || 'N/A'} ,
            Pitch: ${image.gimbal_Pitch?.toFixed(2) || 'N/A'}
        </div>
    `;

    console.log(currentYawPitchIndex);
    console.log(currentZXYIndex);
}

// Handle the 'change' event
controls.addEventListener('change', function () {
    isChanging = true;
    clearTimeout(changeTimeout);

    changeTimeout = setTimeout(() => {
        if (isChanging) {
            const lookAtVector = new THREE.Vector3();
            camera.getWorldDirection(lookAtVector);

            const calculatedYawAngle = Math.atan2(lookAtVector.z, lookAtVector.x) * (180 / Math.PI);
            const calculatedPitchAngle = Math.asin(lookAtVector.y) * (180 / Math.PI);

            document.getElementById('3D-info').innerHTML = `
                <div>Yaw: ${calculatedYawAngle.toFixed(2)} , Pitch: ${calculatedPitchAngle.toFixed(2)}</div>
            `;

            fetch('tower_set_angles.json')
                .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
                .then(images => {
                    sortedZXYList = images; // Images are sorted by z, x, y

                    // Sort images based on yaw and pitch for 3D navigation
                    sortedYawPitchList = sortedZXYList.map(image => {
                        const yawDiff = Math.abs(image.gimbal_Yaw - calculatedYawAngle);
                        const pitchDiff = Math.abs(image.gimbal_Pitch - calculatedPitchAngle);
                        return { ...image, totalDiff: yawDiff + pitchDiff };
                    }).sort((a, b) => a.totalDiff - b.totalDiff);

                    if (sortedYawPitchList.length > 0) {
                        currentYawPitchIndex = 0; // Reset to the first image
                        updateImageDisplay(sortedYawPitchList[currentYawPitchIndex]);
                    }
                })
                .catch(error => console.error('Error loading JSON file:', error));

            isChanging = false;
        }
    }, 250);
});

// Handle arrow key navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        if (sortedYawPitchList.length > 0) {
            currentYawPitchIndex = (currentYawPitchIndex + 1) % sortedYawPitchList.length;
            updateImageDisplay(sortedYawPitchList[currentYawPitchIndex]);
        }
    } else if (e.key === 'ArrowLeft') {
        if (sortedYawPitchList.length > 0) {
            currentYawPitchIndex = (currentYawPitchIndex - 1 + sortedYawPitchList.length) % sortedYawPitchList.length;
            updateImageDisplay(sortedYawPitchList[currentYawPitchIndex]);
        }
    } else if (e.key === 'ArrowUp') {
        if (sortedZXYList.length > 0) {
            currentZXYIndex = (currentZXYIndex + 1) % sortedZXYList.length;
            updateImageDisplay(sortedZXYList[currentZXYIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        if (sortedZXYList.length > 0) {
            currentZXYIndex = (currentZXYIndex - 1 + sortedZXYList.length) % sortedZXYList.length;
            updateImageDisplay(sortedZXYList[currentZXYIndex]);
        }
    }
});

// Event listeners for navigation buttons
document.getElementById('prevButton').addEventListener('click', () => {
    if (sortedYawPitchList.length > 0) {
        currentYawPitchIndex = (currentYawPitchIndex - 1 + sortedYawPitchList.length) % sortedYawPitchList.length;
        updateImageDisplay(sortedYawPitchList[currentYawPitchIndex]);
    }
});

document.getElementById('nextButton').addEventListener('click', () => {
    if (sortedYawPitchList.length > 0) {
        currentYawPitchIndex = (currentYawPitchIndex + 1) % sortedYawPitchList.length;
        updateImageDisplay(sortedYawPitchList[currentYawPitchIndex]);
    }
});

document.getElementById('upButton').addEventListener('click', () => {
    if (sortedZXYList.length > 0) {
        currentZXYIndex = (currentZXYIndex + 1) % sortedZXYList.length;
        updateImageDisplay(sortedZXYList[currentZXYIndex]);
    }
});

document.getElementById('downButton').addEventListener('click', () => {
    if (sortedZXYList.length > 0) {
        currentZXYIndex = (currentZXYIndex - 1 + sortedZXYList.length) % sortedZXYList.length;
        updateImageDisplay(sortedZXYList[currentZXYIndex]);
    }
});





document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}


//pan and Zoom of 2D image
function initializeZoomAndPan(imgElement) {
    let scale = 1;
    let isPanning = false;
    let startX, startY;
    let panX = 0, panY = 0;
    const panSpeed = 3; // Adjusted panning speed for smooth movement


    // Ensure the image element has proper styling
    imgElement.style.position = 'absolute';
    imgElement.style.top = '50%';
    imgElement.style.left = '50%';
    imgElement.style.transformOrigin = 'center';
    imgElement.style.transform = `translate(-50%, -50%) scale(${scale})`; // Center and scale


    imgElement.onwheel = (e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        const newScale = scale + (e.deltaY > 0 ? -zoomIntensity : zoomIntensity);
        scale = Math.min(Math.max(1, newScale), 10); // Restrict zoom out to initial fit size
        imgElement.style.transform = `translate(-50%, -50%) scale(${scale})`; // Center and scale
    };

    // Pan functionality
    imgElement.onmousedown = (e) => {
        e.preventDefault();
        if (e.button === 2) { // Right click
            isPanning = true;
            startX = e.clientX;
            startY = e.clientY;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    };

    function onMouseMove(e) {
        if (!isPanning) return;
        e.preventDefault();
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        panX += deltaX * panSpeed / scale; // Apply zoom level to panning speed
        panY += deltaY * panSpeed / scale; // Apply zoom level to panning speed
        startX = e.clientX;
        startY = e.clientY;
        imgElement.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`; // Apply pan and scale
    }

    function onMouseUp() {
        isPanning = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Prevent the context menu from appearing on right-click
    imgElement.oncontextmenu = (e) => {
        e.preventDefault();
    };

}

animate();
