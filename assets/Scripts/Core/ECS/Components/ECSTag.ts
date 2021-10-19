import { ecs } from "../../../Libs/ECS";

@ecs.registerTag()
export class ECSTag {
    static TypePlayer: number = 0;
    
    static TypeEnemy: number = 0;

    static TypeBullet: number = 0;

    static TypeCamera: number = 0;

    static TypeAmmo: number = 0;

    static TypeRock: number = 0;

    static TypeFactoryAmmo: number = 0;
    static TypeFactoryRock: number = 0;
    static TypeFactoryEnemy: number = 0;

    static CanMove: number = 0;
    static CanShoot: number = 0;
}