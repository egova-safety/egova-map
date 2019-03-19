# flagwind-map-lib

该项目是把 flagwind-map 与 vue-flagwind-map 进行了拆分再整合，使用 lerna 进行多包管理，便于日后对相关内容调整时，关联相工作能够一便调整与发布。

## 工程介绍

-   map-base
    是一套地图应用业务层交互标准，主要目的屏蔽具体 gis 技术对业务影响，实现不同地图 api 切换。
-   map-arcgis
    基于 arcgis for js 二维地图实现
-   map-minemap
    基于 四维图新 web sdk 地图实现。
-   map-ui
    基于上述规范开发的一套 vue 的地图组件

## 安装

1.全局安装 lerna

```bash
npm i -g lerna
```

2.安装工程依赖

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
