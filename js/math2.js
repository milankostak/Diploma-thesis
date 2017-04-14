"use strict";
/**
 * Object implements mathematical functions that are not implemented by classic Math object
 * @version 1.1
 * @type {Object}
 * @author Milan Košťák
 */
var Math2 = {};

/**
 * Convert number in degrees to radians
 * @param  {number} degrees number in degrees
 * @return {number}         number in radians
 */
Math2.toRadians = function(degrees) {
	return degrees * Math.PI / 180;
};

/**
 * Convert number in radians to degrees
 * @param  {number} radians number in radians
 * @return {number}         number in degrees
 */
Math2.toDegrees = function(radians) {
	return radians / Math.PI * 180;
};

/**
 * A number representing the sign of the given argument
 * The function fully simulates behaviour of the new Math.sign
 * @deprecated use built-in Math.sign when possible
 * @param  {number} x number to get the sign of
 * @return {number}   NaN, 1, 0, -0, or -1
 */
Math2.sign = Math.sign || function(x) {
	return isNaN(x) ? NaN : (x > 0 ? 1 : (x < 0 ? -1 : (1/x === -Infinity ? -0 : 0)));
};

/**
 * Clamp number by minimum and maximum
 * @param  {number} number number to be clamped
 * @param  {number} min    allowed minimum
 * @param  {number} max    allowed maximum
 * @return {number}        clamped number
 */
Math2.clamp = function(number, min, max) {
	if (min < 0 && max < 0) {
		return Math.max(Math.min(number, min), max);
	} else {
		return Math.min(Math.max(number, min), max);
	}
};

/**
 * Get the fraction part of the given argument
 * @param  {number} x input number
 * @return {number}   fraction part of input
 */
Math2.fract = function(x) {
	return x % 1;
};
