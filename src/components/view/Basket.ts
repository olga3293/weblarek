import { Component } from '../base/Component';
import { IBasket } from '../../types';
import { IEvents } from '../base/Events';

export class Basket extends Component<IBasket> {
    protected basketListElement: HTMLElement | null;
    protected basketButton: HTMLButtonElement | null;
    protected basketPriceElement: HTMLElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketListElement = container.querySelector('.basket__list');
        this.basketButton = container.querySelector('.basket__button');
        this.basketPriceElement = container.querySelector('.basket__price');

        if (this.basketButton) {
            this.basketButton.addEventListener('click', () => {
                this.events.emit('basket-button:click');
            });
        }
    }
    
    set basketList(items: HTMLElement[]) {
        if (this.basketListElement) {
            this.basketListElement.replaceChildren(...items);
        }

        this.buttonDisabled = items.length === 0;
    }

    set basketPrice(value: string) {
        if (this.basketPriceElement) {
            this.basketPriceElement.textContent = value;
        }
    }
    set buttonDisabled(value: boolean) {
        if (this.basketButton) {
            this.basketButton.disabled = value;
        }
    }
}