<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

const {
  isOpen = false,
  closeModal = () => {},
  confirmModal = () => {},
  textTitle = "Dialog Title",
  textDesc = "Dialog description",
  isDelete = false,
} = defineProps([
  "isOpen",
  "closeModal",
  "confirmModal",
  "textTitle",
  "textDesc",
  "isDelete",
  "svg",
]);
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <div class="flex">
                <svg
                  v-if="isDelete"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#DC2626"
                  class="size-5.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#986b41"
                  class="size-5.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>

                <div class="ml-2">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                  >
                    {{ textTitle }} !
                  </DialogTitle>

                  <div class="mt-1">
                    <p class="text-md text-gray-500">
                      {{ textDesc }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md bg-gray-300 hover:bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  v-if="isDelete"
                  type="button"
                  class="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500"
                  @click="confirmModal"
                >
                  Delete
                </button>
                <button
                  v-else
                  type="button"
                  class="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#986b41] hover:bg-[#B68E65]"
                  @click="confirmModal"
                >
                  Confirm
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
