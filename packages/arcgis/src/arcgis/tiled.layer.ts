import base from "@egova/map-base";
export class TiledLayer extends base.TiledLayer {
    public onCreateTiledLayer(args: any) {
        let layer = new esri.layers.ArcGISTiledMapServiceLayer(args.url, {
            id: args.id
        });
        layer.addToMap = function(map: any) {
            map.addLayer(this);
        };
        layer.removeFromMap = function(map: any) {
            map.removeLayer(this);
        };
        return layer;
    }
}
