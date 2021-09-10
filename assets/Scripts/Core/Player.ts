
import { _decorator, Component, Node, Vec3, toRadian, toDegree, v3, CCFloat, RigidBody2D, Vec2, CCLoader } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';

let outV3 = v3(0, 0, 0);
let playerPos = v3();

const { ccclass, property } = _decorator;
@ccclass('Player')
export class Player extends Component {
    speed: number = 0;

    @property(CCFloat)
    maxSpeed: number = 100;

    @property(CCFloat)
    acceleration: number = 100;

    curHeading: Vec3 = v3(1, 0, 0);
    targetHeading: Vec3 = v3(1, 0, 0);

    get radian() {
        return Math.atan2(this.curHeading.y, this.curHeading.x);
    }

    onLoad() {
        this.installEvents();
    }

    installEvents() {
        Global.uiEvent.on(UI_EVENT.PLAYER_MOVE, this.onPlayerMove, this);
    }

    onPlayerMove(heading: Vec3) {
        this.targetHeading.set(heading);
    }

    update(dt: number) {
        if(!Vec3.equals(this.curHeading, this.targetHeading, 0.01)) {
            Vec3.subtract(outV3, this.targetHeading, this.curHeading);
            outV3.multiplyScalar(0.025);
            this.curHeading.add(outV3);
            this.curHeading.normalize();
            this.node.angle = toDegree(Math.atan2(this.curHeading.y, this.curHeading.x));
            console.log(this.node.angle);
        }

        if(this.speed < this.maxSpeed) {
            this.speed = Math.min(this.speed + this.acceleration * dt, this.maxSpeed)
        }

        playerPos.set(this.node.position);
        playerPos.add3f(this.curHeading.x * this.speed * dt, this.curHeading.y * this.speed * dt, 0);
        this.node.setPosition(playerPos);
    }
}