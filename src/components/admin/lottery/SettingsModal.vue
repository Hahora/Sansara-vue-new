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
          <h3 class="font-bold text-base">Настройки лотереи</h3>
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
        <form @submit.prevent="saveSettings" class="space-y-4">
          <!-- Статус лотереи -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">
                Статус лотереи
              </label>
              <div
                :class="
                  formData.is_enabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="text-xs px-2 py-1 rounded-full"
              >
                {{ formData.is_enabled ? "Активна" : "Отключена" }}
              </div>
            </div>
            <div class="flex items-center">
              <button
                type="button"
                @click="formData.is_enabled = true"
                :class="
                  formData.is_enabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                "
                class="flex-1 py-2 text-sm font-medium rounded-l-lg transition-colors"
              >
                Включить
              </button>
              <button
                type="button"
                @click="formData.is_enabled = false"
                :class="
                  !formData.is_enabled
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                "
                class="flex-1 py-2 text-sm font-medium rounded-r-lg transition-colors"
              >
                Отключить
              </button>
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
            @click="saveSettings"
            :disabled="isSaving"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isSaving">Сохранить</span>
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
              Сохранение...
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
  name: "SettingsModal",
  props: {
    settings: {
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
      isSaving: false,
      error: null,
      formData: {},
      scrollY: 0,
    };
  },
  watch: {
    settings: {
      immediate: true,
      handler(newVal) {
        this.formData = {
          is_enabled: newVal.is_enabled || false,
          // Убрал total_tickets из formData
        };
      },
    },
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

    async saveSettings() {
      try {
        this.isSaving = true;
        this.error = null;

        console.log("Сохранение настроек:", this.formData);

        const response = await lotteryAPI.updateSettings(this.formData);

        console.log("Настройки сохранены:", response);

        this.$emit("updated", response);
        this.close();
      } catch (error) {
        console.error("Ошибка при сохранении настроек:", error);
        this.error = error.message || "Не удалось сохранить настройки";
      } finally {
        this.isSaving = false;
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
