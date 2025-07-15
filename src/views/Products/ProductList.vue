<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavBar from "../../components/NavBar.vue";
import SideBar from "../../components/SideBar.vue";
import store from "../../store";
import DialogConfirm from "../../components/DialogConfirm.vue";
import ProductView from "./ProductView.vue";

// Data Boolean
const isModalOpen = ref(false);
const isMenuOpen = ref(false);
const isLoadingProduct = ref(false);
const isUpdate = ref(false);
const isDialogOpen = ref(false);
const isViewProduct = ref(false);

// Data Null
const activeMenuId = ref(null);
const tableContainer = ref(null);
const imagePreview = ref(null);
const productDeleteId = ref(null);

// Data Array
const listProduct = ref([]);
const listCategory = ref([]);

// Data Object
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
const productItem = ref({});

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
  isLoadingProduct.value = true;
  try {
    const res = await store.dispatch("getAllProducts", { url });
    listProduct.value = res;
    isLoadingProduct.value = false;
  } catch (error) {
    isLoadingProduct.value = false;
    console.log("Get All Product Error", error);
  }
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
  isUpdate.value = false;
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
const handleEdit = (product) => {
  imagePreview.value = product?.image;
  formData.value = {
    id: product?._id,
    image: product?.image,
    name: product?.name,
    description: product?.description,
    category_id: product?.category_id,
    price: product?.price,
    cost: product?.cost,
    status: "true",
    created_by: "admin",
    updated_by: "admin",
  };
  isUpdate.value = true;
  isModalOpen.value = true;

  // Add your edit logic here
  closeMenu();
};

const handleUpdate = async () => {
  try {
    await store.dispatch("updateProduct", formData.value);
    getAllProducts();
    closeModal();
  } catch (error) {
    console.log("Error Update Product", error);
  }
};

// Handle Delete action
const handleDelete = async (productId) => {
  productDeleteId.value = productId;
  isDialogOpen.value = true;
  closeMenu();
};

const onViewProduct = (product) => {
  productItem.value = product;
  isViewProduct.value = true;
};

const onCloseViewProduct = () => {
  productItem.value = {};
  isViewProduct.value = false;
};

const confirmModalDialog = async () => {
  try {
    await store.dispatch("deleteProduct", productDeleteId.value);
    getAllProducts();
    productDeleteId.value = null;
    isDialogOpen.value = false;
  } catch (error) {
    alert("Delete Product Fail");
    console.log("Error Delete Product", error);
  }
};

const closeModalDialog = () => {
  productDeleteId.value = null;
  isDialogOpen.value = false;
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
                <div v-if="imagePreview" class="mt-1">
                  <img
                    :src="imagePreview"
                    alt="Image Preview"
                    class="w-full h-auto rounded-lg max-h-64 object-cover"
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
          <!-- Skeleton List -->
          <tbody v-if="listProduct?.length == 0 || isLoadingProduct">
            <tr
              v-for="product in [{}, {}, {}]"
              class="bg-white border-b border-gray-200 hover:bg-[#EAEAEA]"
            >
              <th
                scope="row"
                class="px-6 py-4 font-light text-black whitespace-nowrap"
              >
                <div class="flex">
                  <div
                    class="w-15 h-15 bg-gray-200 object-cover rounded-md"
                  ></div>

                  <div class="ml-4">
                    <div class="h-2 bg-gray-200 rounded-full w-16 mt-1"></div>
                    <div class="h-2 bg-gray-200 rounded-full w-16 mt-4"></div>
                  </div>
                </div>
              </th>
              <!-- <td class="px-6 py-4 text-gray-500">{{ product.name }}</td> -->
              <td class="px-6 py-4 text-gray-500">
                <div class="h-2 bg-gray-200 rounded-full w-12"></div>
              </td>
              <td class="px-6 py-4 text-gray-500">
                <div class="h-2 bg-gray-200 rounded-full w-12"></div>
              </td>
              <td class="px-6 py-4 text-gray-500">
                <div class="h-2 bg-gray-200 rounded-full w-12"></div>
              </td>
              <td class="px-6 py-4 text-right relative"></td>
            </tr>
          </tbody>
          <!-- Product Item List -->
          <tbody v-else>
            <tr
              v-for="product in listProduct"
              :key="product._id"
              class="bg-white border-b border-gray-200 hover:bg-[#EAEAEA]"
              @click="onViewProduct(product)"
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
              <td class="px-6 py-4 text-gray-500">
                <p>${{ product.cost }}</p>
              </td>
              <td class="px-6 py-4 text-gray-500">
                <p>${{ product.price }}</p>
              </td>
              <td class="px-6 py-4 text-gray-500">
                <p>{{ 0 }}</p>
              </td>
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
                      @click="handleEdit(product)"
                      class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#374151"
                        class="size-4.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>

                      <p class="ml-2">Edit</p>
                    </button>
                    <button
                      @click="handleDelete(product._id)"
                      class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#DC2626"
                        class="size-4.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      <p class="ml-2">Delete</p>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Delete Dialog -->
      <DialogConfirm
        :textTitle="'Delete Product'"
        :textDesc="'Are you sure you want to delete product?'"
        :confirmModal="confirmModalDialog"
        :closeModal="closeModalDialog"
        :isOpen="isDialogOpen"
        :isDelete="true"
      />

      <!-- View Product -->
      <ProductView
        :isModalOpen="isViewProduct"
        :productItem="productItem"
        :onCloseModal="onCloseViewProduct"
      />
    </div>
  </div>
</template>

<style scoped>
/* Ensure dropdown is above other elements */
.menu-dropdown {
  z-index: 1000; /* Higher z-index to ensure visibility */
}
</style>
