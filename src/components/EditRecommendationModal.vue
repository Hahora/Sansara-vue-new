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
          <div>
            <h3 class="font-bold text-base">Редактировать рекомендацию</h3>
            <p class="text-xs text-white text-opacity-90 mt-1">
              ID: {{ recommendation.id }}
            </p>
          </div>
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
        <form @submit.prevent="updateRecommendation" class="space-y-3">
          <!-- Информация о рекомендации -->
          <div class="bg-gray-50 rounded-lg p-3 mb-2">
            <div class="text-xs font-medium text-gray-900 mb-1">
              {{ getMoodLabel(recommendation.mood) }} →
              {{ getGoalLabel(recommendation.goal) }}
            </div>
            <div class="text-xs text-gray-600 space-y-0.5">
              <div>
                Программа:
                {{
                  recommendation.program_name ||
                  `ID: ${recommendation.program_id}`
                }}
              </div>
              <div>Филиал: {{ getBranchName(recommendation.branch_id) }}</div>
              <div>Создан: {{ formatDate(recommendation.created_at) }}</div>
              <div>Обновлён: {{ formatDate(recommendation.updated_at) }}</div>
            </div>
          </div>

          <!-- Филиал -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Филиал
            </label>
            <select
              v-model.number="formData.branch_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option :value="null" disabled>Выберите филиал</option>
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
              Текущее настроение
            </label>
            <select
              v-model="formData.mood"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option value="" disabled>Выберите настроение</option>
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
              Цель (желаемое состояние)
            </label>
            <select
              v-model="formData.goal"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none bg-white"
            >
              <option value="" disabled>Выберите цель</option>
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
              ID программы
            </label>
            <input
              v-model.number="formData.program_id"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Введите ID программы"
            />
          </div>

          <!-- Причина рекомендации -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Причина рекомендации
            </label>
            <textarea
              v-model="formData.program_reason"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none resize-none"
              placeholder="Объясните, почему эта программа подходит для данного настроения и цели..."
            ></textarea>
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
            @click="updateRecommendation"
            :disabled="
              isUpdating ||
              !formData.branch_id ||
              !formData.mood ||
              !formData.goal ||
              !formData.program_id ||
              !formData.program_reason
            "
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
import { recommendationAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "EditRecommendationModal",
  props: {
    recommendation: {
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
      formData: {
        branch_id: null,
        mood: "",
        goal: "",
        program_id: null,
        program_reason: "",
      },
      scrollY: 0,

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
    recommendation: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = {
            branch_id: newVal.branch_id || null,
            mood: newVal.mood || "",
            goal: newVal.goal || "",
            program_id: newVal.program_id || null,
            program_reason: newVal.program_reason || "",
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

    getBranchName(branchId) {
      if (!branchId || !this.branches) return "";
      const branch = this.branches.find((b) => b.id === branchId);
      return branch ? branch.name : "";
    },

    getMoodLabel(mood) {
      const moodObj = this.moods.find((m) => m.value === mood);
      return moodObj ? moodObj.label : this.formatMoodLabel(mood);
    },

    getGoalLabel(goal) {
      const goalObj = this.goals.find((g) => g.value === goal);
      return goalObj ? goalObj.label : this.formatGoalLabel(goal);
    },

    formatMoodLabel(mood) {
      const moodTranslations = {
        curious: "Любознательное",
        reboot: "Перезагрузка",
        relax: "Расслабленное",
        stress: "Стрессовое",
        tired: "Уставшее",
        energetic: "Энергичное",
        neutral: "Нейтральное",
        sad: "Грустное",
        happy: "Счастливое",
        anxious: "Тревожное",
        bored: "Скучающее",
        confused: "Растерянное",
        motivated: "Мотивированное",
        overwhelmed: "Перегруженное",
        angry: "Злое",
      };

      return (
        moodTranslations[mood] || mood.charAt(0).toUpperCase() + mood.slice(1)
      );
    },

    formatGoalLabel(goal) {
      const goalTranslations = {
        experience: "Получить опыт",
        clarity: "Обрести ясность",
        body: "Оздоровление тела",
        deep_relax: "Глубокое расслабление",
        energy: "Энергия",
        focus: "Сконцентрироваться",
        sleep: "Улучшить сон",
        detox: "Детокс",
        rejuvenate: "Омоложение",
        muscle_relax: "Расслабить мышцы",
        improve_mood: "Улучшить настроение",
        reduce_stress: "Снизить стресс",
        clear_mind: "Очистить разум",
        relax_muscles: "Расслабить мышцы",
        energize: "Зарядиться энергией",
        relax: "Расслабиться",
      };

      return (
        goalTranslations[goal] ||
        goal
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );
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

    async updateRecommendation() {
      try {
        this.isUpdating = true;
        this.error = null;

        console.log("Обновление рекомендации:", this.formData);

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

        const response = await recommendationAPI.update(
          this.recommendation.id,
          dataToSend
        );

        console.log("Рекомендация обновлена:", response);

        this.$emit("updated", response);
        this.close();
      } catch (error) {
        console.error("Ошибка при обновлении рекомендации:", error);
        this.error = error.message || "Не удалось обновить рекомендацию";
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
