<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-2 sm:p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl w-full max-w-lg max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col"
    >
      <!-- Шапка -->
      <div
        class="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-2xl sm:text-3xl mr-2 sm:mr-3">🎟️</span>
            <h3 class="font-bold text-lg sm:text-xl">Проведение розыгрыша</h3>
          </div>
          <button @click="close" class="text-white hover:text-gray-200">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Контент -->
      <div class="flex-1 overflow-y-auto p-3 sm:p-6">
        <!-- Предупреждение -->
        <div
          class="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-3 sm:p-4 mb-4 sm:mb-6"
        >
          <div class="flex items-start">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <h4 class="font-bold text-red-800 mb-1 text-sm sm:text-base">
                Внимание! Это действие нельзя отменить
              </h4>
              <p class="text-red-700 text-xs sm:text-sm">
                После проведения розыгрыша лотерея будет автоматически
                деактивирована, а всем победителям будут отправлены уведомления.
              </p>
            </div>
          </div>
        </div>

        <!-- Выбор администратора -->
        <div class="mb-4 sm:mb-6">
          <label
            class="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3"
          >
            📤 Выберите администратора для отправки результатов
          </label>
          <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Результаты розыгрыша в формате Excel будут отправлены выбранному
            пользователю в Telegram
          </p>

          <!-- Поиск пользователя -->
          <div class="mb-3">
            <div class="relative">
              <input
                v-model="userSearch"
                @input="searchUsers"
                type="text"
                placeholder="Поиск по имени, @username или телефону..."
                class="w-full px-3 py-2.5 sm:py-3 pr-10 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
              <svg
                class="absolute right-3 top-3 sm:top-3.5 w-5 h-5 text-gray-400"
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
            </div>
          </div>

          <!-- Загрузка поиска -->
          <div v-if="isSearching" class="flex justify-center items-center py-6">
            <div class="relative">
              <div
                class="animate-spin rounded-full h-8 w-8 border-4 border-gray-200"
              ></div>
              <div
                class="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"
              ></div>
            </div>
          </div>

          <!-- Результаты поиска -->
          <div
            v-else-if="searchResults.length > 0"
            class="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto"
          >
            <button
              v-for="user in searchResults"
              :key="user.id"
              @click="selectUser(user)"
              :class="[
                'w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all',
                selectedUserId === user.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 bg-white',
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span
                      class="font-semibold text-gray-900 text-sm sm:text-base truncate"
                    >
                      {{ user.first_name }}
                      {{ user.last_name || "" }}
                    </span>
                    <span
                      v-if="selectedUserId === user.id"
                      class="text-purple-600 flex-shrink-0 text-lg"
                    >
                      ✓
                    </span>
                  </div>
                  <div class="text-xs sm:text-sm text-gray-600 truncate">
                    <span v-if="user.username">@{{ user.username }}</span>
                    <span v-else class="text-gray-400">Без username</span>
                  </div>
                  <div
                    v-if="user.phone"
                    class="text-xs text-gray-500 mt-1 truncate"
                  >
                    📞 {{ user.phone }}
                  </div>
                </div>
                <div
                  :class="[
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    selectedUserId === user.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300',
                  ]"
                >
                  <svg
                    v-if="selectedUserId === user.id"
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          <!-- Пусто -->
          <div
            v-else-if="userSearch.length > 0 && !isSearching"
            class="text-center py-8 text-gray-500"
          >
            <svg
              class="w-12 h-12 mx-auto mb-3 text-gray-300"
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
            <p class="text-sm">Пользователи не найдены</p>
            <p class="text-xs text-gray-400 mt-1">Попробуйте другой запрос</p>
          </div>

          <!-- Подсказка -->
          <div v-else class="text-center py-8 text-gray-400">
            <svg
              class="w-12 h-12 mx-auto mb-3"
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
            <p class="text-sm">Начните вводить имя, @username или телефон</p>
          </div>
        </div>

        <!-- Опция очистки - всегда включена, не показываем -->
        <!-- cleanup_after_draw всегда true -->

        <!-- Ошибка -->
        <div
          v-if="error"
          class="mt-4 bg-red-50 border-l-4 border-red-500 rounded-r p-3"
        >
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4">
        <div class="flex gap-2 sm:gap-3">
          <button
            type="button"
            @click="close"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all active:scale-98 text-sm sm:text-base"
          >
            Отмена
          </button>
          <button
            type="button"
            @click="confirmDraw"
            :disabled="!selectedUserId || isConducting"
            class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <span v-if="!isConducting" class="flex items-center justify-center">
              <span class="text-lg sm:text-xl mr-1.5 sm:mr-2">🎟️</span>
              Провести
            </span>
            <span v-else class="flex items-center justify-center">
              <svg
                class="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Проведение...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userAPI, lotteryAPI } from "@/utils/api";

export default {
  name: "ConductDrawModal",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSearching: false,
      isConducting: false,
      error: null,
      userSearch: "",
      searchResults: [],
      selectedUserId: null,
      cleanupAfterDraw: true,
      scrollY: 0,
      searchTimeout: null,
    };
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.lockBodyScroll();
        this.loadUsers();
      } else {
        this.unlockBodyScroll();
      }
    },
  },
  methods: {
    lockBodyScroll() {
      this.scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    },

    unlockBodyScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, this.scrollY);
    },

    searchUsers() {
      // Очищаем предыдущий таймер
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Если поле пустое - очищаем результаты
      if (!this.userSearch.trim()) {
        this.searchResults = [];
        return;
      }

      // Debounce - ждём 300мс после последнего ввода
      this.searchTimeout = setTimeout(async () => {
        try {
          this.isSearching = true;
          this.error = null;

          const data = await userAPI.getAll();

          if (!Array.isArray(data)) {
            this.searchResults = [];
            return;
          }

          // Фильтруем пользователей по запросу
          const query = this.userSearch.toLowerCase().trim();
          this.searchResults = data.filter((user) => {
            const firstName = (user.first_name || "").toLowerCase();
            const lastName = (user.last_name || "").toLowerCase();
            const username = (user.username || "").toLowerCase();
            const phone = (user.phone || "").toLowerCase();

            return (
              firstName.includes(query) ||
              lastName.includes(query) ||
              username.includes(query) ||
              phone.includes(query) ||
              `${firstName} ${lastName}`.includes(query)
            );
          });

          console.log("Результаты поиска:", this.searchResults.length);
        } catch (error) {
          console.error("Ошибка при поиске пользователей:", error);
          this.error = "Не удалось найти пользователей";
          this.searchResults = [];
        } finally {
          this.isSearching = false;
        }
      }, 300);
    },

    selectUser(user) {
      this.selectedUserId = user.id;
      console.log(
        "Выбран пользователь:",
        user.id,
        user.first_name,
        user.last_name
      );
    },

    async confirmDraw() {
      if (!this.selectedUserId) {
        this.error = "Пожалуйста, выберите администратора";
        return;
      }

      try {
        this.isConducting = true;
        this.error = null;

        console.log("Проведение розыгрыша:", {
          admin_user_id: this.selectedUserId,
          cleanup_after_draw: this.cleanupAfterDraw,
        });

        // Вызываем API с параметрами
        await lotteryAPI.conductDraw({
          admin_user_id: this.selectedUserId,
          cleanup_after_draw: this.cleanupAfterDraw,
        });

        console.log("Розыгрыш успешно проведен");

        this.$emit("success");
        this.close();
      } catch (error) {
        console.error("Ошибка при проведении розыгрыша:", error);
        this.error = error.message || "Не удалось провести розыгрыш";
      } finally {
        this.isConducting = false;
      }
    },

    close() {
      this.$emit("close");
    },
  },
  beforeDestroy() {
    // Очищаем таймер при уничтожении компонента
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.unlockBodyScroll();
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
