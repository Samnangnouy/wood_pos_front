<script setup>
import SideBar from "../components/SideBar.vue";
import dashboard from "../static-data/dashboard";
</script>

<template>
  <!-- Import the Sidebar -->
  <SideBar />

  <div class="p-4 sm:ml-64">
    <div class="p-4 rounded-lg mt-14">
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div
          v-for="card in dashboard['dashboard_card']"
          :key="card.id"
          class="flex flex-col items-center justify-center rounded-xl bg-white drop-shadow-md p-6"
        >
          <p class="text-xl text-black font-semibold text-center">
            {{ card.title }}
          </p>
          <p
            class="text-2xl text-white font-bold mt-4"
            :style="{
              color: card.color,
            }"
          >
            {{ card.value }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center justify-center h-48 mb-4 rounded-sm bg-white"
      >
        <p class="text-2xl text-gray-400 dark:text-gray-500">
          <svg
            class="w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </p>
      </div>
    </div>
  </div>
</template>
