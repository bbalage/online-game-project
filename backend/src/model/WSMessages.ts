import { AnimationStatus } from "./GameStatus"

export enum MessageType {
    RegisterUser = 1,
    ChatMessage,
    GameStatus,
}

export interface WSMessageReceived {
    header: {
        type: MessageType,
        jwtToken: string,
        timestamp: Date
    }
    data?: any
}

export interface WSMessageSend {
    header: {
        type: MessageType,
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

export interface WSMessageGameReceived {
    header: {
        timestamp: Date
    },
    data?: {
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

export interface WSMessageGameSend {
    header: {
        timestamp: Date
    }
    data: {
        status: AnimationStatus,
        defeated: boolean
    }
}