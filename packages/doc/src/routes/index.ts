/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 *
 * Licensed under the MIT License.
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved.
 */

const routes = [
    {
        name: "main",
        path: "/",
        redirect: "/map",
        title: "首页",
        component: () => import("@/views/dashboard"),
        children: [
            {
                path: "/map",
                component: () => import("@/views/map")
            },
            {
                path: "/point-layer",
                component: () => import("@/views/point-layer")
            },
            {
                path: "/edit-layer",
                component: () => import("@/views/edit-layer")
            },
            {
                path: "/select-box",
                component: () => import("@/views/select-box")
            },
            {
                path: "/track-layer",
                component: () => import("@/views/track-layer")
            },
            {
                path: "/heatmap-layer",
                component: () => import("@/views/heatmap-layer")
            },
            {
                path: "/info-window",
                component: () => import("@/views/info-window")
            },
            {
                path: "/overlay",
                component: () => import("@/views/overlay")
            }
        ]
    }
];

export default routes;
