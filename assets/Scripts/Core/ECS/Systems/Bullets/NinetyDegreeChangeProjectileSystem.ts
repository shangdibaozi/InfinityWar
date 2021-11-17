import { toDegree, Vec3 } from "cc";
import { ecs } from "../../../../Libs/ECS";
import { Bullet } from "../../../CCComponent/Bullet";
import { NinetyDegreeChangeProjectileComp } from "../../Components/BulletCpmps";
import { ECSTag } from "../../Components/ECSTag";
import { MovementComponent } from "../../Components/Movement";


let TIMER_0 = 0.2;
let TIMER_1 = 0.25;
let TIMER_2 = 0.1;

export class NinetyDegreeChangeProjectileSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    

    filter(): ecs.IMatcher {
        return ecs.allOf(NinetyDegreeChangeProjectileComp, Bullet, ECSTag.CanMove);
    }

    entityEnter(entities: ecs.Entity[]): void {
        for(let e of entities) {
            let comp = e.get(NinetyDegreeChangeProjectileComp);
            comp.state = 0;
            comp.timer0 = TIMER_0;
            comp.timer1 = TIMER_1;
            comp.timer2 = TIMER_2;
        }
    }

    update(entities: ecs.Entity[]): void {

        let dt = this.dt;
        for(let e of entities) {
            let comp = e.get(NinetyDegreeChangeProjectileComp);
            if(comp.state === 0) {
                comp.timer0 -= dt;
                if(comp.timer0 <= 0) {
                    comp.state = 1;
                    comp.ninetyDegreeDirection = Math.random() > 0.5 ? 1 : -1;
                    this.changeAngle(e, comp.ninetyDegreeDirection);
                }
            }
            else if(comp.state === 1) {
                comp.timer1 -= dt;
                if(comp.timer1 <= 0) {
                    comp.timer1 = TIMER_1;
                    comp.state = 2;
                    this.changeAngle(e, -1 * comp.ninetyDegreeDirection);
                }
            }
            else {
                comp.timer1 -= dt;
                comp.timer2 -= dt;
                if(comp.timer2 <= 0) {
                    comp.state = 1;
                    comp.timer2 = TIMER_2;
                    this.changeAngle(e, -1 * comp.ninetyDegreeDirection);
                    comp.ninetyDegreeDirection *= -1;
                }
            }
        }
    }

    changeAngle(e: ecs.Entity, dir: number) {
        let move = e.get(MovementComponent);
        this.normal(move.heading, dir);
        move.targetHeading.set(move.heading);
        move.angle = toDegree(Math.atan2(move.heading.y, move.heading.x)) - 90;
    }

    normal(out: Vec3, dir: number) {
        let tmp = dir * out.x;
        out.x = -1 * dir * out.y;
        out.y = tmp;
    }
}