import { view } from "cc";
import { ObjPool } from "../../../../Common/ObjPool";
import { Global } from "../../../../Global";
import { ecs } from "../../../../Libs/ECS";
import { Util } from "../../../../Util";
import { Enemy } from "../../../CCComponent/Enemy";
import { Resources } from "../../../CCComponent/Resources";
import { ECSTag } from "../../Components/ECSTag";


export class EnemyFactory extends ecs.ComblockSystem {

    waitTime: number = 3;
    timer: number = 2;

    filter(): ecs.IMatcher {
        return ecs.allOf(ECSTag.TypeFactoryEnemy);
    }

    update(entities: ecs.Entity[]): void {
        if(this.waitTime > 0) {
            this.waitTime -= this.dt;
            return;
        }
        this.timer -= this.dt;
        if(this.timer <= 0) {
            this.timer = Util.randomRange(2, 3);

            let n = Util.randomRange(1, 4);
            for(let i = 0; i < n; i++) {
                this.generateEnemy();
            }
        }
    }

    generateEnemy() {
        let prefab = ecs.getSingleton(Resources).enemy1;
        let node = ObjPool.getNode(prefab.data.name, prefab);
        node.parent = Global.bulletLayer;
        node.active = true;
        let movement = node.getComponent(Enemy).movement;

        let winSize = view.getVisibleSize();
        let y = Util.randomRange(-winSize.height / 2, winSize.height / 2);
        if(Math.random() < 0.5) {
            movement.targetHeading.set(1, 0, 0);
            movement.pos.set(-winSize.width / 2 - 90, y);
        }
        else {
            movement.targetHeading.set(-1, 0, 0);
            movement.pos.set(winSize.width / 2 + 90, y);
        }
        
        node.setPosition(movement.pos);

        movement.isSelfRotate = false;
    }

}