import { component, View } from "@egova/flagwind-web";
import * as codes from "@s/codes";

@component({ template: require("./index.html")  })
export default class HeatmapLayerView extends View {
    protected code: object = codes.layers;

    protected dataList = [
        { id: "1", name: "张三", longitude: 118.5731, latitude: 37.61462 },
        { id: "2", name: "李娜", longitude: 118.1332, latitude: 37.48463 },
        { id: "3", name: "五三", longitude: 118.3833, latitude: 37.6466 },
        { id: "4", name: "原因", longitude: 118.5634, latitude: 37.9463 },
        { id: "5", name: "李妈", longitude: 118.7135, latitude: 37.1468 }
    ];

    protected onChangeStandardModel(model: any) {
        return {
            longitude: Math.ceil(<number>model.longitude * 1000) / 1000,
            latitude: Math.ceil(<number>model.latitude * 1000) / 1000
        };
    }

}
