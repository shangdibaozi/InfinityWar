
import { _decorator, Component, Node, v2, v3 } from 'cc';
import { ECSTag } from '../Core/ECS/Components/ECSTag';
import { CCNodeComponent, MovementComponent } from '../Core/ECS/Components/Movement';
import { ecs } from '../Libs/ECS';
import { UIBase } from '../Libs/UIBase/UIBase';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends UIBase {
    
    
    on_btnRelive() {
        let ents = ecs.query(ecs.allOf(ECSTag.TypePlayer));
        if(ents.length > 0) {
            let originalPos = v3(0, -245, 0);
            ents[0].get(CCNodeComponent).val.setPosition(originalPos);
            ents[0].get(MovementComponent).pos.set(originalPos);
            ents[0].addTag(ECSTag.CanMove);
            ents[0].addTag(ECSTag.CanShoot);
        }
    }
}