"use strict";
/**
 * Objekt obsahující pokročilé matematické funkce,
 *  které nejsou v klasickém Math obsaženy
 * @type {Object}
 * @author Milan Košťák
 */
var Math2 = {};

/**
 * Převod čísla ve stupních na radiány
 * @param  {number} degrees číslo ve stupních
 * @return {number}         číslo v radiánech
 */
Math2.toRadians = function(degrees) {
	return degrees * Math.PI / 180;
};

/**
 * Převod čísla v radiánech na stupně
 * @param  {number} radians číslo v radiánech
 * @return {number}         číslo ve stupních
 */
Math2.toDegrees = function(radians) {
	return radians / Math.PI * 180;
};

/**
 * Znaménko čísla, signum funkce
 * @param  {number} x
 * @return {number}   1, 0, nebo -1
 */
Math2.sign = function(x) {
	return x > 0 ? 1 : (x < 0 ? -1 : 0);
};

/**
 * Oříznutí čísla
 * @param  {number} number číslo pro oříznutí
 * @param  {number} min    povolené minimum
 * @param  {number} max    povolené maximum
 * @return {number}        oříznuté číslo
 */
Math2.clamp = function(number, min, max) {
	return Math.min(Math.max(number, min), max);
};

/**
 * Zjištění desetinné části čísla
 * @param  {number} x vstupní číslo
 * @return {number}   desetinná část
 */
Math2.fpart = Math2.fract = function(x) {
	return x % 1;
};
