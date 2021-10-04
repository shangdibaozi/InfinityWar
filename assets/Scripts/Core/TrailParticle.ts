
import { _decorator, Component, Node, Graphics, Color, color, toRadian } from 'cc';
import { ecs } from '../Libs/ECS';
import { Util } from '../Util';
import { LifeTimerComponent } from './ECS/Components/LifeTimerComponent';
const { ccclass, property } = _decorator;

const DefaultColor = color(255, 198, 93, 255);

@ecs.register('Particle')
class ParticleComp extends ecs.Comp {
    x: number = 0;
    y: number = 0;
    r: number = 0;
    color: Color = color();

    reset() {
        this.x = 0;
        this.y = 0;
        this.r = 0;

        this.color.set(DefaultColor);
    }
}

class ParticleEnt extends ecs.Entity {
    Particle: ParticleComp;
    LifeTimer: LifeTimerComponent;
}

@ccclass('TrailParticle')
export class TrailParticle extends Component {
    @property(Graphics)
    graphics: Graphics;
    

    particleGroup: ecs.Group<ParticleEnt>;

    onLoad() {
        this.particleGroup = ecs.createGroup(ecs.allOf(ParticleComp, LifeTimerComponent));
    }

    // createParticle(offsetX: number, offsetY: number) {
    //     let ent = ecs.createEntityWithComps<ParticleEnt>(ParticleComp, LifeTimerComponent);
    //     ent.LifeTimer.init(Util.randomRange(0.2, 0.35));
    //     let pos = this.player.node.getPosition();
    //     // curHeading是向量i的朝向，j和i垂直，并且j始终在i的顺时针方向。
    //     let x = offsetX * this.player.curHeading.x + offsetY * -this.player.curHeading.y;
    //     let y = offsetX * this.player.curHeading.y + offsetY * this.player.curHeading.x;
    //     ent.Particle.x = pos.x + x;
    //     ent.Particle.y = pos.y + y;
    //     ent.Particle.r = Util.randomRange(2, 4);
    //     ent.Particle.color.set(DefaultColor);
    // }

    update(dt: number) {
        // this.createParticle(-25, 5);
        // this.createParticle(-25, -5);
        if(this.particleGroup.count > 0) {
            this.graphics.clear();
            for(let ent of this.particleGroup.matchEntities) {
                ent.LifeTimer.lifeTime -= dt;
                if(ent.LifeTimer.lifeTime <= 0) {
                    ent.destroy();
                }
                else {
                    ent.Particle.r *= ent.LifeTimer.percent;
                    this.graphics.strokeColor = ent.Particle.color;
                    this.graphics.circle(ent.Particle.x, ent.Particle.y, ent.Particle.r);
                    this.graphics.fill();
                }
            }
            this.graphics.stroke();
        }
    }
}
