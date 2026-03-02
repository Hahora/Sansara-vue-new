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

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center border-2 border-white/10 backdrop-blur-sm"
          >
            <CalendarCheck class="h-8 w-8 text-white" />
          </div>
          <div class="ml-4 flex-1">
            <h1 class="text-2xl font-light tracking-wide">
              История бронирований
            </h1>
            <p class="text-white/70 text-sm mt-1 font-light">Все ваши записи</p>
          </div>
        </div>
        <div v-if="stats.total > 0" class="text-right">
          <div class="text-3xl font-light text-[#c2a886]">
            {{ filteredBookings.length }}
          </div>
          <div class="text-xs text-white/70">
            {{ filteredBookings.length === stats.total ? "всего" : "найдено" }}
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры по статусам -->
    <div class="px-5 py-4">
      <div class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-4">
        <div
          class="flex gap-2 overflow-x-auto pb-2 scrollbar-horizontal-filters"
        >
          <button
            @click="selectedStatus = null"
            :class="
              selectedStatus === null
                ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white shadow-md'
                : 'bg-[#d9cebc] text-gray-700 hover:bg-[#c2a886]/30'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5"
          >
            <span>Все</span>
            <span class="text-xs opacity-75">({{ stats.total || 0 }})</span>
          </button>
          <button
            @click="selectedStatus = 'PENDING'"
            :class="
              selectedStatus === 'PENDING'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'
                : 'bg-[#d9cebc] text-gray-700 hover:bg-yellow-100'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5"
          >
            <Clock class="h-3.5 w-3.5" />
            <span>Ожидает</span>
            <span class="text-xs opacity-75"
              >({{ stats.pending_count || 0 }})</span
            >
          </button>
          <button
            @click="selectedStatus = 'CONFIRMED'"
            :class="
              selectedStatus === 'CONFIRMED'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                : 'bg-[#d9cebc] text-gray-700 hover:bg-green-100'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5"
          >
            <CheckCircle class="h-3.5 w-3.5" />
            <span>Подтверждено</span>
            <span class="text-xs opacity-75"
              >({{ stats.confirmed_count || 0 }})</span
            >
          </button>
          <button
            @click="selectedStatus = 'CANCELLED'"
            :class="
              selectedStatus === 'CANCELLED'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                : 'bg-[#d9cebc] text-gray-700 hover:bg-red-100'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5"
          >
            <XCircle class="h-3.5 w-3.5" />
            <span>Отменено</span>
            <span class="text-xs opacity-75"
              >({{ stats.cancelled_count || 0 }})</span
            >
          </button>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center py-16 px-5"
    >
      <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
      <p class="text-sm text-gray-600 font-light">Загружаем бронирования...</p>
    </div>

    <!-- Ошибка -->
    <div
      v-else-if="error"
      class="mx-5 mt-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-sm"
    >
      <div class="flex items-start gap-3">
        <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Список бронирований -->
    <div class="px-5 pb-5">
      <!-- Есть бронирования -->
      <div v-if="filteredBookings.length > 0" class="space-y-3">
        <div
          v-for="booking in filteredBookings"
          :key="booking.id"
          class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden shadow-sm"
        >
          <!-- Цветная полоска сверху -->
          <div :class="getStatusColorClass(booking.status)" class="h-1"></div>

          <div class="p-4">
            <!-- Заголовок и статус -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <h3 class="font-semibold text-gray-900 text-[15px]">
                    {{ booking.title || "Без названия" }}
                  </h3>
                  <span :class="getBookingTypeClass(booking)" class="text-xs px-1.5 py-0.5 rounded font-medium">
                    {{ getBookingTypeLabel(booking) }}
                  </span>
                </div>
                <!-- Филиал -->
                <p
                  v-if="getBranchName(booking.branch_id)"
                  class="text-xs text-gray-600 mb-2 flex items-center gap-1"
                >
                  <MapPin class="h-3 w-3 flex-shrink-0 text-[#c2a886]" />
                  {{ getBranchName(booking.branch_id) }}
                </p>
                <div class="space-y-2">
                  <!-- Дата и время посещения (главная информация) -->
                  <div
                    v-if="booking.booking_date"
                    class="flex items-center gap-2 flex-wrap"
                  >
                    <div
                      class="bg-[#c2a886]/10 rounded-lg px-2 py-1 flex items-center gap-1.5"
                    >
                      <CalendarCheck class="h-3.5 w-3.5 text-[#c2a886]" />
                      <span class="text-sm font-semibold text-gray-900">
                        {{
                          formatBookingDateTime(
                            booking.booking_date,
                            booking.booking_time
                          )
                        }}
                      </span>
                    </div>
                    <div
                      :class="getStatusBadgeClass(booking.status)"
                      class="px-2 py-0.5 rounded-lg text-xs font-semibold border"
                    >
                      {{ getStatusLabel(booking.status) }}
                    </div>
                  </div>

                  <!-- Fallback если нет booking_date -->
                  <div v-else class="flex items-center gap-2 flex-wrap">
                    <div
                      class="bg-gray-100 rounded-lg px-2 py-1 flex items-center gap-1.5"
                    >
                      <Calendar class="h-3.5 w-3.5 text-gray-600" />
                      <span class="text-sm font-medium text-gray-700">
                        {{ formatDateTime(booking.created_at) }}
                      </span>
                    </div>
                    <div
                      :class="getStatusBadgeClass(booking.status)"
                      class="px-2 py-0.5 rounded-lg text-xs font-semibold border"
                    >
                      {{ getStatusLabel(booking.status) }}
                    </div>
                  </div>

                  <!-- Дата создания заявки (только если есть booking_date) -->
                  <div
                    v-if="booking.booking_date"
                    class="flex items-center gap-1 text-xs text-gray-500"
                  >
                    <Clock class="h-3 w-3" />
                    <span
                      >Заявка от
                      {{ formatCreatedDate(booking.created_at) }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="text-right ml-2 flex-shrink-0">
                <div
                  class="h-12 w-12 bg-[#d9cebc]/60 rounded-xl flex flex-col items-center justify-center border border-[#c2a886]/30"
                >
                  <Users class="h-4 w-4 text-[#c2a886] mb-0.5" />
                  <div class="text-xs font-bold text-gray-900">
                    {{ booking.participants_count }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Контактная информация -->
            <div
              class="mb-3 space-y-2 bg-[#d9cebc]/40 rounded-lg p-3 border border-[#c2a886]/20"
            >
              <div class="flex items-center text-sm gap-2">
                <UserIcon class="h-4 w-4 text-[#c2a886] flex-shrink-0" />
                <span class="text-gray-700 truncate font-medium">{{
                  booking.contact_name
                }}</span>
              </div>
              <div class="flex items-center text-sm gap-2">
                <Phone class="h-4 w-4 text-[#c2a886] flex-shrink-0" />
                <span class="text-gray-700 truncate">{{
                  booking.contact_phone
                }}</span>
              </div>
            </div>

            <!-- Дополнительная информация -->
            <div class="space-y-2">
              <!-- Комментарий -->
              <div v-if="booking.comment && booking.comment.trim()">
                <div
                  class="flex items-start bg-[#d9cebc]/40 rounded-lg p-3 border border-[#c2a886]/20"
                >
                  <FileText
                    class="h-4 w-4 text-[#c2a886] mr-2 mt-0.5 flex-shrink-0"
                  />
                  <p class="text-sm text-gray-700 italic flex-1">
                    {{ booking.comment }}
                  </p>
                </div>
              </div>

              <!-- Промокод и скидка -->
              <div
                v-if="booking.promo_code"
                class="flex items-center gap-2 flex-wrap"
              >
                <div
                  class="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded-lg border border-purple-200"
                >
                  <Ticket class="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span class="font-medium">{{ booking.promo_code }}</span>
                </div>
                <span
                  v-if="booking.discount_percent"
                  class="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded-lg border border-green-200 font-semibold"
                >
                  -{{ booking.discount_percent }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет бронирований -->
      <div v-else-if="!isLoading" class="text-center py-12">
        <div
          class="w-20 h-20 bg-[#e3ded3] rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CalendarCheck class="h-10 w-10 text-[#c2a886]" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{
            selectedStatus
              ? "Нет бронирований с таким статусом"
              : "Нет бронирований"
          }}
        </h3>
        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
          {{
            selectedStatus
              ? "Попробуйте выбрать другой статус или сбросить фильтр"
              : "У вас пока нет записей. Выберите программу или мероприятие и забронируйте посещение!"
          }}
        </p>
        <div v-if="!selectedStatus" class="flex gap-3 justify-center">
          <router-link
            to="/programs"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white rounded-xl font-medium hover:from-[#b5976e] hover:to-[#a68a5f] transition-all duration-300 shadow-md"
          >
            Программы
          </router-link>
          <router-link
            to="/events"
            class="inline-flex items-center px-6 py-3 bg-[#d9cebc] text-gray-800 rounded-xl font-medium hover:bg-[#c2a886]/30 transition-all duration-300"
          >
            Мероприятия
          </router-link>
        </div>
        <button
          v-if="selectedStatus"
          @click="selectedStatus = null"
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white rounded-xl font-medium hover:from-[#b5976e] hover:to-[#a68a5f] transition-all duration-300 shadow-md mt-4"
        >
          Показать все
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { bookingAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "BookingHistoryPage",
  components: {
    ...icons,
    Clock: icons.Clock || icons.Calendar,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      bookings: [],
      stats: {
        total: 0,
        pending_count: 0,
        confirmed_count: 0,
        cancelled_count: 0,
      },
      selectedStatus: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ["user", "branches"]),

    filteredBookings() {
      if (!this.selectedStatus) {
        return this.bookings;
      }
      return this.bookings.filter(
        (booking) => booking.status === this.selectedStatus
      );
    },
  },
  methods: {
    async loadBookings() {
      try {
        this.error = null;

        console.log("Загрузка истории бронирований");

        const response = await bookingAPI.getMyBookings();

        let bookingsData = [];

        if (response && typeof response === "object") {
          if (Array.isArray(response.bookings)) {
            bookingsData = response.bookings;

            this.stats.total = response.total || 0;
            this.stats.pending_count = response.pending_count || 0;
            this.stats.confirmed_count = response.confirmed_count || 0;
            this.stats.cancelled_count = response.cancelled_count || 0;
          } else if (Array.isArray(response)) {
            bookingsData = response;

            this.stats.total = bookingsData.length;
            this.stats.pending_count = bookingsData.filter(
              (b) => b.status === "PENDING"
            ).length;
            this.stats.confirmed_count = bookingsData.filter(
              (b) => b.status === "CONFIRMED"
            ).length;
            this.stats.cancelled_count = bookingsData.filter(
              (b) => b.status === "CANCELLED"
            ).length;
          }
        }

        bookingsData.sort((a, b) => {
          // Сортируем по дате бронирования (booking_date) если есть, иначе по created_at
          const dateA = a.booking_date
            ? new Date(a.booking_date + " " + (a.booking_time || "00:00"))
            : new Date(a.created_at);
          const dateB = b.booking_date
            ? new Date(b.booking_date + " " + (b.booking_time || "00:00"))
            : new Date(b.created_at);
          return dateB - dateA; // Новые сверху
        });

        this.bookings = bookingsData;
        console.log("Загружено бронирований:", this.bookings.length);
      } catch (error) {
        console.error("Ошибка при загрузке бронирований:", error);
        this.error =
          error.message || "Не удалось загрузить историю бронирований";
        this.bookings = [];

        if (error.response?.status === 401) {
          this.error = "Требуется авторизация. Пожалуйста, войдите в систему.";
        } else if (error.response?.status === 403) {
          this.error = "У вас нет доступа к истории бронирований.";
        }
      } finally {
        this.isLoading = false;
      }
    },

    formatDateTime(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
      }
    },

    formatBookingDateTime(bookingDate, bookingTime) {
      if (!bookingDate) {
        return "Дата не указана";
      }

      try {
        // bookingDate в формате "2025-02-15"
        // bookingTime в формате "18:00"
        const [year, month, day] = bookingDate.split("-");
        const dateObj = new Date(year, month - 1, day);

        // Форматируем дату
        const formattedDate = dateObj.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Добавляем время если есть
        if (bookingTime) {
          return `${formattedDate}, ${bookingTime}`;
        }

        return formattedDate;
      } catch (e) {
        console.error("Ошибка форматирования даты бронирования:", e);
        return bookingDate;
      }
    },

    formatCreatedDate(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Если сегодня
        if (diffDays === 0) {
          return (
            date.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            }) + " (сегодня)"
          );
        }

        // Если вчера
        if (diffDays === 1) {
          return (
            date.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            }) + " (вчера)"
          );
        }

        // Если в этом году
        if (date.getFullYear() === now.getFullYear()) {
          return date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        // Полная дата
        return date.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch (error) {
        console.error("Error formatting created date:", error);
        return dateString;
      }
    },

    getGuestWord(count) {
      if (!count) count = 1;
      return "чел.";
    },

    getBookingTypeLabel(booking) {
      if (booking.program_id) return "Программа";
      if (booking.event_id) return "Мероприятие";
      if (booking.event_calendar_id) return "По расписанию";
      return "";
    },

    getBookingTypeClass(booking) {
      if (booking.program_id) return "bg-blue-50 text-blue-700 border border-blue-200";
      if (booking.event_id) return "bg-pink-50 text-pink-700 border border-pink-200";
      if (booking.event_calendar_id) return "bg-purple-50 text-purple-700 border border-purple-200";
      return "hidden";
    },

    getStatusLabel(status) {
      const labels = {
        PENDING: "Ожидает",
        CONFIRMED: "Подтверждено",
        CANCELLED: "Отменено",
      };
      return labels[status] || status;
    },

    getStatusColorClass(status) {
      const colors = {
        PENDING: "bg-gradient-to-r from-yellow-500 to-yellow-600",
        CONFIRMED: "bg-gradient-to-r from-green-500 to-green-600",
        CANCELLED: "bg-gradient-to-r from-red-500 to-red-600",
      };
      return colors[status] || "bg-gradient-to-r from-[#c2a886] to-[#b5976e]";
    },

    getStatusBadgeClass(status) {
      const classes = {
        PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
        CONFIRMED: "bg-green-50 text-green-700 border-green-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
      };
      return classes[status] || "bg-gray-50 text-gray-700 border-gray-200";
    },

    getBranchName(branchId) {
      if (!branchId || !this.branches) return "";
      const branch = this.branches.find((b) => b.id === branchId);
      return branch ? branch.name : "";
    },
  },
  async created() {
    console.log("BookingHistoryPage created");

    const store = useAppStore();
    if (!store.areBranchesLoaded) {
      try {
        await store.loadBranches();
      } catch (error) {
        console.error("Failed to load branches:", error);
      }
    }

    if (!this.user) {
      console.warn("User not authenticated");
      this.error = "Требуется авторизация. Пожалуйста, войдите в систему.";
      this.isLoading = false;
      return;
    }

    await this.loadBookings();
  },
};
</script>

<style scoped>
/* Горизонтальный скролл для фильтров */
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
</style>
