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
        component: () => import("@s/views/dashboard"),
        children: [
            {
                path: "/map",
                component: () => import("@s/views/map")
            },
            {
                path: "/point-layer",
                component: () => import("@s/views/point-layer")
            },
            {
                path: "/edit-layer",
                component: () => import("@s/views/edit-layer")
            },
            {
                path: "/select-box",
                component: () => import("@s/views/select-box")
            },
            {
                path: "/track-layer",
                component: () => import("@s/views/track-layer")
            },
            {
                path: "/heatmap-layer",
                component: () => import("@s/views/heatmap-layer")
            },
            {
                path: "/info-window",
                component: () => import("@s/views/info-window")
            },
            {
                path: "/overlay",
                component: () => import("@s/views/overlay")
            }
        ]
    }
];

export default routes;
