import { component, config } from "../decorator";
import base from "@egova/map-base";
import Component from "../component";

/**
 * 事件定义。
 * @private
 * @const
 */
const EVENTS = ["onEditInfo"];

const EXCULDE_NAMES = ["options"];

/**
 * 点图层
 * @class
 * @version 1.0.0
 */
@component({ template: require("./edit-layer.html") })
export default class EditLayerComponent extends Component {
    
    @config({ type: Object })
    public options: any;

    public get mapComponent(): base.IEditLayer {
        return this._mapComponent;
    }

    public set mapComponent(value: base.IEditLayer) {
        this._mapComponent = value;
    }

    public constructor() {
        super(EVENTS);
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
            // this.mapComponent.clear();
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

        let serviceType = this.getMapClassType("EditLayer");

        if (this.$children.length === 0) {
            throw new Error("未添加待编辑的图层");
        }

        this.$children.forEach(child => {
            child.$emit("map-ready", this.map);
        });

        let layer = (<Component>this.$children[0]).mapComponent;

        this._mapComponent = this.getService<base.IEditLayer>(
            serviceType,
            layer,
            options
        );

        this.$emit("on-build", this._mapComponent);

        if (!options["onEditInfo"]) {
            console.warn("没有定义 onEditInfo 事件");
        }
    }
}
