
export enum UI_EVENT {
    NONE = 1000,
    START_GAME,
    PLAYER_MOVE,
    PLAYER_STOP_MOVE,
    SHOOT_NEAR,
    SHOOT_LESS_BLOOD,
    SHOOT_CHANGE_TARGET,
    SHOOT_STOP,
    UPDATE_HP,
    UPDATE_SCORE,
    SWITCH_BULLET
}

export enum AI_STATE {
    NONE,
    IDLE,
    MOVE_TO,
    FOLLOW,
    ATTACK,
    ATTACK_ING,
    ATTACK_OVER,
    WAIT,
    TAKE_HIT,
    TAKE_HITING,
    TAKE_HIT_OVER,
}

export enum PhysicsGroup {
    DEFAULT = 1 << 0,
    Wall = 1 << 1,
    Bullet = 1 << 2,
    Player = 1 << 3,
    Collectable = 1 << 4,
    Enemy = 1 << 5,
    Player_Collectable = 1 << 6,
    Bullet_Enemy = 1 << 7,
    Rock = 1 << 8
}
