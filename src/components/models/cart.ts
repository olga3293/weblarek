import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';
export class Cart {
    private products: IProduct[];
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this.products = [];
    }

    getCartProducts(): IProduct[] {
        return this.products;
    }

    addToCart(product: IProduct): void {
        if (!product) {
            console.warn('Попытка добавить undefined в корзину');
            return;
        }

        if (product.price === null) {
            console.warn(`Товар "${product.title}" не может быть добавлен в корзину (цена не указана)`);
            return;
        }

        if (this.hasProduct(product.id)) {
            console.warn(`Товар "${product.title}" уже в корзине`);
            return;
        }

        this.products.push(product);
        this.events.emit('cart:changed', {
            products: this.products,
            totalCount: this.getTotalCount(),
            totalPrice: this.getTotalPrice()
        });
    }

    removeFromCart(product: IProduct): void {
        const index = this.products.findIndex((item) => item.id === product.id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.events.emit('cart:changed', {
                products: this.products,
                totalCount: this.getTotalCount(),
                totalPrice: this.getTotalPrice()
            });
        }
    }

    clearCart(): void {
        this.products = [];
        this.events.emit('cart:changed', {
            products: this.products,
            totalCount: 0,
            totalPrice: 0
        });
    }

    getTotalPrice(): number {
        return this.products.reduce((total, product) => {
            return total + (product.price ?? 0);
        }, 0);
    }

    getTotalCount(): number {
        return this.products.length;
    }

    hasProduct(productId: string): boolean {
        return this.products.some(product => product.id === productId);
    }
}