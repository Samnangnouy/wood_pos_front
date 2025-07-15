<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import store from "../store";
import router from "../router";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

const route = useRoute();
const isDropdownOpen = ref(false);
const isConfirmDialog = ref(false);
const currentUser = computed(() => store.state.user.data);

onMounted(() => {
  store.dispatch("getUser");
});

function logout() {
  store.dispatch("logout").then(() => {
    router.push({ name: "login" });
  });
}

function onConfirm() {
  isDropdownOpen.value = false;
  isConfirmDialog.value = true;
}

function onCloseDialog() {
  isConfirmDialog.value = false;
}

const getTitle = () => {
  switch (route.name) {
    case "order":
      return "Order";
    case "app.dashboard":
      return "Dashboard";
    case "productlist":
      return "Product List";
    case "categorieslist":
      return "Category List";
    case "user":
      return "Users";
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
              :src="currentUser.image"
              alt="user photo"
            />
          </div>
        </div>
      </div>

      <!-- Dropdown Menu -->
      <div
        v-show="isDropdownOpen"
        class="z-50 my-4 text-base list-none bg-white divide-y divide-[#EAEAEA] shadow-lg absolute top-12 right-4 px-4 rounded-b-lg"
      >
        <div class="px-4 py-3" role="none">
          <p class="text-md text-black font-medium" role="none">
            {{ currentUser.full_name }}
          </p>
          <p class="text-sm text-[#986b41] truncate" role="none">
            {{ currentUser.role }}
          </p>
        </div>
        <ul class="py-1" role="none">
          <li>
            <button
              @click="navigateTo('dashboard')"
              class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#EAEAEA] rounded-lg"
              role="menuitem"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#374151"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <p class="ml-2">Profile</p>
            </button>
          </li>
          <li>
            <button
              @click="navigateTo('settings')"
              class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#EAEAEA] rounded-lg"
              role="menuitem"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#374151"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                />
              </svg>

              <p class="ml-2">Notification</p>
            </button>
          </li>

          <li>
            <button
              @click="onConfirm"
              class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#EAEAEA] rounded-lg"
              role="menuitem"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#DC2626"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>

              <p class="ml-2">Sign out</p>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <TransitionRoot appear :show="isConfirmDialog" as="template">
      <Dialog as="div" @close="onCloseDialog" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <div class="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#DC2626"
                    class="size-5.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>

                  <div class="ml-2">
                    <DialogTitle
                      as="h3"
                      class="text-lg font-medium leading-6 text-gray-900"
                    >
                      Sign Out !
                    </DialogTitle>

                    <div class="mt-1">
                      <p class="text-md text-gray-500">
                        Are you sure yon want to sign out?
                      </p>
                    </div>
                  </div>
                </div>

                <div class="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md bg-gray-300 hover:bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600"
                    @click="onCloseDialog"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500"
                    @click="logout"
                  >
                    Sign Out
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </nav>
</template>
