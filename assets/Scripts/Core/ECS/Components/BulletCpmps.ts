import { ecs } from "../../../Libs/ECS";

@ecs.register('HomingProjectile')
export class HomingProjectileComp extends ecs.Comp {

    target: ecs.Entity;

    reset() {
        this.target = null;
    }
}