<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
    >
      <!-- Шапка -->
      <div
        class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-4 py-3 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-base">Загрузить медиа</h3>
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
        <form @submit.prevent="uploadMedia" class="space-y-4">
          <!-- Загрузка файла -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">
              Файл *
            </label>

            <div
              @click="$refs.fileInput.click()"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="handleDrop"
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                isDragging
                  ? 'border-[#4e5d51] bg-green-50'
                  : selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-[#4e5d51]',
              ]"
            >
              <input
                ref="fileInput"
                type="file"
                :accept="acceptedFileTypes"
                @change="onFileSelect"
                class="hidden"
              />

              <div v-if="!selectedFile">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p class="mt-2 text-sm text-gray-600">
                  Нажмите или перетащите файл
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Фото, видео или документ
                </p>
              </div>

              <div v-else class="text-sm">
                <div class="flex items-center justify-center mb-2">
                  <svg
                    class="w-8 h-8 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <p class="font-medium text-gray-900">{{ selectedFile.name }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatFileSize(selectedFile.size) }}
                </p>
                <button
                  type="button"
                  @click.stop="selectedFile = null"
                  class="mt-2 text-xs text-red-600 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>

          <!-- Раздел меню -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Раздел меню *
            </label>
            <select
              v-model="formData.menu_section"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option value="">Выберите раздел</option>
              <option value="INTRO">Интро (только видео)</option>
              <option value="HOME">Главная (только фото)</option>
              <option value="BACHELOR">Коллективная баня</option>
              <option value="BACHELORETTE">Девичник</option>
              <option value="BATH_CLUB">Банный клуб</option>
              <option value="BUSINESS_BATH">Бизнес-баня</option>
              <option value="CERTIFICATE">Сертификаты</option>
              <option value="FIRST_TIME">Первый раз</option>
              <option value="LOYALTY">Лояльность</option>
            </select>
          </div>

          <!-- Тип медиа -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">
              Тип медиа *
            </label>
            <!-- Для INTRO — только видео (заблокировано) -->
            <div v-if="formData.menu_section === 'INTRO'" class="p-3 border-2 border-blue-500 bg-blue-50 rounded-lg text-sm text-blue-700 font-medium flex items-center gap-2">
              <span class="text-xl">🎥</span>
              Только видео (для раздела Интро)
            </div>
            <!-- Для HOME — только фото (заблокировано) -->
            <div v-else-if="formData.menu_section === 'HOME'" class="p-3 border-2 border-green-500 bg-green-50 rounded-lg text-sm text-green-700 font-medium flex items-center gap-2">
              <span class="text-xl">📷</span>
              Только фото (для раздела Главная)
            </div>
            <div v-else-if="formData.menu_section !== 'INTRO' && formData.menu_section !== 'HOME'" class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="formData.media_type = 'PHOTO'"
                :class="[
                  'p-3 border-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center',
                  formData.media_type === 'PHOTO'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300',
                ]"
              >
                <span class="text-2xl mb-1">📷</span>
                Фото
              </button>
              <button
                type="button"
                @click="formData.media_type = 'VIDEO'"
                :class="[
                  'p-3 border-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center',
                  formData.media_type === 'VIDEO'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300',
                ]"
              >
                <span class="text-2xl mb-1">🎥</span>
                Видео
              </button>
              <button
                type="button"
                @click="formData.media_type = 'DOCUMENT'"
                :class="[
                  'p-3 border-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center',
                  formData.media_type === 'DOCUMENT'
                    ? 'border-gray-500 bg-gray-50 text-gray-700'
                    : 'border-gray-300 hover:border-gray-400',
                ]"
              >
                <span class="text-2xl mb-1">📄</span>
                Документ
              </button>
            </div>
          </div>

          <!-- Название -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Название (опционально)
            </label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Описание медиа"
            />
          </div>

          <!-- Филиал (не нужен для INTRO) -->
          <div v-if="formData.menu_section !== 'INTRO'">
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
              placeholder="0"
            />
            <p class="text-xs text-gray-500 mt-1">
              Меньшее число = выше в списке
            </p>
          </div>

          <!-- Прогресс загрузки -->
          <div v-if="uploadProgress > 0" class="bg-gray-100 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-700">Загрузка...</span>
              <span class="text-xs font-semibold text-[#4e5d51]"
                >{{ uploadProgress }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-[#4e5d51] h-2 rounded-full transition-all duration-300"
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Ошибка -->
          <div
            v-if="error"
            class="bg-red-50 border-l-4 border-red-500 rounded-r p-3"
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
            :disabled="isUploading"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm transition-all active:scale-98 disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            @click="uploadMedia"
            :disabled="!canUpload || isUploading"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isUploading">Загрузить</span>
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
              Загрузка...
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
  name: "UploadMediaModal",
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isUploading: false,
      error: null,
      selectedFile: null,
      isDragging: false,
      uploadProgress: 0,
      formData: {
        media_type: "PHOTO",
        menu_section: "",
        title: "",
        branch_id: "",
        display_order: 0,
      },
      scrollY: 0,
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),

    canUpload() {
      if (!this.selectedFile || !this.formData.media_type || !this.formData.menu_section) return false;
      if (this.formData.menu_section === 'INTRO') return true;
      return !!this.formData.branch_id;
    },

    acceptedFileTypes() {
      if (this.formData.menu_section === 'HOME') return 'image/*';
      if (this.formData.menu_section === 'INTRO') return 'video/*';
      return 'image/*,video/*,.pdf,.doc,.docx';
    },
  },
  watch: {
    'formData.menu_section'(val) {
      if (val === 'HOME') {
        this.formData.media_type = 'PHOTO';
      } else if (val === 'INTRO') {
        this.formData.media_type = 'VIDEO';
      }
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

    onFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.autoDetectMediaType(file);
      }
    },

    handleDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        this.selectedFile = file;
        this.autoDetectMediaType(file);
      }
    },

    autoDetectMediaType(file) {
      const type = file.type;
      if (type.startsWith("image/")) {
        this.formData.media_type = "PHOTO";
      } else if (type.startsWith("video/")) {
        this.formData.media_type = "VIDEO";
      } else {
        this.formData.media_type = "DOCUMENT";
      }
    },

    formatFileSize(bytes) {
      if (!bytes) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    },

    async uploadMedia() {
      if (!this.canUpload) return;

      try {
        this.isUploading = true;
        this.error = null;
        this.uploadProgress = 0;

        console.log("Загрузка медиа...", this.formData);

        const formData = new FormData();
        formData.append("file", this.selectedFile);
        formData.append("media_type", this.formData.media_type);
        formData.append("menu_section", this.formData.menu_section);

        if (this.formData.title) {
          formData.append("title", this.formData.title);
        }

        if (this.formData.branch_id) {
          formData.append("branch_id", this.formData.branch_id);
        }

        formData.append("display_order", this.formData.display_order);

        // Симуляция прогресса
        const progressInterval = setInterval(() => {
          if (this.uploadProgress < 90) {
            this.uploadProgress += 10;
          }
        }, 200);

        const response = await mediaAPI.upload(formData);

        clearInterval(progressInterval);
        this.uploadProgress = 100;

        console.log("Медиа загружено:", response);

        setTimeout(() => {
          this.$emit("uploaded", response);
          this.close();
        }, 500);
      } catch (error) {
        console.error("Ошибка при загрузке медиа:", error);
        this.error = error.message || "Не удалось загрузить медиа";
        this.uploadProgress = 0;
      } finally {
        this.isUploading = false;
      }
    },

    close() {
      this.$emit("close");
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
