
import { _decorator, Component, Node, Vec3, v3, systemEvent, SystemEvent, EventKeyboard, KeyCode } from 'cc';
import { ecs } from '../Libs/ECS';
import { Shake } from './Shake';
const { ccclass, property } = _decorator;

@ecs.register('Camera')
class CameraComponent extends ecs.IComponent {
    originPos: Vec3 = v3();
    pos: Vec3 = v3();

    xShakes: Shake[] = [];
    yShakes: Shake[] = [];

    shake(amplitude: number, frequence: number, duration: number) {
        this.xShakes.push(Shake.new(amplitude, frequence, duration));
        this.yShakes.push(Shake.new(amplitude, frequence, duration));
    }

    reset() {
        this.pos.set(Vec3.ZERO);
    }
}

class CameraEnt extends ecs.Entity {
    Camera: CameraComponent;
}

@ccclass('CameraShake')
export class CameraShake extends Component {

    cameraComp: CameraComponent;

    onLoad() {
        this.cameraComp = ecs.getSingleton(CameraComponent);
        this.cameraComp.originPos.set(this.node.getPosition());
        

        systemEvent.on(SystemEvent.EventType.KEY_DOWN, (event: EventKeyboard) => {
            switch(event.keyCode) {
                case KeyCode.KEY_G: {
                    this.cameraComp.shake(6, 60, 0.4);
                    break;
                }
            }
        }, this);
    }
    
    move(dx: number, dy: number) {
        this.node.setPosition(dx, dy, this.cameraComp.originPos.z);
    }

    update(dt: number) {
        let xShakeAmount = this.cameraComp.originPos.x;
        let yShakeAmount = this.cameraComp.originPos.y;
        if(this.cameraComp.xShakes.length > 0 || this.cameraComp.yShakes.length > 0) {
            let xShakes = this.cameraComp.xShakes;
            let yShakes = this.cameraComp.yShakes;
            let len = xShakes.length - 1;
            for(let i = len; i >= 0; i--) {
                xShakes[i].update(dt);
                xShakeAmount += xShakes[i].getAmplitude();
                if(xShakes[i].notShaking) {
                    Shake.push(xShakes[i]);
                    xShakes.splice(i, 1);
                }
            }

            len = yShakes.length - 1;
            for(let i = len; i >= 0; i--) {
                yShakes[i].update(dt);
                yShakeAmount += yShakes[i].getAmplitude();
                if(yShakes[i].notShaking) {
                    Shake.push(yShakes[i]);
                    yShakes.splice(i, 1);
                }
            }
        }
        this.move(xShakeAmount, yShakeAmount);
    }
}
