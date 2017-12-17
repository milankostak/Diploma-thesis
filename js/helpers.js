
var Helpers = {};

Helpers.checkRotation = function (data, func1, func2, func3) {
	// this operation is some magic that I looked up in the data
	// looks at gamma (basically tells if screen is facing more up or down) and changes beta when gama is positive number
	let rotDegrees = (data.gamma > 0) ? 180 - data.beta : data.beta;
	// narrow data; second benefit is that there is no difference in numbers when screen is up or down
	if (rotDegrees < 0) rotDegrees += 360;
	// base (0) of rotDegrees is when top is left and at the same level as bottom of the phone
	// goes as normal degrees from 0 to 360 clockwise

	// 20 from base with 15 degrees space
	// rotation to right
	if ((rotDegrees > 20 && rotDegrees < 35) || (rotDegrees > 200 && rotDegrees < 215) || (rotDegrees > 110 && rotDegrees < 125)) {
		// 20 -> 35 (top to left) ; 200 -> 215 (top to right) ; 110 -> 125 (top to up)
		func1(rotDegrees);

	// rotation to left
	} else if ((rotDegrees < 340 && rotDegrees > 325) || (rotDegrees < 160 && rotDegrees > 145) || (rotDegrees < 70 && rotDegrees > 55)) {
		// 340 -> 325 (top to left) ; 145 -> 160 (top to right) ; 50 -> 70 (top to up)
		func2(rotDegrees);
	} else {
		func3();
	}
};