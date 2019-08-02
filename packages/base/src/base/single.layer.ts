import { ILayer } from "./layer";

/**
 * 单类型图层
 *
 * @export
 * @class ISingleLayer
 */
export interface ISingleLayer extends ILayer {
    appendTo(map: any): void;

    removeLayer(map: any): void;
}
