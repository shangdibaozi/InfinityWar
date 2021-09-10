import { Util } from "../Util";


export class Shake {
    private amplitude: number = 0;
    private frequency: number = 0;
    private duration: number = 0;
    private samples: number[] = [];
    private shaking: boolean = false;

    get notShaking() {
        return !this.shaking;
    }
    
    private t: number = 0;

    static objPool: Shake[] = [];

    static new(amplitude: number, frequency: number, duration: number) {
        let obj = this.objPool.pop() || new Shake();
        obj.init(amplitude, frequency, duration)
        return obj;
    }

    static push(obj: Shake) {
        this.objPool.push(obj);
    }

    /**
     * 
     * @param amplitude 振幅
     * @param frequency 频率
     * @param duration 周期（单位：秒）
     */
    private init(amplitude: number, frequency: number, duration: number) {
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.duration = duration;

        let sampleCount = duration * frequency;
        this.samples.length = 0;
        for(let i = 0; i < sampleCount; i++) {
            this.samples.push(Util.randomRange(-1, 1));
        }

        this.t = 0;
        this.shaking = true;
    }

    update(dt: number) {
        this.t += dt;
        if(this.t > this.duration) {
            this.shaking = false;
        }
    }

    getAmplitude() {
        if(!this.shaking) {
            return 0;
        }
        let s = this.t * this.frequency;
        let s0 = Math.floor(s);
        let s1 = s0 + 1;
        let k = this.decay(this.t);
        return this.amplitude * (this.noise(s0) + (s - s0) * (this.noise(s1) - this.noise(s0))) * k;
    }

    private noise(s: number) {
        if(s >= this.samples.length) {
            return 0;
        }
        else {
            return this.samples[s];
        }
    }

    private decay(t: number) {
        if(t > this.duration) {
            return 0;
        }
        else {
            return (this.duration - t) / this.duration;
        }
    }
}