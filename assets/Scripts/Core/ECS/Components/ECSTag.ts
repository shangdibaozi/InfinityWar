import { ecs } from "../../../Libs/ECS";

@ecs.registerTag()
export class ECSTag {
    static TypePlayer: number = 0;

    static TypeBullet: number = 0;
}