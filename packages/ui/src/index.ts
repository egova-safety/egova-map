import "./styles/index.less";

// 组件
import components from "./components";

// 地图加载器
import { MapLoader } from "./common";

import setting from "./config";

export { default as MapLoader } from "./common/loader";

export { default as setting } from "./config";

export * from "./components";

export default { ...components, setting, MapLoader };
