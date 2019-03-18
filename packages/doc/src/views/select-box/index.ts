import { component, View } from "@egova/flagwind-web";
import * as codes from "@/codes";

@component({ template: require("./index.html") })
export default class SelectBoxView extends View {
    protected code: object = codes.widgets;
    protected dataList = [
        { id: "1", name: "张三", longitude: 118.5731, latitude: 37.61462 },
        { id: "2", name: "李娜", longitude: 118.1332, latitude: 37.48463 },
        { id: "3", name: "五三", longitude: 118.3833, latitude: 37.6466 },
        { id: "4", name: "原因", longitude: 118.5634, latitude: 37.9463 },
        { id: "5", name: "李妈", longitude: 118.7135, latitude: 37.1468 }
    ];

    protected symbol = {
        height: 32,
        width: 32,
        imageUrl: "./static/map/point.png"
    };

    protected onCheckChanged(evt: any) {
        alert(evt);
    }

    protected onChangeStandardModel(model: any) {
        return model;
    }
}
