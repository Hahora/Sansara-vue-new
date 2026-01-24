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

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white border-opacity-30"
          >
            💡
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Рекомендации по настроению</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ recommendations.length }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка обновления -->
          <button
            @click="loadRecommendations"
            :disabled="isLoading"
            class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-lg transition-all active:scale-98 disabled:opacity-50"
            title="Обновить список"
          >
            <svg
              :class="{ 'animate-spin': isLoading }"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <!-- Кнопка создания -->
          <button
            @click="openCreateModal"
            class="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-all active:scale-98 font-semibold flex items-center"
          >
            <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="hidden sm:inline">Создать</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="px-4 py-4 space-y-3">
      <!-- Фильтр по филиалу -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Филиал</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.branch_id = null;
              applyFilters();
            "
            :class="
              filters.branch_id === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все филиалы
          </button>
          <button
            v-for="branch in branches"
            :key="branch.id"
            @click="
              filters.branch_id = branch.id;
              applyFilters();
            "
            :class="
              filters.branch_id === branch.id
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            {{ branch.name }}
          </button>
        </div>
      </div>

      <!-- Фильтр по настроению -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Текущее настроение
        </h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.mood = null;
              applyFilters();
            "
            :class="
              filters.mood === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все настроения
          </button>
          <button
            v-for="mood in uniqueMoods"
            :key="mood"
            @click="
              filters.mood = mood;
              applyFilters();
            "
            :class="
              filters.mood === mood
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            {{ getMoodLabel(mood) }}
          </button>
        </div>
      </div>

      <!-- Фильтр по цели -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Цель</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.goal = null;
              applyFilters();
            "
            :class="
              filters.goal === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все цели
          </button>
          <button
            v-for="goal in uniqueGoals"
            :key="goal"
            @click="
              filters.goal = goal;
              applyFilters();
            "
            :class="
              filters.goal === goal
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            {{ getGoalLabel(goal) }}
          </button>
        </div>
      </div>

      <!-- Поиск -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Поиск по программе или причине
        </h3>
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Введите название программы или причину..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          />
          <svg
            class="absolute left-3 top-3 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button
            v-if="searchQuery"
            @click="
              searchQuery = '';
              onSearchInput();
            "
            class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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

      <!-- Сброс фильтров -->
      <div
        v-if="hasActiveFilters"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-gray-700">
            Активные фильтры:
            <span class="text-amber-600 font-semibold">{{
              activeFiltersCount
            }}</span>
          </div>
          <button
            @click="clearAllFilters"
            class="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Сбросить все
          </button>
        </div>
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

    <!-- Список рекомендаций -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик и статистика -->
      <div class="mb-3">
        <div class="text-sm text-gray-600 mb-2">
          Найдено:
          <span class="font-semibold">{{
            filteredRecommendations.length
          }}</span>
        </div>
        <div class="flex gap-3 text-xs">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span class="text-gray-600">Филиалов: {{ stats.branches }}</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600">Настроений: {{ stats.moods }}</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span class="text-gray-600">Целей: {{ stats.goals }}</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600">Программ: {{ stats.programs }}</span>
          </div>
        </div>
      </div>

      <!-- Рекомендации -->
      <div v-if="filteredRecommendations.length > 0" class="space-y-3">
        <div
          v-for="rec in filteredRecommendations"
          :key="rec.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска -->
          <div :class="getMoodColorClass(rec.mood)" class="h-1"></div>

          <div class="p-4">
            <!-- Заголовок и кнопки -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 text-base">
                    {{ rec.program_name || `Программа #${rec.program_id}` }}
                  </h3>
                  <span class="text-sm text-gray-500"> ID: {{ rec.id }} </span>
                </div>

                <!-- Настроение, цель и филиал -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <!-- Филиал -->
                  <span
                    class="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200"
                  >
                    <svg
                      class="w-3 h-3 inline mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ getBranchName(rec.branch_id) }}
                  </span>

                  <!-- Настроение -->
                  <span
                    class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200"
                  >
                    {{ getMoodLabel(rec.mood) }}
                  </span>

                  <!-- Цель -->
                  <span
                    class="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200"
                  >
                    {{ getGoalLabel(rec.goal) }}
                  </span>

                  <!-- Программа -->
                  <span
                    class="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200"
                  >
                    ID программы: {{ rec.program_id }}
                  </span>
                </div>
              </div>

              <!-- Меню действий -->
              <div class="flex flex-col items-end gap-2">
                <button
                  @click="toggleRecommendationMenu(rec.id)"
                  class="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Причина рекомендации -->
            <div class="space-y-2">
              <div class="text-sm text-gray-600 line-clamp-3">
                <span class="font-medium">Причина рекомендации:</span>
                {{ rec.program_reason }}
              </div>
            </div>

            <!-- Даты -->
            <div
              class="flex items-center text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100"
            >
              <svg
                class="w-3 h-3 mr-1 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                />
              </svg>
              Создан: {{ formatDateTimeShort(rec.created_at) }}
              <span class="mx-2">•</span>
              Обновлён: {{ formatDateTimeShort(rec.updated_at) }}
            </div>

            <!-- Меню действий -->
            <div
              v-if="openMenuId === rec.id"
              class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2"
            >
              <button
                @click="openEditModal(rec)"
                class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ✏️ Редактировать
              </button>
              <button
                @click="deleteRecommendation(rec)"
                class="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет рекомендаций -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">💡</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Нет рекомендаций
        </h3>
        <p class="text-sm text-gray-600">
          {{
            hasActiveFilters
              ? "По выбранным фильтрам рекомендаций не найдено"
              : "Рекомендации ещё не созданы"
          }}
        </p>
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="mt-3 text-sm text-[#4e5d51] hover:text-[#3d4a40] font-medium"
        >
          Сбросить фильтры
        </button>
        <button
          v-else
          @click="openCreateModal"
          class="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Создать первую рекомендацию
        </button>
      </div>
    </div>

    <!-- Модальные окна -->
    <CreateRecommendationModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="onRecommendationCreated"
    />

    <EditRecommendationModal
      v-if="editingRecommendation"
      :recommendation="editingRecommendation"
      @close="editingRecommendation = null"
      @updated="onRecommendationUpdated"
    />
  </div>
</template>

<script>
import { recommendationAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import CreateRecommendationModal from "@/components/CreateRecommendationModal.vue";
import EditRecommendationModal from "@/components/EditRecommendationModal.vue";

export default {
  name: "AdminRecommendationsPage",
  components: {
    CreateRecommendationModal,
    EditRecommendationModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      recommendations: [],
      filters: {
        branch_id: null,
        mood: null,
        goal: null,
      },
      searchQuery: "",
      searchTimeout: null,
      showCreateModal: false,
      editingRecommendation: null,
      openMenuId: null,
      stats: {
        branches: 0,
        moods: 0,
        goals: 0,
        programs: 0,
      },

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
      ],
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),

    filteredRecommendations() {
      let filtered = this.recommendations;

      // Фильтр по филиалу
      if (this.filters.branch_id !== null) {
        filtered = filtered.filter(
          (rec) => rec.branch_id === this.filters.branch_id
        );
      }

      // Фильтр по настроению
      if (this.filters.mood !== null) {
        filtered = filtered.filter((rec) => rec.mood === this.filters.mood);
      }

      // Фильтр по цели
      if (this.filters.goal !== null) {
        filtered = filtered.filter((rec) => rec.goal === this.filters.goal);
      }

      // Поиск по названию программы или причине
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (rec) =>
            (rec.program_name &&
              rec.program_name.toLowerCase().includes(query)) ||
            (rec.program_reason &&
              rec.program_reason.toLowerCase().includes(query))
        );
      }

      return filtered;
    },

    uniqueMoods() {
      const moods = [...new Set(this.recommendations.map((rec) => rec.mood))];
      return moods.filter((mood) => mood).sort();
    },

    uniqueGoals() {
      const goals = [...new Set(this.recommendations.map((rec) => rec.goal))];
      return goals.filter((goal) => goal).sort();
    },

    hasActiveFilters() {
      return (
        this.filters.branch_id !== null ||
        this.filters.mood !== null ||
        this.filters.goal !== null ||
        this.searchQuery.trim() !== ""
      );
    },

    activeFiltersCount() {
      let count = 0;
      if (this.filters.branch_id !== null) count++;
      if (this.filters.mood !== null) count++;
      if (this.filters.goal !== null) count++;
      if (this.searchQuery.trim() !== "") count++;
      return count;
    },
  },
  methods: {
    async loadRecommendations() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка рекомендаций...");
        const data = await recommendationAPI.getAllAdmin();

        if (Array.isArray(data)) {
          // Сортируем по дате создания (новые сверху)
          this.recommendations = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // Обновляем статистику
          this.updateStats();

          console.log("Загружено рекомендаций:", this.recommendations.length);

          // Автоматически определим все уникальные настроения и цели
          this.autoDetectMoodsAndGoals();
        } else {
          this.recommendations = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке рекомендаций:", error);
        this.error = error.message || "Не удалось загрузить рекомендации";
        this.recommendations = [];
      } finally {
        this.isLoading = false;
      }
    },

    autoDetectMoodsAndGoals() {
      // Автоматически добавляем найденные настроения, которых нет в списке
      const foundMoods = [
        ...new Set(this.recommendations.map((rec) => rec.mood)),
      ];
      foundMoods.forEach((mood) => {
        if (!this.moods.some((m) => m.value === mood)) {
          this.moods.push({
            value: mood,
            label: this.formatMoodLabel(mood),
          });
        }
      });

      // Автоматически добавляем найденные цели, которых нет в списке
      const foundGoals = [
        ...new Set(this.recommendations.map((rec) => rec.goal)),
      ];
      foundGoals.forEach((goal) => {
        if (!this.goals.some((g) => g.value === goal)) {
          this.goals.push({
            value: goal,
            label: this.formatGoalLabel(goal),
          });
        }
      });
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

    getBranchName(branchId) {
      if (!branchId || !this.branches) return "";
      const branch = this.branches.find((b) => b.id === branchId);
      return branch ? branch.name : "";
    },

    applyFilters() {
      // Фильтрация происходит в computed свойстве filteredRecommendations
    },

    onSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.applyFilters();
      }, 300);
    },

    clearAllFilters() {
      this.filters = {
        branch_id: null,
        mood: null,
        goal: null,
      };
      this.searchQuery = "";
    },

    updateStats() {
      const uniqueBranches = new Set(
        this.recommendations.map((rec) => rec.branch_id)
      );
      const uniqueMoods = new Set(this.recommendations.map((rec) => rec.mood));
      const uniqueGoals = new Set(this.recommendations.map((rec) => rec.goal));
      const uniquePrograms = new Set(
        this.recommendations.map((rec) => rec.program_id)
      );

      this.stats = {
        branches: uniqueBranches.size,
        moods: uniqueMoods.size,
        goals: uniqueGoals.size,
        programs: uniquePrograms.size,
      };
    },

    toggleRecommendationMenu(recId) {
      this.openMenuId = this.openMenuId === recId ? null : recId;
    },

    openCreateModal() {
      this.showCreateModal = true;
      this.openMenuId = null;
    },

    openEditModal(recommendation) {
      this.editingRecommendation = { ...recommendation };
      this.openMenuId = null;
    },

    async deleteRecommendation(recommendation) {
      if (
        !confirm(
          `Удалить рекомендацию для "${this.getMoodLabel(recommendation.mood)}" -> "${this.getGoalLabel(recommendation.goal)}" (${this.getBranchName(recommendation.branch_id)})?`
        )
      ) {
        return;
      }

      try {
        await recommendationAPI.delete(recommendation.id);
        console.log("Рекомендация удалена:", recommendation.id);

        this.recommendations = this.recommendations.filter(
          (item) => item.id !== recommendation.id
        );
        this.updateStats();
      } catch (error) {
        console.error("Ошибка при удалении рекомендации:", error);
        alert("Не удалось удалить рекомендацию: " + error.message);
      }
    },

    async onRecommendationCreated() {
      console.log("Рекомендация создана");
      this.showCreateModal = false;
      await this.loadRecommendations();
    },

    async onRecommendationUpdated() {
      console.log("Рекомендация обновлена");
      this.editingRecommendation = null;
      await this.loadRecommendations();
    },

    formatDateTimeShort(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },

    getMoodLabel(mood) {
      const moodObj = this.moods.find((m) => m.value === mood);
      return moodObj ? moodObj.label : this.formatMoodLabel(mood);
    },

    getGoalLabel(goal) {
      const goalObj = this.goals.find((g) => g.value === goal);
      return goalObj ? goalObj.label : this.formatGoalLabel(goal);
    },

    getMoodColorClass(mood) {
      const colors = {
        curious: "bg-blue-500",
        reboot: "bg-purple-500",
        relax: "bg-green-500",
        stress: "bg-red-500",
        tired: "bg-yellow-500",
        energetic: "bg-orange-500",
        neutral: "bg-gray-500",
        sad: "bg-indigo-500",
        happy: "bg-yellow-400",
        anxious: "bg-pink-500",
      };
      return colors[mood] || "bg-gray-500";
    },
  },

  async created() {
    console.log("AdminRecommendationsPage created");

    // Загружаем филиалы если не загружены
    const store = useAppStore();
    if (!store.areBranchesLoaded) {
      try {
        await store.loadBranches();
      } catch (error) {
        console.error("Failed to load branches:", error);
      }
    }

    await this.loadRecommendations();
  },
};
</script>
