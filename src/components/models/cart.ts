import {
    IProduct
} from '../../types/index.ts';
import {
    IEvents
} from '../base/Events.ts';

export class Cart {
    private products: IProduct[];
    private events: IEvents;
    constructor(events: IEvents) {
        this.events = events;
        this.products = [];
    }
    getCartProducts(): IProduct[] | null {
        return this.products.length > 0 ? this.products : null;
    }
    getAvailableProducts(): IProduct[] {
        return this.products.filter(p => p.price !== null);
    }
    getUnavailableProducts(): IProduct[] {
        return this.products.filter(p => p.price === null);
    }
    addToCart(product: IProduct): void {
        if (!product) {
            console.warn('Попытка добавить undefined в корзину');
            return;
        }
        this.products.push(product);
        this.events.emit('cart:product:added',
        {
            product
        });
        this.events.emit('cart:changed',
        {
            products: this.products,
            totalCount: this.getTotalCount(),
            totalPrice: this.getTotalPrice()
        });
    }
    removeFromCart(product: IProduct): void {
        const index = this.products.indexOf(product);
        if (index !== -1) {
            this.products.splice(index,
            1);
            this.events.emit('cart:product:removed',
            {
                product
            });
            this.events.emit('cart:changed',
            {
                products: this.products,
                totalCount: this.getTotalCount(),
                totalPrice: this.getTotalPrice()
            });
        }
    }
    clearCart(): void {
        this.products = [];
        this.events.emit('cart:cleared',
        {
        });
        this.events.emit('cart:changed',
        {
            products: this.products,
            totalCount: 0,
            totalPrice: 0
        });
    }
    getTotalPrice(): number {
        if (!this.products || !Array.isArray(this.products)) {
            return 0;
        }
        return this.products.reduce((total,
        product) => {
            if (!product) {
                return total;
            }
            const price = product.price;
            if (typeof price === 'number') {
                return total + price;
            }
            return total;
        },
        0);
    }
    getTotalCount(): number {
        return this.products.length;
    }
    hasProduct(productId: string): boolean {
        return this.products.some(product => product && product.id === productId);
    }
}