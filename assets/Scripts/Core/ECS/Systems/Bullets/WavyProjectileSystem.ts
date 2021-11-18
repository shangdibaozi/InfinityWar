import { convertUtils, toDegree, v3, Vec3 } from "cc";
import { ecs } from "../../../../Libs/ECS";
import { Bullet } from "../../../CCComponent/Bullet";
import { WavyProjectileComp } from "../../Components/BulletCpmps";
import { ECSTag } from "../../Components/ECSTag";
import { MovementComponent } from "../../Components/Movement";

let dir8 = Math.PI / 8;
let dir4 = Math.PI / 4;

let TIMER = 0.25;

export class WavyProjectileSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {


    filter(): ecs.IMatcher {
        return ecs.allOf(WavyProjectileComp, Bullet, ECSTag.CanMove);
    }

    entityEnter(entities: ecs.Entity[]): void {
        let dir = 1;
        for(let e of entities) {
            dir *= -1;
            let comp = e.get(WavyProjectileComp);
            comp.state = 0;
            comp.timer = TIMER;
            comp.direction = dir;
            this.changeHeading(comp, e.get(MovementComponent), dir8, comp.direction);
        }
    }

    changeHeading(wavyComp: WavyProjectileComp, move: MovementComponent, offset: number, dir: number) {
        let r = Math.atan2(move.heading.y, move.heading.x) + dir * offset;
        wavyComp.heading.x = Math.cos(r);
        wavyComp.heading.y = Math.sin(r);
        let a = toDegree(r);
    }

    update(entities: ecs.Entity[]): void {
        let dt = this.dt;
        for(let e of entities) {
            let comp = e.get(WavyProjectileComp);
            let move = e.get(MovementComponent);

            comp.timer -= dt;
            if(comp.timer <= 0) {
                comp.timer = 0;
            }
            
            Vec3.lerp(move.heading, move.heading, comp.heading, (TIMER - comp.timer) / TIMER);
            move.targetHeading.set(move.heading);
            move.angle = toDegree(Math.atan2(move.heading.y, move.heading.x)) - 90;

            if(comp.state === 0) {
                if(comp.timer <= 0) {
                    comp.state = 1;
                    comp.timer = TIMER;
                    this.changeHeading(comp, move, dir4, -1 * comp.direction);
                }
            }
            else if(comp.state === 1) {
                if(comp.timer <= 0) {
                    comp.state = 2;
                    comp.timer = TIMER;
                    this.changeHeading(comp, move, dir4, comp.direction);
                }
            }
            else if(comp.state === 2) {
                if(comp.timer <= 0) {
                    comp.state = 3;
                    comp.timer = TIMER;
                    this.changeHeading(comp, move, dir4, -1 * comp.direction);
                }
            }
            else {
                if(comp.timer <= 0) {
                    comp.state = 2;
                    comp.timer = TIMER;
                    this.changeHeading(comp, move, dir4, comp.direction);
                }
            }
        }
    }
}