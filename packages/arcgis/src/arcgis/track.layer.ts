import base from "@egova/map-base";
import { RouteLayer } from "./route.layer";

/**
 * 车辆路由服务
 */
export class TrackLayer extends base.TrackLayer {
    public constructor(
        public businessLayer: base.BusinessLayer,
        options: any
    ) {
        super(
            businessLayer,
            new RouteLayer(
                businessLayer.mapView,
                businessLayer.id + "_track",
                options.route || options
            ),
            options
        );
    }
}
