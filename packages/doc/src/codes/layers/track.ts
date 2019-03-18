const code = `
<template>
    <fm-map  vid="esri_map">
        <fm-track-layer :symbol="carSymbol" @getImageUrl="getImageUrl" @getImageAngle="getImageAngle" @on-build="onTrackBuild">
            <fm-point-layer vid="tollgateLayer" :source="dataList" :enableCluster="false" :enableEdit="true" :showInfoWindow="true" :symbol="pointSymbol"
                @onLayerClick="onLayerClick" @changeStandardModel="onChangeStandardModel">
            </fm-point-layer>
        </fm-track-layer>
    </fm-map>
</template>
<script lang="ts">

import { component, View } from "@egova/flagwind-web";

@component({ template: require("./index.html")  })
export default class HeatmapLayerView extends View {
    protected dataList = [
        { id: "1", name: "张三", longitude: 118.5731, latitude: 37.61462 },
        { id: "2", name: "李娜", longitude: 118.1332, latitude: 37.48463 },
        { id: "3", name: "五三", longitude: 118.3833, latitude: 37.6466 },
        { id: "4", name: "原因", longitude: 118.5634, latitude: 37.9463 },
        { id: "5", name: "李妈", longitude: 118.7135, latitude: 37.1468 }
    ];

    protected trackLayer: maps.FlagwindTrackLayer;

    protected carSymbol = {
        height: 32,
        width: 32,
        imageUrl: "./static/map/car.png"
    };

    protected pointSymbol = {
        height: 32,
        width: 32,
        imageUrl: "./static/map/point.png"
    };

    protected getImageUrl(trackLine: maps.TrackLine, angle: number) {
        return "./static/map/car.png";
    }

    protected getImageAngle(trackLine: maps.TrackLine, angle: number) {
        return angle;
    }

    protected onTrackBuild(layer: maps.FlagwindTrackLayer) {
        this.trackLayer = layer;
        layer.showTrackToolBox();
    }

    protected startTrack() {
        this.trackLayer.startTrack(this.dataList);
    }

    protected onChangeStandardModel(model: any) {
        return model;
    }
}
</script>`;

export default code;
