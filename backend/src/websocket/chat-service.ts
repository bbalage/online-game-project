import { MessageType, WSAnswers } from './websocket-service';

export class ChatService {


    handleMessage(): WSAnswers {
        return { recipients: [], message: { header: { type: MessageType.ChatMessage, timestamp: new Date() } } }
    }
}