export enum TankDirection {
    UP, RIGHT, DOWN, LEFT
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