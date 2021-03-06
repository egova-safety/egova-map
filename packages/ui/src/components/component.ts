import Activator from "./activator";
import Vue from "vue";
import base from "@egova/map-base";

/**
 * 地图组件基类。
 * @class
 * @version 1.0.0
 */
export default abstract class ComponentBase extends Vue {

    /**
     * 获取或设置组件支持的高德事件。
     * @protected
     * @member
     * @returns Array<string>
     */
    protected mapEvents: Array<string>;

    /**
     * 获取或设置高德地图实例。
     * @public
     * @property
     * @returns any
     */
    public map: base.MapView;

    public mapComponent: any;

    public get childrenComponents(): Array<ComponentBase> {
        if (this.$slots.default) {
            return this.$slots.default.filter(g => g.componentInstance != null).map(g => <ComponentBase>g.componentInstance);
        }
        return [];
    }

    /**
     * 初始化组件的新示例。
     * @constructor
     * @param  {Array<string>} events 组件支持的高德事件。
     */
    protected constructor(events: Array<string>) {
        super();
        this.mapEvents = events || [];
    }

    /**
     * 地图类型
     */
    public getMapType(): base.MapType | undefined {
        if (!this.map) {
            return undefined;
        }
        return this.map.options.mapType || "arcgis";
    }

    /**
     * 当创建组件时调用的钩子方法。
     * @protected
     * @override
     * @returns void
     */
    protected mounted(): void {
        const parentComponent = this.$parent as any;

        this.map = this.map || parentComponent.map;

        if (this.map) {
            this.register();
        } else {
            this.$on("map-ready", () => {
                this.register();
            });
        }
    }

    protected destroyed(): void {
        const component = this.mapComponent;

        if (component) {
            component.setMap && component.setMap(null);
            component.clear && component.clear();
            component.clearAll && component.clearAll();
        }
    }

    /**
     * 解析地图配置选项。
     * @protected
     * @returns object
     */
    protected resolveOptions(): any {
        const options: any = {};

        const {
            $options: { propsData: props = {} }
        } = this;

        const excludeNames = this.excludeNames();
        Object.keys(props).forEach((key: string) => {
            if (excludeNames.indexOf(key) < 0) {
                let value = (<any>props)[key];

                options[key] = value;
            }
        });

        const eventNames = Object.keys(this.$listeners).filter(
            (e: string) => ~this.mapEvents.indexOf(e)
        );

        for (const eventName of eventNames) {
            options[eventName] = this.$listeners[eventName];
        }

        return options;
    }

    protected register(): void {
        const result: any = this.initializeComponent(this.resolveOptions());

        if (result && result.then) {
            result.then((component: any) => {
                this.registerComponent(component);
            });
        } else {
            this.registerComponent(result);
        }
    }

    protected excludeNames(): Array<String> {
        return [];
    }

    protected registerComponent(component: any): void {
        // 设置组件实例
        if (!this.mapComponent && component) {
            this.mapComponent = component;
        }
    }

    /**
     * 根据指定
     * @param  {object} options
     * @returns void
     */
    protected initializeComponent(options: object): void {
        // virtual method
    }

    protected getService<T>(serviceType: Function | string, ...params: Array<any>) {
        return Activator.createInstance<T>(serviceType, ...params);
    }

    protected getMapClassType(name: string, mapType: string = this.getMapType()) {

        let serviceType: any;
        if (mapType === "arcgis") {
            let arcgisSDK = require("@egova/map-arcgis");
            if (arcgisSDK && arcgisSDK.default) {
                arcgisSDK = arcgisSDK.default;
            }
            serviceType = (<any>arcgisSDK)[name];
        } else if (mapType === "minemap") {
            let minemapSDK = require("@egova/map-minemap");
            if (minemapSDK && minemapSDK.default) {
                minemapSDK = minemapSDK.default;
            }
            serviceType = (<any>minemapSDK)[name];
        } else {
            throw new Error("不支持的地图类型" + mapType);
        }
        if (serviceType === undefined) {
            throw new Error(`在地图类型${mapType}中，未找到类型为${name}的成员`);
        }
        return serviceType;
    }
}
