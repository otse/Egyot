var lumber = (function (THREE) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var THREE__default = /*#__PURE__*/_interopDefaultLegacy(THREE);

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
    var Renderer;
    (function (Renderer) {
        Renderer.delta = 0;
        //export var ambientLight: AmbientLight
        //export var directionalLight: DirectionalLight
        function update() {
            Renderer.delta = Renderer.clock.getDelta();
            //filmic.composer.render();
        }
        Renderer.update = update;
        var reset = 0;
        var frames = 0;
        // https://github.com/mrdoob/stats.js/blob/master/src/Stats.js#L71
        function calc() {
            const s = Date.now() / 1000;
            frames++;
            if (s - reset >= 1) {
                reset = s;
                Renderer.fps = frames;
                frames = 0;
            }
            Renderer.memory = window.performance.memory;
        }
        Renderer.calc = calc;
        function render() {
            calc();
            Renderer.renderer.setRenderTarget(Renderer.target);
            Renderer.renderer.clear();
            Renderer.renderer.render(Renderer.scene, Renderer.camera);
            Renderer.renderer.setRenderTarget(null); // Naar scherm
            Renderer.renderer.clear();
            Renderer.renderer.render(Renderer.scene2, Renderer.camera);
        }
        Renderer.render = render;
        function init() {
            console.log('ThreeQuarter Init');
            Renderer.clock = new THREE.Clock();
            Renderer.scene = new THREE.Scene();
            Renderer.scene.background = new THREE.Color('#292929');
            Renderer.scene2 = new THREE.Scene();
            Renderer.rttscene = new THREE.Scene();
            Renderer.ndpi = window.devicePixelRatio;
            console.log(`window innerWidth, innerHeight ${window.innerWidth} x ${window.innerHeight}`);
            if (Renderer.ndpi > 1) {
                console.warn('Dpi i> 1. Game may scale.');
            }
            Renderer.target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                minFilter: THREE__default['default'].NearestFilter,
                magFilter: THREE__default['default'].NearestFilter,
                format: THREE__default['default'].RGBFormat
            });
            Renderer.renderer = new THREE.WebGLRenderer({ antialias: false });
            Renderer.renderer.setPixelRatio(1);
            Renderer.renderer.setSize(window.innerWidth, window.innerHeight);
            Renderer.renderer.autoClear = true;
            Renderer.renderer.setClearColor(0xffffff, 0);
            document.body.appendChild(Renderer.renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);
            someMore();
            onWindowResize();
            window.Renderer = Renderer;
        }
        Renderer.init = init;
        function someMore() {
            /*materialBg = new ShaderMaterial({
                uniforms: { time: { value: 0.0 } },
                vertexShader: vertexScreen,
                fragmentShader: fragmentBackdrop
            });*/
            Renderer.materialPost = new THREE.ShaderMaterial({
                uniforms: { tDiffuse: { value: Renderer.target.texture } },
                vertexShader: vertexScreen,
                fragmentShader: fragmentPost,
                depthWrite: false
            });
            Renderer.plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
            /*let quad = new Mesh(plane, materialBg);
            quad.position.z = -100;
            scene.add(quad);*/
            Renderer.quadPost = new THREE.Mesh(Renderer.plane, Renderer.materialPost);
            Renderer.quadPost.position.z = -100;
            Renderer.scene2.add(Renderer.quadPost);
        }
        function onWindowResize() {
            Renderer.w = window.innerWidth;
            Renderer.h = window.innerHeight;
            if (Renderer.w % 2 != 0) {
                Renderer.w -= 1;
            }
            if (Renderer.h % 2 != 0) {
                Renderer.h -= 1;
            }
            let targetwidth = Renderer.w;
            let targetheight = Renderer.h;
            //if (ndpi == 2) {
            //	targetwidth *= ndpi;
            //	targetheight *= ndpi;
            //}
            Renderer.plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
            Renderer.quadPost.geometry = Renderer.plane;
            Renderer.target.setSize(targetwidth, targetheight);
            Renderer.camera = ortographiccamera(Renderer.w, Renderer.h);
            Renderer.camera.updateProjectionMatrix();
            Renderer.renderer.setSize(Renderer.w, Renderer.h);
        }
        let mem = [];
        function loadtexture(file, key, cb) {
            if (mem[key || file])
                return mem[key || file];
            let texture = new THREE.TextureLoader().load(file + `?v=${App$1.salt}`, cb);
            texture.magFilter = THREE__default['default'].NearestFilter;
            texture.minFilter = THREE__default['default'].NearestFilter;
            mem[key || file] = texture;
            return texture;
        }
        Renderer.loadtexture = loadtexture;
        function rendertarget(w, h) {
            const o = {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            };
            let target = new THREE.WebGLRenderTarget(w, h, o);
            return target;
        }
        Renderer.rendertarget = rendertarget;
        function ortographiccamera(w, h) {
            let camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -100, 100);
            camera.updateProjectionMatrix();
            return camera;
        }
        Renderer.ortographiccamera = ortographiccamera;
        function erase_children(group) {
            while (group.children.length > 0)
                group.remove(group.children[0]);
        }
        Renderer.erase_children = erase_children;
    })(Renderer || (Renderer = {}));
    var Renderer$1 = Renderer;

    class Obj {
        constructor() {
            this.order = 0;
            this.rate = 1;
            this.rtt = true;
            this.rekt = null;
            this.chunk = null;
            this.tile = [0, 0];
            Obj.num++;
        }
        update() {
            var _a;
            if (Lumber$1.PAINT_OBJ_TICK_RATE)
                (_a = this.rekt) === null || _a === void 0 ? void 0 : _a.paint_alternate();
        }
        comes() {
            var _a;
            Obj.active++;
            (_a = this.rekt) === null || _a === void 0 ? void 0 : _a.use();
        }
        goes() {
            var _a;
            Obj.active--;
            (_a = this.rekt) === null || _a === void 0 ? void 0 : _a.unuse();
        }
        unset() {
            var _a;
            Obj.num--;
            (_a = this.rekt) === null || _a === void 0 ? void 0 : _a.unset();
        }
        finish() { }
    }
    (function (Obj) {
        Obj.active = 0;
        Obj.num = 0;
        //export type Struct = Obj['struct']
    })(Obj || (Obj = {}));
    var Obj$1 = Obj;

    class pts {
        static pt(a) {
            return { x: a[0], y: a[1] };
        }
        static clone(zx) {
            return [zx[0], zx[1]];
        }
        static make(n, m) {
            return [n, m];
        }
        static area_every(bb, callback) {
            let y = bb.min[1];
            for (; y <= bb.max[1]; y++) {
                let x = bb.max[0];
                for (; x >= bb.min[0]; x--) {
                    callback([x, y]);
                }
            }
        }
        static project(a) {
            return [a[0] / 2 + a[1] / 2, a[1] / 4 - a[0] / 4];
        }
        static unproject(a) {
            return [a[0] - a[1] * 2, a[1] * 2 + a[0]];
        }
        static to_string(a) {
            const pr = (b) => b != undefined ? `, ${b}` : '';
            return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
        }
        static floor(a) {
            return [Math.floor(a[0]), Math.floor(a[1])];
        }
        static ceil(a) {
            return [Math.ceil(a[0]), Math.ceil(a[1])];
        }
        static inv(a) {
            return [-a[0], -a[1]];
        }
        static mult(a, n, m) {
            return [a[0] * n, a[1] * (m || n)];
        }
        static divide(a, n, m) {
            return [a[0] / n, a[1] / (m || n)];
        }
        static subtract(a, b) {
            return [a[0] - b[0], a[1] - b[1]];
        }
        static add(a, b) {
            return [a[0] + b[0], a[1] + b[1]];
        }
        static abs(a) {
            return [Math.abs(a[0]), Math.abs(a[1])];
        }
        static min(a, b) {
            return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
        }
        static max(a, b) {
            return [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
        }
        static together(zx) {
            return zx[0] + zx[1];
        }
    }

    class Rekt {
        constructor() {
            this.low = false;
            this.tiled = true;
            this.tile = [0, 0];
            this.offset = [0, 0];
            this.size = [1, 1];
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
            this.unuse();
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
            this.geometry = new THREE.PlaneBufferGeometry(this.size[0], this.size[1], 2, 2);
            let map;
            if (this.asset)
                map = Renderer$1.loadtexture(`assets/${this.asset}.png`);
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
                return Renderer$1.scene;
        }
        dual() {
            let xy = pts.add(this.tile, this.offset);
            return xy;
        }
        now_update_pos() {
            var _a;
            let x, y;
            let xy = pts.add(this.tile, this.offset);
            let depth = Rekt.depth(this.tile);
            if (this.low) {
                depth = Rekt.depth(pts.subtract(this.tile, this.size));
            }
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
                    if (c)
                        xy = pts.subtract(xy, c.rekt_offset);
                }
                x = xy[0] / 2 + xy[1] / 2;
                y = xy[1] / 4 - xy[0] / 4;
                this.center = [x, y];
                // middle bottom
                const w = this.size[0] / 2;
                const h = this.size[1] / 2;
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
            return pts.mult(t, Lumber$1.EVEN);
        }
        Rekt.mult = mult;
    })(Rekt || (Rekt = {}));
    var Rekt$1 = Rekt;

    var TEST;
    (function (TEST) {
        TEST[TEST["Outside"] = 0] = "Outside";
        TEST[TEST["Inside"] = 1] = "Inside";
        TEST[TEST["Overlap"] = 2] = "Overlap";
    })(TEST || (TEST = {}));
    class aabb2 {
        constructor(a, b) {
            this.min = this.max = a;
            if (b) {
                this.extend(b);
            }
        }
        static dupe(bb) {
            return new aabb2(bb.min, bb.max);
        }
        extend(v) {
            this.min = pts.min(this.min, v);
            this.max = pts.max(this.max, v);
        }
        diagonal() {
            return pts.subtract(this.max, this.min);
        }
        center() {
            return pts.add(this.min, pts.mult(this.diagonal(), 0.5));
        }
        translate(v) {
            this.min = pts.add(this.min, v);
            this.max = pts.add(this.max, v);
        }
        test(v) {
            if (this.min[0] <= v.min[0] && this.max[0] >= v.max[0] &&
                this.min[1] <= v.min[1] && this.max[1] >= v.max[1])
                return aabb2.TEST.Inside;
            if (this.max[0] < v.min[0] || this.min[0] > v.max[0] ||
                this.max[1] < v.min[1] || this.min[1] > v.max[1])
                return aabb2.TEST.Outside;
            return aabb2.TEST.Overlap;
        }
    }
    aabb2.TEST = TEST;

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
            //this.childobjscolor = Lumber.sample(colors);
            this.p = [x, y];
            this.p2 = [x + 1, y];
            this.group = new THREE.Group;
            this.grouprt = new THREE.Group;
            this.set_bounds();
        }
        anchor() {
        }
        set_bounds() {
            const pt = pts.pt(this.p);
            let p3 = pts.clone(this.p);
            this.basest_tile = pts.mult(this.p2, this.master.span * Lumber$1.EVEN);
            this.north = pts.mult(p3, this.master.span * Lumber$1.EVEN);
            this.order_tile = this.north;
            this.rekt_offset = pts.clone(this.basest_tile);
            if (Lumber$1.OFFSET_CHUNK_OBJ_REKT) {
                const zx = pts.project(this.basest_tile);
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
            Renderer$1.scene.add(this.group, this.grouprt);
            this.comes_pt2();
            this.on = true;
            return true;
        }
        comes_pt2() {
            if (!Lumber$1.USE_CHUNK_RT)
                return;
            if (Lumber$1.MINIMUM_REKTS_BEFORE_RT) {
                let rtt = count(this, 'rtt');
                if (rtt <= Lumber$1.MINIMUM_REKTS_BEFORE_RT)
                    return;
            }
            if (!this.rt)
                this.rt = new RtChunk(this);
            this.rt.comes();
            this.rt.render();
        }
        goes() {
            var _a;
            if (!this.on)
                return;
            Renderer$1.scene.remove(this.group, this.grouprt);
            Renderer$1.erase_children(this.group);
            Renderer$1.erase_children(this.grouprt);
            this.objs.goes();
            (_a = this.rt) === null || _a === void 0 ? void 0 : _a.goes();
            this.on = false;
        }
        oob() {
            return Lumber$1.world.view.test(this.screen) == aabb2.TEST.Outside;
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
            let basest_tile = pts.mult([x + 1, y], master.span * Lumber$1.EVEN);
            let real = pts.subtract(pts.project(basest_tile), [0, -master.height / 2]);
            return new aabb2(pts.add(real, [-master.width / 2, -master.height / 2]), pts.add(real, [master.width / 2, master.height / 2]));
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
            this.width = span * Lumber$1.EVEN;
            this.height = span * Lumber$1.EVEN / 2;
            this.fitter = new Tailorer(this);
        }
        update() {
            if (this.refit)
                this.fitter.update();
        }
        big(zx) {
            return pts.floor(pts.divide(zx, this.span));
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
            let middle = World$1.unproject(Lumber$1.world.view.center()).tiled;
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
            this.camera = Renderer$1.ortographiccamera(this.width, this.height);
            // todo, pts.make(blah)
            let t = pts.mult(this.chunk.p2, this.chunk.master.span);
            this.rekt = new Rekt$1;
            this.rekt.tile = t;
            this.rekt.size = [this.width, this.height];
            this.rekt.asset = 'egyt/tenbyten';
        }
        // todo pool the rts?
        comes() {
            this.rekt.use();
            this.rekt.mesh.renderOrder = Rekt$1.depth(this.chunk.order_tile);
            this.target = Renderer$1.rendertarget(this.width, this.height);
        }
        goes() {
            this.rekt.unuse();
            this.target.dispose();
        }
        render() {
            while (Renderer$1.rttscene.children.length > 0)
                Renderer$1.rttscene.remove(Renderer$1.rttscene.children[0]);
            const group = this.chunk.grouprt;
            group.position.set(0, -this.height / 2, 0);
            Renderer$1.rttscene.add(group);
            Renderer$1.renderer.setRenderTarget(this.target);
            Renderer$1.renderer.clear();
            Renderer$1.renderer.render(Renderer$1.rttscene, this.camera);
            this.rekt.material.map = this.target.texture;
        }
    }

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

    class Building extends Obj$1 {
        constructor(pst) {
            super();
            this.pst = pst;
            //this.rtt = false;
        }
        finish() {
            this.rekt = new Rekt$1;
            this.rekt.obj = this;
            this.rekt.tile = this.tile;
            this.rekt.asset = this.pst.asset;
            this.rekt.size = this.pst.size;
            this.rekt.offset = this.pst.offset || [0, 0];
        }
    }
    (function (Building) {
        Building.FourFour = {
            asset: 'fourfour',
            size: [48, 24]
        };
        Building.SixSix = {
            asset: 'sixsix',
            size: [72, 36]
        };
        Building.SandHovel1 = {
            asset: 'balmora/hovel1',
            size: [192, 149],
            offset: [0, 0]
        };
        Building.SandHovel2 = {
            asset: 'balmora/hovel2',
            size: [168, 143]
        };
        Building.SandAlleyGate = {
            asset: 'balmora/alleygate',
            size: [144, 96],
            offset: [0, 0]
        };
    })(Building || (Building = {}));
    var Building$1 = Building;

    var Ploppables;
    (function (Ploppables) {
        Ploppables.types = [
            'fourfour',
            'sixsix',
            'sandhovel1',
            'sandhovel2',
            'sandalleygate',
            'tree'
        ];
        Ploppables.index = 0;
        Ploppables.ghost = null;
        function update() {
            var _a;
            let remake = false;
            let obj = null;
            if (Ploppables.ghost) {
                if (App$1.wheel < 0 && Ploppables.index + 1 < Ploppables.types.length) {
                    Ploppables.index++;
                    remake = true;
                }
                else if (App$1.wheel > 0 && Ploppables.index - 1 >= 0) {
                    Ploppables.index--;
                    remake = true;
                }
            }
            const shortcuts = {
                'y': 'fourfour',
                'b': 'sandhovel1',
                't': 'tree'
            };
            for (const s in shortcuts) {
                if (App$1.keys[s]) {
                    Ploppables.index = Ploppables.types.indexOf(shortcuts[s]);
                    remake = true;
                    break;
                }
            }
            if (remake) {
                Lumber$1.world.wheelable = false;
                obj = factory(Ploppables.types[Ploppables.index]);
                obj.finish();
                obj.comes();
                Ploppables.ghost === null || Ploppables.ghost === void 0 ? void 0 : Ploppables.ghost.unset();
                Ploppables.ghost = obj;
            }
            if (Ploppables.ghost) {
                Ploppables.ghost.tile = Lumber$1.world.mouse_tiled;
                if (Ploppables.ghost.rekt)
                    Ploppables.ghost.rekt.tile = Ploppables.ghost.tile;
                (_a = Ploppables.ghost.rekt) === null || _a === void 0 ? void 0 : _a.now_update_pos();
                Ploppables.ghost.update();
            }
            if (Ploppables.ghost && App$1.buttons[0]) {
                Lumber$1.world.wheelable = true;
                console.log('plop');
                Ploppables.ghost.goes();
                Lumber$1.world.add(Ploppables.ghost);
                Ploppables.ghost = null;
            }
            if (Ploppables.ghost && App$1.keys['escape'] == 1) {
                Lumber$1.world.wheelable = true;
                console.log('unplop');
                Ploppables.ghost.unset();
                Ploppables.ghost = null;
            }
        }
        Ploppables.update = update;
        function factory(type) {
            if (type == 'fourfour')
                return new Building$1(Building$1.FourFour);
            else if (type == 'sixsix')
                return new Building$1(Building$1.SixSix);
            else if (type == 'sandhovel1')
                return new Building$1(Building$1.SandHovel1);
            else if (type == 'sandhovel2')
                return new Building$1(Building$1.SandHovel2);
            else if (type == 'sandalleygate')
                return new Building$1(Building$1.SandAlleyGate);
            else if (type == 'tree')
                return new Tree();
            else
                return new Obj$1;
        }
        Ploppables.factory = factory;
        function plant_trees() {
            //return;
            console.log(`add ${tree_positions.length} trees from save`);
            for (let pos of tree_positions) {
                let tree = new Tree;
                tree.tile = pos;
                tree.finish();
                Lumber$1.world.add(tree);
            }
        }
        Ploppables.plant_trees = plant_trees;
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
        Ploppables.place_tile = place_tile;
        function area_tile(chance, asset, aabb) {
            const every = (pos) => place_tile(chance, asset, pos);
            pts.area_every(aabb, every);
        }
        Ploppables.area_tile = area_tile;
        function area_tile_sampled(chance, assets, aabb) {
            const every = (pos) => place_tile(chance, Lumber$1.sample(assets), pos);
            pts.area_every(aabb, every);
        }
        Ploppables.area_tile_sampled = area_tile_sampled;
        function place_wheat(growth, tile) {
            if (Math.random() > 99 / 100)
                return;
            let crop = new Wheat(growth);
            crop.tile = tile;
            crop.finish();
            Lumber$1.world.add(crop);
            return crop;
        }
        Ploppables.place_wheat = place_wheat;
        function area_wheat(growth, aabb) {
            const every = (pos) => place_wheat(growth, pos);
            pts.area_every(aabb, every);
        }
        Ploppables.area_wheat = area_wheat;
        function place_old_wall(growth, tile) {
            if (Math.random() > 50 / 100)
                return;
            let crop = new Wheat(growth);
            crop.tile = tile;
            crop.finish();
            Lumber$1.world.add(crop);
            return crop;
        }
        Ploppables.place_old_wall = place_old_wall;
        function area_fort(something, aabb) {
            const every = (pos) => place_wheat(1, pos);
            pts.area_every(aabb, every);
        }
        Ploppables.area_fort = area_fort;
    })(Ploppables || (Ploppables = {}));
    let tree_positions = [[12, 5], [20, 7], [16, 4], [8, 11], [28, 7], [40, 8], [39, 13], [17, 32], [-21, 11], [-18, 16], [-19, -28], [-24, -29], [-27, -13], [-17, 9], [-18, -1], [-6, 34], [65, 11], [0, 87], [5, 125], [-1, 172], [-62, 36], [-72, 125], [-65, 216], [4, 182], [14, 162], [2, 177], [3, 198], [6, 155], [7, 291], [-38, 350], [-59, 162], [-43, 112], [-106, 52], [154, 20], [213, 21], [141, -53], [23, -60], [62, -65], [260, -62], [241, -49], [251, -45], [220, -36], [209, -57], [223, -65], [209, -45], [181, -67], [190, -83], [221, -88], [264, -87], [274, -95], [263, -106], [255, -106], [237, -110], [248, -124], [239, -65], [221, -49], [189, -94], [263, -55], [271, -44], [278, -61], [246, -51], [240, -55], [226, -43], [228, -39], [208, -49], [248, -65], [227, -70], [230, -17], [210, 12], [269, 33], [275, 156], [66, -210], [125, -49], [-106, 46], [-98, 44], [-97, 55], [-108, -67], [92, -26], [73, -29], [110, -11], [3, -26], [-19, -52], [70, -36], [-35, -82], [-23, -90], [-19, -118], [-169, 19], [20, 160], [36, 92], [-62, 91], [-112, 181], [-114, 177], [-106, 179], [-107, 174], [-102, 167], [-108, 159], [-101, 192], [30, -29], [25, -33], [31, -36], [36, -25], [41, -38], [6, -55], [25, -79], [23, -87], [125, -54], [176, -4], [-164, 12], [-157, 19], [-7, 254], [-26, 58]];
    const trees = [
        'egyt/tree/oaktree3',
        'egyt/tree/oaktree4',
    ];
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
    class Tree extends Obj$1 {
        constructor() {
            super();
            this.rate = 10;
            Tree.trees.push(this);
        }
        finish() {
            this.rekt = new Rekt$1;
            this.rekt.obj = this;
            this.rekt.asset = Lumber$1.sample(trees);
            this.rekt.tile = this.tile;
            this.rekt.offset = [1, -1];
            this.rekt.size = [120, 132];
        }
    }
    Tree.trees = [];
    class Tile extends Obj$1 {
        constructor(asset) {
            super();
            this.asset = 'egyt/ground/stone1';
            //this.rtt = false;
        }
        finish() {
            this.rekt = new Rekt$1;
            this.rekt.obj = this;
            this.rekt.asset = this.asset;
            this.rekt.tile = this.tile;
            this.rekt.size = [24, 12];
        }
    }
    class Wheat extends Obj$1 {
        constructor(growth) {
            super();
            this.growth = growth;
            this.flick = false;
            this.rate = 2.0;
        }
        finish() {
            this.rekt = new Rekt$1;
            this.rekt.obj = this;
            this.rekt.asset =
                this.growth == 1 ? Lumber$1.sample(tillering) :
                    this.growth == 2 ? Lumber$1.sample(ripening) :
                        this.growth == 3 ? 'egyt/farm/wheat_ilili' : '';
            this.rekt.tile = this.tile;
            this.rekt.size = [22, 22];
        }
    }

    class World {
        constructor() {
            this.pos = [0, 0];
            this.scale = 1;
            this.dpi = 1;
            this.mouse_tiled = [0, 0];
            this.wheelable = true;
            this.init();
            this.view = new aabb2([0, 0], [0, 0]);
            console.log('world');
        }
        static rig() {
            return new World;
        }
        add(obj) {
            let c = this.getChunkAt(obj.tile);
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
            this.move();
            this.mark_mouse();
            this.chunkMaster.update();
            this.bigChunks.update();
        }
        getChunkAt(zx) {
            return this.chunkMaster.which(zx);
        }
        mark_mouse() {
            let m = [App$1.pos.x, App$1.pos.y];
            m[1] = -m[1];
            m = pts.divide(m, Lumber$1.world.scale);
            let p = [Lumber$1.world.view.min[0], Lumber$1.world.view.max[1]];
            p = pts.add(p, m);
            const unprojected = World.unproject(p);
            this.mouse_tiled = unprojected.tiled;
        }
        init() {
            this.chunkMaster = new ChunkMaster(Chunk, 20);
            this.bigChunks = new ChunkMaster(Chunk, 40);
            Lumber$1.ply = new Ply;
            Lumber$1.ply.tile = [0, 0];
            Lumber$1.ply.comes();
            this.preloads();
            //this.populate();
        }
        preloads() {
            let textures = 0;
            let loaded = 0;
            function callback() {
                if (++loaded >= textures)
                    Lumber$1.resourced('POPULAR_ASSETS');
            }
            function preload_textures(strs) {
                textures = strs.length;
                for (let str of strs)
                    Renderer$1.loadtexture(str, undefined, callback);
            }
            preload_textures([
                'assets/egyt/tileorange.png',
                'assets/egyt/farm/wheat_i.png',
                'assets/egyt/farm/wheat_il.png',
                'assets/egyt/farm/wheat_ili.png',
                'assets/egyt/farm/wheat_ilil.png',
                'assets/egyt/farm/wheat_ilili.png',
                'assets/egyt/tree/oaktree3.png',
                'assets/egyt/tree/oaktree4.png',
                'assets/egyt/ground/stone1.png',
                'assets/egyt/ground/stone2.png',
                'assets/egyt/ground/gravel1.png',
                'assets/egyt/ground/gravel2.png',
            ]);
        }
        move() {
            let speed = 5;
            const factor = 1 / this.dpi;
            let p = [...this.pos];
            if (App$1.keys['x'])
                speed *= 10;
            if (App$1.keys['w'])
                p[1] -= speed;
            if (App$1.keys['s'])
                p[1] += speed;
            if (App$1.keys['a'])
                p[0] += speed;
            if (App$1.keys['d'])
                p[0] -= speed;
            this.pos = [...p];
            if (this.wheelable && App$1.wheel > 0) {
                if (this.scale < 1) {
                    this.scale = 1;
                }
                else {
                    this.scale += factor;
                }
                if (this.scale > 2 / this.dpi)
                    this.scale = 2 / this.dpi;
                //console.log('scale up', this.scale);
            }
            else if (this.wheelable && App$1.wheel < 0) {
                this.scale -= factor;
                if (this.scale < .5 / this.dpi)
                    this.scale = .5 / this.dpi;
                //console.log('scale down', this.scale);
            }
            Renderer$1.scene.scale.set(this.scale, this.scale, 1);
            let p2 = pts.mult(this.pos, this.scale);
            Renderer$1.scene.position.set(p2[0], p2[1], 0);
            let w = window.innerWidth; // tq.target.width;
            let h = window.innerHeight; // tq.target.height;
            //console.log(`tq target ${w} x ${h}`)
            let w2 = w / this.dpi / this.scale;
            let h2 = h / this.dpi / this.scale;
            this.view = new aabb2([-p[0] - w2 / 2, -p[1] - h2 / 2], [-p[0] + w2 / 2, -p[1] + h2 / 2]);
            this.view.min = pts.floor(this.view.min);
            this.view.max = pts.floor(this.view.max);
            this.focal = [-p[0], -p[1], 0];
        }
        populate() {
            //pts.area_every(new aabb2([-10, -10], [10, 10]), every);
            let building1 = new Rekt$1;
            building1.tile = [6, -1];
            building1.size = [181, 146];
            building1.asset = 'balmora/building1';
            building1.use();
            return;
        }
    }
    (function (World) {
        function unproject(query) {
            let p = query;
            let un = pts.unproject(p);
            let p2;
            p2 = pts.divide(un, 24);
            p2 = pts.floor(p2);
            p2[0] += 1; // necessary
            let p3 = pts.mult(p2, 24);
            return { untiled: un, tiled: p2, mult: p3 };
        }
        World.unproject = unproject;
    })(World || (World = {}));
    var World$1 = World;

    var Board;
    (function (Board) {
        var body;
        function collapse() {
        }
        Board.collapse = collapse;
        Board.collapsed = {};
        function rig_charges(nyan) {
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
                Board.win.find('#fpsStat').text(`Fps: ${parseInt(Renderer$1.fps)}`);
                //Board.win.find('#memoryStat').text(`Memory: ${(tq.memory.usedJSHeapSize / 1048576).toFixed(4)} / ${tq.memory.jsHeapSizeLimit / 1048576}`);
                Board.win.find('#gameZoom').html(`Scale: <span>${Lumber$1.world.scale} / ndpi ${Lumber$1.world.dpi} / ${window.devicePixelRatio}`);
                Board.win.find('#gameAabb').html(`View bounding volume: <span>${Lumber$1.world.view.min[0]}, ${Lumber$1.world.view.min[1]} x ${Lumber$1.world.view.max[0]}, ${Lumber$1.world.view.max[1]}`);
                //Board.win.find('#gamePos').text(`View pos: ${points.string(Egyt.game.pos)}`);
                Board.win.find('#numChunks').text(`Num chunks: ${Lumber$1.world.chunkMaster.fitter.shown.length} / ${Lumber$1.world.chunkMaster.total}`);
                Board.win.find('#numObjs').html(`Num objs: ${Obj$1.active} / ${Obj$1.num}`);
                Board.win.find('#numRekts').html(`Num rekts: ${Rekt$1.active} / ${Rekt$1.num}`);
                let b = Lumber$1.world.chunkMaster.big(Lumber$1.world.mouse_tiled);
                let c = Lumber$1.world.chunkMaster.at(b[0], b[1]);
                Board.win.find('#square').text(`Mouse: ${pts.to_string(Lumber$1.world.mouse_tiled)}`);
                Board.win.find('#squareChunk').text(`Mouse chunk: ${pts.to_string(b)}`);
                Board.win.find('#squareChunkRt').text(`Mouse chunk rt: ${(c === null || c === void 0 ? void 0 : c.rt) ? 'true' : 'false'}`);
                Board.win.find('#snakeTurns').text(`CSnake turns: ${Lumber$1.world.chunkMaster.fitter.lines}`);
                Board.win.find('#snakeTotal').text(`CSnake total: ${Lumber$1.world.chunkMaster.fitter.total}`);
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

    var Lumber;
    (function (Lumber) {
        Lumber.USE_CHUNK_RT = false;
        Lumber.OFFSET_CHUNK_OBJ_REKT = false;
        Lumber.PAINT_OBJ_TICK_RATE = false;
        Lumber.MINIMUM_REKTS_BEFORE_RT = 0;
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
            Lumber.world = World$1.rig();
            resourced('RC_UNDEFINED');
            resourced('READY');
            window['Lumber'] = Lumber;
        }
        Lumber.init = init;
        function start() {
            if (started)
                return;
            console.log('lumber starting');
            if (window.location.href.indexOf("#nochunkrt") != -1)
                Lumber.USE_CHUNK_RT = false;
            Lumber.world.populate();
            Ploppables.plant_trees();
            Board.init();
            Board.raw(`
		<!-- <div>May have to reload for latest version<br/> -->
		<br />
		<div class="region small">
			<a>Tutorial</a>
			<div>
				Move the view with <key>W</key> <key>A</key> <key>S</key> <key>D</key>.
				Hold <key>X</key> to go faster. Scrollwheel to zoom. 
			</div>

			<a>World editing</a>
			<div>
				Very simple. Once you got an object following the curor, you can use scrollwheel to change it.
				<br/><br/>
				<key>b</key> structure<br/>
				<key>t</key> tree<br/>
				<key>y</key> tile<br/>
				<key>u</key> tile area<br/>
				<key>x</key> delete<br/>
				<key>esc</key> cancel<br/>
			</div>

			<a>Settings</a>
			<div>
				Nothing here yet
			</div>

			<a collapse>Stats</a>
			<div class="stats">
				<span id="fpsStat">xx</span><br/>
				<!-- <span id="memoryStat">xx</span><br/> -->
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
				<span id="PAINT_OBJ_TICK_RATE">MINIMUM_REKTS_BEFORE_RT: ${Lumber.MINIMUM_REKTS_BEFORE_RT}</span><br/>
			</div>`);
            //setTimeout(() => Board.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);
            started = true;
        }
        function update() {
            if (!started)
                return;
            Lumber.world.update();
            Board.update();
            Ploppables.update();
        }
        Lumber.update = update;
    })(Lumber || (Lumber = {}));
    var Lumber$1 = Lumber;

    var App;
    (function (App) {
        let KEY;
        (function (KEY) {
            KEY[KEY["Off"] = 0] = "Off";
            KEY[KEY["Press"] = 1] = "Press";
            KEY[KEY["Wait"] = 2] = "Wait";
            KEY[KEY["Again"] = 3] = "Again";
            KEY[KEY["Up"] = 4] = "Up";
        })(KEY = App.KEY || (App.KEY = {}));
        App.keys = {};
        App.buttons = {};
        App.pos = { x: 0, y: 0 };
        App.salt = 'x';
        App.wheel = 0;
        function onkeys(event) {
            const key = event.key.toLowerCase();
            if ('keydown' == event.type)
                App.keys[key] = App.keys[key] ? KEY.Again : KEY.Press;
            else if ('keyup' == event.type)
                App.keys[key] = KEY.Up;
            if (event.keyCode == 114)
                event.preventDefault();
            return;
        }
        App.onkeys = onkeys;
        function boot(a) {
            App.salt = a;
            function onmousemove(e) { App.pos.x = e.clientX; App.pos.y = e.clientY; }
            function onmousedown(e) { App.buttons[e.button] = 1; }
            function onmouseup(e) { App.buttons[e.button] = 0; }
            function onwheel(e) { App.wheel = e.deltaY < 0 ? 1 : -1; }
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmousemove;
            document.onmousedown = onmousedown;
            document.onmouseup = onmouseup;
            document.onwheel = onwheel;
            Renderer$1.init();
            Lumber$1.init();
            loop();
        }
        App.boot = boot;
        function delay() {
            for (let i in App.keys) {
                if (KEY.Press == App.keys[i])
                    App.keys[i] = KEY.Wait;
                else if (KEY.Up == App.keys[i])
                    App.keys[i] = KEY.Off;
            }
        }
        App.delay = delay;
        function loop(timestamp) {
            requestAnimationFrame(loop);
            Renderer$1.update();
            Lumber$1.update();
            Renderer$1.render();
            App.wheel = 0;
            delay();
        }
        App.loop = loop;
    })(App || (App = {}));
    window['App'] = App;
    var App$1 = App;

    return App$1;

}(THREE));
