import base from "@egova/map-base";

export class HeatmapLayer implements base.IHeatmapLayer {
    private dataMap: base.Map<String, base.HeatmapPoint>;
    private _echartslayer: any;
    public isShow: boolean = false;
    public options: any;

    public chartOptions: any;

    public get echartslayer(): any {
        if (this._echartslayer == null) {
            if (!minemap.Template) {
                console.error("template 插件未加载或加载失败");
            }
            this._echartslayer = minemap.Template.create({
                map: this.mapView.map,
                type: "heatmap"
            });
        }
        return this._echartslayer;
    }

    public constructor(public mapView: base.MapView, options: any) {
        this.options = { ...base.HEATMAP_LAYER_OPTIONS, ...options };
        this.dataMap = new base.Map<String, base.HeatmapPoint>();
        this.chartOptions = {
            GLMap: {
                roam: true
            },
            coordinateSystem: "GLMap",
            title: {
                text: options.title || "热力图展示",
                subtext: "",
                left: "center",
                textStyle: {
                    color: "#fff"
                }
            },
            tooltip: {
                trigger: "item"
            },
            visualMap: {
                show: false,
                top: "top",
                min: 0,
                max: 10,
                seriesIndex: 0,
                calculable: true,
                inRange: {
                    color: ["blue", "blue", "green", "yellow", "red"]
                }
            },
            series: [
                {
                    type: "heatmap",
                    data: [],
                    coordinateSystem: "GLMap",
                    pointSize: 8,
                    blurSize: 12
                }
            ]
        };
    }

    public appendTo(_map: any): void {
        throw new Error("Method not implemented.");
    }

    public removeLayer(_map: any): void {
        throw new Error("Method not implemented.");
    }

    public resize(): void {
        this.echartslayer.resize();
    }

    public clear(): void {
        this.dataMap.clear();
        this.chartOptions.series[0].data = [];
        this.echartslayer.chart.setOption(this.chartOptions);
    }

    public show(): void {
        this.isShow = true;
        this.echartslayer._container.style.display = "";
    }

    public hide(): void {
        this.isShow = false;
        this.echartslayer._container.style.display = "none";
    }

    public showDataList(data: Array<any>): void {
        this.chartOptions.series[0].data = this.onChangeStandardModel(data);
        this.echartslayer.chart.setOption(this.chartOptions);
    }

    public onChangeStandardModel(data: Array<any>): Array<any> {
        data.forEach(g => {
            let node = this.options.changeStandardModel(g);
            if (node) {
                let key = node.longitude + ":" + node.latitude;
                let value = this.dataMap.get(key);
                if (value !== undefined) {
                    value.members.push(g);
                    value.count = value.count + (node.count || 1);
                } else {
                    value = {
                        longitude: node.longitude,
                        latitude: node.latitude,
                        members: [g],
                        count: node.count || 1
                    };
                    this.dataMap.set(key, value);
                }
            }
        });
        return this.dataMap.values().map(g => [g.longitude, g.latitude, g.count]);
    }
}
