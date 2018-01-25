(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.windLayer = factory());
}(this, (function () { 'use strict';

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);

    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
    var program = gl.createProgram();

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }

    var wrapper = {program: program};

    var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < numAttributes; i++) {
        var attribute = gl.getActiveAttrib(program, i);
        wrapper[attribute.name] = gl.getAttribLocation(program, attribute.name);
    }
    var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var i$1 = 0; i$1 < numUniforms; i$1++) {
        var uniform = gl.getActiveUniform(program, i$1);
        wrapper[uniform.name] = gl.getUniformLocation(program, uniform.name);
    }

    return wrapper;
}

function createTexture(gl, filter, data, width, height) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    if (data instanceof Uint8Array) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}


function bindTexture(gl, texture, unit) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
}

function createBuffer(gl, data) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
}

function bindAttribute(gl, buffer, attribute, numComponents) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
}

function bindFramebuffer(gl, framebuffer, texture) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    if (texture) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }
}

var drawVert = "precision mediump float;\n\nattribute float a_index;\n\nuniform sampler2D u_particles;\nuniform float u_particles_res;\n\nuniform mat4 u_matrix;\nuniform vec4 u_mercator_bbox;\nuniform vec4 u_extent;\n\nvarying vec2 v_particle_pos;\n\nvoid main() {\n    vec4 color = texture2D(u_particles, vec2(\n        fract(a_index / u_particles_res),\n        floor(a_index / u_particles_res) / u_particles_res));\n\n    // decode current particle position from the pixel's RGBA value\n    // float xranage = u_extent.z - u_extent.x\n    // float yranage = u_extent. - u_extent.x\n    vec2 xyrange = vec2(u_extent.zw - u_extent.xy);\n    v_particle_pos = vec2(\n        color.r / 255.0 + color.b,\n        color.g / 255.0 + color.a);\n\n    // project the position with mercator projection\n    // todo 计算extent\n    vec2 min = u_mercator_bbox.xy;\n    vec2 max = u_mercator_bbox.zw;\n    float s = sin(radians(u_extent.y + v_particle_pos.y * xyrange.y));\n    float y =(degrees(log((1.0 + s) / (1.0 - s))) / 360.0 + 1.0) / 2.0;\n    float x = (180.0 + u_extent.x + v_particle_pos.x * xyrange.x) / 360.0;\n    // y = y+ 0.18;\n    // float s = sin(radians(90.0 - v_particle_pos.y * 180.0));\n    // float y = (degrees(log((1.0 + s) / (1.0 - s))) / 360.0 + 1.0) / 2.0;\n    // float x = v_particle_pos.x;\n\n\n\n    gl_PointSize = 1.0; //extent\n    // gl_Position = vec4(\n    //     2.0 * x - 1.0,\n    //     2.0 * y - 1.0,\n    //     0, 1);\n    gl_Position = vec4(\n        2.0 * (x - min.x  ) / (max.x - min.x) - 1.0,\n        2.0 * (y - min.y) / (max.y - min.y) - 1.0,\n        0, 1);\n}\n";

var drawFrag = "precision mediump float;\n\nuniform sampler2D u_wind;\nuniform vec2 u_wind_min;\nuniform vec2 u_wind_max;\nuniform sampler2D u_color_ramp;\n\nvarying vec2 v_particle_pos;\n\nvoid main() {\n    vec2 velocity =  mix(u_wind_min, u_wind_max, texture2D(u_wind, v_particle_pos).rg);\n    float speed_t = length(velocity) / length(u_wind_max);\n\n    // color ramp is encoded in a 16x16 texture\n    vec2 ramp_pos = vec2(\n        fract(16.0 * speed_t),\n        floor(16.0 * speed_t) / 16.0);\n\n    gl_FragColor = texture2D(u_color_ramp, ramp_pos);\n}\n";

var quadVert = "precision mediump float;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_tex_pos;\n\nvoid main() {\n    v_tex_pos = a_pos;\n    gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);\n}\n";

var mapVert = "precision mediump float;\n\nattribute vec2 a_pos;\nuniform mat4 u_matrix;\nvarying vec2 v_tex_pos;\n\nvoid main() {\n    v_tex_pos = a_pos;\n    // vec2 pos = a_pos;\n    gl_Position = u_matrix * vec4((1.0 - 2.0 * a_pos), 0, 1);\n    // pos.y = - pos.y;\n    // vec2 pos = 1.0 - 2.0 * a_pos;\n    //  pos.y = - pos.y;\n    //  gl_Position = u_matrix * vec4(pos, 0, 1);\n    // gl_Position = u_matrix * vec4((1.0 - 2.0 * pos), 0, 1);\n\n}\n";

var screenFrag = "precision mediump float;\n\nuniform sampler2D u_screen;\nuniform float u_opacity;\n\nvarying vec2 v_tex_pos;\n\nvoid main() {\n    vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);\n    // a hack to guarantee opacity fade out even with a value close to 1.0\n    gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);\n}\n";

var updateFrag = "precision highp float;\n\nuniform sampler2D u_particles;\nuniform sampler2D u_wind;\nuniform vec2 u_wind_res;\nuniform vec2 u_wind_min;\nuniform vec2 u_wind_max;\nuniform float u_rand_seed;\nuniform float u_speed_factor;\nuniform float u_drop_rate;\nuniform float u_drop_rate_bump;\nuniform vec4 u_bbox;\nuniform vec4 u_extent;\n\nvarying vec2 v_tex_pos;\n\n// pseudo-random generator\nconst vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);\nfloat rand(const vec2 co) {\n    float t = dot(rand_constants.xy, co);\n    return fract(sin(t) * (rand_constants.z + t));\n}\n\n// wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation\nvec2 lookup_wind(const vec2 uv) {\n    // return texture2D(u_wind, uv).rg; // lower-res hardware filtering\n    vec2 px = 1.0 / u_wind_res;\n    vec2 vc = (floor(uv * u_wind_res)) * px;\n    vec2 f = fract(uv * u_wind_res);\n    vec2 tl = texture2D(u_wind, vc).rg;\n    vec2 tr = texture2D(u_wind, vc + vec2(px.x, 0)).rg;\n    vec2 bl = texture2D(u_wind, vc + vec2(0, px.y)).rg;\n    vec2 br = texture2D(u_wind, vc + px).rg;\n    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);\n}\n\nvoid main() {\n    vec4 color = texture2D(u_particles, v_tex_pos);\n    vec2 pos = vec2(\n        color.r / 255.0 + color.b,\n        color.g / 255.0 + color.a); // decode particle position from pixel RGBA\n\n    vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(pos));\n    float speed_t = length(velocity) / length(u_wind_max);\n\n    // take EPSG:4236 distortion into account for calculating where the particle moved\n    float distortion = cos(radians(pos.y * 180.0 - 90.0));\n    vec2 offset = vec2(velocity.x / distortion, velocity.y) * 0.0001 * u_speed_factor;\n\n    // update particle position, wrapping around the date line\n    pos = fract(1.0 + pos + offset);\n\n    // a random seed to use for the particle drop\n    vec2 seed = (pos + v_tex_pos) * u_rand_seed;\n\n    // drop rate is a chance a particle will restart at random position, to avoid degeneration\n    float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;\n    float drop = step(1.0 - drop_rate, rand(seed));\n\n    vec2 random_pos = vec2(\n        rand(seed + 1.3),\n        rand(seed + 2.1));\n    pos = mix(pos, random_pos, drop);\n\n    // encode the new particle position back into RGBA\n    gl_FragColor = vec4(\n        fract(pos * 255.0),\n        floor(pos * 255.0) / 255.0);\n}\n";

var mapFrag = "precision mediump float;\n\nuniform sampler2D u_screen;\nuniform sampler2D u_mask;\nuniform float u_opacity;\nuniform bool u_isMask;\n\nvarying vec2 v_tex_pos;\n\nvoid main() {\n    vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);\n    if( u_isMask && color.a!= 0.0) {\n       color.a = texture2D(u_mask, 1.0 - v_tex_pos).a;\n    }\n\n    // a hack to guarantee opacity fade out even with a value close to 1.0\n    gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);\n}\n";

var WindGL = function WindGL(gl, box, windOptions) {
      this.gl = gl;
      this.fadeOpacity =windOptions.fadeOpacity ||0.996; // how fast the particle trails fade on each frame
      this.speedFactor = windOptions.speedFactor || 0.5; // how fast the particles move
      this.dropRate = windOptions.dropRate || 0.003; // how often the particles move to a random place
      this.dropRateBump = windOptions.dropRateBump || 0.01; // drop rate increase relative to individual particle speed
      this.RampColors = windOptions.RampColors;
      this.isMask = windOptions.isMask || false;
      this.drawProgram = createProgram(gl, drawVert, drawFrag);
      this.screenProgram = createProgram(gl, quadVert, screenFrag);
      this.updateProgram = createProgram(gl, quadVert, updateFrag);
      this.mapProgram = createProgram(gl, mapVert, mapFrag);
      this.matrix = [
        1, 0, 0, 0,
        0, 1, 0,0,
        0, 0, 0, 0,
        0, 0, 0, 1 ];
      this.extent = windOptions.extent;
      this.quadBuffer = createBuffer(gl, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]));
      this.framebuffer = gl.createFramebuffer();
      this.bbox = box || [0, 0, 1, 1];
      this.setColorRamp(this.RampColors);
      this.setBBox(this.bbox);
      this.resize();
  };

var prototypeAccessors = { numParticles: { configurable: true } };

  WindGL.prototype.resize = function resize () {
      var gl = this.gl;
      var emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
      // screen textures to hold the drawn screen for the previous and the current frame
      this.backgroundTexture = createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
      this.screenTexture = createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
  };

  WindGL.prototype.setColorRamp = function setColorRamp (colors) {
      // lookup texture for colorizing the particles according to their speed
      this.colorRampTexture = createTexture(this.gl, this.gl.LINEAR, getColorRamp(colors), 16, 16);
  };

  prototypeAccessors.numParticles.set = function (numParticles) {
      var gl = this.gl;
      var bbox = this.bbox;
      // we create a square texture where each pixel will hold a particle position encoded as RGBA
      var particleRes = this.particleStateResolution = Math.ceil(Math.sqrt(numParticles));
      this._numParticles = particleRes * particleRes;

      var particleState = new Uint8Array(this._numParticles * 4);
      // const extent =[59.765625,13.752724664396988, 140.09765625, 53.85252660044951] //地图范围
      // const xrange = extent[2] - extent[0];
      // const yrange = extent[3] - extent[1];
      for (var i = 0; i < particleState.length; i++) {
          particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions

      }

      // textures to hold the particle state for the current and the next frame
      this.particleStateTexture0 = createTexture(gl, gl.NEAREST, particleState, particleRes, particleRes);
      this.particleStateTexture1 = createTexture(gl, gl.NEAREST, particleState, particleRes, particleRes);

      var particleIndices = new Float32Array(this._numParticles);
      for (var i$1 = 0; i$1 < this._numParticles; i$1++) { particleIndices[i$1] = i$1; }
      this.particleIndexBuffer = createBuffer(gl, particleIndices);
  };
  prototypeAccessors.numParticles.get = function () {
      return this._numParticles;
  };

  WindGL.prototype.setWind = function setWind (windData) {
      this.windData = windData;
      this.windTexture = createTexture(this.gl, this.gl.LINEAR, windData.image);
  };

  WindGL.prototype.setBBox = function setBBox (bbox) {
      this.bbox = bbox;
      this.mercBBox = [bbox[0], mercY(bbox[1]), bbox[2], mercY(bbox[3])];
  };
  WindGL.prototype.setMaskTexture = function setMaskTexture (texture) {
    var maskTexture = createTexture(this.gl, this.gl.LINEAR, texture);
    this.maskTexture = maskTexture;
  };
  WindGL.prototype.draw = function draw () {
      var gl = this.gl;
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.STENCIL_TEST);

      bindTexture(gl, this.windTexture, 0);
      bindTexture(gl, this.particleStateTexture0, 1);
      bindTexture(gl, this.maskTexture, 3);

      this.drawScreen();
      this.updateParticles();
  };

  WindGL.prototype.drawScreen = function drawScreen () {
      var gl = this.gl;

      // gl.enable(gl.DEPTH_TEST);

      // draw the screen into a temporary framebuffer to retain it as the background on the next frame
      bindFramebuffer(gl, this.framebuffer, this.screenTexture);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      this.drawTexture(this.backgroundTexture, this.fadeOpacity);
      this.drawParticles();

      bindFramebuffer(gl, null);
      // enable blending to support drawing on top of an existing background (e.g. a map)
      gl.enable(gl.BLEND);

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.STENCIL_TEST);
      this.drawTexture2Map(this.screenTexture, 1);

      gl.disable(gl.BLEND);

      // save the current screen as the background for the next frame
      var temp = this.backgroundTexture;
      this.backgroundTexture = this.screenTexture;
      this.screenTexture = temp;
  };

  WindGL.prototype.drawTexture = function drawTexture (texture, opacity) {
      var gl = this.gl;
      var program = this.screenProgram;
      gl.useProgram(program.program);

      bindAttribute(gl, this.quadBuffer, program.a_pos, 2);
      bindTexture(gl, texture, 2);
      gl.uniform1i(program.u_screen, 2);
      gl.uniform1f(program.u_opacity, opacity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  WindGL.prototype.drawMaskTexture = function drawMaskTexture (texture, opacity) {
    var gl = this.gl;
    var program = this.screenProgram;
    gl.useProgram(program.program);
    // gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    // gl.stencilFunc(gl.ALWAYS, 1, 0xff);
    // gl.stencilMask(0xff);
    gl.depthMask(false);
    // gl.colorMask(false, false, false, false);

    bindAttribute(gl, this.quadBuffer, program.a_pos, 2);
    bindTexture(gl, texture, 3);
    gl.uniform1i(program.u_screen, 3);
    gl.uniform1f(program.u_opacity, opacity);
    gl.uniformMatrix4fv(program.u_matrix, false, this.matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
};
  WindGL.prototype.drawTexture2Map = function drawTexture2Map (texture, opacity) {
    var gl = this.gl;
    var program = this.mapProgram;
    gl.useProgram(program.program);



    bindAttribute(gl, this.quadBuffer, program.a_pos, 2);
    bindTexture(gl, texture, 2);
    // util.bindTexture(gl, this.maskTexture, 3);
    gl.uniform1i(program.u_isMask, this.isMask);
    gl.uniform1i(program.u_screen, 2);
    gl.uniform1i(program.u_mask, 3);
    gl.uniform1f(program.u_opacity, opacity);
    gl.uniformMatrix4fv(program.u_matrix, false, this.matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
};
  WindGL.prototype.drawParticles = function drawParticles () {
      var gl = this.gl;
      var program = this.drawProgram;
      gl.useProgram(program.program);
      bindAttribute(gl, this.particleIndexBuffer, program.a_index, 1);
      bindTexture(gl, this.colorRampTexture, 2);

      gl.uniform1i(program.u_wind, 0);
      gl.uniform1i(program.u_particles, 1);
      gl.uniform1i(program.u_color_ramp, 2);

      gl.uniform1f(program.u_particles_res, this.particleStateResolution);
      gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
      gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);
      // gl.uniform2f(program.u_wind_min, -25, -25);
      gl.uniform2f(program.u_wind_max, 25, 25);
      gl.uniform4fv(program.u_mercator_bbox, this.mercBBox);
      gl.uniform4fv(program.u_extent, this.extent);
      // gl.uniformMatrix4fv(program.u_matrix, false, this.matrix)

      gl.drawArrays(gl.POINTS, 0, this._numParticles);
  };

  WindGL.prototype.updateParticles = function updateParticles () {
      var gl = this.gl;
      bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1);
      gl.viewport(0, 0, this.particleStateResolution, this.particleStateResolution);

      var program = this.updateProgram;
      gl.useProgram(program.program);

      bindAttribute(gl, this.quadBuffer, program.a_pos, 2);

      gl.uniform1i(program.u_wind, 0);
      gl.uniform1i(program.u_particles, 1);

      gl.uniform1f(program.u_rand_seed, Math.random());
      gl.uniform2f(program.u_wind_res, this.windData.width, this.windData.height);
      gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
      gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);
      gl.uniform1f(program.u_speed_factor, this.speedFactor);
      gl.uniform1f(program.u_drop_rate, this.dropRate);
      gl.uniform1f(program.u_drop_rate_bump, this.dropRateBump);
      gl.uniform4fv(program.u_extent, this.extent);
      gl.uniform4fv(program.u_bbox, this.bbox);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // swap the particle state textures so the new one becomes the current one
      var temp = this.particleStateTexture0;
      this.particleStateTexture0 = this.particleStateTexture1;
      this.particleStateTexture1 = temp;
  };

Object.defineProperties( WindGL.prototype, prototypeAccessors );

function getColorRamp(colors) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = 256;
    canvas.height = 1;

    var gradient = ctx.createLinearGradient(0, 0, 256, 0);
    for (var stop in colors) {
        gradient.addColorStop(+stop, colors[stop]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);

    return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
}

function mercY(y) {
    var s = Math.sin(Math.PI / 2 - y * Math.PI);
    var y2 = 1.0 - (Math.log((1.0 + s) / (1.0 - s)) / (2 * Math.PI) + 1.0) / 2.0;
    return y2 < 0 ? 0 :
           y2 > 1 ? 1 : y2;
}

var windCanvasLayer = function windCanvasLayer (map, opt) {
  this._map = map;
  var options = {
    fadeOpacity: 0.996,
    speedFactor: 0.5,
    dropRate: 0.003,
    dropRateBump: 0.01,
    numParticles:65536,
    RampColors:{
      0.0: '#3288bd',
      0.1: '#66c2a5',
      0.2: '#abdda4',
      0.3: '#e6f598',
      0.4: '#fee08b',
      0.5: '#fdae61',
      0.6: '#f46d43',
      1.0: '#d53e4f'
     }
  };
 this.options = Object.assign({}, options, opt);
 this.extent = this.options.extent;
 this.windDataInfo = this.options.windDataInfo;
 this.maskUrl = this.options.maskUrl || null;
 this.isMask = this.options.isMask || true;
 this.onAdd();
 this.draw();
};
windCanvasLayer.prototype.canvas = function canvas () {
  return this._canvas
};
windCanvasLayer.prototype.onAdd = function onAdd () {
  var canvasContainer = map.getCanvasContainer();
  this.canvasContainer = canvasContainer;
  this._canvas = document.createElement('canvas');
  this._canvas.className = 'wind-canvas-layer';
  this._canvas.id = 'windCanvas';
  var canvas = this._map.getCanvas();
  this._canvas.style.cssText = canvas.style.cssText;
  this._canvas.width = canvas.width;
  this._canvas.height = canvas.height;
  this.gl = this._canvas.getContext('webgl', {antialiasing: false,stencil:true});
  if(!this.options.windDataUrl || !this.options.windDataTime) {
    console.error('缺失风场数据参数');
    return
  }
  // mask canvas
  var maskCanvas =this.maskCanvas = document.createElement('canvas');
  maskCanvas.style.cssText = canvas.style.cssText;
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  if(this.maskUrl&& this.isMask) {
     this.getMaskData();
    }
  this.wind = new WindGL(this.gl, this.bounds2bbox(this._map.getBounds()),this.options);
  this.wind.numParticles = this.options.numParticles;
  canvasContainer.appendChild(this._canvas);
  this.wind.setMaskTexture(maskCanvas);
  this.draw();
  this.frame();
  this.mapMoveEvent= this.moveEvent.bind(this);
  this.mapMoveEndEvent= this.moveendEvent.bind(this);
  this.mapResizeEvent= this._resize.bind(this);
  this._map.on('move', this.mapMoveEvent);
  this._map.on('moveend', this.mapMoveEndEvent);
  this._map.on('resize', this.mapResizeEvent);
};
windCanvasLayer.prototype._resize = function _resize () {
  var canvas = this._map.getCanvas();
  this._canvas.style.cssText = canvas.style.cssText;
  this._canvas.width = canvas.width;
  this._canvas.height = canvas.height;
  this.wind.resize();
};
windCanvasLayer.prototype.draw = function draw () {
  if(this.maskData){ this.drawMask(); }
  this.updateWind(this.options.windDataTime);
};
windCanvasLayer.prototype.frame = function frame () {
  if (this.wind.windData && this.maskData) {
    this.drawMask();
    this.wind.draw();
  }

  this.start();
};
windCanvasLayer.prototype.getJSON = function getJSON (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('get', url, true);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(xhr.response);
    } else {
      throw new Error(xhr.statusText)
    }
  };
  xhr.send();
};
windCanvasLayer.prototype.updateWind = function updateWind (time) {
  var me = this;
  me.options.windDataTime = time;
  this.getJSON(((this.options.windDataUrl) + "/" + (this.options.windDataTime) + ".json"), function (windDataInfo) {
    me.windDataInfo =windDataInfo;
    var windImage = new Image();
    me.windDataInfo.image = windImage;
    windImage.src = (me.options.windDataUrl) + "/" + (me.options.windDataTime) + ".png";
    windImage.onload = function () {
      me.wind.setWind(me.windDataInfo);
    };
  });
};
windCanvasLayer.prototype.getMaskData = function getMaskData () {
    var this$1 = this;

  this.getJSON(this.maskUrl,function (data) {
    this$1.maskData =data;
  });
};
windCanvasLayer.prototype.drawMask = function drawMask () {
        var this$1 = this;

      var data = this.maskData;
      var ctx = this.maskCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.maskCanvas.width, this.maskCanvas.height);
      ctx.fillStyle = "rgba(0,0,0,0";
      ctx.fillRect(0, 0, this.maskCanvas.width, this.maskCanvas.height);
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.beginPath();

      for (var i = 0; i < data.features.length; i++) {

          var lines = data.features[i].geometry.coordinates;
          if(data.features[i].geometry.type === "MultiPolygon")
            { lines = data.features[i].geometry.coordinates[0]; }
          lines.forEach(function (line) {
            for (var j = 0; j < line.length; j++) {
              var x = (line[j][0] + 180) / 360;
              var y = this$1.latY(line[j][1]);
              var bbox = this$1.wind.mercBBox;
              ctx[j ? 'lineTo' : 'moveTo'](
                  (x - bbox[0]) / (bbox[2] - bbox[0]) * this$1.maskCanvas.width,
                  ((bbox[3] - bbox[1]) - y + (1 - bbox[3])) / (bbox[3] - bbox[1]) * this$1.maskCanvas.height);
          }
        });
      }
      ctx.fill();
      this.wind.setMaskTexture(this.maskCanvas);

};
windCanvasLayer.prototype.updateRetina = function updateRetina () {
  var ratio = this.meta['retina resolution'] ? this.pxRatio : 1;
  this._canvas.width = this._canvas.clientWidth * ratio;
  this._canvas.height = this._canvas.clientHeight * ratio;
  this.wind.resize();
};
windCanvasLayer.prototype.bounds2bbox = function bounds2bbox (bounds) {
  var bboxArray = bounds.toArray();
  var xrange = this.extent[2] - this.extent[0];
  var yrange = this.extent[3] - this.extent[1];
  var xmin = (bboxArray[0][0] + 180) / 360;
  var xmax = (bboxArray[1][0] + 180) / 360;
  var ymin = (bboxArray[0][1] + 90) / 180;
  var ymax = (bboxArray[1][1] + 90) / 180;
  return [xmin, ymin, xmax, ymax]
};
windCanvasLayer.prototype.bounds2Extent = function bounds2Extent (bounds) {
  var bboxArray = bounds.toArray();
  var xmin = bboxArray[0][0];
  var xmax = bboxArray[1][0];
  var ymin = bboxArray[0][1];
  var ymax = bboxArray[1][1];
  return [xmin, ymin, xmax, ymax]
};
windCanvasLayer.prototype.updateZoom = function updateZoom () {
  var box = this.bounds2bbox(this._map.getBounds());
  this.wind.setBBox(box);
  this.wind.setMaskTexture(this.maskCanvas);
  this.drawMask();
  this.wind.resize();
  // todo map rotateTo
  // this.wind.matrix = matrix;
};
windCanvasLayer.prototype.latY = function latY (lat) {
  var sin = Math.sin(lat * Math.PI / 180),
      y = (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);
  return y < 0 ? 0 :
         y > 1 ? 1 : y;
};
windCanvasLayer.prototype.stop = function stop () {
  if (this.requestId) {
    window.cancelAnimationFrame(this.requestId);
    this.requestId = undefined;
  }
};
windCanvasLayer.prototype.start = function start () {
  this.requestId = requestAnimationFrame(this.frame.bind(this));
};
windCanvasLayer.prototype.moveEvent = function moveEvent () {
  this.stop();
  this.updateZoom();
  this.wind.draw();
};
windCanvasLayer.prototype.moveendEvent = function moveendEvent () {

  this.updateZoom();
  this.start();
};
windCanvasLayer.prototype.resizeEvent = function resizeEvent () {

};
windCanvasLayer.prototype.remove = function remove () {
  window.cancelAnimationFrame(this.requestId);
  this._map.off('move', this.mapMoveEvent);
  this._map.off('moveend', this.mapMoveEndEvent);
  this._map.off('resize', this.mapResizeEvent);
  this._canvas.parentNode.removeChild(this._canvas);
};

return windCanvasLayer;

})));
