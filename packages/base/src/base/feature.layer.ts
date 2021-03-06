import { ISingleLayer } from "./single.layer";
import { Graphic } from "./map.model";
import { EventProvider } from "../events";

/**
 * 功能图层包装类
 *
 * @export
 * @class FeatureLayer
 */
export abstract class FeatureLayer extends EventProvider implements ISingleLayer {
    protected layer: any;
    public isShow: boolean = true;

    public constructor(public id: string, public title: string | null) {
        super();
        this.id = id;
    }

    /**
     * 要素集
     */
    public get graphics(): Array<Graphic> {
        return this.layer.graphics;
    }

    /**
     * 要素对应的绑定项集
     */
    public get items(): Array<any> {
        return this.graphics.map(g => g.attributes);
    }

    /**
     * 要素数量
     */
    public get count(): number {
        if (this.layer) {
            return this.graphics.length;
        }
        return 0;
    }

    /**
     * 添加至地图对象中
     * @param map 
     */
    public appendTo(map: any) {
        this.layer.addToMap(map);
    }

    /**
     * 从地图中移除
     * @param map 
     */
    public removeLayer(map: any) {
        this.layer.removeFromMap(map);
    }

    /**
     * 清除
     */
    public clear(): void {
        this.layer.clear();
    }

    /**
     * 显示
     */
    public show(): void {
        this.isShow = true;
        this.layer.show();
    }

    /**
     * 隐藏
     */
    public hide(): void {
        this.isShow = false;
        this.layer.hide();
    }

    /**
     * 获取指定id的地图要素对象
     */
    public getGraphicById(id: string): any {
        const graphics = this.graphics;
        for (let i = 0; i < graphics.length; i++) {
            const attrs = graphics[i].attributes;
            if (attrs.id === id) {
                return graphics[i];
            }
        }
        return null;
    }

    /**
     * 删除指定id的地图要素对象
     */
    public removeGraphicById(id: string): void {
        const graphic = this.getGraphicById(id);
        if (graphic != null) {
            this.layer.remove(graphic);
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

    /**
     * 创建要素图层
     * @param args 创建要素图层的参数
     */
    public abstract onCreateGraphicsLayer(args: any): any;

    protected add(graphic: Graphic) {
        this.layer.add(graphic);
    }

    protected remove(graphic: Graphic) {
        this.layer.remove(graphic);
    }
}
