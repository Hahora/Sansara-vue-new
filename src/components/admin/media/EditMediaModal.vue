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
          <h3 class="font-bold text-base">Редактировать медиа</h3>
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
          ID: {{ media.id }} • {{ media.original_filename }}
        </p>
      </div>

      <!-- Форма -->
      <div class="flex-1 overflow-y-auto p-4">
        <form @submit.prevent="updateMedia" class="space-y-3">
          <!-- Информация о файле -->
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs font-medium text-gray-900 mb-2">
              Информация о файле
            </div>
            <div class="text-xs text-gray-600 space-y-1">
              <div class="flex justify-between">
                <span>Тип:</span>
                <span class="font-semibold">{{
                  getMediaTypeLabel(media.media_type)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span>Размер:</span>
                <span class="font-semibold">{{
                  formatFileSize(media.file_size)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span>MIME:</span>
                <span class="font-semibold">{{ media.mime_type }}</span>
              </div>
              <div class="flex justify-between">
                <span>Создан:</span>
                <span class="font-semibold">{{
                  formatDate(media.created_at)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Название -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Описание медиа"
            />
          </div>

          <!-- Раздел меню -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Раздел меню
            </label>
            <select
              v-model="formData.menu_section"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option value="BACHELOR">Мальчишник</option>
              <option value="BACHELORETTE">Девичник</option>
              <option value="COLLECTIVE">Коллективная программа</option>
              <option value="AUTHOR">Авторская программа</option>
              <option value="CERTIFICATE">Сертификаты</option>
              <option value="BATH_CLUB">Банный клуб</option>
              <option value="BUSINESS_BATH">Бизнес-баня</option>
              <option value="FIRST_TIME">Первый раз</option>
              <option value="LOYALTY">Лояльность</option>
            </select>
          </div>

          <!-- Филиал -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Филиал *
            </label>
            <select
              v-model="formData.branch_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option value="">Выберите филиал</option>
              <option
                v-for="branch in branches"
                :key="branch.id"
                :value="branch.id"
              >
                {{ branch.name }}
              </option>
            </select>
          </div>

          <!-- Порядок отображения -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Порядок отображения
            </label>
            <input
              v-model.number="formData.display_order"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            />
            <p class="text-xs text-gray-500 mt-1">
              Меньшее число = выше в списке
            </p>
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
              Активно
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
            type="submit"
            @click="updateMedia"
            :disabled="!canSave || isUpdating"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
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
import { mediaAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "EditMediaModal",
  props: {
    media: {
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

    canSave() {
      return (
        this.formData.menu_section &&
        this.formData.branch_id &&
        this.formData.branch_id !== ""
      );
    },
  },
  watch: {
    media: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = {
            title: newVal.title || "",
            menu_section: newVal.menu_section || "",
            branch_id: newVal.branch_id || "",
            display_order: newVal.display_order || 0,
            is_active: newVal.is_active !== false,
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

    getMediaTypeLabel(type) {
      const types = {
        PHOTO: "Фото",
        VIDEO: "Видео",
        DOCUMENT: "Документ",
      };
      return types[type] || type;
    },

    formatFileSize(bytes) {
      if (!bytes) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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

    async updateMedia() {
      try {
        this.isUpdating = true;
        this.error = null;

        console.log("Обновление медиа:", this.formData);

        const dataToSend = {
          title: this.formData.title || null,
          menu_section: this.formData.menu_section || null,
          branch_id: this.formData.branch_id,
          display_order: this.formData.display_order,
          is_active: this.formData.is_active,
        };

        console.log("Отправка данных:", dataToSend);

        const response = await mediaAPI.update(this.media.id, dataToSend);

        console.log("Медиа обновлено:", response);

        this.$emit("updated");
        this.close();
      } catch (error) {
        console.error("Ошибка при обновлении медиа:", error);
        this.error = error.message || "Не удалось обновить медиа";
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

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
