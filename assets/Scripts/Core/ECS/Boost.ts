
import { _decorator, Component, Node } from 'cc';
import { Global } from '../../Global';
import { RootSystem } from './Systems/RootSystem';
const { ccclass, property } = _decorator;

@ccclass('Boost')
export class Boost extends Component {

    @property({
        type: Node
    })
    gameLayer: Node;

    rootSys: RootSystem = new RootSystem();

    onLoad() {
        Global.gameLayer = this.gameLayer;
        this.rootSys.init();
    }

    update(dt: number) {
        this.rootSys.execute(dt);
    }
}
