import { _decorator } from 'cc';
import { ecs } from "../../../Libs/ECS";


const { ccclass, property } = _decorator;
@ccclass('ShootComopnent')
@ecs.register('ShootInfo')
export class ShootComopnent extends ecs.IComponent {
    @property
    interval: number = 1;

    reset() {

    }
}