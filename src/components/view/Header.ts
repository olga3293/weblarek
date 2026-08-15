import { Component } from '../base/Component';
import { IHeader } from '../../types';
import { IEvents } from '../base/Events';

export class Header extends Component<IHeader> {
    protected basketButton: HTMLButtonElement | null;
    protected counterElement: HTMLElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketButton = container.querySelector('.header__basket');
        this.counterElement = container.querySelector('.header__basket-counter');

        if (this.basketButton) {
            this.basketButton.addEventListener('click', () => {
                this.events.emit('header-basket:click');
            });
        }
    }

    set counter(value: number) {
        if (this.counterElement) {
            this.counterElement.textContent = String(value);
        }
    }
}