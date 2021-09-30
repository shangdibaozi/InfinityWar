
import { _decorator, Component, Vec3, v3 } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
import { ecs } from '../Libs/ECS';
import { ECSTag } from './ECS/Components/ECSTag';
import { CCNodeComponent, MovementComponent } from './ECS/Components/Movement';
import { ShootComopnent } from './ECS/Components/ShootComponent';
import { EntLink } from './ECS/EntLink';

const { ccclass, property } = _decorator;
@ccclass('Player')
export class Player extends Component {

    @property({
        type: ShootComopnent
    })
    shootDetail: ShootComopnent;

    @property({
        type: MovementComponent
    })
    movement: MovementComponent;

    curHeading: Vec3 = v3(0, 1, 0);

    ent: ecs.Entity = ecs.createEntity();
    onLoad() {
        window['ecs'] = ecs;

        this.ent.addObj(this.shootDetail).addObj(this.movement);
        this.ent.add(CCNodeComponent).val = this.node;
        this.ent.addTag(ECSTag.CanMove);
        this.ent.addTag(ECSTag.CanShoot);
        this.addComponent(EntLink).ent = this.ent;

        this.shootDetail.init();

        this.installEvents();
    }

    onDestroy() {
        this.ent.destroy();
        this.ent = null;
    }

    installEvents() {
        Global.uiEvent.on(UI_EVENT.PLAYER_MOVE, this.onPlayerMove, this);
    }

    onPlayerMove(heading: Vec3) {
        this.movement.targetHeading.set(heading);
    }

    update(dt: number) {
        // this.movement.update(dt);
        // this.node.angle = this.movement.angle;
        // this.node.setPosition(this.movement.pos);
        // this.shootDetail.shoot(dt, this.movement.heading);
    }
}