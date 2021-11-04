import { js, Pool, sp, v3, view } from "cc";
import { ObjPool } from "../../../Common/ObjPool";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { Ammo } from "../../CCComponent/Ammo";
import { Enemy } from "../../CCComponent/Enemy";
import { Resources } from "../../CCComponent/Resources";
import { Rock } from "../../CCComponent/Rock";
import { ECSTag } from "../Components/ECSTag";
import { SpawnTimerComp } from "../Components/SpawnTimerComp";


type ChanceDef = [ObjType, number];

class ChanceList {
    chanceList: ObjType[] = [];
    chanceDefinitions: ChanceDef[];

    constructor(lst: ChanceDef[]) {
        this.chanceDefinitions = lst;
    }

    next() {
        if(this.chanceList.length == 0) {
            for(let i = 0; i < this.chanceDefinitions.length; i++) {
                for(let j = 1; j <= this.chanceDefinitions[i][1]; j++) {
                    this.chanceList.push(this.chanceDefinitions[i][0]);
                }
            }
        }
        let idx = Util.randomRangeInt(0, this.chanceList.length);
        let elem = this.chanceList[idx];
        Util.arrFastRemove(this.chanceList, idx);
        return elem;
    }
}

let pos3 = v3();

export class ObjFactory extends ecs.ComblockSystem {

    spawnGroup: ecs.Group = null;

    difficulty: number = 1;
    roundDuration: number = 22;
    roundTimer: number = 0;

    difficulty2Points: Record<number, number> = {};
    enemy2Points: Record<ObjType, number> = {
        'Rock': 2,
        'Shooter': 4
    };
    enemySpawnChances: Record<number, ChanceList> = {
        1: new ChanceList([['Rock', 2]]),
        2: new ChanceList([['Rock', 8], ['Shooter', 4]]),
        3: new ChanceList([['Rock', 8], ['Shooter', 8]]),
        4: new ChanceList([['Rock', 4], ['Shooter', 8]]),
    };

    generateFunc: Record<ObjType, Function> = {
        'Rock': this.generateRock.bind(this),
        'Shooter': this.generateShooter.bind(this)
    }

    init() {
        this.spawnGroup = ecs.createGroup(ecs.allOf(SpawnTimerComp));

        this.difficulty2Points[1] = 16;
        for(let i = 2; i <= 1024; i += 4) {
            this.difficulty2Points[i] = this.difficulty2Points[i - 1] + 8;
            this.difficulty2Points[i + 1] = this.difficulty2Points[i];
            this.difficulty2Points[i + 2] = Math.floor(this.difficulty2Points[i + 1] / 1.5);
            this.difficulty2Points[i + 3] = Math.floor(this.difficulty2Points[i + 2] * 2);
        }

        for(let i = 5; i <= 1024; i++) {
            this.enemySpawnChances[i] = new ChanceList([
                ['Rock', Util.randomRangeInt(2, 12)], 
                ['Shooter', Util.randomRangeInt(2, 12)]
            ]);
        }

        this.setEnemySpawnsForThisRound();
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(ECSTag.TypeObjFactory);
    }

    update(entities: ecs.Entity[]): void {
        let dt = this.dt;
        this.roundTimer += dt;
        if(this.roundTimer >= this.roundDuration) {
            this.roundTimer = 0;
            this.difficulty += 1;
            this.setEnemySpawnsForThisRound();
        }

        if(this.spawnGroup.count > 0) {
            let spComp: SpawnTimerComp;
            for(let e of this.spawnGroup.matchEntities) {
                spComp = e.get(SpawnTimerComp);
                spComp.timer -= dt;
                if(spComp.timer <= 0) {
                    this.generateFunc[spComp.objType]();
                    e.destroy();
                }
            }
        }
    }

    setEnemySpawnsForThisRound() {
        let points = this.difficulty2Points[this.difficulty];

        let runs = 0;
        let enemyLst: ObjType[] = [];
        while(points > 0 && runs < 1000) {
            let enemy = this.enemySpawnChances[this.difficulty].next();
            points -= this.enemy2Points[enemy];
            enemyLst.push(enemy);
            runs += 1;
        }

        let enemySpawnTimes = [];
        for(let i = 0; i < enemyLst.length; i++) {
            enemySpawnTimes.push(Util.randomRange(0, this.roundDuration));
        }

        for(let i = 0; i < enemySpawnTimes.length; i++) {
            let comp = ecs.createEntityWithComp(SpawnTimerComp);
            comp.timer = enemySpawnTimes[i];
            comp.objType = enemyLst[i];
        }
    }

    generateShooter() {
        let prefab = ecs.getSingleton(Resources).enemy1;
        let node = ObjPool.getNode(prefab.data.name, prefab);
        node.parent = Global.bulletLayer;
        node.active = true;
        let movement = node.getComponent(Enemy).movement;

        let winSize = view.getVisibleSize();
        let y = Util.randomRange(-winSize.height / 2, winSize.height / 2);
        if(Math.random() < 0.5) {
            movement.targetHeading.set(1, 0, 0);
            pos3.set(-winSize.width / 2 - 90, y);
        }
        else {
            movement.targetHeading.set(-1, 0, 0);
            pos3.set(winSize.width / 2 + 90, y);
        }
        
        node.setPosition(pos3);
    }


    generateRock() {
        let node = ObjPool.getNode('Rock', ecs.getSingleton(Resources).rock);
        node.parent = Global.bulletLayer;
        node.active = true;
        let movement = node.getComponent(Rock).movement;
        movement.speed = Util.randomRange(300, 500);
        movement.maxSpeed = movement.speed;

        let winSize = view.getVisibleSize();
        let y = Util.randomRange(-winSize.height / 2, winSize.height / 2);
        if(Math.random() < 0.5) {
            movement.heading.set(1, 0, 0);
            pos3.set(-winSize.width / 2 - 20, y);
        }
        else {
            movement.heading.set(-1, 0, 0);
            pos3.set(winSize.width / 2 + 20, y);
        }
        node.setPosition(pos3);
    }

    generateAmmo() {
        let res = ecs.getSingleton(Resources);
        let node = ObjPool.getNode('Ammo', res.ammo);
        node.active = true;
        node.parent = Global.bulletLayer;
        let ammo = node.getComponent(Ammo);

        let winSize = view.getVisibleSize();
        let y = Util.randomRange(-winSize.height / 2, winSize.height / 2);
        if(Math.random() < 0.5) {
            ammo.movement.heading.set(1, 0, 0);
            pos3.set(-winSize.width / 2 - 20, y);
        }
        else {
            ammo.movement.heading.set(-1, 0, 0);
            pos3.set(winSize.width / 2 + 20, y);
        }
        node.setPosition(pos3);
    }
}