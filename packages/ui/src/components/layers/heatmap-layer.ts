
import { component, config } from "../decorator";
import base from "@egova/map-base";
import ComponentBase from "@/components/component";

/**
 * 事件定义。
 * @private
 * @const
 */
const EVENTS = ["changeStandardModel"];

const EXCULDE_NAMES = ["vid", "source" , "options"];

/**
 * 点图层
 * @class
 * @version 1.0.0
 */
@component({ template: require("./heatmap-layer.html") })
export default class HeatmapLayerComponent extends ComponentBase {

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

    /**
     * 模糊半径
     */
    @config({ type: Number, default: 12 })
    public blurRadius: number;

    /**
     * 颜色
     */
    @config({ type: Array })
    public colorStops: Array<any> | undefined;
    
    /**
     * 数据源
     */
    @config({ type: Array })
    public source!: Array<object>;

    public get mapComponent(): base.IHeatmapLayer {
        return this._mapComponent;
    }

    public set mapComponent(value: base.IHeatmapLayer) {
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
        this.$watch("source", (source: Array<any>) => {
            if (this.mapComponent) {
                this.mapComponent.clear();
                this.mapComponent.showDataList(source,false);
            }

        }, ({ deep: true }));

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
            (<base.IHeatmapLayer>this.mapComponent).clear();
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

        let serviceType = this.getMapClassType("HeatmapLayer");

        this._mapComponent = this.getService<base.IHeatmapLayer>(
            serviceType,
            this.map,
            this.vid,
            options
        );

        this.$emit("on-build", this._mapComponent);

        this.$children.forEach(child => {
            child.$emit("layer-ready", this._mapComponent);
        });

        if (this.source && this.source.length > 0) {
            this._mapComponent.clear();
            this._mapComponent.showDataList(this.source, false);
        }
    }

}
