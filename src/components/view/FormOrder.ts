import { Form } from './Form';
import { IFormOrder } from '../../types/index';
import { IEvents } from '../base/Events';

export class FormOrder extends Form<IFormOrder> {
    protected addressInput: HTMLInputElement | null;
    protected cardButton: HTMLButtonElement | null;
    protected cashButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.addressInput = container.querySelector('input[name="address"]');
        this.cardButton = container.querySelector('button[name="card"]');
        this.cashButton = container.querySelector('button[name="cash"]');

        if (this.addressInput) {
            this.addressInput.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                this.events.emit('customer-address:input', { address: target.value });
            });
        }

        if (this.cardButton) {
            this.cardButton.addEventListener('click', () => {
                this.events.emit('payment:card');
            });
        }

        if (this.cashButton) {
            this.cashButton.addEventListener('click', () => {
                this.events.emit('payment:cash');
            });
        }

       
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('form-order-button:click');
        })
        
    }

    set payment(value: string | null) {
        if (this.cardButton && this.cashButton) {
            this.cardButton.classList.remove('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');

            if (value === 'card') {
                this.cardButton.classList.add('button_alt-active');
            } else if (value === 'cash') {
                this.cashButton.classList.add('button_alt-active');
            }
        }
    }

    set address(value: string | null) {
        if (this.addressInput) {
            this.addressInput.value = value || '';
        }
    }
}