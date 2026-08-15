import { Component } from '../base/Component';
import { IOrderSuccess } from '../../types';
import { IEvents } from '../base/Events';

export class OrderSuccess extends Component<IOrderSuccess> {
    protected descriptionElement: HTMLElement | null;
    protected closeButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.descriptionElement = container.querySelector('.order-success__description');
        this.closeButton = container.querySelector('.order-success__close');

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.events.emit('modal:close');
            });
        }
    }

    set successDescription(value: string) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = value;
        }
    }
}