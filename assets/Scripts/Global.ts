import { EventTarget, Node } from "cc";

class UIEvent extends EventTarget {
    constructor() {
        super();
    }
}

export class Global {
    static uiEvent: UIEvent = new UIEvent();

    static gameLayer: Node;
    static bulletLayer: Node;
}

