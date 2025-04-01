import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore=create((set)=>({
    messages:[],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
      },
    
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = useChatStore.getState();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
    },
    subscribeToMessages:()=>{
      const state=useChatStore.getState();
      const {selectedUser}=state;
      if(!selectedUser) return console.warn("⚠️ No selected user");;
      const socket=useAuthStore.getState().socket;
      if (!socket) return console.error("🚨 Socket is not available!");

      //to do optimize this one later
      socket.on("newMessage",(newMessage) => {
        // const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        // if (!isMessageSentFromSelectedUser) return;
        if(newMessage.senderId !==selectedUser._id) return;
        set((prevState) => ({
            messages:[...prevState.messages,newMessage],
        }));
        });
      },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
export default useChatStore;