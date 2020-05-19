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
            this.usesrtt = true;
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
    }
    (function (Obj) {
        Obj.active = 0;
        Obj.num = 0;
    })(Obj || (Obj = {}));
    var Obj$1 = Obj;

    var points;
    (function (points) {
        function area_every(aabb, callback) {
            let y = aabb.min[1];
            for (; y <= aabb.max[1]; y++) {
                let x = aabb.max[0];
                for (; x >= aabb.min[0]; x--) {
                    callback([x, y]);
                }
            }
        }
        points.area_every = area_every;
        function twoone(p) {
            let copy = [...p];
            copy[0] = p[0] / 2 + p[1] / 2;
            copy[1] = p[1] / 4 - p[0] / 4;
            return copy;
        }
        points.twoone = twoone;
        function untwoone(p) {
            let x = p[0] - p[1] * 2;
            let y = p[1] * 2 + p[0];
            return [x, y];
        }
        points.untwoone = untwoone;
        function string(a) {
            const pr = (b) => b != undefined ? `, ${b}` : '';
            return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
        }
        points.string = string;
        function floor(a) {
            a[0] = Math.floor(a[0]);
            a[1] = Math.floor(a[1]);
            if (a[2] != undefined)
                a[2] = Math.floor(a[2]);
            return a;
        }
        points.floor = floor;
        function ceil(a) {
            a[0] = Math.ceil(a[0]);
            a[1] = Math.ceil(a[1]);
            if (a[2] != undefined)
                a[2] = Math.ceil(a[2]);
            return a;
        }
        points.ceil = ceil;
        function inv(a) {
            a[0] = -a[0];
            a[1] = -a[1];
            return a;
        }
        points.inv = inv;
        function multp(zx, n, n2) {
            zx[0] *= n;
            zx[1] *= n2 || n;
            return zx;
        }
        points.multp = multp;
        function divide(a, n, n2) {
            a[0] /= n;
            a[1] /= n2 || n;
            return a;
        }
        points.divide = divide;
        function clone(zx) {
            return [...zx];
        }
        points.clone = clone;
        function multpClone(zx, n, n2) {
            let wen = [...zx];
            multp(wen, n, n2);
            return wen;
        }
        points.multpClone = multpClone;
        function subtract(a, b) {
            a[0] -= b[0];
            a[1] -= b[1];
            return a;
        }
        points.subtract = subtract;
        function add(a, b) {
            a[0] += b[0];
            a[1] += b[1];
            return a;
        }
        points.add = add;
        function abs(p) {
            p[0] = Math.abs(p[0]);
            p[1] = Math.abs(p[1]);
            return p;
        }
        points.abs = abs;
        function together(p) {
            //Abs(p);
            return p[0] + p[1];
        }
        points.together = together;
    })(points || (points = {}));
    var points$1 = points;

    class Rekt {
        constructor(struct) {
            this.inuse = false;
            this.flick = false;
            this.pforpixels = false;
            this.struct = struct;
            Rekt.num++;
            if (struct.istile)
                this.mult();
            this.actualpos = [0, 0, 0];
            this.center = [0, 0];
            if (this.struct.opacity == undefined)
                this.struct.opacity = 1;
        }
        mult() {
            this.struct.xy = points$1.multp([...this.struct.xy], 24);
        }
        paint_alternate() {
            var _a;
            if (!Egyt$1.PAINT_OBJ_TICK_RATE)
                return;
            if (!this.inuse)
                return;
            this.flick = !this.flick;
            this.material.color.set(new THREE.Color(this.flick ? 'red' : 'blue'));
            if ((_a = this.struct.obj) === null || _a === void 0 ? void 0 : _a.chunk)
                this.struct.obj.chunk.changed = true;
        }
        use() {
            var _a, _b, _c, _d;
            if (this.inuse)
                console.warn('rekt already inuse');
            Rekt.active++;
            this.inuse = true;
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
            let c;
            if (c = (_c = this.struct.obj) === null || _c === void 0 ? void 0 : _c.chunk)
                if (((_d = this.struct.obj) === null || _d === void 0 ? void 0 : _d.usesrtt) && Egyt$1.USE_CHUNK_RT)
                    c.rttgroup.add(this.mesh);
                else
                    c.group.add(this.mesh);
            else
                tq.scene.add(this.mesh);
        }
        unuse() {
            var _a, _b;
            if (!this.inuse)
                return;
            this.inuse = false;
            let c;
            if (c = (_a = this.struct.obj) === null || _a === void 0 ? void 0 : _a.chunk)
                if (((_b = this.struct.obj) === null || _b === void 0 ? void 0 : _b.usesrtt) && Egyt$1.USE_CHUNK_RT)
                    c.rttgroup.remove(this.mesh);
                else
                    c.group.add(this.mesh);
            else
                tq.scene.remove(this.mesh);
            Rekt.active--;
            this.geometry.dispose();
            this.material.dispose();
        }
        now_update_pos() {
            var _a;
            const d = this.struct.wh;
            let x, y;
            let p = [...this.struct.xy];
            if (this.pforpixels) { // todo phase out
                x = p[0];
                y = p[1];
            }
            else {
                if (Egyt$1.OFFSET_CHUNK_OBJ_REKT) {
                    let c = (_a = this.struct.obj) === null || _a === void 0 ? void 0 : _a.chunk;
                    if (c) {
                        points$1.subtract(p, c.rekt_offset);
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
                this.mesh.renderOrder = -p[1] + p[0];
                this.mesh.position.fromArray(this.actualpos);
                this.mesh.updateMatrix();
            }
        }
    }
    (function (Rekt) {
        Rekt.num = 0;
        Rekt.active = 0;
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
            c.objs.add(obj);
            if (c.on)
                obj.comes();
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
                this.rate = 0.5;
                this.rekt = new Rekt$1({
                    obj: this,
                    asset: this.growth == 1 ? Egyt$1.sample(tillering) :
                        this.growth == 2 ? Egyt$1.sample(ripening) :
                            this.growth == 3 ? 'egyt/farm/wheat_ilili' : '',
                    istile: true,
                    xy: this.struct.tile,
                    wh: [22, 22],
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
            points$1.area_every(aabb, every);
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
        intersect2(v) {
            if (this.min[0] <= v.min[0] && this.max[0] >= v.max[0] &&
                this.min[1] <= v.min[1] && this.max[1] >= v.max[1] //&&
            /*this.min[2] <= v.min[2] && this.max[2] >= v.max[2]*/ )
                return aabb2.SEC.IN;
            if (this.max[0] < v.min[0] || this.min[0] > v.max[0] ||
                this.max[1] < v.min[1] || this.min[1] > v.max[1] //||
            /*this.max[2] < v.min[2] || this.min[2] > v.max[2]*/ )
                return aabb2.SEC.OUT;
            return aabb2.SEC.CROSS;
        }
    }
    (function (aabb2) {
        let SEC;
        (function (SEC) {
            SEC[SEC["OUT"] = 0] = "OUT";
            SEC[SEC["IN"] = 1] = "IN";
            SEC[SEC["CROSS"] = 2] = "CROSS";
        })(SEC = aabb2.SEC || (aabb2.SEC = {}));
    })(aabb2 || (aabb2 = {}));

    var Tilization;
    (function (Tilization) {
        class Tile extends Obj$1 {
            constructor(asset, struct) {
                super(struct);
                this.rekt = new Rekt$1({
                    asset: asset,
                    istile: true,
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
            points$1.area_every(aabb, every);
        }
        Tilization.area_sample = area_sample;
        function area(chance, asset, aabb) {
            const every = (pos) => place_tile(chance, asset, pos);
            points$1.area_every(aabb, every);
        }
        Tilization.area = area;
    })(Tilization || (Tilization = {}));
    var Tilization$1 = Tilization;

    class chunk {
        constructor(x, y, master) {
            this.master = master;
            this.on = false;
            this.changed = true;
            this.rektcolor = 'white';
            this.master.total++;
            this.objs = new chunk_objs2(this);
            //this.color = Egyt.sample(colors);
            this.p = [x, y];
            this.group = new THREE.Group;
            this.rttgroup = new THREE.Group;
            this.set_bounds();
        }
        set_bounds() {
            let x = this.p[0];
            let y = this.p[1];
            let tile = points$1.multp([x + 1, y], this.master.span * 24);
            this.tile = [...tile];
            points$1.subtract(tile, [24, 0]);
            this.mult = tile;
            let middle = [...tile, 0];
            middle = points$1.twoone(middle);
            middle[2] = 0;
            this.rekt_offset = this.tile;
            if (Egyt$1.OFFSET_CHUNK_OBJ_REKT) {
                this.group.position.fromArray(middle);
                this.rttgroup.position.fromArray(middle);
                //this.group.renderOrder = this.rekt?.mesh?.renderOrder;
            }
            this.bound = new aabb2([x * this.master.span, y * this.master.span], [(x + 1) * this.master.span, (y + 1) * this.master.span]);
            let real = [...points$1.twoone([...tile]), 0];
            points$1.subtract(real, [0, -this.master.height / 2]);
            this.real = [...real];
            this.boundscreen = new aabb2(points$1.add([...real], [-this.master.width / 2, -this.master.height / 2]), points$1.add([...real], [this.master.width / 2, this.master.height / 2]));
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
            if (this.empty())
                return;
            if (this.on)
                return;
            this.objs.comes();
            tq.scene.add(this.group, this.group);
            this.comes_pt2();
            this.on = true;
        }
        comes_pt2() {
            if (!Egyt$1.USE_CHUNK_RT)
                return;
            const treshold = this.objs.rttobjs >= 10;
            if (!treshold)
                return;
            if (!this.rt)
                this.rt = new chunk_rt(this);
            this.rt.comes();
            this.rt.render();
        }
        goes() {
            var _a;
            if (!this.on)
                return;
            tq.scene.remove(this.group, this.rttgroup);
            tqlib.erase_children(this.group);
            tqlib.erase_children(this.rttgroup);
            this.objs.goes();
            (_a = this.rt) === null || _a === void 0 ? void 0 : _a.goes();
            this.on = false;
        }
        sec() {
            return Egyt$1.game.view.intersect2(this.boundscreen);
        }
        see() {
            return this.sec() != aabb2.SEC.OUT;
        }
        out() {
            return this.sec() == aabb2.SEC.OUT;
        }
        update() {
            var _a;
            this.objs.updates();
            if (Egyt$1.USE_CHUNK_RT && this.changed)
                (_a = this.rt) === null || _a === void 0 ? void 0 : _a.render();
            this.changed = false;
        }
    }
    class chunk_objs2 {
        constructor(chunk) {
            this.chunk = chunk;
            this.rttobjs = 0;
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
                let rate = this.rate(obj);
                this.tuples.push([obj, rate]);
                obj.chunk = this.chunk;
                if (obj.usesrtt)
                    this.rttobjs++;
            }
        }
        remove(obj) {
            let i = this.where(obj);
            if (i != undefined) {
                this.tuples.splice(i, 1);
                obj.chunk = null;
                if (obj.usesrtt)
                    this.rttobjs++;
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
    class statchunk extends chunk {
    }
    class dynchunk extends chunk {
    }
    class chunk_master {
        constructor(testType, span) {
            this.testType = testType;
            this.total = 0;
            this.arrays = [];
            this.span = span;
            this.span2 = span * span;
            this.width = span * 24;
            this.height = span * 12;
            this.fitter = new chunk_fitter(this);
        }
        update() {
            this.fitter.update();
        }
        big(t) {
            return points$1.floor(points$1.divide([...t], this.span));
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
    class chunk_fitter {
        constructor(master) {
            this.master = master;
            this.shown = [];
            this.colors = [];
        }
        update() {
            let middle = Egyt$1.map.query_world_pixel([...Egyt$1.game.view.center()]).tile;
            let b = this.master.big(middle);
            this.lines = 0;
            this.total = 0;
            this.snake(b, 1);
            this.snake(b, -1);
            let i = this.shown.length;
            while (i--) {
                let c = this.shown[i];
                c.update();
                if (c.out()) {
                    console.log('goes');
                    c.goes();
                    this.shown.splice(i, 1);
                }
            }
        }
        snake_re(b, n) {
            let x = b[0];
            let y = b[1];
        }
        snake(b, n) {
            let i, s, u;
            let x = b[0], y = b[1];
            let soo = 0;
            i = 0;
            s = 0;
            u = 0;
            while (true) {
                i++;
                let c;
                c = this.master.guarantee(x, y);
                if (c.out()) {
                    if (s > 2) {
                        if (soo == 0)
                            soo = 1;
                        if (soo == 2)
                            soo = 3;
                    }
                    u++;
                }
                else {
                    u = 0;
                    const on = c.on;
                    c.comes();
                    if (!on && c.on)
                        this.shown.push(c);
                }
                if (soo == 0) {
                    y += n;
                    s++;
                }
                else if (soo == 1) {
                    x -= n;
                    soo = 2;
                    s = 0;
                }
                else if (soo == 2) {
                    y -= n;
                    s++;
                }
                else if (soo == 3) {
                    x -= n;
                    soo = 0;
                    s = 0;
                }
                if (!s)
                    this.lines++;
                this.total++;
                if (u > 5 || i >= 350) {
                    //console.log('break at iteration', i);
                    break;
                }
            }
        }
    }
    class chunk_rt {
        constructor(chunk) {
            this.chunk = chunk;
            this.padding = Egyt$1.YUM * 2;
            this.offset = [0, 0];
            this.w = this.chunk.master.width + this.padding;
            this.h = this.chunk.master.height + this.padding;
            this.camera = tqlib.ortographiccamera(this.w, this.h);
            let p2 = [this.chunk.p[0] + 1, this.chunk.p[1]];
            points$1.multp(p2, this.chunk.master.span);
            points$1.subtract(p2, [1, 0]);
            this.rekt = new Rekt$1({
                istile: true,
                xy: p2,
                wh: [this.w, this.h],
                asset: 'egyt/tenbyten'
            });
        }
        // todo pool the rts?
        comes() {
            this.rekt.use();
            //this.rekt.mesh.renderOrder = -999;
            this.target = tqlib.rendertarget(this.w, this.h);
        }
        goes() {
            this.rekt.unuse();
            this.target.dispose();
        }
        render() {
            while (tq.rttscene.children.length > 0)
                tq.rttscene.remove(tq.rttscene.children[0]);
            const group = this.chunk.rttgroup;
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
            window.Chunk = chunk;
            this.statmaster = new chunk_master(statchunk, 20);
            this.dynmaster = new chunk_master(dynchunk, 20);
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
        }
        populate() {
            let granary = new Rekt$1({
                istile: true,
                xy: [6, -1],
                wh: [216, 168],
                asset: 'egyt/building/granary'
            });
            let tobaccoshop = new Rekt$1({
                istile: true,
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
        query_world_pixel(query) {
            let p = query;
            let p1 = points$1.clone(p);
            p1[0] = p[0] - p[1] * 2;
            p1[1] = p[1] * 2 + p[0];
            let p2 = [...p1];
            points$1.divide(p2, 24);
            points$1.floor(p2);
            p2[0] += 1; // necessary
            let p3 = [...p2];
            points$1.multp(p3, 24);
            return { tile: p2, mult: p3 };
        }
        mark_mouse() {
            let m = [...App.move];
            m[1] = -m[1];
            points$1.divide(m, Egyt$1.game.scale);
            let p = [Egyt$1.game.view.min[0], Egyt$1.game.view.max[1]];
            points$1.add(p, m);
            const mouse = this.query_world_pixel(p);
            this.mouse_tile = mouse.tile;
            this.mark.struct.xy = mouse.mult;
            this.mark.now_update_pos();
        }
        update() {
            this.mark_mouse();
            this.statmaster.update();
            let worldPixelsLeftUpperCorner = [Egyt$1.game.view.min[0], Egyt$1.game.view.max[1]];
            let worldPixelsRightLowerCorner = [Egyt$1.game.view.max[0], Egyt$1.game.view.min[1]];
            const x = this.query_world_pixel(worldPixelsLeftUpperCorner).tile;
            const y = this.query_world_pixel(worldPixelsRightLowerCorner).tile;
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
                Board.win.find('#square').text(`Mouse: ${points$1.string(Egyt$1.map.mouse_tile)}`);
                Board.win.find('#squareChunk').text(`Mouse chunk: ${points$1.string(b)}`);
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
            this.frustumRekt.pforpixels = true; // dont 2:1
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
            let p2 = points$1.multpClone(p, this.scale);
            tq.scene.position.set(p2[0], p2[1], 0);
            let w = tq.target.width;
            let h = tq.target.height;
            let w2 = w / this.dpi / this.scale;
            let h2 = h / this.dpi / this.scale;
            this.view = new aabb2([-p[0] - w2 / 2, -p[1] - h2 / 2], [-p[0] + w2 / 2, -p[1] + h2 / 2]);
            points$1.floor(this.view.min);
            points$1.floor(this.view.max);
            this.focal = [-p[0], -p[1], 0];
            //return;
            this.frustumRekt.mesh.scale.set(w2, h2, 1);
            this.frustumRekt.struct.xy = [...this.focal];
            this.frustumRekt.now_update_pos();
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
                this.usesrtt = false;
                this.rekt = new Rekt$1({
                    obj: this,
                    asset: Egyt$1.sample(treez),
                    istile: true,
                    xy: this.struct.tile,
                    wh: [120, 132],
                });
                trees.push(this);
            }
            comes() {
                this.rekt.use();
            }
            goes() {
                this.rekt.unuse();
            }
            update() {
            }
        }
        Forestation.Tree = Tree;
        function init() {
            console.log('forestation');
            for (let pos of positions) {
                let tree = new Tree({
                    tile: pos
                });
                Egyt$1.world.add(tree);
                //tree.comes();
                console.log('add tree from positions');
            }
            window.Forestation = Forestation;
        }
        Forestation.init = init;
        function update() {
            if (!plopping && App.map['t'] == 1) {
                plopping = plop_tree();
            }
            if (plopping) {
                let tree = plopping;
                let p = [...Egyt$1.map.mouse_tile];
                tree.struct.tile = p;
                tree.rekt.struct.xy = p;
                tree.rekt.mult();
                tree.rekt.now_update_pos();
                if (App.left)
                    plopping = null;
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
                tile: Egyt$1.map.mouse_tile
            });
            tree.comes();
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
        Egyt.PAINT_OBJ_TICK_RATE = true;
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
            //FONT_YELLOW,
            //FONT_MISSION,
            //SPRITES,
            RESOURCES[RESOURCES["COUNT"] = 7] = "COUNT";
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
