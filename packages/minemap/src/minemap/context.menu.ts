import base from "@egova/map-base";
/**
 * 对Minemap地图封装
 */
export class ContextMenu implements base.ContextMenu {
    public enabled: boolean = false;

    public point: base.Point;

    public menu: any;

    public constructor(public mapView: base.MapView) {}

    public startup(_eventArgs: base.ContextMenuEventArgs): void {
        throw new Error("未实现");
    }

    public enable(): void {
        throw new Error("未实现");
    }

    public disable(): void {
        throw new Error("未实现");
    }
}
