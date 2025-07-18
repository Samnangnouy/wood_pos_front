<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavBar from "../../components/NavBar.vue";
import SideBar from "../../components/SideBar.vue";
import store from "../../store";

// Reactive state to manage dropdown visibility
const isModalOpen = ref(false);
const isMenuOpen = ref(false);
const isLoading = ref(false);
const isUpdate = ref(false);
const activeMenuId = ref(null);
const tableContainer = ref(null); // Ref for the table container
const imagePreview = ref(null);
const userList = ref([]);
const errors = ref({});
// Data Object
const formData = ref({
  image: null,
  username: "",
  password: "",
  confirm_password: "",
  full_name: "",
  role: "admin",
});

onMounted(async () => {
  await Promise.all([getUsers()]);
});

const validateForm = () => {
  const newErrors = {};
  if (!formData.value.image) newErrors.image = true;
  if (!formData.value.username) newErrors.username = true;
  if (!formData.value.full_name) newErrors.full_name = true;
  if (!formData.value.password) newErrors.password = true;
  if (!formData.value.confirm_password) newErrors.confirm_password = true;
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const getUsers = async () => {
  isLoading.value = true;
  try {
    const res = await store.dispatch("getAllUsers");
    userList.value = res;
  } catch (error) {
    console.log("Error get users");
  } finally {
    isLoading.value = false;
  }
};

const onAddUser = async () => {
  if (!validateForm()) return;
  try {
    const res = await store.dispatch("createUser", formData.value);
    if (res) {
      getUsers();
      closeModal();
    }
  } catch (error) {
    console.log("Error adding product:", error);
  }
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
    errors.value.image = false;
  } else {
    formData.value.image = null;
    imagePreview.value = null;
    errors.value.image = true;
  }
};

const openModal = () => {
  isModalOpen.value = true;
  errors.value = {}; // Reset errors when opening modal
};

const closeModal = () => {
  isModalOpen.value = false;
  isUpdate.value = false;
  formData.value = {
    image: null,
    username: "",
    password: "",
    confirm_password: "",
    full_name: "",
    role: "admin",
  };
  imagePreview.value = null;
  errors.value = {};
};

// Toggle dropdown menu for a specific row
const toggleMenu = (userId) => {
  if (activeMenuId.value === userId) {
    isMenuOpen.value = !isMenuOpen.value; // Toggle if same row clicked
  } else {
    isMenuOpen.value = true; // Open for new row
    activeMenuId.value = userId;

    // If the last item is clicked, scroll to the bottom of the table container
    if (
      userId === userList.value[userList.value.length - 1]?._id &&
      tableContainer.value
    ) {
      tableContainer.value.scrollTop = tableContainer.value.scrollHeight;
    }
  }
};

// Handle Edit action
const handleEdit = (userId) => {
  console.log(`Edit order: ${userId}`);
  closeMenu();
};

// Handle Delete action
const handleDelete = async (userId) => {
  try {
    await store.dispatch("deleteUser", userId);
    getUsers();
    closeMenu();
  } catch (error) {
    console.log("Error delete user");
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
      <!-- Add User Button -->
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
          <p class="text-white">Add User</p>
        </button>
      </div>

      <!-- Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background-color: rgba(0, 0, 0, 0.25)"
      >
        <div
          class="bg-white rounded-lg shadow-lg w-full max-w-xl flex flex-col max-h-[80vh]"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="mt-6 ml-6 mb-2">
            <h2 v-if="isUpdate" class="text-lg font-bold text-gray-800">
              Update Product
            </h2>
            <h2 v-else class="text-lg font-bold text-gray-800">Add New User</h2>
          </div>

          <!-- Scrollable Form Fields -->
          <div class="flex-1 overflow-y-auto px-6">
            <div class="space-y-4">
              <!-- Image Upload -->
              <div>
                <div class="flex">
                  <label
                    for="image"
                    class="block text-sm font-medium text-gray-700"
                  >
                    User Image
                  </label>
                  <p class="text-red-600">*</p>
                </div>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                  :class="[
                    'mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]',
                    { 'border-red-500': errors.image },
                  ]"
                />
                <!-- Image Preview -->
                <div v-if="imagePreview" class="mt-1">
                  <img
                    :src="imagePreview"
                    alt="Image Preview"
                    class="w-full h-auto rounded-lg max-h-64 object-cover"
                    style="max-height: 200px"
                  />
                </div>
              </div>

              <!-- Full Name -->
              <div>
                <div class="flex">
                  <label
                    for="fullName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <p class="text-red-600">*</p>
                </div>
                <input
                  v-model="formData.full_name"
                  id="fullName"
                  type="text"
                  @input="errors.full_name = false"
                  :class="[
                    'mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]',
                    { 'border-red-500': errors.full_name },
                  ]"
                  placeholder="Enter product name"
                />
              </div>

              <!-- User Name -->
              <div>
                <div class="flex">
                  <label
                    for="userName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    User Name
                  </label>
                  <p class="text-red-600">*</p>
                </div>
                <input
                  v-model="formData.username"
                  id="userName"
                  type="text"
                  @input="errors.username = false"
                  :class="[
                    'mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]',
                    { 'border-red-500': errors.username },
                  ]"
                  placeholder="Enter product name"
                />
              </div>

              <!-- Password -->
              <div>
                <div class="flex">
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <p class="text-red-600">*</p>
                </div>
                <input
                  v-model="formData.password"
                  id="password"
                  type="password"
                  @input="errors.password = false"
                  :class="[
                    'mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]',
                    { 'border-red-500': errors.password },
                  ]"
                  placeholder="Enter product name"
                />
              </div>

              <!-- Confirm Password -->
              <div>
                <div class="flex">
                  <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <p class="text-red-600">*</p>
                </div>
                <input
                  v-model="formData.confirm_password"
                  id="confirmPassword"
                  type="password"
                  @input="errors.confirm_password = false"
                  :class="[
                    'mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]',
                    { 'border-red-500': errors.confirm_password },
                  ]"
                  placeholder="Enter product name"
                />
              </div>
            </div>
          </div>

          <!-- Fixed Buttons -->
          <div class="p-4 border-t border-gray-200">
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
                @click="onAddUser"
                class="px-4 py-2 text-white bg-[#986b41] rounded-lg hover:bg-[#B68E65] focus:outline-none"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Item User List -->
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
              v-for="user in userList"
              :key="user._id"
              class="bg-white border-b border-gray-200 hover:bg-[#EAEAEA]"
            >
              <th
                scope="row"
                class="px-6 py-4 font-light text-black whitespace-nowrap"
              >
                {{ user._id }}
              </th>
              <td class="px-6 py-4 text-gray-500">{{ user.username }}</td>
              <td class="px-6 py-4 text-gray-500">{{ user.role }}</td>

              <td class="px-6 py-4 text-right relative">
                <!-- Menu Icon -->
                <button
                  @click.stop="toggleMenu(user._id)"
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
                  v-if="isMenuOpen && activeMenuId === user._id"
                  class="menu-dropdown absolute right-10 bottom-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
                  @click.stop
                >
                  <div class="py-1">
                    <button
                      @click="handleEdit(user._id)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDelete(user._id)"
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
