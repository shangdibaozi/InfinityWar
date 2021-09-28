import { ecs } from "../../../Libs/ECS";
import { CCNodeComponent, MovementComponent } from "../Components/Movement";

export class MoveSystem extends ecs.ComblockSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(CCNodeComponent, MovementComponent);
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