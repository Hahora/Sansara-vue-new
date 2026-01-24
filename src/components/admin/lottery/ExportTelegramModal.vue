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
          <h3 class="font-bold text-base">
            {{ modalTitle }}
          </h3>
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
        <form @submit.prevent="exportToTelegram" class="space-y-4">
          <!-- Telegram ID администратора -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Telegram ID администратора <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.admin_telegram_id"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Введите Telegram ID"
            />
            <p class="text-xs text-gray-500 mt-1">
              ID пользователя в Telegram, которому будет отправлен файл
            </p>
          </div>

          <!-- Информация о экспорте -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-blue-500 mt-0.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="text-sm text-blue-700">
                <p class="font-medium">Как это работает</p>
                <p class="mt-1">
                  Данные будут экспортированы в Excel файл и отправлены
                  указанному администратору через Telegram бот. Убедитесь, что
                  бот добавлен в контакты администратора.
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
            @click="exportToTelegram"
            :disabled="isExporting || !formData.admin_telegram_id"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isExporting">Экспортировать в Telegram</span>
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
              Экспорт...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExportTelegramModal",
  props: {
    exportType: {
      type: String,
      default: "tickets",
      validator: (value) => ["tickets", "prizes"].includes(value),
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isExporting: false,
      error: null,
      formData: {
        admin_telegram_id: null,
      },
      scrollY: 0,
    };
  },
  computed: {
    modalTitle() {
      return this.exportType === "tickets"
        ? "Экспорт билетов в Telegram"
        : "Экспорт призов в Telegram";
    },
    exportDescription() {
      return this.exportType === "tickets"
        ? "Билеты будут экспортированы в Excel файл"
        : "Призы будут экспортированы в Excel файл";
    },
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

    async exportToTelegram() {
      try {
        this.isExporting = true;
        this.error = null;

        // Валидация
        if (!this.formData.admin_telegram_id) {
          throw new Error("Укажите Telegram ID администратора");
        }

        console.log(`Экспорт ${this.exportType} в Telegram:`, this.formData);

        // Эмитируем событие с данными
        this.$emit("export", this.formData.admin_telegram_id);

        // Не закрываем модалку здесь, пусть родительский компонент обработает
      } catch (error) {
        console.error("Ошибка при экспорте в Telegram:", error);
        this.error = error.message || "Не удалось экспортировать данные";
      } finally {
        this.isExporting = false;
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
