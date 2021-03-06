import { component, View } from "@egova/flagwind-web";
import * as codes from "@s/codes";

@component({ template: require("./index.html") })
export default class GeojsonLayerView extends View {
    protected code: object = codes.layers;

    protected dataList: Array<any> = [];
    // protected dataList: Array<any> = [
    //     { id: "1", name: "张三", longitude: 118.5731, latitude: 37.61462, image: "point1" },
    //     { id: "2", name: "李娜", longitude: 118.1332, latitude: 37.48463, image: "point1" },
    //     { id: "3", name: "五三", longitude: 118.3833, latitude: 37.6466, image: "point1" },
    //     { id: "4", name: "原因", longitude: 118.5634, latitude: 37.9463, image: "point1" },
    //     { id: "5", name: "李妈", longitude: 118.7135, latitude: 37.1468, image: "point1" }
    // ];

    protected created() {
        let list = [];
        for (let i = 0; i < 20000; i++) {
            list.push(
                { id: i, name: "张三" + i, longitude: 118.5731 + Math.random() * 5, latitude: 37.61462 + Math.random() * 5, image: "point1" }
            );
        }
        this.dataList = list;

    }

    protected onGetImages() {
        return [
            {
                name: "point1",
                url: "./static/map/point.png"
            }
        ];
    }
    protected onChangeSource() {
        this.dataList = [
            { id: "1", name: "张三", longitude: 118.5731, latitude: 37.61462, image: "point1" },
            { id: "2", name: "李娜", longitude: 118.1332, latitude: 37.48463, image: "point1" }
        ];
    }

    protected onChangeStandardModel(model: any) {
        return {
            ...model,
            longitude: Math.ceil(<number>model.longitude * 1000) / 1000,
            latitude: Math.ceil(<number>model.latitude * 1000) / 1000
        };
    }

}
