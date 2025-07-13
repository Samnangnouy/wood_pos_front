<script setup>
import { ref } from "vue";

const props = defineProps([
  "isModalOpen",
  "closeModal",
  "submitCategory",
  "newCategoryName",
]);

// const newCategoryName = ref(""); // Store new category name
</script>

<template>
  <div
    v-if="props?.isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background-color: rgba(0, 0, 0, 0.25)"
    @click="closeModal"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" @click.stop>
      <h2 class="text-lg font-bold text-gray-800 mb-4">Add New Category</h2>
      <div class="mb-4">
        <label
          for="categoryName"
          class="block text-sm font-medium text-gray-700"
          >Category Name</label
        >
        <input
          v-model="props.newCategoryName"
          id="categoryName"
          type="text"
          class="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#986b41] focus:border-[#986b41]"
          placeholder="Enter category name"
        />
      </div>
      <div class="flex justify-end space-x-2">
        <button
          @click="props.closeModal"
          class="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
        >
          Cancel
        </button>
        <button
          @click="props.submitCategory"
          class="px-4 py-2 text-white bg-[#986b41] rounded-lg hover:bg-[#B68E65] focus:outline-none"
          :disabled="!newCategoryName.trim()"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>
