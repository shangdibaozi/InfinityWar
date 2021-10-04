import { EPSILON } from "cc";
import { ecs } from "../../../Libs/ECS";

@ecs.register('LifeTimer')
export class LifeTimerComponent extends ecs.Comp {
    maxLifeTime: number = EPSILON;
    lifeTime: number = 0;

    get percent() {
        return this.lifeTime / this.maxLifeTime;
    }

    init(time: number) {
        this.lifeTime = time;
        this.maxLifeTime = time;
        if(time < EPSILON) {
            this.maxLifeTime = EPSILON;
        }
    }

    reset() {
        this.maxLifeTime = EPSILON;
        this.lifeTime = 0;
    }
}