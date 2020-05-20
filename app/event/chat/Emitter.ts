import { ChatAction } from "..";
import BaseEventHandler from "../../parents/BaseEventHandler";
import { ConnectedUserCache } from "../../global/Global";

export default class ChatEventEmitter extends BaseEventHandler{
     /**
     * This user send typing notification to interlocutor
     * @param data, data passed from @see ChatEventReceiver_onTyping() which contains
     * @var target_id => Interlocutor id,
     * 
     * @emits event @see ChatAction.SOMEONE_TYPING as Event name
     * @emits data to target which contains 
     * @var from_id => Current User Id
     */
    onUserSendTypingNotif(data: any){
        if(!ConnectedUserCache.has(data.target_id)) return;

        var targetSocketId = ConnectedUserCache.get(data.target_id) as string;

        this.socket.to(targetSocketId).emit(ChatAction.SOMEONE_TYPING, {
            'from_id' : this.idUser,
        });
    }

    /**
     * Server sends chat to target
     * @param data, data retrieved from API after successful insertion, which contains
     * @var conversation_id => ID of conversation
     * @var sender_id => Sender ID
     * @var receiver_id => Receiver ID
     * @var conversation => The message
     * @var received_by_server_at => Time when message retrieved by server
     * @var sender.display_id_url => Url Id of sender
     * @var sender.display_name => Name of sender
     * @var sender.display_foto => Photo of sender
     * 
     * @emits event @see ChatAction.SOMEONE_SEND_MESSAGE as Event name
     * @emits data => @param data
     */
    onServerSendChat(data: any): void{
        if(!ConnectedUserCache.has(data.receiver_id)) return;
        
        var receiverSocket = ConnectedUserCache.get(data.receiver_id) as string;

        this.server.to(receiverSocket).emit(ChatAction.SOMEONE_SEND_MESSAGE, data);
    }
}