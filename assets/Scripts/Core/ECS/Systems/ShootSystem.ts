import { UITransform, v3, Vec3 } from "cc";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Player } from "../../CCComponent/Player";
import { ECSTag } from "../Components/ECSTag";
import { MovementComponent } from "../Components/Movement";
import { ShootComopnent } from "../Components/ShootComponent";

let FlashTime = 2 / 60;
let outv3 = v3();
export class ShootSystem extends ecs.ComblockSystem {
    playerPos: Vec3 = null;

    filter(): ecs.IMatcher {
        return ecs.allOf(ShootComopnent, MovementComponent, ECSTag.CanShoot);
    }

    update(entities: ecs.Entity[]): void {
        let dt = this.dt;
        for(let ent of entities) {
            if(ent.has(ECSTag.TypePlayer)) {
                this.shootByPlayer(ent.get(ShootComopnent), ent.get(MovementComponent).heading, dt);
            }
            else {

                this.shootByEnemy(ent.get(ShootComopnent), dt)
            }
        }
    }

    shootByPlayer(shootComp: ShootComopnent, heading: Vec3, dt: number) {
        shootComp.timer += dt;
        shootComp.heading.set(heading);
        if(shootComp.timer >= shootComp.interval) {
            shootComp.timer -= shootComp.interval;
            if(shootComp.shootPoint1) {
                shootComp.createBullet(shootComp.shootPoint1);
                shootComp.flash1Time = FlashTime;
                shootComp.flash1.active = true;
            }
            if (shootComp.shootPoint2) {
                shootComp.createBullet(shootComp.shootPoint2);
                shootComp.flash2Time = FlashTime;
                shootComp.flash2.active = true;
            }
        }

        if(shootComp.flash1Time > 0) {
            shootComp.flash1Time -= dt;
            if(shootComp.flash1Time <= 0) {
                shootComp.flash1.active = false;
            }
        }
        if(shootComp.flash2Time > 0) {
            shootComp.flash2Time -= dt;
            if(shootComp.flash2Time <= 0) {
                shootComp.flash2.active = false;
            }
        }
    }

    shootByEnemy(shootComp: ShootComopnent, dt: number) {
        shootComp.timer += dt;
        
        if(shootComp.timer >= shootComp.interval) {
            shootComp.timer -= shootComp.interval;

            let playerPos = this.getPlayerPos();
            if(playerPos == null) {
                return;
            }

            if(shootComp.shootPoint1) {
                Global.gameLayer.getComponent(UITransform).convertToNodeSpaceAR(shootComp.shootPoint1.getWorldPosition(outv3), outv3);
                Vec3.subtract(outv3, playerPos, outv3);
                outv3.normalize();
                shootComp.heading.set(outv3);
                shootComp.createBullet(shootComp.shootPoint1);
                shootComp.flash1Time = FlashTime;
                shootComp.flash1.active = true;
            }
            if (shootComp.shootPoint2) {
                Global.gameLayer.getComponent(UITransform).convertToNodeSpaceAR(shootComp.shootPoint2.getWorldPosition(outv3), outv3);
                Vec3.subtract(outv3, playerPos, outv3);
                outv3.normalize();
                shootComp.heading.set(outv3);
                shootComp.createBullet(shootComp.shootPoint2);
                shootComp.flash2Time = FlashTime;
                shootComp.flash2.active = true;
            }
        }

        if(shootComp.flash1Time > 0) {
            shootComp.flash1Time -= dt;
            if(shootComp.flash1Time <= 0) {
                shootComp.flash1.active = false;
            }
        }
        if(shootComp.flash2Time > 0) {
            shootComp.flash2Time -= dt;
            if(shootComp.flash2Time <= 0) {
                shootComp.flash2.active = false;
            }
        }
    }

    getPlayerPos() {
        if(this.playerPos == null) {
            let playerComp = ecs.getSingleton(Player);
            if(playerComp && playerComp.ent.has(ECSTag.CanMove)) {
                this.playerPos = playerComp.movement.pos;
            }
        }
        return this.playerPos;
    }
}