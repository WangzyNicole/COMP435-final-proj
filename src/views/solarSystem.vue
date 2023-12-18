<template>
  <div class="container">
    <div id="planetDiv">
      <!--绘制canvas的盒子-->
    </div>
    <!--描述组件-->
    <PlanetText v-if="clickPlanet.planetMsg" :msg="clickPlanet.planetMsg" />
    <!--设置组件-->
    <SetSolarSystem @changeSet="changeSet" />
  </div>
</template>
<script>
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; 
import SetSolarSystem from "./components/SetSolarSystem";
import PlanetText from "./components/PlanetText";
import planetData from "./planetData.js";
import universeImg from "./img/universe.jpg"; 
import starImg from "./img/star.jpg";
import venusAtmosphereImg from "./img/venusAtmosphere.jpg";
import moonImg from "./img/moon.jpg";
import earthNormalImg from "./img/earthNormal.jpg";
import earthCloudsImg from "./img/earthClouds.jpg";

let scene = null; //the scene
let camera = null; //the camera
let orbitControls = null; //mouse control
export default {
  props: {},
  components: { SetSolarSystem, PlanetText },
  data() {
    return {
      dom: "", 
      renderer: "",
      anId: null,
      planetList: planetData,
      isRevolution: true, //revolution status
      isRotation: true, //rotation status
      raycaster: new THREE.Raycaster(), //to get the coordinates of mouse when on click
      mouse: new THREE.Vector2(), 
      clickPlanet: "", //the on click planet
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    //change the two settings (rotation and revolution)
    changeSet(data) {
      if (data.key == "isRevolution") {
        this.isRevolution = data.val;
      }
      if (data.key == "isRotation") {
        this.isRotation = data.val;
      }
    },
    //destroy the scene
    destroyScene() {
      cancelAnimationFrame(this.anId); //stop rendering according to anId
      this.renderer.forceContextLoss();
      this.renderer.dispose();
      scene.clear();
      scene = null;
      camera = null;
      orbitControls = null;
      this.dom.innerHTML = null;
      this.renderer = null;
    },

    //initialize the scene
    init() {
      this.dom = document.getElementById("planetDiv"); //get dom
      let width = this.dom.clientWidth;
      let height = this.dom.clientHeight;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 50000); //create the perspective camera
      camera.position.set(0, 500, 2700); //set camera position
      camera.lookAt(0, 0, 0);
      //create renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, //antialiasing
        alpha: true, //transparency
      });
      this.renderer.setClearColor(0x000000, 0.1); //set scene transparency
      this.renderer.setSize(width, height); //set renderer size
      this.dom.appendChild(this.renderer.domElement); //add renderer to dom to form canvas
      this.createUniverse(); //create universe
      this.createStars(); //create stars
      this.createLight(); //create light
      //traverse planet data to generate planets and their orbital paths
      this.planetList.forEach((e) => {
        this.createSphere(e);
        this.createTrack(e);
      });
      this.createOrbitControls(); //create mouse controls
      this.render(); //render
    },

    //create universe
    createUniverse() {
      let universeGeometry = new THREE.SphereGeometry(7000, 100, 100);
      let universeMaterial = new THREE.MeshLambertMaterial({
        //texure
        map: new THREE.TextureLoader().load(universeImg),
        side: THREE.DoubleSide, 
      });
      //mesh
      let universeMesh = new THREE.Mesh(universeGeometry, universeMaterial);
      universeMesh.name = "universe";
      scene.add(universeMesh);
    },

    //create stars
    createStars() {
      const positions = [];
      const colors = [];
      //create geometry
      const starsGeometry = new THREE.BufferGeometry();
      //color and position
      for (let i = 0; i < 10000; i++) {
        let vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        positions.push(vertex.x, vertex.y, vertex.z);
        let color = new THREE.Color();
        color.setRGB(255, 255, 255);
        colors.push(color.r, color.g, color.b);
      }
      starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      starsGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );
      //texture
      let starsMaterial = new THREE.PointsMaterial({
        map: new THREE.TextureLoader().load(starImg),
        size: 5,
        blending: THREE.AdditiveBlending,
        fog: true,
        depthTest: false,
      });
      //star assembly
      let starsMesh = new THREE.Points(starsGeometry, starsMaterial);
      starsMesh.scale.set(7000, 7000, 7000); //set the assembly scope
      scene.add(starsMesh);
    },

    //create light
    createLight() {
      let ambient = new THREE.AmbientLight(new THREE.Color(0xffffff)); 
      scene.add(ambient);
      let pointLight = new THREE.PointLight(new THREE.Color(0xffffff), 2, 1, 0);
      pointLight.visible = true;
      pointLight.position.set(0, 0, 0); //point light serves as the Sun
      scene.add(pointLight);
    },

    //create sphere objects
    createSphere(data) {
      //special spheres
      if (data.name == "sun") {
        this.createSun(data);
      } else if (data.name == "earth") {
        this.createEarth(data);
      } else if (data.name == "venus") {
        this.createVenus(data);
      } else if (data.name == "saturn") {
        this.createSaturn(data);
      } else {
        //other spheres
        let sphereGeometry = new THREE.SphereGeometry(data.size, 100, 100); 
        //textures
        let sphereMaterial = new THREE.MeshLambertMaterial({
          map: new THREE.TextureLoader().load(data.mapImg),
        });
        let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh.name = data.name;
        sphereMesh.planetMsg = data;
        sphereMesh.isPlanet = true; //identified as planet
        sphereMesh.angle = 0; 
        //sphere position
        sphereMesh.position.set(
          data.position[0],
          data.position[1],
          data.position[2]
        );
        scene.add(sphereMesh);
      }
    },

    //create the Sun
    createSun(data) {
      let sunGroup = new THREE.Group();
      let sunGeometry = new THREE.SphereGeometry(data.size, 100, 100);
      let sunMaterial = new THREE.MeshLambertMaterial({
        //texture
        color: new THREE.Color(0xffffff),
        map: new THREE.TextureLoader().load(data.mapImg),
      });
      let sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
      sunGroup.add(sunMesh);

      let sunAtmosphereGeometry = new THREE.SphereGeometry(
        data.size + 8,
        100,
        100
      );
      let sunAtmosphereMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xffffff),
        transparent: true,
        opacity: 0.2,
      });
      let sunAtmosphereMesh = new THREE.Mesh(
        sunAtmosphereGeometry,
        sunAtmosphereMaterial
      );
      sunGroup.add(sunAtmosphereMesh);
      sunGroup.name = data.name;
      sunGroup.planetMsg = data;
      sunGroup.isPlanet = true;
      sunGroup.angle = 0;
      //sphere position
      sunGroup.position.set(
        data.position[0],
        data.position[1],
        data.position[2]
      );
      scene.add(sunGroup);
    },

    //create Venus
    createVenus(data) {
      let venusGroup = new THREE.Group();
      let venusGeometry = new THREE.SphereGeometry(data.size, 100, 100);

      let venusMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xffffff),
        map: new THREE.TextureLoader().load(data.mapImg),
      });
      let venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);
      venusGroup.add(venusMesh);
      
      let venusAtmosphereGeometry = new THREE.SphereGeometry(
        data.size + 2,
        100,
        100
      );
      //the texture of atmosphere
      let venusAtmosphereMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xffffff),
        transparent: true,
        opacity: 0.5,
        map: new THREE.TextureLoader().load(venusAtmosphereImg),
      });
      let venusAtmosphereMesh = new THREE.Mesh(
        venusAtmosphereGeometry,
        venusAtmosphereMaterial
      );
      venusGroup.add(venusAtmosphereMesh);
      venusGroup.name = data.name;
      venusGroup.planetMsg = data;
      venusGroup.isPlanet = true; 
      venusGroup.angle = 0; 
      //sphere position
      venusGroup.position.set(
        data.position[0],
        data.position[1],
        data.position[2]
      );
      scene.add(venusGroup);
    },

    //create Earth
    createEarth(data) {
      let earthGroup = new THREE.Group();
      let earthGeometry = new THREE.SphereGeometry(data.size, 100, 100);
     
      let earthMaterial = new THREE.MeshPhysicalMaterial({
        map: new THREE.TextureLoader().load(data.mapImg),
        normalScale: new THREE.Vector2(10, 10), //normal scale
        normalMap: new THREE.TextureLoader().load(earthNormalImg), //normal map to strengthen surface details
      });
      let earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
      earthGroup.add(earthMesh);
      
      let earthCloudsGeometry = new THREE.SphereGeometry(
        data.size + 2,
        100,
        100
      );
      
      let earthCloudsMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xffffff),
        transparent: true,
        opacity: 0.4,
        map: new THREE.TextureLoader().load(earthCloudsImg),
      });
      //earth clouds mesh
      let earthCloudsMesh = new THREE.Mesh(
        earthCloudsGeometry,
        earthCloudsMaterial
      );
      earthGroup.add(earthCloudsMesh);

      earthGroup.name = data.name;
      earthGroup.planetMsg = data;
      earthGroup.isPlanet = true;
      earthGroup.angle = 0;
      //position
      earthGroup.position.set(
        data.position[0],
        data.position[1],
        data.position[2]
      );
      scene.add(earthGroup);
    },

    //create Saturn
    createSaturn(data) {
      let saturnGroup = new THREE.Group(); //group of Saturn
      let saturnGeometry = new THREE.SphereGeometry(data.size, 100, 100); //Saturn geometry
      let saturnMaterial = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(data.mapImg), //Saturn texture
      });
      let saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial); //Saturn mesh
      saturnGroup.add(saturnMesh); //add mesh to the group
      //球体位置
      saturnGroup.position.set(
        data.position[0],
        data.position[1],
        data.position[2]
      );
      scene.add(saturnGroup);
    },

    //create orbital paths
    createTrack(data) {
      if (data.name == "sun") {
        return;
      }
      //create tracks (paths)
      let trackGeometry = new THREE.RingBufferGeometry(
        data.position[0],
        data.position[0] + 2,
        1000
      );
      //texture
      let trackMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      let trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
      trackMesh.position.set(0, 0, 0); //track position
      trackMesh.rotation.set(0.5 * Math.PI, 0, 0); //totation the track to horizonal
      scene.add(trackMesh);
    },

    //create mouse controls
    createOrbitControls() {
      orbitControls = new OrbitControls(camera, this.renderer.domElement);
      orbitControls.enablePan = false;
      orbitControls.enableZoom = true; //zoomming
      orbitControls.enableDamping = true; //damping
      orbitControls.dampingFactor = 0.05; //damping factor
      orbitControls.minDistance = 100; //minimum distance from the camera to object
      orbitControls.maxDistance = 2700; //maximum distance from the camera to object
      orbitControls.autoRotate = true; //camera self rotation
      orbitControls.autoRotateSpeed = 0;
    },

    //renderer
    render() {
      //request animation frame, call it when page refreshing, bond it with the frequncy of page refreshing
      this.anId = requestAnimationFrame(this.render); //record anId to destroy the scene
      orbitControls.update(); //update mouse controls
      this.renderer.render(scene, camera);
      //control revolution
      if (this.isRevolution) {
        this.sphereRevolution(this.planetList); //planets revoluting
      }
      if (this.isRotation) {
        this.sphereRotation(this.planetList); //planets rotating
      }
      //listen for canvas double-click events
      document.getElementById("planetDiv") &&
        document
          .getElementById("planetDiv")
          .addEventListener("dblclick", this.handleDblclick, false);
      TWEEN.update(); //update animation
    },

    //double click event
    handleDblclick(e) {
      let dom = document.getElementById("planetDiv");
      let width = dom.clientWidth; //window width
      let height = dom.clientHeight; //window height
      //transfer mouse position to standard position in three.js
      this.mouse.x = (e.offsetX / width) * 2 - 1;
      this.mouse.y = -(e.offsetY / height) * 2 + 1;
      //calculate raycaster through mouse position and current camera matri
      this.raycaster.setFromCamera(this.mouse, camera);
      //create planet mesh list
      let palnetMeshList = [];
      scene.children.forEach((p) => {
        if (p.name !== "") {
          palnetMeshList.push(p);
        }
      });
      //get the intersection objects between raycaster and planets mesh list
      let intersects = this.raycaster.intersectObjects(palnetMeshList);
      //if is clicking nihility
      if (intersects.length == 0) {
        return;
      }
      //if is clicking a planet
      if (intersects[0].object.isPlanet) {
        this.clickPlanet = intersects[0].object;
      } else {
        this.clickPlanet = intersects[0].object.parent;
      }
      //get sphere radius
      let planetR = "";
      this.planetList.forEach((e) => {
        if (e.name == this.clickPlanet.name) {
          planetR = e.size;
        }
      });
      //new position of camera
      let newP = {
        x: this.clickPlanet.position.x,
        y: this.clickPlanet.position.y + planetR,
        z: this.clickPlanet.position.z + 2.5 * planetR,
      };
      //when double clicking on planets, stop revoluting; double clicking on nihility reverses revolution status
      if (this.clickPlanet.type !== "Scene") {
        this.isRevolution = false;
        this.isRotation = false;

        //fly to the planet after click
        this.flyTo(
          camera.position,
          orbitControls.target,
          newP,
          this.clickPlanet.position,
          2000
        );
      } else {
        this.isRevolution = !this.isRevolution;
        this.isRotation = !this.isRotation;
      }
    },

    //fly to a target (old camera position，old target position，new camera position，new target position，animation time，call bacl)
    flyTo(oldP, oldT, newP, newT, time, callBack) {
      if (TWEEN) {
        let tween = new TWEEN.Tween({
          x1: oldP.x, 
          y1: oldP.y, 
          z1: oldP.z, 
          x2: oldT.x, 
          y2: oldT.y, 
          z2: oldT.z,
        });
        tween.to(
          {
            x1: newP.x,
            y1: newP.y,
            z1: newP.z,
            x2: newT.x,
            y2: newT.y,
            z2: newT.z,
          },
          time
        );
        tween.onUpdate(function (object) {
          camera.position.set(object.x1, object.y1, object.z1);
          orbitControls.target.x = object.x2;
          orbitControls.target.y = object.y2;
          orbitControls.target.z = object.z2;
          orbitControls.update();
        });
        tween.onComplete(function () {
          callBack && callBack();
        });
        tween.easing(TWEEN.Easing.Cubic.InOut);
        tween.start();
      }
    },

    //sphere rotation
    sphereRotation(data) {
      scene.children.forEach((e) => {
        //filter out planet
        if (e.isPlanet) {
          let planetData = data.filter((d) => d.name == e.name)[0];
          if (e.name == "saturn") {
            e.rotation.x = 0.05 * 2 * Math.PI;
          }
          //special rotation for Uranus
          if (e.name == "uranus") {
            e.rotation.z =
              e.rotation.z + planetData.rotation >= 2 * Math.PI
                ? 0
                : e.rotation.z + planetData.rotation;
            return;
          }
          e.rotation.y =
            e.rotation.y + planetData.rotation >= 2 * Math.PI
              ? 0
              : e.rotation.y + planetData.rotation;
        }
      });
    },

    //sphere revolution
    sphereRevolution(data) {
      scene.children.forEach((e) => {
        //filter planets
        if (e.isPlanet) {
          let planetData = data.filter((d) => d.name == e.name)[0]; //get planet data
          e.angle =
            e.angle + planetData.revolution >= 2 * Math.PI
              ? 0
              : e.angle + planetData.revolution;
          e.position.set(
            planetData.position[0] * Math.sin(e.angle),
            0,
            planetData.position[0] * Math.cos(e.angle)
          );
        }
      });
    },
  },
};
</script>
<style scoped lang='scss'>
.container {
  height: 100%;
  width: 100%;
  position: relative;
  #planetDiv {
    height: 100%;
    width: 100%;
  }
}
</style>