export const DRAW_LAYER_OPTIONS = {
    onDrawCompleteEvent: function(geometry: any) {
        // console.log(eventName);
    }
};

/**
 * 绘画
 */
export interface IDraw {
    activate(mode: string, options?: any): void;

    finish(): void;
}
