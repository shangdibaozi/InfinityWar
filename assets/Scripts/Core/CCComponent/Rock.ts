
import { _decorator, Component, Node, Collider2D, RigidBody2D } from 'cc';
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
    health: HealthComp = new HealthComp();
    @property({
        type: MovementComponent
    })
    movement: MovementComponent;

    onLoad() {
        super.onLoad();

        this.ent.add(this.health);
        this.ent.add(this.movement);
        this.ent.add(CCNodeComponent).val = this.node;
    }

    onEnable() {
        this.movement.rb2d.wakeUp();
        this.health.init(100);
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
        if(!this.ent.has(ECSTag.CanMove)) {
            return;
        }
        this.movement.rb2d.sleep();
        this.ent.remove(ECSTag.CanMove);
        ObjPool.putNode(this.node);
    }
}