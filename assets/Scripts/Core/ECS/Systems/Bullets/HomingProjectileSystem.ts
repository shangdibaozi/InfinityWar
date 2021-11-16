import { Vec3 } from "cc";
import { ecs } from "../../../../Libs/ECS";
import { Util } from "../../../../Util";
import { Bullet } from "../../../CCComponent/Bullet";
import { Enemy } from "../../../CCComponent/Enemy";
import { Rock } from "../../../CCComponent/Rock";
import { HomingProjectileComp } from "../../Components/BulletCpmps";
import { ECSTag } from "../../Components/ECSTag";
import { CCNodeComponent, MovementComponent } from "../../Components/Movement";

export class HomingProjectileSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    
    enemyGroup: ecs.Group;

    init() {
        this.enemyGroup = ecs.createGroup(ecs.allOf(CCNodeComponent, ECSTag.CanMove).anyOf(Enemy, Rock));
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(Bullet, ECSTag.CanMove, HomingProjectileComp);
    }

    entityEnter(entities: ecs.Entity[]): void {
        for(let e of entities) {
            let enemy = this.findNearbyEnemy(e.get(Bullet).node.position);
            if(enemy) {
                e.get(HomingProjectileComp).target = enemy;
            }
            else {
                e.remove(HomingProjectileComp);
            }
        }
    }

    findNearbyEnemy(bulletPos: Vec3, distance: number = 400) {
        let enemies: ecs.Entity[] = [];
        for(let e of this.enemyGroup.matchEntities) {
            if(Vec3.distance(bulletPos, e.get(CCNodeComponent).val.position) <= distance) {
                enemies.push(e);
            }
        }
        return Util.randomChoice(enemies);
    }

    update(entities: ecs.Entity[]): void {
        
        for(let e of entities) {
            let target = e.get(HomingProjectileComp).target;
            if(target.has(ECSTag.CanMove)) {
                let targetPos = target.get(CCNodeComponent).val.position;
                let curPos = e.get(Bullet).node.position;
                let movement = e.get(MovementComponent);
                Vec3.subtract(movement.targetHeading, targetPos, curPos);
                movement.targetHeading.normalize();
            }
            else {
                e.remove(HomingProjectileComp);
            }
        }
    }

}