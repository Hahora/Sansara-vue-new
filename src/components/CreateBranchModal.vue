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
          <h3 class="font-bold text-base">Создать филиал</h3>
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

      <!-- Форма с прокруткой -->
      <div class="flex-1 overflow-y-auto p-4">
        <form @submit.prevent="createBranch" class="space-y-3">
          <!-- Название -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Название <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              required
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Название филиала"
            />
          </div>

          <!-- Адрес -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Адрес <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.address"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none resize-none"
              placeholder="Полный адрес филиала"
            ></textarea>
          </div>

          <!-- Описание -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none resize-none"
              placeholder="Описание филиала, услуги и особенности"
            ></textarea>
          </div>

          <!-- Менеджер -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Имя менеджера
            </label>
            <input
              v-model="formData.manager_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Имя менеджера"
            />
          </div>

          <!-- Телефон -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="+7 (XXX) XXX-XX-XX"
            />
          </div>

          <!-- Telegram username -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Telegram username
            </label>
            <div class="flex">
              <span
                class="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm"
              >
                @
              </span>
              <input
                v-model="formData.tg_username"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
                placeholder="username"
              />
            </div>
          </div>

          <!-- Ошибка -->
          <div
            v-if="error"
            class="bg-red-50 border-l-4 border-red-500 rounded-r p-2 mt-3"
          >
            <p class="text-xs text-red-800">{{ error }}</p>
          </div>
        </form>
      </div>

      <!-- Кнопки (внизу без прокрутки) -->
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
            type="submit"
            @click="createBranch"
            :disabled="isCreating || !formData.name || !formData.address"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isCreating">Создать</span>
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
              Создание...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { branchAPI } from "@/utils/api";

export default {
  name: "CreateBranchModal",
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isCreating: false,
      error: null,
      formData: {
        name: "",
        address: "",
        phone: "",
        tg_username: "",
        description: "",
        manager_name: "",
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

    async createBranch() {
      try {
        this.isCreating = true;
        this.error = null;

        console.log("Создание филиала:", this.formData);

        // Подготовка данных для отправки
        const dataToSend = {
          name: this.formData.name,
          address: this.formData.address,
          phone: this.formData.phone || null,
          tg_username: this.formData.tg_username || null,
          description: this.formData.description || null,
          manager_name: this.formData.manager_name || null,
        };

        console.log("Отправка данных:", dataToSend);

        const response = await branchAPI.create(dataToSend);

        console.log("Филиал создан:", response);

        this.$emit("created");
        this.close();

        // Сброс формы
        this.formData = {
          name: "",
          address: "",
          phone: "",
          tg_username: "",
          description: "",
          manager_name: "",
        };
      } catch (error) {
        console.error("Ошибка при создании филиала:", error);
        this.error = error.message || "Не удалось создать филиал";
      } finally {
        this.isCreating = false;
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
