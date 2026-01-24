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
          <h3 class="font-bold text-base">Создать рекомендацию</h3>
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
        <form @submit.prevent="createRecommendation" class="space-y-3">
          <!-- Филиал -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Филиал <span class="text-red-500">*</span>
            </label>
            <select
              v-model.number="formData.branch_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option :value="null" disabled selected>Выберите филиал</option>
              <option
                v-for="branch in branches"
                :key="branch.id"
                :value="branch.id"
              >
                {{ branch.name }}
              </option>
            </select>
          </div>

          <!-- Настроение -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Текущее настроение <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.mood"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option value="" disabled selected>Выберите настроение</option>
              <option
                v-for="mood in moods"
                :key="mood.value"
                :value="mood.value"
              >
                {{ mood.label }}
              </option>
            </select>
          </div>

          <!-- Цель -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Цель (желаемое состояние) <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.goal"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option value="" disabled selected>Выберите цель</option>
              <option
                v-for="goal in goals"
                :key="goal.value"
                :value="goal.value"
              >
                {{ goal.label }}
              </option>
            </select>
          </div>

          <!-- ID программы -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              ID программы <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.program_id"
              required
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Введите ID программы"
            />
            <p class="text-xs text-gray-500 mt-1">
              Числовой идентификатор программы из базы данных
            </p>
          </div>

          <!-- Причина рекомендации -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Причина рекомендации <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.program_reason"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none resize-none"
              placeholder="Объясните, почему эта программа подходит для данного настроения и цели..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Объяснение почему именно эта программа рекомендована
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
            @click="createRecommendation"
            :disabled="
              isCreating ||
              !formData.branch_id ||
              !formData.mood ||
              !formData.goal ||
              !formData.program_id ||
              !formData.program_reason
            "
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
import { recommendationAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "CreateRecommendationModal",
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
        branch_id: null,
        mood: "",
        goal: "",
        program_id: null,
        program_reason: "",
      },
      scrollY: 0,

      // Списки настроений и целей
      moods: [
        { value: "curious", label: "Любознательное" },
        { value: "reboot", label: "Перезагрузка" },
        { value: "relax", label: "Расслабленное" },
        { value: "stress", label: "Стрессовое" },
        { value: "tired", label: "Уставшее" },
        { value: "energetic", label: "Энергичное" },
        { value: "neutral", label: "Нейтральное" },
        { value: "sad", label: "Грустное" },
        { value: "happy", label: "Счастливое" },
        { value: "anxious", label: "Тревожное" },
        { value: "bored", label: "Скучающее" },
        { value: "confused", label: "Растерянное" },
        { value: "motivated", label: "Мотивированное" },
        { value: "overwhelmed", label: "Перегруженное" },
        { value: "angry", label: "Злое" },
      ],

      goals: [
        { value: "experience", label: "Получить опыт" },
        { value: "clarity", label: "Обрести ясность" },
        { value: "body", label: "Оздоровление тела" },
        { value: "deep_relax", label: "Глубокое расслабление" },
        { value: "energy", label: "Энергия" },
        { value: "focus", label: "Сконцентрироваться" },
        { value: "sleep", label: "Улучшить сон" },
        { value: "detox", label: "Детокс" },
        { value: "rejuvenate", label: "Омоложение" },
        { value: "muscle_relax", label: "Расслабить мышцы" },
        { value: "improve_mood", label: "Улучшить настроение" },
        { value: "reduce_stress", label: "Снизить стресс" },
        { value: "clear_mind", label: "Очистить разум" },
        { value: "relax_muscles", label: "Расслабить мышцы" },
        { value: "energize", label: "Зарядиться энергией" },
        { value: "relax", label: "Расслабиться" },
      ],
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),
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

    async createRecommendation() {
      try {
        this.isCreating = true;
        this.error = null;

        console.log("Создание рекомендации:", this.formData);

        // Проверка обязательных полей
        const requiredFields = [
          { field: "branch_id", name: "Филиал" },
          { field: "mood", name: "Настроение" },
          { field: "goal", name: "Цель" },
          { field: "program_id", name: "ID программы" },
          { field: "program_reason", name: "Причина рекомендации" },
        ];

        for (const { field, name } of requiredFields) {
          if (this.formData[field] === null || this.formData[field] === "") {
            throw new Error(`${name} - обязательное поле`);
          }
        }

        // Подготовка данных для отправки
        const dataToSend = {
          branch_id: this.formData.branch_id, // ✅ Добавляем branch_id
          mood: this.formData.mood,
          goal: this.formData.goal,
          program_id: this.formData.program_id,
          program_reason: this.formData.program_reason,
        };

        console.log("Отправка данных:", dataToSend);

        const response = await recommendationAPI.create(dataToSend);

        console.log("Рекомендация создана:", response);

        // Сброс формы
        this.resetForm();

        this.$emit("created", response);
        this.close();
      } catch (error) {
        console.error("Ошибка при создании рекомендации:", error);
        this.error = error.message || "Не удалось создать рекомендацию";
      } finally {
        this.isCreating = false;
      }
    },

    resetForm() {
      this.formData = {
        branch_id: null,
        mood: "",
        goal: "",
        program_id: null,
        program_reason: "",
      };
    },
  },
  beforeDestroy() {
    this.unlockBodyScroll();
  },
};
</script>
