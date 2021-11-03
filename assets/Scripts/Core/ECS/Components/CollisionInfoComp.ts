import { Node, v2, Vec2 } from "cc";
import { PhysicsGroup } from "../../../Constants";
import { ecs } from "../../../Libs/ECS";


@ecs.register('CollisionInfo')
export class CollisionInfoComp extends ecs.Comp {
    nodeA: Node = null;
    nodeB: Node = null;

    groupA: PhysicsGroup = PhysicsGroup.DEFAULT;
    groupB: PhysicsGroup = PhysicsGroup.DEFAULT;

    colPos: Vec2 = v2();

    reset() {
        this.nodeA = null;
        this.nodeB = null;
    }
}