import { Canvas, director, instantiate, Node, Prefab, UIComponent, UITransform, v3, Vec3, _decorator } from 'cc';
import { ObjPool } from '../../../Common/ObjPool';
import { Global } from '../../../Global';
import { ecs } from "../../../Libs/ECS";
import { BulletEntity } from '../Entities/BulletEntity';
import { CCNodeComponent, MovementComponent } from './Movement';
const { ccclass, property } = _decorator;


let outv3 = v3();
@ccclass('ShootComopnent')
@ecs.register('Shoot')
export class ShootComopnent extends ecs.IComponent {
    private timer: number = 0;

    @property
    interval: number = 1;

    @property({
        type: Node
    })
    shootPoint1: Node = null;

    @property({
        type: Node
    })
    shootPoint2: Node = null;

    @property({
        type: Prefab
    })
    bulletPrefab: Prefab = null;

    heading: Vec3 = v3(0, 1, 0);

    reset() {
        this.shootPoint1 = null;
        this.shootPoint2 = null;
    }

    shoot(dt: number, heading: Vec3) {
        this.timer += dt;
        this.heading.set(heading);
        if(this.timer >= this.interval) {
            this.timer -= this.interval;
            if(this.shootPoint1) {
                this.createBullet(this.shootPoint1);
            }
            if (this.shootPoint2) {
                this.createBullet(this.shootPoint2);
            }
        }
    }

    createBullet(point: Node) {
        let node = ObjPool.getNode(this.bulletPrefab.data.name, this.bulletPrefab);
        node.active = true;
        node.parent = Global.gameLayer;
        Global.gameLayer.getComponent(UITransform).convertToNodeSpaceAR(point.getWorldPosition(outv3), outv3);
        node.setPosition(outv3);

        let ent = BulletEntity.create();
        ent.CCNode.val = node;
        let move = ent.Movement;
        move.heading.set(this.heading);
        move.targetHeading.set(this.heading);
        move.speed = 400;
        move.maxSpeed = 400;
        move.acceleration = 500;
        move.pos.set(outv3);
        node.angle = move.calcAngle();
    }
}
