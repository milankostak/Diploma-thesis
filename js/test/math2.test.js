"use strict"

describe("Math2", function() {
	it("is an object", function() {
		expect(typeof Math2).toBe("object");
	});
});

describe("Math2.toRadians", function() {
	it("converts number in degrees to radians", function() {
		expect(Math2.toRadians(0)).toBe(0);
		expect(Math2.toRadians(45)).toBe(Math.PI / 4);
		expect(Math2.toRadians(90)).toBe(Math.PI / 2);
		expect(Math2.toRadians(180)).toBe(Math.PI);
		expect(Math2.toRadians(-90)).toBe(-Math.PI / 2);
		expect(Math2.toRadians(360)).toBe(2 * Math.PI);
	});
});

describe("Math2.toDegrees", function() {
	it("converts number in radians to degrees", function() {
		expect(Math2.toDegrees(0)).toBe(0);
		expect(Math2.toDegrees(Math.PI / 4)).toBe(45);
		expect(Math2.toDegrees(Math.PI / 2)).toBe(90);
		expect(Math2.toDegrees(Math.PI)).toBe(180);
		expect(Math2.toDegrees(-Math.PI / 2)).toBe(-90);
		expect(Math2.toDegrees(2 * Math.PI)).toBe(360);
	});
});

describe("Math2.sign", function() {
	it("returns the sign of the given number", function() {
		expect(Math2.sign(3)).toBe(1);
		expect(Math2.sign(-3)).toBe(-1);
		expect(Math2.sign('-3')).toBe(-1);
		expect(Math2.sign(0)).toBe(0);
		expect(Math2.sign(-0)).toBe(-0);
		expect(Math2.sign(NaN)).toBeNaN();
		expect(Math2.sign('foo')).toBeNaN();
		expect(Math2.sign()).toBeNaN();
	});
});

describe("Math2.clamp", function() {
	it("clamps number by minimum and maximum", function() {
		expect(Math2.clamp(3, 0, 10)).toBe(3);
		expect(Math2.clamp(3, 5, 10)).toBe(5);
		expect(Math2.clamp(30, 5, 10)).toBe(10);

		expect(Math2.clamp(3, -5, 5)).toBe(3);
		expect(Math2.clamp(-3, -5, 5)).toBe(-3);
		expect(Math2.clamp(10, -5, 5)).toBe(5);
		expect(Math2.clamp(-10, -5, 5)).toBe(-5);

		expect(Math2.clamp(-5, -10, -20)).toBe(-10);
		expect(Math2.clamp(-15, -10, -20)).toBe(-15);
		expect(Math2.clamp(-25, -10, -20)).toBe(-20);
	});
});


describe("Math2.fract", function() {
	it("clamps number by minimum and maximum", function() {
		expect(Math2.fract(1)).toBeCloseTo(0, 5);
		expect(Math2.fract(2.546)).toBeCloseTo(0.546, 5);
		expect(Math2.fract(0)).toBeCloseTo(0, 5);
		expect(Math2.fract(-1.1)).toBeCloseTo(-0.1, 5);
		expect(Math2.fract(-2)).toBeCloseTo(-0, 5);
	});
});
