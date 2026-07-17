import * as THREE from 'three';

export function initThreeScene(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Crimson accent light for theme glow
    const pointLight = new THREE.PointLight(0xef4444, 4, 10);
    pointLight.position.set(-2, 1, 2);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2, 10);
    blueLight.position.set(2, -1, 2);
    scene.add(blueLight);

    // Shoe Group
    const shoeGroup = new THREE.Group();
    scene.add(shoeGroup);

    // Materials
    const soleMaterial = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.1,
        metalness: 0.8,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.3
    });

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x0f172a, // Bluish-black
        roughness: 0.4,
        metalness: 0.2
    });

    const collarMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
        metalness: 0.1
    });

    const laceMaterial = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 1.0,
        roughness: 0.2
    });

    // 1. Outsole / Bottom Sole
    const soleGeom = new THREE.BoxGeometry(2.5, 0.15, 0.8);
    // Smooth corners by scaling and transforming shapes
    const soleMesh = new THREE.Mesh(soleGeom, soleMaterial);
    soleMesh.position.set(0, -0.4, 0);
    soleMesh.castShadow = true;
    soleMesh.receiveShadow = true;
    shoeGroup.add(soleMesh);

    // 2. Midsole (curved part)
    const midsoleGeom = new THREE.BoxGeometry(2.3, 0.25, 0.75);
    const midsoleMesh = new THREE.Mesh(midsoleGeom, bodyMaterial);
    midsoleMesh.position.set(0, -0.2, 0);
    midsoleMesh.rotation.z = -0.05; // Slightly sloped forward
    shoeGroup.add(midsoleMesh);

    // 3. Main Shoe Body
    const bodyGeom = new THREE.ConeGeometry(0.55, 1.8, 16);
    bodyGeom.rotateZ(Math.PI / 2.3); // Tilted forward
    bodyGeom.scale(1, 1.2, 0.8);
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMaterial);
    bodyMesh.position.set(-0.2, 0.1, 0);
    bodyMesh.castShadow = true;
    shoeGroup.add(bodyMesh);

    // 4. Heel/Ankle Collar
    const collarGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    collarGeom.rotateZ(-Math.PI / 8);
    const collarMesh = new THREE.Mesh(collarGeom, collarMaterial);
    collarMesh.position.set(-0.7, 0.5, 0);
    shoeGroup.add(collarMesh);

    // 5. Toe Box (Smooth front)
    const toeGeom = new THREE.SphereGeometry(0.4, 16, 16);
    toeGeom.scale(1.4, 0.8, 1.1);
    const toeMesh = new THREE.Mesh(toeGeom, bodyMaterial);
    toeMesh.position.set(0.7, -0.15, 0);
    shoeGroup.add(toeMesh);

    // 6. Glowing Tech Accent Stripes (Theme-based)
    const stripeGeom = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
    stripeGeom.rotateZ(Math.PI / 4);
    
    // Left Stripe
    const stripeL = new THREE.Mesh(stripeGeom, laceMaterial);
    stripeL.position.set(0.1, 0.1, 0.38);
    shoeGroup.add(stripeL);

    // Right Stripe
    const stripeR = new THREE.Mesh(stripeGeom, laceMaterial);
    stripeR.position.set(0.1, 0.1, -0.38);
    shoeGroup.add(stripeR);

    // 7. Futuristic Glowing Laces
    for (let i = 0; i < 4; i++) {
        const laceGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
        laceGeom.rotateX(Math.PI / 2);
        const lace = new THREE.Mesh(laceGeom, laceMaterial);
        lace.position.set(0.1 + (i * 0.18), 0.2 + (i * 0.1), 0);
        shoeGroup.add(lace);
    }

    // Shadow Platform / Glow Grid at bottom
    const gridHelper = new THREE.GridHelper(10, 20, 0xef4444, 0x1e293b);
    gridHelper.position.y = -0.8;
    scene.add(gridHelper);

    // Interactions: Mouse Hover Rotation
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates (-1 to 1)
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        targetRotation.y = mouse.x * 0.6;
        targetRotation.x = mouse.y * 0.4;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = (): void => {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Hover Floating Animation (Sine wave)
        shoeGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

        // Auto-rotation around Y axis combined with Mouse follow
        shoeGroup.rotation.y += 0.005;
        shoeGroup.rotation.y += (targetRotation.y - (shoeGroup.rotation.y % (Math.PI * 2))) * 0.05;
        shoeGroup.rotation.x += (targetRotation.x - shoeGroup.rotation.x) * 0.05;
        shoeGroup.rotation.z = Math.cos(elapsedTime * 1.5) * 0.03; // Gentle wobble

        // Rotate lights dynamically for moving reflections
        pointLight.position.x = Math.sin(elapsedTime) * 3 - 1;
        pointLight.position.z = Math.cos(elapsedTime) * 3 + 1;

        renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = (): void => {
        if (!container) return;
        width = container.clientWidth;
        height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
}
