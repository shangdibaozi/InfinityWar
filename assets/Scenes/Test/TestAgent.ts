
import { _decorator, Component, Node, Vec3, v3, earcut, RigidBody2D, v2, toDegree, PhysicsSystem2D } from 'cc';
import { UI_EVENT } from '../../Scripts/Constants';
import { TrailParticle } from '../../Scripts/Core/TrailParticle';
import { Global } from '../../Scripts/Global';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TestAgent
 * DateTime = Thu Nov 04 2021 12:31:08 GMT+0800 (中国标准时间)
 * Author = shangdibaozi
 * FileBasename = TestAgent.ts
 * FileBasenameNoExtension = TestAgent
 * URL = db://assets/Scenes/Test/TestAgent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

let out = v3();
let velocity = v2();

@ccclass('TestAgent')
export class TestAgent extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    heading: Vec3 = v3();
    rb2d: RigidBody2D;

    r = 100;
    a = 0;

    onLoad() {
        const phSystem = PhysicsSystem2D.instance;
        // 物理步长，默认 fixedTimeStep 是 1/60
        phSystem.fixedTimeStep = 1 / 30;
    }

    start () {
        this.rb2d = this.getComponent(RigidBody2D);
        Global.uiEvent.on(UI_EVENT.PLAYER_MOVE, this.onPlayerMove, this);

        this.node.setPosition(this.r, 0, 0);
    }

    onPlayerMove(heading: Vec3) {
        this.heading.set(heading);
        velocity.x = heading.x * 5;
        velocity.y = heading.y * 5;
        
    }

    update(dt: number) {
        this.a += dt * 1;
        let x = Math.cos(this.a);
        let y = Math.sin(this.a);
        this.heading.x = -y;
        this.heading.y = x;

        velocity.x = this.heading.x * 5;
        velocity.y = this.heading.y * 5;

        this.rb2d.linearVelocity = velocity;
        this.node.angle = toDegree(Math.atan2(this.heading.y, this.heading.x)) - 90;
    }


    // update(dt: number) {
    //     let pos = this.node.getPosition();
    //     out.x = pos.x + dt * this.heading.x * 100;
    //     out.y = pos.y + dt * this.heading.y * 100;
    //     this.node.setPosition(out);
    //     this.node.angle = toDegree(Math.atan2(this.heading.y, this.heading.x)) - 90;
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
