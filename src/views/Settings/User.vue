<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavBar from "../../components/NavBar.vue";
import SideBar from "../../components/SideBar.vue";

// Reactive state to manage dropdown visibility
const isMenuOpen = ref(false);
const activeMenuId = ref(null);
const tableContainer = ref(null); // Ref for the table container

// Sample orders data
const orders = [
  { id: "User-001", user_name: "User Name 001", role: "Admin" },
  { id: "User-002", user_name: "User Name 002", role: "Staff" },
];

// Toggle dropdown menu for a specific row
const toggleMenu = (orderId) => {
  console.log(
    "Toggling menu for order:",
    orderId,
    "Current active:",
    activeMenuId.value
  );
  if (activeMenuId.value === orderId) {
    isMenuOpen.value = !isMenuOpen.value; // Toggle if same row clicked
  } else {
    isMenuOpen.value = true; // Open for new row
    activeMenuId.value = orderId;

    // If the last item is clicked, scroll to the bottom of the table container
    if (orderId === orders[orders.length - 1].id && tableContainer.value) {
      tableContainer.value.scrollTop = tableContainer.value.scrollHeight;
    }
  }
};

// Handle Edit action
const handleEdit = (orderId) => {
  console.log(`Edit order: ${orderId}`);
  // Add your edit logic here
  closeMenu();
};

// Handle Delete action
const handleDelete = (orderId) => {
  console.log(`Delete order: ${orderId}`);
  // Add your delete logic here
  closeMenu();
};

// Close menu
const closeMenu = () => {
  isMenuOpen.value = false;
  activeMenuId.value = null;
};

// Close menu when clicking outside
const handleOutsideClick = (event) => {
  if (!event.target.closest(".menu-dropdown")) {
    closeMenu();
  }
};

// Add event listener on mount, remove on unmount
onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});
onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});
</script>

<template>
  <!-- Import the Sidebar -->
  <SideBar />

  <div class="sm:ml-64">
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Item List -->
    <div class="p-4 rounded-lg">
      <div
        ref="tableContainer"
        class="relative overflow-x-auto overflow-y-visible shadow-md rounded-lg"
      >
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-black uppercase bg-white border-b border-[#EAEAEA]"
          >
            <tr>
              <th scope="col" class="px-6 py-3">User ID</th>
              <th scope="col" class="px-6 py-3">User Name</th>
              <th scope="col" class="px-6 py-3">User Role</th>

              <th scope="col" class="px-6 py-3 text-right">
                <p>Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
              class="bg-white border-b border-gray-200 hover:bg-[#EAEAEA]"
            >
              <th
                scope="row"
                class="px-6 py-4 font-light text-black whitespace-nowrap"
              >
                {{ order.id }}
              </th>
              <td class="px-6 py-4 text-gray-500">{{ order.user_name }}</td>
              <td class="px-6 py-4 text-gray-500">{{ order.role }}</td>

              <td class="px-6 py-4 text-right relative">
                <!-- Menu Icon -->
                <button
                  @click.stop="toggleMenu(order.id)"
                  class="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    ></path>
                  </svg>
                </button>
                <!-- Dropdown Menu -->
                <div
                  v-if="isMenuOpen && activeMenuId === order.id"
                  class="menu-dropdown absolute right-10 bottom-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
                  @click.stop
                >
                  <div class="py-1">
                    <button
                      @click="handleEdit(order.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDelete(order.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure dropdown is above other elements */
.menu-dropdown {
  z-index: 1000; /* Higher z-index to ensure visibility */
}
</style>
