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
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление бронированиями</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ totalBookings }}
            </p>
          </div>
        </div>

        <!-- Кнопка обновления -->
        <button
          @click="loadBookings"
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

    <!-- Фильтры -->
    <div class="px-4 py-4 space-y-3">
      <!-- Поиск по имени -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Поиск по имени или телефону
        </h3>
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Введите имя или телефон..."
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

      <!-- Статус -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Фильтр по статусу
        </h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.status = null;
              applyFilters();
            "
            :class="
              filters.status === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все
          </button>
          <button
            @click="
              filters.status = 'PENDING';
              applyFilters();
            "
            :class="
              filters.status === 'PENDING'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Ожидает
          </button>
          <button
            @click="
              filters.status = 'CONFIRMED';
              applyFilters();
            "
            :class="
              filters.status === 'CONFIRMED'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Подтверждено
          </button>
          <button
            @click="
              filters.status = 'CANCELLED';
              applyFilters();
            "
            :class="
              filters.status === 'CANCELLED'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Отменено
          </button>
        </div>
      </div>

      <!-- Даты -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Фильтр по дате</h3>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 block mb-1">От</label>
            <input
              v-model="filters.date_from"
              type="date"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label class="text-xs text-gray-600 block mb-1">До</label>
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
    <div v-else class="px-4 pb-5">
      <!-- Счётчик -->
      <div class="text-sm text-gray-600 mb-3">
        Найдено: <span class="font-semibold">{{ bookings.length }}</span>
      </div>

      <!-- Бронирования -->
      <div v-if="bookings.length > 0" class="space-y-3">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска -->
          <div :class="getStatusColorClass(booking.status)" class="h-1"></div>

          <div class="p-4">
            <!-- Заголовок и кнопки -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 text-base">
                    {{ booking.contact_name || "Гость" }}
                  </h3>
                  <span class="text-sm text-gray-500">
                    ID: {{ booking.user_id }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">
                  {{ booking.title || "Без названия" }}
                </p>
                <!-- Филиал -->
                <p
                  v-if="getBranchName(booking.branch_id)"
                  class="text-xs text-gray-500 mt-1 flex items-center"
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
              </div>

              <!-- Статус -->
              <div class="flex flex-col items-end gap-2">
                <div
                  :class="getStatusBadgeClass(booking.status)"
                  class="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  {{ getStatusLabel(booking.status) }}
                </div>
                <!-- Меню действий -->
                <button
                  @click="toggleBookingMenu(booking.id)"
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
              <!-- Дата создания -->
              <div class="flex items-center text-sm text-gray-600">
                <svg
                  class="w-4 h-4 mr-2 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ formatDateTime(booking.created_at) }}
              </div>

              <!-- Контакты -->
              <div class="flex items-center text-sm text-gray-600">
                <svg
                  class="w-4 h-4 mr-2 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                  />
                </svg>
                {{ booking.contact_phone || "Не указан" }}
              </div>

              <!-- Участники -->
              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                    />
                  </svg>
                  {{ booking.participants_count || 1 }}
                  {{ getGuestWord(booking.participants_count) }}
                </div>

                <!-- Промокод и скидка -->
                <div v-if="booking.promo_code" class="flex items-center gap-2">
                  <div
                    class="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded border border-purple-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-purple-600 flex-shrink-0"
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

              <!-- Комментарий -->
              <div
                v-if="booking.comment"
                class="mt-2 pt-2 border-t border-gray-100"
              >
                <p class="text-xs text-gray-500 italic">
                  {{ booking.comment }}
                </p>
              </div>
            </div>

            <!-- Меню действий -->
            <div
              v-if="openMenuId === booking.id"
              class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2"
            >
              <button
                @click="updateStatus(booking.id, 'CONFIRMED')"
                :disabled="booking.status === 'CONFIRMED'"
                class="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                ✓ Подтвердить
              </button>
              <button
                @click="updateStatus(booking.id, 'CANCELLED')"
                :disabled="booking.status === 'CANCELLED'"
                class="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                ✗ Отменить
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет бронирований -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">📋</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Нет бронирований
        </h3>
        <p class="text-sm text-gray-600">
          {{
            filters.status
              ? "По выбранному фильтру бронирований не найдено"
              : "Бронирования ещё не созданы"
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { bookingAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "AdminBookingsPage",
  data() {
    return {
      isLoading: false,
      error: null,
      bookings: [],
      allBookings: [], // Храним все бронирования
      totalBookings: 0,
      searchQuery: "",
      filters: {
        status: null,
        date_from: null,
        date_to: null,
      },
      openMenuId: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),
  },
  methods: {
    getBranchName(branchId) {
      if (!branchId || !this.branches) return "";
      const branch = this.branches.find((b) => b.id === branchId);
      return branch ? branch.name : "";
    },
    async loadBookings() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка бронирований с фильтрами:", this.filters);

        let data;

        // Если есть фильтры - используем filter endpoint
        if (
          this.filters.status ||
          this.filters.date_from ||
          this.filters.date_to
        ) {
          const params = {};
          if (this.filters.status) params.status = this.filters.status;
          if (this.filters.date_from) params.date_from = this.filters.date_from;
          if (this.filters.date_to) params.date_to = this.filters.date_to;

          data = await bookingAPI.filter(params);
        } else {
          // Иначе загружаем все
          data = await bookingAPI.getAll();
        }

        if (Array.isArray(data)) {
          this.allBookings = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // Применяем поиск по имени
          this.applySearch();

          this.totalBookings = this.allBookings.length;
          console.log("Загружено бронирований:", this.allBookings.length);
        } else {
          this.allBookings = [];
          this.bookings = [];
          this.totalBookings = 0;
        }
      } catch (error) {
        console.error("Ошибка при загрузке бронирований:", error);
        this.error = error.message || "Не удалось загрузить бронирования";
        this.allBookings = [];
        this.bookings = [];
      } finally {
        this.isLoading = false;
      }
    },

    applySearch() {
      if (!this.searchQuery.trim()) {
        this.bookings = this.allBookings;
      } else {
        const query = this.searchQuery.toLowerCase().trim();
        this.bookings = this.allBookings.filter((booking) => {
          const name = (booking.contact_name || "").toLowerCase();
          const phone = (booking.contact_phone || "").toLowerCase();
          return name.includes(query) || phone.includes(query);
        });
      }
    },

    onSearchInput() {
      // Применяем поиск только локально, без перезагрузки с сервера
      this.applySearch();
    },

    applyFilters() {
      // Всегда перезагружаем с сервера с учетом фильтров
      this.loadBookings();
    },

    clearDateFilters() {
      this.filters.date_from = null;
      this.filters.date_to = null;
      this.applyFilters();
    },

    toggleBookingMenu(bookingId) {
      this.openMenuId = this.openMenuId === bookingId ? null : bookingId;
    },

    async updateStatus(bookingId, newStatus) {
      try {
        console.log(
          `Обновление статуса бронирования ${bookingId} на ${newStatus}`
        );

        await bookingAPI.updateStatus(bookingId, newStatus);

        // Обновляем локально
        const booking = this.bookings.find((b) => b.id === bookingId);
        if (booking) {
          booking.status = newStatus;
        }

        this.openMenuId = null;
      } catch (error) {
        console.error("Ошибка при обновлении статуса:", error);
        alert("Не удалось обновить статус: " + error.message);
      }
    },

    formatDateTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    getGuestWord(count) {
      if (!count) count = 1;
      if (count === 1) return "участник";
      if (count >= 2 && count <= 4) return "участника";
      return "участников";
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
  },

  async created() {
    console.log("AdminBookingsPage created");

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
