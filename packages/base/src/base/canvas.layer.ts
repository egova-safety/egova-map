import { ISingleLayer } from "./single.layer";


/**
 * Canvas图层
 *
 * @export
 * @class CanvasLayer
 */
export interface ICanvasLayer extends ISingleLayer {

    clear(): void;
    show(): void;
    hide(): void;
    showDataList(items: Array<any>, changeExtent: boolean): void;

}
