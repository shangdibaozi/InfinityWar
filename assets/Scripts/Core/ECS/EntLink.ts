
import { _decorator, Component, Node } from 'cc';
import { ObjPool } from '../../Common/ObjPool';
import { ecs } from '../../Libs/ECS';
const { ccclass, property } = _decorator;

@ccclass('EntLink')
export class EntLink extends Component {
    ent: ecs.Entity = null;

    recycle() {
        if(this.ent) {
            ObjPool.putNode(this.node);
            this.ent.destroy();
            this.ent = null;
        }
    }
}