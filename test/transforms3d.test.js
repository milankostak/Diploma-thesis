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

	it("constructor can make a copy of another Vec1D", () => {
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

	it("constructor can make a copy of another Vec2D", () => {
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

	it("constructor can make a copy of another Vec3D", () => {
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

	it("constructor can make a copy of another Point3D", () => {
		let v = new Point3D(new Point3D(5, 6, 7, 8));
		expect(v.x).toBe(5);
		expect(v.y).toBe(6);
		expect(v.z).toBe(7);
		expect(v.w).toBe(8);
	});

	it("constructor can make a copy of another Vec3D", () => {
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


describe("Quat", () => {

	it("constructor can make a copy of another Quat", () => {
		let q = new Quat(new Quat(5, 6, 7, 8));
		expect(q.r).toBe(5);
		expect(q.i).toBe(6);
		expect(q.j).toBe(7);
		expect(q.k).toBe(8);
	});

	it("constructor w/o parameters sets 0", () => {
		let q = new Quat();
		expect(q.r).toBe(0);
		expect(q.i).toBe(0);
		expect(q.j).toBe(0);
		expect(q.k).toBe(0);
	});

	it("constructor w/ parameters works", () => {
		let q = new Quat(-2, -3, -9, 3);
		expect(q.r).toBe(-2);
		expect(q.i).toBe(-3);
		expect(q.j).toBe(-9);
		expect(q.k).toBe(3);
	});

	it("constructor throws TypeError when parameter is not a number or Quat", () => {
		expect(() => new Quat("a")).toThrowError(TypeError);
		expect(() => new Quat(1, 1, true)).toThrowError(TypeError);
		expect(() => new Quat(new Quat(), "a", 2)).not.toThrowError(TypeError);
	});

	it("add prototype works with Quat as parameter", () => {
		let v = new Quat(-4, 1, 2, 5);
		let q = v.add(new Quat(1.3, 7, 4, -5));
		expect(q.r).toBe(-2.7);
		expect(q.i).toBe(8);
		expect(q.j).toBe(6);
		expect(q.k).toBe(0);
	});

	it("add prototype throws TypeError when parameter is not a Quat", () => {
		expect(() => new Quat().add("a")).toThrowError(TypeError);
		expect(() => new Quat().add()).toThrowError(TypeError);
	});

	it("sub prototype works with Quat as parameter", () => {
		let v = new Quat(-4, 1, 2, 5);
		let q = v.sub(new Quat(1.3, 7, 4, -5));
		expect(q.r).toBe(-5.3);
		expect(q.i).toBe(-6);
		expect(q.j).toBe(-2);
		expect(q.k).toBe(10);
	});

	it("sub prototype throws TypeError when parameter is not a Quat", () => {
		expect(() => new Quat().sub("a")).toThrowError(TypeError);
		expect(() => new Quat().sub()).toThrowError(TypeError);
	});

	it("mulR prototype works with Quat as parameter", () => {
		let v = new Quat(1, 3, -2, 7);
		let q = v.mulR(new Quat(-2, 0, 6, 3));
		expect(q.r).toBe(-11);
		expect(q.i).toBe(-54);
		expect(q.j).toBe(1);
		expect(q.k).toBe(7);
	});

	it("mulR prototype throws TypeError when parameter is not a Quat", () => {
		expect(() => new Quat().mulR("a")).toThrowError(TypeError);
		expect(() => new Quat().mulR()).toThrowError(TypeError);
	});

	it("mulL prototype works with Quat as parameter", () => {
		let v = new Quat(1, 3, -2, 7);
		let q = v.mulL(new Quat(-2, 0, 6, 3));
		expect(q.r).toBe(-11);
		expect(q.i).toBe(42);
		expect(q.j).toBe(19);
		expect(q.k).toBe(-29);
	});

	it("mulL prototype throws TypeError when parameter is not a Quat", () => {
		expect(() => new Quat().mulL("a")).toThrowError(TypeError);
		expect(() => new Quat().mulL()).toThrowError(TypeError);
	});
	it("mul prototype works with Quat as parameter", () => {
		let v = new Quat(1, 3, -2, 7);
		let q = v.mul(new Quat(-2, 0, 6, 3));
		expect(q.r).toBe(-11);
		expect(q.i).toBe(-54);
		expect(q.j).toBe(1);
		expect(q.k).toBe(7);
	});

	it("mul prototype works with number as parameter", () => {
		let v = new Quat(1, 3, -2, 7);
		let q = v.mul(3);
		expect(q.r).toBe(3);
		expect(q.i).toBe(9);
		expect(q.j).toBe(-6);
		expect(q.k).toBe(21);
	});

	it("mul prototype throws TypeError when parameter is not a Quat", () => {
		expect(() => new Quat().mul("a")).toThrowError(TypeError);
		expect(() => new Quat().mul()).toThrowError(TypeError);
	});

	it("norma prototype works as expected", () => {
		let n = new Quat(1, 6, -4, 7).norma();
		expect(n).toBeCloseTo(10.099504938362077, 5);
	});

	it("inv prototype works as expected", () => {
		let q1 = new Quat(1, 6, -4, 7).inv();
		expect(q1.r).toBeCloseTo(0.009803921568627453, 5);
		expect(q1.i).toBeCloseTo(-0.05882352941176471, 5);
		expect(q1.j).toBeCloseTo(0.03921568627450981, 5);
		expect(q1.k).toBeCloseTo(-0.06862745098039216, 5);

		let q2 = new Quat().inv();
		expect(q2.r).toBe(0);
		expect(q2.i).toBe(0);
		expect(q2.j).toBe(0);
		expect(q2.k).toBe(0);
	});

	it("log prototype works as expected", () => {
		let q1 = new Quat(1, 3, -2, 7).log();
		expect(q1.r).toBeCloseTo(2.0715673631957663, 5);
		expect(q1.i).toBeCloseTo(0.5503445589964804, 5);
		expect(q1.j).toBeCloseTo(-0.3668963726643203, 5);
		expect(q1.k).toBeCloseTo(1.284137304325121, 5);

		let q2 = new Quat(-2, 0, 0, 0).log();
		expect(q2.r).toBeCloseTo(0.6931471805599453, 5);
		expect(q2.i).toBe(1);
		expect(q2.j).toBe(0);
		expect(q2.k).toBe(0);

		let q3 = new Quat(2, 0, 0, 0).log();
		expect(q3.r).toBeCloseTo(0.6931471805599453, 5);
		expect(q3.i).toBe(0);
		expect(q3.j).toBe(0);
		expect(q3.k).toBe(0);

		let q4 = new Quat().log();
		expect(q4.r).toBe(0);
		expect(q4.i).toBe(0);
		expect(q4.j).toBe(0);
		expect(q4.k).toBe(0);
	});

	it("exp prototype works as expected", () => {
		let q1 = new Quat(1, 3, -2, 7).exp();
		expect(q1.r).toBeCloseTo(-0.05443332579873212, 5);
		expect(q1.i).toBeCloseTo(1.0354587420929653, 5);
		expect(q1.j).toBeCloseTo(-0.6903058280619768, 5);
		expect(q1.k).toBeCloseTo(2.416070398216919, 5);

		let q2 = new Quat(-2, 0, 0, 0).exp();
		expect(q2.r).toBeCloseTo(0.1353352832366127, 5);
		expect(q2.i).toBe(0);
		expect(q2.j).toBe(0);
		expect(q2.k).toBe(0);
	});

	it("neg prototype works as expected", () => {
		let q1 = new Quat(1, 3, -2, 7).neg();
		expect(q1.r).toBe(-1);
		expect(q1.i).toBe(-3);
		expect(q1.j).toBe(2);
		expect(q1.k).toBe(-7);
	});

	it("dot prototype works as expected", () => {
		let q1 = new Quat(1, 3, -2, 7);
		let q2 = new Quat(2, -6, 1.5, 1);
		let dot = q1.dot(q2);
		expect(dot).toBe(-12);
	});

	it("dot prototype throws TypeError when parameter is not a Quat", () => {
		expect(() => new Quat().dot("a")).toThrowError(TypeError);
		expect(() => new Quat().dot()).toThrowError(TypeError);
	});

	it("renorm prototype works as expected", () => {
		let q1 = new Quat(1, 3, -2, 7).renorm();
		expect(q1.r).toBeCloseTo(0.1259881576697424, 5);
		expect(q1.i).toBeCloseTo(0.3779644730092272, 5);
		expect(q1.j).toBeCloseTo(-0.2519763153394848, 5);
		expect(q1.k).toBeCloseTo(0.8819171036881969, 5);
	});

	it("toRotationMatrix prototype works as expected", () => {
		let m = new Quat(1, 3, -2, 7).toRotationMatrix().mat;
		expect(m[0][0]).toBe(-105);
		expect(m[0][1]).toBe(2);
		expect(m[0][2]).toBe(46);
		expect(m[0][3]).toBe(0);
		expect(m[1][0]).toBe(-26);
		expect(m[1][1]).toBe(-115);
		expect(m[1][2]).toBe(-22);
		expect(m[1][3]).toBe(0);
		expect(m[2][0]).toBe(38);
		expect(m[2][1]).toBe(-34);
		expect(m[2][2]).toBe(-25);
		expect(m[2][3]).toBe(0);
		expect(m[3][0]).toBe(0);
		expect(m[3][1]).toBe(0);
		expect(m[3][2]).toBe(0);
		expect(m[3][3]).toBe(1);
	});

	it("toEulerAngle prototype works as expected", () => {
		let v = new Quat(0.4, 3, -2, 7).toEulerAngle();
		expect(v.x).toBeCloseTo(2.318558961454817, 5);
		expect(v.y).toBeCloseTo(0.3810003810005715, 5);
		expect(v.z).toBeCloseTo(-0.254000254000381, 5);
		expect(v.w).toBeCloseTo(0.8890008890013334, 5);
	});

	it("lerp prototype works as expected", () => {
		let q1 = new Quat(0.4, 3, -2, 7);
		let q2 = new Quat(4, -2, 3, 7);

		let q3 = q1.lerp(q2, 2);
		expect(q3.r).toBe(q2.r);
		expect(q3.i).toBe(q2.i);
		expect(q3.j).toBe(q2.j);
		expect(q3.k).toBe(q2.k);

		let q4 = q1.lerp(q2, 0);
		expect(q4.r).toBe(q1.r);
		expect(q4.i).toBe(q1.i);
		expect(q4.j).toBe(q1.j);
		expect(q4.k).toBe(q1.k);

		let q5 = q1.lerp(q2, 0.4);
		let q6 = q2.lerp(q1, 0.6);
		expect(q5.r).toBe(q6.r);
		expect(q5.i).toBe(q6.i);
		expect(q5.j).toBe(q6.j);
		expect(q5.k).toBe(q6.k);
	});

	it("lerp prototype throws TypeError when parameters are not Quat and number", () => {
		expect(() => new Quat().lerp("a", "a")).toThrowError(TypeError);
		expect(() => new Quat().lerp()).toThrowError(TypeError);
	});

	it("slerp prototype works as expected", () => {
		let q1 = new Quat(5, 3, -2, 7);

		let q2 = new Quat(1, 2, -5, -3);// dot 0
		let q3 = q1.slerp(q2, 0.5);
		expect(q3.r).toBeCloseTo(0.49227672520391125, 5);
		expect(q3.i).toBeCloseTo(0.45388481990259016, 5);
		expect(q3.j).toBeCloseTo(-0.7177581257880786, 5);
		expect(q3.k).toBeCloseTo(0.19098552026185375, 5);

		let q4 = new Quat(1, 2, -3, -1);// dot 10
		let q5 = q1.slerp(q4, 0);
		expect(q5.r).toBe(5);
		expect(q5.i).toBe(3);
		expect(q5.j).toBe(-2);
		expect(q5.k).toBe(7);

		let q6 = new Quat(1, 2, -3, -3);// dot -4
		let q7 = q1.slerp(q6, 0.4);
		expect(q7.r).toBeCloseTo(0.5517368198016962, 5);
		expect(q7.i).toBeCloseTo(0.547358844043825, 5);
		expect(q7.j).toBeCloseTo(-0.6224258390801777, 5);
		expect(q7.k).toBeCloseTo(0.09257889806783776, 5);

		let q8 = new Quat(1, 2, -5, -3.1);// dot -0.7
		let q9 = q1.slerp(q8, 2);
		expect(q9.r).toBe(q1.r);
		expect(q9.i).toBe(q1.i);
		expect(q9.j).toBe(q1.j);
		expect(q9.k).toBe(q1.k);

		let q10 = q1.slerp(q8, -1);
		expect(q10.r).toBe(q8.r);
		expect(q10.i).toBe(q8.i);
		expect(q10.j).toBe(q8.j);
		expect(q10.k).toBe(q8.k);
	});

	it("slerp prototype throws TypeError when parameters are not Quat and number", () => {
		expect(() => new Quat().slerp("a", "a")).toThrowError(TypeError);
		expect(() => new Quat().slerp()).toThrowError(TypeError);
	});

	it("squad prototype works as expected", () => {
		let a = new Quat(5, 3, -2, 7);
		let b = new Quat(1, 2, -5, -3.1);
		let c = new Quat(-2, 0, 6, 3);
		let d = new Quat(-1, 0, 1, 2);
		let e = a.squad(b, c, d, 0.6);

		expect(e.r).toBeCloseTo(0.24857015719081804, 5);
		expect(e.i).toBeCloseTo(0.6269395906460726, 5);
		expect(e.j).toBeCloseTo(0.14129984737341578, 5);
		expect(e.k).toBeCloseTo(0.7247026837034042, 5);
	});

	it("squad prototype throws TypeError when parameters are not Quat-s and number", () => {
		expect(() => new Quat().squad("a", "a", "a", "a")).toThrowError(TypeError);
		expect(() => new Quat().squad()).toThrowError(TypeError);
	});

	it("quadrangle prototype works as expected", () => {
		let a = new Quat(5, 3, -2, 7);
		let b = new Quat(1, 2, -5, -3.1);
		let c = new Quat(-2, 0, 6, 3);
		let e = a.quadrangle(b, c);

		expect(e.r).toBeCloseTo(1.1738922180666038, 5);
		expect(e.i).toBeCloseTo(-0.11515063497536307, 5);
		expect(e.j).toBeCloseTo(0.11758452348157551, 5);
		expect(e.k).toBeCloseTo(0.012650862133917222, 5);
	});

	it("quadrangle prototype throws TypeError when parameters are not Quat-s and number", () => {
		expect(() => new Quat().quadrangle("a", "a")).toThrowError(TypeError);
		expect(() => new Quat().quadrangle()).toThrowError(TypeError);
	});

	it("squad2 prototype works as expected", () => {
		let a = new Quat(5, 3, -2, 7);
		let b = new Quat(1, 2, -5, -3.1);
		let c = new Quat(-2, 0, 6, 3);
		let d = new Quat(-1, 0, 1, 2);
		let e = a.squad2(b, c, d, 0.6);

		expect(e.r).toBeCloseTo(0.73357337319017, 5);
		expect(e.i).toBeCloseTo(0.09203478946363089, 5);
		expect(e.j).toBeCloseTo(0.3660624883267518, 5);
		expect(e.k).toBeCloseTo(0.5651530397288929, 5);
	});

	it("squad2 prototype throws TypeError when parameters are not Quat-s and number", () => {
		expect(() => new Quat().squad2("a", "a", "a", "a")).toThrowError(TypeError);
		expect(() => new Quat().squad2()).toThrowError(TypeError);
	});

	it("c function returns itself", () => {
		expect(new Quat().c() instanceof Quat).toBe(true);
	});
});


describe("Quat2", () => {

	it("fromRotationMatrix works as expected", () => {
		let m = new Mat4(new Point3D(1, 2, 3, 4), new Point3D(-1, -9, 5, 2), new Point3D(3, 0, 1, -2), new Point3D(5, 1, -3, 1));
		let q = Quat2.fromRotationMatrix(m);

		expect(q.r).toBeCloseTo(1.5811388300841898, 5);
		expect(q.i).toBeCloseTo(0.15811388300841897, 5);
		expect(q.j).toBeCloseTo(0.9486832980505138, 5);
		expect(q.k).toBeCloseTo(0.7905694150420948, 5);
	});

	it("fromRotationMatrix throws TypeError when parameter is not Mat4", () => {
		expect(() => Quat2.fromRotationMatrix("a")).toThrowError(TypeError);
		expect(() => Quat2.fromRotationMatrix()).toThrowError(TypeError);
	});

	it("fromEulerAngle works as expected", () => {
		let q = Quat2.fromEulerAngle(45, 0.5, 1, 0);

		expect(q.r).toBeCloseTo(-0.8733046400935156, 5);
		expect(q.i).toBeCloseTo(-0.24358725623025476, 5);
		expect(q.j).toBeCloseTo(-0.4871745124605095, 5);
		expect(q.k).toBeCloseTo(-0, 5);
	});

	it("fromEulerAngle throws TypeError when parameters are not numbers", () => {
		expect(() => Quat2.fromEulerAngle("a", "a", "a", "a")).toThrowError(TypeError);
		expect(() => Quat2.fromEulerAngle()).toThrowError(TypeError);
	});

	it("fromEulerAngles works as expected", () => {
		let q = Quat2.fromEulerAngles(45, 60, 125);

		expect(q.r).toBeCloseTo(-0.28417852247107306, 5);
		expect(q.i).toBeCloseTo(0.21006619016961586, 5);
		expect(q.j).toBeCloseTo(0.8402582556996262, 5);
		expect(q.k).toBeCloseTo(-0.4111943905775006, 5);
	});

	it("fromEulerAngles throws TypeError when parameters are not numbers", () => {
		expect(() => Quat2.fromEulerAngles("a", "a", "a")).toThrowError(TypeError);
		expect(() => Quat2.fromEulerAngles()).toThrowError(TypeError);
	});

});


describe("Mat3", () => {

});


describe("Mat4", () => {

});


describe("Camera", () => {

});


describe("Col", () => {
		it("constructor can make a copy of another Col", () => {
		let v = new Col(new Col(0.1, 0.2, 0.3, 1));
		expect(v.r).toBe(0.1);
		expect(v.g).toBe(0.2);
		expect(v.b).toBe(0.3);
		expect(v.a).toBe(1);
	});

	it("constructor can make a copy of a Point3D", () => {
		let v = new Col(new Point3D(5, 7, 8, 9));
		expect(v.r).toBe(5);
		expect(v.g).toBe(7);
		expect(v.b).toBe(8);
		expect(v.a).toBe(9);
	});

	it("constructor with integer parameters works", () => {
		let v1 = new Col(50, 100, 150, 200);
		expect(v1.r).toBe(50/255);
		expect(v1.g).toBe(100/255);
		expect(v1.b).toBe(150/255);
		expect(v1.a).toBe(200/255);

		let v2 = new Col(50, 100, 150);
		expect(v2.r).toBe(50/255);
		expect(v2.g).toBe(100/255);
		expect(v2.b).toBe(150/255);
		expect(v2.a).toBe(1);
	});

	it("constructor with float parameters works", () => {
		let v1 = new Col(0.1, 0.2, 0.3, 0.4);
		expect(v1.r).toBe(0.1);
		expect(v1.g).toBe(0.2);
		expect(v1.b).toBe(0.3);
		expect(v1.a).toBe(0.4);

		let v2 = new Col(0.1, 0.2, 0.3);
		expect(v2.r).toBe(0.1);
		expect(v2.g).toBe(0.2);
		expect(v2.b).toBe(0.3);
		expect(v2.a).toBe(1);
	});

	it("constructor throws TypeError when parameters are wrong", () => {
		expect(() => new Col("a")).toThrowError(TypeError);
		expect(() => new Col(20, 20)).toThrowError(TypeError);
		expect(() => new Col()).toThrowError(TypeError);
	});

	it("addna prototype works as expected", () => {
		let v1 = new Col(0.1, 0.2, 0.3, 100);
		let v2 = new Col(0.2, 0.4, 0.6, 100);
		let v3 = v1.addna(v2);
		expect(v3.r).toBeCloseTo(0.3, 5);
		expect(v3.g).toBeCloseTo(0.6, 5);
		expect(v3.b).toBeCloseTo(0.9, 5);
		expect(v3.a).toBeCloseTo(1, 5);
	});

	it("addna prototype throws TypeError when parameter is not Col", () => {
		expect(() => new Col(1, 2, 3, 4).addna()).toThrowError(TypeError);
		expect(() => new Col(1, 2, 3, 4).addna(1)).toThrowError(TypeError);
	});

	it("mulna prototype works as expected", () => {
		let v1 = new Col(0.1, 0.2, 0.3, 100);
		let v3 = v1.mulna(2);
		expect(v3.r).toBeCloseTo(0.2, 5);
		expect(v3.g).toBeCloseTo(0.4, 5);
		expect(v3.b).toBeCloseTo(0.6, 5);
		expect(v3.a).toBeCloseTo(1, 5);
	});

	it("mulna prototype throws TypeError when parameter is not number", () => {
		expect(() => new Col(1, 2, 3, 4).mulna()).toThrowError(TypeError);
		expect(() => new Col(1, 2, 3, 4).mulna("a")).toThrowError(TypeError);
	});

	it("add prototype works as expected", () => {
		let v1 = new Col(0.1, 0.2, 0.3, 100);
		let v2 = new Col(0.2, 0.4, 0.6, 100);
		let v3 = v1.add(v2);
		expect(v3.r).toBeCloseTo(0.3, 5);
		expect(v3.g).toBeCloseTo(0.6, 5);
		expect(v3.b).toBeCloseTo(0.9, 5);
		expect(v3.a).toBeCloseTo(200, 5);
	});

	it("add prototype throws TypeError when parameter is not Col", () => {
		expect(() => new Col(1, 2, 3, 4).add()).toThrowError(TypeError);
		expect(() => new Col(1, 2, 3, 4).add(1)).toThrowError(TypeError);
	});

	it("mul prototype works as expected", () => {
		let v1 = new Col(0.1, 0.2, 0.3, 100);
		let v2 = new Col(0.2, 0.4, 0.6, 100);
		let v3 = v1.mul(v2);
		expect(v3.r).toBeCloseTo(0.02, 5);
		expect(v3.g).toBeCloseTo(0.08, 5);
		expect(v3.b).toBeCloseTo(0.18, 5);
		expect(v3.a).toBeCloseTo(10000, 5);

		let v4 = v2.mul(2.5);
		expect(v4.r).toBeCloseTo(0.5, 5);
		expect(v4.g).toBeCloseTo(1.0, 5);
		expect(v4.b).toBeCloseTo(1.5, 5);
		expect(v4.a).toBeCloseTo(250, 5);
	});

	it("mul prototype throws TypeError when parameter is not Col or number", () => {
		expect(() => new Col(1, 2, 3, 4).mul()).toThrowError(TypeError);
		expect(() => new Col(1, 2, 3, 4).mul("a")).toThrowError(TypeError);
	});

	it("gamma prototype works as expected", () => {
		let v1 = new Col(0.1, 0.2, 0.3, 100);
		let v2 = v1.gamma(3);
		expect(v2.r).toBeCloseTo(0.001, 5);
		expect(v2.g).toBeCloseTo(0.008, 5);
		expect(v2.b).toBeCloseTo(0.027, 5);
		expect(v2.a).toBeCloseTo(100, 5);
	});

	it("gamma prototype throws TypeError when parameter is not number", () => {
		expect(() => new Col(1, 2, 3, 4).gamma()).toThrowError(TypeError);
		expect(() => new Col(1, 2, 3, 4).gamma("a")).toThrowError(TypeError);
	});

	it("saturate prototype works as expected", () => {
		let v1 = new Col(1000, -1000, 10, 100);
		let v2 = v1.saturate();
		expect(v2.r).toBe(1);
		expect(v2.g).toBe(0);
		expect(v2.b).toBe(10/255);
		expect(v2.a).toBe(100/255);
	});

	it("getRGB prototype works as expected", () => {
		let v1 = new Col(10, 20, 30, 40);
		let rgb1 = v1.getRGB();
		expect(rgb1).toBe(660510);

		let v2 = new Col(0.5, 0, 1, 0);
		let rgb2 = v2.getRGB();
		expect(rgb2).toBe(8323327);
	});

	it("getARGB prototype works as expected", () => {
		let v1 = new Col(10, 20, 30, 40);
		let rgb1 = v1.getARGB();
		expect(rgb1).toBe(671749150);

		let v2 = new Col(0.5, 0, 1, 0.1);
		let rgb2 = v2.getARGB();
		expect(rgb2).toBe(427753727);
	});

	it("c function returns itself", () => {
		expect(new Col(1, 1, 1, 1).c() instanceof Col).toBe(true);
	});
});


describe("Kubika", () => {

	it("constructor works with all types", () => {
		let k1 = new Kubika(0);
		expect(k1.bm.mat[0][0]).toBe(-1);
		expect(k1.bm.mat[2][2]).toBe(0);
		expect(k1.type).toBe(0);

		let k2 = new Kubika(1);
		expect(k2.bm.mat[0][0]).toBe(2);
		expect(k2.bm.mat[2][2]).toBe(1);
		expect(k2.type).toBe(1);

		let k3 = new Kubika(2);
		expect(k3.bm.mat[0][0]).toBeCloseTo(-1/6, 5);
		expect(k3.bm.mat[2][2]).toBeCloseTo(3/6, 5);
		expect(k3.type).toBe(2);

		let k4 = new Kubika();
		expect(k4.bm.mat[0][0]).toBe(-1);
		expect(k4.bm.mat[2][2]).toBe(0);
		expect(k4.type).toBe(0);
	});

	it("init prototype works as expected", () => {
		let p1 = new Point3D(1, 2, 3, 4);
		let p2 = new Point3D(-4, -2, 0, 7);
		let p3 = new Point3D(5, -1, 4, -1);
		let p4 = new Point3D(0, 1.5, 4.5, -3);

		let k1 = new Kubika(0);
		k1.init(p1, p2, p3, p4);
		expect(k1.rb instanceof Mat4).toBe(true);
		expect(k1.rb.mat[0][0]).toBe(-28);
		expect(k1.rb.mat[2][1]).toBe(-12);
		expect(k1.rb.mat[1][3]).toBe(-33);

		let k2 = new Kubika(1);
		k2.init(p1, p2, p3, p4);
		expect(k2.rb instanceof Mat4).toBe(true);
		expect(k2.rb.mat[0][0]).toBe(-8);
		expect(k2.rb.mat[2][1]).toBe(-4);
		expect(k2.rb.mat[1][3]).toBe(-25);

		let k3 = new Kubika(2);
		k3.init(p1, p2, p3, p4);
		expect(k3.rb instanceof Mat4).toBe(true);
		expect(k3.rb.mat[0][0]).toBeCloseTo(-28/6, 5);
		expect(k3.rb.mat[2][1]).toBeCloseTo(-9/6, 5);
		expect(k3.rb.mat[1][3]).toBeCloseTo(-33/6, 5);
	});

	it("init prototype throws TypeError when parameters are not Point3D", () => {
		expect(() => new Kubika(0).init()).toThrowError(TypeError);
		expect(() => new Kubika(0).init("a", "a", "a", "a")).toThrowError(TypeError);
	});

	it("compute prototype works as expected", () => {
		let p1 = new Point3D(1, 2, 3, 4);
		let p2 = new Point3D(-4, -2, 0, 7);
		let p3 = new Point3D(5, -1, 4, -1);
		let p4 = new Point3D(0, 1.5, 4.5, -3);

		let k1 = new Kubika(0);
		k1.init(p1, p2, p3, p4);
		let pp1 = k1.compute(-1);
		let pp2 = k1.compute(0);
		expect(pp1.x).toBe(pp2.x);
		expect(pp1.y).toBe(pp2.y);
		expect(pp1.z).toBe(pp2.z);
		expect(pp1.w).toBe(pp2.w);

		let pp3 = k1.compute(2);
		let pp4 = k1.compute(1);
		expect(pp3.x).toBe(pp4.x);
		expect(pp3.y).toBe(pp4.y);
		expect(pp3.z).toBe(pp4.z);
		expect(pp3.w).toBe(pp4.w);

		let pp5 = k1.compute(0.4);
		expect(pp5.x).toBeCloseTo(-0.072, 5);
		expect(pp5.y).toBeCloseTo(-0.624, 5);
		expect(pp5.z).toBeCloseTo(2.088, 5);
		expect(pp5.w).toBe(1);
	});

	it("compute prototype throws TypeError when parameter is not number", () => {
		expect(() => new Kubika(0).compute()).toThrowError(TypeError);
		expect(() => new Kubika(0).compute("a")).toThrowError(TypeError);
	});
});


describe("Bikubika", () => {

});
