const code = `
<template>
<fm-map  vid="esri_map">

    <fm-point-layer vid="tollgateLayer" :enableCluster="false" :showInfoWindow="true" :symbol="pointSymbol"
        :source="dataList" @changeStandardModel="onChangeStandardModel">
        <fm-info-window :showWare="true">
        </fm-info-window>
    </fm-point-layer>

    <fm-info-window ref="fmInfoWindow" @click="onClick" :point="position" :title="title" :showWare="true">
        <template slot="content">自定义内容</template>
        <template slot="footer">
            <div style="float:right;padding:4px;">
                <i-button type="primary">确定</i-button>
                <i-button type="error">取消</i-button>
            </div>
        </template>
    </fm-info-window>

</fm-map>

<i-button @click="onOpenInfoWindow">显示信息窗口</i-button>
</template>
<script lang="ts">

import { component, View } from "@egova/flagwind-web";

@component({ template: require("./index.html") })
export default class InfoWindowView extends View {
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

    protected layer: maps.FlagwindBusinessLayer;

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

    protected onOpenInfoWindow() {
        let infoWindow = <InfoWindowComponent>this.$refs.fmInfoWindow;
        infoWindow.show();
    }

    protected onChangeStandardModel(model: any) {
        return model;
    }
}
</script>`;

export default code;
