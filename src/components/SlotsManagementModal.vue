<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-3"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl w-full max-w-sm">
      <!-- Шапка -->
      <div
        class="bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-4 py-3 rounded-t-xl"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-base">👥 Управление местами</h2>
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
        <p class="text-xs text-white text-opacity-90 mt-1">
          {{ event.title }}
        </p>
      </div>

      <!-- Содержимое -->
      <div class="p-4 space-y-4">
        <!-- Текущее состояние -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700">Занятость</span>
            <span class="text-lg font-bold text-gray-900">
              {{ currentOccupied }} / {{ event.max_participants }}
            </span>
          </div>

          <!-- Прогресс-бар -->
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
            <div
              :class="getProgressColor()"
              class="h-3 rounded-full transition-all duration-300"
              :style="{ width: getProgressPercentage() + '%' }"
            ></div>
          </div>

          <div class="flex justify-between text-xs text-gray-600">
            <span>Свободно: {{ getAvailableSlots() }}</span>
            <span>{{ getProgressPercentage() }}%</span>
          </div>
        </div>

        <!-- Быстрые действия -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-2">
            Быстрые действия
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="changeSlots(-1)"
              :disabled="currentOccupied <= 0 || isLoading"
              class="bg-red-50 hover:bg-red-100 text-red-700 font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              -1 место
            </button>

            <button
              @click="changeSlots(1)"
              :disabled="currentOccupied >= event.max_participants || isLoading"
              class="bg-green-50 hover:bg-green-100 text-green-700 font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              +1 место
            </button>
          </div>
        </div>

        <!-- Установить значение -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-2">
            Установить значение
          </h3>
          <div class="flex gap-2">
            <input
              v-model.number="manualValue"
              type="number"
              min="0"
              :max="event.max_participants"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Кол-во занятых"
            />
            <button
              @click="setSlots"
              :disabled="!isValidManualValue() || isLoading"
              class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Установить
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            От 0 до {{ event.max_participants }}
          </p>
        </div>

        <!-- Ошибка -->
        <div
          v-if="error"
          class="bg-red-50 border-l-4 border-red-500 rounded-r p-3"
        >
          <p class="text-xs text-red-800">{{ error }}</p>
        </div>

        <!-- Успех -->
        <div
          v-if="successMessage"
          class="bg-green-50 border-l-4 border-green-500 rounded-r p-3"
        >
          <p class="text-xs text-green-800">{{ successMessage }}</p>
        </div>

        <!-- Загрузка -->
        <div v-if="isLoading" class="text-center py-2">
          <div class="inline-block">
            <svg
              class="animate-spin h-6 w-6 text-[#4e5d51]"
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
          </div>
        </div>
      </div>

      <!-- Кнопка закрыть -->
      <div class="px-4 pb-4">
        <button
          @click="$emit('close')"
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { eventCalendarAPI } from "@/utils/api";

export default {
  name: "SlotsManagementModal",
  props: {
    event: {
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
      isLoading: false,
      error: null,
      successMessage: null,
      currentOccupied: this.event.occupied_slots || 0,
      manualValue: this.event.occupied_slots || 0,
    };
  },
  methods: {
    getProgressPercentage() {
      if (!this.event.max_participants) return 0;
      return Math.round(
        (this.currentOccupied / this.event.max_participants) * 100
      );
    },

    getAvailableSlots() {
      return Math.max(this.event.max_participants - this.currentOccupied, 0);
    },

    getProgressColor() {
      const percentage = this.getProgressPercentage();
      if (percentage >= 100) return "bg-red-500";
      if (percentage >= 80) return "bg-orange-500";
      if (percentage >= 50) return "bg-yellow-500";
      return "bg-green-500";
    },

    isValidManualValue() {
      return (
        this.manualValue !== null &&
        this.manualValue !== "" &&
        this.manualValue >= 0 &&
        this.manualValue <= this.event.max_participants
      );
    },

    async changeSlots(amount) {
      try {
        this.isLoading = true;
        this.error = null;
        this.successMessage = null;

        let result;
        if (amount > 0) {
          result = await eventCalendarAPI.increaseSlots(
            this.event.id,
            Math.abs(amount)
          );
        } else {
          result = await eventCalendarAPI.decreaseSlots(
            this.event.id,
            Math.abs(amount)
          );
        }

        this.currentOccupied = result.occupied_slots;
        this.manualValue = result.occupied_slots;
        this.successMessage = result.message || "Успешно обновлено";

        this.$emit("updated", result);

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error("Ошибка при изменении мест:", error);
        this.error = error.message || "Не удалось изменить количество мест";
      } finally {
        this.isLoading = false;
      }
    },

    async setSlots() {
      if (!this.isValidManualValue()) return;

      try {
        this.isLoading = true;
        this.error = null;
        this.successMessage = null;

        const result = await eventCalendarAPI.setSlots(
          this.event.id,
          this.manualValue
        );

        this.currentOccupied = result.occupied_slots;
        this.successMessage = result.message || "Успешно установлено";

        this.$emit("updated", result);

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error("Ошибка при установке значения:", error);
        this.error = error.message || "Не удалось установить значение";
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {
    "event.occupied_slots": {
      handler(newVal) {
        this.currentOccupied = newVal || 0;
        this.manualValue = newVal || 0;
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
/* Стили */
</style>
