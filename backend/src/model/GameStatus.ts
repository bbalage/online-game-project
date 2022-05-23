export const TankDescriptor = {
    width: 15,
    height: 15
}

export const MapDescriptor = {
    width: 200,
    height: 100
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

export interface AnimationStatus {
    tanks: TankStatus[];
}

export interface GameStatus {
    tanks: Map<string, TankStatus>
}