var duc = (function (exports, THREE) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var THREE__default = /*#__PURE__*/_interopDefaultLegacy(THREE);

    // three quarter library
    var tqlib;
    (function (tqlib) {
        let mem = [];
        function loadtexture(file, key, cb) {
            if (mem[key || file])
                return mem[key || file];
            let texture = new THREE.TextureLoader().load(file + `?v=${App.version}`, cb);
            texture.magFilter = THREE__default['default'].NearestFilter;
            texture.minFilter = THREE__default['default'].NearestFilter;
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
	vec4 clr = texture2D( tDiffuse, vUv );
	clr.rgb = mix(clr.rgb, vec3(0.5), 0.0);
	gl_FragColor = clr;
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
            calc();
            tq.renderer.setRenderTarget(tq.target);
            tq.renderer.clear();
            tq.renderer.render(tq.scene, tq.camera);
            tq.renderer.setRenderTarget(null); // Naar scherm
            tq.renderer.clear();
            tq.renderer.render(tq.scene2, tq.camera);
        }
        tq.render = render;
        function init() {
            console.log('ThreeQuarter Init');
            tq.clock = new THREE.Clock();
            tq.scene = new THREE.Scene();
            tq.scene.background = new THREE.Color('rgb(40, 72, 42)');
            tq.scene2 = new THREE.Scene();
            tq.rttscene = new THREE.Scene();
            tq.ndpi = window.devicePixelRatio;
            console.log(`window innerWidth, innerHeight ${window.innerWidth} x ${window.innerHeight}`);
            if (tq.ndpi > 1) {
                console.warn('Dpi i> 1. Game may scale.');
            }
            tq.target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                minFilter: THREE__default['default'].NearestFilter,
                magFilter: THREE__default['default'].NearestFilter,
                format: THREE__default['default'].RGBFormat
            });
            tq.renderer = new THREE.WebGLRenderer({ antialias: false });
            tq.renderer.setPixelRatio(1);
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
            //if (ndpi == 2) {
            //	targetwidth *= ndpi;
            //	targetheight *= ndpi;
            //}
            tq.plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
            tq.quadPost.geometry = tq.plane;
            tq.target.setSize(targetwidth, targetheight);
            tq.camera = tqlib.ortographiccamera(tq.w, tq.h);
            tq.camera.updateProjectionMatrix();
            tq.renderer.setSize(tq.w, tq.h);
        }
    })(tq || (tq = {}));

    class Obj {
        constructor() {
            this.order = 0;
            this.rate = 1;
            this.using = false;
            this.rtt = true;
            this.chunk = null;
            this.tile = [0, 0];
            Obj.num++;
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
        //export type Struct = Obj['struct']
    })(Obj || (Obj = {}));
    var Obj$1 = Obj;

    var pts;
    (function (pts) {
        function pt(a) {
            return { x: a[0], y: a[1] };
        }
        pts.pt = pt;
        pts.clone = (zx) => [...zx];
        function make(n, m) {
            return [n, m];
        }
        pts.make = make;
        function area_every(bb, callback) {
            let y = bb.min[1];
            for (; y <= bb.max[1]; y++) {
                let x = bb.max[0];
                for (; x >= bb.min[0]; x--) {
                    callback([x, y]);
                }
            }
        }
        pts.area_every = area_every;
        function project(a) {
            let copy = pts.clone(a);
            copy[0] = a[0] / 2 + a[1] / 2;
            copy[1] = a[1] / 4 - a[0] / 4;
            return copy;
        }
        pts.project = project;
        function unproject(a) {
            let copy = pts.clone(a);
            copy[0] = a[0] - a[1] * 2;
            copy[1] = a[1] * 2 + a[0];
            return copy;
        }
        pts.unproject = unproject;
        function to_string(a) {
            const pr = (b) => b != undefined ? `, ${b}` : '';
            return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
        }
        pts.to_string = to_string;
        function floor(a) {
            let copy = pts.clone(a);
            copy[0] = Math.floor(a[0]);
            copy[1] = Math.floor(a[1]);
            return copy;
        }
        pts.floor = floor;
        function ceil(a) {
            let copy = pts.clone(a);
            copy[0] = Math.ceil(a[0]);
            copy[1] = Math.ceil(a[1]);
            return copy;
        }
        pts.ceil = ceil;
        function inv(a) {
            let copy = pts.clone(a);
            copy[0] = -a[0];
            copy[1] = -a[1];
            return copy;
        }
        pts.inv = inv;
        function mult(a, n, n2) {
            let copy = pts.clone(a);
            copy[0] *= n;
            copy[1] *= n2 || n;
            return copy;
        }
        pts.mult = mult;
        function divide(a, n, n2) {
            let copy = pts.clone(a);
            copy[0] /= n;
            copy[1] /= n2 || n;
            return copy;
        }
        pts.divide = divide;
        function subtract(a, b) {
            let copy = pts.clone(a);
            copy[0] -= b[0];
            copy[1] -= b[1];
            return copy;
        }
        pts.subtract = subtract;
        function add(a, b) {
            let copy = pts.clone(a);
            copy[0] += b[0];
            copy[1] += b[1];
            return copy;
        }
        pts.add = add;
        function abs(a) {
            let copy = pts.clone(a);
            copy[0] = Math.abs(a[0]);
            copy[1] = Math.abs(a[1]);
            return copy;
        }
        pts.abs = abs;
        function together(zx) {
            //Abs(p);
            return zx[0] + zx[1];
        }
        pts.together = together;
    })(pts || (pts = {}));
    var pts$1 = pts;

    class Rekt {
        constructor() {
            this.tiled = true;
            this.tile = [0, 0];
            this.offset = [0, 0];
            this.wh = [1, 1];
            this.opacity = 1;
            this.center = [0, 0];
            this.position = [0, 0, 0];
            this.used = false;
            this.flick = false;
            this.plain = false;
            Rekt.num++;
        }
        unset() {
            Rekt.num--;
        }
        paint_alternate() {
            var _a;
            if (!Lumber$1.PAINT_OBJ_TICK_RATE)
                return;
            if (!this.used)
                return;
            this.flick = !this.flick;
            this.material.color.set(new THREE.Color(this.flick ? 'red' : 'blue'));
            if ((_a = this.obj) === null || _a === void 0 ? void 0 : _a.chunk)
                this.obj.chunk.changed = true;
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
            this.geometry = new THREE.PlaneBufferGeometry(this.wh[0], this.wh[1], 1, 1);
            let map;
            if (this.asset)
                map = tqlib.loadtexture(`assets/${this.asset}.png`);
            this.material = new THREE.MeshBasicMaterial({
                map: map,
                transparent: true,
                opacity: this.opacity,
                color: ((_b = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.chunk) === null || _b === void 0 ? void 0 : _b.childobjscolor) || this.color || 0xffffff
            });
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
            this.mesh.matrixAutoUpdate = false;
            this.mesh.scale.set(1, 1, 1);
            if (this.flip)
                this.mesh.scale.x = -this.mesh.scale.x;
            //UV.FlipPlane(this.geometry, 0, true);
            this.now_update_pos();
            this.getgroup().add(this.mesh);
        }
        getgroup() {
            var _a, _b;
            let c;
            if (c = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.chunk)
                if (((_b = this.obj) === null || _b === void 0 ? void 0 : _b.rtt) && Lumber$1.USE_CHUNK_RT)
                    return c.grouprt;
                else
                    return c.group;
            else
                return tq.scene;
        }
        dual() {
            let xy = pts$1.add(this.tile, this.offset);
            return xy;
        }
        now_update_pos() {
            var _a;
            const d = this.wh;
            let x, y;
            const depth = Rekt.depth(this.tile); // ignore offset! ?
            let xy = pts$1.add(this.tile, this.offset);
            if (this.tiled) {
                xy = Rekt.mult(xy);
            }
            if (this.plain) {
                x = xy[0];
                y = xy[1];
            }
            else {
                if (Lumber$1.OFFSET_CHUNK_OBJ_REKT) {
                    let c = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.chunk;
                    if (c) {
                        xy = pts$1.subtract(xy, c.rekt_offset);
                    }
                }
                x = xy[0] / 2 + xy[1] / 2;
                y = xy[1] / 4 - xy[0] / 4;
                this.center = [x, y];
                // middle bottom
                const w = d[0] / 2;
                const h = d[1] / 2;
                y += h;
            }
            this.position = [x, y, 0];
            if (this.mesh) {
                this.mesh.renderOrder = depth;
                this.mesh.position.fromArray(this.position);
                this.mesh.updateMatrix();
            }
        }
    }
    (function (Rekt) {
        Rekt.num = 0;
        Rekt.active = 0;
        //export type Struct = Rekt['struct']
        function depth(t) {
            return -t[1] + t[0];
        }
        Rekt.depth = depth;
        function mult(t) {
            return pts$1.mult(t, 24);
        }
        Rekt.mult = mult;
    })(Rekt || (Rekt = {}));
    var Rekt$1 = Rekt;

    class Man extends Obj$1 {
        constructor() {
            super();
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
        constructor() {
            super();
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
            let c = Lumber$1.map.get_chunk_at_tile(obj.tile);
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
            Lumber$1.ply = new Ply;
            Lumber$1.ply.tile = [0, 0];
            Lumber$1.ply.comes();
        }
    }
    (function (World) {
        function unproject(query) {
            let p = query;
            let un = pts$1.unproject(p);
            let p2;
            p2 = pts$1.divide(un, 24);
            p2 = pts$1.floor(p2);
            p2[0] += 1; // necessary
            let p3 = pts$1.mult(p2, 24);
            return { untiled: un, tiled: p2, mult: p3 };
        }
        World.unproject = unproject;
    })(World || (World = {}));

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
            constructor(growth) {
                super();
                this.growth = growth;
            }
        }
        Agriculture.Crop = Crop;
        class Wheat extends Crop {
            constructor(growth) {
                super(growth);
                this.flick = false;
                this.rate = 2.0;
            }
            finish() {
                let rekt = this.rekt = new Rekt$1;
                rekt.obj = this;
                rekt.asset =
                    this.growth == 1 ? Lumber$1.sample(tillering) :
                        this.growth == 2 ? Lumber$1.sample(ripening) :
                            this.growth == 3 ? 'egyt/farm/wheat_ilili' : '';
                rekt.tile = this.tile;
                rekt.wh = [22, 22];
            }
            update() {
                if (Lumber$1.PAINT_OBJ_TICK_RATE)
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
            let crop = new Wheat(growth);
            crop.tile = tile;
            crop.finish();
            Lumber$1.world.add(crop);
            return crop;
        }
        Agriculture.place_wheat = place_wheat;
        function area_wheat(growth, aabb) {
            const every = (pos) => place_wheat(growth, pos);
            pts$1.area_every(aabb, every);
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
            constructor(asset) {
                super();
                this.asset = 'egyt/ground/stone1';
                this.rtt = false;
            }
            finish() {
                let rekt = this.rekt = new Rekt$1;
                rekt.obj = this;
                rekt.asset = this.asset;
                rekt.tile = this.tile;
                rekt.wh = [24, 12];
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
                if (Lumber$1.PAINT_OBJ_TICK_RATE)
                    this.rekt.paint_alternate();
            }
            unset() {
                super.unset();
                this.rekt.unset();
            }
        }
        Tilization.Tile = Tile;
        function init() {
            console.log('tilization');
            window.Tilization = Tilization;
        }
        Tilization.init = init;
        function update() {
            if (App.map['escape'] == 1) ;
            if (App.map['u'] == 1) {
                let middle = World.unproject(Lumber$1.game.view.center()).tiled;
                let b = this.master.big(middle);
            }
        }
        Tilization.update = update;
        function place_tile(chance, asset, pos) {
            if (Math.random() > chance / 100)
                return;
            let tile = new Tile(asset);
            tile.tile = pos;
            tile.asset = asset;
            tile.finish();
            Lumber$1.world.add(tile);
            return tile;
        }
        Tilization.place_tile = place_tile;
        function click_area(asset, pos) {
        }
        Tilization.click_area = click_area;
        function area_sample(chance, assets, aabb) {
            const every = (pos) => place_tile(chance, Lumber$1.sample(assets), pos);
            pts$1.area_every(aabb, every);
        }
        Tilization.area_sample = area_sample;
        function area(chance, asset, aabb) {
            const every = (pos) => place_tile(chance, asset, pos);
            pts$1.area_every(aabb, every);
        }
        Tilization.area = area;
    })(Tilization || (Tilization = {}));
    var Tilization$1 = Tilization;

    const count = (c, prop) => {
        let num = 0;
        for (let t of c.objs.table.t)
            if (t[0][prop])
                num++;
        return num;
    };
    class Chunk {
        constructor(x, y, master) {
            this.master = master;
            this.on = false;
            this.changed = true;
            this.rektcolor = 'white';
            this.master.total++;
            this.objs = new Objs(this);
            //this.color = Egyt.sample(colors);
            this.p = [x, y];
            this.p2 = [x + 1, y];
            this.group = new THREE.Group;
            this.grouprt = new THREE.Group;
            this.set_bounds();
        }
        set_bounds() {
            const pt = pts$1.pt(this.p);
            let basest_tile = pts$1.mult(this.p2, this.master.span * 24);
            this.basest_tile = pts$1.clone(basest_tile);
            let north = pts$1.mult(this.p2, this.master.span * 24);
            this.north = north;
            this.order_tile = north;
            this.rekt_offset = pts$1.clone(basest_tile);
            if (Lumber$1.OFFSET_CHUNK_OBJ_REKT) {
                const zx = pts$1.project(basest_tile);
                const zxc = [...zx, 0];
                this.group.position.fromArray(zxc);
                this.grouprt.position.fromArray(zxc);
                const depth = Rekt$1.depth(this.order_tile);
                this.group.renderOrder = depth;
                this.grouprt.renderOrder = depth;
            }
            // note: non screen bound not used anymore
            this.bound = new aabb2([pt.x * this.master.span, pt.y * this.master.span], [(pt.x + 1) * this.master.span, (pt.y + 1) * this.master.span]);
            this.screen = Chunk.Sscreen(pt.x, pt.y, this.master);
        }
        empty() {
            return this.objs.table.t.length < 1;
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
            if (!Lumber$1.USE_CHUNK_RT)
                return;
            let rtt = count(this, 'rtt');
            const threshold = rtt >= 10;
            if (!threshold)
                return;
            if (!this.rt)
                this.rt = new RtChunk(this);
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
        noob() {
            return Lumber$1.game.view.test(this.screen) != aabb2.OOB;
        }
        oob() {
            return Lumber$1.game.view.test_oob(this.screen) == aabb2.OOB;
        }
        update() {
            var _a;
            this.objs.updates();
            if (Lumber$1.USE_CHUNK_RT && this.changed)
                (_a = this.rt) === null || _a === void 0 ? void 0 : _a.render();
            this.changed = false;
        }
    }
    (function (Chunk) {
        function Sscreen(x, y, master) {
            let basest_tile = pts$1.mult([x + 1, y], master.span * 24);
            let real = pts$1.subtract(pts$1.project(basest_tile), [0, -master.height / 2]);
            return new aabb2(pts$1.add(real, [-master.width / 2, -master.height / 2]), pts$1.add(real, [master.width / 2, master.height / 2]));
        }
        Chunk.Sscreen = Sscreen;
    })(Chunk || (Chunk = {}));
    class Tuple {
        constructor(key = 0) {
            this.key = key;
            this.t = [];
        }
        search(k = this.key, v) {
            let i = this.t.length;
            while (i--)
                if (this.t[i][k] == v)
                    return i;
        }
        add(t, k = this.key) {
            let i = this.search(k, t[k]);
            if (i == undefined) {
                this.t.push(t);
                return !!1;
            }
            return !!0;
        }
        remove(v, k = this.key) {
            let i = this.search(k, v);
            if (i != undefined) {
                this.t.splice(i, 1);
                return !!1;
            }
            return !!0;
        }
    }
    class Objs {
        constructor(chunk) {
            this.chunk = chunk;
            this.rtts = 0;
            this.table = new Tuple;
        }
        rate(obj) {
            return this.table.t.length * obj.rate;
        }
        add(obj) {
            return this.table.add([obj, this.rate(obj)]);
        }
        remove(obj) {
            return this.table.remove(obj);
        }
        updates() {
            for (let t of this.table.t) {
                let rate = t[1]--;
                if (rate <= 0) {
                    t[0].update();
                    t[1] = this.rate(t[0]);
                }
            }
        }
        comes() {
            for (let t of this.table.t)
                t[0].comes();
        }
        goes() {
            for (let t of this.table.t)
                t[0].goes();
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
        big(zx) {
            return pts$1.floor(pts$1.divide(zx, this.span));
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
            let middle = World.unproject(Lumber$1.game.view.center()).tiled;
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
                if (!c.on && c.oob()) {
                    if (s > 2) {
                        if (j == 0) {
                            j = 1;
                        }
                        if (j == 2) {
                            j = 3;
                        }
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
                if (!s) {
                    this.lines++;
                }
                this.total++;
                if (u > 5 || i >= 350) {
                    break;
                }
            }
        }
    }
    Tailorer.forward = 1;
    Tailorer.reverse = -1;
    class RtChunk {
        constructor(chunk) {
            this.chunk = chunk;
            this.padding = Lumber$1.EVEN * 4;
            this.offset = [0, 0];
            // todo, width height
            this.width = this.chunk.master.width + this.padding;
            this.height = this.chunk.master.height + this.padding;
            this.camera = tqlib.ortographiccamera(this.width, this.height);
            // todo, pts.make(blah)
            let t = pts$1.mult(this.chunk.p2, this.chunk.master.span);
            let rekt = this.rekt = new Rekt$1;
            rekt.tile = t;
            rekt.wh = [this.width, this.height];
            rekt.asset = 'egyt/tenbyten';
        }
        // todo pool the rts?
        comes() {
            this.rekt.use();
            this.rekt.mesh.renderOrder = Rekt$1.depth(this.chunk.order_tile);
            this.target = tqlib.rendertarget(this.width, this.height);
        }
        goes() {
            this.rekt.unuse();
            this.target.dispose();
        }
        render() {
            while (tq.rttscene.children.length > 0)
                tq.rttscene.remove(tq.rttscene.children[0]);
            const group = this.chunk.grouprt;
            group.position.set(0, -this.height / 2, 0);
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
            this.mouse_tiled = [0, 0];
            let rekt = this.mark = new Rekt$1;
            rekt.tile = [0, 0];
            rekt.wh = [22, 25];
            rekt.asset = 'egyt/iceblock';
            //this.mark.use();
            //this.mark.mesh.renderOrder = 999;
            //this.mark.dontOrder = true;
        }
        static state() {
            return new Map;
        }
        init() {
            let textures = 0;
            let loaded = 0;
            function callback() {
                if (++loaded >= textures)
                    Lumber$1.resourced('POPULAR_ASSETS');
            }
            function preload_textures(strs) {
                textures = strs.length;
                for (let str of strs)
                    tqlib.loadtexture(str, undefined, callback);
            }
            preload_textures([
                'assets/egyt/tileorange.png',
                'assets/egyt/farm/wheat_i.png',
                'assets/egyt/farm/wheat_il.png',
                'assets/egyt/farm/wheat_ili.png',
                'assets/egyt/farm/wheat_ilil.png',
                'assets/egyt/farm/wheat_ilili.png',
                'assets/egyt/tree/oaktree3.png',
                'assets/egyt/tree/oaktree4.png'
            ]);
        }
        populate() {
            let granary = new Rekt$1;
            granary.tile = [6, -1];
            granary.wh = [216, 168];
            granary.asset = 'egyt/building/granary';
            let tobaccoshop = new Rekt$1;
            tobaccoshop.tile = [-13, 2];
            tobaccoshop.wh = [144, 144];
            tobaccoshop.asset = 'egyt/building/redstore';
            granary.use();
            tobaccoshop.use();
            //Agriculture.area_wheat(1, new aabb3([-9, -4, 0], [3, -22, 0]));
            Agriculture$1.area_wheat(2, new aabb2([5, -4], [5 + 50 - 2, -12]));
            Agriculture$1.area_wheat(2, new aabb2([5 + 50, -4], [5 + 50 - 2 + 50, -12]));
            Agriculture$1.area_wheat(3, new aabb2([5, -14], [5 + 50 - 2, -22]));
            Agriculture$1.area_wheat(3, new aabb2([5 + 50, -14], [5 + 50 - 2 + 50, -22]));
            //Agriculture.plop_wheat_area(2, new aabb3([5, -14, 0], [5+12+12+12, -22, 0]));
            //Agriculture.plop_wheat_area(2, new aabb3([-9, -12, 0], [2, -14, 0]));
            //Agriculture.plop_wheat_area(3, new aabb3([-4, -4, 0], [20, -39, 0]));
            //Agriculture.plop_wheat_area(2, new aabb3([-25, 14, 0], [5, 50, 0]));
            //Agriculture.plop_wheat_area(3, new aabb3([-9, -52, 0], [2, -300, 0]));
            //Agriculture.plop_wheat_area(3, new aabb3([-20, -302, 0], [11, -600, 0]));
            const stones = [
                'egyt/ground/stone1',
                'egyt/ground/stone2',
            ];
            const gravels = [
                'egyt/ground/gravel1',
                'egyt/ground/gravel2',
            ];
            Tilization$1.area_sample(30, gravels, new aabb2([-1, 0], [2, -22]));
            // long road se
            Tilization$1.area_sample(50, stones, new aabb2([-13, 0], [400, -2]));
            // long road ne
            Tilization$1.area_sample(50, stones, new aabb2([-13, 0], [-11, 400]));
            // farms se
            Agriculture$1.area_wheat(1, new aabb2([-15, 21], [-40, 101]));
            Agriculture$1.area_wheat(1, new aabb2([-15, 103], [-40, 183]));
        }
        get_chunk_at_tile(zx) {
            return this.statmaster.which(zx);
        }
        mark_mouse() {
            let m = [...App.move];
            m[1] = -m[1];
            m = pts$1.divide(m, Lumber$1.game.scale);
            let p = [Lumber$1.game.view.min[0], Lumber$1.game.view.max[1]];
            p = pts$1.add(p, m);
            const un = World.unproject(p);
            this.mouse_tiled = un.tiled;
            this.mark.tile = un.mult;
            this.mark.now_update_pos();
        }
        update() {
            this.mark_mouse();
            this.statmaster.update();
            let worldPixelsLeftUpperCorner = [Lumber$1.game.view.min[0], Lumber$1.game.view.max[1]];
            let worldPixelsRightLowerCorner = [Lumber$1.game.view.max[0], Lumber$1.game.view.min[1]];
            const x = World.unproject(worldPixelsLeftUpperCorner).tiled;
            const y = World.unproject(worldPixelsRightLowerCorner).tiled;
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
                //Board.win.find('#memoryStat').text(`Memory: ${(tq.memory.usedJSHeapSize / 1048576).toFixed(4)} / ${tq.memory.jsHeapSizeLimit / 1048576}`);
                Board.win.find('#gameZoom').html(`Scale: <span>${Lumber$1.game.scale} / ndpi ${Lumber$1.game.dpi} / ${window.devicePixelRatio}`);
                Board.win.find('#gameAabb').html(`View bounding volume: <span>${Lumber$1.game.view.min[0]}, ${Lumber$1.game.view.min[1]} x ${Lumber$1.game.view.max[0]}, ${Lumber$1.game.view.max[1]}`);
                //Board.win.find('#gamePos').text(`View pos: ${points.string(Egyt.game.pos)}`);
                Board.win.find('#numChunks').text(`Num chunks: ${Lumber$1.map.statmaster.fitter.shown.length} / ${Lumber$1.map.statmaster.total}`);
                Board.win.find('#numObjs').html(`Num objs: ${Obj$1.active} / ${Obj$1.num}`);
                Board.win.find('#numRekts').html(`Num rekts: ${Rekt$1.active} / ${Rekt$1.num}`);
                let b = Lumber$1.map.statmaster.big(Lumber$1.map.mouse_tiled);
                let c = Lumber$1.map.statmaster.at(b[0], b[1]);
                Board.win.find('#square').text(`Mouse: ${pts$1.to_string(Lumber$1.map.mouse_tiled)}`);
                Board.win.find('#squareChunk').text(`Mouse chunk: ${pts$1.to_string(b)}`);
                Board.win.find('#squareChunkRt').text(`Mouse chunk rt: ${(c === null || c === void 0 ? void 0 : c.rt) ? 'true' : 'false'}`);
                Board.win.find('#snakeTurns').text(`CSnake turns: ${Lumber$1.map.statmaster.fitter.lines}`);
                Board.win.find('#snakeTotal').text(`CSnake total: ${Lumber$1.map.statmaster.fitter.total}`);
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
            this.pos = [0, 0];
            this.dpi = 1; //tq.ndpi;
            this.scale = 1; // / this.dpi;
            this.view = new aabb2([0, 0]);
            let rekt = this.frustum = new Rekt$1;
            rekt.name = 'Frustum';
            rekt.tile = [0, 0];
            rekt.wh = [1, 1];
            rekt.asset = 'egyt/128';
            this.frustum.plain = true; // dont 2:1
            this.frustum.use();
            this.frustum.mesh.renderOrder = 9999999;
            this.frustum.material.wireframe = true;
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
            if (App.map['w'])
                p[1] -= speed;
            if (App.map['s'])
                p[1] += speed;
            if (App.map['a'])
                p[0] += speed;
            if (App.map['d'])
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
            let p2 = pts$1.mult(this.pos, this.scale);
            tq.scene.position.set(p2[0], p2[1], 0);
            let w = window.innerWidth; // tq.target.width;
            let h = window.innerHeight; // tq.target.height;
            //console.log(`tq target ${w} x ${h}`)
            let w2 = w / this.dpi / this.scale;
            let h2 = h / this.dpi / this.scale;
            this.view = new aabb2([-p[0] - w2 / 2, -p[1] - h2 / 2], [-p[0] + w2 / 2, -p[1] + h2 / 2]);
            this.view.min = pts$1.floor(this.view.min);
            this.view.max = pts$1.floor(this.view.max);
            this.focal = [-p[0], -p[1], 0];
            //return;
            this.frustum.mesh.scale.set(w2, h2, 1);
            //this.frustumRekt.tile = <vec2><unknown>this.focal;
            this.frustum.now_update_pos();
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
            constructor() {
                super();
                //this.rtt = false
                this.rate = 10;
                trees.push(this);
            }
            post() {
                let rekt = this.rekt = new Rekt$1;
                rekt.obj = this;
                rekt.asset = Lumber$1.sample(treez);
                rekt.tile = this.tile;
                rekt.offset = [1, -1];
                rekt.wh = [120, 132];
            }
            update() {
                if (Lumber$1.PAINT_OBJ_TICK_RATE)
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
                let tree = new Tree;
                tree.tile = pos;
                tree.post();
                Lumber$1.world.add(tree);
            }
        }
        Forestation.populate = populate;
        function update() {
            if (!plopping && App.map['t'] == 1) {
                plopping = plop_tree();
            }
            if (plopping) {
                let tree = plopping;
                let p = pts$1.clone(Lumber$1.map.mouse_tiled);
                tree.tile = p;
                tree.rekt.tile = p;
                tree.rekt.now_update_pos();
                if (App.left) {
                    plopping = null;
                    tree.goes();
                    tree.unset();
                    let tree2 = new Tree;
                    tree2.tile = p;
                    tree2.post();
                    Lumber$1.world.add(tree2);
                }
            }
        }
        Forestation.update = update;
        function get_positions() {
            let a = [];
            for (let tree of trees) {
                a.push(tree.tile);
            }
            return JSON.stringify(a);
        }
        Forestation.get_positions = get_positions;
        function plop_tree() {
            let tree = new Tree;
            tree.tile = [0, 0];
            tree.post();
            tree.comes();
            // dont add to world yet
            //Egyt.world.add(plop);
            return tree;
        }
        Forestation.plop_tree = plop_tree;
    })(Forestation || (Forestation = {}));
    var Forestation$1 = Forestation;

    var Lumber;
    (function (Lumber) {
        Lumber.USE_CHUNK_RT = true;
        Lumber.OFFSET_CHUNK_OBJ_REKT = true;
        Lumber.PAINT_OBJ_TICK_RATE = false;
        Lumber.EVEN = 24; // very evenly divisible
        Lumber.YUM = Lumber.EVEN;
        var started = false;
        function sample(a) {
            return a[Math.floor(Math.random() * a.length)];
        }
        Lumber.sample = sample;
        function clamp(val, min, max) {
            return val > max ? max : val < min ? min : val;
        }
        Lumber.clamp = clamp;
        let RESOURCES;
        (function (RESOURCES) {
            RESOURCES[RESOURCES["RC_UNDEFINED"] = 0] = "RC_UNDEFINED";
            RESOURCES[RESOURCES["POPULAR_ASSETS"] = 1] = "POPULAR_ASSETS";
            RESOURCES[RESOURCES["READY"] = 2] = "READY";
            RESOURCES[RESOURCES["COUNT"] = 3] = "COUNT";
        })(RESOURCES = Lumber.RESOURCES || (Lumber.RESOURCES = {}));
        let resources_loaded = 0b0;
        function resourced(word) {
            resources_loaded |= 0b1 << RESOURCES[word];
            try_start();
        }
        Lumber.resourced = resourced;
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
        Lumber.critical = critical;
        function init() {
            console.log('egyt init');
            Lumber.game = Game.rig();
            Lumber.world = World.rig();
            Lumber.map = Map.state();
            Lumber.map.init();
            Forestation$1.init();
            Tilization$1.init();
            resourced('RC_UNDEFINED');
            resourced('READY');
            window.Egyt = Lumber;
        }
        Lumber.init = init;
        function start() {
            if (started)
                return;
            console.log('lumber starting');
            if (window.location.href.indexOf("#nochunkrt") != -1)
                Lumber.USE_CHUNK_RT = false;
            Lumber.map.populate();
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
				<key>U</key> tile area<br/>
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
				<span id="gameZoom"></span><br/>
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
				<span id="USE_CHUNK_RTT">USE_CHUNK_RTT: ${Lumber.USE_CHUNK_RT}</span><br/>
				<span id="OFFSET_CHUNK_OBJ_REKT">OFFSET_CHUNK_OBJ_REKT: ${Lumber.OFFSET_CHUNK_OBJ_REKT}</span><br/>
				<span id="PAINT_OBJ_TICK_RATE">PAINT_OBJ_TICK_RATE: ${Lumber.PAINT_OBJ_TICK_RATE}</span><br/>

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
        Lumber.start = start;
        function update() {
            if (!started)
                return;
            Lumber.game.update();
            Forestation$1.update();
            Tilization$1.update();
            Agriculture$1.update();
            Lumber.world.update();
            Lumber.map.update();
            Board.update();
        }
        Lumber.update = update;
    })(Lumber || (Lumber = {}));
    var Lumber$1 = Lumber;

    (function (App) {
        App.version = '0.06?';
        App.map = {};
        App.wheel = 0;
        App.move = [0, 0];
        App.left = false;
        function onkeys(event) {
            const key = event.key.toLowerCase();
            // console.log(event);
            if ('keydown' == event.type)
                App.map[key] = (undefined == App.map[key])
                    ? 1 /* PRESSED */
                    : 3 /* AGAIN */;
            else if ('keyup' == event.type)
                App.map[key] = 0 /* UP */;
            if (key == 114)
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
            Lumber$1.init();
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
            Lumber$1.update();
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
