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
          <h3 class="font-bold text-base">Импорт призов из Excel</h3>
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
        <div class="space-y-4">
          <!-- Формат файла -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="text-sm font-medium text-blue-800 mb-2">
              Требования к файлу
            </h4>
            <ul class="text-xs text-blue-700 space-y-1">
              <li>• Формат: Excel (.xlsx, .xls) или CSV</li>
              <li>• Столбцы: Ticket Number | Prize</li>
              <li>• Каждая строка - отдельный приз</li>
              <li>• Заголовки столбцов не обязательны</li>
            </ul>
            <div class="mt-3">
              <h5 class="text-xs font-medium text-blue-800 mb-1">
                Пример данных:
              </h5>
              <div
                class="text-xs bg-white p-2 rounded border border-blue-300 font-mono"
              >
                100 | Сертификат на 5000 руб.<br />
                101 | Бесплатный сеанс в бане<br />
                102 | Набор банных принадлежностей
              </div>
            </div>
          </div>

          <!-- Выбор файла -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Выберите файл
            </label>
            <div class="flex items-center">
              <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls,.csv"
                class="hidden"
                @change="handleFileChange"
              />
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Выбрать файл
              </button>
            </div>
            <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
              Выбран: {{ selectedFile.name }} ({{
                (selectedFile.size / 1024).toFixed(2)
              }}
              KB)
            </div>
          </div>

          <!-- Предупреждение -->
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
                  Существующие призы с такими же номерами билетов будут
                  перезаписаны.
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
        </div>
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
            @click="importPrizes"
            :disabled="isImporting || !selectedFile"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isImporting">Импортировать призы</span>
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
              Импорт...
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
  name: "ImportPrizesModal",
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isImporting: false,
      error: null,
      selectedFile: null,
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
      this.selectedFile = null;
      this.$emit("close");
    },

    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },

    async importPrizes() {
      try {
        this.isImporting = true;
        this.error = null;

        if (!this.selectedFile) {
          throw new Error("Пожалуйста, выберите файл");
        }

        // Проверка типа файла
        const validExtensions = [".xlsx", ".xls", ".csv"];
        const fileExtension = this.selectedFile.name
          .toLowerCase()
          .slice(this.selectedFile.name.lastIndexOf("."));

        if (!validExtensions.includes(fileExtension)) {
          throw new Error(
            "Поддерживаются только файлы Excel (.xlsx, .xls) и CSV"
          );
        }

        console.log("Импорт призов из файла:", this.selectedFile.name);

        const formData = new FormData();
        formData.append("file", this.selectedFile);

        await lotteryAPI.importPrizesExcel(formData);

        alert("Призы успешно импортированы!");

        this.$emit("imported");
        this.close();
      } catch (error) {
        console.error("Ошибка при импорте призов:", error);
        this.error = error.message || "Не удалось импортировать призы";
      } finally {
        this.isImporting = false;
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
