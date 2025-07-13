<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import router from "../router";
import menu from "../static-data/menu";
import NavBar from "./NavBar.vue";

const route = useRoute(); // Get the current route
const isSidebarOpen = ref(false); // Sidebar hidden by default on small screens
const expandedItems = ref({}); // Track expanded state of menu items

const handleButtonClick = (pageName, isSubItem = false) => {
  if (pageName === "login") {
    router.replace({ name: `${pageName}` });
  } else {
    router.push({ name: `${pageName}` });
  }
  // Close sidebar on mobile only for top-level items
  if (!isSubItem && window.innerWidth < 640) {
    isSidebarOpen.value = false;
  }
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleSubMenu = (itemTitle) => {
  expandedItems.value[itemTitle] = !expandedItems.value[itemTitle];
};

// Initialize expanded state based on current route
const initializeExpandedState = () => {
  menu.data.forEach((item) => {
    if (item.subItems) {
      const isSubItemActive = item.subItems.some(
        (subItem) => subItem.page_name === route.name
      );
      if (isSubItemActive || item.page_name === route.name) {
        expandedItems.value[item.title] = true;
      }
    }
  });
};

// Ensure sidebar is open on large screens and initialize expanded state
onMounted(() => {
  if (window.innerWidth >= 640) {
    isSidebarOpen.value = true;
  }
  initializeExpandedState();
});

// Watch for route changes to update expanded state
watch(
  () => route.name,
  () => {
    initializeExpandedState();
  }
);
</script>

<template>
  <div>
    <!-- Hamburger Menu for Small Screens -->
    <div class="sm:hidden">
      <button
        @click="toggleSidebar"
        class="p-4 focus:outline-none"
        aria-label="Toggle sidebar"
      >
        <svg
          class="w-6 h-6 text-[#986b41]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Sidebar -->
    <aside
      id="logo-sidebar"
      class="fixed top-0 left-0 z-40 w-64 h-screen pt-4 transition-transform bg-white border-r border-gray-200"
      :class="{
        '-translate-x-full': !isSidebarOpen,
        'translate-x-0': isSidebarOpen,
      }"
      style="background-color: #986b41"
      aria-label="Sidebar"
    >
      <div
        class="h-full px-3 pb-4 overflow-y-auto"
        style="background-color: #986b41"
      >
        <!-- Close Icon -->
        <div class="sm:hidden flex justify-end">
          <button
            @click="toggleSidebar"
            class="focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="'M6 18L18 6M6 6l12 12'"
              />
            </svg>
          </button>
        </div>

        <div class="flex justify-between h-14">
          <img
            class="w-14 h-14 rounded-full"
            src="https://i.pinimg.com/736x/11/74/b8/1174b87fd25a959131875fdf17ee0071.jpg"
            alt="user photo"
          />
          <div class="flex items-center">
            <p class="font-bold text-white">WOOD POS SYSTEM</p>
          </div>
        </div>
        <ul class="space-y-2 font-medium mt-6">
          <li v-for="item in menu['data']" :key="item.title">
            <div v-if="!item.subItems">
              <button
                @click="handleButtonClick(item.page_name)"
                :class="[
                  'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#B68E65] group w-full text-left',
                  { 'bg-[#B68E65]': route.name === item.page_name },
                ]"
              >
                <svg
                  class="shrink-0 w-5 h-5 text-gray-300 transition duration-75 dark:group-hover:text-white"
                  :class="{ 'text-white': route.name === item.page_name }"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  :viewBox="item.viewBox"
                >
                  <path v-for="path in item.iconPaths" :key="path" :d="path" />
                </svg>
                <p
                  class="flex-1 ms-3 whitespace-nowrap text-white"
                  :class="{ 'font-bold': route.name === item.page_name }"
                >
                  {{ item.title }}
                </p>
              </button>
            </div>
            <div v-else class="relative">
              <button
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#B68E65] group w-full text-left"
                :class="{ 'bg-[#B68E65]': route.name === item.page_name }"
                @click="toggleSubMenu(item.title)"
              >
                <svg
                  class="shrink-0 w-5 h-5 text-gray-300 transition duration-75 dark:group-hover:text-white"
                  :class="{ 'text-white': route.name === item.page_name }"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  :viewBox="item.viewBox"
                >
                  <path v-for="path in item.iconPaths" :key="path" :d="path" />
                </svg>
                <p
                  class="flex-1 ms-3 whitespace-nowrap text-white"
                  :class="{ 'font-bold': route.name === item.page_name }"
                >
                  {{ item.title }}
                </p>
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="
                      expandedItems[item.title]
                        ? 'M5 15l7-7 7 7'
                        : 'M19 9l-7 7-7-7'
                    "
                  />
                </svg>
              </button>
              <ul
                v-if="expandedItems[item.title]"
                class="pl-6 space-y-2 transition-all duration-300"
              >
                <li v-for="subItem in item.subItems" :key="subItem.title">
                  <button
                    @click.stop="handleButtonClick(subItem.page_name, true)"
                    :class="[
                      'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#B68E65] group w-full text-left',
                      { 'bg-[#B68E65]': route.name === subItem.page_name },
                    ]"
                  >
                    <svg
                      class="shrink-0 w-5 h-5 text-gray-300 transition duration-75 dark:group-hover:text-white"
                      :class="{
                        'text-white': route.name === subItem.page_name,
                      }"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      :viewBox="subItem.viewBox"
                    >
                      <path
                        v-for="path in subItem.iconPaths"
                        :key="path"
                        :d="path"
                      />
                    </svg>
                    <p
                      class="flex-1 ms-3 whitespace-nowrap text-white"
                      :class="{ 'font-bold': route.name === subItem.page_name }"
                    >
                      {{ subItem.title }}
                    </p>
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style scoped>
#logo-sidebar {
  transition: transform 0.3s ease-in-out;
}
</style>
