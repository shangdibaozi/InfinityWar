import { Shake } from "../../../Common/Shake";
import { ecs } from "../../../Libs/ECS";
import { CCNodeComponent } from "../Components/Movement";
import { ShakeComponent } from "../Components/ShakeComponent";

export class ShakeSystem extends ecs.ComblockSystem {

    filter(): ecs.IMatcher {
        return ecs.allOf(ShakeComponent, CCNodeComponent);
    }
    
    update(entities: ecs.Entity[]): void {
        let dt = this.dt;
        for(let ent of entities) {
            let shakeComp = ent.get(ShakeComponent);
            let xShakeAmount = shakeComp.originPos.x;
            let yShakeAmount = shakeComp.originPos.y;
            let hasShake = false;
            if(shakeComp.xShakes.length > 0 || shakeComp.yShakes.length > 0) {
                hasShake = true;
                let xShakes = shakeComp.xShakes;
                let yShakes = shakeComp.yShakes;
                let len = xShakes.length - 1;
                for(let i = len; i >= 0; i--) {
                    xShakes[i].update(dt);
                    xShakeAmount += xShakes[i].getAmplitude();
                    if(xShakes[i].notShaking) {
                        Shake.push(xShakes[i]);
                        xShakes.splice(i, 1);
                    }
                }

                len = yShakes.length - 1;
                for(let i = len; i >= 0; i--) {
                    yShakes[i].update(dt);
                    yShakeAmount += yShakes[i].getAmplitude();
                    if(yShakes[i].notShaking) {
                        Shake.push(yShakes[i]);
                        yShakes.splice(i, 1);
                    }
                }
            }
            ent.get(CCNodeComponent).val.setPosition(xShakeAmount, yShakeAmount, shakeComp.originPos.z);
            if(!hasShake) {
                ent.remove(ShakeComponent);
            }
        }
    }

}