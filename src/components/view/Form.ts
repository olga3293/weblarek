import { Component } from '../base/Component.ts';
import { IForm } from '../../types/index.ts';

export abstract class Form<T extends IForm> extends Component<T> {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement | null;
    protected errorsElement: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this.form = this.container as HTMLFormElement;
        this.submitButton = container.querySelector('button[type="submit"]');
        this.errorsElement = container.querySelector('.form__errors');
    }

    set textError(value: string) {
        if (this.errorsElement) {
            this.errorsElement.textContent = value;
        }
    }

    set valid(value: boolean) {
        if (this.submitButton) {
            this.submitButton.disabled = !value;
        }
    }
}