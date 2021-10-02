
import { _decorator } from 'cc';
import { PlayerComponent } from '../Core/ECS/Components/PlayerComponent';
import { ecs } from '../Libs/ECS';
import { UIBase } from '../Libs/UIBase/UIBase';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends UIBase {
    
    
    on_btnRelive() {
        let player = ecs.getSingleton(PlayerComponent).val;
        player.relive();
    }
}