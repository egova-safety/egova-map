import { component, View } from "@egova/flagwind-web";
import * as codes from "@s/codes";
import opts from "./options";

@component({ template: require("./index.html") })
export default class MapView extends View {
    protected code: any = codes.maps;
    protected opt: any = opts;

}
