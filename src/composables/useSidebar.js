// src/composables/useSidebar.js
import { ref } from "vue";

export const useSidebar = () => {
  const isSidebarOpen = ref(false);

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
    console.log("Sidebar toggled:", isSidebarOpen.value); // Debug log
  };

  const closeSidebar = () => {
    if (isSidebarOpen.value) {
      isSidebarOpen.value = false;
      console.log("Sidebar closed"); // Debug log
    }
  };

  return { isSidebarOpen, toggleSidebar, closeSidebar };
};
