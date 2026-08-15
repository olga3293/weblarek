import { Component } from '../base/Component.ts';
import { IGallery } from '../../types/index.ts';

export class Gallery extends Component<IGallery> {
    protected galleryElement: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this.galleryElement = container;
    }

    set catalog(items: HTMLElement[]) {
        if (this.galleryElement) {
            this.galleryElement.replaceChildren(...items);
        }
    }
}