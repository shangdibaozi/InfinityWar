import { ecs } from "../../../Libs/ECS";

@ecs.registerTag()
export class ECSTag {
    static TypePlayer: number = 0;

    static TypeBullet: number = 0;

    static TypeCamera: number = 0;

    static CanMove: number = 0;
    static CanShoot: number = 0;
}