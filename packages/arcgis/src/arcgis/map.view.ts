import base from "@egova/map-base";
import { TiledLayer } from "./tiled.layer";
import { MapSetting } from "./map.setting";
/**
 * 对ArcGIS地图封装
 */
export class MapView extends base.MapView {
    protected tooltipElement: HTMLDivElement | undefined;
    public constructor(
        public mapSetting: MapSetting,
        mapElement: any,
        options: any
    ) {
        super(mapSetting, mapElement, {
            ...{
                onMapClick: function(evt: any) {
                    console.log(`onMapClick:${evt.data.mapPoint.x},${evt.data.mapPoint.y}`);
                }
            },
            ...options
        });
        this.onInit();
    }

    public onAddEventListener(eventName: string, callBack: Function): void {
        dojo.on(this.map, eventName, callBack);
    }

    public onCenterAt(point: any): Promise<void> {
        return new Promise(resolve => {
            console.info("map center at point:")
            console.info(point);
            this.map.centerAt(point).then(function() {
                console.info("map center at point success")
                resolve();
            });
        });
    }

    public onCreatePoint(options: any) {
        return new esri.geometry.Point(
            options.x,
            options.y,
            options.spatial || this.spatial
        );
    }

    public onCreateMap() {
        this.spatial = new esri.SpatialReference({
            wkid: this.mapSetting.wkid || 4326
        });

        let setting = this.mapSetting;
        let mapArguments = <any>{
            spatialReference: this.spatial,
            wkid: setting.wkid,
            center: setting.center,
            logo: setting.logo,
            slider: setting.slider,
            sliderPosition: setting.sliderPosition
        };

        if (setting.zoom !== undefined) {
            mapArguments.zoom = setting.zoom;
        }
        if (setting.minZoom !== undefined) {
            mapArguments.minZoom = setting.minZoom;
        }
        if (setting.maxZoom !== undefined) {
            mapArguments.maxZoom = setting.maxZoom;
        }
        if (setting.basemap && setting.basemap !== "none") {
            mapArguments.basemap = setting.basemap;
        }

        if (setting.extent && setting.extent.length === 4) {
            let minXY = this.getPoint({ x: setting.extent[0], y: setting.extent[1] });
            let maxXY = this.getPoint({ x: setting.extent[2], y: setting.extent[3] });
            let tileExtent = new esri.geometry.Extent(minXY.x,minXY.y,maxXY.x,maxXY.y,this.spatial);
            mapArguments.extent = tileExtent;
        }

        console.info("arcgis map参数:");
        console.info(mapArguments);
        console.info("flagwin map参数:");
        console.info(this.mapSetting);
        // 地图对象
        const map = new esri.Map(this.mapElement, mapArguments);
        map.infoWindow.anchor = "top";
        this.innerMap = map;

        this.tooltipElement = document.createElement("div");
        this.tooltipElement.classList.add("flagwind-map-tooltip");
        (<any>this).innerMap.root.appendChild(this.tooltipElement);

        // #region click event

        map.on("load", (args: any) => {
            console.info("arcgis load success");
            this.dispatchEvent("onLoad", args);
        });

        map.on("click", (args: any) => {
            this.dispatchEvent("onClick", args);
        });

        map.on("dbl-click", (args: any) => {
            this.dispatchEvent("onDbClick", args);
        });

        // #endregion

        // #region mouse event
        map.on("mouse-out", (args: any) => {
            this.dispatchEvent("onMouseOut", args);
        });
        map.on("mouse-over", (args: any) => {
            this.dispatchEvent("onMouseOver", args);
        });
        map.on("mouse-move", (args: any) => {
            this.dispatchEvent("onMouseMove", args);
        });
        map.on("mouse-wheel", (args: any) => {
            this.dispatchEvent("onMouseWheel", args);
        });
        // #endregion

        // #region zoom event
        map.on("zoom", (args: any) => {
            this.dispatchEvent("onZoom", args);
        });
        map.on("zoom-start", (args: any) => {
            this.dispatchEvent("onZoomStart", args);
        });
        map.on("zoom-end", (args: any) => {
            this.dispatchEvent("onZoomEnd", args);
        });

        // #endregion

        // #region pan event

        map.on("pan", (args: any) => {
            this.dispatchEvent("onPan", args);
        });
        map.on("pan-start", (args: any) => {
            this.dispatchEvent("onPanStart", args);
        });
        map.on("pan-end", (args: any) => {
            this.dispatchEvent("onPanEnd", args);
        });

        // #endregion

        // #region update event

        map.on("update-start", (args: any) => {
            this.dispatchEvent("onUpdateStart", args);
        });
        map.on("update-end", (args: any) => {
            this.dispatchEvent("onUpdateEnd", args);
        });

        // #endregion

        map.on("extent-change", (args: any) => {
            // console.trace("------extentChange", args);
            this.dispatchEvent("onExtentChange", args);
        });
        map.on("resize", (args: any) => {
            this.dispatchEvent("onResize", args);
        });
    }

    public onShowInfoWindow(evt: base.InfoWindowShowEventArgs): void {
        if (this.innerMap.infoWindow) {
            this.innerMap.infoWindow.hide();
        }

        if (!evt.context) {
            throw new Error("未设置context,无法显示窗口");
        }

        const pt = this.getPoint(evt.graphic.attributes);
        this.innerMap.infoWindow.setTitle(evt.context.title);
        this.innerMap.infoWindow.setContent(evt.context.content);
        if (!evt.options) {
            this.innerMap.infoWindow.show(pt);
            return;
        }

        if (evt.options.width && evt.options.height) {
            this.innerMap.infoWindow.resize(
                evt.options.width,
                evt.options.height
            );
        }
        if (evt.options.offset) {
            let location = this.innerMap.toScreen(pt);
            location.x += evt.options.offset.x;
            location.y += evt.options.offset.y;
            this.innerMap.infoWindow.show(location);
        } else {
            this.innerMap.infoWindow.show(pt);
        }
    }

    public onCloseInfoWindow(): void {
        if (this.innerMap.infoWindow) {
            this.innerMap.infoWindow.hide();
        }
    }

    public onCreateBaseLayers(): Array<base.TiledLayer> {
        let baseLayers = new Array<base.TiledLayer>();
        if (this.mapSetting.baseUrl) {
            const layer = new TiledLayer(
                "base_arcgis_tiled",
                this.mapSetting.baseUrl,
                this.spatial,
                "瓦片图层"
            );
            if(layer){
                baseLayers.push(layer);
            }
        }

        if (this.mapSetting.tiledUrls) {
            this.mapSetting.tiledUrls.forEach(l => {
                if (!l.url) return;
                const layer = new TiledLayer(
                    l.id,
                    l.url,
                    this.spatial,
                    l.title
                );
                baseLayers.push(layer);
            });
        }

        this.baseLayers = baseLayers;
        this.baseLayers.forEach(g => {
            g.appendTo(this.innerMap);
        });

        console.info("arcgis load base layers");
        console.info(this.baseLayers);

        return baseLayers;
    }

    public toScreen(item: any): { x: number; y: number };
    public toScreen(x: number, y: number): { x: number; y: number };
    public toScreen(): { x: number; y: number } | null {
        let args = arguments,
            pt!: base.Point;
        switch (args.length) {
            case 1:
                pt = this.onToPoint(args[0]);
                break;
            case 2:
                pt = this.onCreatePoint({
                    x: args[0],
                    y: args[1],
                    spatial: this.spatial
                });
                break;
        }
        if (pt) {
            return this.innerMap.toScreen(pt);
        } else {
            return null;
        }
    }

    public onZoom(zoom: number): Promise<void> {
        return new Promise(resolve => {
            this.map.setZoom(zoom).then(() => {
                resolve();
            });
        });
    }

    public onShowTooltip(graphic: any): void {
        let info = graphic.attributes;
        let pt = new esri.geometry.Point(
            info.longitude,
            info.latitude,
            this.spatial
        );
        let screenpt = this.innerMap.toScreen(pt);
        let title = info.name;
        this.tooltipElement!.innerHTML = "<div>" + title + "</div>";
        this.tooltipElement!.style.left = screenpt.x + 15 + "px";
        this.tooltipElement!.style.top = screenpt.y + 15 + "px";
        this.tooltipElement!.style.display = "block";
    }

    public onHideTooltip(): void {
        this.tooltipElement!.style.display = "none";
    }

    public onDestroy(): void {
        try {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = undefined;
            }
            if (this.featureLayers) {
                this.featureLayers.forEach(l => {
                    l.clear();
                });
                this.featureLayers = [];
            }
            if (this.baseLayers) {
                this.baseLayers = [];
            }
            if (this.innerMap && this.innerMap.destroy) {
                this.innerMap.destroy();
                this.innerMap = null;
            }
        } catch (error) {
            console.error(error);
        }
    }
}
