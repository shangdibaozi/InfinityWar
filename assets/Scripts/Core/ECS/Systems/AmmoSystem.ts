import { EventKeyboard, KeyCode, math, systemEvent, SystemEvent, v3, Vec3, view } from "cc";
import { ObjPool } from "../../../Common/ObjPool";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { Ammo } from "../../CCComponent/Ammo";
import { Player } from "../../CCComponent/Player";
import { Resources } from "../../CCComponent/Resources";
import { ECSTag } from "../Components/ECSTag";
import { CCNodeComponent } from "../Components/Movement";

let tmpV3 = v3();

export class AmmoSystem extends ecs.ComblockSystem {

    init() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if(event.keyCode == KeyCode.KEY_P) {
                this.generateAmmo();
            }
        }, this);
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(Ammo, CCNodeComponent, ECSTag.CanMove);
    }

    update(entities: ecs.Entity[]): void {
        let playerComp = ecs.getSingleton(Player);
        if(!playerComp || !playerComp.ent.has(ECSTag.CanMove)) {
            // return;
        }
        let targetPos = playerComp.movement.pos;
        let ammo: Ammo;
        let dt = this.dt;
        for(let e of entities) {
            ammo = e.get(Ammo);
            Vec3.subtract(ammo.movement.targetHeading, targetPos, ammo.movement.pos);
            ammo.movement.update(dt);
            ammo.node.setPosition(ammo.movement.pos);

            ammo.angle += ammo.angleSpeed * dt;
            ammo.node.angle = ammo.angle;
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