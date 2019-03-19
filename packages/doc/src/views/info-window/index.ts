import { component, View } from "@egova/flagwind-web";
import base from "@egova/map-base";
import { InfoWindowComponent } from "@egova/map-ui";
import * as codes from "@s/codes";

@component({ template: require("./index.html") })
export default class InfoWindowView extends View {
    protected code: object = codes.widgets;
    protected dataList = [
        { id: "1", name: "张三", longitude: 118.5731, latitude: 37.61462 },
        { id: "2", name: "李娜", longitude: 118.1332, latitude: 37.48463 },
        { id: "3", name: "五三", longitude: 118.3833, latitude: 37.6466 },
        { id: "4", name: "原因", longitude: 118.5634, latitude: 37.9463 },
        { id: "5", name: "李妈", longitude: 118.7135, latitude: 37.1468 }
    ];

    protected position: any = {
        id: "5",
        name: "李妈",
        longitude: 118.7135,
        latitude: 37.1468
    };

    protected title: string = "标题";

    protected layer: base.BusinessLayer | undefined;

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

    protected onClick(ele: HTMLElement) {
        alert(ele);
    }

    protected onOpenInfoWindow() {
        let infoWindow = <InfoWindowComponent>this.$refs.fmInfoWindow;
        infoWindow.show();
    }

    protected onChangeStandardModel(model: any) {
        return model;
    }
}
