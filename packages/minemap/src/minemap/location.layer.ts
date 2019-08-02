import base from "@egova/map-base";
import { GraphicsLayer } from "./graphics.layer";
import { Point, PointGraphic } from "./map.model";
export class LocationLayer extends GraphicsLayer
    implements base.ILocationLayer {
    public point: Point;

    public constructor(public mapView: base.MapView, options: any) {
        super(options);
        this.options = { ...base.LOCATION_LAYER_OPTIONS, ...this.options };
        this.appendTo(mapView.map);
        this.registerEvent();
    }

    public registerEvent() {
        this.mapView.on(
            "onClick",
            (args: base.EventArgs) => {
                this.point = new Point(
                    args.data.lngLat.lng,
                    args.data.lngLat.lat
                );
                this.locate();
            },
            this
        );
    }

    public locate() {
        this.clear();
        const marker = new PointGraphic({
            id: "flagwind_map_location",
            type: "Point",
            geometry: this.point,
            symbol: {
                className: "flagwind-map-location"
            }
        });
        marker.element.innerHTML =
            "<div class='breathing'><div class='pulse'></div></div>";
        this.add(marker);
        this.options.onMapClick({ point: this.point });
    }
}
