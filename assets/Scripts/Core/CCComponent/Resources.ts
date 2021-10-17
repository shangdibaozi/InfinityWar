
import { _decorator, Component, Node, Prefab } from 'cc';
import { ecs } from '../../Libs/ECS';
import { CCComp } from '../ECS/Components/CCComp';
const { ccclass, property } = _decorator;

@ecs.register('Resources', false)
@ccclass('Resources')
export class Resources extends CCComp {
    
    @property({
        type: Prefab
    })
    ammo: Prefab;

    onLoad() {
        ecs.addSingleton(this);
    }
}