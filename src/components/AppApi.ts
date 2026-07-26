import {
    IApi,
    IOrderRequest,
    IProductsResponse,
    IOrderResponse
} from "../types/index.ts";

export class AppApi {
    private api: IApi;
    constructor(api: IApi) {
        this.api = api;
    }
    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>("/product/");
    }
    postOrder(data: IOrderRequest): Promise<IOrderResponse> {
        console.log('📤 Отправка заказа:',
        JSON.stringify(data,
        null,
        2));
        return this.api.post<IOrderResponse>("/order/",
        data);
    }
}