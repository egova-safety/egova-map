import base from "@egova/map-base";
import { Point, Geometry, Polyline, MapSpatial, Polygon } from "./map.model";
export const MINEMAP_GEOJSON_LAYER_OPTIONS: any = {
    type: "point",
    symbol: {
        "layout": {
            "icon-image": "{image}",//说明：eventtype为pbf或jeojson数据中的属性字段，sprite图标库中存在类似event-app-1000-18、event-app-1001-18这样的图标名称，其中1000或1001为对应数据中eventtype的值
            // "text-field": "{name}",
            "text-offset": [0, 0],
            "text-anchor": "top",
            "icon-allow-overlap": true,   // 图标允许压盖
            "text-allow-overlap": true,   // 图标覆盖文字允许压盖
        },
        "paint": {
            "text-color": '#333333'
        }
    }
};

export class GeojsonLayer extends base.GeojsonLayer {
    public isShow: boolean = false;
    public options: any;
    public items: Array<any> = [];

    public get geometrys(): Array<Geometry> {
        return this.items.map(g => this.createGeometry(g)).filter(g => g !== null);
    }

    public constructor(public mapView: base.MapView, public id: string, options: any) {

        super(mapView, id, {
            ...MINEMAP_GEOJSON_LAYER_OPTIONS,
            ...options
        });
        this.mapView.innerMap.on('mousemove', (e: any) => {
            var features = this.mapView.innerMap.queryRenderedFeatures(e.point, { layers: [this.id] });
            this.mapView.innerMap.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        });

        this.mapView.innerMap.on('click', (e: any) => {
            var features = this.mapView.innerMap.queryRenderedFeatures(e.point, { layers: [this.id] });

            if (!features.length) {
                return;
            }

            var feature = features[0];

            if (feature.layer.id == this.id) {
                this.dispatchEvent("onClick", {
                    origin: e,
                    mapPoint: e.point,
                    graphic: {
                        attributes: feature.properties,
                        geometry: this.createGeometry(feature.properties)
                    }
                });
            }
        });
    }

    public appendTo(_map: any): void {
        // throw new Error("Method not implemented.");
    }

    public removeLayer(_map: any): void {
        if (_map.getSource(this.id + "_source")) {
            _map.removeSource(this.id + "_source");
        }
        if (_map.getLayer(this.id)) {
            _map.removeLayer(this.id);
        }
        // throw new Error("Method not implemented.");
    }


    public clear(): void {
        this.removeLayer(this.mapView.innerMap);
    }

    public show(): void {
        this.isShow = true;
        this.mapView.innerMap.setLayoutProperty(this.id, 'visibility', "visible");
        this.options.onVisibleChanged(this.isShow);
    }

    public hide(): void {
        this.isShow = false;
        this.mapView.innerMap.setLayoutProperty(this.id, 'visibility', "none");
        this.options.onVisibleChanged(this.isShow);
    }

    public loadImage(img: { name: string, url: string, value: any }): Promise<void> {
        return new Promise((resolve, reject) => {

            if (img.value) {
                this.mapView.innerMap.addImage(img.name, img.value);
                resolve()
            }
            if (img.url) {
                this.mapView.innerMap.loadImage(img.url, (error: any, image: any) => {
                    if (error) {
                        reject(error)
                    };
                    img.value = image;
                    this.mapView.innerMap.addImage(img.name, image);
                    resolve()
                });
            }
        });
    }

    public loadImages(): Promise<void> {
        this.options.images = (<any>this.options).getImages();
        return new Promise((resolve, reject) => {
            if (!this.options.images) {
                resolve()
            }
            Promise.all(this.options.images.map((img: any) => this.loadImage(img))).then(() => {
                resolve()
            }).catch(err => {
                reject(err)
            })
        });
    }

    public showDataList(data: Array<any>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.items = (data || []).map(g => this.onChangeStandardModel(g));
            if (this.geometrys.length <= 0) {
                this.clear();
                resolve();
                return;
            }
            this.loadImages().then(() => {
                this.mapView.innerMap.addSource(this.id + "_source", {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": this.geometrys.map(g => g.toJson())
                    }
                });
                this.mapView.innerMap.addLayer({
                    "id": this.id,
                    "type": "symbol",
                    "source": this.id + "_source",
                    ...this.options.symbol
                });
                resolve();
            }).catch(err=>{
                reject(err)
            })
        })
    }

    public onChangeStandardModel(g: any): any {
        let node = this.options.changeStandardModel(g);
        if (!node.image) {
            node.image = "point"
        }
        return node;
    }

    public createGeometry(model: any): Geometry {
        if (model) {
            if (this.options.type === "point") {
                return this.createPoint(model);
            } else if (this.options.type === "polyline") {
                return this.createPolyline(model);
            }
            else if (this.options.type === "polygon") {
                return this.createPolygon(model);
            } else {
                throw new Error("不支持的类型");
            }

        }
        return null;
    }

    public createPolygon(model: any): Polygon {
        let polygon = new Polygon();
        const line: Array<any> = [];
        let arr = model.polyline + "".split(";");
        for (let i = 0; i < arr.length - 1; i++) {
            const xy = arr[i];
            if (xy) {
                let lat_lon = xy.split(",");
                let point = <Point>this.mapView.onToPoint({
                    latitude: lat_lon[0],
                    longitude: lat_lon[1]
                });

                line.push([point.x, point.y]);
            }
        }
        polygon.addRing(line);
        return polygon;
    }

    public createPoint(model: any): Point {
        let point = <Point>this.mapView.onToPoint(model);
        point.attributes = model;
        return point;
    }

    public createPolyline(model: any): Polyline {
        const polyline = new Polyline(new MapSpatial(0));
        const line: Array<any> = [];
        let arr = model.polyline + "".split(";");
        for (let i = 0; i < arr.length - 1; i++) {
            const xy = arr[i];
            if (xy) {
                let lat_lon = xy.split(",");
                let point = <Point>this.mapView.onToPoint({
                    latitude: lat_lon[0],
                    longitude: lat_lon[1]
                });

                line.push([point.x, point.y]);
            }
        }
        polyline.path = line;
        polyline.attributes = model;
        return polyline;
    }


}
