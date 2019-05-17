import base from "@egova/map-base";
import { Point, Geometry, Polyline, MapSpatial, Polygon } from "./map.model";

export class CanvasLayer implements base.ICanvasLayer {
    public isShow: boolean = false;
    public options: any;
    public items: Array<any> = [];

    public get geometrys(): Array<Geometry> {
        return this.items.map(g => {
            let model = this.onChangeStandardModel(g);
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
        }).filter(g => g !== null);
    }

    public constructor(public mapView: base.MapView, public id: string, options: any) {
        this.options = {
            type: "point",
            symbol: {
                "layout": {
                    "icon-image": "event-app-1000-18",//说明：eventtype为pbf或jeojson数据中的属性字段，sprite图标库中存在类似event-app-1000-18、event-app-1001-18这样的图标名称，其中1000或1001为对应数据中eventtype的值
                    "text-field": "{id}",
                    "text-offset": [0, 0.6],
                    "text-anchor": "top",
                    "icon-allow-overlap": true,  //图标允许压盖
                    "text-allow-overlap": true,   //图标覆盖文字允许压盖
                },
                "paint": {
                    "text-color":'#333333'
                }
            }
            , ...options
        };
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
        this.mapView.innerMap.setLayoutProperty(this.id, 'visibility', true);
    }

    public hide(): void {
        this.isShow = false;
        this.mapView.innerMap.setLayoutProperty(this.id, 'visibility', false);
    }

    public showDataList(data: Array<any>): void {
        this.items = data;
        if (this.geometrys.length <= 0) {
            this.clear();
            return;
        }
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

    }

    public onChangeStandardModel(g: any): any {
        let node = this.options.changeStandardModel(g);
        return node;
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
