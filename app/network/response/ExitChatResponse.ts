import BaseResponse from "../../parents/BaseResponse";

/**
 * @var last_online => User Last Online
 */
export default class ExitChatResponse extends BaseResponse {
    last_online: string = "";
}