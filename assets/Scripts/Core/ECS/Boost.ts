
import { _decorator, Component, Node } from 'cc';
import { Global } from '../../Global';
import { ecs } from '../../Libs/ECS';
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
    }

    update(dt: number) {
        this.rootSys.execute(dt);
    }
}
