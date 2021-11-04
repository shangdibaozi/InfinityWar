
import { _decorator, Component, Node, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact, RigidBody2D, assert, v2, view, v3 } from 'cc';
import { ObjPool } from '../../../Common/ObjPool';
import { PhysicsGroup } from '../../../Constants';
import { Global } from '../../../Global';
import { ecs } from '../../../Libs/ECS';
import { Ammo } from '../../CCComponent/Ammo';
import { Bullet } from '../../CCComponent/Bullet';
import { Enemy } from '../../CCComponent/Enemy';
import { Player } from '../../CCComponent/Player';
import { Rock } from '../../CCComponent/Rock';
import { CollisionInfoComp } from '../Components/CollisionInfoComp';
import { LifeTimerComponent } from '../Components/LifeTimerComponent';
import { CCNodeComponent } from '../Components/Movement';
const { ccclass, property } = _decorator;

let Bullet_Contact_Wall = PhysicsGroup.Bullet | PhysicsGroup.Wall;
let Bullet_Contact_Enemy_Bullet = PhysicsGroup.Bullet | PhysicsGroup.Bullet_Enemy;

let Player_Contact_Wall = PhysicsGroup.Player | PhysicsGroup.Wall;
let Player_Contact_Collectable = PhysicsGroup.Player | PhysicsGroup.Collectable;

let Player_Contact_Enemy = PhysicsGroup.Player | PhysicsGroup.Enemy;
let Bullet_Contact_Enemy = PhysicsGroup.Bullet | PhysicsGroup.Enemy;

let Player_Contact_Rock = PhysicsGroup.Player | PhysicsGroup.Rock;
let Bullet_Contact_Rock = PhysicsGroup.Bullet | PhysicsGroup.Rock;

let Bullet_Enemy_Contact_Wall = PhysicsGroup.Bullet_Enemy | PhysicsGroup.Wall;
let Bullet_Enemy_Contact_Player = PhysicsGroup.Bullet_Enemy | PhysicsGroup.Player;


let blPos = v3();


/**
 * 物理碰撞都是在一帧内计算的，所以不能在一个碰撞周期内关掉RigidBody，即不能将RigibBody所在的节点隐藏。
 * 
 * 在director的tick方法中，物理的更新是在一帧的最后执行的，那么可以在碰撞时拿到碰撞信息并创建实体，这些
 * 实体将会在下一帧进行碰撞后的处理。
 */
export class CollisionCheckSystem extends ecs.ComblockSystem {

    bullet: Bullet;
    bulletEnemy: Bullet;
    enemy: Enemy;
    ammo: Ammo;
    rock: Rock;

    hw: number = 0;
    hh: number = 0;

    init() {
        this.hw = view.getVisibleSize().width / 2;
        this.hh = view.getVisibleSize().height / 2;
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(CollisionInfoComp);
    }

    update(entities: ecs.Entity[]): void {
        for(let e of entities) {
            let info = e.get(CollisionInfoComp);
            blPos.x = info.colPos.x - this.hw;
            blPos.y = info.colPos.y - this.hh;
            let mask = info.groupA | info.groupB;
            this.refreshNode(info.groupA, info.nodeA);
            this.refreshNode(info.groupB, info.nodeB);
            switch(mask) {
                case Bullet_Enemy_Contact_Wall: {
                    this.bulletEnemy.onCollision();
                    this.bulletEnemy.createEffect(blPos);
                    break;
                }
                case Bullet_Contact_Wall: {
                    this.bullet.onCollision();
                    this.bullet.createEffect(blPos);
                    break;
                }
                case Bullet_Contact_Enemy_Bullet: {
                    this.bullet.onCollision();
                    this.bullet.createEffect(blPos);
                    this.bulletEnemy.onCollision();
                    break;
                }
                case Player_Contact_Wall: {
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
                    this.bullet.createEffect(blPos);
                    break;
                }
                case Player_Contact_Rock: {
                    this.rock.onHit(10);
                    ecs.getSingleton(Player).onHit(20);
                    break;
                }
                case Bullet_Contact_Rock: {
                    this.rock.onHit(10);
                    this.bullet.onCollision();
                    this.bullet.createEffect(blPos);
                    break;
                }
                case Bullet_Enemy_Contact_Player: {
                    ecs.getSingleton(Player).onHit(5);
                    this.bulletEnemy.onCollision();
                    this.bulletEnemy.createEffect(blPos);
                    break;
                }
            }

            e.destroy();

            this.bullet = null;
            this.ammo = null;
            this.enemy = null;
        }
    }
    
    refreshNode(group: PhysicsGroup, node: Node) {
        switch(group) {
            case PhysicsGroup.Enemy: {
                this.enemy = node.getComponent(Enemy);
                break;
            }
            case PhysicsGroup.Collectable: {
                this.ammo = node.getComponent(Ammo);
                break;
            }
            case PhysicsGroup.Bullet: {
                this.bullet = node.getComponent(Bullet);
                break;
            }
            case PhysicsGroup.Bullet_Enemy: {
                this.bulletEnemy = node.getComponent(Bullet);
                break;
            }
            case PhysicsGroup.Rock: {
                this.rock = node.getComponent(Rock);
                break;
            }
        }
    }
}