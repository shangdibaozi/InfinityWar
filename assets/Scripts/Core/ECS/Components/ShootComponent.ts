import { Canvas, director, instantiate, Node, Prefab, Sprite, tween, UIComponent, UITransform, v3, Vec3, _decorator } from 'cc';
import { ObjPool } from '../../../Common/ObjPool';
import { Global } from '../../../Global';
import { ecs } from "../../../Libs/ECS";
import { Bullet } from '../../CCComponent/Bullet';
const { ccclass, property } = _decorator;


let outv3 = v3();

let FlashTime = 2 / 60;
@ccclass('ShootComopnent')
@ecs.register('Shoot')
export class ShootComopnent extends ecs.Comp {
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
    flash1: Node = null;

    flash1Time: number = 0;

    @property({
        type: Node
    })
    shootPoint2: Node = null;

    @property({
        type: Node
    })
    flash2: Node = null;

    flash2Time: number = 0;

    @property({
        type: Prefab
    })
    bulletPrefab: Prefab = null;

    heading: Vec3 = v3(0, 1, 0);

    reset() {
        this.shootPoint1 = null;
        this.shootPoint2 = null;
        this.flash1 = null;
        this.flash2 = null;
    }

    hideFlash() {
        if(this.flash1) {
            this.flash1.active = false;
        }

        if(this.flash2) {
            this.flash2.active = false;
        }
    }

    shoot(dt: number, heading: Vec3) {
        this.timer += dt;
        this.heading.set(heading);
        if(this.timer >= this.interval) {
            this.timer -= this.interval;
            if(this.shootPoint1) {
                this.createBullet(this.shootPoint1);
                this.flash1Time = FlashTime;
                this.flash1.active = true;
            }
            if (this.shootPoint2) {
                this.createBullet(this.shootPoint2);
                this.flash2Time = FlashTime;
                this.flash2.active = true;
            }
        }

        if(this.flash1Time > 0) {
            this.flash1Time -= dt;
            if(this.flash1Time <= 0) {
                this.flash1.active = false;
            }
        }
        if(this.flash2Time > 0) {
            this.flash2Time -= dt;
            if(this.flash2Time <= 0) {
                this.flash2.active = false;
            }
        }
    }

    createBullet(point: Node) {
        let node = ObjPool.getNode(this.bulletPrefab.data.name, this.bulletPrefab);
        node.active = true;
        node.parent = Global.bulletLayer;
        Global.gameLayer.getComponent(UITransform).convertToNodeSpaceAR(point.getWorldPosition(outv3), outv3);

        node.getComponent(Bullet).init(outv3, this.heading, this.heading);

        // node.setPosition(outv3);

        // let entLink = node.getComponent(EntLink);
        // if(!entLink) {
        //     entLink = node.addComponent(EntLink);
        // }

        // let ent = BulletEntity.create();
        // ent.add(ECSTag.CanMove);
        // entLink.ent = ent;
        // ent.CCNode.val = node;
        // let move = ent.Movement;
        // move.heading.set(this.heading);
        // move.targetHeading.set(this.heading);
        // move.speed = 500;
        // move.maxSpeed = 500;
        // move.acceleration = 500;
        // move.pos.set(outv3);
        // node.angle = move.calcAngle();
        
    }
}
