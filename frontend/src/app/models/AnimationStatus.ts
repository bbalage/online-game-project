export enum TankDirection {
    UP = 1, RIGHT, DOWN, LEFT
}

export interface TankStatus {
    x: number;
    y: number;
    dir: TankDirection;
    hp: number;
}

export interface AnimationStatus {
    tanks: TankStatus[];
}