import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Cart } from './components/models/cart';
import { Catalog } from './components/models/catalog';
import { Customer } from './components/models/customer';
import { AppApi } from './components/AppApi';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Basket } from './components/view/Basket';
import { ModalContainer } from './components/view/ModalContainer';
import { OrderSuccess } from './components/view/OrderSuccess';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';
import { CardCatalog, CardDetail, CardBasket } from './components/view/Card';
import { IProduct, IOrderRequest } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const customerModel = new Customer(events);
const api = new AppApi(new Api(API_URL));

const page = document.body;
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery', page));
const header = new Header(ensureElement<HTMLElement>('.header', page), events);
const basket = new Basket(cloneTemplate('#basket'), events);
const modal = new ModalContainer(ensureElement<HTMLElement>('.modal', page), events);
const orderSuccess = new OrderSuccess(cloneTemplate('#success'), events);
const formOrder = new FormOrder(cloneTemplate('#order'), events);
const formContacts = new FormContacts(cloneTemplate('#contacts'), events);

const DEFAULT_IMAGE = './src/images/Subtract.svg';

type ModalView = 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null;
let currentModalView: ModalView = null;

function getProductImage(product: IProduct): string {
    return product.image || DEFAULT_IMAGE;
}

function renderGallery(): void {
    const itemCards = catalogModel.getProducts().map((product) => {
        const card = new CardCatalog(cloneTemplate('#card-catalog'), events, product);
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = getProductImage(product);
        return card.render();
    });
    gallery.catalog = itemCards;
}

function renderProductPreview(): void {
    const product = catalogModel.getSelectedProduct();
    if (!product) return;

    const card = new CardDetail(cloneTemplate('#card-preview'), events);
    const inCart = cartModel.hasProduct(product.id);

    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = getProductImage(product);
    card.description = product.description || '';

    if (product.price === null) {
        card.buttonText = 'Недоступно';
        card.buttonDisabled = true;
    } else if (inCart) {
        card.buttonText = 'Удалить из корзины';
        card.buttonDisabled = false;
    } else {
        card.buttonText = 'Купить';
        card.buttonDisabled = false;
    }

    modal.content = card.render();
    modal.open();
    currentModalView = 'preview';
}

function renderBasket(): void {
    const products = cartModel.getCartProducts();
    const basketList = products.map((product, index) => {
        const card = new CardBasket(cloneTemplate('#card-basket'), events, product);
        card.title = product.title;
        card.price = product.price;
        card.itemIndex = index + 1;
        return card.render();
    });

    basket.basketList = basketList;
    basket.basketPrice = `${cartModel.getTotalPrice()} синапсов`;
    basket.buttonDisabled = products.length === 0;
}

function renderFormOrder(): void {
    const data = customerModel.getData();
    const errors = customerModel.validate();
    formOrder.payment = data.payment;
    formOrder.address = data.address;
    formOrder.textError = errors.payment || errors.address || '';
}

function renderFormContacts(): void {
    const data = customerModel.getData();
    const errors = customerModel.validate();
    formContacts.email = data.email;
    formContacts.phone = data.phone;
    formContacts.textError = errors.email || errors.phone || '';
}

// События моделей
events.on('catalog:changed', () => {
    renderGallery();
});

events.on('card:selected', () => {
    renderProductPreview();
});

events.on('cart:changed', () => {
    header.counter = cartModel.getTotalCount();

    if (currentModalView === 'preview') {
        renderProductPreview();
    }

    if (currentModalView === 'basket') {
        renderBasket();
        modal.content = basket.render();
    }
});

events.on('customer:changed', () => {
    renderFormOrder();
    renderFormContacts();
});

// События представлений
events.on('card-catalog:click', (product: IProduct) => {
    catalogModel.setSelectedProduct(product);
});

events.on('card-detail:click', () => {
    const product = catalogModel.getSelectedProduct();
    if (!product) return;

    if (cartModel.hasProduct(product.id)) {
        currentModalView = null;
        cartModel.removeFromCart(product);
        modal.close();
    } else {
        cartModel.addToCart(product);
    }
});

events.on('header-basket:click', () => {
    renderBasket();
    modal.content = basket.render();
    modal.open();
    currentModalView = 'basket';
});

events.on('card-basket:click', (product: IProduct) => {
    cartModel.removeFromCart(product);
});

events.on('basket-button:click', () => {
    renderFormOrder();
    modal.content = formOrder.render();
    currentModalView = 'order';
});

events.on('payment:card', () => {
    customerModel.setPayment('card');
});

events.on('payment:cash', () => {
    customerModel.setPayment('cash');
});

events.on('customer-address:input', ({ address }: { address: string }) => {
    customerModel.setAddress(address);
});

events.on('form-order-button:click', () => {
    renderFormContacts();
    modal.content = formContacts.render();
    currentModalView = 'contacts';
});

events.on('contact:email', ({ email }: { email: string }) => {
    customerModel.setEmail(email);
});

events.on('contact:phone', ({ phone }: { phone: string }) => {
    customerModel.setPhone(phone);
});

events.on('order:pay', async () => {
    const data = customerModel.getData();
    const cartProducts = cartModel.getCartProducts();

    const orderData: IOrderRequest = {
        email: data.email,
        address: data.address,
        phone: data.phone,
        payment: data.payment,
        total: cartModel.getTotalPrice(),
        items: cartProducts.map((item) => item.id),
    };

    try {
        const result = await api.postOrder(orderData);
        orderSuccess.successDescription = `Списано ${result.total} синапсов`;
        modal.content = orderSuccess.render();
        currentModalView = 'success';
        cartModel.clearCart();
        customerModel.clear();
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
    }
});

events.on('modal:close', () => {
    modal.close();
    currentModalView = null;
});

(async () => {
    try {
        const products = await api.getProducts();
        const productsWithImages = products.items.map((product) => ({
            ...product,
            image: product.image ? `${CDN_URL}${product.image}` : DEFAULT_IMAGE,
        }));
        catalogModel.setProducts(productsWithImages);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
})();
