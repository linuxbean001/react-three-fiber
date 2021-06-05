import './App.css';
import {React,Component} from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import Stats from 'three/examples/jsm/libs/stats.module';
// import { useForm } from "react-hook-form";

let container, stats , container1;

let camera, controls, scene, renderer;

let mesh, texture;

const worldWidth = 100, worldDepth = 100,
    worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

let helper;
let helper1;
let helper2;
let helper3;


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let that;


class ZZSp extends Component {
    
    
    constructor(props){
        super(props);
        that = this;
        this.state={
            firstvalue : '',
            secondvalue : '',
            thirdvalue : '',
            fourthvalue : ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        alert('A values was submitted: ' + this.state.firstvalue +" " + this.state.secondvalue +" " + this.state.thirdvalue + " " + this.state.fourthvalue);
        event.preventDefault();
    }
    init() {
       
        container = document.getElementById('container');
        container.innerHTML = '';
        container1 = document.getElementsByClassName('field-container');
        container1.innerHTML ='';

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xbfd1e5);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 20000);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 500;
        controls.maxDistance = 2500;
        controls.maxPolarAngle = Math.PI / 2;

        //

        const data = this.generateHeight(worldWidth, worldDepth);

        controls.target.y = data[worldHalfWidth + worldHalfDepth * worldWidth] + 500;
        camera.position.y = controls.target.y + 4000;
        camera.position.x = 4000;
        controls.update();

        const geometry = new THREE.PlaneGeometry(2000,2000);
        geometry.rotateX(- Math.PI / 2);
            
        
        const secondlayer = new THREE.PlaneGeometry(2000, 2000)
        secondlayer.rotateX(- Math.PI / 2);

        // geometry.distanceTo(secondlayer);
        
        const thirdlayer = new THREE.PlaneGeometry(2000, 2000);
        thirdlayer.rotateX(- Math.PI / 2);

        const fourthlayer = new THREE.PlaneGeometry(2000, 2800);
        fourthlayer.rotateX(- Math.PI / 2);

        const vertices = geometry.attributes.position.array;
        const vertices1 = secondlayer.attributes.position.array;
        const vertices2 = thirdlayer.attributes.position.array;
        const vertices3 = fourthlayer.attributes.position.array;

        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10;
        }
        for (let i = 0, j = 0, l = vertices1.length; i < l; i++, j += 3) {
            vertices1[j + 1] = data[i] * 10;
        }
        for (let i = 0, j = 0, l = vertices2.length; i < l; i++, j += 3) {
            vertices2[j + 1] = data[i] * 10;
        }
        for (let i = 0, j = 0, l = vertices3.length; i < l; i++, j += 3) {
            vertices3[j + 1] = data[i] * 10;
        }

        geometry.computeFaceNormals(); // needed for helper
        secondlayer.computeFaceNormals(); // needed for helper
        thirdlayer.computeFaceNormals(); // needed for helper
        fourthlayer.computeFaceNormals(); // needed for helper

        //

        texture = new THREE.CanvasTexture(this.generateTexture(data, worldWidth, worldDepth));
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ 
            color:'#f18853',
            map: texture }));
        mesh.position.x = -1000;
        mesh.position.y =  800;
        scene.add(mesh);

        mesh = new THREE.Mesh(secondlayer, new THREE.MeshBasicMaterial({ 
            color: '#f9f9c0',
            map: texture }));
        mesh.position.x = -800;
        mesh.position.y =  600;
        scene.add(mesh);

        mesh = new THREE.Mesh(thirdlayer, new THREE.MeshBasicMaterial({ 
            color:'lightgreen',
            map: texture }));
        mesh.position.x = -600;
        mesh.position.y = 400;
        scene.add(mesh);

        mesh = new THREE.Mesh(fourthlayer, new THREE.MeshBasicMaterial({
            color:'#127340',
            map: texture }));
        mesh.position.x = -400;
        mesh.position.y = 200;
        scene.add(mesh);

        const geometryHelper = new THREE.ConeGeometry(20, 100, 3);
        geometryHelper.translate(0, 50, 0);
        geometryHelper.rotateX(Math.PI / 2);
        helper = new THREE.Mesh(geometryHelper, new THREE.MeshNormalMaterial());
        scene.add(helper);

        const secondlayerHelper = new THREE.ConeGeometry(20, 100, 3);
        secondlayerHelper.translate(0, 50, 0);
        secondlayerHelper.rotateX(Math.PI / 2);
        helper1 = new THREE.Mesh(secondlayerHelper, new THREE.MeshNormalMaterial());
        scene.add(helper1);

        const thirdlayerHelper = new THREE.ConeGeometry(20, 100, 3);
        thirdlayerHelper.translate(0, 50, 0);
        thirdlayerHelper.rotateX(Math.PI / 2);
        helper2 = new THREE.Mesh(thirdlayerHelper, new THREE.MeshNormalMaterial());
        scene.add(helper2);

        const fourthlayerHelper = new THREE.ConeGeometry(20, 100, 3);
        fourthlayerHelper.translate(0, 50, 0);
        fourthlayerHelper.rotateX(Math.PI / 2);
        helper3 = new THREE.Mesh(fourthlayerHelper, new THREE.MeshNormalMaterial());
        scene.add(helper3);

        container.addEventListener('pointermove', this.onPointerMove);

        stats = new Stats();
        container.appendChild(stats.dom);

        //

        window.addEventListener('resize', this.onWindowResize);

    }

    onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    generateHeight(width, height) {

        const size = width * height, data = new Uint8Array(size),
            perlin = new ImprovedNoise(), z = Math.random() * 100;
        let quality = 1;
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < size; i++) {
                const x = i % width, y = ~ ~(i / width);
                data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
            }
            quality *= 5;
        }
        return data;
    }

    generateTexture(data, width, height) {

        // bake lighting into texture

        let context, image, imageData, shade;

        const vector3 = new THREE.Vector3(0, 0, 0);

        const sun = new THREE.Vector3(1, 1, 1);
        sun.normalize();

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext('2d');
        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        image = context.getImageData(0, 0, canvas.width, canvas.height);
        imageData = image.data;

        for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {

            vector3.x = data[j - 2] - data[j + 2];
            vector3.y = 2;
            vector3.z = data[j - width * 2] - data[j + width * 2];
            vector3.normalize();

            shade = vector3.dot(sun);

            imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
            imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
            imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);

        }

        context.putImageData(image, 0, 0);

        // Scaled 4x

        const canvasScaled = document.createElement('canvas');
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext('2d');
        context.scale(4, 4);
        context.drawImage(canvas, 0, 0);

        image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
        imageData = image.data;

        for (let i = 0, l = imageData.length; i < l; i += 4) {
            const v = ~ ~(Math.random() * 5);
            imageData[i] += v;
            imageData[i + 1] += v;
            imageData[i + 2] += v;
        }

        context.putImageData(image, 0, 0);

        return canvasScaled;

    }

    animate() {
        requestAnimationFrame(that.animate);
        that.renderTwo();
        stats.update();
    }

    renderTwo() {
        renderer.render(scene, camera);
    }

    onPointerMove(event) {
        pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        pointer.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        // See if the ray from the camera into the world hits one of our meshes
        const intersects = raycaster.intersectObject(mesh);
        // Toggle rotation bool for meshes that we clicked
        if (intersects.length > 0) {
            helper.position.set(0, 0, 0);
            helper.lookAt(intersects[0].face.normal);
             helper.position.copy(intersects[0].point);
        }
        if (intersects.length > 0) {
            helper1.position.set(0, 0, 0);
            helper1.lookAt(intersects[0].face.normal);
             helper1.position.copy(intersects[0].point);
        }
        if (intersects.length > 0) {
            helper2.position.set(0, 0, 0);
            helper2.lookAt(intersects[0].face.normal);
             helper2.position.copy(intersects[0].point);
        }
        if (intersects.length > 0) {
            helper3.position.set(0, 0, 0);
            helper3.lookAt(intersects[0].face.normal);
             helper3.position.copy(intersects[0].point);
        }

    }
    componentDidCatch(){}

   
    render() {
        that = this;
        setTimeout(() => {
            this.init();
            this.animate();
        },1000);
        
        return (
                <div id="main-container">
                   <div className="field-container">
                       <div>
                        <form onSubmit={this.handleSubmit}>
                                <label>Below 2 MTR to Ground</label>
                                    <br />
                            <input type="number" value={this.state.firstvalue} onChange={(e) => this.setState({ firstvalue: e.target.value})}></input>
                                    <br />
                                <label>Ground Level</label>
                                    <br />
                            <input type="number" value={this.state.secondvalue} onChange={(e) => this.setState({ secondvalue: e.target.value })}></input>
                                    <br />
                                <label>2MTR Above Ground</label>
                                    <br />
                            <input type="number" value={this.state.thirdvalue} onChange={(e) => this.setState({ thirdvalue: e.target.value })}></input>
                                    <br />
                                <label>4MTR Above Ground</label>
                                    <br />
                            <input type="number" value={this.state.fourthvalue} onChange={(e) => this.setState({ fourthvalue: e.target.value })}></input>
                                <br />
                                <input type="submit" value="Submit" />
                            </form>
                        
                        </div>
                   </div>  
                   <div id="container"></div>
                </div>   
             );
        };
}

export default ZZSp;
