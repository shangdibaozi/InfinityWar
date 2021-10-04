import { Vec3 } from "cc";
import { UI_EVENT } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { ECSTag } from "../Components/ECSTag";
import { CCNodeComponent, MovementComponent } from "../Components/Movement";

export class MoveSystem extends ecs.ComblockSystem {

    init() {
        
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(CCNodeComponent, MovementComponent, ECSTag.CanMove);
    }

    update(entities: ecs.Entity[]): void {
        let dt = this.dt;
        for(let ent of entities) {
            let move = ent.get(MovementComponent);
            let ccnode = ent.get(CCNodeComponent);
            move.update(dt);
            ccnode.val.setPosition(move.pos);
            ccnode.val.angle = move.angle;
        }
    }

    
}