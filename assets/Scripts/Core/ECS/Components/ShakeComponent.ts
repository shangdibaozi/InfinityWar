import { Vec3, v3 } from "cc";
import { Shake } from "../../../Common/Shake";
import { ecs } from "../../../Libs/ECS";
import { CCNodeComponent } from "./Movement";

let pos = v3();

@ecs.register('ShakeComponent')
export class ShakeComponent extends ecs.Comp {
    originPos: Vec3 = v3();
    pos: Vec3 = v3();

    xShakes: Shake[] = [];
    yShakes: Shake[] = [];

    /**
     * 
     * @param amplitude 振幅（单位：像素）
     * @param frequence 频率（次/秒）
     * @param duration 即震屏持续时长（单位：秒）
     */
    shake(amplitude: number, frequence: number, duration: number, originPos?: Vec3) {
        if(!originPos) {
            this.originPos.set(this.ent.get(CCNodeComponent).val.getPosition(pos));
        }
        this.xShakes.push(Shake.new(amplitude, frequence, duration));
        this.yShakes.push(Shake.new(amplitude, frequence, duration));
    }

    reset() {
        this.originPos.set(Vec3.ZERO);
        this.pos.set(Vec3.ZERO);
        this.xShakes.length = 0;
        this.yShakes.length = 0;
    }
}