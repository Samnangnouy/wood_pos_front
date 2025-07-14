<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavBar from "../../components/NavBar.vue";
import SideBar from "../../components/SideBar.vue";
import store from "../../store";

// Reactive state to manage dropdown visibility
const isModalOpen = ref(false); // Control modal visibility
const isMenuOpen = ref(false);
const activeMenuId = ref(null);
const tableContainer = ref(null); // Ref for the table container
const imagePreview = ref(null);
const listProduct = ref([]);
const listCategory = ref([]);
const isUpdate = ref(false);
const formData = ref({
  image: null,
  name: "",
  description: "",
  category_id: "",
  price: "",
  cost: "",
  status: "true",
  created_by: "admin",
  updated_by: "admin",
});
const errors = ref({}); // Store validation errors

onMounted(() => {
  getAllProducts();
  getAllCategories();
});

const validateForm = () => {
  const newErrors = {};
  if (!formData.value.image) newErrors.image = true;
  if (!formData.value.name) newErrors.name = true;
  if (!formData.value.category_id) newErrors.category_id = true;
  if (!formData.value.price) newErrors.price = true;
  if (!formData.value.cost) newErrors.cost = true;
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const submitCategory = async () => {
  if (!validateForm()) return;
  try {
    console.log("formData", formData.value);
    const res = await store.dispatch("createProduct", formData.value);
    console.log("res", res);
    if (res) {
      getAllProducts();
      closeModal();
    }
  } catch (error) {
    console.log("Error adding product:", error);
  }
};

const getAllProducts = async (url = null) => {
  try {
    const res = await store.dispatch("getAllProducts", { url });
    listProduct.value = res;
  } catch (error) {}
};

const getAllCategories = async (url = null) => {
  try {
    const res = await store.dispatch("getAllCategories", { url });
    listCategory.value = res;
  } catch (error) {}
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
  formData.value = {
    image: null,
    name: "",
    description: "",
    category_id: "",
    price: "",
    cost: "",
    status: "true",
    created_by: "admin",
    updated_by: "admin",
  };
  imagePreview.value = null;
  errors.value = {};
};

// Toggle dropdown menu for a specific row
const toggleMenu = (productId) => {
  if (activeMenuId.value === productId) {
    isMenuOpen.value = !isMenuOpen.value; // Toggle if same row clicked
  } else {
    isMenuOpen.value = true; // Open for new row
    activeMenuId.value = productId;

    // If the last item is clicked, scroll to the bottom of the table container
    if (
      productId === listProduct.value[listProduct.value.length - 1]._id &&
      tableContainer.value
    ) {
      tableContainer.value.scrollTop = tableContainer.value.scrollHeight;
    }
  }
};

// Handle Edit action
const handleEdit = (productId) => {
  console.log(`Edit order: ${productId}`);
  // Add your edit logic here
  closeMenu();
};

// Handle Delete action
const handleDelete = (productId) => {
  console.log(`Delete order: ${productId}`);
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
          <p class="text-white">Add Product</p>
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
            <h2 v-else class="text-lg font-bold text-gray-800">
              Add New Product
            </h2>
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
                    Product Image
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
                <div v-if="imagePreview" class="mt-2">
                  <img
                    :src="imagePreview"
                    alt="Image Preview"
                    class="max-w-full h-auto rounded-lg"
                    style="max-height: 200px"
                  />
                </div>
              </div>

              <!-- Product Name -->
              <div>
                <div class="flex">
                  <label
                    for="productName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Product Name
                  </label>
                  <p class="text-red-600">*</p>
                </div>
                <input
                  v-model="formData.name"
                  id="productName"
                  type="text"
                  @input="errors.name = false"
                  :class="[
                    'mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]',
                    { 'border-red-500': errors.name },
                  ]"
                  placeholder="Enter product name"
                />
              </div>

              <!-- Category Select -->
              <div>
                <div class="flex">
                  <label
                    for="category"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <p class="text-red-600">*</p>
                </div>
                <select
                  v-model="formData.category_id"
                  id="category"
                  @change="errors.category_id = false"
                  :class="[
                    'mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]',
                    { 'border-red-500': errors.category_id },
                  ]"
                >
                  <option value="" disabled>Select a category</option>
                  <option
                    v-for="category in listCategory"
                    :key="category._id"
                    :value="category._id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Cost -->
              <div>
                <div class="flex">
                  <label
                    for="cost"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Cost
                  </label>
                  <p class="text-red-600">*</p>
                </div>
                <input
                  v-model.number="formData.cost"
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  @input="errors.cost = false"
                  :class="[
                    'mt-1 w-full p-2 border rounded-lg border-gray-300 focus:ring-[#986b41] focus:border-[#986b41]',
                    { 'border-red-500': errors.cost },
                  ]"
                  placeholder="Enter cost"
                />
              </div>

              <!-- Price -->
              <div>
                <div class="flex">
                  <label
                    for="price"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <p class="text-red-600">*</p>
                </div>
                <input
                  v-model.number="formData.price"
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  @input="errors.price = false"
                  :class="[
                    'mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]',
                    { 'border-red-500': errors.price },
                  ]"
                  placeholder="Enter price"
                />
              </div>

              <!-- Description -->
              <div>
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  v-model="formData.description"
                  id="description"
                  class="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]"
                  placeholder="Enter product description"
                  rows="4"
                ></textarea>
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
                @click="submitCategory"
                class="px-4 py-2 text-white bg-[#986b41] rounded-lg hover:bg-[#B68E65] focus:outline-none"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List Product Item -->
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
              <th scope="col" class="px-6 py-3">Product Image</th>
              <!-- <th scope="col" class="px-6 py-3">Product Name</th> -->
              <th scope="col" class="px-6 py-3">Cost</th>
              <th scope="col" class="px-6 py-3">Price</th>
              <th scope="col" class="px-6 py-3">Quantity</th>
              <th scope="col" class="px-6 py-3 text-right">
                <p>Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in listProduct"
              :key="product._id"
              class="bg-white border-b border-gray-200 hover:bg-[#EAEAEA]"
            >
              <th
                scope="row"
                class="px-6 py-4 font-light text-black whitespace-nowrap"
              >
                <div class="flex">
                  <img
                    :src="product.image"
                    alt="Product Image"
                    class="w-15 h-15 object-cover rounded-md"
                  />
                  <div class="ml-2 grid grid-cols-[70px_1fr] gap-x-2">
                    <p class="text-gray-500">Name:</p>
                    <p class="">{{ product.name }}</p>
                    <p class="text-gray-500">Category:</p>
                    <p class="">{{ product.category.name }}</p>
                  </div>
                </div>
              </th>
              <!-- <td class="px-6 py-4 text-gray-500">{{ product.name }}</td> -->
              <td class="px-6 py-4 text-gray-500">${{ product.cost }}</td>
              <td class="px-6 py-4 text-gray-500">${{ product.price }}</td>
              <td class="px-6 py-4 text-gray-500">{{ 0 }}</td>
              <td class="px-6 py-4 text-right relative">
                <!-- Menu Icon -->
                <button
                  @click.stop="toggleMenu(product._id)"
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
                  v-if="isMenuOpen && activeMenuId === product._id"
                  class="menu-dropdown absolute right-10 bottom-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
                  @click.stop
                >
                  <div class="py-1">
                    <button
                      @click="handleEdit(product._id)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDelete(product._id)"
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
