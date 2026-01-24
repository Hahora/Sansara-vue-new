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
          <h3 class="font-bold text-base">Редактировать промокод</h3>
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
          {{ promo.code }}
        </p>
      </div>

      <!-- Форма с прокруткой -->
      <div class="flex-1 overflow-y-auto p-4">
        <form @submit.prevent="updatePromo" class="space-y-3">
          <!-- Информация о промокоде -->
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs font-medium text-gray-900 mb-0.5">
              {{ promo.code }}
            </div>
            <div class="text-xs text-gray-600 space-y-0.5">
              <div>ID: {{ promo.id }}</div>
              <div>Использовано: {{ promo.current_uses || 0 }} раз</div>
              <div>Создан: {{ formatDate(promo.created_at) }}</div>
            </div>
          </div>

          <!-- Размер скидки -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Размер скидки (%)
            </label>
            <input
              v-model.number="formData.discount_percent"
              type="number"
              min="1"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            />
          </div>

          <!-- Максимальное количество использований -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Максимальное количество использований
            </label>
            <input
              v-model.number="formData.max_uses"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="0 - без ограничений"
            />
            <p class="text-xs text-gray-500 mt-1">
              Оставьте 0 для неограниченного количества использований
            </p>
          </div>

          <!-- Даты действия -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                Действует с
              </label>
              <input
                v-model="formData.valid_from"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                Действует до
              </label>
              <input
                v-model="formData.valid_until"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <!-- Переключатели -->
          <div class="space-y-2 pt-2">
            <div class="flex items-center">
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

            <div class="flex items-center">
              <input
                v-model="formData.for_first_visit_only"
                type="checkbox"
                id="for_first_visit_only"
                class="h-4 w-4 text-[#4e5d51] focus:ring-[#4e5d51] border-gray-300 rounded"
              />
              <label
                for="for_first_visit_only"
                class="ml-2 text-xs text-gray-700"
              >
                Только для первого визита
              </label>
            </div>
          </div>

          <!-- Типы программ -->
          <div class="pt-2 border-t border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-semibold text-gray-900">Типы программ</h3>
              <button
                type="button"
                @click="toggleAllProgramTypes"
                class="text-xs text-[#4e5d51] hover:text-[#3d4a40]"
              >
                {{ programTypesAll ? "Сбросить все" : "Выбрать все" }}
              </button>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="type in availableProgramTypes"
                :key="type.value"
                class="flex items-center"
              >
                <input
                  v-model="formData.program_types"
                  :value="type.value"
                  type="checkbox"
                  :id="'type_' + type.value"
                  class="h-4 w-4 text-[#4e5d51] focus:ring-[#4e5d51] border-gray-300 rounded"
                />
                <label
                  :for="'type_' + type.value"
                  class="ml-2 text-xs text-gray-700 truncate"
                >
                  {{ type.label }}
                </label>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Если не выбрано ни одного типа, промокод будет применяться ко всем
              программам
            </p>
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
            @click="updatePromo"
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
import { promoAPI } from "@/utils/api";

export default {
  name: "EditPromoModal",
  props: {
    promo: {
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
      availableProgramTypes: [
        { value: "COLLECTIVE", label: "Коллективные" },
        { value: "AUTHOR", label: "Авторские" },
        { value: "BACHELOR", label: "Мальчишник" },
        { value: "BACHELORETTE", label: "Девьчник" },
        { value: "BUSINESS_BATH", label: "Бизнес баня" },
        { value: "BATH_CLUB", label: "Банный клуб" },
      ],
      scrollY: 0,
    };
  },
  computed: {
    programTypesAll() {
      return (
        this.formData.program_types &&
        this.formData.program_types.length === this.availableProgramTypes.length
      );
    },
  },
  watch: {
    promo: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          // Если program_types равен null, преобразуем в пустой массив
          const programTypes =
            newVal.program_types === null ? [] : newVal.program_types || [];

          this.formData = {
            discount_percent: newVal.discount_percent,
            max_uses: newVal.max_uses || 0,
            valid_from: this.formatDateForInput(newVal.valid_from),
            valid_until: this.formatDateForInput(newVal.valid_until),
            is_active: newVal.is_active,
            for_first_visit_only: newVal.for_first_visit_only,
            program_types: programTypes,
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

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    formatDateForInput(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      } catch (e) {
        return "";
      }
    },

    toggleAllProgramTypes() {
      if (this.programTypesAll) {
        this.formData.program_types = [];
      } else {
        this.formData.program_types = this.availableProgramTypes.map(
          (t) => t.value
        );
      }
    },

    close() {
      this.$emit("close");
    },

    async updatePromo() {
      try {
        this.isUpdating = true;
        this.error = null;

        console.log("Обновление промокода:", this.formData);

        // Подготовка данных для отправки
        const dataToSend = {
          discount_percent: this.formData.discount_percent,
          max_uses: this.formData.max_uses > 0 ? this.formData.max_uses : null,
          valid_from: this.formData.valid_from || null,
          valid_until: this.formData.valid_until || null,
          is_active: this.formData.is_active,
          for_first_visit_only: this.formData.for_first_visit_only,
          // Если выбраны все типы или пустой список - отправляем null
          program_types:
            this.formData.program_types.length > 0
              ? this.formData.program_types
              : null,
        };

        console.log("Отправка данных:", dataToSend);

        const response = await promoAPI.update(this.promo.id, dataToSend);

        console.log("Промокод обновлен:", response);

        this.$emit("updated");
        this.close();
      } catch (error) {
        console.error("Ошибка при обновлении промокода:", error);
        this.error = error.message || "Не удалось обновить промокод";
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
</style>
