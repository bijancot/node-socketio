import { ChatAction } from "..";
import BaseEventHandler from "../../parents/BaseEventHandler";
import ExitChatResponse from "../../network/response/ExitChatResponse";

export default class ChatEventBroadcaster extends BaseEventHandler{
    /**
     * Broadcast to all user that this person is online, 
     * so they can update last seen status
     * 
     * @emits event @see ChatAction.SOMEONE_ONLINE as Event name
     * @emits data to whole user in same school, which contains
     * @var message => Optional
     * @var id_user => This user id
     */
    broadcastOnline(): void {
        this.socket.broadcast.emit(ChatAction.SOMEONE_ONLINE, {
            'message' : 'Hey guys, i\'m online',
            'id_user' : this.idUser
        });
    }

    /**
     * Broadcast to all user that this person is offline, 
     * so they can update last seen status
     * 
     * @param response => passed data when success request to API
     * @see ChatEventReceiver.onDisconnect()
     * 
     * @emits event @see ChatAction.SOMEONE_OFFLINE as Event name
     * @emits data to whole user in same school, which contains 
     * @var message => Optional
     * @var last_online => Last Online of this user
     * @var id_user => This user id
     * 
     */
    broadcastOffline(response: ExitChatResponse) : void {
        this.socket.broadcast.emit(ChatAction.SOMEONE_OFFLINE, {
            'message' : 'Hey guys, i\'ll be back later',
            'last_logout' : response.last_online,
            'id_user' : this.idUser
        });
    }
}