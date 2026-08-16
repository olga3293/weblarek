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

const cardPreview = new CardDetail(
    cloneTemplate('#card-preview'),
    () => events.emit('card-detail:click')
);

const DEFAULT_IMAGE = './src/images/Subtract.svg';

function getProductImage(product: IProduct): string {
    return product.image || DEFAULT_IMAGE;
}

function renderGallery(): void {
    const itemCards = catalogModel.getProducts().map((product) => {
        const card = new CardCatalog(
            cloneTemplate('#card-catalog'),
            () => events.emit('card-catalog:click', { id: product.id })
        );
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

    const inCart = cartModel.hasProduct(product.id);

    cardPreview.title = product.title;
    cardPreview.price = product.price;
    cardPreview.category = product.category;
    cardPreview.image = getProductImage(product);
    cardPreview.description = product.description || '';

    if (product.price === null) {
        cardPreview.buttonText = 'Недоступно';
        cardPreview.buttonDisabled = true;
    } else if (inCart) {
        cardPreview.buttonText = 'Удалить из корзины';
        cardPreview.buttonDisabled = false;
    } else {
        cardPreview.buttonText = 'Купить';
        cardPreview.buttonDisabled = false;
    }

    cardPreview.render(product);    
}

function renderBasket(): void {
    const products = cartModel.getCartProducts();
    const basketList = products.map((product, index) => {
        const card = new CardBasket(
            cloneTemplate('#card-basket'),
            () => events.emit('card-basket:click', { id: product.id })
        );
        card.title = product.title;
        card.price = product.price;
        card.itemIndex = index + 1;
        return card.render();
    });

    basket.basketList = basketList;
    basket.basketPrice = `${cartModel.getTotalPrice()} синапсов`;
    modal.content = basket.render();
}

function renderFormOrder(): void {
    const data = customerModel.getData();
    const errors = customerModel.validate();
    
    formOrder.payment = data.payment;
    formOrder.address = data.address;
    formOrder.valid = !errors.payment && !errors.address;
    formOrder.textError = errors.payment || errors.address || '';
}

function renderFormContacts(): void {
    const data = customerModel.getData();
    const errors = customerModel.validate();
    
    formContacts.email = data.email;
    formContacts.phone = data.phone;
    formContacts.valid = !errors.email && !errors.phone;
    formContacts.textError = errors.email || errors.phone || '';
}

events.on('catalog:changed', () => {
    renderGallery();
});

events.on('card:selected', () => {
    renderProductPreview();
});

events.on('cart:changed', () => {
    renderBasket();
    renderProductPreview();
    header.counter = cartModel.getTotalCount();
});

events.on('customer:changed', () => {
    renderFormOrder();
    renderFormContacts();
});

events.on('card-catalog:click', ({ id }: { id: string }) => {
    const product = catalogModel.getProductById(id);
    if (product) {
        catalogModel.setSelectedProduct(product);
    }
    modal.content = cardPreview.render();
    modal.open();
});

events.on("card-detail:click", () => {
  const product = catalogModel.getSelectedProduct();
  if (product) {
    const inCart = cartModel.hasProduct(product.id);
    if (inCart) {
      cartModel.removeFromCart(product);
      modal.close();
    } else {
      cartModel.addToCart(product);
    }
    renderProductPreview();
    modal.content = cardPreview.render();
  }
});

events.on('header-basket:click', () => {
    renderBasket();
    modal.open();
});

events.on('card-basket:click', ({ id }: { id: string }) => {
    const product = catalogModel.getProductById(id);
    if (product) {
        cartModel.removeFromCart(product);
    }
});

events.on('basket-button:click', () => {
    renderFormOrder();
    modal.content = formOrder.render();
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
    const errors = customerModel.validate();
    if (!errors.payment && !errors.address) {
        renderFormContacts();
        modal.content = formContacts.render();
    } else {
        renderFormOrder();
        modal.content = formOrder.render();
    }
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

    const errors = customerModel.validate();
    if (errors.email || errors.phone) {
        renderFormContacts();
        modal.content = formContacts.render();
        return;
    }

    const orderData: IOrderRequest = {
        payment: data.payment,
        address: data.address,
        email: data.email,
        phone: data.phone,
        total: cartModel.getTotalPrice(),
        items: cartProducts.map((item) => item.id),
    };

    try {
        const result = await api.postOrder(orderData);
        if (result.total) {
            orderSuccess.successDescription = `Списано ${result.total} синапсов`;
        }
        cartModel.clearCart();
        customerModel.clear();
        modal.content = orderSuccess.render();
        modal.open();
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
    }
});

events.on('modal:close', () => {
    modal.close();
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
