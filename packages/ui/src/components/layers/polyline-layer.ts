
import { component, config } from "../decorator";
import base from "@egova/map-base";
import ComponentBase from "@/components/component";

/**
 * 事件定义。
 * @private
 * @const
 */
const EVENTS = [
    "changeStandardModel",
    "getInfoWindowContext",
    "getDataList",
    "getLastStatus",
    "onLayerClick",
    "onMapLoad",
    "onCheckChanged",
    "onPositionChanged",
    "onVisibleChanged",
    "onEvent"
];
const EXCULDE_NAMES = ["requestData", "requestStatus", "vid", "source","options"];

/**
 * 线图层
 * @class
 * @version 1.0.0
 */
@component({ template: require("./polyline-layer.html") })
export default class PolylineLayerComponent extends ComponentBase {
    /**
     * 获取或设置图层ID。
     * @description 静态属性，仅支持初始化配置。
     * @public
     * @config
     * @returns string
     */
    @config({ type: String })
    public vid!: string;

    @config({ type: Object })
    public options: any;

    @config({ type: Object })
    public symbol: any;

    /**
     * 选择模式（0为未启用 1为单选，2为多选）
     */
    @config({ type: Number ,default: 0 })
    public selectMode: number = 0;

    /**
     * 要素单击时，是否显示信息窗口
     */
    @config({ type: Boolean,default: false  })
    public showInfoWindow: boolean;

    /**
     * 是否异常请求数据
     */
    @config({ type: Boolean,default: false  })
    public requestData: boolean ;

    /**
     * 是否异常请求状态
     */
    @config({ type: Boolean,default: false  })
    public requestStatus: boolean ;

    /**
     * 要素悬停时，是否显示tooltip信息
     */
    @config({ type: Boolean,default: false  })
    public showTooltip: boolean ;

    /**
     * 数据源
     */
    @config({ type: Array })
    public source!: Array<object>;

    public get mapComponent(): base.BusinessLayer {
        return this._mapComponent;
    }

    public set mapComponent(value: base.BusinessLayer) {
        this._mapComponent = value;
    }

    public constructor() {
        super(EVENTS);
    }

    /**
     * 准备创建组件时调用的钩子方法。
     * @protected
     * @override
     * @returns void
     */
    protected created(): void {
        // 监听 "source" 选项变动
        this.$watch("source",(source: Array<any>) => {
                if (this.mapComponent) {
                    this.mapComponent.clear();
                    this.mapComponent.saveGraphicList(source);
                }
            },
            { deep: true }
        );

        this.$watch("requestStatus",(v: boolean) => {
                if (this.mapComponent) {
                    if (v) {
                        this.mapComponent.start();
                    } else {
                        this.mapComponent.stop();
                    }
                }
            },
            { deep: true }
        );

        // 监听其他选项变动

        let watched = ["showTooltip","showInfoWindow","selectMode"];

        for (let prop of watched) {
            this.$watch(prop,v => {
                    if (this.mapComponent) {
                        (<any>this.mapComponent.options)[prop] = v;
                    }
                },
                { deep: true }
            );
        }
    }

    /**
     * 当创建组件时调用的钩子方法。
     * @protected
     * @override
     * @returns void
     */
    protected mounted(): void {
        // 调用基类方法
        super.mounted();
        // 初始化标记组件
        this.$on("map-ready", this.initialize);
    }

    /**
     * 当销毁组件后调用的钩子方法。
     * @protected
     * @override
     * @returns void
     */
    protected destroyed(): void {
        if (this.mapComponent) {
            (<base.BusinessLayer>this.mapComponent).clear();
        }
    }

    protected excludeNames(): Array<String> {
        return EXCULDE_NAMES;
    }

    /**
     * 初始化图层。
     * @private
     * @returns void
     */
    private async initialize(map: base.MapView): Promise<void> {
        if (!map) {
            return;
        }
        this.map = map;

        // 解析配置选项
        let options = this.resolveOptions();

        options = { ...this.options, ...options };

        let serviceType = this.getMapClassType("PolylineLayer");

        this._mapComponent = this.getService<base.BusinessLayer>(
            serviceType,
            this.map,
            this.vid,
            options
        );

        this.$emit("on-build", this._mapComponent);

        this.childrenComponents.forEach(vnode => {
            vnode.$emit("layer-ready", this._mapComponent);
        });

        // this.$children.forEach(child => {
        //     child.$emit("layer-ready", this._mapComponent);
        // });

        if (options["showInfoWindow"] && !options["getInfoWindowContext"]) {
            console.warn("没有定义getInfoWindowContext事件");
        }

        if (this.source && this.source.length > 0) {
            this._mapComponent.clear();
            this._mapComponent.saveGraphicList(this.source);
        }

        if (this.requestData && !options["getDataList"]) {
            console.warn("requestData为true时，必须定义getDataList事件");
        }

        if (this.requestStatus && !options["getLastStatus"]) {
            console.warn("requestStatus为true时，必须定义getLastStatus事件");
        }

        if (this.requestData && options["getDataList"]) {
            this._mapComponent.showDataList();
        }

        if (this.requestStatus && options["getLastStatus"]) {
            this._mapComponent.start();
        }

    }

}
