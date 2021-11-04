
import { _decorator, Component, Node, utils, Vec3, v3, Collider2D, RigidBody2D } from 'cc';
import { ObjPool } from '../../Common/ObjPool';
import { PhysicsGroup } from '../../Constants';
import { ecs } from '../../Libs/ECS';
import { Util } from '../../Util';
import { CCComp } from '../ECS/Components/CCComp';
import { ECSTag } from '../ECS/Components/ECSTag';
import { CCNodeComponent, MovementComponent } from '../ECS/Components/Movement';
const { ccclass, property } = _decorator;

@ccclass('Ammo')
@ecs.register('Ammo', false)
export class Ammo extends CCComp {
    @property({
        type: MovementComponent
    })
    movement: MovementComponent;

    onLoad() {
        super.onLoad();

        this.ent.add(this.movement);
        this.ent.add(ECSTag.TypeAmmo);
        this.ent.add(CCNodeComponent).val = this.node;
    }

    onEnable() {
        this.ent.add(ECSTag.CanMove);
        this.reset();
    }
    
    reset() {
        let movement = this.movement;
        movement.speed = Util.randomRange(50, 100);
        movement.maxSpeed = movement.speed;
        movement.rb2d.fixedRotation = false;
        movement.rb2d.angularVelocity = Math.random() > 0.5 ? 4 : -4;
        this.movement.rb2d.wakeUp();
    }

    onCollision() {
        if(!this.ent.has(ECSTag.CanMove)) {
            return;
        }
        this.movement.rb2d.sleep();
        ObjPool.putNode(this.node);
        this.ent.remove(ECSTag.CanMove);
    }
}
