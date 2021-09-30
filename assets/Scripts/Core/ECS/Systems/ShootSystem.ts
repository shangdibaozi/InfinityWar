import { ecs } from "../../../Libs/ECS";
import { ECSTag } from "../Components/ECSTag";
import { MovementComponent } from "../Components/Movement";
import { ShootComopnent } from "../Components/ShootComponent";

export class ShootSystem extends ecs.ComblockSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ShootComopnent, MovementComponent, ECSTag.CanShoot);
    }

    update(entities: ecs.Entity[]): void {
        let dt = this.dt;
        for(let ent of entities) {
            ent.get(ShootComopnent).shoot(dt, ent.get(MovementComponent).heading);
        }
    }


}