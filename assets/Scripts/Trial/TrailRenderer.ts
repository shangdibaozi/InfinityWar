
import { _decorator, Component, Node, MotionStreak, Color, IAssembler, Vec2, UI, Enum, Pool, __private } from 'cc';
const { ccclass, property } = _decorator;



const _normal = new Vec2();
const _vec2 = new Vec2();

function normal (out:Vec2, dir:Vec2) {
    // get perpendicular
    out.x = -dir.y;
    out.y = dir.x;
    return out;
}

const _pointPool = new Pool(() => {
    return new MotionStreak.Point();
}, 16);

export const MotionStreakAssembler: IAssembler = {

    createData (comp: MotionStreak) {
        const renderData = comp.requestRenderData();
        renderData.dataLength = 4;
        renderData.vertexCount = 16;
        renderData.indicesCount = (16 - 2) * 3;
        return renderData;
    },

    update (comp: TrailRenderer, dt: number) {
        // const stroke = comp.stroke / 2;
        const node = comp.node;
        const matrix = node.worldMatrix;
        const tx = matrix.m12;
        const ty = matrix.m13;

        const points = comp.points;

        let cur: __private.cocos_particle_2d_motion_streak_2d_Point;
        if (comp.minSeg > 0 && points.length > 1) {
            const point = points[0];
            const difx = point.point.x - tx;
            const dify = point.point.y - ty;
            if ((difx * difx + dify * dify) < comp.minSeg) {
                cur = point;
            }
        }

        if (!cur) {
            cur = _pointPool.alloc();
            points.unshift(cur);
        }
        
        cur.setPoint(tx, ty);
        cur.time = comp.fadeTime + dt;


        if (points.length < 2) {
            return;
        }

        let verticesCount = 0;
        let indicesCount = 0;

        const renderData = comp.renderData!;

        const color = comp.color;
        const cr = color.r;
        const cg = color.g;
        const cb = color.b;
        const ca = color.a;

        const prev = points[1];
        // prev.distance = Vec2.subtract(_vec2, cur.point, prev.point).length();
        Vec2.subtract(_vec2, cur.point, prev.point)
        _vec2.normalize();
        prev.setDir(_vec2.x, _vec2.y);
        cur.setDir(_vec2.x, _vec2.y);

        renderData.dataLength = points.length * 2;

        const data = renderData.data;
        const fadeTime = comp.fadeTime;
        // let findLast = false;
        const stroke = comp.halfStroke;
        for (let i = points.length - 1; i >= 0; i--) {
            const p = points[i];
            const point = p.point;
            const dir = p.dir;
            p.time -= dt;

            if (p.time < 0) {
                _pointPool.free(points[i]);
                points.splice(i, 1);
                continue;
            }

            // progress影响着透明度和uv值
            const progress = p.time / fadeTime;

            // const next = points[i - 1];
            // if (!findLast) {
            //     if (!next) {    // ?
            //         _pointPool.free(points[i]);
            //         points.splice(i, 1);
            //         continue;
            //     }

            //     point.x = next.point.x - dir.x * progress;
            //     point.y = next.point.y - dir.y * progress;
            // }
            // findLast = true;

            normal(_normal, dir);

            const da = progress * ca;
            // 颜色abgr
            const c = ((da << 24) >>> 0) + (cb << 16) + (cg << 8) + cr;

            let offset = verticesCount;

            data[offset].x = point.x + _normal.x * stroke;
            data[offset].y = point.y + _normal.y * stroke;
            if(comp.trailDir == TrailDir.Up) {
                data[offset].u = 1;
                data[offset].v = 1 - progress;
            }
            else if(comp.trailDir == TrailDir.Right) {
                data[offset].u = progress;
                data[offset].v = 1;
            }  
            else if(comp.trailDir == TrailDir.Down) {
                data[offset].u = 1;
                data[offset].v = progress;
            }
            else {
                data[offset].u = 1 - progress;
                data[offset].v = 1;
            }
            data[offset].color._val = c;

            offset += 1;
 
            data[offset].x = point.x - _normal.x * stroke;
            data[offset].y = point.y - _normal.y * stroke;
            if(comp.trailDir == TrailDir.Up) {
                data[offset].u = 0;
                data[offset].v = 1 - progress;
            }
            else if(comp.trailDir == TrailDir.Right) {
                data[offset].u = progress;
                data[offset].v = 0;
            }  
            else if(comp.trailDir == TrailDir.Down) {
                data[offset].u = 0;
                data[offset].v = progress;
            }
            else {
                data[offset].u = 1 - progress;
                data[offset].v = 0;
            }
            data[offset].color._val = c;

            verticesCount += 2;
        }

        indicesCount = verticesCount <= 2 ? 0 : (verticesCount - 2) * 3;

        renderData.vertexCount = verticesCount;
        renderData.indicesCount = indicesCount;
    },

    updateRenderData (comp: MotionStreak) {
    },

    fillBuffers (comp: MotionStreak, renderer: UI) {
        const renderData = comp.renderData!;
        const dataList = renderData.data;

        let buffer = renderer.acquireBufferBatch()!;
        let vertexOffset = buffer.byteOffset >> 2;
        let indicesOffset = buffer.indicesOffset;
        let vertexId = buffer.vertexOffset;
        const isRecreate = buffer.request(renderData.vertexCount, renderData.indicesCount);
        if (!isRecreate) {
            buffer = renderer.currBufferBatch!;
            indicesOffset = 0;
            vertexId = 0;
        }

        // buffer data may be reallocated, need get reference after request.
        const vBuf = buffer.vData!;
        const iBuf = buffer.iData!;
        const vertexCount = renderData.vertexCount;
        const indicesCount = renderData.indicesCount;

        for (let i = 0; i < vertexCount; i++) {
            const vert = dataList[i];
            vBuf[vertexOffset++] = vert.x;
            vBuf[vertexOffset++] = vert.y;
            vBuf[vertexOffset++] = vert.z;
            vBuf[vertexOffset++] = vert.u;
            vBuf[vertexOffset++] = vert.v;
            Color.toArray(vBuf, vert.color, vertexOffset);
            vertexOffset += 4;
        }

        // fill index data
        for (let i = 0, l = indicesCount; i < l; i += 2) {
            const start = vertexId + i;
            iBuf[indicesOffset++] = start;
            iBuf[indicesOffset++] = start + 2;
            iBuf[indicesOffset++] = start + 1;
            iBuf[indicesOffset++] = start + 1;
            iBuf[indicesOffset++] = start + 2;
            iBuf[indicesOffset++] = start + 3;
        }
    },
}

enum TrailDir {
    Up = 0,
    Right,
    Down,
    Left
}

@ccclass('TrailRenderer')
export class TrailRenderer extends MotionStreak {
    @property({
        type: Enum(TrailDir),
        tooltip: '头尾头的朝上则选Up，其他方向类推。'
    })
    trailDir: TrailDir = TrailDir.Up;

    halfStroke: number = 0;

    onEnable() {
        super.onEnable();
        this.halfStroke = this.stroke / 2;
    }

    protected _flushAssembler () {
        const assembler = MotionStreakAssembler;

        if (this._assembler !== assembler) {
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this.material;
            }
        }
    }
}