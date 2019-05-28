import base from "@egova/map-base";
import { PointLayer } from "./point.layer";
import { Point, PointGraphic } from "./map.model";

/**
 * 编辑要素图层
 */
export class EditLayer implements base.IEditLayer {
    private graphic: PointGraphic;
    private originInfo: any = {};
    private draggingFlag: boolean = false;
    private cursorOverPointFlag: boolean = false;
    public isShow: boolean = true;
    public options: any;

    public constructor(
        public businessLayer: PointLayer,
        options: Object
    ) {
        this.options = { ...base.EDIT_LAYER_OPTIONS, ...options };
        const funGetInfoWindowContext = this.businessLayer.options.getInfoWindowContext;
        this.businessLayer.options.getInfoWindowContext = (model: any) => {
            let context = funGetInfoWindowContext(model);
            context.content +=
                "<a key='" +
                model.id +
                "' id='edit_point_" +
                model.id +
                "' class='fm-btn edit-point'>更新坐标</a>";
            return context;
        };
        this.businessLayer.options.showInfoWindowCompleted = (model: any) => {
            let editButton = document.querySelector(`#edit_point_${model.id}.fm-btn`) as HTMLElement;
            editButton.onclick = () => {
                this.activateEdit(model.id);
                this.showInfoWindow();
            }
        };
    }

    public get map(): any {
        return this.businessLayer.mapView.map;
    }
    public get mapView(): base.MapView {
        return this.businessLayer.mapView;
    }

    public appendTo(map: any): void {
        this.graphic.addTo(map);
    }
    public removeLayer(_map: any): void {
        this.graphic.remove();
    }

    public clear(): void {
        this.removeLayer(this.map)
    }

    public show(): void {
        this.graphic.show();
        this.isShow = true;
    }
    public hide(): void {
        this.graphic.hide();
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
            this.mapView.onCloseInfoWindow();
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
            this.showInfoWindow();
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
            this.closeInfoWindow();
            return;
        }
        let graphic: PointGraphic = this.businessLayer.getGraphicById(this.graphic.attributes.id);
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
        console.log("test-->status  over:" + editLayer.cursorOverPointFlag + ".drag:" + editLayer.draggingFlag);
        if (!editLayer.draggingFlag) return;
        console.log("test-->update  x:" + e.lngLat.lng + ".y:" + e.lngLat.lat);
        let point = new Point(e.lngLat.lng, e.lngLat.lat);
        (<any>editLayer.graphic).geometry = point;
    }

    public activateEdit(key: string): void {
        let g: PointGraphic = this.businessLayer.getGraphicById(key);

        this.graphic = g.clone(g.id + "_copy");
        this.originInfo = { ...g.attributes };
        this.businessLayer.hide();
        this.graphic.addTo(this.map);
        this.registerEvent(this.graphic);
    }

    public cancelEdit(_key: string): void {
        this.clear();
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

    public closeInfoWindow() {
        this.mapView.onCloseInfoWindow();
    }

    public showInfoWindow() {
        const title = this.businessLayer.title;
        // ----+-+++--------------------------------------------------------------------------------------------------------+this.map.infoWindow.setTitle(title);
        let content = "";
        content =
            '<div><span class=\'opertate-tooltip\'>操作提示：请拖动图标至目标位置，点击 "完成" 会提示保存修改，点击"取消"将取消修改！</span></div><br/>';
        content +=
            "<a><span id='resetOrdinate'  class='btn btn-primary btn-transparent outline mt5 deleteOrdinate' " +
            "key=" +
            this.graphic.attributes.id +
            ">取消</span></a>";
        content +=
            "<a><span id='applyOrdinate'  class='btn btn-primary btn-transparent outline mt5 deleteOrdinate' " +
            "key=" +
            this.graphic.attributes.id +
            ">完成</span></a>";


        // this.map.infoWindow.setContent(content);

        this.mapView.onShowInfoWindow({
            graphic: this.graphic,
            context: {
                type: "html",
                title: title,
                content: content
            }
        });
        document.getElementById("resetOrdinate").onclick = (evt: any) => {
            const key = evt.target.attributes["key"].value;
            this.cancelEdit(key);
            this.closeInfoWindow();
        };
        document.getElementById("applyOrdinate").onclick = (evt: any) => {
            const key = evt.target.attributes["key"].value;
            this.confirm(key);
        };
    }

    public confirm(key: string) {
        (<any>this.options).confirm({
            title: "确定要进行更改吗？",
            content:
                "初始坐标值（经度）:" +
                this.originInfo.longitude +
                ",（纬度）:" +
                this.originInfo.latitude +
                "\r当前坐标值（经度）:" +
                this.graphic.geometry.x.toFixed(8) +
                ",（纬度）:" +
                this.graphic.geometry.y.toFixed(8),
            onOk: () => {
                let pt = this.graphic.geometry;
                let lonlat = this.businessLayer.formPoint(pt);
                let changeInfo = { ...this.graphic.attributes, ...lonlat };

                // 异步更新，请求成功才更新位置，否则不处理，
                this.options
                    .onEditInfo(
                        {
                            id: key,
                            latitude: changeInfo.latitude,
                            longitude: changeInfo.longitude
                        },
                        true
                    )
                    .then(() => {
                        this.businessLayer.removeGraphicById(changeInfo.id);
                        this.businessLayer.addGraphicList([changeInfo]);
                    });
            },
            onCancel: () => {
                this.options.onEditInfo(
                    {
                        id: key,
                        latitude: this.originInfo.latitude,
                        longitude: this.originInfo.longitude
                    },
                    false
                );
            }
        });

        this.graphic.attributes.eventName = "stop";
        this.clear();
        this.hide();
        this.closeInfoWindow();
        this.businessLayer.show();
    }
}
