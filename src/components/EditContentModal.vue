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
          <h3 class="font-bold text-base">Редактировать контент</h3>
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
        <p class="text-xs text-white text-opacity-90 mt-1">
          {{ content.key }} - {{ getKeyLabel(content.key) }}
        </p>
      </div>

      <!-- Форма с прокруткой -->
      <div class="flex-1 overflow-y-auto p-4">
        <form @submit.prevent="updateContent" class="space-y-3">
          <!-- Информация о контенте -->
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs font-medium text-gray-900 mb-0.5">
              {{ getKeyLabel(content.key) }} ({{ content.key }})
            </div>
            <div class="text-xs text-gray-600 space-y-0.5">
              <div>ID: {{ content.id }}</div>
              <div>Создан: {{ formatDate(content.created_at) }}</div>
              <div>Обновлён: {{ formatDate(content.updated_at) }}</div>
            </div>
          </div>

          <!-- Заголовок -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Заголовок
            </label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Название контента"
            />
          </div>

          <!-- Содержимое -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Содержимое
            </label>
            <textarea
              v-model="formData.content"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none resize-none"
              placeholder="Текст контента..."
            ></textarea>
          </div>

          <!-- Филиал (выпадающий список) -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Филиал
            </label>
            <select
              v-model="formData.branch_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option :value="null">Для всех филиалов</option>
              <option
                v-for="branch in branches"
                :key="branch.id"
                :value="branch.id"
              >
                {{ branch.name }}
              </option>
            </select>
          </div>

          <!-- Цена -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Цена (₽)
            </label>
            <input
              v-model.number="formData.price"
              type="number"
              min="0"
              step="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Оставьте 0 для бесплатного контента"
            />
          </div>

          <!-- Активность -->
          <div class="flex items-center pt-2">
            <input
              v-model="formData.is_active"
              type="checkbox"
              id="is_active"
              class="h-4 w-4 text-[#4e5d51] focus:ring-[#4e5d51] border-gray-300 rounded"
            />
            <label for="is_active" class="ml-2 text-xs text-gray-700">
              Активен
            </label>
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
            @click="updateContent"
            :disabled="isUpdating"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isUpdating">Сохранить</span>
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
import { contentAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "EditContentModal",
  props: {
    content: {
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
      isUpdating: false,
      error: null,
      formData: {},
      scrollY: 0,
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),
  },
  watch: {
    content: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = {
            title: newVal.title || "",
            content: newVal.content || "",
            branch_id: newVal.branch_id || null,
            price: newVal.price || null,
            is_active: newVal.is_active,
          };
        }
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
    // Блокировка прокрутки тела документа
    lockBodyScroll() {
      this.scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    },

    // Разблокировка прокрутки тела документа
    unlockBodyScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, this.scrollY);
    },

    getKeyLabel(key) {
      const labels = {
        BACHELOR: "МАЛЬЧИШНИК",
        BACHELORETTE: "ДЕВИЧНИК",
        COLLECTIVE: "КОЛЛЕКТИВНАЯ ПРОГРАММА",
        AUTHOR: "АВТОРСКАЯ ПРОГРАММА",
        CORPORATE: "КОРПОРАТИВНАЯ ПРОГРАММА",
        CERTIFICATE: "ПОДАРОЧНЫЕ СЕРТИФИКАТЫ",
        BATH_CLUB: "БАННЫЙ КЛУБ С. ХАЧАТУРЬЯН",
        BUSINESS_BATH: "Бизнес-баня МОСТ",
        FIRST_TIME: "Я ПЕРВЫЙ РАЗ",
        LOYALTY: "ЛОЯЛЬНОСТЬ И ПРОМОКОДЫ",
      };
      return labels[key] || key;
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    close() {
      this.$emit("close");
    },

    async updateContent() {
      try {
        this.isUpdating = true;
        this.error = null;

        console.log("Обновление контента:", this.formData);

        // Подготовка данных для отправки
        const dataToSend = {
          title: this.formData.title || null,
          content: this.formData.content || null,
          branch_id: this.formData.branch_id,
          price: this.formData.price || null,
          is_active: this.formData.is_active,
        };

        console.log("Отправка данных:", dataToSend);

        const response = await contentAPI.update(this.content.id, dataToSend);

        console.log("Контент обновлен:", response);

        this.$emit("updated");
        this.close();
      } catch (error) {
        console.error("Ошибка при обновлении контента:", error);
        this.error = error.message || "Не удалось обновить контент";
      } finally {
        this.isUpdating = false;
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

/* Улучшаем внешний вид выпадающих списков */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
