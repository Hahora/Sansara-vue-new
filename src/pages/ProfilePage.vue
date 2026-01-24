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

      <!-- Информация о пользователе в шапке -->
      <div v-if="user" class="flex items-center">
        <div
          class="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl border-2 border-white border-opacity-30"
        >
          {{ getUserInitials }}
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">{{ getUserFullName || "Гость" }}</h1>
          <p class="text-white text-opacity-90 text-sm mt-1">
            @{{ user.username || user.telegram_id }}
          </p>
        </div>
        <!-- Кнопка редактирования -->
        <button
          @click="showEditModal = true"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Индикатор загрузки статистики -->
    <div
      v-if="loadingStats && !statsLoaded"
      class="flex justify-center items-center py-8"
    >
      <div class="relative">
        <div
          class="animate-spin rounded-full h-8 w-8 border-4 border-[#4e5d51] border-opacity-30"
        ></div>
        <div
          class="animate-spin rounded-full h-8 w-8 border-4 border-[#4e5d51] border-t-transparent absolute top-0 left-0"
        ></div>
      </div>
    </div>

    <!-- Ошибка -->
    <div
      v-else-if="statsError"
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
        <p class="text-sm text-red-800">{{ statsError }}</p>
      </div>
    </div>

    <!-- Основной контент -->
    <div v-else class="px-4 py-5 space-y-4">
      <!-- Личная информация -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h2 class="font-semibold text-gray-900 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            Личная информация
          </h2>
        </div>
        <div class="divide-y divide-gray-100">
          <div class="px-4 py-3 flex justify-between items-center">
            <span class="text-sm text-gray-600">Имя</span>
            <span class="text-sm font-medium text-gray-900">{{
              user?.first_name || "Не указано"
            }}</span>
          </div>
          <div class="px-4 py-3 flex justify-between items-center">
            <span class="text-sm text-gray-600">Фамилия</span>
            <span class="text-sm font-medium text-gray-900">{{
              user?.last_name || "Не указана"
            }}</span>
          </div>
          <div class="px-4 py-3 flex justify-between items-center">
            <span class="text-sm text-gray-600">Телефон</span>
            <span class="text-sm font-medium text-gray-900">{{
              user?.phone || "Не указан"
            }}</span>
          </div>
          <div class="px-4 py-3 flex justify-between items-center">
            <span class="text-sm text-gray-600">Дата рождения</span>
            <span class="text-sm font-medium text-gray-900">{{
              formatDate(user?.date_of_birth) || "Не указана"
            }}</span>
          </div>
        </div>
      </div>

      <!-- Бронирования -->
      <div class="space-y-3">
        <h2 class="font-semibold text-gray-900 text-lg px-1">Бронирования:</h2>

        <!-- Статистика бронирований -->
        <div v-if="statsLoaded && stats" class="grid grid-cols-3 gap-2">
          <!-- Всего -->
          <div
            class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200"
          >
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-900">
                {{ stats.total || 0 }}
              </div>
              <div class="text-xs text-blue-700 mt-1">Всего</div>
            </div>
          </div>

          <!-- Подтверждено -->
          <div
            class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200"
          >
            <div class="text-center">
              <div class="text-2xl font-bold text-green-900">
                {{ stats.confirmed_count || 0 }}
              </div>
              <div class="text-xs text-green-700 mt-1">Подтверждено</div>
            </div>
          </div>

          <!-- Отменено -->
          <div
            class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200"
          >
            <div class="text-center">
              <div class="text-2xl font-bold text-red-900">
                {{ stats.cancelled_count || 0 }}
              </div>
              <div class="text-xs text-red-700 mt-1">Отменено</div>
            </div>
          </div>
        </div>

        <!-- Заглушка, если статистика не загружена -->
        <div v-else class="grid grid-cols-3 gap-2">
          <div class="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-400">—</div>
              <div class="text-xs text-gray-500 mt-1">Всего</div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-400">—</div>
              <div class="text-xs text-gray-500 mt-1">Подтверждено</div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-400">—</div>
              <div class="text-xs text-gray-500 mt-1">Отменено</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="space-y-3">
        <!-- История бронирований -->
        <button
          @click="$router.push('/profile/history')"
          class="w-full bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm active:scale-98"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          История бронирований
        </button>
      </div>

      <!-- Дополнительная информация -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
        <div class="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-blue-900">
              Ваши данные в безопасности
            </h3>
            <p class="text-xs text-blue-700 mt-1">
              Мы используем ваши данные только для бронирования и улучшения
              сервиса.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования профиля -->
    <EditProfileModal
      :is-open="showEditModal"
      :user-data="user"
      @close="showEditModal = false"
      @saved="onProfileSaved"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { bookingAPI } from "@/utils/api";
import EditProfileModal from "@/components/EditProfileModal.vue";

export default {
  name: "ProfilePage",
  components: {
    EditProfileModal,
  },
  data() {
    return {
      showEditModal: false,
      loadingStats: false,
      statsError: null,
      stats: null,
      statsLoaded: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ["user", "isLoading", "error"]),
    getUserInitials() {
      if (!this.user) return "?";
      const firstName = this.user.first_name || "";
      const lastName = this.user.last_name || "";
      const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      return initials || "👤";
    },
    getUserFullName() {
      if (!this.user) return "";
      const firstName = this.user.first_name || "";
      const lastName = this.user.last_name || "";
      return [firstName, lastName].filter(Boolean).join(" ") || "Гость";
    },
  },
  watch: {
    // Отслеживаем изменение маршрута - при каждом входе на страницу
    $route(to, from) {
      if (to.name === "ProfilePage") {
        console.log("Route changed to ProfilePage, reloading stats");
        this.loadBookingStats(true);
      }
    },
    // Отслеживаем изменение пользователя
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser && newUser.id) {
          console.log("User changed, loading stats");
          this.loadBookingStats(true);
        } else {
          console.log("No user found, resetting stats");
          this.stats = null;
          this.statsLoaded = false;
        }
      },
    },
  },
  methods: {
    ...mapActions(useAppStore, ["updateUserProfile", "authenticate"]),

    formatDate(dateString) {
      if (!dateString) return "Не указана";

      try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
          return "Не указана";
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if (year === 1970 && month === 1 && day === 1) {
          return "Не указана";
        }

        const now = new Date();
        const currentYear = now.getFullYear();

        if (year > currentYear + 10 || year < 1900) {
          return "Не указана";
        }

        return date.toLocaleDateString("ru-RU");
      } catch (error) {
        return "Не указана";
      }
    },

    async onProfileSaved(updatedUser) {
      try {
        await this.updateUserProfile(updatedUser);
        this.showEditModal = false;
        // После обновления профиля перезагружаем статистику
        await this.loadBookingStats(true);
      } catch (error) {
        console.error("Failed to update user in store:", error);
      }
    },

    // Метод для загрузки статистики бронирований
    async loadBookingStats(force = false) {
      // Если нет пользователя, не можем загрузить статистику
      if (!this.user || !this.user.id) {
        console.log("No user found, cannot load stats");
        this.stats = null;
        this.statsLoaded = false;
        return;
      }

      // Если статистика уже загружена и не требуется принудительная перезагрузка
      if (this.statsLoaded && !force) {
        console.log("Stats already loaded, skipping");
        return;
      }

      try {
        this.loadingStats = true;
        this.statsError = null;
        this.stats = null;
        this.statsLoaded = false;

        console.log("Loading booking statistics for user:", this.user.id);

        // Делаем запрос на получение бронирований
        const bookingsResponse = await bookingAPI.getMyBookings();

        console.log("Bookings API response:", bookingsResponse);

        // Обрабатываем ответ
        this.processBookingsResponse(bookingsResponse);

        this.statsLoaded = true;
        console.log("Booking statistics loaded:", this.stats);
      } catch (error) {
        console.error("Failed to load booking statistics:", error);
        this.statsError = error.message || "Не удалось загрузить статистику";
        this.stats = null;
        this.statsLoaded = false;
      } finally {
        this.loadingStats = false;
      }
    },

    // Обработка ответа от API бронирований
    processBookingsResponse(response) {
      if (!response) {
        console.warn("Empty response from API");
        this.stats = {
          total: 0,
          pending_count: 0,
          confirmed_count: 0,
          cancelled_count: 0,
        };
        return;
      }

      // Логируем полный ответ для отладки
      console.log("Processing response:", JSON.stringify(response, null, 2));

      // Проверяем разные форматы ответа
      if (response.total !== undefined) {
        // Формат 1: { total: X, pending_count: X, confirmed_count: X, cancelled_count: X, bookings: [...] }
        this.stats = {
          total: response.total || 0,
          pending_count: response.pending_count || 0,
          confirmed_count: response.confirmed_count || 0,
          cancelled_count: response.cancelled_count || 0,
        };
      } else if (response.bookings && Array.isArray(response.bookings)) {
        // Формат 2: { bookings: [...] }
        const bookings = response.bookings;
        this.calculateStatsFromBookings(bookings);
      } else if (Array.isArray(response)) {
        // Формат 3: просто массив
        this.calculateStatsFromBookings(response);
      } else if (response.data) {
        // Формат 4: { data: { ... } }
        this.processBookingsResponse(response.data);
      } else {
        // Неизвестный формат
        console.warn("Unknown response format:", response);
        this.stats = {
          total: 0,
          pending_count: 0,
          confirmed_count: 0,
          cancelled_count: 0,
        };
      }
    },

    // Вычисление статистики из массива бронирований
    calculateStatsFromBookings(bookings) {
      if (!bookings || !Array.isArray(bookings)) {
        this.stats = {
          total: 0,
          pending_count: 0,
          confirmed_count: 0,
          cancelled_count: 0,
        };
        return;
      }

      this.stats = {
        total: bookings.length,
        pending_count: bookings.filter(
          (b) => (b.status || "").toUpperCase() === "PENDING"
        ).length,
        confirmed_count: bookings.filter(
          (b) => (b.status || "").toUpperCase() === "CONFIRMED"
        ).length,
        cancelled_count: bookings.filter(
          (b) => (b.status || "").toUpperCase() === "CANCELLED"
        ).length,
      };
    },

    // Основной метод загрузки данных
    async loadData() {
      try {
        // Загружаем данные пользователя (если еще не загружены)
        const store = useAppStore();
        if (!store.user || !store.user.id) {
          console.log("Loading user data...");
          await this.authenticate();
        }

        // Загружаем статистику бронирований
        await this.loadBookingStats();
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    },
  },

  async created() {
    console.log("ProfilePage created");
    console.log("Initial user state:", this.user);

    // Загружаем данные только если пользователь существует
    const store = useAppStore();
    if (store.user && store.user.id) {
      console.log("User exists, loading stats");
      await this.loadBookingStats();
    } else {
      // Если пользователь не загружен, загружаем всё
      console.log("No user found, loading all data");
      await this.loadData();
    }
  },

  mounted() {
    console.log("ProfilePage mounted");
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
