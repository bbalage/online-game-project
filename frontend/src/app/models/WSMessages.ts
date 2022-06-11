import { AnimationStatus, TankDirection } from "./AnimationStatus"

export enum WSSendMessageType {
    RegisterTank = 1,
    MoveTank,
    ShootCannon,
    ChatMessage
}

export enum WSReceivedMessageType {
    GameStatus = 1,
    ChatMessage,
    Logout
}

export interface WSMessageSend {
    header: {
        type: WSSendMessageType,
        jwtToken: string | null,
        timestamp: Date
    }
    data?: any
}

export interface WSMessageChatReceived {
    header: {
        timestamp: Date
    }
    data: {
        username: string,
        text: string
    }
}

export interface WSMessageChatSend {
    header: {
        jwtToken: string | null,
        timestamp: Date
    }
    data: {
        text: string
    }
}

export interface WSMessageGameReceived {
    header: {
        timestamp: Date
    }
    data: {
        status: AnimationStatus,
        defeated: boolean
    }
}

export interface WSMessageMoveTank {
    header: {
        jwtToken: string | null,
        timestamp: Date
    },
    data: {
        x: number,
        y: number,
        dir: TankDirection,
    }
}

export interface WSMessageShootCannon {
    header: {
        jwtToken: string | null,
        timestamp: Date
    }
}

export interface WSMessageLogoutReceived {
    header: {
        jwtToken: string,
        timestamp: Date
    }
}