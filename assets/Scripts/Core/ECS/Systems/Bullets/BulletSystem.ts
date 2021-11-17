import { ecs } from "../../../../Libs/ECS";
import { HomingProjectileSystem } from "./HomingProjectileSystem";
import { NinetyDegreeChangeProjectileSystem } from "./NinetyDegreeChangeProjectileSystem";

export class BulletSystem extends ecs.System {
    constructor() {
        super();

        this.add(new HomingProjectileSystem());
        this.add(new NinetyDegreeChangeProjectileSystem());
    }
}