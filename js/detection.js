"use strict";

/**
 * Detection object holds all necessary functions for detecting location of marker
 * It is assigned by its inner anonymous self-invoking function. By using this approach some variables and functions can remain private.
 *
 * @public
 * @requires transforms3d.js
 * @requires webgl-utils.js
 * @requires sender.js
 * @type {Object}
 * @author Milan Košťák
 * @version 1.0
 */
const Detection = (function () {

	/**
	 * Main object which is exported into public Detection variable.
	 * @public
	 * @type {Object}
	 */
	let Detection = {};

	// HTMLCanvasElement
	let canvas;
	// WebGLRenderingContext or WebGL2RenderingContext
	let gl;
	// WebGLProgram
	let program1, program2, programDraw;
	// WebGLBuffer
	let vertexBuffer, indexBuffer, textureBuffer;
	// WebGLTexture
	let cameraTexture, texture1, texture2;
	// WebGLFramebuffer
	let fbo;
	// precision of reading from texture, either FLOAT or HALF_FLOAT_OES
	let texturePrecision;
	// format of texture depending on the version of WebGL that is used, either RGBA or RGBA32F
	let internalFormatTexture;
	// numbers, input width and height
	let width, height, w4, h4, w12, h12;
	// Float32Array
	let readBuffer;
	// variables for sending marker location
	let dataToSend = [], positionSequence = 0;
	// id of interval
	let markerFoundCheckInterval;
	// number, check every 50 ms if marker is lost
	const markerFoundCheckIntervalTime = 50;
	// boolean, if it remains false for 50ms then it means marker was lost
	let dataSent = true;
	// time measurement variables
	const MEASURE_TIME = false;
	const FINISH_COUNT = 1000;
	let currentCount = 0, times = [];
	const timeSlots = 4;

	let targetColor;
	let readBuffer2;

	/**
	 * Public initialization function. Sets all necessary variables.
	 * @public
	 * @return {boolean} true or false if the initialization was successful
	 */
	Detection.init = function () {
		if (!initWebGL()) return false;
		initBasics();
		initPrograms();
		initFB();
		initTextures();
		initBuffers();
		if (MEASURE_TIME) initTimeMeasurement();
		return true;
	};

	/**
	 * Init canvas and gl and get texture precision from extension
	 * @private
	 */
	function initWebGL() {
		canvas = document.querySelector("canvas");
		gl = canvas.getContext("webgl2");


		// if WebGL2 is not supported try to fall back to version 1
		if (!gl) {
			gl = canvas.getContext("experimental-webgl");

			// even WebGL1 is not supported - not much to do without it
			if (!gl) {
				alert("Initialization of WebGL was not successful. Your browser probably doesn't support it.");
				return false;
			}

			// extension that is necessary for loading or reading float data to or from GPU when using WebGL1
			let floatExtension = gl.getExtension("OES_texture_float");
			if (!floatExtension) {
				floatExtension = gl.getExtension("OES_texture_half_float");
				if (!floatExtension) {
					console.log("OES_texture_float nor OES_texture_half_float are supported.");
					alert("Initialization was not successful. Your browser doesn't support all necessary WebGL1 extensions.");
					return false;
				}
				texturePrecision = floatExtension.HALF_FLOAT_OES;
				console.log("Using OES_texture_half_float");
			} else {
				texturePrecision = gl.FLOAT;
				console.log("Using OES_texture_float");
			}
			internalFormatTexture = gl.RGBA;
			console.log("WebGL1 was initialized.");
		} else {
			// necessary extension for WebGL2
			const extension = gl.getExtension("EXT_color_buffer_float");
			if (!extension) {
				console.log("EXT_color_buffer_float is not supported");
				alert("Initialization was not successful. Your browser doesn't support all necessary WebGL2 extensions.");
				return false;
			}
			internalFormatTexture = gl.RGBA32F;
			texturePrecision = gl.FLOAT;
			console.log("WebGL2 was initialized.");
		}
		return true;
	}

	/**
	 * Set basic GL parameters
	 * @private
	 */
	function initBasics() {
		gl.clearColor(0.1, 0.1, 0.1, 1);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
	}

	/**
	 * Init WebGL programs
	 * @private
	 */
	function initPrograms() {
		// first step program - find points of interest and group them, using 4×4 areas
		program1 = gl.createProgram();
		Utils.initShaders(gl, program1, "shader-vs", "shader-fs1");
		gl.linkProgram(program1);
		gl.useProgram(program1);

		program1.vertexPositionAttribute = gl.getAttribLocation(program1, "aVertexPosition");
		program1.vertexTexCoordAttribute = gl.getAttribLocation(program1, "aTextureCoord");
		program1.rotation = gl.getUniformLocation(program1, "rotation");
		program1.texture = gl.getUniformLocation(program1, "texture");
		program1.width = gl.getUniformLocation(program1, "width");
		program1.height = gl.getUniformLocation(program1, "height");
		program1.targetColor = gl.getUniformLocation(program1, "targetColor");

		// second step program - further merging points of interest with weighted arithmetic mean
		program2 = gl.createProgram();
		Utils.initShaders(gl, program2, "shader-vs", "shader-fs2");
		gl.linkProgram(program2);
		gl.useProgram(program2);

		program2.vertexPositionAttribute = gl.getAttribLocation(program2, "aVertexPosition");
		program2.vertexTexCoordAttribute = gl.getAttribLocation(program2, "aTextureCoord");
		program2.rotation = gl.getUniformLocation(program2, "rotation");
		program2.texture = gl.getUniformLocation(program2, "texture");
		program2.width = gl.getUniformLocation(program2, "width");
		program2.height = gl.getUniformLocation(program2, "height");

		// basic draw program, doesn't do anything special in shaders
		programDraw = gl.createProgram();
		Utils.initShaders(gl, programDraw, "shader-vs", "shader-fs-draw");
		gl.linkProgram(programDraw);
		gl.useProgram(programDraw);

		programDraw.vertexPositionAttribute = gl.getAttribLocation(programDraw, "aVertexPosition");
		gl.enableVertexAttribArray(programDraw.vertexPositionAttribute);

		programDraw.vertexTexCoordAttribute = gl.getAttribLocation(programDraw, "aTextureCoord");
		gl.enableVertexAttribArray(programDraw.vertexTexCoordAttribute);

		programDraw.rotation = gl.getUniformLocation(programDraw, "rotation");
		programDraw.texture = gl.getUniformLocation(programDraw, "texture");
	}

	/**
	 * Init WebGL frame buffer
	 * @private
	 */
	function initFB() {
		fbo = gl.createFramebuffer();
	}

	/**
	 * Init all WebGL textures
	 * @private
	 */
	function initTextures() {
		texture1 = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		texture2 = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		cameraTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, cameraTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}

	/**
	 * Prepare data for drawing (basic face)
	 * @private
	 */
	function initBuffers() {
		let scene = new Utils.Scene();
		scene.add(new Utils.Face(1, 1, 0, 0, 0, {strip: false}));

		vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scene.vertices), gl.STATIC_DRAW);
		vertexBuffer.itemSize = 3;
		vertexBuffer.numItems = scene.vertices.length;

		indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(scene.indices), gl.STATIC_DRAW);
		indexBuffer.itemSize = 1;
		indexBuffer.numItems = scene.indices.length;

		textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scene.textureCoords), gl.STATIC_DRAW);
		textureBuffer.itemSize = 2;
		textureBuffer.numItems = scene.textureCoords.length;
	}

	function initTimeMeasurement() {
		for (let i = 0; i < timeSlots; i++) {
			times[i] = [];
		}
	}

	/**
	 * Set all things that need to know the dimension of source video.
	 * Function is called when this information is available.
	 * @public
	 * @param  {Number} videoWidth  width of source video
	 * @param  {Number} videoHeight height of source video
	 */
	Detection.setupAfterVideoStreamIsReady = function (videoWidth, videoHeight) {
		width = canvas.width = videoWidth;
		height = canvas.height = videoHeight;

		// Sender.add({type: "setup", width: width, height: height});

		//alert(width, height);
		w4 = width / 4;
		h4 = height / 4;
		w12 = w4 / 3;
		h12 = h4 / 3;

		// allocate readBuffer for reading pixels
		// do it now, because it is time-consuming operation
		let arraySize = Math.ceil(w12 * h12 * 4);
		readBuffer = new Float32Array(arraySize);
		readBuffer2 = new Float32Array(2);
	};

	/**
	 * Main function
	 * Runs the key algorithm
	 * @public
	 */
	Detection.repaint = function () {
		if (MEASURE_TIME && ++currentCount === FINISH_COUNT) {
			let t = [];

			for (let i = 0; i < timeSlots; i++) {
				t.push(times[i].reduce((a, b) => (a + b)) / times[i].length);
			}
			let result = "";
			for (let i = 0; i < timeSlots; i++) {
				result += t[i].toFixed(2) + ", "
			}

			console.log(result);
			//alert(result);

			currentCount = 0;
			initTimeMeasurement();

		}
		if (MEASURE_TIME) {
			window.performance.clearMarks()
			window.performance.mark("a");
		}
	///
	/// 1. step: first draw operation
	///
		gl.useProgram(program1);

		// bind vertex data
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(program1.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(program1.vertexPositionAttribute);

		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.vertexAttribPointer(program1.vertexTexCoordAttribute, textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(program1.vertexTexCoordAttribute);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		// bind framebuffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

		gl.uniformMatrix4fv(program1.rotation, false, Utils.convert(new Mat4Identity()));
		gl.uniform1f(program1.width, width);
		// noinspection JSSuspiciousNameCombination
		gl.uniform1f(program1.height, height);
		gl.uniform3fv(program1.targetColor, targetColor);

		gl.bindTexture(gl.TEXTURE_2D, texture2);
		// target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels)
		gl.texImage2D(gl.TEXTURE_2D, 0, internalFormatTexture, w4, h4, 0, gl.RGBA, texturePrecision, null);

		gl.viewport(0, 0, w4, h4);

		// draw to texture2
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, 0);

		// bind input texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, cameraTexture);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


		if (MEASURE_TIME) window.performance.mark("a");
	///
	/// 2. step: second draw operation
	///
		gl.useProgram(program2);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(program2.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(program2.vertexPositionAttribute);

		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.vertexAttribPointer(program2.vertexTexCoordAttribute, textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(program2.vertexTexCoordAttribute);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		gl.uniformMatrix4fv(program2.rotation, false, Utils.convert(new Mat4RotX(Math.PI)));
		gl.uniform1f(program2.width, w4);
		gl.uniform1f(program2.height, h4);

		gl.bindTexture(gl.TEXTURE_2D, texture1);
		// target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels)
		gl.texImage2D(gl.TEXTURE_2D, 0, internalFormatTexture, w12, h12, 0, gl.RGBA, texturePrecision, null);

		gl.viewport(0, 0, w12, h12);

		// draw to texture1
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);

		// bind input texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture2);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		if (MEASURE_TIME) window.performance.mark("a");

	///
	/// 3. step: read data
	///
		readData();

	///
	/// 4. step: optionally draw result
	///
/*
		// draw the output from previous draw cycle into canvas
		gl.useProgram(programDraw);
		gl.uniformMatrix4fv(programDraw.rotation, false, Utils.convert(new Mat4RotX(Math.PI)));
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.viewport(0, 0, width, height);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
*/

	///
	/// 5. step: save time if turned on
	///
		if (MEASURE_TIME) {
			let times2 = performance.getEntriesByName("a");

			for (let i = 0; i < timeSlots; i++) {
				times[i].push(times2[i + 1].startTime - times2[i].startTime);
			}
		}
	};

	/**
	 * Read output data from frame buffer.
	 * Then find point of interest - point with maximum count of "interesting" pixels.
	 */
	function readData() {
		gl.readPixels(0, 0, w12, h12, gl.RGBA, gl.FLOAT, readBuffer);
		if (MEASURE_TIME) window.performance.mark("a");

		let max = 0, x, y, count = 0;
		for (let i = 0; i < readBuffer.length; i += 4) {
			if (readBuffer[i] > max) {
				max = readBuffer[i];
				x = readBuffer[i + 1];
				y = readBuffer[i + 2];
			}
			if (readBuffer[i] > 1) {
				count++;
			}
		}
		if (max > 1) {
			// send({max: max, x: x, y: y, count: count});
			readBuffer2[0] = x;
			readBuffer2[1] = y;
		}

		if (MEASURE_TIME) window.performance.mark("a");
		// console.log(max, x, y, count);
	}

	/**
	 * Set external color, usually for testing purpose.
	 * Uncomment readData2() !!
	 */
	Detection.setExternalColor = (rgb) => {
		targetColor = Float32Array.from(rgb);
	};

	Detection.getReadBuffer2 = () => {
		return readBuffer2;
	};

	/**
	 * Update cameraTexture from video feed
	 */
	Detection.updateTexture = function (video) {
		gl.bindTexture(gl.TEXTURE_2D, cameraTexture);
		//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		// Firefox warning: Failed to hit GPU-copy fast-path. Falling back to CPU upload.
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1246410
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1322746
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
	};

	/**
	 * Reset sequence variable and set interval for sending position.
	 * @public
	 */
	Detection.restart = function () {
		// restart the sequence so the receiver can also restart the relative position
		positionSequence = 0;
		markerFoundCheckInterval = setInterval(checkIfMarkerFound, markerFoundCheckIntervalTime);
	};

	/**
	 * Clear sending interval and try to send any possible remaining data
	 * @public
	 */
	Detection.finish = function () {
		clearInterval(markerFoundCheckInterval);
		let obj = {
			type: "marker",
			time: new Date().getTime(),
			sequence: -1
		};
		Sender.add(obj)
	};

	/**
	 * Create object and put it into queue for sending
	 * @private
	 * @param  {Object} obj2 data about marker
	 */
	function send(obj2) {
		let obj = {
			type: "marker",
			time: new Date().getTime(),
			sequence: ++positionSequence,
			max: obj2.max,
			x: obj2.x,
			y: obj2.y,
			count: obj2.count
		};
		Sender.add(obj);
		dataSent = true;
	}

	/**
	 * Function for sending found marker position to the server
	 * @private
	 */
	function checkIfMarkerFound() {
		if (!dataSent) {
			let obj = {
				type: "marker",
				time: new Date().getTime(),
				sequence: ++positionSequence,
				max: 0,
				x: 0,
				y: 0,
				count: 0
			};
			Sender.add(obj)
		}
		dataSent = false;
	}

	// export Detection object
	return Detection;
})();
