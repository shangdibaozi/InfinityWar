import { v3, Vec2, Vec3 } from "cc";
import { ecs } from "../../../Libs/ECS";

@ecs.register('NormalProjectile')
export class NormalProjectileComp extends ecs.Comp {
    reset(): void {
        
    }
}

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

@ecs.register('WavyProjectile')
export class WavyProjectileComp extends ecs.Comp {

    direction: number = 0;

    heading: Vec3 = v3();

    state: number = 0;

    timer: number = 0;

    reset() {

    }
}