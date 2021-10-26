
import { _decorator, Component, Node, Collider2D } from 'cc';
import { ObjPool } from '../../Common/ObjPool';
import { PhysicsGroup } from '../../Constants';
import { ecs } from '../../Libs/ECS';
import { CCComp } from '../ECS/Components/CCComp';
import { ECSTag } from '../ECS/Components/ECSTag';
import { HealthComp } from '../ECS/Components/HealthComp';
import { CCNodeComponent, MovementComponent } from '../ECS/Components/Movement';
const { ccclass, property } = _decorator;

@ecs.register('Rock')
@ccclass('Rock')
export class Rock extends CCComp {
    
    c2d: Collider2D = null;

    health: HealthComp = new HealthComp();
    movement: MovementComponent = new MovementComponent();

    onLoad() {
        super.onLoad();

        this.c2d = this.getComponent(Collider2D);

        this.ent.add(this.health);
        this.ent.add(this.movement);
        this.ent.add(CCNodeComponent).val = this.node;
    }

    onEnable() {
        this.health.init(100);
        this.c2d.group = PhysicsGroup.Rock;
        this.ent.add(ECSTag.CanMove);
    }

    onHit(damage: number) {
        this.health.hp -= damage;
        if(this.health.hp <= 0) {
            this.health.hp = 0;
            this.die();
        }
    }

    die() {
        this.ent.remove(ECSTag.CanMove);
        this.c2d.group = PhysicsGroup.DEFAULT;
        ObjPool.putNode(this.node);
    }
}