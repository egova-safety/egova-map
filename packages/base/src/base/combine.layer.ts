import { ILayer } from "./layer";

/**
 * 组合类型图层
 *
 * @export
 * @class ICombineLayer
 */
export interface ICombineLayer extends ILayer {
    clearAll(): void;
}
