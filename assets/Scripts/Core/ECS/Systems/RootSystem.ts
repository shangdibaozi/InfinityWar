import { ecs } from "../../../Libs/ECS";
import { LifeTimerSystem } from "./LifeTimerSystem";
import { MoveSystem } from "./MoveSystem";

export class RootSystem extends ecs.RootSystem {

    constructor() {
        super();

        this.add(new MoveSystem());
        this.add(new LifeTimerSystem());
    }
}