
import { _decorator, Component, CameraComponent } from 'cc';
import { ECSTag } from '../Core/ECS/Components/ECSTag';
import { GameCameraComponent } from '../Core/ECS/Components/GameCameraComponent';
import { CCNodeComponent } from '../Core/ECS/Components/Movement';
import { ecs } from '../Libs/ECS';
const { ccclass, property } = _decorator;



@ccclass('CameraShake')
export class CameraShake extends Component {
    
    @property({
        type: GameCameraComponent
    })
    shakeInfo: GameCameraComponent;

    onLoad() {
        ecs.getSingleton(GameCameraComponent).ent.add(CCNodeComponent).val = this.node;
    }
    
}
