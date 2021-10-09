import { Component, _decorator } from "cc";
import { ecs } from "../../../Libs/ECS";
const { ccclass, property } = _decorator;

@ccclass('CCComp')
export abstract class CCComp extends Component implements ecs.IComp {
    
    static tid: number = -1;
    static compName: string;

    canRecycle: boolean;
    ent: ecs.Entity;

    onLoad() {
        this.ent = ecs.createEntity();
        this.ent.addObj(this);    
    }

    abstract reset(): void;
}