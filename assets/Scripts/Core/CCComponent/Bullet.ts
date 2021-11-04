
import { _decorator, Component, Node, Prefab, Vec3, BoxCollider2D, Collider2D, Vec2, RigidBody2D } from 'cc';
import { ObjPool } from '../../Common/ObjPool';
import { PhysicsGroup } from '../../Constants';
import { Global } from '../../Global';
import { ecs } from '../../Libs/ECS';
import { CCComp } from '../ECS/Components/CCComp';
import { ECSTag } from '../ECS/Components/ECSTag';
import { LifeTimerComponent } from '../ECS/Components/LifeTimerComponent';
import { CCNodeComponent, MovementComponent } from '../ECS/Components/Movement';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
@ecs.register('Bullet', false)
export class Bullet extends CCComp {
    @property({
        type: Prefab
    })
    collisionEffect: Prefab;

    @property({
        type: MovementComponent
    })
    movement: MovementComponent;

    damage: number = 100;

    onLoad() {
        super.onLoad();

        this.initEnt();
    }

    initEnt() {
        let ent = this.ent;
        ent.add(ECSTag.CanMove);
        ent.add(CCNodeComponent).val = this.node;
        ent.add(this.movement);
    }

    init(pos: Vec3, heading: Vec3, targetHeading: Vec3, group: number) {
        this.node.setPosition(pos);

        let ent = this.ent;
        ent.add(ECSTag.CanMove);
        ent.get(CCNodeComponent).val = this.node;
        let move = this.movement;
        move.heading.set(heading);
        move.targetHeading.set(targetHeading);
        move.speed = move.maxSpeed;
        // move.pos.set(pos);
        this.node.angle = move.calcAngle();

        // ent.add(LifeTimerComponent).init(3);
        
        this.movement.rb2d.wakeUp();
    }

    onCollision() {
        if(!this.ent.has(ECSTag.CanMove)) {
            return;
        }
        this.movement.rb2d.sleep();
        console.log('<------------', this.node.uuid);
        ObjPool.putNode(this.node);
        this.ent.remove(ECSTag.CanMove);
    }

    createEffect(bpos: Vec3) {
        let effect = ObjPool.getNode(this.collisionEffect.data.name, this.collisionEffect);
        effect.parent = Global.bulletLayer;
        effect.setPosition(bpos);

        let ent = ecs.createEntity();
        ent.add(CCNodeComponent).val = effect;
        ent.add(LifeTimerComponent).init(0.1);
    }

    reset() {

    }
}
