import flagwind from "@egova/flagwind-core";
import ApplicationContext from "./application/context";
import mapUI from "@egova/map-ui";

// 获取应用上下文
let context = ApplicationContext.current;

mapUI.setting.arcgis = {
    ...mapUI.setting.arcgis,
    ...{
        arcgisApi: "http://37.85.15.141/arcgis/library/3.25/",
        center: [118.25527, 37.49026],
        wkid: 4490,
        wkidFromApp: 4490,
        zoom: 9,
        slider: false,
        basemap: "",
        logo: false,
        sliderPosition: "bottom-left"
    }
};

mapUI.setting.minemap = {
    ...mapUI.setting.minemap,
    ...{
        mapDomain: "10.166.190.228", // 四维图新api地址信息，云南现网使用IP "10.166.190.228"
        mapVersion: "v1.3",
        accessToken: "6ed83a09b32547bb975102422a453d6c", // 四维图新api的访问凭证，  现网使用"6ed83a09b32547bb975102422a453d6c"
        wkid: 3589, // 四维图新使用的坐标系，现网使用3589
        center: [118.573, 37.446], // 地图中心点（*****需要根据本地州修改配置*****）
        zoom: 6, // 地图放大级别
        minZoom: 3
    }
};

// (<any>mapUI.setting.minemap).mainJS = "http://113.106.54.47:1180/minemapapi/demo/js/minemap-wmts.js";
mapUI.setting.mapType = "arcgis";// (<any>window).mapType || "arcgis";

mapUI.MapLoader.loadCss(mapUI.setting);
mapUI.MapLoader.loadScript(mapUI.setting).then(() => {
    // 启动应用程序
    flagwind.Application.start(context);
});
