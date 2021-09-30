
import { _decorator, Component, Node, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
import { PhysicsGroup } from '../Constants';
import { ECSTag } from './ECS/Components/ECSTag';
import { EntLink } from './ECS/EntLink';
const { ccclass, property } = _decorator;

let Bullet_Contact_Wall = PhysicsGroup.Bullet | PhysicsGroup.Wall;
let Player_Contact_Wall = PhysicsGroup.Player | PhysicsGroup.Wall;


@ccclass('CollisionCheck')
export class CollisionCheck extends Component {
    onLoad() {
        if(PhysicsSystem2D.instance) {
            let p2d = PhysicsSystem2D.instance;
            p2d.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            p2d.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            p2d.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
            p2d.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let mask = selfCollider.group | otherCollider.group;
        switch(mask) {
            case Bullet_Contact_Wall: {
                let bullet = selfCollider.node;
                if(selfCollider.group & PhysicsGroup.Wall) {
                    bullet = otherCollider.node;
                }
                bullet.getComponent(EntLink).recycle();
                break;
            }
            case Player_Contact_Wall: {
                let playerBody = selfCollider.node;
                if(selfCollider.group & PhysicsGroup.Wall) {
                    playerBody = otherCollider.node;
                }
                let ent = playerBody.parent.getComponent(EntLink).ent;
                ent.removeTag(ECSTag.CanMove);
                ent.removeTag(ECSTag.CanShoot);
                break;
            }
        }
    }

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }
}