import { ecs } from "../../Libs/ECS";
import { ECSTag } from "./Components/ECSTag";
import { LifeTimerComponent } from "./Components/LifeTimerComponent";
import { CCNodeComponent, MovementComponent } from "./Components/Movement";


export class BulletEntity extends ecs.Entity {
    static create() {
        let ent = ecs.createEntity<BulletEntity>();
        ent.add(CCNodeComponent);
        ent.add(MovementComponent);
        ent.add(ECSTag.TypeBullet);
        ent.add(LifeTimerComponent).lifeTime = 3;
        return ent;
    }

    CCNode: CCNodeComponent;
    Movement: MovementComponent;
    LifeTimer: LifeTimerComponent;
    
}