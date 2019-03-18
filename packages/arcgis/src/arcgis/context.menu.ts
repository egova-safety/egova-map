import base from "@egova/map-base";
import { MapView } from "./map.view";
/**
 * 对ArcGIS右键菜单实现
 */
export class ContextMenu implements base.ContextMenu {
    public enabled: boolean = false;

    public point: base.Point;

    public menu: any;

    public constructor(public mapView: MapView) {}

    public startup(eventArgs: base.ContextMenuEventArgs): void {
        const menus = eventArgs.menus;
        this.menu = new dijit.Menu({
            onOpen: (box: any) => {
                this.point = this.getMapPointFromMenuPosition(
                    box,
                    this.mapView.innerMap
                );
            }
        });
        for (let i = 0; i < menus.length; i++) {
            this.menu.addChild(
                new dijit.MenuItem({
                    label: menus[i],
                    onClick: function() {
                        eventArgs.onClick(this.label);
                    }
                })
            );
        }
        this.menu.startup();
    }

    public enable(): void {
        if (this.enabled) {
            console.info("已经开启快捷菜单");
            return;
        }
        this.enabled = true;
        this.menu.bindDomNode(this.mapView.innerMap.container);
    }

    public disable(): void {
        this.enabled = false;
        this.menu.unBindDomNode(this.mapView.innerMap.container);
    }

    /**
     * 获取菜单单击的坐标信息
     */
    public getMapPointFromMenuPosition(box: any, map: any): base.Point {
        let x = box.x,
            y = box.y;
        switch (box.corner) {
            case "TR":
                x += box.w;
                break;
            case "BL":
                y += box.h;
                break;
            case "BR":
                x += box.w;
                y += box.h;
                break;
        }
        const screenPoint = new esri.geometry.Point(
            x - map.position.x,
            y - map.position.y
        );
        return map.toMap(screenPoint);
    }
}
