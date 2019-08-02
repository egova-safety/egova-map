import base from "@egova/map-base";

/**
 * 处理编辑要素图层
 */
export class EditLayer extends base.FeatureLayer
    implements base.IEditLayer {
    private graphic: any = null;
    private originInfo: any = {};
    public editObj: any;
    public options: any;
    public businessLayer: base.BusinessLayer;
    public mapView: base.MapView;

    public constructor(businessLayer: base.BusinessLayer, options: any) {
        super("edit_" + businessLayer.id, "编辑图层");
        this.options = { ...base.EDIT_LAYER_OPTIONS, ...options };
        this.layer = this.onCreateGraphicsLayer({ id: this.id });
        this.businessLayer = businessLayer;
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
            dojo.connect(
                dojo.byId("edit_point_" + model.id),
                "onclick",
                (evt: any) => {
                    const key = evt.target.attributes["key"].value;
                    this.activateEdit(key);
                }
            );
        };
        this.mapView = businessLayer.mapView;

        this.editObj = new esri.toolbars.Edit(this.mapView.innerMap); // 编辑对象,在编辑图层进行操作
        this.mapView.addFeatureLayer(this);
        if (this.mapView.innerMap.loaded) {
            this.onLoad();
        } else {
            this.mapView.innerMap.on("load", () => {
                this.onLoad();
            });
        }
    }

    /**
     * 激活编辑事件
     * @param key 要编辑要素的id
     */
    public activateEdit(key: string): void {
        let graphic = this.businessLayer.getGraphicById(key);
        if (!graphic) {
            console.log("无效的代码：" + key);
            return;
        }
        this.businessLayer.hide();
        this.show();
        let editGraphic = this.businessLayer.creatGraphicByModel(
            graphic.attributes
        );
        this.layer.add(editGraphic);
        editGraphic.attributes.eventName = "start";
        let tool = esri.toolbars.Edit.MOVE;
        // map.disableDoubleClickZoom();//禁掉鼠标双击事件
        this.editObj.activate(tool, editGraphic, null); // 激活编辑工具
        this.graphic = editGraphic;
        this.originInfo = editGraphic.attributes;
        this.showInfoWindow();
    }

    /**
     * 取消编辑要素
     */
    public cancelEdit(key: string) {
        this.editObj.deactivate();
        this.clear();
        this.hide();
        this.mapView.innerMap.infoWindow.hide();
        this.businessLayer.show();

        let graphic = this.businessLayer.getGraphicById(key);
        graphic.attributes.eventName = "delete";
        this.businessLayer.showInfoWindow({
            graphic: graphic
        });
    }

    public onLoad() {
        if (!this.layer._map) {
            this.layer._map = this.mapView.innerMap;
        }
        try {
            this.registerEvent();
        } catch (error) {
            console.error(error);
        }
    }

    public get map(): any {
        return this.mapView.map;
    }

    public get spatial(): any {
        return this.mapView.spatial;
    }

    public onCreateGraphicsLayer(args: any) {
        let layer = new esri.layers.GraphicsLayer(args);
        layer.addToMap = function(map: any) {
            map.addLayer(this);
        };
        layer.removeFromMap = function(map: any) {
            map.removeLayer(this);
        };
        return layer;
    }

    public onChanged(options: any, isSave: boolean): Promise<boolean> {
        return this.options.onEditInfo(options, isSave);
    }

    public showInfoWindow() {
        const title = this.businessLayer.title;
        this.map.infoWindow.setTitle(title);
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
        this.map.infoWindow.setContent(content);
        const pt = this.graphic.geometry;
        this.map.infoWindow.show(pt);
        dojo.connect(dojo.byId("resetOrdinate"), "onclick", (evt: any) => {
            const key = evt.target.attributes["key"].value;
            this.cancelEdit(key);
        });
        dojo.connect(dojo.byId("applyOrdinate"), "onclick", (evt: any) => {
            const key = evt.target.attributes["key"].value;
            this.confirm(key);
        });
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
        this.map.infoWindow.hide();
        this.businessLayer.show();
    }

    protected registerEvent(): void {
        dojo.connect(this.layer, "onClick", (evt: any) => {
            this.graphic = evt.graphic;
            this.onLayerClick(this, evt);
        });

        console.log("编辑对象：" + this.editObj);
        dojo.on(this.editObj, "graphic-first-move", () => {
            console.log("要素移动---------graphic-first-move");
            this.mapView.innerMap.infoWindow.hide();
        });
        dojo.on(this.editObj, "graphic-click", () => {
            this.showInfoWindow();
        });
        dojo.on(this.editObj, "graphic-move-stop", () => {
            this.showInfoWindow();
        });
    }

    protected onLayerClick(editLayer: this, evt: any) {
        if (editLayer.businessLayer.options.onLayerClick) {
            editLayer.businessLayer.options.onLayerClick(evt);
        }

        if (editLayer.businessLayer.options.showInfoWindow) {
            editLayer.businessLayer.showInfoWindow(evt);
        }
    }
}
