
import { _decorator, Component, Vec3, v3, BoxCollider2D, Node } from 'cc';
import { PhysicsGroup, UI_EVENT } from '../Constants';
import { Global } from '../Global';
import { ecs } from '../Libs/ECS';
import { ECSTag } from './ECS/Components/ECSTag';
import { CCNodeComponent, MovementComponent } from './ECS/Components/Movement';
import { PlayerComponent } from './ECS/Components/PlayerComponent';
import { ShakeComponent } from './ECS/Components/ShakeComponent';
import { ShootComopnent } from './ECS/Components/ShootComponent';
import { EntLink } from './ECS/EntLink';

const { ccclass, property } = _decorator;
@ccclass('Player')
export class Player extends Component {

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
    
    originalPos: Vec3 = v3();
    defaultHeading: Vec3 = v3();
    defaltTargetHeading: Vec3 = v3();

    onLoad() {
        let playerComp = ecs.getSingleton(PlayerComponent);
        playerComp.val = this;

        let ent = playerComp.ent;

        ent.addTag(ECSTag.TypePlayer);
        ent.addObj(this.shootDetail).addObj(this.movement);
        ent.add(CCNodeComponent).val = this.node;
        ent.addTag(ECSTag.CanMove);
        ent.addTag(ECSTag.CanShoot);
        this.addComponent(EntLink).ent = ent;

        this.shootDetail.hideFlash();

        this.originalPos.set(this.node.position);
        this.defaultHeading.set(this.movement.heading);
        this.defaltTargetHeading.set(this.movement.targetHeading);
    }

    dead() {
        this.trail.active = false;
        this.shootDetail.hideFlash();
        this.bc2d.group = PhysicsGroup.DEFAULT; // 取消碰撞检测
        
        let ent = ecs.getSingleton(PlayerComponent).ent;
        ent.removeTag(ECSTag.CanMove);
        ent.removeTag(ECSTag.CanShoot);
        
        ent.add(ShakeComponent).shake(5, 80, 0.2);
    }

    relive() {
        this.trail.active = true;
        this.node.setPosition(this.originalPos);
        this.node.angle = 0;
        this.bc2d.group = PhysicsGroup.Player;

        let ent = ecs.getSingleton(PlayerComponent).ent;
        
        this.movement.angle = 0;
        this.movement.pos.set(this.originalPos);
        this.movement.heading.set(this.defaultHeading);
        this.movement.targetHeading.set(this.defaltTargetHeading);
        ent.addTag(ECSTag.CanMove);
        ent.addTag(ECSTag.CanShoot);
    }
}