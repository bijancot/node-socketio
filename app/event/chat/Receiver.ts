import { Socket, Server } from 'socket.io';
import ChatEventEmitter from './Emitter';
import ChatEventBroadcaster from './Broadcaster';
import { ConnectedUserCache, InactiveUserCache } from '../../global/Global';
import { classToPlain } from 'class-transformer';
import BaseEventHandler from '../../parents/BaseEventHandler';

/**
 * Class that handle event retrieved from App
 * in /chat namespace
 */
export default class ChatEventReceiver extends BaseEventHandler{
    emitter: ChatEventEmitter;
    broadcaster: ChatEventBroadcaster;
    
    constructor(socket: Socket, server: Server){
        super(socket, server);
        
        this.emitter = new ChatEventEmitter(socket, server);
        this.broadcaster = new ChatEventBroadcaster(socket, server);
    }

    /**
     * Update online status
     * 
     * Called when user connected
     * 
     * Joining room with same school ID
     * 
     * Storing socket id to Connected Cache
     * 
     * Remove socket from Inactive Cache
     */
    onConnect(): void {
        if(this.isAnonymous()) return;

        let params = {
            'id_user' : this.idUser,
            'socket_id' : this.socket.id,
        };

        this.repository.online(params, (_) => {
            this.broadcaster.broadcastOnline();
            ConnectedUserCache.set(this.idUser, this.socket.id);
        });
    }

    /**
     * Similar as @see onConnect()
     * but with different cache storing, and not joining room
     * in @see onConnect() we store user to Connected Cache
     * but in @see onForeground() we remove user from Inactive Cache
     */
    onForeground(): void {
        if(this.isAnonymous()) return;

        let params = {
            'id_user' : this.idUser,
            'socket_id' : this.socket.id,
        };

        this.repository.online(params, (_) => {
            this.broadcaster.broadcastOnline();
            InactiveUserCache.del(this.idUser);
        });
    }

    /**
     * Similar as @see onDisconnect()
     * but with different cache storing, and not leaving room
     * in @see onDisconnect() we remove user from Connected Cache
     * but in @see onBackground() we store user to Inactive Cache
     */
    onBackground(): void {
        if(this.isAnonymous()) return;
        
        let params = {
            'id_user' : this.idUser,
            'socket_id' : this.socket.id,
        };
        this.repository.offline(params, (res) => {
            this.broadcaster.broadcastOffline(res);
            InactiveUserCache.set(this.idUser, this.socket.id);
        });
    }

    /**
     * Notify to interlocutor that user is typing
     * Then app change status to "Typing..."
     * @param data, which contains
     * @var target_id => Interlocutor id,
     */
    onTyping(data: any): void {
        if(this.isAnonymous()) return;

        this.emitter.onUserSendTypingNotif(data);
    }

    /**
     * User sends chat
     * @param data chat data, which contains
     * @var conversation_id => Unique ID generated from App
     * @var conversation => Message
     * @var send_at => Time when user trying to send the message, cause maybe there will be 
     * a delay either no internet connection, so sender cannot send that message at that time,
     * app should check periodically and send message automatically when internet connection established
     * @var target_id => Receiver Id
     * 
     * @param callback callback that chat has retrieved by server, so the UI
     * change chat status to "SENT" or one checklist like in WhatsApp, contains parameter
     * @var conversation_id => Unique ID generated from App
     * @var received_by_server_at => Datetime yyyy-MM-dd HH:mm:ss
     */
    onSendChat(data: any, callback: (data: any) => void): void {
        if(this.isAnonymous()) return;
        
        let params = {
            'conversation_id' : data.conversation_id,
            'sender_id' : this.idUser,
            'receiver_id' : data.target_id,
            'conversation' : data.conversation as string,
            'send_at' : data.send_at
        };

        this.repository.insertConversation(params, (r) => {
            let emitData = {
                'conversation_id' : data.conversation_id,
                'sender_id' : this.idUser,
                'receiver_id' : data.target_id,
                'conversation' : (data.conversation as string).trim(),
                'received_by_server_at' : r.received_by_server_at,
                'sender' : {
                    'id' : r.sender.id,
                    'fullname' : r.sender.fullname,
                    'email' : r.sender.email,
                    'image' : r.sender.image,
                    'username' : r.sender.username
                }
            };
            callback({
                'conversation_id' : data.conversation_id,
                'received_by_server_at' : r.received_by_server_at
            });

            this.emitter.onServerSendChat(emitData);
        });
    }

    /**
     * User receive chat, so server can send notification to sender that 
     * this user was receive the message and app change status to "RECEIVED" or 
     * double checklist like in WhatsApp
     * @param data chat data, which contains
     * @var conversation_id => Id of conversation / message
     * @var sender_id => Id of sender the conversation message
     */
    onReceiveChat(data: any): void {
        if(this.isAnonymous()) return;

        let params = { 
            'conversation_id' : data.conversation_id
        }

        this.repository.receiveMessage(params, (_) => {
            //this.emitter.onServerNotifyMessageReceived(data);
        });
    }

    /**
     * User read all chat sent from sender, then
     * server can send notification to sender that this user was read the message
     * and app change status to "READ" or double checklist blue like in WhatsApp
     * 
     * @param data chat data, which contains
     * @var sender_id => Id of message sender
     */
    onReadChat(data: any): void {
        if(this.isAnonymous()) return;

        let readAt = this.millisecondSinceEpoch();
        let params = {
            'sender_id' : data.sender_id,
            'receiver_id' : this.idUser,
            'read_at' : readAt,
        };

        this.repository.readAllMessage(params, (r) => {
            //this.emitter.onServerNotifyMessageRead(params);
        });
    }

    /**
     * Get undelivered message to this user, this may happens when sender sends message
     * while this user offline
     * 
     * @param callback, called with parameter
     *  @param data => List of undelivered message
     */
    onAskingForDelayedMessage(callback: (data: any) => void): void {
        if(this.isAnonymous()) return;

        this.repository.askForDelayedMessage(this.idUser, (r) => {
            /**r.data.forEach((it) => {
                it.conversation = Decrypt(it.conversation);

                let emitData = {
                    'sender_url_id' : it.sender_url_id,
                    'conversation_id' : it.id_conversation,
                    'received_by_target_at' : it.received_by_target_at
                };
                this.emitter.onServerNotifyDelayedMessageReceived(emitData);
            });

            if(r.data.length > 0){
                callback(classToPlain(r));
            }*/
        });
    }

    /**
     * Get latest message status which sent from this user,
     * cause maybe the receiver has received / read messages when this user
     * goes offline
     * 
     * @param data => List of message that want to see latest status of the message, which contains
     * @var data => Object of list, which contains
     *  @var conversation_id => Id of message
     * 
     * @param callback, called with parameter
     *  @param data => List of message with latest status, which contains
     *  @var conversation_id => Id of message
     *  @var status => Status of message (SENT / READ), then the UI will update with the latest status
     *  @var sent_at => Time when receiver get the message, value as Milliseconds since epoch
     *  @var read_at => Time when receiver read the message, value as Milliseconds since epoch
     */
    onAskingForLatestReportMessage(data: any, callback: (data: any) => void): void {
        if(this.isAnonymous()) return;

        this.repository.askForLatestStatusMessage(data, (r) => {
            callback(r);
        });
    }
    
    /**
     * Update offline status
     * 
     * Called when user log out 
     * or app closed
     * 
     * Leaving school room
     * 
     * Remove from Connected Cache 
     * 
     * Store to Inactive Cache
     * 
     */
    onDisconnect(): void{
        if(this.isAnonymous()) return;
        
        let params = {
            'id_user' : this.idUser,
            'socket_id' : this.socket.id,
        };
        this.repository.offline(params, (res) => {
            this.broadcaster.broadcastOffline(res);
            ConnectedUserCache.del(this.idUser);
            InactiveUserCache.del(this.idUser);
        });
    }
}