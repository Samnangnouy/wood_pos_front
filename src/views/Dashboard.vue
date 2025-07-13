<script setup>
import NavBar from "../components/NavBar.vue";
import SideBar from "../components/SideBar.vue";
import dashboard from "../static-data/dashboard";
</script>

<template>
  <!-- Import the Sidebar -->
  <SideBar />

  <div class="sm:ml-64">
    <!-- Navigation Bar -->
    <NavBar />

    <div class="">
      <div class="p-4 rounded-lg">
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
      </div>
    </div>
  </div>
</template>
