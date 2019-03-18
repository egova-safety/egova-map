import flagwind from "flagwind-core";
import ApplicationContext from "./application/context";
import { setting, MapLoader } from "@egova/map-ui";

// 获取应用上下文
let context = ApplicationContext.current;

setting.arcgis = {
    ...setting.arcgis,
    ...{
        center: [118.573, 37.446],
        wkid: 4326,
        wkidFromApp: 4326,
        zoom: 9,
        slider: false,
        basemap: "dark-gray",
        logo: false,
        sliderPosition: "bottom-left"
    }
};

setting.minemap = {
    ...setting.minemap,
    ...{
        mapDomain: "113.106.54.47:1180", // 四维图新api地址信息，云南现网使用IP "10.166.190.228"
        mapVersion: "v1.3",
        accessToken: "658e22d73c60405a8a7c82f69f298c2b", // 四维图新api的访问凭证，  现网使用"6ed83a09b32547bb975102422a453d6c"
        wkid: 3591, // 四维图新使用的坐标系，现网使用3589
        center: [118.573, 37.446], // 地图中心点（*****需要根据本地州修改配置*****）
        zoom: 6, // 地图放大级别
        minZoom: 3
    }
};
(<any>setting.minemap).mainJS =
    "http://113.106.54.47:1180/minemapapi/demo/js/minemap-wmts.js";
setting.mapType = (<any>window).mapType || "minemap";
alert(setting.mapType);
MapLoader.loadCss(setting);
MapLoader.loadScript(setting).then(() => {
    // 启动应用程序
    flagwind.Application.start(context);
});
// let context = ApplicationContext.current;
// flagwind.Application.start(context);
