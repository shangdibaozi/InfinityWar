import { ecs } from "../../../Libs/ECS";
import { AmmoFactory } from "./Factory/AmmoFactory";
import { BoostSystem } from "./BoostSystem";
import { Factory } from "./Factory/Factory";
import { LifeTimerSystem } from "./LifeTimerSystem";
import { MoveSystem } from "./MoveSystem";
import { RockSystem } from "./RockSystem";
import { ShakeSystem } from "./ShakeSystem";
import { ShootSystem } from "./ShootSystem";

export class RootSystem extends ecs.RootSystem {

    constructor() {
        super();

        this.add(new Factory());

        this.add(new BoostSystem());
        this.add(new MoveSystem());

        this.add(new AmmoFactory());
        // this.add(new RockSystem());
        
        this.add(new ShootSystem());
        this.add(new ShakeSystem());

        
        this.add(new LifeTimerSystem());

    }
}