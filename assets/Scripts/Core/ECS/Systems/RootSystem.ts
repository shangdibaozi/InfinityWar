import { ecs } from "../../../Libs/ECS";
import { BoostSystem } from "./BoostSystem";
import { LifeTimerSystem } from "./LifeTimerSystem";
import { MoveSystem } from "./MoveSystem";
import { ShakeSystem } from "./ShakeSystem";
import { ShootSystem } from "./ShootSystem";
import { ObjFactory } from "./ObjFactory";

export class RootSystem extends ecs.RootSystem {

    constructor() {
        super();

        this.add(new ObjFactory());

        this.add(new BoostSystem());
        this.add(new MoveSystem());

        this.add(new ShootSystem());
        this.add(new ShakeSystem());

        
        this.add(new LifeTimerSystem());

    }
}