export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string,
    data: object,
    method?: ApiPostMethods): Promise<T>;
}
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
export interface ICustomer {
    payment: TPayment;
    email: string | null;
    phone: string | null;
    address: string | null;
}
export type TPayment = 'cash' | 'card' | '';

export type CustomerError = {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
};
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}
export interface IOrderRequest {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
export interface IOrderResponse {
    id: string;
    total: number;
}
export interface IApiError {
    error: string;
}
export interface IAppApi {
    getProducts(): Promise<IProduct[]>;
    postOrder(orderData: IOrderRequest): Promise<IOrderResponse>;
}