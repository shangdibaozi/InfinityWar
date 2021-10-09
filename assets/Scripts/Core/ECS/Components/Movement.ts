import { _decorator, toDegree, v3, Node, Vec3 } from "cc";
import { ecs } from "../../../Libs/ECS";
const { ccclass, property } = _decorator;

@ecs.registerTag()
export class MovementTag {
    static Move: number = 0;
    static Stop: number = 0;
}

@ecs.register('CCNode')
export class CCNodeComponent extends ecs.Comp {
    val: Node = null;

    reset() {
        this.val = null;
    }
}

let outV3 = v3();

@ccclass('MovementComponent')
@ecs.register('Movement')
export class MovementComponent extends ecs.Comp {
    pos: Vec3 = v3();

    angle: number = 0;

    speed: number = 0;

    @property
    acceleration: number = 0;

    @property
    private _baseMaxSpeed: number = 0;
    @property
    set baseMaxSpeed(val: number) {
        this._baseMaxSpeed = val;
    }
    get baseMaxSpeed() {
        return this._baseMaxSpeed;
    }

    private maxSpeed: number = 0;

    @property
    heading: Vec3 = v3();
    
    @property
    targetHeading: Vec3 = v3();

    /**
     * 是否在推进
     */
    isBoost: boolean = false;

    @property({
        tooltip: '推进倍数（最大速度值乘以这个倍数作为新的最大速度值）'
    })
    boostMulti: number = 1;

    reset() {

    }

    update(dt: number) {
        if(!Vec3.equals(this.heading, this.targetHeading, 0.01)) {
            Vec3.subtract(outV3, this.targetHeading, this.heading);
            outV3.multiplyScalar(0.025);
            this.heading.add(outV3);
            this.heading.normalize();
            this.angle = toDegree(Math.atan2(this.heading.y, this.heading.x)) - 90;
        }

        if(this.isBoost) {
            this.maxSpeed = this.boostMulti * this._baseMaxSpeed;
        }
        else {
            this.maxSpeed = this._baseMaxSpeed;
        }
        
        this.speed = Math.min(this.speed + this.acceleration * dt, this.maxSpeed);

        this.pos.add3f(this.heading.x * this.speed * dt, this.heading.y * this.speed * dt, 0);
    }

    calcAngle() {
        this.angle = toDegree(Math.atan2(this.heading.y, this.heading.x)) - 90;
        return this.angle;
    }
}