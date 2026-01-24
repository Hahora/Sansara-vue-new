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
          <h2 class="font-bold text-base">Создать программу</h2>
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
      </div>

      <!-- Форма -->
      <form @submit.prevent="createProgram" class="p-3 space-y-2">
        <!-- Название -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Название <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            placeholder="Название программы"
          />
        </div>

        <!-- Краткое описание -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Краткое описание
          </label>
          <input
            v-model="formData.short_description"
            type="text"
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            placeholder="Краткое описание"
          />
        </div>

        <!-- Описание -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Описание <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.description"
            required
            rows="3"
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none resize-none"
            placeholder="Полное описание программы"
          ></textarea>
        </div>

        <!-- Тип программы -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Тип программы <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.program_type"
            required
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          >
            <option value="">Выберите тип</option>
            <option value="COLLECTIVE">Коллективная</option>
            <option value="AUTHOR">Авторская</option>
          </select>
        </div>

        <!-- Филиал -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Филиал <span class="text-red-500">*</span>
          </label>
          <select
            v-model.number="formData.branch_id"
            required
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          >
            <option :value="null">Выберите филиал</option>
            <option
              v-for="branch in branches"
              :key="branch.id"
              :value="branch.id"
            >
              {{ branch.name }}
            </option>
          </select>
        </div>

        <!-- Макс. участников -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Макс. участников
          </label>
          <input
            v-model.number="formData.max_participants"
            type="number"
            min="1"
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            placeholder="10"
          />
        </div>

        <!-- Управление ценами -->
        <div class="pt-1.5 border-t border-gray-200">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-xs font-semibold text-gray-900">Цены</h3>
            <button
              @click="addPricingTier"
              type="button"
              class="text-[#4e5d51] hover:text-[#3d4a40] text-xs font-medium"
            >
              + Добавить
            </button>
          </div>

          <!-- Список тиров -->
          <div v-if="pricingTiers.length > 0" class="space-y-1">
            <div
              v-for="(tier, index) in pricingTiers"
              :key="index"
              class="bg-gray-50 rounded p-1.5 space-y-1"
            >
              <!-- Гости -->
              <div class="grid grid-cols-2 gap-1">
                <div>
                  <label class="block text-xs text-gray-600 mb-0.5">От</label>
                  <input
                    v-model.number="tier.min_guests"
                    type="number"
                    min="1"
                    class="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4e5d51] outline-none"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-0.5">До</label>
                  <input
                    v-model.number="tier.max_guests"
                    type="number"
                    min="1"
                    class="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4e5d51] outline-none"
                  />
                </div>
              </div>

              <!-- Цена и тип -->
              <div class="grid grid-cols-2 gap-1">
                <div>
                  <label class="block text-xs text-gray-600 mb-0.5">Цена</label>
                  <input
                    v-model.number="tier.price"
                    type="number"
                    min="0"
                    class="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4e5d51] outline-none"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-0.5">Тип</label>
                  <select
                    v-model="tier.price_type"
                    class="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4e5d51] outline-none"
                  >
                    <option value="total">Всего</option>
                    <option value="per_guest">За чел</option>
                  </select>
                </div>
              </div>

              <!-- Длительность и удаление -->
              <div class="grid grid-cols-2 gap-1">
                <div>
                  <label class="block text-xs text-gray-600 mb-0.5">Мин</label>
                  <input
                    v-model.number="tier.duration_minutes"
                    type="number"
                    min="0"
                    class="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4e5d51] outline-none"
                  />
                </div>
                <div class="flex items-end">
                  <button
                    @click="removePricingTier(index)"
                    type="button"
                    class="w-full bg-red-50 hover:bg-red-100 text-red-600 py-1 rounded text-xs font-medium"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Если нет тиров -->
          <div
            v-else
            class="text-xs text-gray-500 text-center py-1.5 bg-gray-50 rounded"
          >
            Нет цен
          </div>
        </div>

        <!-- Активна -->
        <div class="flex items-center pt-1">
          <input
            v-model="formData.is_active"
            type="checkbox"
            id="is_active"
            class="w-4 h-4 text-[#4e5d51] border-gray-300 rounded focus:ring-[#4e5d51]"
          />
          <label for="is_active" class="ml-2 text-xs text-gray-700">
            Программа активна
          </label>
        </div>

        <!-- Ошибка -->
        <div
          v-if="error"
          class="bg-red-50 border-l-4 border-red-500 rounded-r p-2"
        >
          <p class="text-xs text-red-800">{{ error }}</p>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-2 pt-0.5">
          <button
            @click="$emit('close')"
            type="button"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-2 rounded-lg text-xs transition-all active:scale-98"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-1.5 px-2 rounded-lg text-xs transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isSaving">Создать</span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin h-3 w-3 mr-1"
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
      </form>
    </div>
  </div>
</template>

<script>
import { programAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "CreateProgramModal",
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isSaving: false,
      error: null,
      formData: {
        name: "",
        description: "",
        short_description: "",
        program_type: "",
        branch_id: null,
        max_participants: 10,
        is_active: true,
      },
      pricingTiers: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),
  },
  methods: {
    lockBodyScroll() {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Сохраняем позицию скролла в data атрибуте
      document.body.dataset.scrollY = scrollY;

      // Добавляем padding-right для компенсации скроллбара
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    },

    unlockBodyScroll() {
      // Восстанавливаем стили
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Восстанавливаем позицию скролла
      const scrollY = document.body.dataset.scrollY;
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
        delete document.body.dataset.scrollY;
      }
    },

    addPricingTier() {
      this.pricingTiers.push({
        min_guests: 1,
        max_guests: 1,
        price: 0,
        duration_minutes: 120,
        price_type:
          this.formData.program_type === "COLLECTIVE" ? "per_guest" : "total",
        is_active: true,
      });
    },

    removePricingTier(index) {
      this.pricingTiers.splice(index, 1);
    },

    async createProgram() {
      try {
        this.isSaving = true;
        this.error = null;

        console.log("Создание программы:", this.formData);

        // Подготавливаем данные
        const createData = { ...this.formData };

        // Преобразуем пустые строки в null
        Object.keys(createData).forEach((key) => {
          if (createData[key] === "") {
            createData[key] = null;
          }
        });

        // Если филиал не выбран, используем первый доступный
        if (
          !createData.branch_id &&
          this.branches &&
          this.branches.length > 0
        ) {
          createData.branch_id = this.branches[0].id;
        }

        // Добавляем pricing_tiers
        createData.pricing_tiers = this.pricingTiers.map((tier) => ({
          min_guests: tier.min_guests,
          max_guests: tier.max_guests,
          price: tier.price,
          duration_minutes: tier.duration_minutes,
          price_type: tier.price_type,
          is_active: tier.is_active !== false,
        }));

        const newProgram = await programAPI.adminCreate(createData);

        console.log("Программа создана:", newProgram);

        this.$emit("created", newProgram);
        this.$emit("close");
      } catch (error) {
        console.error("Ошибка при создании:", error);
        this.error = error.message || "Не удалось создать программу";
      } finally {
        this.isSaving = false;
      }
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

  mounted() {
    // Блокируем прокрутку при монтировании
    if (this.isOpen) {
      this.lockBodyScroll();
    }

    // Добавляем обработчик клавиши Escape
    const handleEscape = (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.$emit("close");
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Сохраняем ссылку на обработчик для удаления
    this.handleEscapeKey = handleEscape;
  },

  beforeUnmount() {
    // Удаляем обработчик клавиши Escape
    if (this.handleEscapeKey) {
      document.removeEventListener("keydown", this.handleEscapeKey);
    }

    // Убедимся, что разблокируем прокрутку при уничтожении компонента
    this.unlockBodyScroll();
  },

  unmounted() {
    // Убедимся, что разблокируем прокрутку при уничтожении компонента
    this.unlockBodyScroll();
  },
};
</script>
<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
