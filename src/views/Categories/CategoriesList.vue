<script setup>
import { ref } from "vue";
import NavBar from "../../components/NavBar.vue";
import SideBar from "../../components/SideBar.vue";
import CategoriesModalAdd from "./CategoriesModalAdd.vue";
import { onMounted } from "vue";
import store from "../../store";
import { computed } from "vue";
import { onUnmounted } from "vue";

const categories = computed(() => store.state.categories);

console.log("categoriescategories", categories);

const isModalOpen = ref(false); // Control modal visibility
const newCategoryName = ref(""); // Store new category name
const isMenuOpen = ref(false);
const activeMenuId = ref(null);
const tableContainer = ref(null); // Ref for the table container

onMounted(() => {
  getAllCategories();
});

function getAllCategories(url = null) {
  store.dispatch("getAllCategories", {
    url,
  });
}

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  newCategoryName.value = ""; // Reset input on close
};

const submitCategory = () => {
  if (newCategoryName.value.trim()) {
    console.log("New category:", newCategoryName.value); // Placeholder for form submission
    closeModal();
  }
};

// Sample orders data
const arr_categories = [
  { id: "CATE-001", category_name: "Category 001" },
  { id: "CATE-002", category_name: "Category 002" },
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
    if (
      orderId === arr_categories[arr_categories.length - 1].id &&
      tableContainer.value
    ) {
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
    <div class="p-4 rounded-lg">
      <!-- Add Category Button -->
      <div class="mb-4">
        <button
          @click="openModal"
          class="px-2 py-2 bg-[#986b41] rounded-lg hover:bg-[#B68E65] focus:outline-none flex items-center space-x-1"
        >
          <svg
            class="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14m-7 7V5"
            />
          </svg>
          <p class="text-white">Add Category</p>
        </button>
      </div>

      <!-- Modal -->
      <CategoriesModalAdd
        :isModalOpen="isModalOpen"
        :closeModal="closeModal"
        :submitCategory="submitCategory"
        :newCategoryName="newCategoryName"
      />

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
              <th scope="col" class="px-6 py-3">Category ID</th>
              <th scope="col" class="px-6 py-3">Category Name</th>
              <th scope="col" class="px-6 py-3 text-right">
                <p>Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in arr_categories"
              :key="category.id"
              class="bg-white border-b border-gray-200 hover:bg-[#EAEAEA]"
            >
              <th
                scope="row"
                class="px-6 py-4 font-light text-black whitespace-nowrap"
              >
                {{ category.id }}
              </th>
              <td class="px-6 py-4 text-gray-500">
                {{ category.category_name }}
              </td>

              <td class="px-6 py-4 text-right relative">
                <!-- Menu Icon -->
                <button
                  @click.stop="toggleMenu(category.id)"
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
                  v-if="isMenuOpen && activeMenuId === category.id"
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
