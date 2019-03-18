
import { component, config } from "../decorator";
import base from "@egova/map-base";
import Component from "@/components/component";

/**
 * 事件定义。
 * @private
 * @const
 */
const EVENTS = ["onCheckChanged"];

const EXCULDE_NAMES = ["command","options"];

/**
 * 点图层
 * @class
 * @version 1.0.0
 */
@component({ template: require("./select-box.html")  })
export default class SelectBoxComponent extends Component {

    @config({ type: Number, default: 2 })
    public selectMode: base.SelectMode = 2;

    @config({ type: Object })
    public options: any;

    public get mapComponent(): base.ISelectBox {
        return this._mapComponent;
    }

    public set mapComponent(value: base.ISelectBox) {
        this._mapComponent = value;
    }

    public constructor() {
        super(EVENTS);
    }

    protected active(mode: string) {
        this._mapComponent.active(mode);
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
            this.mapComponent.destroy();
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
        // 解析配置选项
        let options = this.resolveOptions();

        options = { ...this.options, ...options };

        this.map = map;

        let serviceType = this.getMapClassType("SelectBox");

        let selecbox = this.getService<base.ISelectBox>(serviceType, this.map, options);

        this.$children.forEach(child => {
            child.$emit("map-ready", this.map);
            selecbox.addLayer((<any>child).mapComponent);
        });

        this._mapComponent = selecbox;
        selecbox.deleteSelectBar();

        this.$emit("on-build", this._mapComponent);

    }

}
