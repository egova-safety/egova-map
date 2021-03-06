import base from "@egova/map-base";
import { GroupLayer } from "./group.layer";

export class RouteLayer extends base.RouteLayer {
    public moveLineLayer: base.GroupLayer;
    public moveMarkLayer: base.GroupLayer;
    public trackLines: Array<base.TrackLine> = [];

    public onSetSegmentByLine(options: any, segment: base.TrackSegment) {
        segment.polyline = options.polyline;
        segment.length = options.length;
        if (segment.polyline.paths && segment.polyline.paths.length > 0) {
            // 每公里抽取的点数
            let numsOfKilometer = segment.options.numsOfKilometer
                ? segment.options.numsOfKilometer
                : 100;

            segment.line = base.MapUtils.vacuate(
                segment.polyline.paths,
                segment.length!,
                numsOfKilometer
            );
        } else {
            segment.line = [];
        }
    }

    public onSetSegmentByPoint(options: any, segment: base.TrackSegment) {
        let points = options.points;
        let numsOfKilometer = segment.options.numsOfKilometer
            ? segment.options.numsOfKilometer
            : 100;
        const polyline = new esri.geometry.Polyline(this.mapView.spatial);
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i],
                end = points[i + 1];
            const tmppolyline = new esri.geometry.Polyline(
                this.mapView.spatial
            ).addPath([start, end]);
            const length = esri.geometry.geodesicLengths(
                [tmppolyline],
                esri.Units.KILOMETERS
            )[0];
            const tmppoints = base.MapUtils.extractPoints(
                start,
                end,
                length * numsOfKilometer
            );
            polyline.addPath(tmppoints);
        }
        segment.length = esri.geometry.geodesicLengths(
            [polyline],
            esri.Units.KILOMETERS
        )[0];
        segment.polyline = polyline;
        segment.line = base.MapUtils.vacuate(
            segment.polyline.paths,
            segment.length!,
            numsOfKilometer
        );
    }

    public onShowSegmentLine(segment: base.TrackSegment) {
        let playedLineSymbol = new esri.symbol.CartographicLineSymbol(
            esri.symbol.CartographicLineSymbol.STYLE_SOLID,
            new esri.Color([48, 254, 62, 0.8]),
            4,
            esri.symbol.CartographicLineSymbol.CAP_ROUND,
            esri.symbol.CartographicLineSymbol.JOIN_MITER,
            2
        ); // 38, 101, 196, 0.8

        segment.lineGraphic = new esri.Graphic(
            segment.polyline,
            playedLineSymbol,
            {
                __type: "segment",
                __index: segment.index,
                __line: segment.name
            }
        );
        this.moveLineLayer.addGraphic(segment.name, segment.lineGraphic);
    }

    public onCreateMoveMark(
        trackline: base.TrackLine,
        graphic: any,
        angle: number
    ) {
        let markerUrl = this.getImageUrl(trackline, angle);
        let markerHeight =
            trackline.options.symbol.height || this.options.symbol.height;
        let markerWidth =
            trackline.options.symbol.width || this.options.symbol.width;
        if (!markerUrl) {
            console.warn("轨迹移动要素图片未定义");
        }
        let symbol = new esri.symbol.PictureMarkerSymbol(
            markerUrl,
            markerHeight,
            markerWidth
        );
        let marker = new esri.Graphic(graphic.geometry, symbol, {
            __type: "point",
            __line: trackline.name
        });
        trackline.markerGraphic = marker;
        this.moveMarkLayer.addGraphic(trackline.name, marker);
    }

    /**
     * 每次位置移动线路上的要素样式变换操作
     */
    public onUpdateMoveGraphic(
        trackline: base.TrackLine,
        point: any,
        angle: number
    ) {
        if (trackline === undefined) return;
        let symbol = trackline.markerGraphic.symbol;
        let imageUrl = this.getImageUrl(trackline, angle);
        symbol.setUrl(imageUrl);
        let imageAngle = this.getImageAngle(trackline, angle);
        if (imageAngle !== null) {
            symbol.setAngle(imageAngle);
        }
        trackline.markerGraphic.setSymbol(symbol);
        trackline.markerGraphic.setGeometry(point);
        (<any>trackline.markerGraphic).draw(); // 重绘
    }

    public getImageUrl(trackline: base.TrackLine, angle: number) {
        if (this.options.getImageUrl) {
            return this.options.getImageUrl(trackline, angle);
        }
        if (trackline.options.getImageUrl) {
            return trackline.options.getImageUrl(trackline, angle);
        }
        let sx = 1;
        if (angle < 45 || angle >= 315) sx = 3; // 向东走
        if (angle >= 45 && angle < 135) sx = 4; // 向北走
        if (angle >= 135 && angle < 225) sx = 2; // 向西走
        if (angle >= 225 && angle < 315) sx = 1; // 向南走

        if (trackline.step === null) {
            trackline.step = -1;
        }
        if (trackline.direction !== sx) {
            trackline.step = 0;
        } else {
            trackline.step = (trackline.step + 1) % 4;
        }
        trackline.direction = sx;
        let name = `${trackline.direction}${trackline.step + 1}`;

        return trackline.options.symbol[`imageUrl${name}`];
    }

    public getImageAngle(trackline: base.TrackLine, angle: number) {
        if (this.options.getImageAngle) {
            return this.options.getImageAngle(trackline, angle);
        }
        if (trackline.options.getImageAngle) {
            return trackline.options.getImageAngle(trackline, angle);
        }
        return angle;
    }

    public onCreateLineLayer(id: string): base.GroupLayer {
        return new GroupLayer({ id: id });
    }

    public onCreateMovingLayer(id: string): base.GroupLayer {
        return new GroupLayer({ id: id });
    }

    public onEqualGraphic(originGraphic: any, targetGraphic: any): boolean {
        return base.MapUtils.isEqualPoint(
            originGraphic.geometry,
            targetGraphic.geometry
        );
    }

    public onGetStandardStops(name: String, stops: Array<any>): Array<any> {
        const stopGraphics = [];
        let stopSymbol = new esri.symbol.SimpleMarkerSymbol()
            .setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_CROSS)
            .setSize(15)
            .outline.setWidth(3);
        for (let i = 0; i < stops.length; i++) {
            if (stops[i] instanceof Array) {
                stopGraphics.push(
                    new esri.Graphic(
                        new esri.geometry.Point(stops[i][0], stops[i][1]),
                        stopSymbol,
                        { __type: "stop", __line: name }
                    )
                );
            } else if ((stops[i].declaredClass || "").indexOf("Point") > 0) {
                stopGraphics.push(
                    new esri.Graphic(stops[i], stopSymbol, {
                        __type: "stop",
                        __line: name
                    })
                );
            } else if ((stops[i].declaredClass || "").indexOf("Graphic") > 0) {
                stopGraphics.push(
                    new esri.Graphic(stops[i].geometry, stopSymbol, {
                        __type: "stop",
                        __model: stops[i].attributes,
                        __line: name
                    })
                );
            } else {
                stopGraphics.push(
                    new esri.Graphic(
                        this.mapView.getPoint(stops[i]),
                        stopSymbol,
                        {
                            __type: "stop",
                            __model: stops[i],
                            __line: name
                        }
                    )
                );
            }
        }
        return stopGraphics;
    }

    public onSolveByService(
        segment: base.TrackSegment,
        start: any,
        end: any,
        waypoints: Array<any>
    ): void {
        if (!this.options.routeUrl) {
            console.error("routeUrl地址为空！");
            return;
        }
        const routeTask = new esri.tasks.RouteTask(this.options.routeUrl);
        const routeParams = new esri.tasks.RouteParameters();
        routeParams.stops = new esri.tasks.FeatureSet();
        routeParams.returnRoutes = true;
        routeParams.returnDirections = true;
        routeParams.directionsLengthUnits = esri.Units.MILES;
        routeParams.outSpatialReference = this.getSpatialReferenceFormNA();

        const flagwindRoute = this;
        routeTask.on("solve-complete", function(evt: any) {
            const routeResult = evt.result.routeResults[0];
            const polyline = routeResult.route.geometry;
            const length = routeResult.directions.totalLength;
            flagwindRoute.solveComplete(
                { polyline: polyline, length: length },
                segment
            );
        });
        routeTask.on("error", function(err: any) {
            console.warn("轨迹路由服务请求异常：", err);
            flagwindRoute.errorHandler(err, segment);
        });

        // 起点
        routeParams.stops.features.push(this.cloneStopGraphic(start));

        // 途径点
        if (waypoints) {
            for (let i = 0; i < waypoints.length; i++) {
                routeParams.stops.features.push(
                    this.cloneStopGraphic(waypoints[i])
                );
            }
        }
        // 终点
        routeParams.stops.features.push(this.cloneStopGraphic(end));
        routeTask.solve(routeParams);
    }

    public onSolveByJoinPoint(segment: base.TrackSegment): void {
        const points = [];
        points.push(segment.startGraphic.geometry);

        if (segment.waypoints) {
            for (let i = 0; i < segment.waypoints.length; i++) {
                points.push(segment.waypoints[i].geometry);
            }
        }

        points.push(segment.endGraphic.geometry);
        // 当路由分析出错时，两点之间的最短路径以直线代替
        segment.setMultPoints(points);
    }

    public onAddEventListener(
        groupLayer: base.GroupLayer,
        eventName: string,
        callBack: Function
    ): void {
        groupLayer.layer.on(eventName, callBack);
    }

    public getSpatialReferenceFormNA() {
        return new esri.SpatialReference({
            wkid: this.mapView.spatial.wkid
        });
    }

    protected cloneStopGraphic(graphic: any): any {
        return new esri.Graphic(graphic.geometry, graphic.symbol, {
            __type: graphic.attributes.__type,
            __model: graphic.attributes.__model,
            __line: graphic.attributes.__line
        });
    }
}
