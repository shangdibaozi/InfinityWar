
import { _decorator, Component, Node, Prefab, Vec3 } from 'cc';
import { ObjPool } from '../../Common/ObjPool';
import { ecs } from '../../Libs/ECS';
import { CCComp } from '../ECS/Components/CCComp';
import { ECSTag } from '../ECS/Components/ECSTag';
import { CCNodeComponent, MovementComponent } from '../ECS/Components/Movement';
import { BulletEntity } from '../ECS/Entities/BulletEntity';
import { EntLink } from '../ECS/EntLink';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
@ecs.register('Bullet', false)
export class Bullet extends CCComp {
    @property({
        type: Prefab
    })
    collisionEffect: Prefab;

    onLoad() {
        super.onLoad();
        this.initEnt();
    }

    initEnt() {
        let ent = this.ent;
        ent.addTag(ECSTag.CanMove);
        ent.add(CCNodeComponent).val = this.node;
        // ent.add(MovementComponent);
    }

    init(pos: Vec3, heading: Vec3, targetHeading: Vec3) {
        this.node.setPosition(pos);

        let ent = this.ent;
        ent.addTag(ECSTag.CanMove);
        ent.get(CCNodeComponent).val = this.node;
        let move = ent.add(MovementComponent);
        move.heading.set(heading);
        move.targetHeading.set(targetHeading);
        move.speed = 500;
        move.maxSpeed = 500;
        move.acceleration = 500;
        move.pos.set(pos);
        this.node.angle = move.calcAngle();
    }

    collision() {
        ObjPool.putNode(this.node);
        // this.ent.remove(ECSTag.CanMove);
        this.ent.remove(MovementComponent, false);
    }

    reset() {
        
    }
}
