/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 *
 * Licensed under the MIT License.
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved.
 */

const menus = [
    {
        name: "intro",
        title: "概览",
        path: "/intro",
        icon: "pie-graph",
        visible: true,
        children: [
            {
                name: "maps",
                title: "地图",
                path: "/map",
                visible: true,
                icon: "md-globe",
                children: [
                    {
                        name: "map",
                        title: "地图",
                        path: "/map",
                        visible: true,
                        icon: "md-globe"
                    },
                    {
                        name: "test",
                        title: "测试",
                        path: "/test",
                        visible: true,
                        icon: "md-globe"
                    }
                ]
            },
            {
                name: "layers",
                title: "图层",
                path: "/point-layer",
                visible: true,
                icon: "md-albums",
                children: [
                    {
                        name: "pointLayer",
                        title: "点图层",
                        path: "/point-layer",
                        visible: true,
                        icon: "pie-graph"
                    },

                    {
                        name: "editLayer",
                        title: "坐标编辑",
                        path: "/edit-layer",
                        visible: true,
                        icon: "pie-graph"
                    },

                    {
                        name: "heatmapLayer",
                        title: "热力图",
                        path: "/heatmap-layer",
                        visible: true,
                        icon: "pie-graph"
                    },
                    {
                        name: "trackLayer",
                        title: "轨迹",
                        path: "/track-layer",
                        visible: true,
                        icon: "pie-graph"
                    }
                ]
            },
            {
                name: "widgets",
                title: "插件",
                path: "/select-box",
                icon: "md-cube",
                visible: true,
                children: [
                    {
                        name: "selectBox",
                        title: "图层选择",
                        path: "/select-box",
                        visible: true,
                        icon: "pie-graph"
                    },
                    {
                        name: "infoWindow",
                        title: "信息窗口",
                        path: "/info-window",
                        visible: true,
                        icon: "pie-graph"
                    },
                    {
                        name: "overlay",
                        title: "遮罩物",
                        path: "/overlay",
                        visible: true,
                        icon: "pie-graph"
                    }
                ]
            }
        ]
    }
];

export default menus;
