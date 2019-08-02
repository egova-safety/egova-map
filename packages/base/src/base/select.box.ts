import { BusinessLayer } from "./business.layer";

// tslint:disable-next-line:interface-name
export interface SelectBoxOptions {
    selectMode: number;
    onDrawStart: () => void;
    onDrawEnd: () => void;
    onCheckChanged: (checkItems: Array<any>, layer: BusinessLayer) => void;
}

/**
 * 地图选择工具
 */
export interface ISelectBox {
    isActive: boolean;

    layers: Array<BusinessLayer>;

    active(mode: string): void;

    showSelectBar(): void;

    deleteSelectBar(): void;

    getLayerById(id: string): BusinessLayer | null;

    deleteSelectBar(): void;

    addLayer(layer: BusinessLayer): void;

    removeLayer(layer: BusinessLayer): void;

    show(): void;

    hide(): void;

    clear(): void;

    destroy(): void;
}
