namespace Zxcvs {

	export function Multp(zx: Zx | Zxc, n: number, n2?: number) {
		zx[0] *= n;
		zx[1] *= n2 || n;
		return zx;
	}

	export function MultpClone(zx: Zx | Zxc, n: number, n2?: number): number[] {
		let wen = [...zx] as Zx;

		Multp(wen, n, n2);

		return wen;
	}

	export function Subtr(a: Zx | Zxc, b: Zx | Zxc) {
		a[0] -= b[0];
		a[1] -= b[1];
		return a;
    }

	export function SubtrClone(a: Zx | Zxc, b: Zx | Zxc): number[] {
		let wen = [...a] as Zx;

		Subtr(wen, b);

		return wen;
    }
    
    export function Addit(a: Zx | Zxc, b: Zx | Zxc) {
		a[0] += b[0];
		a[1] += b[1];
		return a;
	}

	export function Divide(a: Zx | Zxc, n: number) {
		a[0] /= n;
		a[1] /= n;
		return a;
	}

	export function DivideClone(a: Zx | Zxc, n: number) {
		let wen = [...a] as Zx;

		Divide(wen, n);

		return wen;
	}

	export function Abs(p: Zx) {
		p[0] = Math.abs(p[0]);
		p[1] = Math.abs(p[1]);
		return p;
	}

	export function Together(p: Zx) {
		//Abs(p);
		return p[0] + p[1];
	}

}

export default Zxcvs;