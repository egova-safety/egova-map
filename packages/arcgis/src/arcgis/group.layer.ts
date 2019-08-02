import base from "@egova/map-base";

export class GroupLayer extends base.GroupLayer {
    public onCreateGraphicsLayer(args: any) {
        let layer = new esri.layers.GraphicsLayer(args);
        layer.addToMap = function(map: any) {
            map.addLayer(this);
        };
        layer.removeFromMap = function(map: any) {
            map.removeLayer(this);
        };
        return layer;
    }
}
