// 组件
import Map from "@/components/map";

import PointLayer from "@/components/layers/point-layer";
import PolygonLayer from "@/components/layers/polygon-layer";
import PolylineLayer from "@/components/layers/polyline-layer";
import EditLayer from "@/components/layers/edit-layer";
import TrackLayer from "@/components/layers/track-layer";
import HeatmapLayer from "@/components/layers/heatmap-layer";
import CanvasLayer from "@/components/layers/canvas-layer";

import {
    SelectBoxComponent,
    ContextMenuComponent,
    InfoWindowComponent,
    Overlay
} from "@/components/widgets";

const components: any = {
    "fm-map": Map,
    "fm-point-layer": PointLayer,
    "fm-polygon-layer": PolygonLayer,
    "fm-polyline-layer": PolylineLayer,
    "fm-edit-layer": EditLayer,
    "fm-track-layer": TrackLayer,
    "fm-heatmap-layer": HeatmapLayer,
    "fm-canvas-layer": CanvasLayer,
    "fm-select-box": SelectBoxComponent,
    "fm-context-menu": ContextMenuComponent,
    "fm-info-window": InfoWindowComponent,
    "fm-overlay": Overlay
};

const install = {
    installed: false,

    // init: MapLoader.loadModules,

    // tslint:disable-next-line:variable-name
    install: (Vue: any, opts: any = {}) => {
        if (install.installed) {
            return;
        }

        Object.keys(components).forEach(key => {
            Vue.component(key, components[key]);
        });

        install.installed = true;
    }
};

export {
    PointLayer,
    PolygonLayer,
    PolylineLayer,
    EditLayer,
    TrackLayer,
    CanvasLayer,
    HeatmapLayer,
    SelectBoxComponent,
    ContextMenuComponent,
    InfoWindowComponent,
    Overlay,
    install
};

export default {
    PointLayer,
    PolygonLayer,
    PolylineLayer,
    EditLayer,
    TrackLayer,
    CanvasLayer,
    HeatmapLayer,
    SelectBoxComponent,
    ContextMenuComponent,
    InfoWindowComponent,
    Overlay,
    install
};
