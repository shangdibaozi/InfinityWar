
import { _decorator } from 'cc';
import { Player } from '../Core/CCComponent/Player';
import { ecs } from '../Libs/ECS';
import { UIBase } from '../Libs/UIBase/UIBase';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends UIBase {
    
    
    on_btnRelive() {
        let player = ecs.getSingleton(Player);
        player.relive();
    }
}