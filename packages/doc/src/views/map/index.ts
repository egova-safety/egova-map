import { component, View } from "@egova/flagwind-web";
import * as codes from "@s/codes";

@component({ template: require("./index.html") })
export default class MapView extends View {
    protected code: any = codes.maps;

}
