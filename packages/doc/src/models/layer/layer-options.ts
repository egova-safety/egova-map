export default interface ILayerOptions {
    layerType: string;
    symbol: any;
    changeStandardModel(model: any): any;
    getInfoWindowContext(model: any): string;
}
