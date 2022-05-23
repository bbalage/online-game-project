
export interface TankStatus {
    x: number;
    y: number;
    dir: number;
    hp: number;
}

export interface AnimationStatus {
    tanks: TankStatus[];
}