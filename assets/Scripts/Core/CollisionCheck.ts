
import { _decorator, Component, Node, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
import { PhysicsGroup } from '../Constants';
import { ecs } from '../Libs/ECS';
import { Ammo } from './CCComponent/Ammo';
import { Bullet } from './CCComponent/Bullet';
import { Enemy } from './CCComponent/Enemy';
import { Player } from './CCComponent/Player';
const { ccclass, property } = _decorator;

let Bullet_Contact_Wall = PhysicsGroup.Bullet | PhysicsGroup.Wall;
let Player_Contact_Wall = PhysicsGroup.Player | PhysicsGroup.Wall;
let Player_Contact_Collectable = PhysicsGroup.Player_Collectable | PhysicsGroup.Collectable;
let Player_Contact_Enemy = PhysicsGroup.Player | PhysicsGroup.Enemy;
let Bullet_Contact_Enemy = PhysicsGroup.Bullet | PhysicsGroup.Enemy;

let Bullet_Enemy_Contact_Wall = PhysicsGroup.Bullet_Enemy | PhysicsGroup.Wall;
let Bullet_Enemy_Contact_Player = PhysicsGroup.Bullet_Enemy | PhysicsGroup.Player;

@ccclass('CollisionCheck')
export class CollisionCheck extends Component {

    // player: Player;
    bullet: Bullet;
    enemy: Enemy;
    ammo: Ammo;

    onLoad() {
        if(PhysicsSystem2D.instance) {
            let p2d = PhysicsSystem2D.instance;
            p2d.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let mask = selfCollider.group | otherCollider.group;
        this.refreshNode(selfCollider);
        this.refreshNode(otherCollider);
        switch(mask) {
            case Bullet_Enemy_Contact_Wall:
            case Bullet_Contact_Wall: {
                this.bullet.getComponent(Bullet).onCollision()
                break;
            }
            case Player_Contact_Wall: {
                let playerBody = selfCollider.node;
                if(selfCollider.group & PhysicsGroup.Wall) {
                    playerBody = otherCollider.node;
                }
                ecs.getSingleton(Player).die();
                break;
            }
            case Player_Contact_Collectable: {
                this.ammo.getComponent(Ammo).onCollision();
                ecs.getSingleton(Player).addAmmo(5);
                break;
            }
            case Player_Contact_Enemy: {
                this.enemy.die();
                ecs.getSingleton(Player).die();
                break;
            }
            case Bullet_Contact_Enemy: {
                this.enemy.onHit(this.bullet.damage);
                this.bullet.onCollision();
                break;
            }
            case Bullet_Enemy_Contact_Player: {
                ecs.getSingleton(Player).onHit(5);
                this.bullet.onCollision();
                break;
            }
        }

        this.bullet = null;
        this.ammo = null;
        this.enemy = null;
    }
    
    refreshNode(collider: Collider2D) {
        switch(collider.group) {
            case PhysicsGroup.Enemy: {
                this.enemy = collider.getComponent(Enemy);
                break;
            }
            case PhysicsGroup.Collectable: {
                this.ammo = collider.getComponent(Ammo);
                break;
            }
            case PhysicsGroup.Bullet: {
                this.bullet = collider.getComponent(Bullet);
                break;
            }
            case PhysicsGroup.Bullet_Enemy: {
                this.bullet = collider.getComponent(Bullet);
                break;
            }
        }
    }
}