const code = `

<fm-map ref="fwAmap" vid="esri_map">
    <fm-geojson-layer vid="canvasLayer" :source="dataList" @getImages="onGetImages"
        @changeStandardModel="onChangeStandardModel">
        <fm-info-window :showWare="true">
        </fm-info-window>
    </fm-geojson-layer>
</fm-map>

<script lang="ts">

@component({ template: require("./index.html") })
export default class GeojsonLayerView extends View {
    protected code: object = codes.layers;

    protected dataList: Array<any> = [];

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

</script>`;

export default code;
