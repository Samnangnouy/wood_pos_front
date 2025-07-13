<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isDropdownOpen = ref(false);

const getTitle = () => {
  switch (route.name) {
    case "order":
      return "Order";
    case "app.dashboard":
      return "Dashboard";
    case "productlist":
      return "Product List";
    default:
      return "Dashboard";
  }
};

// Toggle dropdown visibility
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Navigate to a route
const navigateTo = (routeName) => {
  route.push({ name: routeName });
  isDropdownOpen.value = false; // Close dropdown after navigation
};
</script>

<template>
  <nav class="top-0 left-0 w-full bg-white shadow-md z-10">
    <div class="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Brand/Logo -->
        <div class="flex-shrink-0 flex items-center">
          <span class="text-xl font-bold text-gray-800">{{ getTitle() }}</span>
        </div>
        <!-- Profile Section -->
        <div class="flex-shrink-0 flex items-center">
          <div class="flex items-center space-x-3" @click="toggleDropdown">
            <!-- <span class="text-gray-700 font-medium">User Profile</span> -->
            <img
              class="w-10 h-10 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="user photo"
            />
          </div>
        </div>
      </div>

      <!-- Dropdown Menu -->
      <div
        v-show="isDropdownOpen"
        class="z-50 my-4 text-base list-none bg-white divide-y divide-[#EAEAEA] shadow-lg absolute top-12 right-4 px-4"
      >
        <div class="px-4 py-3" role="none">
          <p class="text-md text-black font-medium" role="none">Neil Sims</p>
          <p class="text-sm text-[#986b41] truncate" role="none">Admin</p>
        </div>
        <ul class="py-1" role="none">
          <li>
            <button
              @click="navigateTo('dashboard')"
              class="block w-full text-left px-4 py-2 text-sm text-black hover:bg-[#986b41] dark:hover:text-white"
              role="menuitem"
            >
              Profile
            </button>
          </li>
          <li>
            <button
              @click="navigateTo('settings')"
              class="block w-full text-left px-4 py-2 text-sm text-black hover:bg-[#986b41] dark:hover:text-white"
              role="menuitem"
            >
              Notification
            </button>
          </li>

          <li>
            <button
              @click="navigateTo('login')"
              class="block w-full text-left px-4 py-2 text-sm text-black hover:bg-[#986b41] dark:hover:text-white"
              role="menuitem"
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
