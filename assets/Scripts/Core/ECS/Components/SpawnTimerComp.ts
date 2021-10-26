import { ecs } from "../../../Libs/ECS";


@ecs.register('SpawnTimer')
export class SpawnTimerComp extends ecs.Comp {
    timer: number = 0;
    objType: string = '';
    
    reset() {

    }
}