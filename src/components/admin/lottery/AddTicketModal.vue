<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
    >
      <!-- Шапка -->
      <div
        class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-4 py-3 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-base">Добавить билет вручную</h3>
          <button @click="close" class="text-white hover:text-gray-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Форма -->
      <div class="flex-1 overflow-y-auto p-4">
        <form @submit.prevent="addTicket" class="space-y-4">
          <!-- ID пользователя -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ID пользователя <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.user_id"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Введите ID пользователя"
            />
            <p class="text-xs text-gray-500 mt-1">
              Числовой ID пользователя из системы
            </p>
          </div>

          <!-- Номер билета -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Номер билета <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.ticket_number"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Введите номер билета"
            />
            <p class="text-xs text-gray-500 mt-1">
              Уникальный номер билета. Не должен повторяться.
            </p>
          </div>

          <!-- Примечание -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-yellow-500 mt-0.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="text-sm text-yellow-700">
                <p class="font-medium">Внимание</p>
                <p class="mt-1">
                  Проверьте, что номер билета уникален и не превышает общее
                  количество билетов в лотерее.
                </p>
              </div>
            </div>
          </div>

          <!-- Ошибка -->
          <div
            v-if="error"
            class="bg-red-50 border-l-4 border-red-500 rounded-r p-3"
          >
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </form>
      </div>

      <!-- Кнопки -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div class="flex gap-3">
          <button
            type="button"
            @click="close"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm transition-all active:scale-98"
          >
            Отмена
          </button>
          <button
            type="button"
            @click="addTicket"
            :disabled="isAdding || !formData.user_id || !formData.ticket_number"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isAdding">Добавить билет</span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Добавление...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lotteryAPI } from "@/utils/api";

export default {
  name: "AddTicketModal",
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isAdding: false,
      error: null,
      formData: {
        user_id: null,
        ticket_number: null,
      },
      scrollY: 0,
    };
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.lockBodyScroll();
      } else {
        this.unlockBodyScroll();
      }
    },
  },
  methods: {
    lockBodyScroll() {
      this.scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    },

    unlockBodyScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, this.scrollY);
    },

    close() {
      this.$emit("close");
    },

    async addTicket() {
      try {
        this.isAdding = true;
        this.error = null;

        // Валидация
        if (!this.formData.user_id || this.formData.user_id < 1) {
          throw new Error("ID пользователя должно быть больше 0");
        }
        if (!this.formData.ticket_number || this.formData.ticket_number < 1) {
          throw new Error("Номер билета должен быть больше 0");
        }

        console.log("Добавление билета:", this.formData);

        await lotteryAPI.addUserWithTicket(
          this.formData.user_id,
          this.formData.ticket_number
        );

        alert(
          `Билет #${this.formData.ticket_number} успешно добавлен пользователю ${this.formData.user_id}!`
        );

        this.$emit("added");
        this.close();

        // Сброс формы
        this.formData = {
          user_id: null,
          ticket_number: null,
        };
      } catch (error) {
        console.error("Ошибка при добавлении билета:", error);
        this.error = error.message || "Не удалось добавить билет";
      } finally {
        this.isAdding = false;
      }
    },
  },
  beforeDestroy() {
    this.unlockBodyScroll();
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
