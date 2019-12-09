import base from "@egova/map-base";
export class TiledLayer extends base.TiledLayer {
    public onCreateTiledLayer(args: any) {
        try {
            console.info(`创建wms图层url:${args.url},id:${args.id}`)
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
        } catch (error) {
            console.error(error)
        }
    }
}
