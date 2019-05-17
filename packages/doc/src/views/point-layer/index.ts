import { component, View } from "@egova/flagwind-web";
import * as codes from "@s/codes";

@component({ template: require("./index.html")  })
export default class PointLayerView extends View {
    protected code: object = codes.layers;

    // protected created() {
    //     let list: Array<any> = [];
    //     for (let i = 0; i < 10000; i++) {
    //         list.push({
    //             id: i.toString(), name: "张三" + i, longitude: 118.5731 + Math.random() * 0.01 + (i % 10) / 1000, latitude: 37.61462 + Math.random() * 0.01 + Math.random() * 0.001
    //         });
    //     }
    //     this.dataList = list;
    // }

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

    protected onChangeStandardModel(model: any) {
        return model;
    }

}
