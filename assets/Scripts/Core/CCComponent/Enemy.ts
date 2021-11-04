
import { _decorator, Component, Node, Collider2D, RigidBody2D } from 'cc';
import { ObjPool } from '../../Common/ObjPool';
import { PhysicsGroup } from '../../Constants';
import { ecs } from '../../Libs/ECS';
import { CCComp } from '../ECS/Components/CCComp';
import { ECSTag } from '../ECS/Components/ECSTag';
import { HealthComp } from '../ECS/Components/HealthComp';
import { CCNodeComponent, MovementComponent } from '../ECS/Components/Movement';
import { ShootComopnent } from '../ECS/Components/ShootComponent';
const { ccclass, property } = _decorator;

@ecs.register('Enemy', false)
@ccclass('Enemy')
export class Enemy extends CCComp {

    @property({
        type: MovementComponent
    })
    movement: MovementComponent = null;

    @property({
        type: ShootComopnent
    })
    shootDetail: ShootComopnent;

    health: HealthComp = new HealthComp();

    onLoad() {
        super.onLoad();

        this.ent.add(this.movement);
        this.ent.add(this.health);
        this.ent.add(this.shootDetail);
        this.ent.add(ECSTag.CanMove);
        this.ent.add(ECSTag.CanShoot);
        this.ent.add(ECSTag.TypeEnemy);
        this.ent.add(CCNodeComponent).val = this.node;

        this.shootDetail.hideFlash();
    }

    onEnable() {
        this.health.init(100);
        this.ent.add(ECSTag.CanMove);
        this.movement.rb2d.wakeUp();
    }

    onHit(damage: number) {
        if(!this.ent.has(ECSTag.CanMove)) {
            return;
        }
        this.health.hp = Math.max(this.health.hp - damage, 0);
        if(this.health.hp <= 0) {
            this.die();
        }
        else {
            // hit flash
        }
    }

    die() {
        this.movement.rb2d.sleep();
        this.shootDetail.hideFlash();
        this.ent.remove(ECSTag.CanMove);
        ObjPool.putNode(this.node);
    }
}