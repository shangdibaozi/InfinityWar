import { view } from "cc";
import { ObjPool } from "../../../Common/ObjPool";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { Enemy } from "../../CCComponent/Enemy";
import { Resources } from "../../CCComponent/Resources";
import { ECSTag } from "../Components/ECSTag";

export class RockSystem extends ecs.ComblockSystem {
    waitTime: number = 4;
    timer: number = 2;

    filter(): ecs.IMatcher {
        return ecs.allOf(ECSTag.TypeFactoryRock);
    }

    update(entities: ecs.Entity[]): void {
        if(this.waitTime > 0) {
            this.waitTime -= this.dt;
            return;
        }

        this.timer -= this.dt;
        if(this.timer <= 0) {
            this.timer = Util.randomRange(2, 4);

            let n = Math.floor(Util.randomRange(0, 2));
            for(let i = 0; i < n; i++) {
                this.generateRock();
            }
        }
    }

    generateRock() {
        let node = ObjPool.getNode('Rock', ecs.getSingleton(Resources).rock);
        node.parent = Global.bulletLayer;
        node.active = true;
        let movement = node.getComponent(Enemy).movement;
        movement.speed = Util.randomRange(40, 70);
        movement.maxSpeed = movement.speed;

        movement.angleSpeed = Util.randomRange(50, 100);
        if(Math.random() > 0.5) {
            movement.angleSpeed *= -1;
        }

        let winSize = view.getVisibleSize();
        let y = Util.randomRange(-winSize.height / 2, winSize.height / 2);
        if(Math.random() < 0.5) {
            movement.heading.set(1, 0, 0);
            movement.pos.set(-winSize.width / 2 - 20, y);
        }
        else {
            movement.heading.set(-1, 0, 0);
            movement.pos.set(winSize.width / 2 + 20, y);
        }
        node.setPosition(movement.pos);

        movement.isSelfRotate = true;
    }
}