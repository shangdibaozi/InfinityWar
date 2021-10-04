import { ecs } from "../../../Libs/ECS";
import { LifeTimerComponent } from "./LifeTimerComponent";

@ecs.register('MethodComponent')
export class MethodComponent extends ecs.Comp {

    static matcher: ecs.IMatcher = ecs.allOf(LifeTimerComponent);

    foo() {
        this.ent.get(LifeTimerComponent).lifeTime = 100;
        console.log('foo');
    }

    reset() {

    }
}