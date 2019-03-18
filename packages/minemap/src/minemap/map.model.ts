import base from "@egova/map-base";
import { IGraphicsLayer } from "./graphics.layer";

/**
 * 几何对象
 */
export abstract class Geometry {
    public attributes: any;

    public constructor(public type: string, public spatial: MapSpatial) {}

    public abstract toJson(): any;
}
/**
 * 线
 */
export class Polyline extends Geometry {
    public path: Array<Array<number>> = [];
    public constructor(spatial: MapSpatial = MapSpatial.EMPATY) {
        super("Polyline", spatial);
    }

    public getPoint(pointIndex: number) {
        return this.path[pointIndex];
    }

    public insertPoint(pointIndex: number, point: Array<number>) {
        this.path.splice(pointIndex, 0, point);
    }

    public removePoint(pointIndex: number) {
        this.path.splice(pointIndex, 1);
    }

    public toJson() {
        return {
            type: "geojson",
            data: {
                type: "Feature",
                properties: this.attributes || {},
                geometry: {
                    type: "LineString",
                    coordinates: this.path
                }
            }
        };
    }
}
/**
 * 面
 */
export class Polygon extends Geometry {
    public rings: Array<Array<Array<number>>> = [];
    public constructor(spatial: MapSpatial = MapSpatial.EMPATY) {
        super("Line", spatial);
    }

    public addRing(path: Array<Array<number>>) {
        this.rings.push(path);
    }

    public removeRing(ringIndex: number) {
        if (ringIndex > this.rings.length) {
            throw new Error("数组越界");
        }
        this.rings = this.rings.splice(ringIndex, 1);
    }

    public getPoint(ringIndex: number, pointIndex: number) {
        if (ringIndex > this.rings.length) {
            throw new Error("数组越界");
        }
        return this.rings[ringIndex][pointIndex];
    }

    public insertPoint(
        ringIndex: number,
        pointIndex: number,
        point: Array<number>
    ) {
        if (ringIndex > this.rings.length) {
            throw new Error("数组越界");
        }
        this.rings[ringIndex].splice(pointIndex, 0, point);
    }

    public removePoint(ringIndex: number, pointIndex: number) {
        if (ringIndex > this.rings.length) {
            throw new Error("数组越界");
        }
        this.rings[ringIndex].splice(pointIndex, 1);
    }

    /**
     * 判断点是否在圆里面
     * @param point 点
     */
    public inside(point: Array<any>) {
        let x = point[0],
            y = point[1];
        let vs = this.rings[0];

        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i][0],
                yi = vs[i][1];
            let xj = vs[j][0],
                yj = vs[j][1];

            let intersect =
                yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    }

    public toJson() {
        return {
            type: "geojson",
            data: {
                type: "Feature",
                properties: this.attributes || {},
                geometry: {
                    type: "Polygon",
                    coordinates: this.rings
                }
            }
        };
    }
}

/**
 * 圆
 */
export class Circle extends Geometry {
    public center: Array<number> = [];
    public radius: number;

    public constructor(spatial: MapSpatial = MapSpatial.EMPATY) {
        super("Circle", spatial);
    }

    public toJson() {
        return {
            type: "geojson",
            data: {
                type: "Feature",
                properties: this.attributes || {
                    radius: this.radius
                },
                geometry: {
                    type: "Point",
                    coordinates: this.center
                }
            }
        };
    }

    /**
     * 判断点是否在圆里面
     * @param point 点
     */
    public inside(point: Array<any>) {
        let from = new Point(this.center[0], this.center[1], new MapSpatial(0));
        let to = new Point(point[0], point[1], new MapSpatial(0));
        const units = "meters";
        let distance = base.MapUtils.getLength(from, to, units);
        return distance <= this.radius;

        // let offsetX = point[0] - this.center[0];
        // let offsetY = point[1] - this.center[1];
        // let offsetR = (1 / 2) * Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        // let x = Math.sin(offsetX / offsetR) * this.radius;
        // let y = Math.sin(offsetY / offsetR) * this.radius;

        // if (offsetX * (x - point[0]) < 0) return false;
        // if (offsetY * (y - point[1]) < 0) return false;
        // return true;
    }
}

/**
 * 坐标点
 */
export class Point extends Geometry {
    public constructor(
        public x: number,
        public y: number,
        public spatial: MapSpatial = MapSpatial.EMPATY
    ) {
        super("Point", spatial);
    }

    public toJson() {
        return {
            type: "Feature",
            properties: this.attributes || {},
            geometry: {
                type: "Point",
                coordinates: [this.x, this.y]
            }
        };
    }
}

/**
 * 空间投影
 */
export class MapSpatial {
    public static EMPATY: MapSpatial = new MapSpatial(0);

    public constructor(public wkid: number) {}
}

export interface IGraphic extends base.Graphic {
    id: string;

    attributes: any;

    isShow: boolean;

    isInsided: boolean;

    kind: string;

    layer: IGraphicsLayer;

    show(): void;

    hide(): void;

    remove(): void;

    delete(): void;

    setSymbol(symbol: any): void;

    setGeometry(geometry: Geometry): void;

    addTo(map: any): void;
}

/**
 * 面
 */
export class PolygonGraphic extends base.EventProvider implements IGraphic {
    private _geometry: Polygon;
    private _isInsided: boolean;
    public id: string;
    public attributes: any = {};
    public isShow: boolean;

    public symbol: any;
    public kind: string = "polygon";
    public polygon: any;

    public layer: IGraphicsLayer;

    public get isInsided() {
        return this._isInsided;
    }

    public constructor(options: any) {
        super(null);
        this.id = options.id;
        this.attributes = { ...this.attributes, ...options.attributes };
        this.symbol = options.symbol;
        this.polygon = new minemap.Polygon(options.path, this.symbol);
        this._geometry = new Polygon();
        this._geometry.addRing(options.path);
    }

    public show(): void {
        if (!this.layer) {
            throw new base.Exception(
                "该要素没有添加到图层上，若想显示该要素请调用addToMap方法"
            );
        }
        this.polygon.addTo(this.layer.map);
        this.isShow = false;
    }
    public hide(): void {
        this.polygon.remove();
        this.isShow = false;
    }
    public remove(): void {
        if (this._isInsided) {
            this.polygon.remove();
            this._isInsided = false;
        }
    }
    public delete(): void {
        if (this._isInsided) {
            this.polygon.remove();
            this._isInsided = false;
        }
        if (this.layer) {
            this.layer.remove(this);
        }
    }
    public setSymbol(symbol: any): void {
        this.symbol = symbol;
        if (this.symbol && this.symbol.strokeColor) {
            this.polygon.setStrokeColor(this.symbol.strokeColor);
        }
        if (this.symbol && this.symbol.fillOpacity) {
            this.polygon.setFillOpacity(this.symbol.fillOpacity);
        }
        if (this.symbol && this.symbol.strokeOpacity) {
            this.polygon.setStrokeOpacity(this.symbol.strokeOpacity);
        }
        if (this.symbol && this.symbol.strokeDashArray) {
            this.polygon.setStrokeDashArray(this.symbol.strokeDashArray);
        }
        if (this.symbol && this.symbol.ay) {
            this.polygon.ay(this.symbol.ay);
        }
    }
    public setGeometry(geometry: Polygon): void {
        this._geometry = geometry;
        if (geometry.rings.length > 0) {
            this.polygon.setPath(geometry.rings[0]);
        } else {
            this.polygon.setPath([]);
        }
    }

    public get geometry() {
        return this._geometry;
    }

    public addTo(map: any): void {
        this._isInsided = true;
        this.polygon.addTo(map);
    }

    public setAngle(_angle: number) {
        throw new base.Exception("未实现setAngle方法");
    }
}

/**
 * 线
 */
export class PolylineGraphic extends base.EventProvider implements IGraphic {
    private _geometry: Polyline;
    private _isInsided: boolean;
    public id: string;
    public attributes: any = {};
    public isShow: boolean;

    public symbol: any;
    public kind: string = "polyline";
    public polyline: any;

    public layer: IGraphicsLayer;

    public get isInsided() {
        return this._isInsided;
    }

    public constructor(layer: IGraphicsLayer, options: any) {
        super(null);
        this.layer = layer;
        this.id = options.id;
        this.attributes = { ...this.attributes, ...options.attributes };
        this.symbol = options.symbol;
        if (options.geometry) {
            this._geometry = options.geometry;
        } else {
            this._geometry = new Polyline(new MapSpatial(0));
        }
        let path = this._geometry.path;
        if (options.path) {
            path = options.path;
        }

        this.polyline = new minemap.Polyline(path, this.symbol);
        this._geometry.path = path;
    }

    public show(): void {
        if (!this.layer) {
            throw new base.Exception(
                "该要素没有添加到图层上，若想显示该要素请调用addToMap方法"
            );
        }
        this.polyline.addTo(this.layer.map);
        this.isShow = false;
    }
    public hide(): void {
        this.polyline.remove();
        this.isShow = false;
    }
    public remove(): void {
        if (this._isInsided) {
            this.polyline.remove();
            this._isInsided = false;
        }
    }
    public delete(): void {
        if (this._isInsided) {
            this.polyline.remove();
            this._isInsided = false;
        }
        if (this.layer) {
            this.layer.remove(this);
        }
    }
    public setSymbol(symbol: any): void {
        this.symbol = symbol;
        if (this.symbol && this.symbol.strokeColor) {
            this.polyline.setStrokeColor(this.symbol.strokeColor);
        }
        if (this.symbol && this.symbol.opacity) {
            this.polyline.setOpacity(this.symbol.opacity);
        }
        if (this.symbol && this.symbol.strokeDashArray) {
            this.polyline.setStrokeDashArray(this.symbol.strokeDashArray);
        }
    }
    public setGeometry(geometry: Polyline): void {
        this._geometry = geometry;
        this.polyline.setPath(geometry.path);
    }

    public get geometry() {
        return this._geometry;
    }

    public addTo(map: any): void {
        this._isInsided = true;
        this.polyline.addTo(map);
    }

    public setAngle(_angle: number) {
        throw new base.Exception("未实现setAngle方法");
    }
}

class Icon {
    public element: any;
    public constructor(public id: string, public options: any) {
        if (!options.imageSize) {
            options.imageSize = [0, 0];
        }
        if (!options.imageOffset) {
            options.imageOffset = [0, 0];
        }
        this.element = this.createIconElement(id, options);
    }

    public createIconElement(id: string, iconOption: any) {
        let el = document.createElement("div");
        el.id = "marker" + id;
        el.style.backgroundImage = "url('" + iconOption.imageUrl + "')";
        el.style.backgroundSize = "cover";
        el.style.width = iconOption.imageSize
            ? iconOption.imageSize[0]
            : 0 + "px";
        el.style.height = iconOption.imageSize
            ? iconOption.imageSize[1]
            : 0 + "px";
        el.style.borderRadius = "50%";
        el.style.cursor = "pointer";
        return el;
    }

    public setImageUrl(url: string): void {
        this.element.style["background-image"] = "url('" + url + "')";
    }

    public setOptions(options: any) {
        if (options.imageUrl) {
            this.element.style["background-image"] =
                "url('" + options.imageUrl + "')";
        }

        if (options.imageSize) {
            this.element.style.width = options.imageSize[0] + "px";
            this.element.style.height = options.imageSize[1] + "px";
        }
        this.element.style["border-radius"] = "50%";
        this.element.style.cursor = "pointer";
    }
}

export class PointGraphic extends base.EventProvider implements IGraphic {
    private _kind: string = "point";
    /**
     * 是否在地图上
     */
    private _isInsided: boolean = false;
    private _geometry: Point;

    public id: string;
    public isShow: boolean = true;
    public symbol: any;

    public marker: any;
    public element: any;
    public icon: any;

    public attributes: any;

    public layer: IGraphicsLayer;

    public constructor(options: any) {
        super();
        this.id = options.id;

        this.symbol = {
            ...{ imageSize: [0, 0], imageOffset: [0, 0] },
            ...options.symbol
        };
        this.attributes = options.attributes ? options.attributes : {};
        this.icon = options.icon;

        if (!this.icon) {
            if (minemap.Icon) {
                this.icon = new minemap.Icon({
                    imageUrl: this.symbol.imageUrl,
                    imageSize: this.symbol.imageSize
                });
                this.marker = new minemap.Marker(this.icon, {
                    offset: this.symbol.imageOffset
                });
            } else {
                this.icon = new Icon(this.id, {
                    imageUrl: this.symbol.imageUrl,
                    imageSize: this.symbol.imageSize
                });
                this.marker = new minemap.Marker(this.icon.element, {
                    offset: this.symbol.imageOffset
                });
            }
        }

        this.element = this.marker.getElement();
        if (options.point) {
            this.geometry = new Point(
                options.point.x,
                options.point.y,
                options.point.spatial
            );
        }
        if (options.geometry) {
            this.geometry = options.geometry;
        }
        if (options && options.className) {
            this.addClass(options.className);
            this.symbol.className = "";
        }
        if (options.symbol && options.symbol.className) {
            this.addClass(options.symbol.className);
            this.symbol.className = "";
        }
    }

    public addClass(className: string) {
        this.symbol.className = className;
        if (
            className === " " ||
            className === null ||
            className === undefined
        ) {
            return;
        }
        let classList = className.split(" ");
        for (let i = 0; i < classList.length; i++) {
            this.marker.getElement().classList.add(classList[i]);
        }
    }

    public removeClass(className: string) {
        if (
            className === " " ||
            className === null ||
            className === undefined
        ) {
            return;
        }
        let classList = className.split(" ");
        for (let i = 0; i < classList.length; i++) {
            this.marker.getElement().classList.remove(classList[i]);
        }
    }

    /**
     * 复制节点
     * @param id 元素ID
     */
    public clone(id: string) {
        let m = new PointGraphic({
            id: id,
            symbol: this.symbol,
            attributes: this.attributes,
            point: this.geometry
        });
        return m;
    }

    public get kind() {
        return this._kind;
    }

    public get isInsided() {
        return this._isInsided;
    }

    /**
     * 为指定的事件类型注册一个侦听器，以使侦听器能够接收事件通知。
     * @summary 如果不再需要某个事件侦听器，可调用 removeListener() 删除它，否则会产生内存问题。
     * 由于垃圾回收器不会删除仍包含引用的对象，因此不会从内存中自动删除使用已注册事件侦听器的对象。
     * @param  {string} type 事件类型。
     * @param  {Function} 处理事件的侦听器函数。
     * @param  {any} scope? 侦听函数绑定的 this 对象。
     * @param  {boolean} once? 是否添加仅回调一次的事件侦听器，如果此参数设为 true 则在第一次回调时就自动移除监听。
     * @returns void
     */
    public on(
        type: string,
        listener: Function,
        scope: any = this,
        once: boolean = false
    ): void {
        this.addListener(type, listener, scope, once);
    }

    /**
     * 移除侦听器。如果没有注册任何匹配的侦听器，则对此方法的调用没有任何效果。
     * @param  {string} type 事件类型。
     * @param  {Function} listener 处理事件的侦听器函数。
     * @param  {any} scope? 侦听函数绑定的 this 对象。
     * @returns void
     */
    public off(type: string, listener: Function, scope: any = this): void {
        this.removeListener(type, listener, scope);
    }

    public show(): void {
        if (!this.layer) {
            throw new base.Exception(
                "该要素没有添加到图层上，若想显示该要素请调用addToMap方法"
            );
        }
        // this.marker.addTo(this.layer.map);
        this.addTo(this.layer.map);
        this.isShow = true;
    }

    public hide(): void {
        this.marker.remove();
        this.isShow = false;
    }

    public remove(): void {
        if (this._isInsided) {
            this.marker.remove();
            this._isInsided = false;
        }
    }

    public delete(): void {
        if (this._isInsided) {
            this.marker.remove();
            this._isInsided = false;
        }
        if (this.layer) {
            this.layer.remove(this);
        }
    }

    public setAngle(angle: number) {
        this.marker.getElement().style.transform = `rotate(${angle}deg)`;
        this.marker.getElement().style["-ms-transform"] = `rotate(${angle}deg)`;
        this.marker.getElement().style[
            "-moz-transform"
        ] = `rotate(${angle}deg)`;
        this.marker.getElement().style[
            "-webkit-transform"
        ] = `rotate(${angle}deg)`;
        this.marker.getElement().style["-o-transform"] = `rotate(${angle}deg)`;

        let routeCar = this.marker
            .getElement()
            .querySelector(".graphic-moving .minemap-icon");
        if (routeCar) {
            routeCar.style.transform = `rotate(${angle}deg)`;
        }
    }

    public setSymbol(symbol: any): void {
        if (symbol.className) {
            // 先删除之前的样式
            if (this.symbol && this.symbol.className) {
                this.removeClass(this.symbol.className);
            }
            this.addClass(symbol.className);
        }
        // if (symbol.icon) {
        //     this.marker.setIcon(symbol.icon);
        // }
        if (symbol.imageUrl) {
            this.icon.setImageUrl(symbol.imageUrl);
        }
        if (symbol.title) {
            this.marker.setTitle(symbol.title);
        }
        if (symbol.titleFontSize) {
            this.marker.setTitleFontSize(symbol.titleFontSize);
        }
        if (symbol.titleColor) {
            this.marker.setTitleColor(symbol.titleColor);
        }
        if (symbol.titleColor) {
            this.marker.setTitleColor(symbol.titleColor);
        }
        if (symbol.titlePosition) {
            this.marker.setTitlePosition(symbol.titlePosition);
        }
        this.symbol = { ...this.symbol, ...symbol };
    }

    public draw(): void {
        console.log("draw");
    }

    public get geometry(): Point {
        return this._geometry;
    }

    public set geometry(geometry: Point) {
        this._geometry = geometry;
        this.marker.setLngLat([geometry.x, geometry.y]);
    }

    public setGeometry(value: Geometry): void {
        if (value instanceof Point) {
            this.geometry = <Point>value;
        } else {
            throw new Error("不匹配类型");
        }
    }

    public addTo(map: any) {
        this._isInsided = true;
        this.marker.addTo(map);

        this.marker.on("mouseover", (args: any) => {
            console.log("fire marker onMouseOver");
            this.fireEvent("onMouseOver", {
                graphic: this,
                mapPoint: this.geometry,
                orgion: args
            });
        });

        this.marker.on("mouseout", (args: any) => {
            console.log("fire marker onMouseOut");
            this.fireEvent("onMouseOut", {
                graphic: this,
                mapPoint: this.geometry,
                orgion: args
            });
        });

        this.marker.on("mouseup", (args: any) => {
            console.log("fire marker onMouseUp");
            this.fireEvent("onMouseUp", {
                graphic: this,
                mapPoint: this.geometry,
                orgion: args
            });
        });

        this.marker.on("mousedown", (args: any) => {
            console.log("fire marker onMouseDown");
            this.fireEvent("onMouseDown", {
                graphic: this,
                mapPoint: this.geometry,
                orgion: args
            });
        });

        this.marker.on("dblclick", (args: any) => {
            console.log("fire marker onClick");
            this.fireEvent("onDblClick", {
                graphic: this,
                mapPoint: this.geometry,
                orgion: args
            });
        });
        this.marker.on("click", (args: any) => {
            console.log("fire marker onClick");
            this.fireEvent("onClick", {
                graphic: this,
                mapPoint: this.geometry,
                orgion: args
            });
        });
    }

    protected fireEvent(type: string, data?: any): void {
        this.dispatchEvent(type, data);
        if (this.layer) {
            this.layer.dispatchEvent(type, data);
        }
    }

    public static getStandardSymbol(
        options: any
    ): {
        imageUrl: string;
        imageSize: Array<number>;
        imageOffset: Array<number>;
        className: string;
    } {
        let imageSize = [20, 28];
        let imageOffset = [-imageSize[0] / 2, -imageSize[1] / 2];
        let markerUrl = null;
        let markerClassName = null;
        if (options.symbol) {
            markerClassName = options.symbol.className || "graphic-point";
            markerUrl = options.symbol.imageUrl || options.symbol.image;
            if (options.symbol.size) {
                if (options.symbol.size instanceof Array) {
                    imageSize = options.symbol.size;
                } else {
                    imageSize[0] = options.symbol.size.width;
                    imageSize[1] = options.symbol.size.height;
                }
            } else if (
                options.symbol.width !== undefined &&
                options.symbol.height !== undefined
            ) {
                imageSize[0] = options.symbol.width;
                imageSize[1] = options.symbol.height;
            }
            if (options.symbol.offset) {
                if (options.symbol.offset instanceof Array) {
                    imageOffset = options.symbol.offset;
                } else if (
                    options.offset.x !== undefined &&
                    options.offset.y !== undefined
                ) {
                    imageOffset[0] = options.symbol.offset.x;
                    imageOffset[1] = options.symbol.offset.y;
                }
            }
        }
        return {
            imageUrl: markerUrl,
            imageSize: imageSize,
            imageOffset: imageOffset,
            className: markerClassName
        };
    }
}

/**
 * 文本
 */
export class LabelGraphic extends base.EventProvider implements IGraphic {
    private _geometry: Point;
    private _isInsided: boolean;
    public id: string;
    public attributes: any;
    public isShow: boolean;

    public symbol: any;
    public kind: string = "label";
    public label: any;

    public layer: IGraphicsLayer;

    public get isInsided() {
        return this._isInsided;
    }

    public constructor(options: any) {
        super(null);
        this.id = options.id;
        this.attributes = options.attributes;
        this.symbol = options.symbol;
        if (options.point) {
            this._geometry = new Point(options.point.x, options.point.y);
        }
        if (options.geometry) {
            this._geometry = options.geometry;
        }
        this.label = new minemap.Symbol(
            [this._geometry.x, this._geometry.y],
            options.symbol
        );
    }

    public get geometry(): Point {
        return this._geometry;
    }

    public set geometry(geometry: Point) {
        this._geometry = geometry;
        this.label.setPoint([geometry.x, geometry.y]);
    }

    public show(): void {
        if (!this.layer) {
            throw new base.Exception(
                "该要素没有添加到图层上，若想显示该要素请调用addToMap方法"
            );
        }
        this.label.addTo(this.layer.map);
        this.isShow = false;
    }
    public hide(): void {
        this.label.remove();
        this.isShow = false;
    }
    public remove(): void {
        if (this._isInsided) {
            this.label.remove();
            this._isInsided = false;
        }
    }
    public delete(): void {
        if (this._isInsided) {
            this.label.remove();
            this._isInsided = false;
        }
        if (this.layer) {
            this.layer.remove(this);
        }
    }
    public setSymbol(symbol: any): void {
        this.symbol = symbol;
        if (this.symbol && this.symbol.textColor) {
            this.label.setTextColor(this.symbol.textColor);
        }
        if (this.symbol && this.symbol.textOffset) {
            this.label.setTextOffset(this.symbol.textOffset);
        }
        if (this.symbol && this.symbol.text) {
            this.label.setText(this.symbol.text);
        }
        if (this.symbol && this.symbol.icon) {
            this.label.setIcon(this.symbol.icon);
        }
        if (this.symbol && this.symbol.symbolSize) {
            this.label.setSymbolSize(this.symbol.symbolSize);
        }
        if (this.symbol && this.symbol.opacity) {
            this.label.setOpacity(this.symbol.opacity);
        }
    }
    public setGeometry(geometry: Point): void {
        this._geometry = geometry;
        this.label.setPoint([geometry.x, geometry.y]);
    }
    public addTo(map: any): void {
        this._isInsided = true;
        this.label.addTo(map);
    }

    public setAngle(_angle: number) {
        throw new base.Exception("未实现setAngle方法");
    }
}
