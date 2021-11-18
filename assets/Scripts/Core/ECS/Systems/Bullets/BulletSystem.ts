import { ecs } from "../../../../Libs/ECS";
import { HomingProjectileSystem } from "./HomingProjectileSystem";
import { NinetyDegreeChangeProjectileSystem } from "./NinetyDegreeChangeProjectileSystem";
import { WavyProjectileSystem } from "./WavyProjectileSystem";

export class BulletSystem extends ecs.System {
    constructor() {
        super();

        this.add(new HomingProjectileSystem());
        this.add(new NinetyDegreeChangeProjectileSystem());
        this.add(new WavyProjectileSystem());
    }
}