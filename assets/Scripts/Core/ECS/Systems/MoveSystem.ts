import { Node, UITransform, Vec3 } from "cc";
import { ObjPool } from "../../../Common/ObjPool";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Player } from "../../CCComponent/Player";
import { ECSTag } from "../Components/ECSTag";
import { CCNodeComponent, MovementComponent } from "../Components/Movement";

/**
 * 没有物理来控制移动和转向，主要是让飞机按旋转到运动方向部分写起来非常麻烦，或者说是不知道怎么写，可能是现阶段引擎的问题。
 * 
 * 通过看引擎源码发现，其实通过非物理方式控制刚体运动，引擎也会把物体的坐标点同步到
 * 物理系统上。详见rigid-body.ts中的_onNodeTransformChanged方法。
 * 
 * 钢铁运动结点同步到渲染层的调用流程是
 * director的tick方法->physics-system的postUpdate方法->physics-world的syncPhysicsToScene方法
 */
export class MoveSystem extends ecs.ComblockSystem {

    minX: number = 0;
    minY: number = 0;
    maxX: number = 0;
    maxY: number = 0;

    init() {
        let size = Global.bulletLayer.getComponent(UITransform).contentSize;
        this.maxX = size.width * 0.5 + 100;
        this.maxY = size.height * 0.5 + 100;
        this.minX = -this.maxX;
        this.minY = -this.maxY;
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(CCNodeComponent, MovementComponent, ECSTag.CanMove);
    }

    update(entities: ecs.Entity[]): void {
        let playerComp = ecs.getSingleton(Player);
        let playerPos: Vec3 = null;
        if(playerComp && playerComp.ent.has(ECSTag.CanMove)) {
            playerPos = playerComp.movement.pos;
        }

        let dt = this.dt;
        for(let ent of entities) {
            let move = ent.get(MovementComponent);
            let ccnode = ent.get(CCNodeComponent);

            if(ent.has(ECSTag.TypeAmmo) && playerPos) {
                Vec3.subtract(move.targetHeading, playerPos, move.pos);
            }
            move.update(dt);
            ccnode.val.setPosition(move.pos);
            ccnode.val.angle = move.angle;

            if(!ent.has(ECSTag.TypePlayer)) {
                this.outofRangeCheck(move.pos, ent);
            }
        }
    }

    outofRangeCheck(pos: Vec3, ent: ecs.Entity) {
        if(pos.x < this.minX || pos.y < this.minY || pos.x > this.maxX || pos.y > this.maxY) {
            ObjPool.putNode(ent.get(CCNodeComponent).val);
            ent.remove(ECSTag.CanMove);
        }
    }
}
