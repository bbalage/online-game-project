import { AnimationStatus, TankDirection } from "./GameStatus"

export enum WSRecievedMessageType {
    RegisterTank = 1,
    MoveTank,
    ShootCannon,
    ChatMessage
}

export enum WSSendMessageType {
    GameStatus = 1,
    ChatMessage,
    Logout
}

export interface WSMessageReceived {
    header: {
        type: WSRecievedMessageType,
        jwtToken: string,
        timestamp: Date
    }
    data?: any
}

export interface WSMessageSend {
    header: {
        type: WSSendMessageType,
        timestamp: Date
    }
    data?: any
}

export interface WSMessageChatReceived {
    header: {
        jwtToken: string,
        timestamp: Date
    }
    data: {
        text: string
    }
}

export interface WSMessageChatSend {
    header: {
        timestamp: Date
    }
    data: {
        username: string,
        text: string
    }
}

export interface WSMessageRegisterTankReceived {
    header: {
        jwtToken: string,
        timestamp: Date
    }
}

export interface WSMessageMoveTankReceived {
    header: {
        jwtToken: string,
        timestamp: Date
    },
    data: {
        x: number,
        y: number,
        dir: TankDirection,
    }
}

export interface WSMessageShootCannonReceived {
    header: {
        jwtToken: string,
        timestamp: Date
    }
}

export interface WSMessageGameSend {
    header: {
        timestamp: Date
    }
    data: {
        status: AnimationStatus,
        defeated: boolean
    }
}