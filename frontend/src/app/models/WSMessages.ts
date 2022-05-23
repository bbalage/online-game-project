import { AnimationStatus } from "./AnimationStatus"

export enum WSMessageType {
    RegisterUser = 1,
    ChatMessage,
    GameStatus,
}

export interface WSMessageSend {
    header: {
        type: WSMessageType,
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

export interface WSMessageGameSend {
    header: {
        jwtToken: string | null,
        timestamp: Date
    },
    data: {
        x: number,
        y: number,
        shot?: {
            posX: number,
            posY: number,
            vX: number,
            vY: number
        }
    }
}