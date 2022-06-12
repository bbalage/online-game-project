export const MapDescriptor = {
    width: 250,
    height: 130
}

export enum TankDirection {
    UP = 1, RIGHT, DOWN, LEFT
}

export interface TankStatus {
    x: number;
    y: number;
    dir: TankDirection;
    hp: number;
}

export interface BulletStatus {
    x: number,
    y: number
}

export interface AnimationStatus {
    tanks: TankStatus[],
    bullets: BulletStatus[]
}