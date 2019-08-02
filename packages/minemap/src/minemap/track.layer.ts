import base from "@egova/map-base";
import { RouteLayer } from "./route.layer";
import { PointLayer } from "./point.layer";
export class TrackLayer extends base.TrackLayer {
    public constructor(public businessLayer: PointLayer, options: any) {
        super(
            businessLayer,
            new RouteLayer(
                businessLayer.mapView,
                businessLayer.id + "_track",
                options
            ),
            options
        );
    }
}
