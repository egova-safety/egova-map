define(["esri/declare", "dojo/dom-construct", "dojo/dom-style", "esri/domUtils", "esri/layers/layer", "esri/geometry/Point", "esri/geometry/Extent"],
    function (declare, domConstruct, domStyle, domUtils, Layer, Point, Extent) {
        return declare([Layer], {
            _eventHandler: [],
            opacity: 1,
            dx: 0,
            dy: 0,
            constructor: function (option) {
                this.loaded = true;
                this.render = option.render;
                this.onLoad(this);
            },
            _setMap: function (map, parentDom) {
                this.inherited(arguments);
                this._map = map;
                this._div = domConstruct.create("div", null, parentDom);
                var css = {
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    width: map.width + "px",
                    height: map.height + "px",
                    overflow: "visible",
                    opacity: this.opacity
                }
                domStyle.set(this._div, css);
                this._onResizeHandler_connect = dojo.connect(map, "onResize", this, this._onResizeHandler);
                this._dragOrigin = {
                    x: 0,
                    y: 0
                };
                this.evaluateSuspension();
                if (this.suspended && !map.loaded) var m = dojo.connect(map, "onLoad", this, function () {
                    dojo.disconnect(m);
                    m = null;
                    this.evaluateSuspension()
                });

                this.canvas = this._createCanvas(map.width, map.height);
                this._div.appendChild(this.canvas);
                this.render();
                return this._div;
            },
            _createCanvas: function (width, height) {
                var canvas;
                canvas = document.createElement('canvas');
                canvas.style.position = 'absolute';
                canvas.style.top = 0;
                canvas.style.left = 0;
                canvas.style.pointerEvents = "none";
                canvas.width = width;
                canvas.height = height;
                return canvas;
            },
            _unsetMap: function (a, b) {
                dojo.disconnect(this._onResizeHandler_connect);
                this._disableDrawConnectors();
                domConstruct.destroy(this._div);
                this._map = this._div = null;
                this.inherited(arguments);
            },
            onSuspend: function () {
                this.inherited(arguments);
                domUtils.hide(this._div);
                this._disableDrawConnectors();
            },
            onResume: function () {
                this.inherited(arguments);
                domUtils.show(this._div);
                this._enableDrawConnectors();
            },
            _enableDrawConnectors: function () {
                if (this._map) {
                    this._eventHandler.push(dojo.connect(this._map, "onPan", this, this._onPanHandler));
                    this._eventHandler.push(dojo.connect(this._map, "onPanStart", this, this._onPanStartHandler));
                    this._eventHandler.push(dojo.connect(this._map, "onPanEnd", this, this._onPanEndHandler));
                    this._eventHandler.push(dojo.connect(this._map, "onZoomEnd", this, this.render));
                    this._eventHandler.push(dojo.connect(this._map, "onExtentChange", this, this._onExtentChangeHandler));
                    this._eventHandler.push(dojo.connect(this._map, "onClick", this, this._Handler));
                    this._eventHandler.push(dojo.connect(this._map, "onMouseDown", this, this._Handler));
                    this._eventHandler.push(dojo.connect(this._map, "onMouseUp", this, this._Handler));
                    this._eventHandler.push(dojo.connect(this._map, "onMouseMove", this, this._Handler));
                    this._eventHandler.push(dojo.connect(this._map, "onMouseOut", this, this._Handler));
                    this._eventHandler.push(dojo.connect(this._map, "onMouseOver", this, this._Handler));
                    this._eventHandler.push(dojo.connect(this._map, "onMouseDrag", this, this._Handler));
                    this._eventHandler.push(dojo.connect(this._map, "onMouseDragStart", this, this._Handler));
                    this._eventHandler.push(dojo.connect(this._map, "onMouseDragEnd", this, this._Handler));
                }
            },
            _onPanEndHandler: function (extent, delta) {
                this.isPan = false;

                domStyle.set(this._div, {
                    top: "0px",
                    left: "0px"
                });


                this.render();
            },
            _onPanStartHandler: function () {
                this.isPan = true;
                this.dx = domStyle.get(this._div, "left");
                this.dy = domStyle.get(this._div, "top");
            },
            _disableDrawConnectors: function () {
                for (var i = 0; i < this._eventHandler.length; i++) {
                    dojo.disconnect(this._eventHandler[i]);
                }
                this._eventHandler = [];
            },
            _onPanHandler: function (a, b) {
                domStyle.set(this._div, {
                    top: (this.dy + b.y) + "px",
                    left: (this.dx + b.x) + "px"
                });
            },
            _onResizeHandler: function (a, b, c) {
                domStyle.set(this._div, {
                    width: b + "px",
                    height: c + "px"
                });
                this.canvas.width = b;
                this.canvas.height = c;

            },
            _onExtentChangeHandler: function () {
                this.render();
            },
            _Handler: function () {

            }
        });
    });
