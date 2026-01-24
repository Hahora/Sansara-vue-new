<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-3"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-xl w-full max-w-xs max-h-[80vh] overflow-y-auto"
    >
      <!-- Шапка -->
      <div
        class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-3 py-2 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-base">Блокировка пользователя</h2>
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <p class="text-xs text-white text-opacity-90 mt-0.5">
          ID: {{ user.id }} • @{{ user.username || "нет username" }}
        </p>
      </div>

      <!-- Форма -->
      <form @submit.prevent="banUser" class="p-3 space-y-3">
        <!-- Информация о пользователе -->
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-sm font-medium text-gray-900 mb-1">
            {{ user.first_name }} {{ user.last_name }}
          </div>
          <div class="text-xs text-gray-600 space-y-0.5">
            <div v-if="user.phone">📱 {{ user.phone }}</div>
            <div>Telegram ID: {{ user.telegram_id }}</div>
            <div>Броней: {{ user.bookings_count || 0 }}</div>
          </div>
        </div>

        <!-- Причина блокировки -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Причина блокировки <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="banReason"
            required
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
            placeholder="Укажите причину блокировки пользователя..."
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Причина будет видна пользователю и администраторам
          </p>
        </div>

        <!-- Предупреждение -->
        <div class="bg-yellow-50 border-l-4 border-yellow-500 rounded-r p-2">
          <div class="flex">
            <svg
              class="h-5 w-5 text-yellow-500 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <p class="text-xs text-yellow-800">
              Пользователь не сможет создавать бронирования и получать
              уведомления
            </p>
          </div>
        </div>

        <!-- Ошибка -->
        <div
          v-if="error"
          class="bg-red-50 border-l-4 border-red-500 rounded-r p-2"
        >
          <p class="text-xs text-red-800">{{ error }}</p>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-2 pt-1">
          <button
            @click="$emit('close')"
            type="button"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg text-sm transition-all active:scale-98"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isBanning || !banReason.trim()"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isBanning">Заблокировать</span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin h-4 w-4 mr-1"
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
              Блокировка...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { userAPI } from "@/utils/api";

export default {
  name: "BanUserModal",
  props: {
    user: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isBanning: false,
      error: null,
      banReason: "",
    };
  },
  methods: {
    async banUser() {
      try {
        this.isBanning = true;
        this.error = null;

        console.log("Блокировка пользователя:", {
          userId: this.user.id,
          reason: this.banReason,
        });

        await userAPI.banUser(this.user.id, this.banReason.trim());

        console.log("Пользователь заблокирован");

        this.$emit("banned");
        this.$emit("close");
      } catch (error) {
        console.error("Ошибка при блокировке:", error);
        this.error = error.message || "Не удалось заблокировать пользователя";
      } finally {
        this.isBanning = false;
      }
    },
  },
};
</script>
