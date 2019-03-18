# flagwind-map-lib

该项目是把flagwind-map 与 vue-flagwind-map进行了拆分再整合，使用lerna进行多包管理，便于日后对相关内容调整时，关联相工作能够一便调整与发布。

## 工程介绍

* map-base 
  是一套地图应用业务层交互标准，主要目的屏蔽具体gis技术对业务影响，实现不同地图api切换。
* map-arcgis
  基于arcgis for js二维地图实现
* map-minemap
  基于 四维图新 web sdk 地图实现。
* map-ui
  基于上述规范开发的一套vue的地图组件

## 安装

```bash
lerna bootstrap
```

## 编译

```bash
lerna run dist
```

## 测试

```bash
lerna run server --scope @egova/map-doc
```
  
## 发布

```bash
lerna publish
```
