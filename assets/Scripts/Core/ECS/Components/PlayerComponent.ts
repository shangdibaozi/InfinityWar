import { ecs } from "../../../Libs/ECS";
import { Player } from "../../Player";

@ecs.register('Playe')
export class PlayerComponent extends ecs.IComponent {

    val: Player = null;

    reset() {
        this.val = null;
    }
}