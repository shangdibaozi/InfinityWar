import { ecs } from "../../../Libs/ECS";
import { BoostSystem } from "./BoostSystem";
import { LifeTimerSystem } from "./LifeTimerSystem";
import { MoveSystem } from "./MoveSystem";
import { ShakeSystem } from "./ShakeSystem";
import { ShootSystem } from "./ShootSystem";
import { ObjFactory } from "./ObjFactory";
import { CollisionCheckSystem } from "./CollisionCheckSystem";
import { BulletSystem } from "./Bullets/BulletSystem";

export class RootSystem extends ecs.RootSystem {

    constructor() {
        super();

        this.add(new ObjFactory());

        this.add(new BoostSystem());
        
        this.add(new ShootSystem());
        this.add(new ShakeSystem());
        
        this.add(new BulletSystem());
        
        this.add(new MoveSystem());

        this.add(new CollisionCheckSystem());
        
        this.add(new LifeTimerSystem());

    }
}