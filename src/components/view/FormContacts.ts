import { Form } from './Form';
import { IFormContacts } from '../../types/index';
import { IEvents } from '../base/Events';

export class FormContacts extends Form<IFormContacts> {
    protected emailInput: HTMLInputElement | null;
    protected phoneInput: HTMLInputElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.emailInput = container.querySelector('input[name="email"]');
        this.phoneInput = container.querySelector('input[name="phone"]');

        if (this.emailInput) {
            this.emailInput.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                this.events.emit('contact:email', { email: target.value });
            });
        }

        if (this.phoneInput) {
            this.phoneInput.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                this.events.emit('contact:phone', { phone: target.value });
            });
        }

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('order:pay');
        })
    }

    set email(value: string | null) {
        if (this.emailInput) {
            this.emailInput.value = value || '';
        }
    }

    set phone(value: string | null) {
        if (this.phoneInput) {
            this.phoneInput.value = value || '';
        }
    }
}