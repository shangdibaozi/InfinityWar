import { ecs } from "../../../Libs/ECS";

@ecs.register('Health')
export class HealthComp extends ecs.Comp {
    hp: number = 0;
    maxHp: number = 0;

    init(hp: number) {
        this.hp = hp;
        this.maxHp = hp;
    }

    reset() {
    }
}