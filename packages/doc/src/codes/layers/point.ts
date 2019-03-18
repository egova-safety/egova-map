const code = `
<template>
    <fm-map ref="fwAmap"   vid="esri_map">
        <fm-point-layer vid="tollgateLayer"
                        :enableCluster="false" :symbol="symbol" :source="dataList"
                        @onLayerClick="onLayerClick" @changeStandardModel="onChangeStandardModel">
        </fm-point-layer>
    </fm-map>
</template>
<script lang="ts">

import { component, View } from "@egova/flagwind-web";

@component
export default class PointLayerView extends View
{
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
</script>`;

export default code;
