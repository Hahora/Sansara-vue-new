<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
    <!-- Шапка -->
    <div
      class="bg-gradient-to-br from-[#4e5d51] via-[#5a6d5e] to-[#4e5d51] text-white px-5 py-6"
    >
      <div class="flex items-center mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white hover:text-gray-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">Назад</span>
        </button>
      </div>

      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white border-opacity-30"
        >
          ✨
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">Авторские программы</h1>
          <p class="text-white text-opacity-90 text-sm mt-1">
            Уникальные техники, глубокие состояния, работа с телом и энергией
          </p>
        </div>
      </div>
    </div>

    <!-- Переключатель вкладок -->
    <div class="px-4 py-3 border-b border-gray-200 bg-white">
      <div class="flex rounded-lg bg-gray-100 p-1">
        <button
          @click="activeTab = 'info'"
          :class="[
            'flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'info'
              ? 'bg-white shadow-sm text-[#4e5d51]'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          📋 Основная информация
        </button>
        <button
          @click="activeTab = 'gallery'"
          :class="[
            'flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'gallery'
              ? 'bg-white shadow-sm text-[#4e5d51]'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          📸 Галерея
        </button>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="relative">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
        ></div>
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-[#4e5d51] border-t-transparent absolute top-0 left-0"
        ></div>
      </div>
    </div>

    <!-- Ошибка -->
    <div
      v-else-if="error"
      class="mx-4 mt-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm"
    >
      <div class="flex items-start">
        <svg
          class="h-5 w-5 text-red-500 mt-0.5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Контент: Основная информация -->
    <div v-else-if="activeTab === 'info'" class="px-4 py-5">
      <!-- Описание раздела с кнопками -->
      <div
        v-if="pageContent"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
      >
        <h3 class="font-semibold text-gray-900 mb-3">
          Об авторских программах
        </h3>
        <div
          class="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4"
        >
          {{ pageContent }}
        </div>

        <!-- Кнопки -->
        <div class="space-y-2">
          <!-- Подобрать программу -->
          <button
            @click="openRecommendationModal"
            class="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm active:scale-98"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clip-rule="evenodd"
              />
            </svg>
            Подобрать программу для меня
          </button>

          <!-- Посмотреть все -->
          <button
            @click="scrollToPrograms"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center active:scale-98"
          >
            <span>Посмотреть все программы</span>
            <svg class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Если программ нет -->
      <div
        v-if="!authorPrograms || authorPrograms.length === 0"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
      >
        <div class="text-4xl mb-4">✨</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Авторские программы
        </h3>
        <p class="text-gray-600">
          Скоро здесь появится информация об авторских программах
        </p>
      </div>

      <!-- Список программ -->
      <div v-else ref="programsList" class="space-y-3">
        <!-- Карточка программы -->
        <router-link
          v-for="program in authorPrograms"
          :key="program.id"
          :to="{
            name: 'AuthorProgramDetail',
            params: { id: program.id },
          }"
          class="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 active:scale-98"
        >
          <!-- Заголовок программы -->
          <div class="px-4 py-4 bg-gradient-to-r from-amber-50 to-orange-50">
            <div class="flex items-start justify-between">
              <div class="flex items-start flex-1 min-w-0">
                <span class="text-2xl mr-3 flex-shrink-0">✨</span>
                <div class="flex-1 min-w-0">
                  <h2
                    class="font-bold text-gray-900 text-base leading-tight mb-1"
                  >
                    {{ program.name }}
                  </h2>
                  <p
                    v-if="program.short_description"
                    class="text-sm text-gray-600 line-clamp-2"
                  >
                    {{ program.short_description }}
                  </p>
                </div>
              </div>
              <svg
                class="w-5 h-5 text-gray-400 flex-shrink-0 ml-2 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <!-- Краткая информация -->
          <div class="px-4 py-3 space-y-2">
            <!-- Цена и длительность -->
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <!-- Цена -->
              <div
                v-if="getPriceRange(program)"
                class="bg-green-50 text-green-800 px-3 py-1.5 rounded-lg border border-green-200 text-sm font-semibold"
              >
                {{ getPriceRange(program) }}
              </div>

              <!-- Длительность -->
              <div
                v-if="getDurationRange(program)"
                class="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 text-sm flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ getDurationRange(program) }}
              </div>
            </div>

            <!-- Количество участников -->
            <div
              v-if="getGuestsRange(program)"
              class="text-xs text-gray-500 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                />
              </svg>
              {{ getGuestsRange(program) }}
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Контент: Фотогалерея -->
    <div v-else-if="activeTab === 'gallery'">
      <MediaGallery
        :sections="gallerySections"
        :show-media-type-filter="true"
        :category-labels="categoryLabels"
      />
    </div>

    <!-- Модальное окно подбора программы -->
    <div
      v-if="showRecommendationModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeRecommendationModal"
    >
      <div
        class="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <!-- Заголовок -->
        <div
          class="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-4 rounded-t-xl z-10"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg">Подбор программы</h3>
            <button
              @click="closeRecommendationModal"
              class="text-white hover:text-gray-200"
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

        <!-- Содержимое -->
        <div class="p-5 max-h-[60vh] overflow-y-auto">
          <!-- Шаг 1: Текущее состояние -->
          <div v-if="recommendationStep === 1">
            <h4 class="font-semibold text-gray-900 mb-3">
              Как вы себя чувствуете сейчас?
            </h4>
            <div class="space-y-2">
              <button
                v-for="mood in currentMoodOptions"
                :key="mood.value"
                @click="selectCurrentMood(mood.value)"
                class="w-full bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl p-4 text-left transition-all duration-200 active:scale-98"
              >
                <div class="flex items-center">
                  <span class="text-2xl mr-3">{{ mood.emoji }}</span>
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ mood.label }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ mood.description }}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Шаг 2: Желаемое состояние -->
          <div v-if="recommendationStep === 2">
            <button
              @click="recommendationStep = 1"
              class="flex items-center text-gray-600 hover:text-gray-800 mb-4 text-sm"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Назад
            </button>

            <h4 class="font-semibold text-gray-900 mb-3">
              Какое состояние вы хотите получить?
            </h4>
            <div class="space-y-2">
              <button
                v-for="mood in desiredMoodOptions"
                :key="mood.value"
                @click="selectDesiredMood(mood.value)"
                :disabled="isLoadingRecommendation"
                class="w-full bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl p-4 text-left transition-all duration-200 active:scale-98 disabled:opacity-50"
              >
                <div class="flex items-center">
                  <span class="text-2xl mr-3">{{ mood.emoji }}</span>
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ mood.label }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ mood.description }}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Шаг 3: Результат рекомендации -->
          <div v-if="recommendationStep === 3 && recommendedProgram">
            <div class="text-center mb-4">
              <div class="text-4xl mb-3">✨</div>
              <h4 class="font-bold text-xl text-gray-900 mb-2">
                Мы рекомендуем
              </h4>
              <p class="text-sm text-gray-600">{{ recommendation.reason }}</p>
            </div>

            <!-- Карточка рекомендованной программы -->
            <div
              class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4 mb-4"
            >
              <h3 class="font-bold text-lg text-gray-900 mb-2">
                {{ recommendedProgram.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-3">
                {{ recommendedProgram.short_description }}
              </p>

              <!-- Краткая информация -->
              <div class="space-y-2">
                <div
                  v-if="getPriceRange(recommendedProgram)"
                  class="flex items-center justify-between text-sm"
                >
                  <span class="text-gray-600">Стоимость:</span>
                  <span class="font-semibold text-green-700">{{
                    getPriceRange(recommendedProgram)
                  }}</span>
                </div>
                <div
                  v-if="getDurationRange(recommendedProgram)"
                  class="flex items-center justify-between text-sm"
                >
                  <span class="text-gray-600">Длительность:</span>
                  <span class="font-semibold text-gray-900">{{
                    getDurationRange(recommendedProgram)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Кнопки -->
            <div class="space-y-2">
              <router-link
                :to="{
                  name: 'AuthorProgramDetail',
                  params: { id: recommendedProgram.id },
                }"
                @click="closeRecommendationModal"
                class="block w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center active:scale-98"
              >
                Подробнее о программе
              </router-link>
              <button
                @click="resetRecommendation"
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-98"
              >
                Подобрать другую программу
              </button>
            </div>
          </div>

          <!-- Индикатор загрузки -->
          <div v-if="isLoadingRecommendation" class="flex justify-center py-8">
            <div class="relative">
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
              ></div>
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent absolute top-0 left-0"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { programAPI } from "@/utils/api";
import MediaGallery from "@/components/MediaGallery.vue";

export default {
  name: "AuthorProgramsPage",
  components: {
    MediaGallery,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      authorPrograms: [],
      pageContent: null,
      showRecommendationModal: false,
      recommendationStep: 1,
      selectedCurrentMood: null,
      selectedDesiredMood: null,
      isLoadingRecommendation: false,
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
      activeTab: "info", // 'info' или 'gallery'
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData"]),

    gallerySections() {
      return ["AUTHOR"];
    },

    categoryLabels() {
      return {
        AUTHOR: "Авторские программы",
      };
    },
  },
  methods: {
    ...mapActions(useAppStore, ["loadSiteContent"]),

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

    getGuestsRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        if (program.max_participants) {
          return `До ${program.max_participants} гостей`;
        }
        return null;
      }

      const activeTiers = program.pricing_tiers.filter(
        (t) => t.is_active !== false
      );
      if (activeTiers.length === 0) return null;

      const minGuests = Math.min(...activeTiers.map((tier) => tier.min_guests));
      const maxGuests = Math.max(...activeTiers.map((tier) => tier.max_guests));

      if (minGuests === maxGuests) {
        return `${minGuests} ${minGuests === 1 ? "гость" : minGuests <= 4 ? "гостя" : "гостей"}`;
      } else {
        return `${minGuests}-${maxGuests} гостей`;
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

    async loadPageContent() {
      try {
        await this.loadSiteContent("AUTHOR");
        const content = this.contentData?.["AUTHOR"];
        if (content && content.content) {
          this.pageContent = content.content;
        }
      } catch (error) {
        console.error("Ошибка при загрузке контента страницы:", error);
      }
    },

    async loadAuthorPrograms() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log(
          "Загрузка авторских программ для филиала:",
          this.selectedBranch?.id
        );

        const branchId = this.selectedBranch?.id;
        if (!branchId) {
          throw new Error("Филиал не выбран");
        }

        const data = await programAPI.getAuthor(branchId);

        if (data && Array.isArray(data.programs)) {
          this.authorPrograms = data.programs.filter(
            (program) => program.is_active !== false
          );
          console.log(
            "Загружено авторских программ:",
            this.authorPrograms.length
          );
        } else {
          this.authorPrograms = [];
          console.log("Авторские программы не найдены");
        }
      } catch (error) {
        console.error("Ошибка при загрузке авторских программ:", error);
        this.error =
          error.message ||
          "Не удалось загрузить информацию об авторских программах";
        this.authorPrograms = [];
      } finally {
        this.isLoading = false;
      }
    },

    // Методы для модального окна рекомендаций
    openRecommendationModal() {
      this.showRecommendationModal = true;
      this.recommendationStep = 1;
      this.selectedCurrentMood = null;
      this.selectedDesiredMood = null;
      this.recommendation = null;
      this.recommendedProgram = null;
    },

    closeRecommendationModal() {
      this.showRecommendationModal = false;
    },

    selectCurrentMood(mood) {
      this.selectedCurrentMood = mood;
      this.recommendationStep = 2;
    },

    async selectDesiredMood(mood) {
      this.selectedDesiredMood = mood;
      await this.getRecommendation();
    },

    async getRecommendation() {
      try {
        this.isLoadingRecommendation = true;

        const branchId = this.selectedBranch?.id;
        if (!branchId) {
          throw new Error("Филиал не выбран");
        }

        console.log("Запрос рекомендации:", {
          current_mood: this.selectedCurrentMood,
          desired_mood: this.selectedDesiredMood,
        });

        const data = await programAPI.getAuthorRecommendation(
          branchId,
          this.selectedCurrentMood,
          this.selectedDesiredMood
        );

        if (data && data.recommendation && data.program) {
          this.recommendation = data.recommendation;
          this.recommendedProgram = data.program;
          this.recommendationStep = 3;
          console.log("Получена рекомендация:", data);
        } else {
          throw new Error("Не удалось получить рекомендацию");
        }
      } catch (error) {
        console.error("Ошибка при получении рекомендации:", error);
        alert("Не удалось подобрать программу. Попробуйте еще раз.");
        this.recommendationStep = 1;
      } finally {
        this.isLoadingRecommendation = false;
      }
    },

    resetRecommendation() {
      this.recommendationStep = 1;
      this.selectedCurrentMood = null;
      this.selectedDesiredMood = null;
      this.recommendation = null;
      this.recommendedProgram = null;
    },

    scrollToPrograms() {
      if (this.$refs.programsList) {
        this.$refs.programsList.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
  },
  async created() {
    console.log("AuthorProgramsPage created");
    await Promise.all([this.loadPageContent(), this.loadAuthorPrograms()]);
  },

  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log(
          "Филиал изменился, перезагружаем авторские программы:",
          newBranchId
        );
        this.loadPageContent();
        this.loadAuthorPrograms();
      },
    },
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
