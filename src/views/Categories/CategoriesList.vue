<script setup>
import { ref } from "vue";
import NavBar from "../../components/NavBar.vue";
import SideBar from "../../components/SideBar.vue";
import { onMounted } from "vue";
import store from "../../store";
import { onUnmounted } from "vue";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const isModalOpen = ref(false); // Control modal visibility
const isUpdate = ref(false); // Control For Update
const newCategoryName = ref(""); // Store new category name
const isMenuOpen = ref(false);
const activeMenuId = ref(null);
const tableContainer = ref(null); // Ref for the table container
const isLoadingCategory = ref(false);
const listCategory = ref([]);
const objEdit = ref(null);

onMounted(() => {
  getAllCategories();
});

const getAllCategories = async (url = null) => {
  isLoadingCategory.value = true;
  try {
    const res = await store.dispatch("getAllCategories", {
      url,
    });

    listCategory.value = res;
    isLoadingCategory.value = false;
  } catch (error) {
    isLoadingCategory.value = false;
  }
};

const submitCategory = async () => {
  if (newCategoryName.value.trim()) {
    try {
      const obj = {
        name: newCategoryName.value,
        description: `Description ${newCategoryName.value}`,
      };
      await store.dispatch("createCategory", obj);
      getAllCategories();
      closeModal();
      toast.success("Category created successfully!");
    } catch (error) {
      closeModal();
      console.log("Error=>", error);
      toast.error("Category create unsuccessfully!");
    }
  }
};

// Handle Edit action
const handleEdit = (category) => {
  isUpdate.value = true;
  isModalOpen.value = true;
  objEdit.value = category;
  newCategoryName.value = category.name;
  closeMenu();
};

const handleUpdate = async () => {
  try {
    const obj = {
      id: objEdit.value._id,
      name: newCategoryName.value,
      description: `Description ${newCategoryName.value}`,
    };
    await store.dispatch("updateCategory", obj);
    getAllCategories();
    closeModal();
    toast.success("Category updated successfully!");
  } catch (error) {
    console.log("Error=>", error);
    toast.error("Category update unsuccessfully!");
  }
};

// Handle Delete action
const handleDelete = async (categoryId) => {
  try {
    await store.dispatch("deleteCategory", categoryId);
    getAllCategories();
    closeMenu();
    toast.success("Category deleted successfully!");
  } catch (error) {
    closeMenu();
    toast.error("Category delete unsuccessfully!");
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  newCategoryName.value = ""; // Reset input on close
  isUpdate.value = false;
  objEdit.value = null;
};

// Toggle dropdown menu for a specific row
const toggleMenu = (categoryId) => {
  if (activeMenuId.value === categoryId) {
    isMenuOpen.value = !isMenuOpen.value; // Toggle if same row clicked
  } else {
    isMenuOpen.value = true; // Open for new row
    activeMenuId.value = categoryId;

    // If the last item is clicked, scroll to the bottom of the table container
    if (
      categoryId === listCategory.value[listCategory.value.length - 1]._id &&
      tableContainer.value
    ) {
      tableContainer.value.scrollTop = tableContainer.value.scrollHeight;
    }
  }
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
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background-color: rgba(0, 0, 0, 0.3)"
        @click="closeModal"
      >
        <div
          class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
          @click.stop
        >
          <h2 v-if="isUpdate" class="text-lg font-bold text-gray-800 mb-4">
            Update Category
          </h2>
          <h2 v-else class="text-lg font-bold text-gray-800 mb-4">
            Add New Category
          </h2>
          <div class="mb-4">
            <label
              for="categoryName"
              class="block text-sm font-medium text-gray-700"
              >Category Name</label
            >
            <input
              v-model="newCategoryName"
              id="categoryName"
              type="text"
              class="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]"
              placeholder="Enter category name"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              @click="closeModal"
              class="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              v-if="isUpdate"
              @click="handleUpdate"
              class="px-4 py-2 text-white bg-[#986b41] rounded-lg hover:bg-[#B68E65] focus:outline-none"
            >
              Update
            </button>
            <button
              v-else
              @click="submitCategory"
              class="px-4 py-2 text-white bg-[#986b41] rounded-lg hover:bg-[#B68E65] focus:outline-none"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <!-- Category Item List -->
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
              <th scope="col" class="px-6 py-3">No</th>
              <th scope="col" class="px-6 py-3">Name</th>
              <th scope="col" class="px-6 py-3">Description</th>
              <th scope="col" class="px-6 py-3 text-right">
                <p>Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(category, index) in listCategory" :key="category.name"
              class="bg-white border-b border-gray-200 hover:bg-[#EAEAEA]"
              @click="handleEdit(category)"
            >
              <td class="px-6 py-4 text-gray-500">
                <div
                  v-if="isLoadingCategory"
                  class="h-2 bg-gray-200 rounded-full w-6"
                ></div>
                <p v-else>{{ String(index + 1).padStart(2, '0') }}</p>
              </td>

              <td class="px-6 py-4 text-gray-500">
                <div
                  v-if="isLoadingCategory"
                  class="h-2 bg-gray-200 rounded-full w-28"
                ></div>
                <p v-else>{{ category.name }}</p>
              </td>

              <td class="px-6 py-4 text-gray-500">
                <div
                  v-if="isLoadingCategory"
                  class="h-2 bg-gray-200 rounded-full w-28"
                ></div>
                <p v-else>{{ category.description }}</p>
              </td>


              <td class="px-6 py-4 text-right relative">
                <!-- Menu Icon -->
                <button
                  @click.stop="toggleMenu(category._id)"
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
                  v-if="isMenuOpen && activeMenuId === category._id"
                  class="menu-dropdown absolute right-10 bottom-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
                  @click.stop
                >
                  <div class="py-1">
                    <button
                      @click="handleEdit(category)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDelete(category._id)"
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
