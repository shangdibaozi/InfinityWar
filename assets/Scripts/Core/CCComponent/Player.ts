
import { _decorator, Component, Vec3, v3, BoxCollider2D, Node, systemEvent, SystemEvent, EventKeyboard, KeyCode } from 'cc';
import { PhysicsGroup, UI_EVENT } from '../../Constants';
import { Global } from '../../Global';
import { ecs } from '../../Libs/ECS';
import { CCComp } from '../ECS/Components/CCComp';
import { ECSTag } from '../ECS/Components/ECSTag';
import { MovementComponent, CCNodeComponent, BoostComp } from '../ECS/Components/Movement';
import { ShakeComponent } from '../ECS/Components/ShakeComponent';
import { ShootComopnent } from '../ECS/Components/ShootComponent';
import { EntLink } from '../ECS/EntLink';


const { ccclass, property } = _decorator;
@ccclass('Player')
@ecs.register('Player', false)
export class Player extends CCComp {

    @property({
        type: BoxCollider2D
    })
    bc2d: BoxCollider2D;

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
    
    originalPos: Vec3 = v3();
    defaultHeading: Vec3 = v3();
    defaltTargetHeading: Vec3 = v3();

    onLoad() {
        super.onLoad();
        ecs.addSingleton(this);
        
        Global.uiEvent.on(UI_EVENT.PLAYER_MOVE, this.onPlayerMove, this);
        
        let ent = this.ent;

        ent.add(ECSTag.TypePlayer);
        ent.add(this.shootDetail).add(this.movement).add(this.boost);
        ent.add(CCNodeComponent).val = this.node;
        ent.add(ECSTag.CanMove);
        ent.add(ECSTag.CanShoot);
        this.addComponent(EntLink).ent = ent;

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

    onPlayerMove(heading: Vec3) {
        this.ent.get(MovementComponent).targetHeading.set(heading);
    }

    dead() {
        this.trail.active = false;
        this.shootDetail.hideFlash();
        this.bc2d.group = PhysicsGroup.DEFAULT; // 取消碰撞检测
        
        let ent = this.ent;
        ent.remove(ECSTag.CanMove);
        ent.remove(ECSTag.CanShoot);
        
        ent.add(ShakeComponent).shake(5, 80, 0.2);
    }

    relive() {
        this.trail.active = true;
        this.node.setPosition(this.originalPos);
        this.node.angle = 0;
        this.bc2d.group = PhysicsGroup.Player;

        let ent = this.ent;
        
        this.movement.angle = 0;
        this.movement.pos.set(this.originalPos);
        this.movement.heading.set(this.defaultHeading);
        this.movement.targetHeading.set(this.defaltTargetHeading);
        ent.add(ECSTag.CanMove);
        ent.add(ECSTag.CanShoot);
    }

    reset() {

    }
}