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
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;
}
export type TPayment = 'cash' | 'card';

export type CustomerError = Partial<Record<keyof ICustomer, string>>;
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}
export interface IOrderRequest {
    payment: TPayment | '';
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
export interface IGallery {
    catalog: HTMLElement[];
}
export interface ICard {
    title: string;
    price: number | null;
}
export interface ICardWithImage extends ICard {
    image: string;
    category: string;
}
export interface ICardDetail extends ICardWithImage {
    description: string;
    buttonDisabled: boolean;
}
export interface ICardBasket extends ICard {
    itemIndex: number;
}
export interface IHeader {
    counter: number;
}
export interface IBasket {
    basketList: HTMLElement[];
    basketPrice: string;
    buttonDisabled: boolean;
}
export interface IModalContainer {
    content: HTMLElement;
}
export interface IOrderSuccess {
    successDescription: string;
}
export interface IForm {
    textError: string;
}
export interface IFormOrder extends IForm {
    payment: string | null;
    address: string | null;
}
export interface IFormContacts extends IForm {
    email: string | null;
    phone: string | null;
}
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
export interface IOrderActions {
    onChooseCard?: () => void;
    onChooseCash?: () => void;
    onAddressInput?: (value: string) => void;
    onClickFurther?: () => void;
    onEmailInput?: (value: string) => void;
    onPhoneInput?: (value: string) => void;
    onClickPay?: () => void;
}
export interface ICloseAction {
    onClose?: () => void;
}
