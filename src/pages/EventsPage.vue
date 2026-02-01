<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Шапка - статичная -->
    <div class="bg-[#202c27] text-white px-5 py-6">
      <div class="flex items-center mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft class="h-6 w-6 mr-1" />
          <span class="font-light">Назад</span>
        </button>
      </div>

      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center border-2 border-white/10 backdrop-blur-sm"
        >
          <CalendarDays class="h-8 w-8 text-white" />
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-light tracking-wide">Календарь событий</h1>
          <p class="text-white/70 text-sm mt-1 font-light">
            Ближайшие мероприятия в САНСАРЕ
          </p>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center py-16 px-5"
    >
      <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
      <p class="text-sm text-gray-600 font-light">Загружаем события...</p>
    </div>

    <!-- Ошибка -->
    <div
      v-else-if="error"
      class="mx-5 mt-5 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-sm"
    >
      <div class="flex items-start gap-3">
        <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Контент -->
    <div v-else class="py-5">
      <!-- Фильтры с горизонтальным скроллом -->
      <div class="px-5 mb-5">
        <div class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3
              class="font-semibold text-gray-900 text-[15px] flex items-center gap-2"
            >
              <Target class="h-4 w-4 text-[#c2a886]" />
              Фильтры
            </h3>
            <button
              v-if="selectedFilter !== 'all'"
              @click="selectedFilter = 'all'"
              class="text-sm text-[#c2a886] hover:text-[#b5976e] font-medium"
            >
              Сбросить
            </button>
          </div>

          <div
            class="flex gap-2 overflow-x-auto pb-2 scrollbar-horizontal-filters"
          >
            <button
              @click="selectedFilter = 'all'"
              :class="
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white shadow-md'
                  : 'bg-[#d9cebc] text-gray-700 hover:bg-[#c2a886]/30'
              "
              class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300"
            >
              Все события
            </button>
            <button
              @click="selectedFilter = 'BACHELOR'"
              :class="
                selectedFilter === 'BACHELOR'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-[#d9cebc] text-gray-700 hover:bg-blue-100'
              "
              class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2"
            >
              <User class="h-4 w-4" />
              <span>Коллективная баня</span>
            </button>
            <button
              @click="selectedFilter = 'BACHELORETTE'"
              :class="
                selectedFilter === 'BACHELORETTE'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
                  : 'bg-[#d9cebc] text-gray-700 hover:bg-pink-100'
              "
              class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2"
            >
              <Flower2 class="h-4 w-4" />
              <span>Девичник</span>
            </button>
            <button
              @click="selectedFilter = 'BATH_CLUB'"
              :class="
                selectedFilter === 'BATH_CLUB'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'bg-[#d9cebc] text-gray-700 hover:bg-purple-100'
              "
              class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles class="h-4 w-4" />
              <span>Банный клуб</span>
            </button>
            <button
              @click="selectedFilter = 'BUSINESS_BATH'"
              :class="
                selectedFilter === 'BUSINESS_BATH'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                  : 'bg-[#d9cebc] text-gray-700 hover:bg-emerald-100'
              "
              class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2"
            >
              <Briefcase class="h-4 w-4" />
              <span>Бизнес-баня</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Счетчик событий -->
      <div class="text-sm text-gray-600 mb-4 px-5">
        Найдено событий:
        <span class="font-semibold text-[#c2a886]">{{
          filteredEvents.length
        }}</span>
      </div>

      <!-- Список событий по месяцам -->
      <div v-if="filteredEvents.length > 0" class="space-y-6">
        <div v-for="(monthData, monthKey) in groupedByMonth" :key="monthKey">
          <!-- Заголовок месяца -->
          <div class="flex items-center mb-4 px-5">
            <div
              class="bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md"
            >
              {{ monthData.label }}
            </div>
            <div class="flex-1 h-px bg-[#c2a886]/20 ml-3"></div>
          </div>

          <!-- События месяца -->
          <div class="space-y-3 px-5">
            <div
              v-for="event in monthData.events"
              :key="event.id"
              @click="navigateToEvent(event)"
              class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
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
                      <div
                        :class="getEventIconBgClass(event.event_key)"
                        class="h-10 w-10 rounded-xl flex items-center justify-center"
                      >
                        <component
                          :is="getEventIcon(event.event_key)"
                          class="h-5 w-5 text-white"
                        />
                      </div>
                      <h3
                        class="font-semibold text-gray-900 text-base leading-tight"
                      >
                        {{ event.title }}
                      </h3>
                    </div>
                    <p
                      v-if="event.description"
                      class="text-sm text-gray-600 line-clamp-2"
                    >
                      {{ event.description }}
                    </p>
                  </div>
                  <ChevronRight
                    class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
                  />
                </div>

                <!-- Информация о событии -->
                <div class="space-y-3">
                  <div class="flex flex-wrap gap-2">
                    <!-- Дата и время -->
                    <div
                      class="bg-[#d9cebc]/60 px-3 py-1.5 rounded-lg border border-[#c2a886]/20 flex items-center gap-1.5"
                    >
                      <Calendar class="h-3.5 w-3.5 text-[#c2a886]" />
                      <span class="text-xs font-medium text-gray-700">
                        {{ formatDate(event.start_date) }}
                      </span>
                    </div>

                    <!-- Длительность -->
                    <div
                      class="bg-[#d9cebc]/60 px-3 py-1.5 rounded-lg border border-[#c2a886]/20 flex items-center gap-1.5"
                    >
                      <Clock class="h-3.5 w-3.5 text-[#c2a886]" />
                      <span class="text-xs font-medium text-gray-700">
                        {{ formatDuration(event.duration_minutes) }}
                      </span>
                    </div>

                    <!-- Тип события -->
                    <div
                      :class="getEventBadgeClass(event.event_key)"
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                    >
                      {{ getEventTypeName(event.event_key) }}
                    </div>
                  </div>

                  <!-- Занятость мест -->
                  <div
                    v-if="event.max_participants"
                    class="bg-[#d9cebc]/60 rounded-lg border border-[#c2a886]/20 p-3"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-medium text-gray-700"
                        >Занятость мест</span
                      >
                      <span class="text-xs font-bold text-gray-900">
                        {{ event.occupied_slots || 0 }} /
                        {{ event.max_participants }}
                      </span>
                    </div>
                    <!-- Прогресс-бар -->
                    <div
                      class="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
                    >
                      <div
                        :class="getOccupancyBarColor(event)"
                        class="h-2 rounded-full transition-all duration-300"
                        :style="{ width: getOccupancyPercentage(event) + '%' }"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      Свободно мест: {{ getAvailableSlots(event) }}
                    </p>
                  </div>

                  <!-- Кнопка бронирования -->
                  <button
                    @click.stop="openBooking(event)"
                    :disabled="isEventFull(event)"
                    :class="
                      isEventFull(event)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white active:scale-[0.98]'
                    "
                    class="w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-md"
                  >
                    <CalendarCheck
                      v-if="!isEventFull(event)"
                      class="h-4 w-4 mr-2"
                    />
                    <XCircle v-else class="h-4 w-4 mr-2" />
                    <span class="text-sm">
                      {{ isEventFull(event) ? "Мест нет" : "Забронировать" }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет событий -->
      <div v-else class="text-center py-12 px-5">
        <div
          class="w-20 h-20 bg-[#e3ded3] rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CalendarDays class="h-10 w-10 text-[#c2a886]" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет событий</h3>
        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
          {{
            selectedFilter === "all"
              ? "В ближайшее время нет запланированных мероприятий"
              : "Нет событий по выбранному фильтру"
          }}
        </p>
        <button
          v-if="selectedFilter !== 'all'"
          @click="selectedFilter = 'all'"
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white rounded-xl font-medium hover:from-[#b5976e] hover:to-[#a68a5f] transition-all duration-300 shadow-md active:scale-[0.98]"
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
import icons from "@/utils/icons";

export default {
  name: "EventsPage",
  components: {
    ...icons,
    Clock: icons.Clock || icons.Calendar,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      events: [],
      selectedFilter: "all",
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch"]),

    filteredEvents() {
      // Фильтруем только будущие события (не прошедшие)
      const now = new Date();
      let filtered = this.events.filter((event) => {
        const eventDate = new Date(event.start_date);
        return eventDate >= now; // Только события в будущем или сегодня
      });

      // Применяем фильтр по типу
      if (this.selectedFilter !== "all") {
        filtered = filtered.filter(
          (event) => event.event_key === this.selectedFilter
        );
      }

      return filtered;
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
        this.error = null;

        const branchId = this.selectedBranch?.id;
        if (!branchId) {
          throw new Error("Филиал не выбран");
        }

        console.log("Загрузка событий для филиала:", branchId);

        const data = await eventAPI.getAll(branchId);

        if (Array.isArray(data)) {
          // Фильтруем по текущему филиалу и сортируем
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
        BACHELOR: "Коллективная баня",
        BACHELORETTE: "Девичник",
        BATH_CLUB: "Банный клуб",
        BUSINESS_BATH: "Бизнес-баня",
      };
      return types[eventKey] || "Событие";
    },

    getEventIcon(eventKey) {
      const iconMap = {
        BACHELOR: "User",
        BACHELORETTE: "Flower2",
        BATH_CLUB: "Sparkles",
        BUSINESS_BATH: "Briefcase",
      };
      return iconMap[eventKey] || "CalendarDays";
    },

    getEventColorClass(eventKey) {
      const colors = {
        BACHELOR: "bg-gradient-to-r from-blue-500 to-blue-600",
        BACHELORETTE: "bg-gradient-to-r from-pink-500 to-pink-600",
        BATH_CLUB: "bg-gradient-to-r from-purple-500 to-purple-600",
        BUSINESS_BATH: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      };
      return colors[eventKey] || "bg-gradient-to-r from-[#c2a886] to-[#b5976e]";
    },

    getEventIconBgClass(eventKey) {
      const classes = {
        BACHELOR: "bg-gradient-to-br from-blue-500 to-blue-600",
        BACHELORETTE: "bg-gradient-to-br from-pink-500 to-pink-600",
        BATH_CLUB: "bg-gradient-to-br from-purple-500 to-purple-600",
        BUSINESS_BATH: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      };
      return (
        classes[eventKey] || "bg-gradient-to-br from-[#c2a886] to-[#b5976e]"
      );
    },

    getEventBadgeClass(eventKey) {
      const classes = {
        BACHELOR: "bg-blue-50 text-blue-700 border-blue-200",
        BACHELORETTE: "bg-pink-50 text-pink-700 border-pink-200",
        BATH_CLUB: "bg-purple-50 text-purple-700 border-purple-200",
        BUSINESS_BATH: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
      return classes[eventKey] || "bg-gray-50 text-gray-700 border-gray-200";
    },

    navigateToEvent(event) {
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

    // Проверка заполненности события
    isEventFull(event) {
      if (!event.max_participants) return false;
      const occupied = event.occupied_slots || 0;
      return occupied >= event.max_participants;
    },

    // Процент занятости
    getOccupancyPercentage(event) {
      if (!event.max_participants) return 0;
      const occupied = event.occupied_slots || 0;
      return Math.min((occupied / event.max_participants) * 100, 100);
    },

    // Свободные места
    getAvailableSlots(event) {
      if (!event.max_participants) return 0;
      const occupied = event.occupied_slots || 0;
      return Math.max(event.max_participants - occupied, 0);
    },

    // Цвет прогресс-бара в зависимости от занятости
    getOccupancyBarColor(event) {
      const percentage = this.getOccupancyPercentage(event);
      if (percentage >= 100) return "bg-red-500";
      if (percentage >= 80) return "bg-orange-500";
      if (percentage >= 50) return "bg-yellow-500";
      return "bg-green-500";
    },

    // Открыть модалку бронирования
    openBooking(event) {
      if (this.isEventFull(event)) {
        return;
      }

      // Импортируем eventBus
      import("@/utils/eventBus").then(({ openBookingModal }) => {
        openBookingModal(
          null, // program
          event.event_key, // eventKey
          event.title // title
        );
      });
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
/* Горизонтальный скролл для фильтров - ВСЕГДА ВИДИМЫЙ */
.scrollbar-horizontal-filters {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.scrollbar-horizontal-filters::-webkit-scrollbar {
  height: 8px;
}

.scrollbar-horizontal-filters::-webkit-scrollbar-track {
  background: rgba(194, 168, 134, 0.1);
  border-radius: 10px;
}

.scrollbar-horizontal-filters::-webkit-scrollbar-thumb {
  background: rgba(194, 168, 134, 0.6);
  border-radius: 10px;
}

.scrollbar-horizontal-filters::-webkit-scrollbar-thumb:hover {
  background: rgba(194, 168, 134, 0.8);
}

.scrollbar-horizontal-filters {
  scrollbar-width: thin;
  scrollbar-color: rgba(194, 168, 134, 0.6) rgba(194, 168, 134, 0.1);
}

/* Горизонтальный скролл для событий */
.scrollbar-horizontal::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-horizontal::-webkit-scrollbar-track {
  background: rgba(194, 168, 134, 0.1);
  border-radius: 10px;
}

.scrollbar-horizontal::-webkit-scrollbar-thumb {
  background: rgba(194, 168, 134, 0.5);
  border-radius: 10px;
}

.scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
  background: rgba(194, 168, 134, 0.7);
}

.scrollbar-horizontal {
  scrollbar-width: thin;
  scrollbar-color: rgba(194, 168, 134, 0.5) rgba(194, 168, 134, 0.1);
}

/* Line clamp для описания */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
