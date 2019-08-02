import { ISingleLayer } from "./single.layer";
import { EventProvider } from "../events";
import { MapView } from "./map.view";
import {
    LayerType,
    Graphic,
    Point
} from "./map.model";
import { EventArgs } from "../events";

export const GEOJSON_LAYER_OPTIONS = {
    onLayerClick: (evt: any): void => {
        console.log("onLayerClick");
    },
    onMapLoad: (): void => {
        console.log("onMapLoad");
    },
    onEvent: (eventName: string, evt: any) => {
        console.log("onEvent");
    },
    onVisibleChanged: (isShow: boolean) => {
        console.log("onVisibleChanged");
    },
    changeStandardModel: (model: any) => {
        return model;
    },
    getInfoWindowContext: (mode: any) => {
        return {
            title: "详细信息",
            content: "没有定制详细信息"
        };
    },
    autoInit: true,
    showTooltip: false,
    showInfoWindow: false,

};

/**
 * 功能图层包装类
 *
 * @export
 * @class FeatureLayer
 */
export abstract class GeojsonLayer extends EventProvider implements ISingleLayer {

    public layerType: string = LayerType.point; // point polyline polygon
    public isShow: boolean = true;

    public constructor(
        public mapView: MapView,
        public id: string,
        public options: any) {
        super();
        this.options = { ...GEOJSON_LAYER_OPTIONS, ...this.options }
        if (this.options.layerType) {
            this.layerType = this.options.layerType
        }
        this.id = id;
        if (this.options.autoInit) {
            this.onInit();
        }
    }

    /**
     * 要素集
     */
    public items: Array<any>;


    /**
     * 要素数量
     */
    public get count(): number {
        if (this.items) {
            return this.items.length;
        }
        return 0;
    }

    public abstract showDataList(items: Array<any>): Promise<void>;

    public refresh(): void {
        this.showDataList(this.items);
    }

    /**
     * 获取指定id的地图要素对象
     */
    public getItemById(id: string): any {

        for (let i = 0; i < this.items.length; i++) {
            const attrs = this.items[i];
            if (attrs.id === id) {
                return this.items[i];
            }
        }
        return null;
    }

    public getItemIndexById(id: string): number {

        for (let i = 0; i < this.items.length; i++) {
            const attrs = this.items[i];
            if (attrs.id === id) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 删除指定id的地图要素对象
     */
    public removeItemById(id: string): void {
        const i = this.getItemIndexById(id);
        if (i >= 0) {
            this.items.splice(i, 1);
        }
    }

    /**
     * 为指定的事件类型注册一个侦听器，以使侦听器能够接收事件通知。
     * @summary 如果不再需要某个事件侦听器，可调用 removeListener() 删除它，否则会产生内存问题。
     * 由于垃圾回收器不会删除仍包含引用的对象，因此不会从内存中自动删除使用已注册事件侦听器的对象。
     * @param  {string} type 事件类型。
     * @param  {Function} 处理事件的侦听器函数。
     * @param  {any} scope? 侦听函数绑定的 this 对象。
     * @param  {boolean} once? 是否添加仅回调一次的事件侦听器，如果此参数设为 true 则在第一次回调时就自动移除监听。
     * @returns void
     */
    public on(
        type: string,
        listener: Function,
        scope: any = this,
        once: boolean = false
    ): void {
        this.addListener(type, listener, scope, once);
    }

    /**
     * 移除侦听器。如果没有注册任何匹配的侦听器，则对此方法的调用没有任何效果。
     * @param  {string} type 事件类型。
     * @param  {Function} listener 处理事件的侦听器函数。
     * @param  {any} scope? 侦听函数绑定的 this 对象。
     * @returns void
     */
    public off(type: string, listener: Function, scope: any = this): void {
        this.removeListener(type, listener, scope);
    }


    protected add(item: any) {
        let it = this.onChangeStandardModel(item);
        if (this.getItemById(it))
            this.items.push(it);
    }

    protected remove(item: any) {
        let it = this.onChangeStandardModel(item);
        this.removeItemById(it.id);
    }


    // #region 坐标转换

    /**
     * 创建点要素（把业务数据的坐标转换成地图上的点）
     */
    public getPoint(item: any): Point {
        return this.mapView.getPoint(item);
    }

    /**
     * 把地图上的点转换成业务的坐标
     * @param {*} point
     */
    public formPoint(point: any): { latitude: number; longitude: number } {
        return this.mapView.onFormPoint(point);
    }

    // #endregion

    /**
     * 在指定id的graphic上打开InfoWindow
     * @param id  grahpic的唯一标识
     * @param context 内容
     * @param options 参数
     */
    public openInfoWindow(id: string, context: any, options: any): void {
        let item = this.getItemById(id);
        if (!item) {
            console.warn("该条数据不在图层内！id:", id);
            return;
        }
        let g: any = { geometry: this.getPoint(item), attributes: item, symbol: {} };
        if (context) {
            this.mapView.onShowInfoWindow({
                graphic: g,
                context: context,
                options: options || {}
            });
        } else {
            this.showInfoWindow({ graphic: g });
        }
    }

    /**
     * 关闭信息窗口
     */
    public closeInfoWindow(): void {
        this.mapView.closeInfoWindow();
    }

    /**
 * 显示InfoWindow（在flagwind包下可用，对外不要调用此方法）
 * @param args
 */
    public showInfoWindow(evt: { graphic: Graphic }): void {
        let context = this.onGetInfoWindowContext(evt.graphic.attributes);
        this.mapView.onShowInfoWindow({
            graphic: evt.graphic,
            context: {
                type: "html",
                title: context.title,
                content: context.content
            },
            options: {}
        });
        if (this.options.showInfoWindowCompleted) {
            this.options.showInfoWindowCompleted(evt.graphic.attributes);
        }
    }

    protected onGetInfoWindowContext(item: any): any {
        return this.options.getInfoWindowContext(item);
    }
    protected onInit(): void {


        if (this.mapView.loaded) {
            this.onLoad();
        } else {
            this.mapView.on("onLoad", () => this.onLoad());
        }
    }

    protected onLoad() {
        try {
            this.registerEvent();
            this.onMapLoad();
        } catch (error) {
            console.error(error);
        }
    }
    protected onMapLoad() {
        this.options.onMapLoad();
    }

    protected registerEvent(): void {
        this.on("onClick", (evt: EventArgs) => {
            this.onLayerClick(this, evt.data);
        });
        // 如果开启鼠标hover开关
        this.on("onMouseOver", (evt: EventArgs) => {
            if (this.options.showTooltip) {
                this.mapView.onShowTooltip(evt.data.graphic);
            }
            this.fireEvent("onMouseOver", evt.data);
        });
        this.on("onMouseOut", (evt: EventArgs) => {
            if (this.options.showTooltip) {
                this.mapView.onHideTooltip();
            }
            this.fireEvent("onMouseOut", evt.data);
        });
    }

    protected onLayerClick(deviceLayer: this, evt: any) {
        if (deviceLayer.options.onLayerClick) {
            deviceLayer.options.onLayerClick(evt);
        }
        if (deviceLayer.options.showInfoWindow) {
            evt.graphic.attributes.eventName = "";
            deviceLayer.showInfoWindow(evt);
        }
    }

    protected fireEvent(eventName: string, event: any) {
        this.options.onEvent(eventName, event);
    }

    protected onValidModel(item: any) {
        switch (this.layerType) {
            case LayerType.point:
                return item.id && item.longitude && item.latitude;
            case LayerType.polyline:
                return item.id && item.polyline;
            case LayerType.polygon:
                return item.id && item.polygon;
            default:
                return item.id && item.longitude && item.latitude;
        }
    }

    /**
     * 变换成标准实体
     *
     * @protected
     * @param {*} item
     * @returns {{ id: String, name: String, longitude: number, latitude: number }}
     * @memberof BusinessLayer
     */
    protected onChangeStandardModel(item: any): any {
        return this.options.changeStandardModel(item);
    }


    public abstract appendTo(map: any): void;
    public abstract removeLayer(map: any): void;
    public abstract show(): void;
    public abstract hide(): void;
}
