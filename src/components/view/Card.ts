import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct, ICard, ICardWithImage, ICardBasket, ICardDetail } from '../../types';
import { categoryMap } from '../../utils/constants';

export abstract class Card<T extends ICard> extends Component<T> {
    protected titleElement: HTMLElement | null;
    protected priceElement: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = container.querySelector('.card__title');
        this.priceElement = container.querySelector('.card__price');
    }

    set title(value: string) {
        if (this.titleElement) {
            this.titleElement.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this.priceElement) {
            this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
        }
    }
}

export abstract class CardWithImage<T extends ICardWithImage> extends Card<T> {
    protected imageElement: HTMLImageElement | null;
    protected categoryElement: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this.imageElement = container.querySelector('.card__image');
        this.categoryElement = container.querySelector('.card__category');
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                this.categoryElement.className = `card__category ${modifier}`;
            }
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = value;
            this.imageElement.alt = 'Изображение товара';
        }
    }
}

export class CardCatalog extends CardWithImage<ICardWithImage> {
    constructor(
        container: HTMLElement,
        protected events: IEvents,
        protected product: IProduct
    ) {
        super(container);
        container.addEventListener('click', () => {
            this.events.emit('card-catalog:click', this.product);
        });
    }
}

export class CardDetail extends CardWithImage<ICardDetail> {
    protected descriptionElement: HTMLElement | null;
    protected addButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.descriptionElement = container.querySelector('.card__text');
        this.addButton = container.querySelector('.card__button');

        if (this.addButton) {
            this.addButton.addEventListener('click', () => {
                this.events.emit('card-detail:click');
            });
        }
    }

    set description(value: string) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = value;
        }
    }

    set buttonText(value: string) {
        if (this.addButton) {
            this.addButton.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this.addButton) {
            this.addButton.disabled = value;
        }
    }
}

export class CardBasket extends Card<ICardBasket> {
    protected itemIndexElement: HTMLElement | null;
    protected deleteButton: HTMLButtonElement | null;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        protected product: IProduct
    ) {
        super(container);
        this.itemIndexElement = container.querySelector('.basket__item-index');
        this.deleteButton = container.querySelector('.basket__item-delete') || container.querySelector('.card__button');

        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', () => {
                this.events.emit('card-basket:click', this.product);
            });
        }
    }

    set itemIndex(value: number) {
        if (this.itemIndexElement) {
            this.itemIndexElement.textContent = String(value);
        }
    }
}
