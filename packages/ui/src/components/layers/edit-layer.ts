import { component, config } from "../decorator";
import base from "@egova/map-base";
import ComponentBase from "../component";

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
export class EditLayerComponent extends ComponentBase {

    @config({ type: Object })
    public options: any;

    public mapComponent: base.IEditLayer;

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

        if (this.childrenComponents.length === 0) {
            throw new Error("未添加待编辑的图层");
        }

        this.childrenComponents.forEach(vnode => {
            vnode.$emit("map-ready", this.map);
        });

        let layer = this.childrenComponents[0].mapComponent;

        this.mapComponent = this.getService<base.IEditLayer>(
            serviceType,
            layer,
            options
        );

        this.$emit("on-build", this.mapComponent);

        if (!options["onEditInfo"]) {
            console.warn("没有定义 onEditInfo 事件");
        }
    }
}
