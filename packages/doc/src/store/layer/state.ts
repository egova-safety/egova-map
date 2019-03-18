import * as models from "@/models";

export default class State {
    /**
     * 获取所有菜单项列表。
     * @member
     * @returns Array<models.IMenuItem>
     */
    public items: Array<models.ILayerOptions> = new Array<
        models.ILayerOptions
    >();

    /**
     * 查找指定路径的菜单项。
     * @param  {string} path 菜单路径字符串。
     * @returns models.IMenuItem 菜单项，如果未找到对应路径的菜单项则为 null。
     */
    public findItem(
        layerType: string,
        items: Array<models.ILayerOptions> = this.items
    ): models.ILayerOptions | null {
        // 不允许查找根路径
        if (layerType === "/") {
            return null;
        }

        let result: models.ILayerOptions | null = null;

        for (let item of items) {
            if (
                item.layerType &&
                item.layerType.toLocaleLowerCase() ===
                    layerType.toLocaleLowerCase()
            ) {
                result = item;

                break;
            }
        }

        return result;
    }
}
