import { Form } from './Form.ts';
import { IFormContacts } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class FormContacts extends Form<IFormContacts> {
    protected emailInput: HTMLInputElement | null;
    protected phoneInput: HTMLInputElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.emailInput = container.querySelector('input[name="email"]');
        this.phoneInput = container.querySelector('input[name="phone"]');

        if (this.emailInput) {
            this.emailInput.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                this.events.emit('contact:email', { email: target.value });
                this.validateForm();
            });
        }

        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                this.events.emit('contact:phone', { phone: target.value });
                this.validateForm();
            });
        }

        if (this.submitButton) {
            this.submitButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.events.emit('order:pay');
            });
        }
    }

    set email(value: string | null) {
        if (this.emailInput) {
            this.emailInput.value = value || '';
        }
        this.validateForm();
    }

    set phone(value: string | null) {
        if (this.phoneInput) {
            this.phoneInput.value = value || '';
        }
        this.validateForm();
    }

    private validateForm(): void {
        if (this.submitButton) {
            const hasEmail = this.emailInput && this.emailInput.value.trim() !== '';
            const hasPhone = this.phoneInput && this.phoneInput.value.trim() !== '';
            this.submitButton.disabled = !(hasEmail && hasPhone);
        }
    }
}
