import { ecs } from "../../../../Libs/ECS";
import { HomingProjectileSystem } from "./HomingProjectileSystem";

export class BulletSystem extends ecs.System {
    constructor() {
        super();

        this.add(new HomingProjectileSystem());
    }
}