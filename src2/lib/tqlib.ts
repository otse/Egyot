import { default as THREE, OrthographicCamera, Clock, Scene, WebGLRenderer, Texture, TextureLoader, WebGLRenderTarget, ShaderMaterial, Mesh, PlaneBufferGeometry, Color, NearestFilter, RGBAFormat } from 'three';
import App from './App';
import { Win } from './Board';

// three quarter library

export namespace tqlib {

    let mem = [];

    export function loadTexture(file: string, key?: string, cb?): Texture {
        if (mem[key || file])
            return mem[key || file];

        let texture = new TextureLoader().load(file + `?v=${App.version}`, cb);

        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        mem[key || file] = texture;

        return texture;
    }

    export function rendertarget(w, h) {
        let target = new WebGLRenderTarget(w, h,
            {
                minFilter: NearestFilter,
                magFilter: NearestFilter,
                format: RGBAFormat
            });

        return target;
    }

    export function ortographiccamera(w, h) {
        let camera = new OrthographicCamera(
            w / - 2,
            w / 2,
            h / 2,
            h / - 2,
            - 100, 100);
        camera.position.set(0, 0, -100);
        camera.updateProjectionMatrix();

        return camera;
    }
}