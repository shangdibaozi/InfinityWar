
import { _decorator, Component, Node } from 'cc';
import { Global } from '../../Global';
import { RootSystem } from './Systems/RootSystem';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Boost
 * DateTime = Mon Sep 27 2021 23:23:50 GMT+0800 (中国标准时间)
 * Author = shangdibaozi
 * FileBasename = Boost.ts
 * FileBasenameNoExtension = Boost
 * URL = db://assets/Scripts/Core/ECS/Boost.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
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
