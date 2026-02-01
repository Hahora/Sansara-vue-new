<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Индикатор загрузки (ДОЛЖЕН БЫТЬ ПЕРВЫМ) -->
    <div
      v-if="loadingStats"
      class="fixed inset-0 bg-[#edeae6]/90 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="flex flex-col items-center">
        <Loader2 class="h-14 w-14 text-[#c2a886] animate-spin mb-4" />
        <div class="text-sm text-gray-600 font-light">
          Загружаем вашу статистику...
        </div>
      </div>
    </div>

    <!-- Шапка профиля -->
    <div class="relative overflow-hidden bg-[#202c27] text-white">
      <!-- Декоративная текстура -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10"
        ></div>
      </div>

      <div class="relative px-5 pt-6 pb-8">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white/90 hover:text-white transition-all duration-300 mb-6"
        >
          <ChevronLeft class="h-6 w-6" />
          <span class="ml-2 font-medium text-sm">Назад</span>
        </button>

        <!-- Информация о пользователе -->
        <div v-if="user" class="flex items-start gap-3">
          <!-- Аватар с поддержкой Telegram фото -->
          <div class="relative flex-shrink-0">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#c2a886]/30 shadow-lg overflow-hidden"
              :class="
                userPhotoUrl
                  ? 'bg-[#202c27]'
                  : 'bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 backdrop-blur-sm'
              "
            >
              <!-- Если есть фото из Telegram -->
              <img
                v-if="userPhotoUrl"
                :src="userPhotoUrl"
                alt="Avatar"
                class="w-full h-full object-cover"
                @error="onPhotoError"
                @load="onPhotoLoad"
              />
              <!-- Если нет фото - показываем инициалы -->
              <span v-else class="text-2xl font-light text-white">
                {{ getUserInitials }}
              </span>
            </div>
            <!-- Декоративное кольцо -->
            <div
              class="absolute -inset-1 border border-[#c2a886]/20 rounded-full animate-pulse"
            ></div>
          </div>

          <!-- Информация -->
          <div class="flex-1 min-w-0 pt-1">
            <h1
              class="text-xl font-light tracking-wide text-white leading-tight"
            >
              {{ getUserFullName || "Дорогой гость" }}
            </h1>
            <p class="text-sm text-white/70 font-light mt-1.5">
              @{{ user.username || user.telegram_id }}
            </p>
          </div>

          <!-- Кнопка редактирования -->
          <button
            @click="showEditModal = true"
            class="bg-[#c2a886]/20 hover:bg-[#c2a886]/30 backdrop-blur-sm text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border border-[#c2a886]/30 flex-shrink-0"
          >
            <Settings class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Ошибка загрузки статистики -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="statsError"
        class="mx-5 mt-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-lg"
      >
        <div class="flex items-start">
          <AlertCircle class="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-sm text-red-800 font-medium">{{ statsError }}</p>
            <p class="text-xs text-red-600 mt-1">
              Попробуйте обновить страницу
            </p>
          </div>
          <button
            @click="statsError = null"
            class="text-red-500 hover:text-red-700 ml-3 flex-shrink-0 transition-colors"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>
    </transition>

    <!-- Основной контент -->
    <div v-if="!loadingStats" class="px-5 py-5 space-y-5">
      <!-- Личная информация -->
      <div
        class="bg-[#e3ded3] rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden"
      >
        <!-- Заголовок блока -->
        <div class="px-4 py-3.5 bg-[#d9cebc] border-b border-[#c2a886]/20">
          <div class="flex items-center gap-2.5">
            <div
              class="h-8 w-8 rounded-lg bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 flex items-center justify-center"
            >
              <UserIcon class="h-4 w-4 text-[#202c27]" />
            </div>
            <h2 class="font-semibold text-gray-900 tracking-tight text-[15px]">
              Личная информация
            </h2>
          </div>
        </div>

        <!-- Список данных -->
        <div class="divide-y divide-[#c2a886]/15">
          <div class="px-4 py-3.5 flex justify-between items-center gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="h-6 w-6 rounded-full bg-[#c2a886]/15 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-[10px] text-[#202c27] font-semibold">И</span>
              </div>
              <span class="text-[13px] text-gray-600">Имя</span>
            </div>
            <span
              class="text-[13px] font-medium text-gray-900 text-right truncate"
              >{{ user?.first_name || "Не указано" }}</span
            >
          </div>

          <div class="px-4 py-3.5 flex justify-between items-center gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="h-6 w-6 rounded-full bg-[#c2a886]/15 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-[10px] text-[#202c27] font-semibold">Ф</span>
              </div>
              <span class="text-[13px] text-gray-600">Фамилия</span>
            </div>
            <span
              class="text-[13px] font-medium text-gray-900 text-right truncate"
              >{{ user?.last_name || "Не указана" }}</span
            >
          </div>

          <div class="px-4 py-3.5 flex justify-between items-center gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="h-6 w-6 rounded-full bg-[#c2a886]/15 flex items-center justify-center flex-shrink-0"
              >
                <Phone class="h-3 w-3 text-[#202c27]" />
              </div>
              <span class="text-[13px] text-gray-600">Телефон</span>
            </div>
            <span
              class="text-[13px] font-medium text-gray-900 text-right truncate"
              >{{ user?.phone || "Не указан" }}</span
            >
          </div>

          <div class="px-4 py-3.5 flex justify-between items-center gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="h-6 w-6 rounded-full bg-[#c2a886]/15 flex items-center justify-center flex-shrink-0"
              >
                <Calendar class="h-3 w-3 text-[#202c27]" />
              </div>
              <span class="text-[13px] text-gray-600">Дата рождения</span>
            </div>
            <span
              class="text-[13px] font-medium text-gray-900 text-right truncate"
              >{{ formatDate(user?.date_of_birth) || "Не указана" }}</span
            >
          </div>
        </div>
      </div>

      <!-- Статистика бронирований -->
      <div class="space-y-3">
        <!-- Заголовок раздела -->
        <div class="flex items-center">
          <div
            class="h-px flex-1 bg-gradient-to-r from-transparent to-[#c2a886]/30"
          ></div>
          <h2 class="mx-3 text-base font-light text-gray-900 tracking-wide">
            Статистика
          </h2>
          <div
            class="h-px flex-1 bg-gradient-to-l from-transparent to-[#c2a886]/30"
          ></div>
        </div>

        <!-- Карточки статистики -->
        <div class="grid grid-cols-3 gap-2.5">
          <!-- Всего -->
          <div class="bg-[#e3ded3] rounded-xl p-3 border border-gray-200/80">
            <div class="text-center">
              <div class="text-xl font-bold text-[#202c27]">
                {{ stats?.total || 0 }}
              </div>
              <div
                class="text-[11px] text-gray-500 mt-1.5 font-medium leading-tight"
              >
                Всего
              </div>
            </div>
            <!-- Декоративный элемент -->
            <div
              class="h-0.5 w-6 mx-auto bg-gradient-to-r from-[#c2a886]/30 to-[#c2a886]/60 rounded-full mt-2"
            ></div>
          </div>

          <!-- Подтверждено -->
          <div class="bg-[#e3ded3] rounded-xl p-3 border border-gray-200/80">
            <div class="text-center">
              <div class="text-xl font-bold text-[#202c27]">
                {{ stats?.confirmed_count || 0 }}
              </div>
              <div
                class="text-[11px] text-gray-500 mt-1.5 font-medium leading-tight"
              >
                Подтверждено
              </div>
            </div>
            <!-- Зеленая полоска -->
            <div
              class="h-0.5 w-6 mx-auto bg-gradient-to-r from-green-400 to-green-500 rounded-full mt-2"
            ></div>
          </div>

          <!-- Отменено -->
          <div class="bg-[#e3ded3] rounded-xl p-3 border border-gray-200/80">
            <div class="text-center">
              <div class="text-xl font-bold text-[#202c27]">
                {{ stats?.cancelled_count || 0 }}
              </div>
              <div
                class="text-[11px] text-gray-500 mt-1.5 font-medium leading-tight"
              >
                Отменено
              </div>
            </div>
            <!-- Красная полоска -->
            <div
              class="h-0.5 w-6 mx-auto bg-gradient-to-r from-red-400 to-red-500 rounded-full mt-2"
            ></div>
          </div>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="space-y-3">
        <!-- История бронирований -->
        <button
          @click="$router.push('/profile/history')"
          class="group w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
        >
          <CalendarDays class="h-5 w-5 mr-2 text-white" />
          <span class="tracking-wide text-white text-[15px]"
            >История бронирований</span
          >
          <ChevronRight
            class="h-5 w-5 ml-2 group-active:translate-x-1 transition-transform text-white"
          />
        </button>
      </div>

      <!-- Политика конфиденциальности -->
      <button
        @click="$router.push('/privacy-policy')"
        class="w-full bg-[#d9cebc]/60 backdrop-blur-sm border border-[#c2a886]/30 rounded-xl p-4 text-left transition-all duration-300 active:scale-[0.98]"
      >
        <div class="flex items-center gap-3">
          <div
            class="h-8 w-8 rounded-lg bg-[#c2a886]/20 flex items-center justify-center flex-shrink-0"
          >
            <Shield class="h-4 w-4 text-[#202c27]" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[13px] font-semibold text-gray-900">
              Политика конфиденциальности
            </h3>
            <p class="text-[11px] text-gray-500 mt-0.5">
              Как мы защищаем ваши данные
            </p>
          </div>
          <ChevronRight class="h-5 w-5 text-gray-400 flex-shrink-0" />
        </div>
      </button>
    </div>

    <!-- Декоративный элемент внизу -->
    <div class="relative h-8 mt-2">
      <div class="absolute inset-x-0 bottom-0 flex justify-center">
        <div
          class="h-px w-24 bg-gradient-to-r from-transparent via-[#c2a886]/30 to-transparent"
        ></div>
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
import icons from "@/utils/icons";

export default {
  name: "ProfilePage",
  components: {
    EditProfileModal,
    ...icons,
  },
  data() {
    return {
      showEditModal: false,
      loadingStats: false,
      statsError: null,
      stats: null,
      statsLoaded: false,
      // Для работы с аватаром
      photoLoadError: false,
      photoLoaded: false,
      telegramPhotoUrl: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ["user", "isLoading", "error"]),

    // Получение URL фото пользователя
    userPhotoUrl() {
      // Если была ошибка загрузки - не показываем фото
      if (this.photoLoadError) {
        return null;
      }

      // Приоритет 1: фото из БД (если сохранено)
      if (this.user?.photo_url) {
        return this.user.photo_url;
      }

      // Приоритет 2: фото из Telegram SDK
      if (this.telegramPhotoUrl) {
        return this.telegramPhotoUrl;
      }

      // Приоритет 3: получаем напрямую из Telegram WebApp
      const tgPhotoUrl =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url;
      if (tgPhotoUrl) {
        return tgPhotoUrl;
      }

      return null;
    },

    getUserInitials() {
      if (!this.user) return "👤";
      const firstName = this.user.first_name || "";
      const lastName = this.user.last_name || "";
      const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      return initials || "👤";
    },

    getUserFullName() {
      if (!this.user) return "";
      const firstName = this.user.first_name || "";
      const lastName = this.user.last_name || "";
      return [firstName, lastName].filter(Boolean).join(" ") || "Дорогой гость";
    },
  },
  watch: {
    $route(to, from) {
      if (to.name === "ProfilePage") {
        console.log("Route changed to ProfilePage, reloading stats");
        this.loadBookingStats(true);
      }
    },
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

    // Обработка успешной загрузки фото
    onPhotoLoad() {
      console.log("User photo loaded successfully");
      this.photoLoaded = true;
      this.photoLoadError = false;
    },

    // Обработка ошибки загрузки фото
    onPhotoError(event) {
      console.warn("Failed to load user photo:", event);
      this.photoLoadError = true;
      this.photoLoaded = false;
    },

    // Получение фото из Telegram SDK
    getTelegramPhoto() {
      try {
        const tg = window.Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user?.photo_url) {
          this.telegramPhotoUrl = tg.initDataUnsafe.user.photo_url;
          console.log("Telegram photo URL found:", this.telegramPhotoUrl);
        } else {
          console.log("No Telegram photo URL available");
        }
      } catch (error) {
        console.error("Error getting Telegram photo:", error);
      }
    },

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
        await this.loadBookingStats(true);
      } catch (error) {
        console.error("Failed to update user in store:", error);
      }
    },

    async loadBookingStats(force = false) {
      if (!this.user || !this.user.id) {
        console.log("No user found, cannot load stats");
        this.stats = null;
        this.statsLoaded = false;
        return;
      }

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

        const bookingsResponse = await bookingAPI.getMyBookings();

        console.log("Bookings API response:", bookingsResponse);

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

      console.log("Processing response:", JSON.stringify(response, null, 2));

      if (response.total !== undefined) {
        this.stats = {
          total: response.total || 0,
          pending_count: response.pending_count || 0,
          confirmed_count: response.confirmed_count || 0,
          cancelled_count: response.cancelled_count || 0,
        };
      } else if (response.bookings && Array.isArray(response.bookings)) {
        const bookings = response.bookings;
        this.calculateStatsFromBookings(bookings);
      } else if (Array.isArray(response)) {
        this.calculateStatsFromBookings(response);
      } else if (response.data) {
        this.processBookingsResponse(response.data);
      } else {
        console.warn("Unknown response format:", response);
        this.stats = {
          total: 0,
          pending_count: 0,
          confirmed_count: 0,
          cancelled_count: 0,
        };
      }
    },

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

    async loadData() {
      try {
        const store = useAppStore();
        if (!store.user || !store.user.id) {
          console.log("Loading user data...");
          await this.authenticate();
        }

        await this.loadBookingStats();
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    },
  },

  async created() {
    console.log("ProfilePage created");
    console.log("Initial user state:", this.user);

    // Получаем фото из Telegram SDK при создании компонента
    this.getTelegramPhoto();

    const store = useAppStore();
    if (store.user && store.user.id) {
      console.log("User exists, loading stats");
      await this.loadBookingStats();
    } else {
      console.log("No user found, loading all data");
      await this.loadData();
    }
  },

  mounted() {
    console.log("ProfilePage mounted");

    // Повторно пытаемся получить фото после монтирования
    // (на случай если Telegram SDK загрузился позже)
    this.$nextTick(() => {
      if (!this.telegramPhotoUrl) {
        this.getTelegramPhoto();
      }
    });
  },
};
</script>

<style scoped>
.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
}
</style>
