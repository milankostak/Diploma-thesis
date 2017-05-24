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

	it("constructor throws TypeError when parameter is not a number", () => {
		expect(() => new Vec1D("a")).toThrowError(TypeError);
	});

	it("add prototype works with Vec1D as parameter", () => {
		let v = new Vec1D(1);
		let w = v.add(new Vec1D(3));
		expect(w.x).toBe(4);
	});

	it("add prototype throws TypeError when parameter is not a Vec1D", () => {
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

	it("constructor throws TypeError when parameter is not a number", () => {
		expect(() => new Vec2D("a")).toThrowError(TypeError);
	});

	it("add prototype works with Vec2D as parameter", () => {
		let v = new Vec2D(1, 2);
		let w = v.add(new Vec2D(7, 4));
		expect(w.x).toBe(8);
		expect(w.y).toBe(6);
	});

	it("add prototype throws TypeError when parameter is not a Vec2D", () => {
		expect(() => new Vec2D("a")).toThrowError(TypeError);
		expect(() => new Vec2D(1, true)).toThrowError(TypeError);
		expect(() => new Vec2D(new Vec2D(), "a")).not.toThrowError(TypeError);
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

	it("mul prototype throws TypeError when parameter is not a number or Vec2D", () => {
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

	it("constructor throws TypeError when parameter is not a number", () => {
		expect(() => new Vec3D("a")).toThrowError(TypeError);
		expect(() => new Vec3D(1, 1, true)).toThrowError(TypeError);
		expect(() => new Vec3D(new Vec3D(), "a", 2)).not.toThrowError(TypeError);
	});

	it("add prototype works with Vec3D as parameter", () => {
		let v = new Vec3D(1, 2, 5);
		let w = v.add(new Vec3D(7, 4, -5));
		expect(w.x).toBe(8);
		expect(w.y).toBe(6);
		expect(w.z).toBe(0);
	});

	it("add prototype throws TypeError when parameter is not a Vec3D", () => {
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
	it("mul prototype throws TypeError when parameter is not a number or Vec3D or Mat3 or Quat", () => {
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

	it("cross prototype works with Vec3D as parameter", () => {
		let v = new Vec3D(5, -1, 2);
		let w = v.cross(new Vec3D(7, 2, 6));
		expect(w.x).toBe(-10);
		expect(w.y).toBe(-16);
		expect(w.z).toBe(17);
	});

	it("cross prototype throws TypeError when parameter is not a number", () => {
		expect(() => new Vec3D().cross("a")).toThrowError(TypeError);
		expect(() => new Vec3D().cross()).toThrowError(TypeError);
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


describe("Point3D", () => {

	it("constructor can make copy of another Point3D", () => {
		let v = new Point3D(new Point3D(5, 6, 7, 8));
		expect(v.x).toBe(5);
		expect(v.y).toBe(6);
		expect(v.z).toBe(7);
		expect(v.w).toBe(8);
	});

	it("constructor can make copy of another Vec3D", () => {
		let v = new Point3D(new Vec3D(5, 7, 8));
		expect(v.x).toBe(5);
		expect(v.y).toBe(7);
		expect(v.z).toBe(8);
		expect(v.w).toBe(1);
	});

	it("constructor w/o parameters sets 0", () => {
		let v = new Point3D();
		expect(v.x).toBe(0);
		expect(v.y).toBe(0);
		expect(v.z).toBe(0);
		expect(v.w).toBe(1);
	});

	it("constructor w/ parameters works", () => {
		let v = new Point3D(-2, -3, -9, 3);
		expect(v.x).toBe(-2);
		expect(v.y).toBe(-3);
		expect(v.z).toBe(-9);
		expect(v.w).toBe(3);
	});

	it("constructor throws TypeError when parameter is not a number", () => {
		expect(() => new Point3D("a")).toThrowError(TypeError);
		expect(() => new Point3D(1, 1, true)).toThrowError(TypeError);
		expect(() => new Point3D(new Point3D(), "a", 2)).not.toThrowError(TypeError);
	});

	it("add prototype works with Point3D as parameter", () => {
		let v = new Point3D(-4, 1, 2, 5);
		let w = v.add(new Point3D(1.3, 7, 4, -5));
		expect(w.x).toBe(-2.7);
		expect(w.y).toBe(8);
		expect(w.z).toBe(6);
		expect(w.w).toBe(0);
	});

	it("add prototype throws TypeError when parameter is not a Point3D", () => {
		expect(() => new Point3D().add("a")).toThrowError(TypeError);
		expect(() => new Point3D().add()).toThrowError(TypeError);
	});

	it("mul prototype works with number as parameter", () => {
		let v = new Point3D(2, -4, 1, 2.5);
		let w = v.mul(-2);
		expect(w.x).toBe(-4);
		expect(w.y).toBe(8);
		expect(w.z).toBe(-2);
		expect(w.w).toBe(-5);
	});

	it("mul prototype works with Mat4 as parameter", () => {
		let m = new Mat4(new Point3D(1, 2, 3, 4), new Point3D(-1, -9, 5, 2), new Point3D(3, 0, 1, -2), new Point3D(5, 1, -3, 1));
		let v = new Point3D(1, -4, 1.5, 2);
		let w = v.mul(m);
		expect(w.x).toBe(19.5);
		expect(w.y).toBe(40);
		expect(w.z).toBe(-21.5);
		expect(w.w).toBe(-5);
	});
/*
	it("mul prototype works with Quat as parameter", () => {
		// TODO
	});
*/
	it("mul prototype throws TypeError when parameter is not a number or Mat4 or Quat", () => {
		expect(() => new Point3D().mul("a")).toThrowError(TypeError);
		expect(() => new Point3D().mul()).toThrowError(TypeError);
	});

	it("sub prototype works with Point3D as parameter", () => {
		let v = new Point3D(5, -1, 2, 3);
		let w = v.sub(new Point3D(-2, 7, 2, 6));
		expect(w.x).toBe(7);
		expect(w.y).toBe(-8);
		expect(w.z).toBe(0);
		expect(w.w).toBe(-3);
	});

	it("sub prototype throws TypeError when parameter is not a Point3D", () => {
		expect(() => new Point3D().dot("a")).toThrowError(TypeError);
		expect(() => new Point3D().dot()).toThrowError(TypeError);
	});

	it("dehomog prototype returns correct Vec3D", () => {
		let v1 = new Point3D(3, 5, -1, 2).dehomog();
		expect(v1 instanceof Vec3D).toBe(true);
		expect(v1.x).toBe(1.5);
		expect(v1.y).toBe(2.5);
		expect(v1.z).toBe(-0.5);
		let v2 = new Point3D(3, 5, -1, 0).dehomog();
		expect(v2 instanceof Vec3D).toBe(true);
		expect(v2.x).toBe(0);
		expect(v2.y).toBe(0);
		expect(v2.z).toBe(0);
	});

	it("ignoreW prototype returns correct Vec3D", () => {
		let v = new Point3D(4, 0, 3, 1).ignoreW();
		expect(v instanceof Vec3D).toBe(true);
		expect(v.x).toBe(4);
		expect(v.y).toBe(0);
		expect(v.z).toBe(3);
	});

	it("c function returns itself", () => {
		expect(new Point3D().c() instanceof Point3D).toBe(true);
	});
});
