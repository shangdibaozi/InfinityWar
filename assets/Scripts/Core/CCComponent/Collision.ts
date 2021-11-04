
import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D } from 'cc';
import { PhysicsGroup } from '../../Constants';
import { ecs } from '../../Libs/ECS';
import { CollisionInfoComp } from '../ECS/Components/CollisionInfoComp';
const { ccclass, property } = _decorator;

/**
 * 注意：如果A和B都添加了当前组件，则统一次碰撞会发生2两次，一次是A碰撞B，一次是B碰撞A。
 * 为了解决这个问题同时优化性能，尽量只在A或者B身上添加当前组件。如果必须在A和B身上都添加
 * 则要考虑清楚逻辑，防止调用2次碰撞处理逻辑。
 * 
 * 还存在2颗子弹同时碰撞敌人，导致创建2个碰撞信息，使得敌人回收两次的情况。
 */
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

    /**
     * 只在两个碰撞体开始接触时被调用一次
     * @param selfCollider 表示挂载了Collision组件的碰撞撞器
     * @param otherCollider 
     * @param contact 
     */
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {

        // 如果otherCollider是子弹，则必然存在selfCollider是子弹，return掉防止重复创建碰撞信息实体。
        // if(this.isBullet(otherCollider.group)) {
        //     return;
        // }

        // // 休眠刚体，防止多次触发碰撞，从而造成重复回收子弹
        // if(this.isBullet(selfCollider.group)) {
        //     console.log('------------>', this.node.uuid);
        //     this.rb2d.sleep();
        // }

        let comp = ecs.createEntityWithComp(CollisionInfoComp);

        comp.nodeA = selfCollider.node;
        comp.nodeB = otherCollider.node;

        comp.groupA = selfCollider.group;
        comp.groupB = otherCollider.group;

        comp.colPos.set(contact.getWorldManifold().points[0]);
    }

    isBullet(group: PhysicsGroup) {
        return group & PhysicsGroup.Bullet || group & PhysicsGroup.Bullet_Enemy;
    }
}