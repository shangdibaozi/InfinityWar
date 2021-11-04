import { _decorator, toDegree, v3, Node, Vec3, RigidBody2D, Vec2, v2 } from "cc";
import { ecs } from "../../../Libs/ECS";
const { ccclass, property } = _decorator;


@ecs.register('CCNode')
export class CCNodeComponent extends ecs.Comp {
    val: Node = null;

    reset() {
        this.val = null;
    }
}



@ccclass('MovementComponent')
@ecs.register('Movement')
export class MovementComponent extends ecs.Comp {
    angle: number = 0;

    speed: number = 0;

    @property({
        type: RigidBody2D
    })
    rb2d: RigidBody2D;

    @property
    acceleration: number = 0;

    @property
    private _maxSpeed: number = 0;
    @property
    set maxSpeed(val: number) {
        this._maxSpeed = val;
    }
    get maxSpeed() {
        return this._maxSpeed;
    }

    @property
    heading: Vec3 = v3();
    
    @property
    targetHeading: Vec3 = v3();

    velocity: Vec2 = v2();

    reset() {

    }

    calcAngle() {
        this.angle = toDegree(Math.atan2(this.heading.y, this.heading.x)) - 90;
        return this.angle;
    }
}

@ccclass('BoostComp')
@ecs.register('Boost')
export class BoostComp extends ecs.Comp {
    @property({
        tooltip: '加速推进倍数（最大速度值乘以这个倍数作为新的最大速度值）'
    })
    multiAdd: number = 1;

    @property({
        tooltip: '减速推进倍数（最大速度值乘以这个倍数作为新的最大速度值）'
    })
    multiSub: number = 1;

    @property({
        tooltip: '冷却时长'
    })
    cooldown: number = 2;

    @property({
        tooltip: '最大推进值'
    })
    maxBoost: number = 100;

    @property({
        tooltip: '每秒增加推进剂'
    })
    addBoostSpeed: number = 10;

    @property({
        tooltip: '每秒减少推进剂'
    })
    subBoostSpeed: number = 50;

    baseMaxSpeed: number = 0;

    isAdd: boolean = true;

    boost: number = 100;
    timer: number = 0;

    canBoost: boolean = true;

    boosting: boolean = false;

    reset(): void {
        this.timer = 0;
        this.boost = this.maxBoost;
        this.canBoost = true;
        this.boosting = false;
    }
}