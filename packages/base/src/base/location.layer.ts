import { ISingleLayer } from "./single.layer";

export const LOCATION_LAYER_OPTIONS = {
    onMapClick: function(evt: any) {
        console.log("onMapClick");
    }
};

export interface ILocationLayer extends ISingleLayer {
    point: any;
    clear(): void;
    locate(): void;
}
