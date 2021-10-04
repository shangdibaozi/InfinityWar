import { _decorator } from "cc";
import { ecs } from "../../../Libs/ECS";
import { CCNodeComponent } from "./Movement";
import { ShakeComponent } from "./ShakeComponent";

const { ccclass, property } = _decorator;
@ccclass('GameCameraComponent')
@ecs.register('GameCamera')
export class GameCameraComponent extends ecs.Comp {
    @property({
        tooltip: '振幅'
    })
    amplitude: number = 16;

    @property({
        tooltip: '帧频'
    })
    frequence: number = 120;

    @property({
        tooltip: '持续时长'
    })
    duration: number = 0.4;

    shake() {
        let shakeComp = this.ent.get(ShakeComponent);
        if(!shakeComp) {
            shakeComp = this.ent.add(ShakeComponent);
        }
        shakeComp.shake(this.amplitude, this.frequence, this.duration);
    }

    reset(): void {
        
    }

}