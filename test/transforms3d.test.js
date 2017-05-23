"use strict"

describe("ZeroArray", () => {

	it("works with parameter", () => {
		let x = new ZeroArray(2);
		expect(x.length).toBe(2);
		expect(x[0].length).toBe(2);
		expect(x[1].length).toBe(2);
	});

	it("returns 4-dimensional array when called w/o parameter", () => {
		let x = new ZeroArray();
		expect(x.length).toBe(4);
		expect(x[2].length).toBe(4);
		expect(x[3].length).toBe(4);
	});

	it("throws TypeError when parameter is not a number", () => {
		expect(() => new ZeroArray("a")).toThrowError(TypeError);
	});
});

describe("Vec1D", () => {

	it("constructor can make copy of another Vec1D", () => {
		let v = new Vec1D(new Vec1D(5));
		expect(v.x).toBe(5);
	});

	it("constructor w/o parameter sets 0", () => {
		let v = new Vec1D();
		expect(v.x).toBe(0);
	});

	it("constructor w/ parameter works", () => {
		let v = new Vec1D(1);
		expect(v.x).toBe(1);
	});

	/*it("constructor throws TypeError when parameter is not a number", () => {
		expect(() => new Vec1D("a")).toThrowError(TypeError);
	});*/

	it("add prototype works with Vec1D as parameter", () => {
		let v = new Vec1D(1);
		let w = v.add(new Vec1D(3));
		expect(w.x).toBe(4);
	});

	it("add prototype throws TypeError when parameter is not a number", () => {
		expect(() => new Vec1D().add("a")).toThrowError(TypeError);
		expect(() => new Vec1D().add()).toThrowError(TypeError);
	});

	it("mul prototype works with number as parameter", () => {
		let v = new Vec1D(2);
		let w = v.mul(3);
		expect(w.x).toBe(6);
	});

	it("mul prototype throws TypeError when parameter is not a number", () => {
		expect(() => new Vec1D().mul("a")).toThrowError(TypeError);
		expect(() => new Vec1D().mul()).toThrowError(TypeError);
	});

	it("c function returns itself", () => {
		expect(new Vec1D().c() instanceof Vec1D).toBe(true);
	});
});

describe("Vec2D", () => {

	it("constructor can make copy of another Vec2D", () => {
		let v = new Vec2D(new Vec2D(5, 6));
		expect(v.x).toBe(5);
		expect(v.y).toBe(6);
	});

	it("constructor w/o parameters sets 0", () => {
		let v = new Vec2D();
		expect(v.x).toBe(0);
		expect(v.y).toBe(0);
	});

	it("constructor w/ parameters works", () => {
		let v = new Vec2D(-2, -3);
		expect(v.x).toBe(-2);
		expect(v.y).toBe(-3);
	});

	/*it("constructor throws TypeError when parameter is not a number", () => {
		expect(() => new Vec2D("a")).toThrowError(TypeError);
	});*/

	it("add prototype works with Vec2D as parameter", () => {
		let v = new Vec2D(1, 2);
		let w = v.add(new Vec2D(7, 4));
		expect(w.x).toBe(8);
		expect(w.y).toBe(6);
	});

	it("add prototype throws TypeError when parameter is not a number", () => {
		expect(() => new Vec2D().add("a")).toThrowError(TypeError);
		expect(() => new Vec2D().add()).toThrowError(TypeError);
	});

	it("mul prototype works with Vec2D as parameter", () => {
		let v = new Vec2D(2, -4);
		let w = v.mul(new Vec2D(5, 7));
		expect(w.x).toBe(10);
		expect(w.y).toBe(-28);
	});

	it("mul prototype works with number as parameter", () => {
		let v = new Vec2D(2, -4);
		let w = v.mul(5);
		expect(w.x).toBe(10);
		expect(w.y).toBe(-20);
	});

	it("mul prototype throws TypeError when parameter is not a number", () => {
		expect(() => new Vec2D().mul("a")).toThrowError(TypeError);
		expect(() => new Vec2D().mul()).toThrowError(TypeError);
	});

	it("dot prototype works with Vec2D as parameter", () => {
		let v = new Vec2D(5, -1);
		let w = v.dot(new Vec2D(2, 6));
		expect(w).toBe(4);
	});

	it("dot prototype throws TypeError when parameter is not a number", () => {
		expect(() => new Vec2D().dot("a")).toThrowError(TypeError);
		expect(() => new Vec2D().dot()).toThrowError(TypeError);
	});

	it("length prototype works as expected", () => {
		let v = new Vec2D(4, 3);
		let l = v.length();
		expect(l).toBe(5);
	});

	it("normalized prototype works as expected", () => {
		let v = new Vec2D(4, 3);
		let w = v.normalized();
		expect(w.x).toBe(0.8);
		expect(w.y).toBe(0.6);

		let t = new Vec3D(0, 0, 0).normalized();
		expect(t.x).toBe(0);
		expect(t.y).toBe(0);
	});

	it("c function returns itself", () => {
		expect(new Vec2D().c() instanceof Vec2D).toBe(true);
	});
});

describe("Vec3D", () => {

	it("constructor can make copy of another Vec3D", () => {
		let v = new Vec3D(new Vec3D(5, 6, 7));
		expect(v.x).toBe(5);
		expect(v.y).toBe(6);
		expect(v.z).toBe(7);
	});

	it("constructor w/o parameters sets 0", () => {
		let v = new Vec3D();
		expect(v.x).toBe(0);
		expect(v.y).toBe(0);
		expect(v.z).toBe(0);
	});

	it("constructor w/ parameters works", () => {
		let v = new Vec3D(-2, -3, -9);
		expect(v.x).toBe(-2);
		expect(v.y).toBe(-3);
		expect(v.z).toBe(-9);
	});

	/*it("constructor throws TypeError when parameter is not a number", () => {
		expect(() => new Vec3D("a")).toThrowError(TypeError);
	});*/

	it("add prototype works with Vec3D as parameter", () => {
		let v = new Vec3D(1, 2, 5);
		let w = v.add(new Vec3D(7, 4, -5));
		expect(w.x).toBe(8);
		expect(w.y).toBe(6);
		expect(w.z).toBe(0);
	});

	it("add prototype throws TypeError when parameter is not a number", () => {
		expect(() => new Vec3D().add("a")).toThrowError(TypeError);
		expect(() => new Vec3D().add()).toThrowError(TypeError);
	});

	it("mul prototype works with Vec3D as parameter", () => {
		let v = new Vec3D(2, -4, 3.5);
		let w = v.mul(new Vec3D(5, 7, -1));
		expect(w.x).toBe(10);
		expect(w.y).toBe(-28);
		expect(w.z).toBe(-3.5);
	});

	it("mul prototype works with number as parameter", () => {
		let v = new Vec3D(2, -4, 1);
		let w = v.mul(-2);
		expect(w.x).toBe(-4);
		expect(w.y).toBe(8);
		expect(w.z).toBe(-2);
	});

	it("mul prototype works with Mat3 as parameter", () => {
		let m = new Mat3(new Vec3D(1, 2, 3), new Vec3D(-2, 0, 3), new Vec3D(1.5, 8, -1));
		let v = new Vec3D(3, -2, 3);
		let w = v.mul(m);
		expect(w.x).toBe(11.5);
		expect(w.y).toBe(30);
		expect(w.z).toBe(0);
	});
/*
	it("mul prototype works with Quat as parameter", () => {
		// TODO
	});
*/
	it("mul prototype throws TypeError when parameter is not a number", () => {
		expect(() => new Vec3D().mul("a")).toThrowError(TypeError);
		expect(() => new Vec3D().mul()).toThrowError(TypeError);
	});

	it("dot prototype works with Vec3D as parameter", () => {
		let v = new Vec3D(5, -1, 2);
		let d = v.dot(new Vec3D(7, 2, 6));
		expect(d).toBe(45);
	});

	it("dot prototype throws TypeError when parameter is not a number", () => {
		expect(() => new Vec3D().dot("a")).toThrowError(TypeError);
		expect(() => new Vec3D().dot()).toThrowError(TypeError);
	});

	it("length prototype works as expected", () => {
		let v = new Vec3D(4, 0, 3);
		let l = v.length();
		expect(l).toBe(5);
	});

	it("normalized prototype works as expected", () => {
		let v = new Vec3D(4, 0, 3);
		let w = v.normalized();
		expect(w.x).toBe(0.8);
		expect(w.y).toBe(0);
		expect(w.z).toBe(0.6);

		let t = new Vec3D(0, 0, 0).normalized();
		expect(t.x).toBe(0);
		expect(t.y).toBe(0);
		expect(t.z).toBe(0);
	});

	it("c function returns itself", () => {
		expect(new Vec3D().c() instanceof Vec3D).toBe(true);
	});
});

/**
 * Vektorový součin vektorů
 * @param  {Vec3D} v vektor (x, y, z)
 * @return {Vec3D}   nová instance Vec3D
 * @throws {TypeError} If v není Vec3D
 */
Vec3D.prototype.cross = function(v) {
	if (v instanceof Vec3D) {
		return new Vec3D(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
	} else {
		throw new TypeError("Vec3D, cross: Neplatný parametr: musí být Vec3D");
	}
};

/**
 * Normalizace vektoru
 * @return {Vec3D} nová instance Vec3D
 */
Vec3D.prototype.normalized = function() {
	var len = this.length();
	if (len === 0) return new Vec3D(0,0,0);
	return new Vec3D(this.x / len, this.y / len, this.z / len);
};