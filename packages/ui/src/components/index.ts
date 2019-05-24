// 组件
import Map from "@/components/map";

import {
    PointLayerComponent,
    PolygonLayerComponent,
    PolylineLayerComponent,
    EditLayerComponent,
    TrackLayerComponent,
    GeojsonLayerComponent,
    HeatmapLayerComponent
} from "@/components/layers";

import {
    SelectBoxComponent,
    ContextMenuComponent,
    InfoWindowComponent,
    OverlayComponent
} from "@/components/widgets";

const components: any = {
    "fm-map": Map,
    "fm-point-layer": PointLayerComponent,
    "fm-polygon-layer": PolygonLayerComponent,
    "fm-polyline-layer": PolylineLayerComponent,
    "fm-edit-layer": EditLayerComponent,
    "fm-track-layer": TrackLayerComponent,
    "fm-heatmap-layer": HeatmapLayerComponent,
    "fm-geojson-layer": GeojsonLayerComponent,
    "fm-select-box": SelectBoxComponent,
    "fm-context-menu": ContextMenuComponent,
    "fm-info-window": InfoWindowComponent,
    "fm-overlay": OverlayComponent
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
    PointLayerComponent,
    PolygonLayerComponent,
    PolylineLayerComponent,
    EditLayerComponent,
    TrackLayerComponent,
    GeojsonLayerComponent,
    HeatmapLayerComponent,
    SelectBoxComponent,
    ContextMenuComponent,
    InfoWindowComponent,
    OverlayComponent,
    install
};

export default {
    PointLayerComponent,
    PolygonLayerComponent,
    PolylineLayerComponent,
    EditLayerComponent,
    TrackLayerComponent,
    GeojsonLayerComponent,
    HeatmapLayerComponent,
    SelectBoxComponent,
    ContextMenuComponent,
    InfoWindowComponent,
    OverlayComponent,
    install
};
