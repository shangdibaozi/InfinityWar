
import { _decorator, Component, Node, Collider2D } from 'cc';
import { ObjPool } from '../../Common/ObjPool';
import { PhysicsGroup } from '../../Constants';
import { ecs } from '../../Libs/ECS';
import { CCComp } from '../ECS/Components/CCComp';
import { ECSTag } from '../ECS/Components/ECSTag';
import { HealthComp } from '../ECS/Components/HealthComp';
import { CCNodeComponent, MovementComponent } from '../ECS/Components/Movement';
const { ccclass, property } = _decorator;

@ecs.register('Enemy', false)
@ccclass('Enemy')
export class Enemy extends CCComp {
    c2d: Collider2D = null;

    movement: MovementComponent = new MovementComponent();
    health: HealthComp = new HealthComp();

    onLoad() {
        super.onLoad();

        this.c2d = this.getComponent(Collider2D);

        this.ent.add(this.movement);
        this.ent.add(this.health);
        this.ent.add(ECSTag.CanMove);
        this.ent.add(CCNodeComponent).val = this.node;
    }

    onEnable() {
        this.health.init(100);
        this.c2d.group = PhysicsGroup.Enemy;
        this.ent.add(ECSTag.CanMove);
    }

    onHit(damage: number) {
        this.health.hp = Math.max(this.health.hp - damage, 0);
        if(this.health.hp <= 0) {
            this.c2d.group = PhysicsGroup.DEFAULT;
            this.ent.remove(ECSTag.CanMove);
            ObjPool.putNode(this.node);
        }
        else {
            // hit flash
        }
    }
}