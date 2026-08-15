import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class Catalog {
    private products: IProduct[];
    private selectedProduct: IProduct | null;
    private events: IEvents;

    constructor(events: IEvents, products: IProduct[] = []) {
        this.events = events;
        this.products = products;
        this.selectedProduct = null;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:changed', { products: this.products });
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(productId: string): IProduct | undefined {
        return this.products.find(product => product.id === productId);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('card:selected', { product: this.selectedProduct });
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}