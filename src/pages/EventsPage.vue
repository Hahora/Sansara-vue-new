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
          📅
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">Календарь событий</h1>
          <p class="text-white text-opacity-90 text-sm mt-1">
            Ближайшие мероприятия в САНСАРЕ
          </p>
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

    <!-- Контент -->
    <div v-else class="px-4 py-5">
      <!-- Фильтры -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-900">Фильтры</h3>
          <button
            v-if="selectedFilter !== 'all'"
            @click="selectedFilter = 'all'"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            Сбросить
          </button>
        </div>

        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="selectedFilter = 'all'"
            :class="
              selectedFilter === 'all'
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все события
          </button>
          <button
            @click="selectedFilter = 'BACHELOR'"
            :class="
              selectedFilter === 'BACHELOR'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            👔 Мальчишник
          </button>
          <button
            @click="selectedFilter = 'BACHELORETTE'"
            :class="
              selectedFilter === 'BACHELORETTE'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            👗 Девичник
          </button>
          <button
            @click="selectedFilter = 'BATH_CLUB'"
            :class="
              selectedFilter === 'BATH_CLUB'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            ♨️ Банный клуб
          </button>
          <button
            @click="selectedFilter = 'BUSINESS_BATH'"
            :class="
              selectedFilter === 'BUSINESS_BATH'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            💼 Бизнес-баня
          </button>
        </div>
      </div>

      <!-- Счетчик событий -->
      <div class="text-sm text-gray-600 mb-3 px-1">
        Найдено событий:
        <span class="font-semibold">{{ filteredEvents.length }}</span>
      </div>

      <!-- Список событий по месяцам -->
      <div v-if="filteredEvents.length > 0" class="space-y-6">
        <div v-for="(monthData, monthKey) in groupedByMonth" :key="monthKey">
          <!-- Заголовок месяца -->
          <div class="flex items-center mb-3">
            <div
              class="bg-[#4e5d51] text-white px-4 py-2 rounded-lg font-semibold text-sm"
            >
              {{ monthData.label }}
            </div>
            <div class="flex-1 h-px bg-gray-200 ml-3"></div>
          </div>

          <!-- События месяца -->
          <div class="space-y-3">
            <div
              v-for="event in monthData.events"
              :key="event.id"
              @click="navigateToEvent(event)"
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <!-- Цветная полоска сверху -->
              <div
                :class="getEventColorClass(event.event_key)"
                class="h-1"
              ></div>

              <div class="p-4">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-2xl">{{
                        getEventEmoji(event.event_key)
                      }}</span>
                      <h3 class="font-bold text-gray-900 text-base">
                        {{ event.title }}
                      </h3>
                    </div>
                    <p
                      v-if="event.description"
                      class="text-sm text-gray-600 mb-2"
                    >
                      {{ event.description }}
                    </p>
                  </div>
                  <svg
                    class="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
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

                <!-- Информация о событии -->
                <div class="flex flex-wrap gap-2">
                  <!-- Дата и время -->
                  <div
                    class="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-xs font-medium text-gray-700">
                      {{ formatDate(event.start_date) }}
                    </span>
                  </div>

                  <!-- Длительность -->
                  <div
                    class="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-xs font-medium text-gray-700">
                      {{ formatDuration(event.duration_minutes) }}
                    </span>
                  </div>

                  <!-- Тип события -->
                  <div
                    :class="getEventBadgeClass(event.event_key)"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    {{ getEventTypeName(event.event_key) }}
                  </div>

                  <!-- Статус по времени -->
                  <div
                    :class="getEventTimeStatus(event.start_date).class"
                    class="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5"
                  >
                    <span
                      :class="getEventTimeStatus(event.start_date).dotClass"
                      class="w-1.5 h-1.5 rounded-full"
                    ></span>
                    {{ getEventTimeStatus(event.start_date).label }}
                  </div>
                </div>
              </div>
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
        <p class="text-sm text-gray-600 mb-6">
          {{
            selectedFilter === "all"
              ? "В ближайшее время нет запланированных мероприятий"
              : "Нет событий по выбранному фильтру"
          }}
        </p>
        <button
          v-if="selectedFilter !== 'all'"
          @click="selectedFilter = 'all'"
          class="inline-flex items-center px-6 py-3 bg-[#4e5d51] text-white rounded-xl font-medium hover:bg-[#3d4a40] transition-colors"
        >
          Показать все события
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { eventAPI } from "@/utils/api";

export default {
  name: "EventsPage",
  data() {
    return {
      isLoading: false,
      error: null,
      events: [],
      selectedFilter: "all",
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch"]),

    filteredEvents() {
      if (this.selectedFilter === "all") {
        return this.events;
      }
      return this.events.filter(
        (event) => event.event_key === this.selectedFilter
      );
    },

    groupedByMonth() {
      const groups = {};

      this.filteredEvents.forEach((event) => {
        const date = new Date(event.start_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (!groups[monthKey]) {
          groups[monthKey] = {
            label: date.toLocaleDateString("ru-RU", {
              month: "long",
              year: "numeric",
            }),
            events: [],
          };
        }

        groups[monthKey].events.push(event);
      });

      // Сортируем события внутри каждого месяца по дате
      Object.values(groups).forEach((group) => {
        group.events.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );
      });

      return groups;
    },
  },
  methods: {
    async loadEvents() {
      try {
        this.isLoading = true;
        this.error = null;

        const branchId = this.selectedBranch?.id;
        if (!branchId) {
          throw new Error("Филиал не выбран");
        }

        console.log("Загрузка событий для филиала:", branchId);

        // Используем eventAPI.getAll() который вызывает /api/v1/events-calendar/
        const data = await eventAPI.getAll(branchId);

        if (Array.isArray(data)) {
          // Фильтруем по текущему филиалу
          this.events = data
            .filter((event) => event.branch_id === branchId)
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

          console.log("Загружено событий:", this.events.length);
        } else {
          this.events = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке событий:", error);
        this.error = error.message || "Не удалось загрузить события";
        this.events = [];
      } finally {
        this.isLoading = false;
      }
    },

    formatDate(dateString) {
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

    getEventTypeName(eventKey) {
      const types = {
        BACHELOR: "Мальчишник",
        BACHELORETTE: "Девичник",
        BATH_CLUB: "Банный клуб",
        BUSINESS_BATH: "Бизнес-баня",
      };
      return types[eventKey] || "Событие";
    },

    getEventEmoji(eventKey) {
      const emojis = {
        BACHELOR: "👔",
        BACHELORETTE: "👗",
        BATH_CLUB: "♨️",
        BUSINESS_BATH: "💼",
      };
      return emojis[eventKey] || "📅";
    },

    getEventColorClass(eventKey) {
      const colors = {
        BACHELOR: "bg-blue-500",
        BACHELORETTE: "bg-pink-500",
        BATH_CLUB: "bg-purple-500",
        BUSINESS_BATH: "bg-emerald-500",
      };
      return colors[eventKey] || "bg-gray-500";
    },

    getEventBadgeClass(eventKey) {
      const classes = {
        BACHELOR: "bg-blue-50 text-blue-700 border border-blue-200",
        BACHELORETTE: "bg-pink-50 text-pink-700 border border-pink-200",
        BATH_CLUB: "bg-purple-50 text-purple-700 border border-purple-200",
        BUSINESS_BATH:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
      };
      return (
        classes[eventKey] || "bg-gray-50 text-gray-700 border border-gray-200"
      );
    },

    getEventTimeStatus(dateString) {
      const now = new Date();
      const eventDate = new Date(dateString);
      const diffMs = eventDate - now;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      // Событие прошло
      if (diffMs < 0) {
        return {
          label: "Прошло",
          class: "bg-gray-100 text-gray-600 border-gray-300",
          dotClass: "bg-gray-400",
        };
      }

      // Событие скоро (в ближайшие 3 дня)
      if (diffDays <= 3) {
        return {
          label: "Скоро",
          class: "bg-orange-50 text-orange-700 border-orange-200",
          dotClass: "bg-orange-500",
        };
      }

      // Событие в будущем
      return {
        label: "Доступно",
        class: "bg-green-50 text-green-700 border-green-200",
        dotClass: "bg-green-500",
      };
    },

    navigateToEvent(event) {
      // Перенаправляем на соответствующую страницу в зависимости от типа события
      const routes = {
        BACHELOR: "/bachelor",
        BACHELORETTE: "/bachelor",
        BATH_CLUB: "/club-events",
        BUSINESS_BATH: "/club-events",
      };

      const route = routes[event.event_key];
      if (route) {
        this.$router.push(route);
      }
    },
  },
  async created() {
    console.log("EventsPage created");
    await this.loadEvents();
  },

  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log("Филиал изменился, перезагружаем события:", newBranchId);
        this.loadEvents();
      },
    },
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

/* Убираем скроллбар для фильтров */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
