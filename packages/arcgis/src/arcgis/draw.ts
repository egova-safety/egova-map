import base from "@egova/map-base";
/**
 * 绘制图层
 */
export class Draw implements base.IDraw {
    private symbolSetting: any;
    public mapView: base.MapView;
    public draw: any;
    public mode: any;
    public options: any = {
        drawTime: 75,
        showTooltips: true,
        tolerance: 8,
        tooltipOffset: 15,
        onEvent: (eventName: string, evt: any) => {
            // console.log(eventName);
        }
    };

    public constructor(mapView: base.MapView, options?: any) {
        this.mapView = mapView;
        this.options = {
            ...base.DRAW_LAYER_OPTIONS,
            ...this.options,
            ...options
        };

        this.draw = new esri.toolbars.Draw(mapView.map, this.options);
        this.draw.on("draw-complete", (evt: any) => this.onDrawComplete(evt));
    }

    public activate(mode: string, options?: any) {
        if (this.draw && options) {
            this.setSymbol(mode, options);
        }
        if (this.draw && mode) {
            let tool = mode.toUpperCase().replace(/ /g, "_");
            this.draw.activate(esri.toolbars.Draw[tool]);
        }
    }

    public finish() {
        if (this.draw) {
            this.draw.deactivate();
        }
    }

    private setSymbol(mode: string, options: any) {
        this.symbolSetting = { ...{}, ...options };
        switch (mode) {
            case "POLYLINE":
                this.draw.setLineSymbol(this.lineSymbol);
                break;
            case "POLYGON":
                this.draw.setFillSymbol(this.fillSymbol);
                break;
            case "FREEHAND_POLYGON":
                this.draw.setFillSymbol(this.fillSymbol);
                break;
        }
    }

    private onDrawComplete(evt: any) {
        this.finish();
        this.options.onEvent("draw-complete", evt.geometry);
        this.options.onDrawCompleteEvent(evt.geometry);
    }

    private get lineSymbol() {
        let lineColor = this.symbolSetting.lineColor || [255, 0, 0];
        let lineWidth = this.symbolSetting.lineWidth || 4;
        let lineType = this.symbolSetting.lineType || "STYLE_DASH";
        let lineMiterLimit = this.symbolSetting.lineMiterLimit || 2;

        let lineSymbol = new esri.symbol.CartographicLineSymbol(
            esri.symbol.CartographicLineSymbol[lineType],
            new esri.Color(lineColor),
            lineWidth,
            esri.symbol.CartographicLineSymbol.CAP_ROUND,
            esri.symbol.CartographicLineSymbol.JOIN_MITER,
            lineMiterLimit
        );
        return lineSymbol;
    }

    private get fillSymbol() {
        let lineColor = this.symbolSetting.lineColor || [151, 249, 0, 0.8];
        let lineWidth = this.symbolSetting.lineWidth || 3;
        let lineType = this.symbolSetting.lineType || "STYLE_DOT";
        let fillType = this.symbolSetting.fillType || "STYLE_SOLID";
        let fillColor = this.symbolSetting.fillColor || [255, 49, 0, 0.45];

        let polygonSymbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol[fillType],
            new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol[lineType],
                new esri.Color(lineColor),
                lineWidth
            ),
            new esri.Color(fillColor)
        );
        return polygonSymbol;
    }
}
