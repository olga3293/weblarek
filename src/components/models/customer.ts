import {
    ICustomer,
    TPayment,
    CustomerError
} from '../../types/index.ts';
import {
    IEvents
} from '../base/Events.ts';

export class Customer {
    private payment: TPayment;
    private address: string | null;
    private email: string | null;
    private phone: string | null;
    private events: IEvents;
    constructor(events: IEvents) {
        this.events = events;
        this.payment = '' as TPayment;
        this.address = null;
        this.email = null;
        this.phone = null;
    }
    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit('customer:payment:changed',
        {
            payment
        });
        this.emitDataChanged();
    }
    setAddress(address: string | null): void {
        this.address = address;
        this.events.emit('customer:address:changed',
        {
            address
        });
        this.emitDataChanged();
    }
    setEmail(email: string | null): void {
        this.email = email;
        this.events.emit('customer:email:changed',
        {
            email
        });
        this.emitDataChanged();
    }
    setPhone(phone: string | null): void {
        this.phone = phone;
        this.events.emit('customer:phone:changed',
        {
            phone
        });
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
        this.payment = '' as TPayment;
        this.address = null;
        this.email = null;
        this.phone = null;
        this.events.emit('customer:cleared',
        {
        });
        this.emitDataChanged();
    }
    validate(): CustomerError {
        const errors: CustomerError = {
        };
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
        this.events.emit('customer:validated',
        {
            errors,
            isValid: Object.keys(errors).length === 0
        });
        return errors;
    }
    private emitDataChanged(): void {
        this.events.emit('customer:data:changed',
        this.getData());
    }
}