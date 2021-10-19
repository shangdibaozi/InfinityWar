import { ecs } from "../../../../Libs/ECS";
import { AmmoFactory } from "./AmmoFactory";
import { EnemyFactory } from "./EnemyFactory";

export class Factory extends ecs.System {

    constructor() {
        super();

        this.add(new AmmoFactory());
        this.add(new EnemyFactory());
    }
}