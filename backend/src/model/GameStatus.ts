export const BULLET_SPEED = 1;
export const BULLET_DAMAGE = 50;

export const TankDescriptor = {
    side: 15
}

export const BulletDescriptor = {
    radius: 2,
    side: 3,
    hitRadius: 1
}

export const MapDescriptor = {
    width: 200,
    height: 100
}

export enum TankDirection {
    UP = 1, RIGHT, DOWN, LEFT
}

export interface TankStatus {
    x: number,
    y: number,
    dir: TankDirection,
    hp: number
}

export interface BulletStatus {
    x: number,
    y: number
}

export class Bullet {
    x!: number;
    y!: number;
    vx!: number;
    vy!: number;
    disabled: boolean = false;

    constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    disable() {
        this.disabled = true;
    }
}

export interface AnimationStatus {
    tanks: TankStatus[],
    bullets: BulletStatus[]
}

export interface GameStatus {
    tanks: Map<number, TankStatus>,
    bullets: Bullet[]
}

export interface DeleteTankCommand {
    token: string
}