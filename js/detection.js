"use strict";

/**
 * Detection object holds all necessary functions for detecting location of marker
 * It is assigned by its inner anonymous self-invoking function. By using this approach some variables and functions can remain private.
 *
 * @public
 * @requires transforms3d.js
 * @requires webgl-utils.js
 * @type {Object}
 * @author Milan Košťák
 * @version 1.0
 */
var Detection = (function() {

	/**
	 * Main object which is exported into public Detection variable.
	 * @public
	 * @type {Object}
	 */
	let Detection = {};

	// HTMLCanvasElement
	let canvas;
	// WebGLRenderingContext
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
	// numbers, input width and height
	let width, height, w4, h4, w12, h12;
	// Float32Array
	let readBuffer;
	// variables for sending marker location
	let dataToSend = [], positionSequence = 0;
	// id of interval
	let sendPositionInterval;

	/**
	 * Relative address on which the server is listening for motion data.
	 * It is set by init function.
	 * @type {String}
	 */
	let address;

	/**
	 * Public initialization function. Sets all necessary variables.
	 * @public
	 */
	Detection.init = function(addr) {
		address = addr;
		initBasics();
		initPrograms();
		initFB();
		initTextures();
		initBuffers();
	};

	/**
	 * Init canvas and gl and get texture precision from extension
	 * @private
	 */
	function initBasics() {
		canvas = document.querySelector("canvas");
		gl = Utils.initWebGL(canvas);

		gl.clearColor(0.1, 0.1, 0.1, 1);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		// extension that is necessary for loading or reading float data to or from GPU
		let floatExtension = gl.getExtension("OES_texture_float");
		if (!floatExtension) {
			floatExtension = gl.getExtension('OES_texture_half_float');
			texturePrecision = floatExtension.HALF_FLOAT_OES;
			console.log("Using OES_texture_half_float");
			//alert("Using OES_texture_half_float");
		} else {
			texturePrecision = gl.FLOAT;
			console.log("Using OES_texture_float");
			//alert("Using OES_texture_float");
		}
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
		gl.enableVertexAttribArray(program1.vertexPositionAttribute);

		program1.vertexTexCoordAttribute = gl.getAttribLocation(program1, "aTextureCoord");
		gl.enableVertexAttribArray(program1.vertexTexCoordAttribute);

		program1.rotation = gl.getUniformLocation(program1, "rotation");
		program1.texture = gl.getUniformLocation(program1, "texture");
		program1.width = gl.getUniformLocation(program1, "width");
		program1.height = gl.getUniformLocation(program1, "height");

		// second step program - further merging points of interest with weighted arithmetic mean
		program2 = gl.createProgram();
		Utils.initShaders(gl, program2, "shader-vs", "shader-fs2");
		gl.linkProgram(program2);
		gl.useProgram(program2);

		program2.vertexPositionAttribute = gl.getAttribLocation(program2, "aVertexPosition");
		gl.enableVertexAttribArray(program2.vertexPositionAttribute);

		program2.vertexTexCoordAttribute = gl.getAttribLocation(program2, "aTextureCoord");
		gl.enableVertexAttribArray(program2.vertexTexCoordAttribute);

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

	/**
	 * Set all things that need to know the dimension of source video.
	 * Function is called when this information is available.
	 * @public
	 * @param  {Number} videoWidth  width of source video
	 * @param  {Number} videoHeight height of source video
	 */
	Detection.setupAfterVideoStreamIsReady = function(videoWidth, videoHeight) {
		width = canvas.width = videoWidth;
		height = canvas.height = videoHeight;

		// mobile portrait 360×640
		// mobile landscape 640×360
		//alert(width+", "+height);
		w4 = width/4;
		h4 = height/4;
		w12 = w4/3;
		h12 = h4/3;

		// allocate readBuffer for reading pixels
		// do it now, because it is time consuming operation
		let arraySize = Math.ceil(w12 * h12 * 4);
		readBuffer = new Float32Array(arraySize);
	};

	/**
	 * Main function
	 * Runs the key algorithm
	 * @public
	 */
	var finishCount = 100;
	var count = 0;
	var times = [];
	times[0] = [];
	times[1] = [];
	times[2] = [];
	times[3] = [];
	times[4] = [];
	Detection.repaint = function() {
		if (count++ < finishCount && count > 2) {
			window.performance.clearMarks()
			window.performance.mark("a");
			// bind vertex data
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.vertexAttribPointer(program1.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
			gl.vertexAttribPointer(program1.vertexTexCoordAttribute, textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

			// bind framebuffer
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

			window.performance.mark("a");
	//**********************************************************
			gl.useProgram(program1);

			gl.uniformMatrix4fv(program1.rotation, false, Utils.convert(new Mat4Identity()));
			gl.uniform1f(program1.width, width);
			gl.uniform1f(program1.height, height);

			gl.bindTexture(gl.TEXTURE_2D, texture2);
			// target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels)
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w4, h4, 0, gl.RGBA, texturePrecision, null);
			gl.viewport(0, 0, w4, h4);

			// ... and draw to it
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, 0);

			// bind input texture
			gl.bindTexture(gl.TEXTURE_2D, cameraTexture);

			// draw from input texture to FB texture
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			window.performance.mark("a");

	//**********************************************************
			gl.useProgram(program2);

			gl.uniformMatrix4fv(program2.rotation, false, Utils.convert(new Mat4RotX(Math.PI)));
			gl.uniform1f(program2.width, w4);
			gl.uniform1f(program2.height, h4);

			gl.bindTexture(gl.TEXTURE_2D, texture1);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w12, h12, 0, gl.RGBA, texturePrecision, null);
			gl.viewport(0, 0, w12, h12);

			// ... and draw to it
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);

			// bind input texture
			gl.bindTexture(gl.TEXTURE_2D, texture2);

			// draw from previous output to FB texture
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			window.performance.mark("a");

	//**********************************************************
			readData();
			// draw the output from previous draw cycle into canvas
/*
			gl.useProgram(programDraw);
			gl.uniformMatrix4fv(programDraw.rotation, false, Utils.convert(new Mat4RotX(Math.PI)));
			gl.bindTexture(gl.TEXTURE_2D, texture1);
			gl.viewport(0, 0, width, height);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
*/

	//**********************************************************
			let times2 = performance.getEntriesByName("a");

			times[0].push(times2[1].startTime - times2[0].startTime);
			times[1].push(times2[2].startTime - times2[1].startTime);
			times[2].push(times2[3].startTime - times2[2].startTime);
			times[3].push(times2[4].startTime - times2[3].startTime);
			times[4].push(times2[5].startTime - times2[4].startTime);

		} else if (count === finishCount + 1) {
			let t0 = times[0].reduce((a, b) => (a + b)) / times[0].length;
			let t1 = times[1].reduce((a, b) => (a + b)) / times[1].length;
			let t2 = times[2].reduce((a, b) => (a + b)) / times[2].length;
			let t3 = times[3].reduce((a, b) => (a + b)) / times[3].length;
			let t4 = times[4].reduce((a, b) => (a + b)) / times[4].length;
			console.log(t0.toFixed(2), t1.toFixed(2), t2.toFixed(2), t3.toFixed(2), t4.toFixed(2));

			count = 0;
			times = [];
			times[0] = [];
			times[1] = [];
			times[2] = [];
			times[3] = [];
			times[4] = [];
		}
	};

	/**
	 * Read output data from frame buffer.
	 * Then find point of interest - point with maximum count of "interesting" pixels.
	 */
	function readData() {
			gl.readPixels(0, 0, w12, h12, gl.RGBA, gl.FLOAT, readBuffer);
			window.performance.mark("a");
			/*times.push(new Date().getTime() - time);
			if (times.length % 60 == 0) {
				let sum = 0;
				for (let i = 0; i < times.length; i++) {
					sum += times[i];
				}
				console.log(sum / times.length);
				times.length = 0;
			}

			for (let i = 0; i < readBuffer.length; i+=4) {
				if (readBuffer[i] >= 1) {
					console.log(readBuffer[i], readBuffer[i+1], readBuffer[i+2], readBuffer[i+3]);
				}
			}*/

			let max = 0, x, y, count = 0;
			for (let i = 0; i < readBuffer.length; i+=4) {
				if (readBuffer[i] > max) {
					max = readBuffer[i];
					x = readBuffer[i+1];
					y = readBuffer[i+2];
				}
				if (readBuffer[i] > 1) {
					count++;
				}
			}
			if (max > 1) {
				dataToSend.push({max: max, x: x, y: y, count: count});
			}
			window.performance.mark("a");
			//console.log("MAX")
			//console.log(max, x, y);
		//}

	}

	/**
	 * Update cameraTexture from video feed
	 */
	Detection.updateTexture = function(video) {
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
	Detection.restart = function() {
		// restart the sequence so the receiver can also restart the relative position
		positionSequence = 0;
		sendPositionInterval = setInterval(sendPosition, 50);
	};

	/**
	 * Clear sending interval and try to send any possible remaining data
	 * @public
	 */
	Detection.finish = function() {
		clearInterval(sendPositionInterval);
		sendPosition();
		let obj = {
			type: "marker",
			time: new Date().getTime(),
			sequence: -1
		};
		send(obj);
	};

	/**
	 * Function for sending found marker position to the server
	 * @private
	 */
	function sendPosition() {
		if (dataToSend.length === 0) {
			let obj = {
				type: "marker",
				time: new Date().getTime(),
				sequence: ++positionSequence,
				max: 0,
				x: 0,
				y: 0,
				count: 0
			};
			send(obj);
		} else {
			let a = dataToSend;
/*
			// weighted mean of values
			// weight is getting lower with age of the value
			// weight is given by the sequence, last having 100%, first (oldest) the least of given fraction
			let weight = a.map((val, index) => (1 / a.length) * (index + 1)).reduce((a, b) => a + b);
			let max = a.map((val, index) => val.max * ((1 / a.length) * (index + 1))).reduce((a, b) => a + b) / weight;
			let coordX = a.map((val, index) => val.x * ((1 / a.length) * (index + 1))).reduce((a, b) => a + b) / weight;
			let coordY = a.map((val, index) => val.y * ((1 / a.length) * (index + 1))).reduce((a, b) => a + b) / weight;
			let count = a.map((val, index) => val.count * ((1 / a.length) * (index + 1))).reduce((a, b) => a + b) / weight;

			// leave last 4 values
			if (dataToSend.length > 4) {
				dataToSend = a.slice(a.length - 4);
			// or take away one if there is not enough values
			} else {
				dataToSend = a.slice(1);
			}
*/

			//console.log(weight, max, coordX, coordY, count);
			let sumMax = 0, sumX = 0, sumY = 0, sumCount = 0;
			for (let i = 0; i < a.length; i++) {
				sumMax += a[i].max;
				sumX += a[i].x;
				sumY += a[i].y;
				sumCount += a[i].count;
			}
			// send mean of data
			let max = sumMax / a.length;
			let coordX = sumX / a.length;
			let coordY = sumY / a.length;
			let count = sumCount / a.length;
			// clear dataToSend
			dataToSend.length = 0;

			// keep at least 4 last values
			/*if (dataToSend.length > 4) {
				dataToSend = a.slice(a.length - 4);
			// or take away one if there is not enough values
			} else {
				dataToSend = a.slice(1);
			}*/

			let obj = {
				type: "marker",
				time: new Date().getTime(),
				sequence: ++positionSequence,
				max: max,
				x: coordX,
				y: coordY,
				count: count
			};
			send(obj);
		}
	}

	/**
	 * Sends data to server
	 * @param  {object} objectToSend object of data to be sent
	 */
	function send(objectToSend) {
		let request = new XMLHttpRequest();
		request.open('POST', address);
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		request.send(JSON.stringify(objectToSend));
	}

	return Detection;
})();
