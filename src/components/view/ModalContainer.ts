import { Component } from '../base/Component';
import { IModalContainer } from '../../types';
import { IEvents } from '../base/Events';

export class ModalContainer extends Component<IModalContainer> {
    protected closeButton: HTMLButtonElement | null;
    protected contentElement: HTMLElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = container.querySelector('.modal__close');
        this.contentElement = container.querySelector('.modal__content');

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.close();
                this.events.emit('modal:close');
            });
        }

        container.addEventListener('click', (event) => {
            if (event.target === container) {
                this.close();
                this.events.emit('modal:close');
            }
        });
    }

    set content(value: HTMLElement) {
        if (this.contentElement) {
            this.contentElement.replaceChildren(value);
        }
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}