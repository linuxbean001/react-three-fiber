import './App.css';
import {React,Component} from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import Stats from 'three/examples/jsm/libs/stats.module';
import DatGui, { DatNumber, DatButton } from "react-dat-gui";
import "../node_modules/react-dat-gui/dist/index.css";

let container, stats , container1;

let camera, controls, scene, renderer;

let mesh1,mesh2,mesh3,mesh4, texture;

const worldWidth = 100, worldDepth = 100,
    worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

let helper;
let helper1;
let helper2;
let helper3;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let that;

class LandView extends Component {
    
    constructor(props){
        super(props);
        that = this;
        
        this.state={
            data: {
                firstvalue : '',
                secondvalue : '',
                thirdvalue : '',
                fourthvalue : '',
                package: 'react-dat-gui',
                isAwesome: true,
                feelsLike: '#2FA1D6',
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        
        
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.data.firstvalue) {
            mesh1.material.color.setHex(0xffff34);
        }

        if (this.state.data.secondvalue) {
            mesh2.material.color.setHex(0x5d3b03);
        }

        if (this.state.data.thirdvalue <= 99) {
            mesh3.material.color.setHex(0x98f194);
            }else if(this.state.data.thirdvalue === 100){
                mesh3.material.color.setHex(0xff5f1f);
        }else{
            mesh3.material.color.setHex(0x98f194);
        }

        if (this.state.data.fourthvalue < 100) {
            mesh4.material.color.setHex(0x1f16c);
            }else if(this.state.data.fourthvalue === 100){
                mesh4.material.color.setHex(0xff5f1f);
        }else{
            mesh4.material.color.setHex(0x1f16c);
        }

    }

    handleUpdate = newData =>
    this.setState(prevState => ({
        data: { ...prevState.data, ...newData }
    }));

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
        controls.minDistance = 1000;
        controls.maxDistance = 10000;
        controls.maxPolarAngle = Math.PI / 2;

        //

        const data = this.generateHeight(worldWidth, worldDepth);

        controls.target.y = data[worldHalfWidth + worldHalfDepth * worldWidth] + 500;
        camera.position.y = controls.target.y + 4000;
        camera.position.x = 4000;
        controls.update();

        const firstlayer = new THREE.PlaneGeometry(1500,2000);
        firstlayer.rotateX(- Math.PI / 2);
            
        
        const secondlayer = new THREE.PlaneGeometry(2000, 2000)
        secondlayer.rotateX(- Math.PI / 2);
        
        const thirdlayer = new THREE.PlaneGeometry(2000, 2000);
        thirdlayer.rotateX(- Math.PI / 2);

        const fourthlayer = new THREE.PlaneGeometry(2000, 2800);
        fourthlayer.rotateX(- Math.PI / 2);

        const vertices = firstlayer.attributes.position.array;
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

        firstlayer.computeFaceNormals(); 
        secondlayer.computeFaceNormals(); 
        thirdlayer.computeFaceNormals(); 
        fourthlayer.computeFaceNormals(); 

        texture = new THREE.CanvasTexture(this.generateTexture(data, worldWidth, worldDepth));
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        let material1 = new THREE.MeshBasicMaterial({ color: '',map: texture});
        mesh1 = new THREE.Mesh(firstlayer,material1);
        mesh1.position.x = -1000;
        mesh1.position.y =  800;
        scene.add(mesh1);
        
        let material2 = new THREE.MeshBasicMaterial({ color: '',map: texture });
        mesh2 = new THREE.Mesh(secondlayer,material2)
        mesh2.position.x = -800;
        mesh2.position.y =  600;
        scene.add(mesh2);

        let material3 = new THREE.MeshBasicMaterial({ color: '#90ee90', map: texture });
        mesh3 = new THREE.Mesh(thirdlayer, material3);
        mesh3.position.x = -600;
        mesh3.position.y = 400;
        scene.add(mesh3);

        let material4 = new THREE.MeshBasicMaterial({ color: '#127340', map: texture });
        mesh4 = new THREE.Mesh(fourthlayer, material4);
        mesh4.position.x = -400;
        mesh4.position.y = 200;
        scene.add(mesh4);

        const firstlayerHelper = new THREE.ConeGeometry(20, 100, 3);
        firstlayerHelper.translate(0, 50, 0);
        firstlayerHelper.rotateX(Math.PI / 2);
        helper = new THREE.Mesh(firstlayerHelper, new THREE.MeshNormalMaterial());
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
        const intersects1 = raycaster.intersectObject(mesh1);
        const intersects2 = raycaster.intersectObject(mesh2);
        const intersects3 = raycaster.intersectObject(mesh3);
        const intersects4 = raycaster.intersectObject(mesh4);
        // Toggle rotation bool for meshes that we clicked
        if (intersects1.length > 0) {
            helper.position.set(0, 0, 0);
            helper.lookAt(intersects1[0].face.normal);
            helper.position.copy(intersects1[0].point);
        }
        if (intersects2.length > 0) {
            helper1.position.set(0, 0, 0);
            helper1.lookAt(intersects2[0].face.normal);
             helper1.position.copy(intersects2[0].point);
        }
        if (intersects3.length > 0) {
            helper2.position.set(0, 0, 0);
            helper2.lookAt(intersects3[0].face.normal);
             helper2.position.copy(intersects3[0].point);
        }
        if (intersects4.length > 0) {
            helper3.position.set(0, 0, 0);
            helper3.lookAt(intersects4[0].face.normal);
             helper3.position.copy(intersects4[0].point);
        }

    }
    componentDidCatch(){}

   
    render() {
        that = this;
        const { data } = this.state;
        setTimeout(() => {
            this.init();
            this.animate();
        },1000);
        
        return (
                <div id="main-container">
                   <div className="field-container">
                       <div>
                            <DatGui data={data} onUpdate={this.handleUpdate}>
                                <DatNumber path='firstvalue' label='Below 2 MTR to Ground' min={-10} max={40} step={1} value={this.state.firstvalue} onChange={(e) => this.setState({ firstvalue: e.target.value })}/>
                                <DatNumber path='secondvalue' label='Ground Level Humidity' min={50} max={100} step={1} value={this.state.secondvalue} onChange={(e) => this.setState({ secondvalue: e.target.value })}/>
                                <DatNumber path='thirdvalue' label='4MTR Above Ground' min={1} max={100} step={1} value={this.state.thirdvalue} onChange={(e) => this.setState({ thirdvalue: e.target.value })}/>
                                <DatNumber path='fourthvalue' label='4MTR Above Ground' min={1} max={100} step={1} value={this.state.fourthvalue} onChange={(e) => this.setState({ fourthvalue: e.target.value })}/>
                                <DatButton type="button"label="Submit" onClick={this.handleSubmit}></DatButton>
                            </DatGui> 
                            
                        </div>
                   </div>  
                   <div id="container"></div>
                </div> 
                
             );
        };
}

export default LandView;
