<template>
  <!-- Модальное окно подбора программы -->
  <transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed inset-0 bg-[#202c27]/90 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4"
      @click.self="closeModal"
    >
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
        enter-to-class="translate-y-0 sm:scale-100 sm:opacity-100"
        leave-active-class="transition-all duration-250 ease-in"
        leave-from-class="translate-y-0 sm:scale-100 sm:opacity-100"
        leave-to-class="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
      >
        <div
          class="bg-[#edeae6] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl"
        >
          <!-- Заголовок -->
          <div
            class="flex-shrink-0 bg-[#202c27] text-white px-5 py-4 rounded-t-2xl sm:rounded-t-2xl"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-xl flex items-center justify-center"
                >
                  <Wand2 class="h-5 w-5 text-white" />
                </div>
                <h3 class="font-light text-lg tracking-wide">
                  Подбор программы
                </h3>
              </div>
              <button
                @click="closeModal"
                class="text-white/80 hover:text-white ml-3 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Содержимое -->
          <div class="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin-modal">
            <!-- Шаг 1: Текущее состояние -->
            <div v-if="step === 1">
              <h4 class="font-semibold text-gray-900 mb-3 text-[15px]">
                Как вы себя чувствуете сейчас?
              </h4>
              <div class="space-y-2.5">
                <button
                  v-for="mood in currentMoodOptions"
                  :key="mood.value"
                  @click="selectCurrentMood(mood.value)"
                  class="w-full bg-[#e3ded3] hover:bg-[#d9cebc] border border-[#c2a886]/20 rounded-xl p-4 text-left transition-all duration-300 active:scale-[0.98]"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-2xl flex-shrink-0">{{ mood.emoji }}</span>
                    <div>
                      <div class="font-medium text-gray-900 text-sm">
                        {{ mood.label }}
                      </div>
                      <div class="text-xs text-gray-600">
                        {{ mood.description }}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Шаг 2: Желаемое состояние -->
            <div v-if="step === 2">
              <button
                @click="step = 1"
                class="flex items-center text-[#c2a886] hover:text-[#b5976e] mb-4 text-sm font-medium transition-colors"
              >
                <ChevronLeft class="h-4 w-4 mr-1" />
                Назад
              </button>

              <h4 class="font-semibold text-gray-900 mb-3 text-[15px]">
                Какое состояние вы хотите получить?
              </h4>
              <div class="space-y-2.5">
                <button
                  v-for="mood in desiredMoodOptions"
                  :key="mood.value"
                  @click="selectDesiredMood(mood.value)"
                  :disabled="isLoading"
                  class="w-full bg-[#e3ded3] hover:bg-[#d9cebc] border border-[#c2a886]/20 rounded-xl p-4 text-left transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-2xl flex-shrink-0">{{ mood.emoji }}</span>
                    <div>
                      <div class="font-medium text-gray-900 text-sm">
                        {{ mood.label }}
                      </div>
                      <div class="text-xs text-gray-600">
                        {{ mood.description }}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Шаг 3: Результат рекомендации -->
            <div v-if="step === 3 && recommendedProgram">
              <div class="text-center mb-4">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-3"
                >
                  <Wand2 class="h-8 w-8 text-[#c2a886]" />
                </div>
                <h4 class="font-semibold text-lg text-gray-900 mb-2">
                  Мы рекомендуем
                </h4>
                <p class="text-sm text-gray-600">{{ recommendation.reason }}</p>
              </div>

              <!-- Карточка рекомендованной программы -->
              <div
                class="bg-[#d9cebc]/60 backdrop-blur-sm rounded-xl border-2 border-[#c2a886]/50 p-4 mb-4"
              >
                <h3 class="font-semibold text-base text-gray-900 mb-2">
                  {{ recommendedProgram.name }}
                </h3>
                <p class="text-sm text-gray-600 mb-3">
                  {{ recommendedProgram.short_description }}
                </p>

                <!-- Краткая информация -->
                <div class="space-y-2">
                  <div
                    v-if="priceRange"
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="text-gray-600">Стоимость:</span>
                    <span class="font-semibold text-[#202c27]">{{
                      priceRange
                    }}</span>
                  </div>
                  <div
                    v-if="durationRange"
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="text-gray-600">Длительность:</span>
                    <span class="font-semibold text-gray-900">{{
                      durationRange
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Кнопки -->
              <div class="space-y-2.5">
                <button
                  @click="viewProgram"
                  class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center active:scale-[0.98]"
                >
                  <span class="text-[15px]">Подробнее о программе</span>
                  <ChevronRight class="h-5 w-5 ml-2" />
                </button>
                <button
                  @click="resetRecommendation"
                  class="w-full bg-[#d9cebc] hover:bg-[#c2a886]/30 text-gray-800 font-medium py-3.5 px-4 rounded-xl transition-all duration-300 active:scale-[0.98]"
                >
                  <span class="text-[15px]">Подобрать другую программу</span>
                </button>
              </div>
            </div>

            <!-- Индикатор загрузки -->
            <div
              v-if="isLoading"
              class="flex flex-col items-center justify-center py-8"
            >
              <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-3" />
              <p class="text-sm text-gray-600 font-light">
                Подбираем программу...
              </p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { programAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "RecommendationModal",
  components: {
    ...icons,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    branchId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      step: 1,
      selectedCurrentMood: null,
      selectedDesiredMood: null,
      isLoading: false,
      recommendation: null,
      recommendedProgram: null,
      currentMoodOptions: [
        {
          value: "stress",
          label: "В стрессе",
          description: "Напряжение и усталость",
          emoji: "😰",
        },
        {
          value: "tired",
          label: "Уставший",
          description: "Нужен отдых и восстановление",
          emoji: "😴",
        },
        {
          value: "curious",
          label: "Любопытный",
          description: "Хочу попробовать что-то новое",
          emoji: "🤔",
        },
        {
          value: "relax",
          label: "Спокойный",
          description: "Всё хорошо, хочу поддержать состояние",
          emoji: "😌",
        },
        {
          value: "reboot",
          label: "Нужна перезагрузка",
          description: "Хочу обновиться",
          emoji: "🔄",
        },
      ],
      desiredMoodOptions: [
        {
          value: "deep_relax",
          label: "Глубокое расслабление",
          description: "Полный покой и отдых",
          emoji: "🧘",
        },
        {
          value: "energy",
          label: "Энергия",
          description: "Прилив сил и бодрости",
          emoji: "⚡",
        },
        {
          value: "experience",
          label: "Новый опыт",
          description: "Яркие ощущения",
          emoji: "✨",
        },
        {
          value: "body",
          label: "Работа с телом",
          description: "Телесные практики",
          emoji: "💆",
        },
        {
          value: "clarity",
          label: "Ясность",
          description: "Чистота мыслей и состояния",
          emoji: "🌟",
        },
      ],
    };
  },
  computed: {
    priceRange() {
      if (!this.recommendedProgram) return null;
      return this.getPriceRange(this.recommendedProgram);
    },
    durationRange() {
      if (!this.recommendedProgram) return null;
      return this.getDurationRange(this.recommendedProgram);
    },
  },
  methods: {
    lockBodyScroll() {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY;

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    },

    unlockBodyScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      const scrollY = document.body.dataset.scrollY;
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
        delete document.body.dataset.scrollY;
      }
    },

    closeModal() {
      this.$emit("update:visible", false);
      this.$emit("close");
      this.unlockBodyScroll();

      setTimeout(() => {
        this.resetForm();
      }, 300);
    },

    resetForm() {
      this.step = 1;
      this.selectedCurrentMood = null;
      this.selectedDesiredMood = null;
      this.recommendation = null;
      this.recommendedProgram = null;
      this.isLoading = false;
    },

    selectCurrentMood(mood) {
      this.selectedCurrentMood = mood;
      this.step = 2;
    },

    async selectDesiredMood(mood) {
      this.selectedDesiredMood = mood;
      await this.getRecommendation();
    },

    async getRecommendation() {
      try {
        this.isLoading = true;

        if (!this.branchId) {
          throw new Error("Филиал не выбран");
        }

        console.log("Запрос рекомендации:", {
          current_mood: this.selectedCurrentMood,
          desired_mood: this.selectedDesiredMood,
        });

        const data = await programAPI.getAuthorRecommendation(
          this.branchId,
          this.selectedCurrentMood,
          this.selectedDesiredMood
        );

        if (data && data.recommendation && data.program) {
          this.recommendation = data.recommendation;
          this.recommendedProgram = data.program;
          this.step = 3;
          console.log("Получена рекомендация:", data);
        } else {
          throw new Error("Не удалось получить рекомендацию");
        }
      } catch (error) {
        console.error("Ошибка при получении рекомендации:", error);
        alert("Не удалось подобрать программу. Попробуйте еще раз.");
        this.step = 1;
      } finally {
        this.isLoading = false;
      }
    },

    resetRecommendation() {
      this.step = 1;
      this.selectedCurrentMood = null;
      this.selectedDesiredMood = null;
      this.recommendation = null;
      this.recommendedProgram = null;
    },

    viewProgram() {
      if (this.recommendedProgram) {
        this.$emit("view-program", this.recommendedProgram.id);
        this.closeModal();
      }
    },

    formatPrice(price) {
      if (!price && price !== 0) return "";
      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;
      return priceNumber.toLocaleString("ru-RU") + " ₽";
    },

    getPriceRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        return null;
      }

      const activeTiers = program.pricing_tiers.filter(
        (t) => t.is_active !== false
      );
      if (activeTiers.length === 0) return null;

      const prices = activeTiers.map((tier) => tier.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return this.formatPrice(minPrice);
      } else {
        return `${this.formatPrice(minPrice)} - ${this.formatPrice(maxPrice)}`;
      }
    },

    getDurationRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        return null;
      }

      const activeTiers = program.pricing_tiers.filter(
        (t) => t.is_active !== false
      );
      if (activeTiers.length === 0) return null;

      const durations = activeTiers.map((tier) => tier.duration_minutes);
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);

      if (minDuration === maxDuration) {
        return this.formatDuration(minDuration);
      } else {
        return `${this.formatDuration(minDuration)} - ${this.formatDuration(maxDuration)}`;
      }
    },

    formatDuration(minutes) {
      if (!minutes) return "";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      if (hours > 0 && mins > 0) {
        return `${hours} ч ${mins} мин`;
      } else if (hours > 0) {
        return `${hours} ч`;
      } else {
        return `${mins} мин`;
      }
    },
  },

  watch: {
    visible(newVal) {
      console.log("RecommendationModal watch visible:", newVal);
      if (newVal) {
        this.lockBodyScroll();
        this.$nextTick(() => {
          this.resetForm();
        });
      } else {
        this.unlockBodyScroll();
      }
    },
  },

  mounted() {
    if (this.visible) {
      this.lockBodyScroll();
    }

    const handleEscape = (e) => {
      if (e.key === "Escape" && this.visible) {
        this.closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    this.handleEscapeKey = handleEscape;
  },

  beforeUnmount() {
    if (this.handleEscapeKey) {
      document.removeEventListener("keydown", this.handleEscapeKey);
    }
    this.unlockBodyScroll();
  },

  unmounted() {
    this.unlockBodyScroll();
  },
};
</script>

<style scoped>
/* Скролл для модалки */
.scrollbar-thin-modal::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin-modal::-webkit-scrollbar-track {
  background: rgba(194, 168, 134, 0.1);
  border-radius: 10px;
}

.scrollbar-thin-modal::-webkit-scrollbar-thumb {
  background: rgba(194, 168, 134, 0.5);
  border-radius: 10px;
}

.scrollbar-thin-modal::-webkit-scrollbar-thumb:hover {
  background: rgba(194, 168, 134, 0.7);
}

.scrollbar-thin-modal {
  scrollbar-width: thin;
  scrollbar-color: rgba(194, 168, 134, 0.5) rgba(194, 168, 134, 0.1);
}
</style>
