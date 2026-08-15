import { Component } from '../base/Component.ts';
import { IForm } from '../../types/index.ts';

export abstract class Form<T extends IForm> extends Component<T> {
    protected submitButton: HTMLButtonElement | null;
    protected errorsElement: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this.submitButton = container.querySelector('button[type="submit"]');
        this.errorsElement = container.querySelector('.form__errors');
    }

    set textError(value: string) {
        if (this.errorsElement) {
            this.errorsElement.textContent = value;
        }
    }

    protected onInputChange(_field: keyof T, _value: string): void {
        // Метод для переопределения в дочерних классах
    }
}