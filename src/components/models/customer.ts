import { ICustomer, TPayment, CustomerError } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';
export class Customer {
    private payment: TPayment | '';
    private address: string;
    private email: string;
    private phone: string;
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    setPayment(payment: TPayment | ''): void {
        this.payment = payment;
        this.emitDataChanged();
    }

    setAddress(address: string): void {
        this.address = address;
        this.emitDataChanged();
    }

    setEmail(email: string): void {
        this.email = email;
        this.emitDataChanged();
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.emitDataChanged();
    }

    getData(): ICustomer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    clear(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.emitDataChanged();
    }

    validate(): CustomerError {
        const errors: CustomerError = {};

        if (!this.payment) {
            errors.payment = 'Способ оплаты не выбран';
        }

        if (!this.address || this.address.trim() === '') {
            errors.address = 'Адрес не может быть пустым';
        }

        if (!this.email || this.email.trim() === '') {
            errors.email = 'Email не может быть пустым';
        }

        if (!this.phone || this.phone.trim() === '') {
            errors.phone = 'Телефон не может быть пустым';
        }

        return errors;
    }

    private emitDataChanged(): void {
        this.events.emit('customer:changed', this.getData());
    }
}