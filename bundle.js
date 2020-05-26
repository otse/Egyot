var duc = (function (exports, THREE) {
    'use strict';

    var THREE__default = 'default' in THREE ? THREE['default'] : THREE;

    // three quarter library
    var tqlib;
    (function (tqlib) {
        let mem = [];
        function loadtexture(file, key, cb) {
            if (mem[key || file])
                return mem[key || file];
            let texture = new THREE.TextureLoader().load(file + `?v=${App.version}`, cb);
            texture.magFilter = THREE__default.NearestFilter;
            texture.minFilter = THREE__default.NearestFilter;
            mem[key || file] = texture;
            return texture;
        }
        tqlib.loadtexture = loadtexture;
        function rendertarget(w, h) {
            const o = {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            };
            let target = new THREE.WebGLRenderTarget(w, h, o);
            return target;
        }
        tqlib.rendertarget = rendertarget;
        function ortographiccamera(w, h) {
            let camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -100, 100);
            camera.updateProjectionMatrix();
            return camera;
        }
        tqlib.ortographiccamera = ortographiccamera;
        function erase_children(group) {
            while (group.children.length > 0)
                group.remove(group.children[0]);
        }
        tqlib.erase_children = erase_children;
    })(tqlib || (tqlib = {}));

    const fragmentPost = `
// Todo add effect
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
	gl_FragColor = texture2D( tDiffuse, vUv );
}`;
    const vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
    // three quarter
    var tq;
    (function (tq) {
        tq.changes = true;
        tq.delta = 0;
        //export var ambientLight: AmbientLight
        //export var directionalLight: DirectionalLight
        function update() {
            tq.delta = tq.clock.getDelta();
            //filmic.composer.render();
        }
        tq.update = update;
        var reset = 0;
        var frames = 0;
        // https://github.com/mrdoob/stats.js/blob/master/src/Stats.js#L71
        function calc() {
            const s = Date.now() / 1000;
            frames++;
            if (s - reset >= 1) {
                reset = s;
                tq.fps = frames;
                frames = 0;
            }
            tq.memory = window.performance.memory;
        }
        tq.calc = calc;
        function render() {
            //if (!changes)
            //return;
            calc();
            //renderer.setSize(
            //	window.innerWidth, window.innerHeight);
            tq.renderer.setRenderTarget(tq.target);
            tq.renderer.clear();
            tq.renderer.render(tq.scene, tq.camera);
            tq.renderer.setRenderTarget(null); // Naar scherm
            tq.renderer.clear();
            tq.renderer.render(tq.scene2, tq.camera);
            //changes = false;
        }
        tq.render = render;
        function init() {
            console.log('ThreeQuarter Init');
            tq.clock = new THREE.Clock();
            tq.scene = new THREE.Scene();
            tq.scene.background = new THREE.Color('rgb(40, 72, 42)'); // #444
            tq.scene2 = new THREE.Scene();
            tq.rttscene = new THREE.Scene();
            //scene3.background = new Color('pink');
            tq.dpi = window.devicePixelRatio;
            if (tq.dpi == 2) {
                console.warn('DPI > 1. Egyt will scale by whole factors.');
            }
            tq.target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                minFilter: THREE__default.NearestFilter,
                magFilter: THREE__default.NearestFilter,
                format: THREE__default.RGBFormat
            });
            tq.renderer = new THREE.WebGLRenderer({ antialias: false });
            tq.renderer.setPixelRatio(tq.dpi);
            tq.renderer.setSize(window.innerWidth, window.innerHeight);
            tq.renderer.autoClear = true;
            tq.renderer.setClearColor(0xffffff, 0);
            document.body.appendChild(tq.renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);
            someMore();
            onWindowResize();
            window.tq = tq;
        }
        tq.init = init;
        function someMore() {
            /*materialBg = new ShaderMaterial({
                uniforms: { time: { value: 0.0 } },
                vertexShader: vertexScreen,
                fragmentShader: fragmentBackdrop
            });*/
            tq.materialPost = new THREE.ShaderMaterial({
                uniforms: { tDiffuse: { value: tq.target.texture } },
                vertexShader: vertexScreen,
                fragmentShader: fragmentPost,
                depthWrite: false
            });
            tq.plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
            /*let quad = new Mesh(plane, materialBg);
            quad.position.z = -100;
            scene.add(quad);*/
            tq.quadPost = new THREE.Mesh(tq.plane, tq.materialPost);
            tq.quadPost.position.z = -100;
            tq.scene2.add(tq.quadPost);
        }
        function onWindowResize() {
            tq.w = window.innerWidth;
            tq.h = window.innerHeight;
            if (tq.w % 2 != 0) ;
            if (tq.h % 2 != 0) ;
            let targetwidth = tq.w;
            let targetheight = tq.h;
            if (tq.dpi == 2) {
                targetwidth *= tq.dpi;
                targetheight *= tq.dpi;
            }
            tq.plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
            tq.quadPost.geometry = tq.plane;
            tq.target.setSize(targetwidth, targetheight);
            tq.camera = tqlib.ortographiccamera(tq.w, tq.h);
            tq.camera.updateProjectionMatrix();
            tq.renderer.setSize(tq.w, tq.h);
        }
    })(tq || (tq = {}));

    class Obj {
        constructor(struct) {
            this.order = 0;
            this.rate = 1;
            this.using = false;
            this.rtt = true;
            this.chunk = null;
            Obj.num++;
            this.struct = struct;
        }
        update() {
        }
        comes() {
            Obj.active++;
            this.using = true;
        }
        goes() {
            Obj.active--;
            this.using = false;
        }
        unset() {
            Obj.num--;
        }
    }
    (function (Obj) {
        Obj.active = 0;
        Obj.num = 0;
    })(Obj || (Obj = {}));
    var Obj$1 = Obj;

    var vecs;
    (function (vecs) {
        vecs.clone = (zx) => [...zx];
        function area_every(aabb, callback) {
            let y = aabb.min[1];
            for (; y <= aabb.max[1]; y++) {
                let x = aabb.max[0];
                for (; x >= aabb.min[0]; x--) {
                    callback([x, y]);
                }
            }
        }
        vecs.area_every = area_every;
        function two_one(p) {
            let copy = vecs.clone(p);
            copy[0] = p[0] / 2 + p[1] / 2;
            copy[1] = p[1] / 4 - p[0] / 4;
            return copy;
        }
        vecs.two_one = two_one;
        function un_two_one(p) {
            let x = p[0] - p[1] * 2;
            let y = p[1] * 2 + p[0];
            return [x, y];
        }
        vecs.un_two_one = un_two_one;
        function string(a) {
            const pr = (b) => b != undefined ? `, ${b}` : '';
            return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
        }
        vecs.string = string;
        function floor(a) {
            a[0] = Math.floor(a[0]);
            a[1] = Math.floor(a[1]);
            if (a[2] != undefined)
                a[2] = Math.floor(a[2]);
            return a;
        }
        vecs.floor = floor;
        function ceil(a) {
            a[0] = Math.ceil(a[0]);
            a[1] = Math.ceil(a[1]);
            if (a[2] != undefined)
                a[2] = Math.ceil(a[2]);
            return a;
        }
        vecs.ceil = ceil;
        function inv(a) {
            a[0] = -a[0];
            a[1] = -a[1];
            return a;
        }
        vecs.inv = inv;
        function multp(zx, n, n2) {
            zx[0] *= n;
            zx[1] *= n2 || n;
            return zx;
        }
        vecs.multp = multp;
        function divide(a, n, n2) {
            a[0] /= n;
            a[1] /= n2 || n;
            return a;
        }
        vecs.divide = divide;
        function multpClone(zx, n, n2) {
            let wen = [...zx];
            multp(wen, n, n2);
            return wen;
        }
        vecs.multpClone = multpClone;
        function subtract(a, b) {
            a[0] -= b[0];
            a[1] -= b[1];
            return a;
        }
        vecs.subtract = subtract;
        function add(a, b) {
            a[0] += b[0];
            a[1] += b[1];
            return a;
        }
        vecs.add = add;
        function abs(p) {
            p[0] = Math.abs(p[0]);
            p[1] = Math.abs(p[1]);
            return p;
        }
        vecs.abs = abs;
        function together(p) {
            //Abs(p);
            return p[0] + p[1];
        }
        vecs.together = together;
    })(vecs || (vecs = {}));
    var vecs$1 = vecs;

    class Rekt {
        constructor(struct) {
            this.offset = [0, 0];
            this.used = false;
            this.flick = false;
            this.plain = false;
            this.struct = struct;
            Rekt.num++;
            this.actualpos = [0, 0, 0];
            this.center = [0, 0];
            if (undefined == this.struct.opacity)
                this.struct.opacity = 1;
        }
        unset() {
            Rekt.num--;
        }
        multNone() {
        }
        rorder() {
            let p = vecs$1.clone(this.struct.xy);
            //let p = <zx>points.add(this.struct.xy, this.offset);
            this.mesh.renderOrder = Rekt.Srorder(p);
        }
        paint_alternate() {
            var _a;
            if (!Egyt$1.PAINT_OBJ_TICK_RATE)
                return;
            if (!this.used)
                return;
            this.flick = !this.flick;
            this.material.color.set(new THREE.Color(this.flick ? 'red' : 'blue'));
            if ((_a = this.struct.obj) === null || _a === void 0 ? void 0 : _a.chunk)
                this.struct.obj.chunk.changed = true;
        }
        unuse() {
            if (!this.used)
                return;
            this.used = false;
            this.getgroup().remove(this.mesh);
            Rekt.active--;
            this.geometry.dispose();
            this.material.dispose();
        }
        use() {
            var _a, _b;
            if (this.used)
                console.warn('rekt already inuse');
            Rekt.active++;
            this.used = true;
            this.geometry = new THREE.PlaneBufferGeometry(this.struct.wh[0], this.struct.wh[1], 1, 1);
            let map;
            if (this.struct.asset)
                map = tqlib.loadtexture(`assets/${this.struct.asset}.png`);
            this.material = new THREE.MeshBasicMaterial({
                map: map,
                transparent: true,
                opacity: this.struct.opacity,
                color: ((_b = (_a = this.struct.obj) === null || _a === void 0 ? void 0 : _a.chunk) === null || _b === void 0 ? void 0 : _b.childobjscolor) || this.struct.color || 0xffffff
            });
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
            this.mesh.matrixAutoUpdate = false;
            this.mesh.scale.set(1, 1, 1);
            if (this.struct.flip)
                this.mesh.scale.x = -this.mesh.scale.x;
            //UV.FlipPlane(this.geometry, 0, true);
            this.now_update_pos();
            this.getgroup().add(this.mesh);
        }
        getgroup() {
            var _a, _b;
            let c;
            if (c = (_a = this.struct.obj) === null || _a === void 0 ? void 0 : _a.chunk)
                if (((_b = this.struct.obj) === null || _b === void 0 ? void 0 : _b.rtt) && Egyt$1.USE_CHUNK_RT)
                    return c.grouprt;
                else
                    return c.group;
            else
                return tq.scene;
        }
        now_update_pos() {
            var _a;
            const d = this.struct.wh;
            let x, y;
            let p = vecs$1.clone(this.struct.xy);
            let offset = vecs$1.clone(this.offset);
            if (this.struct.tiled) {
                p = Rekt.Smult(p);
                offset = Rekt.Smult(offset);
            }
            vecs$1.add(p, offset);
            if (this.plain) {
                x = p[0];
                y = p[1];
            }
            else {
                if (Egyt$1.OFFSET_CHUNK_OBJ_REKT) {
                    let c = (_a = this.struct.obj) === null || _a === void 0 ? void 0 : _a.chunk;
                    if (c) {
                        vecs$1.subtract(p, c.rekt_offset);
                    }
                }
                x = p[0] / 2 + p[1] / 2;
                y = p[1] / 4 - p[0] / 4;
                this.center = [x, y];
                // middle bottom
                let w = d[0] / 2;
                let h = d[1] / 2;
                y += h;
            }
            this.actualpos = [x, y, 0];
            if (this.mesh) {
                this.rorder();
                this.mesh.position.fromArray(this.actualpos);
                this.mesh.updateMatrix();
            }
        }
    }
    (function (Rekt) {
        Rekt.num = 0;
        Rekt.active = 0;
        function Srorder(p) {
            return -p[1] + p[0];
        }
        Rekt.Srorder = Srorder;
        function Smult(p) {
            return vecs$1.multp(p, 24);
        }
        Rekt.Smult = Smult;
    })(Rekt || (Rekt = {}));
    var Rekt$1 = Rekt;

    class Man extends Obj$1 {
        constructor(stats) {
            super(stats);
        }
        produce() {
            return;
        }
        deproduce() {
        }
        update() {
        }
    }
    class Ply extends Man {
        constructor(stats) {
            super(stats);
            this.order = 9;
        }
        produce() {
            super.produce();
        }
        deproduce() {
        }
        update() {
        }
    }

    class World {
        static rig() {
            return new World;
        }
        constructor() {
            this.init();
            console.log('world');
        }
        add(obj) {
            let c = Egyt$1.map.get_chunk_at_tile(obj.struct.tile);
            let succeed = c.objs.add(obj);
            if (succeed) {
                obj.chunk = c;
                c.changed = true;
            }
            if (c.on)
                obj.comes();
        }
        remove(obj) {
        }
        update() {
        }
        init() {
            Egyt$1.ply = new Ply({
                tile: [0, 0]
            });
            Egyt$1.ply.comes();
        }
    }

    var Agriculture;
    (function (Agriculture) {
        const tillering = [
            'egyt/farm/wheat_i',
            'egyt/farm/wheat_i',
            'egyt/farm/wheat_il',
            'egyt/farm/wheat_il',
            'egyt/farm/wheat_il',
            'egyt/farm/wheat_ili',
        ];
        const ripening = [
            'egyt/farm/wheat_il',
            'egyt/farm/wheat_ili',
            'egyt/farm/wheat_ili',
            'egyt/farm/wheat_ilil',
            'egyt/farm/wheat_ilil',
        ];
        class Crop extends Obj$1 {
            constructor(growth, struct) {
                super(struct);
                this.growth = growth;
            }
        }
        Agriculture.Crop = Crop;
        class Wheat extends Crop {
            constructor(growth, struct) {
                super(growth, struct);
                this.flick = false;
                this.rate = 2.0;
                this.rekt = new Rekt$1({
                    obj: this,
                    asset: this.growth == 1 ? Egyt$1.sample(tillering) :
                        this.growth == 2 ? Egyt$1.sample(ripening) :
                            this.growth == 3 ? 'egyt/farm/wheat_ilili' : '',
                    xy: this.struct.tile,
                    wh: [22, 22],
                    tiled: true,
                });
            }
            update() {
                if (Egyt$1.PAINT_OBJ_TICK_RATE)
                    this.rekt.paint_alternate();
            }
            comes() {
                super.comes();
                this.rekt.use();
            }
            goes() {
                super.goes();
                this.rekt.unuse();
            }
            unset() {
                super.unset();
                this.rekt.unset();
            }
        }
        Agriculture.Wheat = Wheat;
        function init() {
            console.log('agriculture');
            window.Agriculture = Agriculture;
        }
        Agriculture.init = init;
        function update() {
        }
        Agriculture.update = update;
        function place_wheat(growth, tile) {
            if (Math.random() > .99)
                return;
            let wheat = new Wheat(growth, {
                tile: tile
            });
            Egyt$1.world.add(wheat);
            return wheat;
        }
        Agriculture.place_wheat = place_wheat;
        function area_wheat(growth, aabb) {
            const every = (pos) => place_wheat(growth, pos);
            vecs$1.area_every(aabb, every);
        }
        Agriculture.area_wheat = area_wheat;
    })(Agriculture || (Agriculture = {}));
    var Agriculture$1 = Agriculture;

    function min(a, b) {
        return [
            Math.min(a[0], b[0]),
            Math.min(a[1], b[1])
        ];
    }
    function max(a, b) {
        return [
            Math.max(a[0], b[0]),
            Math.max(a[1], b[1])
        ];
    }
    function remove(a, b) {
        return [
            a[0] - b[0],
            a[1] - b[1]
        ];
    }
    function add(a, b) {
        return [
            a[0] + b[0],
            a[1] + b[1]
        ];
    }
    function multiply(a, f) {
        let x = a[0] * f;
        let y = a[1] * f;
        return [x, y];
    }
    class aabb2 {
        constructor(a, b = undefined) {
            this.min = this.max = a;
            if (b) {
                this.extend(b);
            }
        }
        static dupe(a) {
            let b = new aabb2(a.min, a.max);
            return b;
        }
        extend(v) {
            this.min = min(this.min, v);
            this.max = max(this.max, v);
        }
        diagonal() {
            return remove(this.max, this.min);
        }
        center() {
            return add(this.min, multiply(this.diagonal(), 0.5));
        }
        exponent(n) {
            this.min[0] *= n;
            this.min[1] *= n;
            //this.min[2] *= n;
            this.max[0] *= n;
            this.max[1] *= n;
            //this.max[2] *= n;
        }
        translate(v) {
            add(this.min, v);
            add(this.max, v);
        }
        test(v) {
            if (this.min[0] <= v.min[0] && this.max[0] >= v.max[0] &&
                this.min[1] <= v.min[1] && this.max[1] >= v.max[1] //&&
            /*this.min[2] <= v.min[2] && this.max[2] >= v.max[2]*/ )
                return aabb2.IN;
            if (this.max[0] < v.min[0] || this.min[0] > v.max[0] ||
                this.max[1] < v.min[1] || this.min[1] > v.max[1] //||
            /*this.max[2] < v.min[2] || this.min[2] > v.max[2]*/ )
                return aabb2.OOB;
            return aabb2.CROSS;
        }
        test_oob(v) {
            if (this.max[0] < v.min[0] || this.min[0] > v.max[0] ||
                this.max[1] < v.min[1] || this.min[1] > v.max[1] //||
            /*this.max[2] < v.min[2] || this.min[2] > v.max[2]*/ )
                return aabb2.OOB;
            if (this.min[0] <= v.min[0] && this.max[0] >= v.max[0] &&
                this.min[1] <= v.min[1] && this.max[1] >= v.max[1] //&&
            /*this.min[2] <= v.min[2] && this.max[2] >= v.max[2]*/ )
                return aabb2.IN;
            return aabb2.CROSS;
        }
    }
    (function (aabb2) {
        aabb2.OOB = 0;
        aabb2.IN = 1;
        aabb2.CROSS = 2;
        //export enum TEST {
        //	OOB,
        //	IN,
        //	CROSS,
        //}
    })(aabb2 || (aabb2 = {}));

    var Tilization;
    (function (Tilization) {
        class Tile extends Obj$1 {
            constructor(asset, struct) {
                super(struct);
                this.rekt = new Rekt$1({
                    asset: asset,
                    tiled: true,
                    xy: this.struct.tile,
                    wh: [24, 12],
                });
            }
            comes() {
                super.comes();
                this.rekt.use();
            }
            goes() {
                super.goes();
                this.rekt.unuse();
            }
            update() {
            }
        }
        Tilization.Tile = Tile;
        function init() {
            console.log('tilization');
            window.Tilization = Tilization;
        }
        Tilization.init = init;
        function update() {
        }
        Tilization.update = update;
        function place_tile(chance, asset, pos) {
            if (Math.random() > chance / 100)
                return;
            let tile = new Tile(asset, {
                tile: pos
            });
            Egyt$1.world.add(tile);
            return tile;
        }
        Tilization.place_tile = place_tile;
        function area_sample(chance, assets, aabb) {
            const every = (pos) => place_tile(chance, Egyt$1.sample(assets), pos);
            vecs$1.area_every(aabb, every);
        }
        Tilization.area_sample = area_sample;
        function area(chance, asset, aabb) {
            const every = (pos) => place_tile(chance, asset, pos);
            vecs$1.area_every(aabb, every);
        }
        Tilization.area = area;
    })(Tilization || (Tilization = {}));
    var Tilization$1 = Tilization;

    class Chunk {
        constructor(x, y, master) {
            this.master = master;
            this.on = false;
            this.changed = true;
            this.rektcolor = 'white';
            this.master.total++;
            this.objs = new ChunkObjs2(this);
            //this.color = Egyt.sample(colors);
            this.p = [x, y];
            this.group = new THREE.Group;
            this.grouprt = new THREE.Group;
            this.set_bounds();
        }
        set_bounds() {
            let x = this.p[0];
            let y = this.p[1];
            let basest_tile = vecs$1.multp([x + 1, y], this.master.span * 24);
            this.tile_n = [x - 3, y + 3];
            vecs$1.multp(this.tile_n, this.master.span * 24);
            this.rekt_offset = vecs$1.clone(basest_tile);
            if (Egyt$1.OFFSET_CHUNK_OBJ_REKT) {
                let frightening = [...basest_tile, 0];
                frightening = vecs$1.two_one(frightening);
                frightening[2] = 0;
                this.group.position.fromArray(frightening);
                this.grouprt.position.fromArray(frightening);
                this.group.renderOrder = this.grouprt.renderOrder = Rekt$1.Srorder(this.tile_n);
            }
            // non screen bound not used anymore
            this.bound = new aabb2([x * this.master.span, y * this.master.span], [(x + 1) * this.master.span, (y + 1) * this.master.span]);
            this.screen = Chunk.Sscreen(x, y, this.master);
        }
        update_color() {
            return;
            //if (!this.rttrekt.inuse)
            //	return;
            //this.rttrekt.material.color.set(new Color(this.rektcolor));
            //this.rttrekt.material.needsUpdate = true;
        }
        empty() {
            return this.objs.tuples.length < 1;
        }
        comes() {
            if (this.on || this.empty())
                return;
            this.objs.comes();
            tq.scene.add(this.group, this.grouprt);
            this.comes_pt2();
            this.on = true;
            return true;
        }
        comes_pt2() {
            if (!Egyt$1.USE_CHUNK_RT)
                return;
            let rtt = 0;
            for (let tuple of this.objs.tuples)
                if (tuple[0].rtt)
                    rtt++;
            const threshold = rtt >= 10;
            if (!threshold)
                return;
            if (!this.rt)
                this.rt = new ChunkRt(this);
            this.rt.comes();
            this.rt.render();
        }
        goes() {
            var _a;
            if (!this.on)
                return;
            tq.scene.remove(this.group, this.grouprt);
            tqlib.erase_children(this.group);
            tqlib.erase_children(this.grouprt);
            this.objs.goes();
            (_a = this.rt) === null || _a === void 0 ? void 0 : _a.goes();
            this.on = false;
        }
        test() {
            return Egyt$1.game.view.test(this.screen) != aabb2.OOB;
        }
        oob() {
            return Egyt$1.game.view.test_oob(this.screen) == aabb2.OOB;
        }
        update() {
            var _a;
            this.objs.updates();
            if (Egyt$1.USE_CHUNK_RT && this.changed)
                (_a = this.rt) === null || _a === void 0 ? void 0 : _a.render();
            this.changed = false;
        }
    }
    (function (Chunk) {
        function Sscreen(x, y, master) {
            let basest_tile = vecs$1.multp([x + 1, y], master.span * 24);
            let real = vecs$1.two_one(basest_tile);
            vecs$1.subtract(real, [0, -master.height / 2]);
            return new aabb2(vecs$1.add(vecs$1.clone(real), [-master.width / 2, -master.height / 2]), vecs$1.add(vecs$1.clone(real), [master.width / 2, master.height / 2]));
        }
        Chunk.Sscreen = Sscreen;
    })(Chunk || (Chunk = {}));
    class ChunkObjs2 {
        constructor(chunk) {
            this.chunk = chunk;
            this.rtts = 0;
            this.tuples = [];
        }
        rate(obj) {
            return this.tuples.length * obj.rate;
        }
        where(obj) {
            let i = this.tuples.length;
            while (i--)
                if (this.tuples[i][0] == obj)
                    return i;
        }
        add(obj) {
            let i = this.where(obj);
            if (i == undefined) {
                const rate = this.rate(obj);
                this.tuples.push([obj, rate]);
                return true;
            }
        }
        remove(obj) {
            let i = this.where(obj);
            if (i != undefined) {
                this.tuples.splice(i, 1);
                return true;
            }
        }
        updates() {
            for (let tuple of this.tuples) {
                let rate = tuple[1]--;
                if (rate <= 0) {
                    tuple[0].update();
                    tuple[1] = this.rate(tuple[0]);
                }
            }
        }
        comes() {
            for (let tuple of this.tuples) {
                tuple[0].comes();
            }
        }
        goes() {
            for (let tuple of this.tuples) {
                tuple[0].goes();
            }
        }
    }
    class ChunkMaster {
        constructor(testType, span) {
            this.testType = testType;
            this.total = 0;
            this.arrays = [];
            this.refit = true;
            this.span = span;
            this.span2 = span * span;
            this.width = span * 24;
            this.height = span * 12;
            this.fitter = new Tailorer(this);
        }
        update() {
            if (this.refit) {
                this.fitter.update();
            }
        }
        big(t) {
            return vecs$1.floor(vecs$1.divide([...t], this.span));
        }
        at(x, y) {
            let c;
            if (this.arrays[y] == undefined)
                this.arrays[y] = [];
            c = this.arrays[y][x];
            return c;
        }
        make(x, y) {
            let c;
            c = this.at(x, y);
            if (c)
                return c;
            c = this.arrays[y][x] = new this.testType(x, y, this);
            return c;
        }
        which(t) {
            let b = this.big(t);
            let c = this.guarantee(b[0], b[1]);
            return c;
        }
        guarantee(x, y) {
            return this.at(x, y) || this.make(x, y);
        }
    }
    class Tailorer {
        constructor(master) {
            this.master = master;
            this.shown = [];
            this.colors = [];
        }
        off() {
            let i = this.shown.length;
            while (i--) {
                let c;
                c = this.shown[i];
                c.update();
                if (c.oob()) {
                    c.goes();
                    this.shown.splice(i, 1);
                }
            }
        }
        update() {
            let middle = Egyt$1.map.ask_world_pixel(Egyt$1.game.view.center()).tile;
            let b = this.master.big(middle);
            this.lines = this.total = 0;
            this.off();
            this.slither(b, Tailorer.forward);
            this.slither(b, Tailorer.reverse);
        }
        slither(b, n) {
            let x = b[0], y = b[1];
            let i = 0, j = 0, s = 0, u = 0;
            while (true) {
                i++;
                let c;
                c = this.master.guarantee(x, y);
                if (c.oob()) {
                    if (s > 2) {
                        if (j == 0)
                            j = 1;
                        if (j == 2)
                            j = 3;
                    }
                    u++;
                }
                else {
                    u = 0;
                    if (c.comes()) {
                        this.shown.push(c);
                    }
                }
                if (j == 0) {
                    y += n;
                    s++;
                }
                else if (j == 1) {
                    x -= n;
                    j = 2;
                    s = 0;
                }
                else if (j == 2) {
                    y -= n;
                    s++;
                }
                else if (j == 3) {
                    x -= n;
                    j = 0;
                    s = 0;
                }
                if (!s)
                    this.lines++;
                this.total++;
                if (u > 5 || i >= 350) {
                    break;
                }
            }
        }
    }
    Tailorer.forward = 1;
    Tailorer.reverse = -1;
    class ChunkRt {
        constructor(chunk) {
            this.chunk = chunk;
            this.padding = Egyt$1.YUM * 4;
            this.offset = [0, 0];
            this.w = this.chunk.master.width + this.padding;
            this.h = this.chunk.master.height + this.padding;
            this.camera = tqlib.ortographiccamera(this.w, this.h);
            let p2 = [this.chunk.p[0] + 1, this.chunk.p[1]];
            vecs$1.multp(p2, this.chunk.master.span);
            this.rekt = new Rekt$1({
                tiled: true,
                xy: p2,
                wh: [this.w, this.h],
                asset: 'egyt/tenbyten'
            });
        }
        // todo pool the rts?
        comes() {
            this.rekt.use();
            this.rekt.mesh.renderOrder = Rekt$1.Srorder(this.chunk.tile_n);
            this.target = tqlib.rendertarget(this.w, this.h);
        }
        goes() {
            this.rekt.unuse();
            this.target.dispose();
        }
        render() {
            while (tq.rttscene.children.length > 0)
                tq.rttscene.remove(tq.rttscene.children[0]);
            const group = this.chunk.grouprt;
            group.position.set(0, -this.h / 2, 0);
            tq.rttscene.add(group);
            tq.renderer.setRenderTarget(this.target);
            tq.renderer.clear();
            tq.renderer.render(tq.rttscene, this.camera);
            this.rekt.material.map = this.target.texture;
        }
    }

    class Map {
        constructor() {
            window.Chunk = Chunk;
            this.statmaster = new ChunkMaster(Chunk, 20);
            this.dynmaster = new ChunkMaster(Chunk, 20);
            this.mouse_tile = [0, 0];
            this.mark = new Rekt$1({
                xy: [0, 0],
                wh: [22, 25],
                asset: 'egyt/iceblock'
            });
            //this.mark.use();
            //this.mark.mesh.renderOrder = 999;
            //this.mark.dontOrder = true;
        }
        static state() {
            return new Map;
        }
        init() {
            tqlib.loadtexture('assets/egyt/tileorange.png', undefined, () => Egyt$1.resourced('TILE_ORANGE'));
            tqlib.loadtexture('assets/egyt/farm/wheat_i.png', undefined, () => Egyt$1.resourced('WHEAT_I'));
            tqlib.loadtexture('assets/egyt/farm/wheat_il.png', undefined, () => Egyt$1.resourced('WHEAT_IL'));
            tqlib.loadtexture('assets/egyt/farm/wheat_ili.png', undefined, () => Egyt$1.resourced('WHEAT_ILI'));
            tqlib.loadtexture('assets/egyt/farm/wheat_ilil.png', undefined, () => Egyt$1.resourced('WHEAT_ILIL'));
            tqlib.loadtexture('assets/egyt/farm/wheat_ilili.png', undefined, () => Egyt$1.resourced('WHEAT_ILILI'));
            tqlib.loadtexture('assets/egyt/tree/oaktree3.png', undefined, () => Egyt$1.resourced('TREE_1'));
            tqlib.loadtexture('assets/egyt/tree/oaktree4.png', undefined, () => Egyt$1.resourced('TREE_2'));
        }
        populate() {
            let granary = new Rekt$1({
                tiled: true,
                xy: [6, -1],
                wh: [216, 168],
                asset: 'egyt/building/granary'
            });
            let tobaccoshop = new Rekt$1({
                tiled: true,
                xy: [-13, 2],
                wh: [144, 144],
                asset: 'egyt/building/redstore'
            });
            granary.use();
            //tobaccoshop.initiate();
            //Agriculture.area_wheat(1, new aabb3([-9, -4, 0], [3, -22, 0]));
            Agriculture$1.area_wheat(2, new aabb2([5, -4], [5 + 50 - 2, -12]));
            Agriculture$1.area_wheat(2, new aabb2([5 + 50, -4], [5 + 50 - 2 + 50, -12]));
            Agriculture$1.area_wheat(3, new aabb2([5, -14], [5 + 50 - 2, -22]));
            Agriculture$1.area_wheat(3, new aabb2([5 + 50, -14], [5 + 50 - 2 + 50, -22]));
            //Tilization.area_sample(30, stones, new aabb3([-2, 0, 0], [6, -2, 0]));
            const gravels = [
                'egyt/ground/gravel1',
                'egyt/ground/gravel2',
            ];
            // long road se
            Tilization$1.area_sample(50, gravels, new aabb2([-13, 0], [400, -2]));
            // long road ne
            Tilization$1.area_sample(50, gravels, new aabb2([-13, 0], [-11, 400]));
            // farms se
            Agriculture$1.area_wheat(1, new aabb2([-15, 21], [-40, 101]));
            Agriculture$1.area_wheat(1, new aabb2([-15, 103], [-40, 183]));
        }
        get_chunk_at_tile(t) {
            return this.statmaster.which(t);
        }
        ask_world_pixel(query) {
            let p = query;
            let p1 = vecs$1.clone(p);
            p1[0] = p[0] - p[1] * 2;
            p1[1] = p[1] * 2 + p[0];
            let p2 = vecs$1.clone(p1);
            vecs$1.divide(p2, 24);
            vecs$1.floor(p2);
            p2[0] += 1; // necessary
            let p3 = vecs$1.clone(p2);
            vecs$1.multp(p3, 24);
            return { tile: p2, mult: p3 };
        }
        mark_mouse() {
            let m = [...App.move];
            m[1] = -m[1];
            vecs$1.divide(m, Egyt$1.game.scale);
            let p = [Egyt$1.game.view.min[0], Egyt$1.game.view.max[1]];
            vecs$1.add(p, m);
            const mouse = this.ask_world_pixel(p);
            this.mouse_tile = mouse.tile;
            this.mark.struct.xy = mouse.mult;
            this.mark.now_update_pos();
        }
        update() {
            this.mark_mouse();
            this.statmaster.update();
            let worldPixelsLeftUpperCorner = [Egyt$1.game.view.min[0], Egyt$1.game.view.max[1]];
            let worldPixelsRightLowerCorner = [Egyt$1.game.view.max[0], Egyt$1.game.view.min[1]];
            const x = this.ask_world_pixel(worldPixelsLeftUpperCorner).tile;
            const y = this.ask_world_pixel(worldPixelsRightLowerCorner).tile;
        }
    }

    var Board;
    (function (Board) {
        var body;
        function load_sheet(file) {
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = file;
            document.head.appendChild(link);
        }
        Board.load_sheet = load_sheet;
        function collapse() {
        }
        Board.collapse = collapse;
        Board.collapsed = {};
        function rig_charges(nyan) {
            // In Vsc
            // View -> Toggle Word Wrap
            /*
                A hyperlink and a paragraph form a collapser
            */
            const _collapse = (jay) => {
                Board.collapsed[jay.text()] = !!jay.hasClass('toggle');
            };
            nyan.find('a').next('div').addClass('bar').prev().addClass('foo').click(function () {
                let jay = $(this);
                jay.toggleClass("toggle").next('.bar').toggleClass('toggle');
                _collapse(jay);
            }).append('<span>');
            nyan.find('a.foo').each((i, e) => {
                let jay = $(e);
                window.afoo = jay;
                if (jay.attr('collapse') == "") {
                    jay.addClass('toggle').next().addClass('toggle');
                    _collapse(jay);
                }
            });
            /*
                A div with two spans is an rpg item.
            */
            nyan.find('div').children().find('span').next('span').parent().addClass('rpgitem');
        }
        Board.rig_charges = rig_charges;
        function messageslide(title, message) {
            let jay = $('<div>').addClass('messageslide').append(`<span>${title}`).append(`<span>${message}`);
            Board.win.append(jay);
        }
        Board.messageslide = messageslide;
        function init() {
            window.Chains = Board;
            body = $('body');
            Board.win = $('#win');
        }
        Board.init = init;
        function update() {
            if (Board.collapsed.Stats) {
                Board.win.find('#fpsStat').text(`Fps: ${parseInt(tq.fps)}`);
                Board.win.find('#memoryStat').text(`Memory: ${(tq.memory.usedJSHeapSize / 1048576).toFixed(4)} / ${tq.memory.jsHeapSizeLimit / 1048576}`);
                Board.win.find('#gameAabb').html(`View bounding volume: <span>${Egyt$1.game.view.min[0]}, ${Egyt$1.game.view.min[1]} x ${Egyt$1.game.view.max[0]}, ${Egyt$1.game.view.max[1]} `);
                //Board.win.find('#gamePos').text(`View pos: ${points.string(Egyt.game.pos)}`);
                Board.win.find('#numChunks').text(`Num chunks: ${Egyt$1.map.statmaster.fitter.shown.length} / ${Egyt$1.map.statmaster.total}`);
                Board.win.find('#numObjs').html(`Num objs: ${Obj$1.active} / ${Obj$1.num}`);
                Board.win.find('#numRekts').html(`Num rekts: ${Rekt$1.active} / ${Rekt$1.num}`);
                let b = Egyt$1.map.statmaster.big(Egyt$1.map.mouse_tile);
                let c = Egyt$1.map.statmaster.at(b[0], b[1]);
                Board.win.find('#square').text(`Mouse: ${vecs$1.string(Egyt$1.map.mouse_tile)}`);
                Board.win.find('#squareChunk').text(`Mouse chunk: ${vecs$1.string(b)}`);
                Board.win.find('#squareChunkRt').text(`Mouse chunk rt: ${(c === null || c === void 0 ? void 0 : c.rt) ? 'true' : 'false'}`);
                Board.win.find('#snakeTurns').text(`CSnake turns: ${Egyt$1.map.statmaster.fitter.lines}`);
                Board.win.find('#snakeTotal').text(`CSnake total: ${Egyt$1.map.statmaster.fitter.total}`);
            }
        }
        Board.update = update;
        function raw(html) {
            let nyan = $('<nyan>');
            let jay = $(html);
            nyan.append(jay);
            rig_charges(nyan);
            Board.win.append(jay);
            return nyan;
        }
        Board.raw = raw;
    })(Board || (Board = {}));

    class Game {
        constructor() {
            console.log('Game');
            this.rekts = [];
            this.objs = [];
            this.pos = [0, 0, 0]; //[-1665, 3585, 0];
            this.dpi = window.devicePixelRatio;
            this.scale = 1 / this.dpi;
            this.view = new aabb2([0, 0]);
            this.frustumRekt = new Rekt$1({
                name: 'Frustum',
                xy: [0, 0],
                wh: [1, 1],
                asset: 'egyt/128'
            });
            this.frustumRekt.plain = true; // dont 2:1
            this.frustumRekt.use();
            this.frustumRekt.mesh.renderOrder = 9999999;
            this.frustumRekt.material.wireframe = true;
        }
        static rig() {
            return new Game();
        }
        update() {
            this.sels();
            let speed = 5;
            const factor = 1 / this.dpi;
            let p = [...this.pos];
            if (App.map['x'])
                speed *= 10;
            if (App.map['w'] || App.map['W'])
                p[1] -= speed;
            if (App.map['s'] || App.map['S'])
                p[1] += speed;
            if (App.map['a'] || App.map['A'])
                p[0] += speed;
            if (App.map['d'] || App.map['D'])
                p[0] -= speed;
            this.pos = [...p];
            if (App.wheel > 0) {
                if (this.scale < 1) {
                    this.scale = 1;
                }
                else {
                    this.scale += factor;
                }
                if (this.scale > 2 / this.dpi)
                    this.scale = 2 / this.dpi;
                console.log('scale up', this.scale);
            }
            else if (App.wheel < 0) {
                this.scale -= factor;
                if (this.scale < .5 / this.dpi)
                    this.scale = .5 / this.dpi;
                console.log('scale down', this.scale);
            }
            tq.scene.scale.set(this.scale, this.scale, 1);
            let p2 = vecs$1.multpClone(p, this.scale);
            tq.scene.position.set(p2[0], p2[1], 0);
            let w = tq.target.width;
            let h = tq.target.height;
            let w2 = w / this.dpi / this.scale;
            let h2 = h / this.dpi / this.scale;
            this.view = new aabb2([-p[0] - w2 / 2, -p[1] - h2 / 2], [-p[0] + w2 / 2, -p[1] + h2 / 2]);
            vecs$1.floor(this.view.min);
            vecs$1.floor(this.view.max);
            this.focal = [-p[0], -p[1], 0];
            return;
        }
        sels() {
            /*if (App.left) {
                if (!this.selection)
                    this.selection = new Selection();

                let pos = [...App.move];

                pos[1] = window.innerHeight - pos[1];

                this.selection.Update(
                    pos as Zx);
            }
            else if (this.selection) {
                this.selection.End();
                this.selection = null;
            }*/
        }
    }

    var Forestation;
    (function (Forestation) {
        let positions = [[12, 5], [20, 7], [16, 4], [8, 11], [28, 7], [40, 8], [39, 13], [17, 32], [-21, 11], [-18, 16], [-19, -28], [-24, -29], [-27, -13], [-17, 9], [-18, -1], [-6, 34], [65, 11], [0, 87], [5, 125], [-1, 172], [-62, 36], [-72, 125], [-65, 216], [4, 182], [14, 162], [2, 177], [3, 198], [6, 155], [7, 291], [-38, 350], [-59, 162], [-43, 112], [-106, 52], [154, 20], [213, 21], [141, -53], [23, -60], [62, -65], [260, -62], [241, -49], [251, -45], [220, -36], [209, -57], [223, -65], [209, -45], [181, -67], [190, -83], [221, -88], [264, -87], [274, -95], [263, -106], [255, -106], [237, -110], [248, -124], [239, -65], [221, -49], [189, -94], [263, -55], [271, -44], [278, -61], [246, -51], [240, -55], [226, -43], [228, -39], [208, -49], [248, -65], [227, -70], [230, -17], [210, 12], [269, 33], [275, 156], [66, -210], [125, -49], [-106, 46], [-98, 44], [-97, 55], [-108, -67], [92, -26], [73, -29], [110, -11], [3, -26], [-19, -52], [70, -36], [-35, -82], [-23, -90], [-19, -118], [-169, 19], [20, 160], [36, 92], [-62, 91], [-112, 181], [-114, 177], [-106, 179], [-107, 174], [-102, 167], [-108, 159], [-101, 192], [30, -29], [25, -33], [31, -36], [36, -25], [41, -38], [6, -55], [25, -79], [23, -87], [125, -54], [176, -4], [-164, 12], [-157, 19], [-7, 254], [-26, 58]];
        let plopping;
        let trees = [];
        const treez = [
            'egyt/tree/oaktree3',
            'egyt/tree/oaktree4',
        ];
        class Tree extends Obj$1 {
            constructor(struct) {
                super(struct);
                //this.rtt = false
                this.rate = 10;
                this.rekt = new Rekt$1({
                    obj: this,
                    asset: Egyt$1.sample(treez),
                    xy: this.struct.tile,
                    wh: [120, 132],
                    tiled: true,
                });
                this.rekt.offset = [1, -1];
                trees.push(this);
            }
            update() {
                if (Egyt$1.PAINT_OBJ_TICK_RATE)
                    this.rekt.paint_alternate();
            }
            comes() {
                super.comes();
                this.rekt.use();
            }
            goes() {
                super.goes();
                this.rekt.unuse();
            }
            unset() {
                super.unset();
                this.rekt.unset();
            }
        }
        Forestation.Tree = Tree;
        function init() {
            console.log('forestation');
            window.Forestation = Forestation;
        }
        Forestation.init = init;
        function populate() {
            console.log(`add ${positions.length} trees from save`);
            for (let pos of positions) {
                let tree = new Tree({
                    tile: pos
                });
                Egyt$1.world.add(tree);
            }
        }
        Forestation.populate = populate;
        function update() {
            if (!plopping && App.map['t'] == 1) {
                plopping = plop_tree();
            }
            if (plopping) {
                let tree = plopping;
                let p = vecs$1.clone(Egyt$1.map.mouse_tile);
                tree.struct.tile = p;
                tree.rekt.struct.xy = p;
                tree.rekt.now_update_pos();
                if (App.left) {
                    plopping = null;
                    tree.goes();
                    tree.unset();
                    let tree2 = new Tree({
                        tile: p
                    });
                    Egyt$1.world.add(tree2);
                }
            }
        }
        Forestation.update = update;
        function get_positions() {
            let a = [];
            for (let tree of trees) {
                a.push(tree.struct.tile);
            }
            return JSON.stringify(a);
        }
        Forestation.get_positions = get_positions;
        function plop_tree() {
            let tree = new Tree({
                tile: [0, 0]
            });
            tree.comes();
            // dont add to world yet
            //Egyt.world.add(plop);
            return tree;
        }
        Forestation.plop_tree = plop_tree;
    })(Forestation || (Forestation = {}));
    var Forestation$1 = Forestation;

    var Egyt;
    (function (Egyt) {
        Egyt.USE_CHUNK_RT = true;
        Egyt.OFFSET_CHUNK_OBJ_REKT = true;
        Egyt.PAINT_OBJ_TICK_RATE = false;
        Egyt.YUM = 24; // evenly divisible
        var started = false;
        function sample(a) {
            return a[Math.floor(Math.random() * a.length)];
        }
        Egyt.sample = sample;
        let RESOURCES;
        (function (RESOURCES) {
            RESOURCES[RESOURCES["UNDEFINED_OR_INIT"] = 0] = "UNDEFINED_OR_INIT";
            RESOURCES[RESOURCES["TILE_ORANGE"] = 1] = "TILE_ORANGE";
            RESOURCES[RESOURCES["WHEAT_I"] = 2] = "WHEAT_I";
            RESOURCES[RESOURCES["WHEAT_IL"] = 3] = "WHEAT_IL";
            RESOURCES[RESOURCES["WHEAT_ILI"] = 4] = "WHEAT_ILI";
            RESOURCES[RESOURCES["WHEAT_ILIL"] = 5] = "WHEAT_ILIL";
            RESOURCES[RESOURCES["WHEAT_ILILI"] = 6] = "WHEAT_ILILI";
            RESOURCES[RESOURCES["TREE_1"] = 7] = "TREE_1";
            RESOURCES[RESOURCES["TREE_2"] = 8] = "TREE_2";
            //FONT_YELLOW,
            //FONT_MISSION,
            //SPRITES,
            RESOURCES[RESOURCES["COUNT"] = 9] = "COUNT";
        })(RESOURCES = Egyt.RESOURCES || (Egyt.RESOURCES = {}));
        let resources_loaded = 0b0;
        function resourced(word) {
            resources_loaded |= 0b1 << RESOURCES[word];
            try_start();
        }
        Egyt.resourced = resourced;
        function try_start() {
            let count = 0;
            let i = 0;
            for (; i < RESOURCES.COUNT; i++)
                (resources_loaded & 0b1 << i) ? count++ : void (0);
            if (count == RESOURCES.COUNT)
                start();
        }
        function critical(mask) {
            // Couldn't load
            console.error('resource', mask);
        }
        Egyt.critical = critical;
        function init() {
            console.log('egyt init');
            Egyt.game = Game.rig();
            Egyt.world = World.rig();
            Egyt.map = Map.state();
            Egyt.map.init();
            Forestation$1.init();
            Tilization$1.init();
            resourced('UNDEFINED_OR_INIT');
            window.Egyt = Egyt;
        }
        Egyt.init = init;
        function start() {
            if (started)
                return;
            console.log('egyt starting');
            if (window.location.href.indexOf("#nochunkrt") != -1)
                Egyt.USE_CHUNK_RT = false;
            Egyt.map.populate();
            Forestation$1.populate();
            //	Win.load_sheet('style95.css');
            //else
            //	Win.load_sheet('style2.css');
            Board.init();
            Board.raw(`
		<div>May have to reload for latest version<br/>
		<br />
		<div class="region small">
			<a>Tutorial</a>
			<div>
				Move the view with <key>W</key> <key>A</key> <key>S</key> <key>D</key>.
				Scrollwheel to zoom. Hold <key>X</key> to go faster.
			</div>

			<a>World editing</a>
			<div>
				You can plop objects with these shortcuts.
				<br/><br/>
				<key>T</key> tree<br/>
				<key>Y</key> tile<br/>
				<key>X</key> delete<br/>
				<key>Esc</key> cancel<br/>
			</div>

			<a>Settings</a>
			<div>
				Nothing here yet
			</div>

			<a collapse>Stats</a>
			<div class="stats">
				<span id="fpsStat">xx</span><br/>
				<span id="memoryStat">xx</span><br/>
				<br/>
				<span id="gameAabb"></span><br/>
				<br/>
				<span id="numChunks"></span><br/>
				<span id="numObjs"></span><br/>
				<span id="numRekts"></span><br/>
				<br/>
				<span id="square"></span><br/>
				<span id="squareChunk"></span><br/>
				<span id="squareChunkRt">xx</span><br/>
				<br />
				<span id="snakeTurns"></span><br/>
				<span id="snakeTotal"></span><br/>
				<br/>
				<span id="USE_CHUNK_RTT">USE_CHUNK_RTT: ${Egyt.USE_CHUNK_RT}</span><br/>
				<span id="OFFSET_CHUNK_OBJ_REKT">OFFSET_CHUNK_OBJ_REKT: ${Egyt.OFFSET_CHUNK_OBJ_REKT}</span><br/>
				<span id="PAINT_OBJ_TICK_RATE">PAINT_OBJ_TICK_RATE: ${Egyt.PAINT_OBJ_TICK_RATE}</span><br/>

			</div>

			<a>Items Demo</a>
			<div>
				<div>
					<span>Coral Orb</span>
					<span>It used to belong to an elemental spirit. It has the ability to summon rainstorms.</span>
				</div>
			</div>
		</div>`);
            //setTimeout(() => Win.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);
            started = true;
        }
        Egyt.start = start;
        function update() {
            if (!started)
                return;
            Egyt.game.update();
            Forestation$1.update();
            Tilization$1.update();
            Agriculture$1.update();
            Egyt.world.update();
            Egyt.map.update();
            Board.update();
        }
        Egyt.update = update;
    })(Egyt || (Egyt = {}));
    var Egyt$1 = Egyt;

    (function (App) {
        App.version = '0.05';
        App.map = {};
        App.wheel = 0;
        App.move = [0, 0];
        App.left = false;
        function onkeys(event) {
            const key = event.key;
            //console.log(event);
            if ('keydown' == event.type)
                App.map[key] = (undefined == App.map[key])
                    ? 1 /* PRESSED */
                    : 3 /* AGAIN */;
            else if ('keyup' == event.type)
                App.map[key] = 0 /* UP */;
            if (key == 114) // Zoeken op pagina
                event.preventDefault();
            return;
        }
        function onwheel(event) {
            let up = event.deltaY < 0;
            App.wheel = up ? 1 : -1;
        }
        function onmove(event) {
            App.move[0] = event.clientX;
            App.move[1] = event.clientY;
        }
        function ondown(event) {
            if (event.button == 0)
                App.left = true;
        }
        function onup(event) {
            if (event.button == 0)
                App.left = false;
        }
        function Boot(version) {
            App.version = version;
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmove;
            document.onmousedown = ondown;
            document.onmouseup = onup;
            document.onwheel = onwheel;
            tq.init();
            Egyt$1.init();
            loo();
            setTimeout(() => tq.changes = true, 10);
        }
        App.Boot = Boot;
        // Lokale functies
        const Delay = () => {
            for (let i in App.map) {
                if (1 /* PRESSED */ == App.map[i])
                    App.map[i] = 2 /* DELAY */;
                else if (0 /* UP */ == App.map[i])
                    delete App.map[i];
            }
        };
        const loo = (timestamp) => {
            requestAnimationFrame(loo);
            tq.update();
            Egyt$1.update();
            tq.render();
            App.wheel = 0;
            Delay();
        };
    })(exports.App || (exports.App = {}));
    window['App'] = exports.App;
    var App = exports.App;

    exports.default = App;

    return exports;

}({}, THREE));
