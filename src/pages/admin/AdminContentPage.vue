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
            📝
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление контентом</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ contentItems.length }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка обновления -->
          <button
            @click="loadContent"
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
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="px-4 py-4 space-y-3">
      <!-- Филиал -->
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

      <!-- Статус активности -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Статус</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.is_active = null;
              applyFilters();
            "
            :class="
              filters.is_active === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все статусы
          </button>
          <button
            @click="
              filters.is_active = true;
              applyFilters();
            "
            :class="
              filters.is_active === true
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Активные
          </button>
          <button
            @click="
              filters.is_active = false;
              applyFilters();
            "
            :class="
              filters.is_active === false
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Неактивные
          </button>
        </div>
      </div>

      <!-- Поиск -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Поиск по ключу или заголовку
        </h3>
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Введите ключ или заголовок..."
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

    <!-- Список контента -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик и статистика -->
      <div class="mb-3">
        <div class="text-sm text-gray-600 mb-2">
          Найдено:
          <span class="font-semibold">{{ filteredContent.length }}</span>
        </div>
        <div class="flex gap-3 text-xs">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600">Активные: {{ stats.active }}</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <span class="text-gray-600">Неактивные: {{ stats.inactive }}</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600">С ценой: {{ stats.withPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Контент -->
      <div v-if="filteredContent.length > 0" class="space-y-3">
        <div
          v-for="item in filteredContent"
          :key="item.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска -->
          <div :class="getContentColorClass(item)" class="h-1"></div>

          <div class="p-4">
            <!-- Заголовок и кнопки -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 text-base">
                    {{ item.title }}
                  </h3>
                  <span class="text-sm text-gray-500"> ID: {{ item.id }} </span>
                </div>

                <!-- Ключ и статусы -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <!-- Ключ -->
                  <div class="flex items-center gap-1">
                    <svg
                      class="w-3 h-3 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-xs text-gray-600">
                      {{ getKeyLabel(item.key) }}
                    </span>
                  </div>

                  <!-- Статусы -->
                  <span
                    v-if="item.is_active"
                    class="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200"
                  >
                    Активен
                  </span>
                  <span
                    v-else
                    class="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200"
                  >
                    Неактивен
                  </span>

                  <!-- Цена -->
                  <span
                    v-if="item.price"
                    class="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200"
                  >
                    {{ item.price }} ₽
                  </span>

                  <!-- Филиал -->
                  <span
                    v-if="item.branch_id"
                    class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200"
                  >
                    {{ getBranchName(item.branch_id) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Содержимое (превью) -->
            <div class="space-y-2">
              <!-- Содержимое -->
              <div class="text-sm text-gray-600 line-clamp-3">
                {{ truncateContent(item.content) }}
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
              Создан: {{ formatDateTimeShort(item.created_at) }}
              <span class="mx-2">•</span>
              Обновлён: {{ formatDateTimeShort(item.updated_at) }}
            </div>

            <!-- Кнопка редактирования -->
            <div class="mt-3 pt-3 border-t border-gray-100">
              <button
                @click="openEditModal(item)"
                class="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Редактировать
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет контента -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">📝</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет контента</h3>
        <p class="text-sm text-gray-600">
          {{
            hasActiveFilters
              ? "По выбранным фильтрам контента не найдено"
              : "Контент ещё не создан"
          }}
        </p>
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="mt-3 text-sm text-[#4e5d51] hover:text-[#3d4a40] font-medium"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>

    <!-- Модальные окна -->
    <EditContentModal
      v-if="editingContent"
      :content="editingContent"
      @close="editingContent = null"
      @updated="onContentUpdated"
    />
  </div>
</template>

<script>
import { contentAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import EditContentModal from "@/components/EditContentModal.vue";

export default {
  name: "AdminContentPage",
  components: {
    EditContentModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      contentItems: [],
      filters: {
        branch_id: null,
        is_active: null,
      },
      searchQuery: "",
      editingContent: null,
      stats: {
        active: 0,
        inactive: 0,
        withPrice: 0,
      },
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),

    filteredContent() {
      let filtered = this.contentItems;

      // Фильтр по филиалу
      if (this.filters.branch_id !== null) {
        filtered = filtered.filter(
          (item) => item.branch_id === this.filters.branch_id
        );
      }

      // Фильтр по статусу активности
      if (this.filters.is_active !== null) {
        filtered = filtered.filter(
          (item) => item.is_active === this.filters.is_active
        );
      }

      // Поиск по ключу или заголовку
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (item) =>
            item.key.toLowerCase().includes(query) ||
            item.title.toLowerCase().includes(query)
        );
      }

      return filtered;
    },

    hasActiveFilters() {
      return (
        this.filters.branch_id !== null ||
        this.filters.is_active !== null ||
        this.searchQuery.trim() !== ""
      );
    },

    activeFiltersCount() {
      let count = 0;
      if (this.filters.branch_id !== null) count++;
      if (this.filters.is_active !== null) count++;
      if (this.searchQuery.trim() !== "") count++;
      return count;
    },
  },
  methods: {
    async loadContent() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка контента...");

        // Загружаем весь контент (включая неактивный)
        const data = await contentAPI.getAllAdmin({ include_inactive: true });

        if (Array.isArray(data)) {
          // Сортируем по дате обновления (новые сверху)
          this.contentItems = data.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          );

          // Обновляем статистику
          this.updateStats();

          console.log("Загружено контента:", this.contentItems.length);
        } else {
          this.contentItems = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке контента:", error);
        this.error = error.message || "Не удалось загрузить контент";
        this.contentItems = [];
      } finally {
        this.isLoading = false;
      }
    },

    applyFilters() {
      // Фильтрация происходит в computed свойстве filteredContent
    },

    onSearchInput() {
      // Дебаунс для поиска
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.applyFilters();
      }, 300);
    },

    clearAllFilters() {
      this.filters = {
        branch_id: null,
        is_active: null,
      };
      this.searchQuery = "";
    },

    updateStats() {
      this.stats = {
        active: this.contentItems.filter((item) => item.is_active).length,
        inactive: this.contentItems.filter((item) => !item.is_active).length,
        withPrice: this.contentItems.filter((item) => item.price).length,
      };
    },

    openEditModal(content) {
      this.editingContent = { ...content };
    },

    async onContentUpdated() {
      console.log("Контент обновлен");
      this.editingContent = null;
      await this.loadContent();
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

    truncateContent(content) {
      if (!content) return "";
      if (content.length > 200) {
        return content.substring(0, 200) + "...";
      }
      return content;
    },

    getContentColorClass(item) {
      if (!item.is_active) return "bg-gray-400";
      if (item.price) return "bg-yellow-500";
      return "bg-green-500";
    },

    getBranchName(branchId) {
      if (!branchId || !this.branches) return "";
      const branch = this.branches.find((b) => b.id === branchId);
      return branch ? branch.name : "";
    },

    getKeyLabel(key) {
      const labels = {
        BACHELOR: "КОЛЛЕКТИВНАЯ БАНЯ",
        BACHELORETTE: "ДЕВИЧНИК",
        COLLECTIVE: "КОЛЛЕКТИВНАЯ ПРОГРАММА",
        AUTHOR: "АВТОРСКАЯ ПРОГРАММА",
        CORPORATE: "КОРПОРАТИВНАЯ ПРОГРАММА",
        CERTIFICATE: "ПОДАРОЧНЫЕ СЕРТИФИКАТЫ",
        BATH_CLUB: "БАННЫЙ КЛУБ С. ХАЧАТУРЬЯН",
        BUSINESS_BATH: "Бизнес-баня МОСТ",
        FIRST_TIME: "Я ПЕРВЫЙ РАЗ",
        LOYALTY: "ЛОЯЛЬНОСТЬ И ПРОМОКОДЫ",
      };
      return labels[key] || key;
    },
  },

  async created() {
    console.log("AdminContentPage created");

    // Загружаем филиалы если не загружены
    const store = useAppStore();
    if (!store.areBranchesLoaded) {
      try {
        await store.loadBranches();
      } catch (error) {
        console.error("Failed to load branches:", error);
      }
    }

    await this.loadContent();
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
