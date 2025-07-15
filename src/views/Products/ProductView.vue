<script setup>
const {
  isModalOpen = false,
  productItem,
  onCloseModal = () => {},
} = defineProps(["isModalOpen", "productItem", "onCloseModal"]);

console.log("productItem", productItem.created_date);
</script>

<template>
  <!-- Modal Overlay -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background-color: rgba(0, 0, 0, 0.25)"
    @click="onCloseModal"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-xl shadow-lg w-full max-w-lg flex flex-col max-h-[90vh]"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 pt-4">
        <h2 class="text-lg font-bold text-gray-800">
          {{ productItem?.name || "Product Details" }}
        </h2>
        <button @click="onCloseModal" class="text-gray-500 hover:text-gray-700">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Image -->
        <img
          :src="productItem?.image || 'https://via.placeholder.com/300'"
          alt="Product Image"
          class="w-full h-auto rounded-lg max-h-64 object-cover"
        />

        <!-- Details -->
        <div class="space-y-3">
          <!-- Name -->
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-600 w-24">Name:</span>
            <span class="text-gray-800">{{ productItem?.name || "N/A" }}</span>
          </div>

          <!-- Category -->
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-600 w-24">Category:</span>
            <span class="text-gray-800 bg-gray-100 px-2 py-1 rounded">
              {{ productItem?.category?.name || "N/A" }}
            </span>
          </div>

          <!-- Cost -->
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-600 w-24">Quantity:</span>
            <span class="text-gray-800">
              {{ 0 }}
            </span>
          </div>

          <!-- Cost -->
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-600 w-24">Cost:</span>
            <span class="text-gray-800">
              ${{
                productItem?.cost ? Number(productItem.cost).toFixed(2) : "N/A"
              }}
            </span>
          </div>

          <!-- Price -->
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-600 w-24">Price:</span>
            <span class="text-gray-800">
              ${{
                productItem?.price
                  ? Number(productItem.price).toFixed(2)
                  : "N/A"
              }}
            </span>
          </div>

          <!-- Description -->
          <div class="flex items-start gap-2">
            <span class="font-medium text-gray-600 w-24">Description:</span>
            <span class="text-gray-700">{{
              productItem?.description || "No description available"
            }}</span>
          </div>

          <!-- Created Date -->
          <div class="flex items-start gap-2">
            <span class="font-medium text-gray-600 w-24">Created On:</span>
            <span class="text-gray-700">{{
              productItem?.created_date || "No created date"
            }}</span>
          </div>

          <!-- Created By -->
          <div class="flex items-start gap-2">
            <span class="font-medium text-gray-600 w-24">Created By:</span>
            <span class="text-gray-700">{{
              productItem?.created_by || ""
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
