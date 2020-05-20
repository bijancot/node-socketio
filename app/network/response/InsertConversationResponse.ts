import BaseResponse from "../../parents/BaseResponse";


/**
 @var received_by_server_at => Time when server received the message
 */
export default class InsertConversationResponse extends BaseResponse {
    sender: InsertConversationSender = new InsertConversationSender();
    received_by_server_at: string = "";
}

class InsertConversationSender {
    id: string = "";
    fullname: string = "";
    email: string = "";
    image: string = "";
    username: string = "";
}