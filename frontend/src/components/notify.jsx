import { create } from "zustand";


const getStoredNotifications = () => {
  const stored = localStorage.getItem("notifications");
  return stored ? JSON.parse(stored).slice(0, 5) : [];
};

export const useNotificationStore = create((set) => ({
  notifications: getStoredNotifications(),
  hasNew: false,

  addNotification: (notif) =>
    set((state) => {
      const updated = [notif, ...state.notifications].slice(0, 5);
      localStorage.setItem("notifications", JSON.stringify(updated));
      return { notifications: updated, hasNew: true };
    }),


  clearNotifications: () => {
    localStorage.setItem("notifications", JSON.stringify([]));
    set({ notifications: [], hasNew: false });
  },

  markAsSeen: () => set({ hasNew: false }),
}));


