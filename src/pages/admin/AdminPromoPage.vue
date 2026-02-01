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
            🎟️
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление промокодами</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ promos.length }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка обновления -->
          <button
            @click="loadPromos"
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

    <!-- Статистика -->
    <div class="px-4 py-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Статистика</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ stats.total }}
            </div>
            <div class="text-xs text-gray-500">Всего</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ stats.used }}
            </div>
            <div class="text-xs text-gray-500">Использовано</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ stats.withLimit }}
            </div>
            <div class="text-xs text-gray-500">С лимитом</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">
              {{ stats.firstVisit }}
            </div>
            <div class="text-xs text-gray-500">Для первого визита</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Поиск -->
    <div class="px-4 py-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Поиск по коду</h3>
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Введите код промокода..."
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

    <!-- Список промокодов -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик -->
      <div class="mb-3">
        <div class="text-sm text-gray-600 mb-2">
          Найдено:
          <span class="font-semibold">{{ filteredPromos.length }}</span>
        </div>
      </div>

      <!-- Промокоды -->
      <div v-if="filteredPromos.length > 0" class="space-y-3">
        <div
          v-for="promo in filteredPromos"
          :key="promo.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска -->
          <div :class="getPromoColorClass(promo)" class="h-1"></div>

          <div class="p-4">
            <!-- Заголовок и кнопки -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 text-lg">
                    {{ promo.code }}
                  </h3>
                  <span class="text-sm text-gray-500">
                    ID: {{ promo.id }}
                  </span>
                </div>

                <!-- Статусы -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    v-if="promo.is_active"
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
                  <span
                    v-if="promo.for_first_visit_only"
                    class="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200"
                  >
                    Только первый визит
                  </span>
                </div>
              </div>

              <!-- Меню действий -->
              <div class="flex flex-col items-end gap-2">
                <!-- Скидка -->
                <div
                  class="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold"
                >
                  -{{ promo.discount_percent }}%
                </div>
                <button
                  @click="togglePromoMenu(promo.id)"
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

            <!-- Информация -->
            <div class="space-y-2">
              <!-- Использование -->
              <div class="flex items-center text-sm text-gray-600">
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                Использовано: {{ promo.current_uses || 0 }}
                <span v-if="promo.max_uses" class="text-gray-400 ml-1">
                  / {{ promo.max_uses }} раз
                </span>
                <span v-else class="text-gray-400 ml-1"> / ∞ раз </span>
              </div>

              <!-- Даты действия -->
              <div class="space-y-1">
                <div
                  v-if="promo.valid_from"
                  class="flex items-center text-sm text-gray-600"
                >
                  <svg
                    class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Действует с: {{ formatDate(promo.valid_from) }}
                </div>
                <div
                  v-if="promo.valid_until"
                  class="flex items-center text-sm text-gray-600"
                >
                  <svg
                    class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Действует до: {{ formatDate(promo.valid_until) }}
                </div>
                <div
                  v-if="!promo.valid_from && !promo.valid_until"
                  class="text-sm text-gray-600"
                >
                  Без ограничения по времени
                </div>
              </div>

              <!-- Типы программ -->
              <div
                v-if="promo.program_types && promo.program_types.length > 0"
                class="pt-2"
              >
                <p class="text-xs text-gray-500 mb-1">Применяется к:</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="type in promo.program_types"
                    :key="type"
                    class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border"
                  >
                    {{ getProgramTypeLabel(type) }}
                  </span>
                </div>
              </div>
              <div
                v-else-if="promo.program_types === null"
                class="text-xs text-gray-500"
              >
                Применяется ко всем программам
              </div>
            </div>

            <!-- Дата создания -->
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
              Создан: {{ formatDateTimeShort(promo.created_at) }}
            </div>

            <!-- Меню действий -->
            <div
              v-if="openMenuId === promo.id"
              class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2"
            >
              <button
                @click="openEditModal(promo)"
                class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ✏️ Редактировать
              </button>
              <button
                @click="deletePromo(promo)"
                class="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет промокодов -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">🎟️</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет промокодов</h3>
        <p class="text-sm text-gray-600">
          {{
            searchQuery
              ? "По вашему запросу промокодов не найдено"
              : "Промокоды ещё не созданы"
          }}
        </p>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="mt-3 text-sm text-[#4e5d51] hover:text-[#3d4a40] font-medium"
        >
          Сбросить поиск
        </button>
        <button
          v-else
          @click="openCreateModal"
          class="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Создать первый промокод
        </button>
      </div>
    </div>

    <!-- Модальные окна -->
    <CreatePromoModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="onPromoCreated"
    />

    <EditPromoModal
      v-if="editingPromo"
      :promo="editingPromo"
      @close="editingPromo = null"
      @updated="onPromoUpdated"
    />
  </div>
</template>

<script>
import { promoAPI } from "@/utils/api";
import CreatePromoModal from "@/components/CreatePromoModal.vue";
import EditPromoModal from "@/components/EditPromoModal.vue";

export default {
  name: "AdminPromoPage",
  components: {
    CreatePromoModal,
    EditPromoModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      promos: [],
      searchQuery: "",
      showCreateModal: false,
      editingPromo: null,
      openMenuId: null,
      stats: {
        total: 0,
        used: 0,
        withLimit: 0,
        firstVisit: 0,
      },
    };
  },
  computed: {
    filteredPromos() {
      let filtered = this.promos;

      // Поиск по коду
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter((promo) =>
          promo.code.toLowerCase().includes(query)
        );
      }

      return filtered;
    },
  },
  methods: {
    async loadPromos() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка промокодов...");

        // Загружаем все промокоды
        const data = await promoAPI.getAll();

        if (Array.isArray(data)) {
          // Сортируем по дате создания (новые сверху)
          this.promos = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // Обновляем статистику
          this.updateStats();

          console.log("Загружено промокодов:", this.promos.length);
        } else {
          this.promos = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке промокодов:", error);
        this.error = error.message || "Не удалось загрузить промокоды";
        this.promos = [];
      } finally {
        this.isLoading = false;
      }
    },

    onSearchInput() {
      // Дебаунс для поиска
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        // Фильтрация происходит в computed свойстве filteredPromos
      }, 300);
    },

    updateStats() {
      this.stats = {
        total: this.promos.length,
        used: this.promos.reduce((sum, p) => sum + (p.current_uses || 0), 0),
        withLimit: this.promos.filter(
          (p) => p.max_uses !== null && p.max_uses > 0
        ).length,
        firstVisit: this.promos.filter((p) => p.for_first_visit_only).length,
      };
    },

    togglePromoMenu(promoId) {
      this.openMenuId = this.openMenuId === promoId ? null : promoId;
    },

    openCreateModal() {
      this.showCreateModal = true;
      this.openMenuId = null;
    },

    openEditModal(promo) {
      this.editingPromo = { ...promo };
      this.openMenuId = null;
    },

    async deletePromo(promo) {
      if (!confirm(`Удалить промокод "${promo.code}"?`)) {
        return;
      }

      try {
        await promoAPI.delete(promo.id);
        console.log("Промокод удален:", promo.id);

        // Удаляем из локального списка
        this.promos = this.promos.filter((p) => p.id !== promo.id);
        this.updateStats();
      } catch (error) {
        console.error("Ошибка при удалении промокода:", error);
        alert("Не удалось удалить промокод: " + error.message);
      }
    },

    async onPromoCreated() {
      console.log("Промокод создан");
      this.showCreateModal = false;
      await this.loadPromos();
    },

    async onPromoUpdated() {
      console.log("Промокод обновлен");
      this.editingPromo = null;
      await this.loadPromos();
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

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    getPromoColorClass(promo) {
      if (!promo.is_active) return "bg-gray-400";
      if (promo.for_first_visit_only) return "bg-purple-500";
      return "bg-green-500";
    },

    getProgramTypeLabel(type) {
      const labels = {
        COLLECTIVE: "Коллективные",
        AUTHOR: "Авторские",
        BACHELOR: "Коллективная баня",
        BACHELORETTE: "Девичник",
        BUSINESS_BATH: "Бизнес баня",
        BATH_CLUB: "Банный клуб",
      };
      return labels[type] || type;
    },
  },

  async created() {
    console.log("AdminPromoPage created");
    await this.loadPromos();
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
