import { loadScript, loadModules, loadCss } from "esri-loader";

declare let dojo: any;
declare let dojox: any;
declare let esri: any;
// declare let mapv: any;

export default class MapLoader {
    protected static options: any;
    public static loadCss(setting: any) {
        if (setting.mapType === "arcgis") {
            loadCss(`${setting.arcgis.arcgisApi}esri/css/esri.css`);
            loadCss(`${setting.arcgis.arcgisApi}dijit/themes/claro/claro.css`);
        } else if (setting.mapType === "minemap") {
            loadCss(
                `http://${setting.minemap.mapDomain}/minemapapi/${
                    setting.minemap.mapVersion
                }/minemap.css`
            );
            loadCss(
                `http://${setting.minemap.mapDomain}/minemapapi/${
                    setting.minemap.mapVersion
                }/plugins/edit/minemap-edit.css`
            );
        }
    }

    public static loadScript(setting: any) {
        if (setting.mapType === "arcgis") {
            return this.loadArcgisScript(setting);
        } else if (setting.mapType === "minemap") {
            return this.loadMinemapScript(setting);
        } else {
            throw new Error("不支持的地图类型");
        }
    }

    public static loadArcgisScript(setting: any) {
        let index = window.location.href.lastIndexOf(window.location.hash);
        let url = window.location.href.substr(0, index);
        if (index < 0) {
            url = window.location.origin + "/";
        }

        const options = (MapLoader.options = {
            url: `${setting.arcgis.arcgisApi}init.js`,
            dojoConfig: {
                async: true,
                packages: [
                    {
                        location: url + "static/esri/layers",
                        name: "extras"
                    },
                    {
                        location: url + "static/egova",
                        name: "egova1"
                    }
                ]
            }
        });

        return loadScript(options);
    }

    public static loadMinemapScript(setting: any) {
        return new Promise((resolve, reject) => {
            let script = document.querySelector("script[data-minemap-loader]");

            if (!script) {
                let url =
                    setting.minemap.mainJS ||
                    `http://${setting.minemap.mapDomain}/minemapapi/${
                        setting.minemap.mapVersion
                    }/minemap.js`;
                script = MapLoader.createScript(url);
                let onScriptLoad = () => {
                    script!.setAttribute("data-minemap-loader", "loaded");
                    // remove this event listener
                    script!.removeEventListener("load", onScriptLoad, false);
                    resolve(script!);
                };
                script.addEventListener("load", onScriptLoad, false);
                document.body.appendChild(script);
                script.setAttribute("data-minemap-loader", "loading");
            } else {
                resolve(script);
            }

            let pluginScript = document.querySelector(
                "script[data-minemap-plugin-loader]"
            );
            if (!pluginScript) {
                let url =
                    setting.minemap.pluginJS ||
                    `http://${setting.minemap.mapDomain}/minemapapi/${
                        setting.minemap.mapVersion
                    }/plugins/edit/minemap-edit.js`;
                pluginScript = MapLoader.createScript(url);
                let onScriptLoad = () => {
                    pluginScript!.setAttribute(
                        "data-minemap-plugin-loader",
                        "loaded"
                    );

                    pluginScript!.removeEventListener(
                        "load",
                        onScriptLoad,
                        false
                    );
                };
                pluginScript.addEventListener("load", onScriptLoad, false);

                document.body.appendChild(pluginScript);
                pluginScript.setAttribute(
                    "data-minemap-plugin-loader",
                    "loading"
                );
            }
        });
    }

    public static createScript(url: string) {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        return script;
    }

    public static loadModules(mapType: String): Promise<any> {
        if (mapType === "arcgis") {
            return this.loadArcgisModules();
        } else if (mapType === "minemap") {
            return this.loadMinemapModules();
        } else {
            throw new Error("不支持的地图类型");
        }
    }

    public static loadMinemapModules(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.info("minemap 不需要调用此方法");
            resolve();
        });
    }

    public static loadArcgisModules(): Promise<any> {
        return loadModules([
            "dojo/parser",
            "dojo/_base/declare",
            "dojo/_base/lang",
            "dojo/_base/array",
            "dojo/dom",
            "dojo/on",
            "dojo/fx",
            "dojox/gfx/fx",
            "dojox/gesture/tap",
            "./static/esri/layers/ClusterLayer.js",
            "./static/esri/layers/EchartsLayer.js",
            // "./static/esri/layers/OverLayer.js",

            "./static/esri/layers/CanvasLayer.js",

            "esri/geometry/geometryEngine",
            "esri/renderers/ClassBreaksRenderer",
            "esri/renderers/HeatmapRenderer",

            "esri/map",
            "esri/toolbars/draw",
            "esri/toolbars/edit",
            "esri/SpatialReference",
            "esri/Color",
            "esri/units",
            "esri/layers/ArcGISImageServiceLayer",
            "esri/layers/GraphicsLayer",
            "esri/layers/FeatureLayer",
            "esri/layers/DynamicMapServiceLayer",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/WebTiledLayer",
            "esri/graphic",
            "esri/graphicsUtils",
            "esri/geometry/Point",
            "esri/geometry/Multipoint",
            "esri/geometry/geometryEngine",
            "esri/geometry/Polyline",
            "esri/geometry/Circle",
            "esri/geometry/geodesicUtils",
            "esri/geometry/screenUtils",
            "esri/symbols/PictureMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleFillSymbol",
            "esri/symbols/CartographicLineSymbol",
            "esri/tasks/RouteTask",
            "esri/tasks/RouteParameters",
            "esri/tasks/FeatureSet",
            "esri/dijit/InfoWindow"
        ]).then(
            ([
                parser,
                dojoBaseDeclare,
                dojoBaselang,
                dojoBaseArray,
                dojoDom,
                dojoOn,
                dojoFx,
                dojoxGfxFx,
                dojoxGestureTap,
                clusterLayer,
                echartsLayer,

                canvasLayer,

                geometryEngine,
                esriRenderersClassBreaksRenderer
            ]) => {
                dojo._base = {
                    declare: dojoBaseDeclare,
                    lang: dojoBaselang,
                    array: dojoBaseArray
                };
                dojo.dom = dojoDom;
                dojo.on = dojoOn;
                dojo.fx = dojoFx;
                dojox.gfx.fx = dojoxGfxFx;
                dojox.gesture = {
                    tap: dojoxGestureTap
                };
                esri.renderers = {
                    ClassBreaksRenderer: esriRenderersClassBreaksRenderer
                };
                esri.layers.ClusterLayer = clusterLayer;
                esri.layers.EchartsLayer = echartsLayer;

                esri.layers.CanvasLayer = canvasLayer;
                if (!esri.geometry.geometryEngine) {
                    esri.geometry.geometryEngine = geometryEngine;
                }
            }
        );
    }
}
