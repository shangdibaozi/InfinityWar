
import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags } from 'cc';
import { Global } from '../../Global';
import { ecs } from '../../Libs/ECS';
import { ECSTag } from './Components/ECSTag';
import { LifeTimerComponent } from './Components/LifeTimerComponent';
import { RootSystem } from './Systems/RootSystem';
const { ccclass, property } = _decorator;

@ccclass('Boost')
export class Boost extends Component {

    @property({
        type: Node
    })
    gameLayer: Node;

    @property({
        type: Node
    })
    bulletLayer: Node;

    rootSys: RootSystem = new RootSystem();

    onLoad() {
        const phSystem = PhysicsSystem2D.instance;
        // 物理步长，默认 fixedTimeStep 是 1/60
        phSystem.fixedTimeStep = 1 / 30;
        // 每次更新物理系统处理速度的迭代次数，默认为 10
        phSystem.velocityIterations = 10;
        // 每次更新物理系统处理位置的迭代次数，默认为 10
        phSystem.positionIterations = 10;

        // PhysicsSystem2D.instance.debugDrawFlags = 
                                    // EPhysics2DDrawFlags.Aabb | 
                                    // EPhysics2DDrawFlags.CenterOfMass | 
                                    // EPhysics2DDrawFlags.Shape;

        window['ecs'] = ecs;

        
        Global.gameLayer = this.gameLayer;
        Global.bulletLayer = this.bulletLayer;
        this.rootSys.init();
        this.initCommonSys();
    }

    initCommonSys() {
        ecs.createEntityWithComp(ECSTag.TypeObjFactory);
    }

    update(dt: number) {
        this.rootSys.execute(dt);
    }

    lateUpdate() {
        
    }
}
