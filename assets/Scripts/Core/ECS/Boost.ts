
import { _decorator, Component, Node } from 'cc';
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
        window['ecs'] = ecs;

        
        Global.gameLayer = this.gameLayer;
        Global.bulletLayer = this.bulletLayer;
        this.rootSys.init();
        this.initCommonSys();
    }

    initCommonSys() {
        ecs.createEntityWithComp(ECSTag.TypeFactoryAmmo);
        ecs.createEntityWithComp(ECSTag.TypeFactoryRock);
    }

    update(dt: number) {
        this.rootSys.execute(dt);
    }
}
