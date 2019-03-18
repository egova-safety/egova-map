const code = `
import { setting, MapLoader } from "src/index";

setting.arcgis = {
    ...setting.arcgis, ...{
        arcgisApi: "http://120.202.26.100:8081/arcgis4js/library/3.21/",
        routeUrl: "",
        center: [118.573, 37.446],
        wkid: 4326,
        wkidFromApp: 4326,
        zoom: 9,
        slider: false,
        basemap: "dark-gray-vector",
        logo: false,
        sliderPosition: "bottom-left"
    }
};
setting.mapType = "arcgis";
MapLoader.loadCss(setting.arcgis);
MapLoader.loadScript(setting.arcgis);`;

export default code;
