import { default as THREE, OrthographicCamera, Clock, Scene, WebGLRenderer, Texture, TextureLoader, WebGLRenderTarget, ShaderMaterial, Mesh, PlaneBufferGeometry } from 'three';

export { THREE };

const fragmentBackdrop = `
varying vec2 vUv;
//uniform float time;
void main() {
	gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
}`

const fragmentPost = `
// Todo add effect
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
	gl_FragColor = texture2D( tDiffuse, vUv );
}`


const vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`

export namespace Two {

	export var changes = true;
	export var delta = 0;

	export var clock: Clock
	export var scene: Scene
	export var scene2: Scene
	export var camera: OrthographicCamera
	export var target: WebGLRenderTarget
	export var renderer: WebGLRenderer

	export var materialBg: ShaderMaterial
	export var materialPost: ShaderMaterial

	export var quadPost: Mesh

	//export var ambientLight: AmbientLight
	//export var directionalLight: DirectionalLight

	export function Update() {

		delta = clock.getDelta();

		//filmic.composer.render();
	}

	export function Render() {

		if (!changes)
			return;

		renderer.setRenderTarget(target);
		renderer.clear();
		renderer.render(scene, camera);

		renderer.setRenderTarget(null); // Naar scherm
		renderer.clear();
		renderer.render(scene2, camera);

		changes = false;
	}

	export var enderWidth;
	export var enderHeight;

	export var ender: Zx;

	export function Init() {

		console.log('Two Init');

		clock = new Clock();

		enderWidth = window.innerWidth;
		enderHeight = window.innerHeight;

		if (enderWidth % 2 != 0) {
			enderWidth -= 1;
		}
		if (enderHeight % 2 != 0) {
			enderHeight -= 1;
		}

		console.log('Ender Size ', enderWidth +', '+enderHeight);
		
		camera = new OrthographicCamera(
			enderWidth / - 2,
			enderWidth / 2,
			enderHeight / 2,
			enderHeight / - 2,
			- 100, 100);
		camera.position.set(0, 0, -100);

		ender = [enderWidth, enderHeight];

		scene = new Scene();
		scene2 = new Scene();

		let width = enderWidth;
		let height = enderHeight;

		if (window.devicePixelRatio == 2) {
			console.log('Two.js - your device scaling is 2. Scaling render target.');
			width *= 2;
			height *= 2;
		}

		console.log('Two WebGLRenderTarget ' + width + ', ' + height);

		target = new WebGLRenderTarget(
			width, height,
			{ minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat });

		renderer = new WebGLRenderer({ antialias: false });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(
			window.innerWidth, window.innerHeight);
		renderer.autoClear = true;
		renderer.setClearColor(0xffffff, 0);

		document.body.appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);

		SomeMore();

		(window as any).Two_ = Two;
	}

	function SomeMore() {
		/*materialBg = new ShaderMaterial({
			uniforms: { time: { value: 0.0 } },
			vertexShader: vertexScreen,
			fragmentShader: fragmentBackdrop
		});*/

		materialPost = new ShaderMaterial({
			uniforms: { tDiffuse: { value: target.texture } },
			vertexShader: vertexScreen,
			fragmentShader: fragmentPost,
			depthWrite: false
		});

		let plane = new PlaneBufferGeometry(
			window.innerWidth, window.innerHeight);

		/*let quad = new Mesh(plane, materialBg);
		quad.position.z = -100;
		scene.add(quad);*/

		quadPost = new Mesh(plane, materialPost);
		quadPost.position.z = -100;
		scene2.add(quadPost);
	}

	function onWindowResize() {

		camera.updateProjectionMatrix();

		renderer.setSize(
			window.innerWidth, window.innerHeight);
	}

	let mem = [];

	export function LoadTexture(file: string, salt?: string): Texture {
		if (mem[salt || file])
			return mem[salt || file];

		//console.log('LoadTexture ' + salt || file);

		let texture = new TextureLoader().load(file);

		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;

		mem[salt || file] = texture;

		return texture;
	}
}
