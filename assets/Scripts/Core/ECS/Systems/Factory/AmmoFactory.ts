import { EventKeyboard, KeyCode, systemEvent, SystemEvent, v3, view } from "cc";
import { ObjPool } from "../../../../Common/ObjPool";
import { Global } from "../../../../Global";
import { ecs } from "../../../../Libs/ECS";
import { Util } from "../../../../Util";
import { Ammo } from "../../../CCComponent/Ammo";
import { Resources } from "../../../CCComponent/Resources";
import { ECSTag } from "../../Components/ECSTag";


export class AmmoFactory extends ecs.ComblockSystem {

    waitTime: number = 2;
    timer: number = 3;

    init() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if(event.keyCode == KeyCode.KEY_P) {
                this.generateAmmo();
            }
        }, this);
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(ECSTag.TypeFactoryAmmo);
    }

    update(entities: ecs.Entity[]): void {
        if(this.waitTime > 0) {
            this.waitTime -= this.dt;
            return;
        }
        this.timer -= this.dt;
        if(this.timer <= 0) {
            this.timer = Util.randomRange(2, 4);
            let n = Math.floor(Util.randomRange(1, 3));
            for(let i = 0; i < n; i++) {
                this.generateAmmo();
            }
        }
    }

    generateAmmo() {
        let res = ecs.getSingleton(Resources);
        let node = ObjPool.getNode('Ammo', res.ammo);
        node.active = true;
        node.parent = Global.bulletLayer;
        let ammo = node.getComponent(Ammo);

        let winSize = view.getVisibleSize();
        let y = Util.randomRange(-winSize.height / 2, winSize.height / 2);
        if(Math.random() < 0.5) {
            ammo.movement.heading.set(1, 0, 0);
            ammo.movement.pos.set(-winSize.width / 2 - 20, y);
        }
        else {
            ammo.movement.heading.set(-1, 0, 0);
            ammo.movement.pos.set(winSize.width / 2 + 20, y);
        }
        node.setPosition(ammo.movement.pos);
    }
}