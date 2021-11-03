
import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D } from 'cc';
import { PhysicsGroup } from '../../Constants';
import { ecs } from '../../Libs/ECS';
import { CollisionInfoComp } from '../ECS/Components/CollisionInfoComp';
const { ccclass, property } = _decorator;

@ccclass('Collision')
export class Collision extends Component {
    @property({
        type: Collider2D
    })
    collider: Collider2D;

    rb2d: RigidBody2D;

    onLoad() {
        this.rb2d = this.getComponent(RigidBody2D);
    }

    start() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    // 只在两个碰撞体开始接触时被调用一次
    // 如果一个钢铁开启了监听碰撞检测，另一个没有开启，则selfCollider就表示开启的刚体碰撞器
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        let comp = ecs.createEntityWithComp(CollisionInfoComp);

        comp.nodeA = selfCollider.node;
        comp.nodeB = otherCollider.node;

        comp.groupA = selfCollider.group;
        comp.groupB = otherCollider.group;

        comp.colPos.set(contact.getWorldManifold().points[0]);
        // console.log('------------>', comp.nodeA.uuid);

        // 休眠刚体，防止多次触发碰撞，从而造成重复回收子弹
        if(selfCollider.group & PhysicsGroup.Bullet || selfCollider.group & PhysicsGroup.Bullet_Enemy) {
            this.rb2d.sleep();
        }
    }
}