const code = `
<template>
    <fm-map  vid="esri_map">
        <fm-overlay :point="point">
            这是一个遮罩物<br />
            你可以在这里放你自己的组件，显示在地图上{{point.data.name}}
        </fm-overlay>
    </fm-map>
</template>
<script lang="ts">

import { component, View } from "@egova/flagwind-web";

@component({ template: require("./index.html") })
export default class OverlayView extends View {
    protected point = {
        longitude: 118.7135,
        latitude: 37.1468,
        data: { id: "5", name: "李妈", longitude: 118.7135, latitude: 37.1468 }
    };
}

</script>`;

export default code;
