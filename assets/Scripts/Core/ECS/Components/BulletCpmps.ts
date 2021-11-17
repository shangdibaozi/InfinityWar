import { ecs } from "../../../Libs/ECS";

@ecs.register('HomingProjectile')
export class HomingProjectileComp extends ecs.Comp {

    target: ecs.Entity;

    reset() {
        this.target = null;
    }
}

@ecs.register('NinetyDegreeChangeProjectile')
export class NinetyDegreeChangeProjectileComp extends ecs.Comp {

    ninetyDegreeDirection: number = 0;

    state: number = 0;

    timer0: number = 0.2;
    timer1: number = 0.25;
    timer2: number = 0.1;

    reset() {

    }
}