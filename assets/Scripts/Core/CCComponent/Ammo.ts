
import { _decorator, Component, Node, utils, Vec3, v3, Collider2D } from 'cc';
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
    angle: number = 0;
    angleSpeed: number = 0;

    movement: MovementComponent = new MovementComponent();

    c2d: Collider2D = null;

    onLoad() {
        super.onLoad();
        
        this.c2d = this.getComponent(Collider2D);

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
        movement.speed = Util.randomRange(20, 50);
        movement.angleSpeed = Util.randomRange(200, 400);
        if(Math.random() > 0.5) {
            movement.angleSpeed *= -1;
        }
        movement.maxSpeed = movement.speed;
        movement.isSelfRotate = true;

        this.angleSpeed = Util.randomRange(40, 100);
        this.c2d.group = PhysicsGroup.Collectable;
    }

    onCollision() {
        ObjPool.putNode(this.node);
        this.ent.remove(ECSTag.CanMove);
        this.c2d.group = PhysicsGroup.DEFAULT;
    }
}
