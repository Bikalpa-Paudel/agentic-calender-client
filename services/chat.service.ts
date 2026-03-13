import { apiFetch } from "./api";
import type {
  ChatConversation,
  ChatConversationDetail,
  ChatMessage,
} from "@/types/calendar";

export const chatService = {
  async getConversations(): Promise<ChatConversation[]> {
    return apiFetch("/chat/conversations");
  },

  async getConversation(id: number): Promise<ChatConversationDetail> {
    return apiFetch(`/chat/conversations/${id}`);
  },

  async sendMessage(
    message: string,
    conversationId?: number
  ): Promise<ChatMessage> {
    return apiFetch("/chat/message", {
      method: "POST",
      body: JSON.stringify({
        message,
        conversation_id: conversationId ?? null,
      }),
    });
  },

  async deleteConversation(id: number): Promise<void> {
    await apiFetch(`/chat/conversations/${id}`, { method: "DELETE" });
  },
};
