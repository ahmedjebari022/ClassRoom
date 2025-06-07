import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../services/authService";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);

          if (response.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          } else {
            set({ error: response.message, isLoading: false });
            return { success: false, message: response.message };
          }
        } catch (error) {
          set({ error: "Network error", isLoading: false });
          return { success: false, message: "Network error" };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(userData);

          if (response.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          } else {
            set({ error: response.message, isLoading: false });
            return { success: false, message: response.message };
          }
        } catch (error) {
          set({ error: "Network error", isLoading: false });
          return { success: false, message: "Network error" };
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        }

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      updateUser: (userData) => {
        console.log("🔄 AuthStore: Current user:", get().user);
        console.log("🔄 AuthStore: Updating with:", userData);

        set((state) => {
          const updatedUser = { ...state.user, ...userData };
          console.log("📝 AuthStore: Final updated user:", updatedUser);

          return {
            user: updatedUser,
          };
        });

        setTimeout(() => {
          console.log("✅ AuthStore: User after update:", get().user);
        }, 0);
      },

      checkAuth: async () => {
        set({ isLoading: true });

        try {
          const response = await authService.getMe();

          if (response.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
