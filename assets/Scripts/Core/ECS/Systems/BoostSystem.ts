import { ecs } from "../../../Libs/ECS";
import { BoostComp, MovementComponent } from "../Components/Movement";

export class BoostSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    entityEnter(entities: ecs.Entity[]): void {
        for(let e of entities) {
            e.get(BoostComp).baseMaxSpeed = e.get(MovementComponent).maxSpeed;
        }
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(BoostComp, MovementComponent);
    }
    
    update(entities: ecs.Entity[]): void {
        let boostComp: BoostComp;
        let moveComp: MovementComponent;
        let dt = this.dt;
        for(let e of entities) {
            boostComp = e.get(BoostComp);
            moveComp = e.get(MovementComponent);
            if(boostComp.boost < boostComp.maxBoost) {
                boostComp.boost = Math.min(boostComp.addBoostSpeed * dt + boostComp.boost, boostComp.maxBoost);
            }

            boostComp.timer += dt;
            if(boostComp.timer > boostComp.cooldown) {
                boostComp.canBoost = true;
            }

            if(boostComp.canBoost && boostComp.boosting) {
                if(boostComp.isAdd) {
                    moveComp.maxSpeed = boostComp.baseMaxSpeed * boostComp.multiAdd;
                    moveComp.acceleration = Math.abs(moveComp.acceleration);
                }
                else {
                    moveComp.maxSpeed = boostComp.baseMaxSpeed * boostComp.multiSub;
                    this.changeAcc(moveComp);
                }
                boostComp.boost -= boostComp.subBoostSpeed * dt;
                if(boostComp.boost <= 0) {
                    boostComp.canBoost = false;
                    boostComp.timer = 0;
                    moveComp.maxSpeed = boostComp.baseMaxSpeed;
                }
            }
            else {
                moveComp.maxSpeed = boostComp.baseMaxSpeed;
                this.changeAcc(moveComp);
            }
        }
    }

    changeAcc(moveComp: MovementComponent) {
        if(moveComp.speed > moveComp.maxSpeed) {
            moveComp.acceleration = -Math.abs(moveComp.acceleration);
        }
        else {
            moveComp.acceleration = Math.abs(moveComp.acceleration);
        }
    }
}