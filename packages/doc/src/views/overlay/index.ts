import { component, View } from "@egova/flagwind-web";
import * as codes from "@/codes";

import "./index.less";

@component({ template: require("./index.html") })
export default class OverlayView extends View {
    protected code: object = codes.widgets;

    protected dataList = [
        { id: "5", name: "李妈", longitude: 118.7135, latitude: 37.1468 }
    ];

    protected pointSymbol = {
        height: 32,
        width: 32,
        imageUrl: "./static/map/point.png"
    };

    protected point = {
        longitude: 118.7135,
        latitude: 37.1468,
        data: { id: "5", name: "李妈", longitude: 118.7135, latitude: 37.1468 }
    };

    protected onChangeStandardModel(model: any) {
        return model;
    }
}
