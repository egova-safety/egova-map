/**
 * 底图包装类
 *
 * @export
 * @class TiledLayer
 */
export interface ILayer {
    isShow: boolean;

    show(): void;

    hide(): void;
}
