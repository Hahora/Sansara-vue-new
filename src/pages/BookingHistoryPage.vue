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
            📋
          </div>
          <div class="ml-4 flex-1">
            <h1 class="text-2xl font-bold">История бронирований</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Все ваши записи
            </p>
          </div>
        </div>
        <div class="text-right">
          <div v-if="stats.total > 0" class="text-white">
            <div class="text-3xl font-bold">{{ filteredBookings.length }}</div>
            <div class="text-sm opacity-90">
              {{
                filteredBookings.length === stats.total ? "всего" : "найдено"
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры по статусам -->
    <div class="px-4 py-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="selectedStatus = null"
            :class="
              selectedStatus === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>Все</span>
            <span class="text-xs opacity-75">({{ stats.total || 0 }})</span>
          </button>
          <button
            @click="selectedStatus = 'PENDING'"
            :class="
              selectedStatus === 'PENDING'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>Ожидает</span>
            <span class="text-xs opacity-75"
              >({{ stats.pending_count || 0 }})</span
            >
          </button>
          <button
            @click="selectedStatus = 'CONFIRMED'"
            :class="
              selectedStatus === 'CONFIRMED'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>Подтверждено</span>
            <span class="text-xs opacity-75"
              >({{ stats.confirmed_count || 0 }})</span
            >
          </button>
          <button
            @click="selectedStatus = 'CANCELLED'"
            :class="
              selectedStatus === 'CANCELLED'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>Отменено</span>
            <span class="text-xs opacity-75"
              >({{ stats.cancelled_count || 0 }})</span
            >
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

    <!-- Список бронирований -->
    <div class="px-4 pb-5">
      <!-- Есть бронирования -->
      <div v-if="filteredBookings.length > 0" class="space-y-3">
        <div
          v-for="booking in filteredBookings"
          :key="booking.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска сверху -->
          <div :class="getStatusColorClass(booking.status)" class="h-1"></div>

          <div class="p-4">
            <!-- Заголовок и статус -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 text-base mb-1">
                  {{ booking.title }}
                </h3>
                <!-- Филиал -->
                <p
                  v-if="getBranchName(booking.branch_id)"
                  class="text-xs text-gray-500 mb-2 flex items-center"
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
                  {{ getBranchName(booking.branch_id) }}
                </p>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs text-gray-500">
                    {{ formatDateTime(booking.created_at) }}
                  </span>
                  <div
                    :class="getStatusBadgeClass(booking.status)"
                    class="px-2 py-0.5 rounded text-xs font-semibold"
                  >
                    {{ getStatusLabel(booking.status) }}
                  </div>
                </div>
              </div>
              <div class="text-right ml-2">
                <div class="text-sm font-semibold text-gray-900">
                  {{ booking.participants_count }}
                  {{ getGuestWord(booking.participants_count) }}
                </div>
              </div>
            </div>

            <!-- Контактная информация -->
            <div class="mb-3 space-y-2">
              <div class="flex items-center text-sm">
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
                <span class="text-gray-600 truncate">{{
                  booking.contact_name
                }}</span>
              </div>
              <div class="flex items-center text-sm">
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-gray-600 truncate">{{
                  booking.contact_phone
                }}</span>
              </div>
            </div>

            <!-- Дополнительная информация -->
            <div class="space-y-2">
              <!-- Комментарий -->
              <div v-if="booking.comment && booking.comment.trim()">
                <div class="flex items-start">
                  <svg
                    class="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <p class="text-sm text-gray-600 italic flex-1">
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
                  class="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded border border-purple-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-purple-600 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v4H4V6zm2 1a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V8a1 1 0 00-1-1H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="font-medium">{{ booking.promo_code }}</span>
                </div>
                <span
                  v-if="booking.discount_percent"
                  class="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded border border-green-200 font-semibold"
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
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">📋</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{
            selectedStatus
              ? "Нет бронирований с таким статусом"
              : "Нет бронирований"
          }}
        </h3>
        <p class="text-sm text-gray-600 mb-6">
          {{
            selectedStatus
              ? "Попробуйте выбрать другой статус или сбросить фильтр"
              : "У вас пока нет записей. Выберите программу или мероприятие и забронируйте посещение!"
          }}
        </p>
        <div v-if="!selectedStatus" class="flex gap-3 justify-center">
          <router-link
            to="/programs"
            class="inline-flex items-center px-6 py-3 bg-[#4e5d51] text-white rounded-xl font-medium hover:bg-[#3d4a40] transition-colors"
          >
            Программы
          </router-link>
          <router-link
            to="/events"
            class="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Мероприятия
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { bookingAPI } from "@/utils/api";

export default {
  name: "BookingHistoryPage",
  data() {
    return {
      isLoading: false,
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
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка истории бронирований");

        const response = await bookingAPI.getMyBookings();

        console.log("API response:", response);

        let bookingsData = [];

        // Обрабатываем ответ API
        if (response && typeof response === "object") {
          // Извлекаем бронирования
          if (Array.isArray(response.bookings)) {
            bookingsData = response.bookings;

            // Извлекаем статистику из ответа
            this.stats.total = response.total || 0;
            this.stats.pending_count = response.pending_count || 0;
            this.stats.confirmed_count = response.confirmed_count || 0;
            this.stats.cancelled_count = response.cancelled_count || 0;
          } else if (Array.isArray(response)) {
            // Если ответ - просто массив
            bookingsData = response;

            // Считаем статистику сами
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

        console.log("Статистика извлечена:", this.stats);

        // Сортируем по дате создания (новые сверху)
        bookingsData.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        this.bookings = bookingsData;
        console.log("Загружено бронирований:", this.bookings.length);
        console.log("Статистика:", this.stats);
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

    getGuestWord(count) {
      if (!count) count = 1;
      if (count === 1) return "чел.";
      if (count >= 2 && count <= 4) return "чел.";
      return "чел.";
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
        PENDING: "bg-yellow-500",
        CONFIRMED: "bg-green-500",
        CANCELLED: "bg-red-500",
      };
      return colors[status] || "bg-gray-500";
    },

    getStatusBadgeClass(status) {
      const classes = {
        PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        CONFIRMED: "bg-green-50 text-green-700 border border-green-200",
        CANCELLED: "bg-red-50 text-red-700 border border-red-200",
      };
      return (
        classes[status] || "bg-gray-50 text-gray-700 border border-gray-200"
      );
    },

    getBranchName(branchId) {
      if (!branchId || !this.branches) return "";
      const branch = this.branches.find((b) => b.id === branchId);
      return branch ? branch.name : "";
    },
  },
  async created() {
    console.log("BookingHistoryPage created");

    // Загружаем филиалы если еще не загружены
    const store = useAppStore();
    if (!store.areBranchesLoaded) {
      console.log("Loading branches...");
      try {
        await store.loadBranches();
        console.log("Branches loaded");
      } catch (error) {
        console.error("Failed to load branches:", error);
      }
    }

    if (!this.user) {
      console.warn("User not authenticated");
      this.error = "Требуется авторизация. Пожалуйста, войдите в систему.";
      return;
    }

    console.log("User authenticated, loading bookings...");
    await this.loadBookings();
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
