
import { _decorator, Component, Vec3, v3, BoxCollider2D, Node, systemEvent, SystemEvent, EventKeyboard, KeyCode, CCInteger, RigidBody2D, Collider2D, Contact2DType } from 'cc';
import { PhysicsGroup, UI_EVENT } from '../../Constants';
import { Global } from '../../Global';
import { ecs } from '../../Libs/ECS';
import { CCComp } from '../ECS/Components/CCComp';
import { ECSTag } from '../ECS/Components/ECSTag';
import { HealthComp } from '../ECS/Components/HealthComp';
import { MovementComponent, CCNodeComponent, BoostComp } from '../ECS/Components/Movement';
import { ShakeComponent } from '../ECS/Components/ShakeComponent';
import { ShootComopnent } from '../ECS/Components/ShootComponent';
import { EntLink } from '../ECS/EntLink';


const { ccclass, property } = _decorator;
@ccclass('Player')
@ecs.register('Player', false)
export class Player extends CCComp {

    @property({
        type: Node
    })
    trail: Node;

    @property({
        type: ShootComopnent
    })
    shootDetail: ShootComopnent;

    @property({
        type: MovementComponent
    })
    movement: MovementComponent;

    @property({
        type: BoostComp
    })
    boost: BoostComp;

    health: HealthComp = new HealthComp();

    @property({
        type: CCInteger
    })
    maxHp: number = 100;
    
    originalPos: Vec3 = v3();
    defaultHeading: Vec3 = v3();
    defaltTargetHeading: Vec3 = v3();

    score: number = 0;

    onLoad() {
        super.onLoad();
        ecs.addSingleton(this);
        
        Global.uiEvent.on(UI_EVENT.PLAYER_MOVE, this.onPlayerMove, this);
        
        let ent = this.ent;

        ent.add(ECSTag.TypePlayer);
        // ent.add(this.shootDetail);
        ent.add(this.movement);
        ent.add(this.boost);
        ent.add(CCNodeComponent).val = this.node;
        ent.add(ECSTag.CanMove);
        ent.add(ECSTag.CanShoot);
        ent.add(this.health);
        this.health.init(this.maxHp);

        this.shootDetail.hideFlash();

        this.originalPos.set(this.node.position);
        this.defaultHeading.set(this.movement.heading);
        this.defaltTargetHeading.set(this.movement.targetHeading);

        // test
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if(event.keyCode == KeyCode.KEY_W) {
                this.boost.boosting = true;
                this.boost.isAdd = true;
            }
            else if(event.keyCode == KeyCode.KEY_S) {
                this.boost.boosting = true;
                this.boost.isAdd = false;
            }
        }, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, event => {
            if(event.keyCode == KeyCode.KEY_W || event.keyCode == KeyCode.KEY_S) {
                this.boost.boosting = false;
            }
        });
    }

    onEnable() {
        let health = this.ent.get(HealthComp);
        Global.uiEvent.emit(UI_EVENT.UPDATE_HP, health.hp, health.maxHp);
        Global.uiEvent.emit(UI_EVENT.UPDATE_SCORE, 0);
    }

    onPlayerMove(heading: Vec3) {
        this.ent.get(MovementComponent).targetHeading.set(heading);
    }

    die() {
        if(!this.ent.has(ECSTag.CanMove)) {
            return;
        }
        this.trail.active = false;
        this.shootDetail.hideFlash();
        this.movement.rb2d.sleep(); // 取消碰撞检测
        
        let ent = this.ent;
        ent.remove(ECSTag.CanMove);
        ent.remove(ECSTag.CanShoot);
        
        ent.add(ShakeComponent).shake(5, 80, 0.2);
    }

    onHit(damage: number = 10) {
        this.health.hp -= damage;
        if(this.health.hp <= 0) {
            this.health.hp = 0;
            this.die();
        }
        Global.uiEvent.emit(UI_EVENT.UPDATE_HP, this.health.hp, this.health.maxHp);
    }

    relive() {
        this.trail.active = true;
        this.node.setPosition(this.originalPos);
        this.node.angle = 0;
        this.movement.rb2d.wakeUp();

        let ent = this.ent;
        
        this.movement.angle = 0;
        // this.movement.pos.set(this.originalPos);
        this.movement.heading.set(this.defaultHeading);
        this.movement.targetHeading.set(this.defaltTargetHeading);
        ent.add(ECSTag.CanMove);
        ent.add(ECSTag.CanShoot);

        this.health.init(this.maxHp);
        this.score = 0;

        Global.uiEvent.emit(UI_EVENT.UPDATE_HP, this.health.hp, this.health.maxHp);
        Global.uiEvent.emit(UI_EVENT.UPDATE_SCORE, this.score);
    }

    addAmmo(amount: number) {
        this.shootDetail.ammo = Math.min(this.shootDetail.ammo + amount, this.shootDetail.maxAmmo);

        this.score += 50;
        Global.uiEvent.emit(UI_EVENT.UPDATE_SCORE, this.score);
    }
}