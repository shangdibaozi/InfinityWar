import { ObjPool } from "../../../Common/ObjPool";
import { ecs } from "../../../Libs/ECS";
import { LifeTimerComponent } from "../Components/LifeTimerComponent";
import { CCNodeComponent } from "../Components/Movement";

export class LifeTimerSystem extends ecs.ComblockSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(LifeTimerComponent);
    }
    update(entities: ecs.Entity[]): void {
        for(let ent of entities) {
            let t = ent.get(LifeTimerComponent).lifeTime -= this.dt;
            if(t <= 0) {
                if(ent.has(CCNodeComponent)) {
                    ObjPool.putNode(ent.get(CCNodeComponent).val);
                }
                ent.destroy();
            }
        }
    }

}