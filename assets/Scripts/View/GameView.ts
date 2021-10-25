
import { Node, _decorator } from 'cc';
import { UI_EVENT } from '../Constants';
import { Player } from '../Core/CCComponent/Player';
import { Global } from '../Global';
import { ecs } from '../Libs/ECS';
import { UIBase } from '../Libs/UIBase/UIBase';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends UIBase {
    
    _hpBar: Node;
    _hpLbl: Node;
    _scoreLbl: Node;

    onLoad() {
        this.installEvents();
    }

    installEvents() {
        Global.uiEvent.on(UI_EVENT.UPDATE_HP, this.onUpdateHp, this);
        Global.uiEvent.on(UI_EVENT.UPDATE_SCORE, this.onUpdateScore, this);
    }

    onUpdateHp(hp: number, maxHp: number) {
        this._hpBar.$ProgressBar.progress = hp / maxHp;
        this._hpLbl.$Label.string = `${hp}/${maxHp}`;
    }

    onUpdateScore(score: number) {
        this._scoreLbl.$Label.string = `${score}`;
    }
    
    on_btnRelive() {
        let player = ecs.getSingleton(Player);
        player.relive();
    }
}