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
            📅
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление событиями</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ totalEvents }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка обновления -->
          <button
            @click="loadEvents"
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
            class="bg-white hover:bg-opacity-90 text-[#4e5d51] p-3 rounded-lg transition-all active:scale-98 font-semibold flex items-center"
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

      <!-- Тип события -->
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
            Все
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

      <!-- Период -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Период</h3>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 block mb-1">С</label>
            <input
              v-model="filters.date_from"
              type="date"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label class="text-xs text-gray-600 block mb-1">По</label>
            <input
              v-model="filters.date_to"
              type="date"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            />
          </div>
        </div>
        <button
          v-if="filters.date_from || filters.date_to"
          @click="clearDateFilters"
          class="mt-2 text-xs text-blue-600 hover:text-blue-700"
        >
          Сбросить даты
        </button>
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

    <!-- Список событий -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик -->
      <div class="text-sm text-gray-600 mb-3">
        Найдено: <span class="font-semibold">{{ events.length }}</span>
      </div>

      <!-- События -->
      <div v-if="events.length > 0" class="space-y-3">
        <div
          v-for="event in events"
          :key="event.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска -->
          <div :class="getEventColorClass(event)" class="h-1"></div>

          <div class="p-4">
            <!-- Заголовок и кнопки -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 text-base">
                    {{ event.title || "Без названия" }}
                  </h3>
                  <span class="text-sm text-gray-500">
                    ID: {{ event.id }}
                  </span>
                </div>
                <!-- Event Key -->
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border"
                  >
                    {{ getEventTypeLabel(event.event_key) }}
                  </span>
                  <span
                    v-if="event.recurring_day_of_week !== null"
                    class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200"
                  >
                    Повторяющееся
                  </span>
                  <span
                    v-else
                    class="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded border border-gray-200"
                  >
                    Разовое
                  </span>
                </div>
                <!-- Филиал -->
                <p
                  v-if="getBranchName(event.branch_id)"
                  class="text-xs text-gray-500 flex items-center"
                >
                  <svg
                    class="w-3 h-3 mr-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ getBranchName(event.branch_id) }}
                </p>
              </div>

              <!-- Статус -->
              <div class="flex flex-col items-end gap-2">
                <div
                  :class="getStatusBadgeClass(event.is_active)"
                  class="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  {{ event.is_active ? "Активно" : "Неактивно" }}
                </div>
                <!-- Меню действий -->
                <button
                  @click="toggleEventMenu(event.id)"
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
              <!-- Дата и время -->
              <div class="flex items-center text-sm text-gray-600">
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
                {{ formatDateTime(event.start_date) }}
              </div>

              <!-- Длительность -->
              <div
                v-if="event.duration_minutes"
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ formatDuration(event.duration_minutes) }}
              </div>

              <!-- Повторяющееся событие -->
              <div
                v-if="
                  event.recurring_day_of_week !== null && event.recurring_time
                "
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ getDayOfWeek(event.recurring_day_of_week) }}
                {{ event.recurring_time }}
              </div>

              <!-- Описание -->
              <div
                v-if="event.description"
                class="mt-2 pt-2 border-t border-gray-100"
              >
                <p class="text-xs text-gray-600">
                  {{ event.description }}
                </p>
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
              Создано: {{ formatDateTimeShort(event.created_at) }}
            </div>

            <!-- Меню действий -->
            <div
              v-if="openMenuId === event.id"
              class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2"
            >
              <button
                @click="openEditModal(event)"
                class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ✏️ Редактировать
              </button>
              <button
                @click="confirmDelete(event)"
                class="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                🗑️ Удалить
              </button>
              <button
                @click="toggleEventStatus(event)"
                :class="
                  event.is_active
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                    : 'bg-green-50 hover:bg-green-100 text-green-700'
                "
                class="px-3 py-2 rounded-lg text-xs font-medium transition-colors col-span-2"
              >
                {{ event.is_active ? "❌ Деактивировать" : "✅ Активировать" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет событий -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">📅</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет событий</h3>
        <p class="text-sm text-gray-600">
          {{
            hasActiveFilters
              ? "По выбранным фильтрам событий не найдено"
              : "События ещё не созданы"
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
    <CreateEventModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="onEventCreated"
    />

    <EditEventModal
      v-if="editingEvent"
      :event="editingEvent"
      @close="editingEvent = null"
      @saved="onEventSaved"
    />
  </div>
</template>

<script>
import { eventCalendarAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import CreateEventModal from "@/components/CreateEventModal.vue";
import EditEventModal from "@/components/EditEventModal.vue";

export default {
  name: "AdminEventsPage",
  components: {
    CreateEventModal,
    EditEventModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      events: [],
      allEvents: [],
      totalEvents: 0,
      filters: {
        branch_id: null,
        is_active: null,
        date_from: null,
        date_to: null,
      },
      showCreateModal: false,
      editingEvent: null,
      openMenuId: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),
    hasActiveFilters() {
      return (
        this.filters.branch_id !== null ||
        this.filters.is_active !== null ||
        this.filters.date_from !== null ||
        this.filters.date_to !== null
      );
    },
    activeFiltersCount() {
      let count = 0;
      if (this.filters.branch_id !== null) count++;
      if (this.filters.is_active !== null) count++;
      if (this.filters.date_from !== null) count++;
      if (this.filters.date_to !== null) count++;
      return count;
    },
  },
  methods: {
    async loadEvents() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка событий с фильтрами:", this.filters);

        // Загружаем все события
        const data = await eventCalendarAPI.adminGetAll({});

        if (Array.isArray(data)) {
          // Сортируем по дате начала (новые сверху)
          this.allEvents = data.sort(
            (a, b) => new Date(b.start_date) - new Date(a.start_date)
          );

          // Применяем локальные фильтры
          this.applyLocalFilters();

          this.totalEvents = this.allEvents.length;
          console.log("Загружено событий:", this.allEvents.length);
        } else {
          this.allEvents = [];
          this.events = [];
          this.totalEvents = 0;
        }
      } catch (error) {
        console.error("Ошибка при загрузке событий:", error);
        this.error = error.message || "Не удалось загрузить события";
        this.allEvents = [];
        this.events = [];
      } finally {
        this.isLoading = false;
      }
    },

    getEventTypeLabel(eventKey) {
      const labels = {
        BACHELOR: "МАЛЬЧИШНИК",
        BACHELORETTE: "ДЕВИЧНИК",
        BATH_CLUB: "БАННЫЙ КЛУБ С. ХАЧАТУРЬЯН",
        BUSINESS_BATH: "Бизнес-баня МОСТ",
        OTHER: "Другое",
      };
      return labels[eventKey] || eventKey;
    },

    applyLocalFilters() {
      let filtered = this.allEvents;

      // Фильтр по филиалу
      if (this.filters.branch_id !== null) {
        filtered = filtered.filter(
          (event) => event.branch_id === this.filters.branch_id
        );
      }

      // Фильтр по статусу
      if (this.filters.is_active !== null) {
        filtered = filtered.filter(
          (event) => event.is_active === this.filters.is_active
        );
      }

      // Фильтр по дате "от"
      if (this.filters.date_from) {
        const dateFrom = new Date(this.filters.date_from);
        filtered = filtered.filter(
          (event) => new Date(event.start_date) >= dateFrom
        );
      }

      // Фильтр по дате "до"
      if (this.filters.date_to) {
        const dateTo = new Date(this.filters.date_to);
        // Добавляем один день, чтобы включить события на всю дату "до"
        dateTo.setDate(dateTo.getDate() + 1);
        filtered = filtered.filter(
          (event) => new Date(event.start_date) < dateTo
        );
      }

      this.events = filtered;
    },

    applyFilters() {
      this.applyLocalFilters();
    },

    clearDateFilters() {
      this.filters.date_from = null;
      this.filters.date_to = null;
      this.applyFilters();
    },

    clearAllFilters() {
      this.filters = {
        branch_id: null,
        is_active: null,
        date_from: null,
        date_to: null,
      };
      this.applyFilters();
    },

    getBranchName(branchId) {
      if (!branchId || !this.branches) return "";
      const branch = this.branches.find((b) => b.id === branchId);
      return branch ? branch.name : "";
    },

    openCreateModal() {
      this.showCreateModal = true;
    },

    openEditModal(event) {
      this.editingEvent = { ...event };
      this.openMenuId = null;
    },

    toggleEventMenu(eventId) {
      this.openMenuId = this.openMenuId === eventId ? null : eventId;
    },

    async confirmDelete(event) {
      if (!confirm(`Удалить событие "${event.title}"?`)) {
        return;
      }

      try {
        await eventCalendarAPI.adminDelete(event.id);
        console.log("Событие удалено:", event.id);
        await this.loadEvents();
      } catch (error) {
        console.error("Ошибка при удалении:", error);
        alert("Не удалось удалить событие: " + error.message);
      }
    },

    async toggleEventStatus(event) {
      try {
        const newStatus = !event.is_active;
        const updateData = { is_active: newStatus };

        const updatedEvent = await eventCalendarAPI.adminUpdate(
          event.id,
          updateData
        );

        // Обновляем локально
        const eventIndex = this.events.findIndex((e) => e.id === event.id);
        if (eventIndex !== -1) {
          this.events[eventIndex].is_active = newStatus;
        }

        // Обновляем в allEvents тоже
        const allEventIndex = this.allEvents.findIndex(
          (e) => e.id === event.id
        );
        if (allEventIndex !== -1) {
          this.allEvents[allEventIndex].is_active = newStatus;
        }

        console.log(
          `Статус события обновлен: ${newStatus ? "активно" : "неактивно"}`
        );
      } catch (error) {
        console.error("Ошибка при изменении статуса:", error);
        alert("Не удалось изменить статус: " + error.message);
      }
    },

    async onEventCreated(newEvent) {
      console.log("Событие создано:", newEvent);
      this.showCreateModal = false;
      await this.loadEvents();
    },

    async onEventSaved(updatedEvent) {
      console.log("Событие обновлено:", updatedEvent);
      this.editingEvent = null;
      await this.loadEvents();
    },

    formatDateTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    formatDateTimeShort(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    formatDuration(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours === 0) {
        return `${mins} мин`;
      } else if (mins === 0) {
        return `${hours} ч`;
      } else {
        return `${hours} ч ${mins} мин`;
      }
    },

    getDayOfWeek(dayIndex) {
      const days = [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье",
      ];
      return days[dayIndex] || "";
    },

    getEventColorClass(event) {
      if (!event.is_active) return "bg-gray-400";
      if (event.recurring_day_of_week !== null) return "bg-blue-500";
      return "bg-green-500";
    },

    getStatusBadgeClass(isActive) {
      return isActive
        ? "bg-green-50 text-green-700 border border-green-200"
        : "bg-red-50 text-red-700 border border-red-200";
    },
  },

  async created() {
    console.log("AdminEventsPage created");

    // Загружаем филиалы если не загружены
    const store = useAppStore();
    if (!store.areBranchesLoaded) {
      try {
        await store.loadBranches();
      } catch (error) {
        console.error("Failed to load branches:", error);
      }
    }

    await this.loadEvents();
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
</style>
