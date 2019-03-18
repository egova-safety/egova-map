import base from "@egova/map-base";
import { PointLayer } from "./point.layer";
import { Point, PointGraphic } from "./map.model";

/**
 * 编辑要素图层
 */
export class EditLayer implements base.IEditLayer {
    private graphic: PointGraphic;
    private draggingFlag: boolean = false;
    private cursorOverPointFlag: boolean = false;
    public isShow: boolean = true;
    public options: any;

    public constructor(
        public businessLayer: PointLayer,
        options: Object
    ) {
        this.options = { ...base.EDIT_LAYER_OPTIONS, ...options };
    }

    public get map(): any {
        return this.businessLayer.mapView.map;
    }

    public appendTo(map: any): void {
        this.graphic.addTo(map);
    }
    public removeLayer(_map: any): void {
        this.graphic.remove();
    }

    public show(): void {
        this.graphic.show();
        this.isShow = true;
    }
    public hide(): void {
        this.graphic.show();
        this.isShow = false;
    }

    public registerEvent(graphic: PointGraphic): void {
        graphic.on("onMouseOver", (_args: base.EventArgs) => {
            // console.log("test--->onMouseOver");
            this.cursorOverPointFlag = true;
            // me.map.dragPan.disable();
        });
        graphic.on("onMouseOut", (_args: base.EventArgs) => {
            // console.log("test--->onMouseOut");
            this.cursorOverPointFlag = false;
            this.map.dragPan.enable();
        });
        graphic.on("onMouseDown", (_args: base.EventArgs) => {
            if (!this.cursorOverPointFlag) return;
            this.draggingFlag = true;
            console.log("test--->onMouseDown");
            (<any>window)._editLayer = this;
            console.log("test--->map.on.mousemove");
            this.map.on("mousemove", this.mouseMovePoint);
            this.map.dragPan.disable();
        });
        graphic.on("onMouseUp", (_args: base.EventArgs) => {
            console.log("test--->onMouseUp");
            if (!this.draggingFlag) return;
            this.draggingFlag = false;
            console.log("test--->map.off.mousemove");
            this.map.off("mousemove", this.mouseMovePoint);
            (<any>window)._editLayer = null;
            this.updatePoint();
        });
    }

    public updatePoint() {
        let isOK = confirm(
            "确定要更新坐标为x:" +
                this.graphic.geometry.x +
                ",y:" +
                this.graphic.geometry.y
        );
        if (!isOK) {
            this.cancelEdit(this.graphic.attributes.id);
            return;
        }
        let graphic: PointGraphic = this.businessLayer.getGraphicById(
            this.graphic.attributes.id
        );
        graphic.setGeometry(
            new Point(
                this.graphic.geometry.x,
                this.graphic.geometry.y,
                graphic.geometry.spatial
            )
        );

        let lnglat = this.businessLayer.mapView.onFormPoint(
            this.graphic.geometry
        );

        this.onChanged(
            {
                key: this.graphic.attributes.id,
                longitude: lnglat.longitude,
                latitude: lnglat.latitude
            },
            isOK
        );
    }

    public mouseMovePoint(e: any) {
        let editLayer = (<any>window)._editLayer;
        if (!editLayer) {
            return;
        }
        console.log(
            "test-->status  over:" +
                editLayer.cursorOverPointFlag +
                ".drag:" +
                editLayer.draggingFlag
        );
        if (!editLayer.draggingFlag) return;
        console.log("test-->update  x:" + e.lngLat.lng + ".y:" + e.lngLat.lat);
        let point = new Point(e.lngLat.lng, e.lngLat.lat);
        (<any>editLayer.graphic).geometry = point;
    }

    public activateEdit(key: string): void {
        let g: PointGraphic = this.businessLayer.getGraphicById(key);
        if (g) {
            this.graphic = g.clone(g.id + "_copy");
        }
        this.businessLayer.hide();
        this.graphic.addTo(this.map);
        this.registerEvent(this.graphic);
    }

    public cancelEdit(_key: string): void {
        this.graphic.remove();
        this.map.off("mousemove", this.mouseMovePoint);
        this.businessLayer.show();
        this.map.dragPan.enable();
        this.cursorOverPointFlag = false;
        this.draggingFlag = false;
    }

    public onChanged(_options: any, _isSave: boolean): Promise<boolean> {
        return new Promise<boolean>((resolve, _reject) => {
            resolve(true);
        });
    }
}
