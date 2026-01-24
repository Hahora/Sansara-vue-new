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
            👥
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление пользователями</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ totalUsers }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка обновления -->
          <button
            @click="loadUsers"
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
          <!-- Кнопка экспорта УБРАНА -->
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="px-4 py-4 space-y-3">
      <!-- Статус блокировки -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Статус</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.is_blocked = null;
              applyFilters();
            "
            :class="
              filters.is_blocked === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все
          </button>
          <button
            @click="
              filters.is_blocked = false;
              applyFilters();
            "
            :class="
              filters.is_blocked === false
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Активные
          </button>
          <button
            @click="
              filters.is_blocked = true;
              applyFilters();
            "
            :class="
              filters.is_blocked === true
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Заблокированы
          </button>
        </div>
      </div>

      <!-- Поиск -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Поиск по имени или Telegram
        </h3>
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Имя, фамилия или @username..."
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

    <!-- Список пользователей -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик и статистика -->
      <div class="mb-3">
        <div class="text-sm text-gray-600 mb-2">
          Найдено: <span class="font-semibold">{{ users.length }}</span>
        </div>
        <div class="flex gap-3 text-xs">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600">Активные: {{ stats.active }}</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <span class="text-gray-600"
              >Заблокированы: {{ stats.blocked }}</span
            >
          </div>
        </div>
      </div>

      <!-- Пользователи -->
      <div v-if="users.length > 0" class="space-y-3">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска -->
          <div :class="getUserColorClass(user)" class="h-1"></div>

          <div class="p-4">
            <!-- Заголовок и кнопки -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 text-base">
                    {{ user.first_name }} {{ user.last_name }}
                  </h3>
                  <span class="text-sm text-gray-500"> ID: {{ user.id }} </span>
                </div>

                <!-- Telegram и статусы -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <!-- Telegram ID -->
                  <div class="flex items-center gap-1">
                    <svg
                      class="w-3 h-3 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M18.384 4.318a2.036 2.036 0 00-1.592-.504L3.828 6.848a1.543 1.543 0 00-1.138 1.865l1.22 4.56a2.036 2.036 0 001.592 1.504l2.536.422 1.204 3.682a.542.542 0 00.86.268l2.128-1.704 3.65 2.68c.36.264.828.228 1.146-.096l1.896-1.896a1.036 1.036 0 00.096-1.146L15.45 13.65l3.682-1.204a2.036 2.036 0 001.504-1.592l.422-2.536a1.543 1.543 0 00-1.865-1.138l-4.56 1.22-9.366-3.146a2.036 2.036 0 00-1.592.504L2.512 5.83a1.036 1.036 0 00.268 1.62l3.146 1.054 1.22 4.56a1.543 1.543 0 001.865 1.138l4.56-1.22 3.146 1.054a2.036 2.036 0 001.62-.268l1.704-1.704a1.036 1.036 0 00-.268-1.62l-1.054-3.146 4.56-1.22a1.543 1.543 0 001.138-1.865l-1.22-4.56z"
                      />
                    </svg>
                    <span class="text-xs text-gray-600">
                      {{ user.telegram_id }}
                    </span>
                  </div>

                  <!-- Username -->
                  <span
                    v-if="user.username"
                    class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border"
                  >
                    @{{ user.username }}
                  </span>

                  <span
                    v-if="user.is_first_visit"
                    class="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200"
                  >
                    Первый визит
                  </span>
                </div>
              </div>

              <!-- Статус блокировки -->
              <div class="flex flex-col items-end gap-2">
                <div
                  :class="getBlockStatusBadgeClass(user.is_blocked)"
                  class="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  {{ user.is_blocked ? "Заблокирован" : "Активен" }}
                </div>
                <!-- Меню действий -->
                <button
                  @click="toggleUserMenu(user.id)"
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

            <!-- Контактная информация (БЕЗ статистики бронирований) -->
            <div class="space-y-2">
              <!-- Телефон -->
              <div
                v-if="user.phone"
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                  />
                </svg>
                {{ user.phone }}
              </div>

              <!-- Дата рождения -->
              <div
                v-if="user.date_of_birth"
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
                {{ formatDate(user.date_of_birth) }}
                <span class="text-gray-400 ml-1">
                  ({{ calculateAge(user.date_of_birth) }} лет)
                </span>
              </div>

              <!-- Пол -->
              <div
                v-if="user.gender"
                class="flex items-center text-sm text-gray-600"
              >
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
                {{ user.gender === "MALE" ? "Мужской" : "Женский" }}
              </div>

              <!-- СТАТИСТИКА БРОНИРОВАНИЙ УБРАНА ОТСЮДА -->
            </div>

            <!-- Дата регистрации -->
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
              Зарегистрирован: {{ formatDateTimeShort(user.created_at) }}
            </div>

            <!-- Меню действий -->
            <div
              v-if="openMenuId === user.id"
              class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2"
            >
              <button
                @click="openUserDetails(user)"
                class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                👁️ Подробнее
              </button>
              <button
                v-if="!user.is_blocked"
                @click="openBanModal(user)"
                class="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                🚫 Заблокировать
              </button>
              <button
                v-else
                @click="unbanUser(user)"
                class="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ✅ Разблокировать
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет пользователей -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">👥</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Нет пользователей
        </h3>
        <p class="text-sm text-gray-600">
          {{
            hasActiveFilters
              ? "По выбранным фильтрам пользователей не найдено"
              : "Пользователи ещё не зарегистрированы"
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
    <BanUserModal
      v-if="banningUser"
      :user="banningUser"
      @close="banningUser = null"
      @banned="onUserBanned"
    />

    <UserDetailsModal
      v-if="selectedUser"
      :user="selectedUser"
      @close="selectedUser = null"
    />
  </div>
</template>

<script>
import { userAPI } from "@/utils/api";
import BanUserModal from "@/components/BanUserModal.vue";
import UserDetailsModal from "@/components/UserDetailsModal.vue";

export default {
  name: "AdminUsersPage",
  components: {
    BanUserModal,
    UserDetailsModal,
  },
  data() {
    return {
      isLoading: false,
      isExporting: false, // Можете удалить, если больше не используется
      error: null,
      users: [],
      allUsers: [],
      totalUsers: 0,
      filters: {
        is_blocked: null,
      },
      searchQuery: "",
      banningUser: null,
      selectedUser: null,
      openMenuId: null,
      stats: {
        active: 0,
        blocked: 0,
        admins: 0,
      },
    };
  },
  computed: {
    hasActiveFilters() {
      return this.filters.is_blocked !== null || this.searchQuery.trim() !== "";
    },
    activeFiltersCount() {
      let count = 0;
      if (this.filters.is_blocked !== null) count++;
      if (this.searchQuery.trim() !== "") count++;
      return count;
    },
  },
  methods: {
    async loadUsers() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка пользователей...");

        // Загружаем всех пользователей
        const data = await userAPI.getAll();

        if (Array.isArray(data)) {
          // Сортируем по дате регистрации (новые сверху)
          this.allUsers = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // Применяем фильтры
          this.applyLocalFilters();

          // Обновляем статистику
          this.updateStats();

          this.totalUsers = this.allUsers.length;
          console.log("Загружено пользователей:", this.allUsers.length);
        } else {
          this.allUsers = [];
          this.users = [];
          this.totalUsers = 0;
        }
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        this.error = error.message || "Не удалось загрузить пользователей";
        this.allUsers = [];
        this.users = [];
      } finally {
        this.isLoading = false;
      }
    },

    applyLocalFilters() {
      let filtered = this.allUsers;

      // Фильтр по статусу блокировки
      if (this.filters.is_blocked !== null) {
        filtered = filtered.filter(
          (user) => user.is_blocked === this.filters.is_blocked
        );
      }

      // Поиск по имени, фамилии или username
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter((user) => {
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
      }

      this.users = filtered;
    },

    applyFilters() {
      this.applyLocalFilters();
    },

    onSearchInput() {
      // Дебаунс для поиска
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.applyFilters();
      }, 300);
    },

    clearAllFilters() {
      this.filters = {
        is_blocked: null,
      };
      this.searchQuery = "";
      this.applyFilters();
    },

    updateStats() {
      this.stats = {
        active: this.allUsers.filter((u) => !u.is_blocked).length,
        blocked: this.allUsers.filter((u) => u.is_blocked).length,
        admins: this.allUsers.filter((u) => u.admin).length,
      };
    },

    toggleUserMenu(userId) {
      this.openMenuId = this.openMenuId === userId ? null : userId;
    },

    async openUserDetails(user) {
      try {
        // Загружаем подробные данные пользователя по API
        const detailedUser = await userAPI.getUserById(user.id);
        console.log("Детали пользователя загружены:", detailedUser);
        this.selectedUser = detailedUser;
        this.openMenuId = null;
      } catch (error) {
        console.error("Ошибка при загрузке деталей пользователя:", error);
        // В случае ошибки показываем хотя бы базовые данные
        this.selectedUser = { ...user };
        this.openMenuId = null;
      }
    },

    openBanModal(user) {
      this.banningUser = { ...user };
      this.openMenuId = null;
    },

    async unbanUser(user) {
      if (
        !confirm(
          `Разблокировать пользователя ${user.first_name} ${user.last_name}?`
        )
      ) {
        return;
      }

      try {
        await userAPI.unbanUser(user.id);
        console.log("Пользователь разблокирован:", user.id);

        // Обновляем локально
        const userIndex = this.users.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
          this.users[userIndex].is_blocked = false;
          this.users[userIndex].block_reason = null;
        }

        // Обновляем в allUsers тоже
        const allUserIndex = this.allUsers.findIndex((u) => u.id === user.id);
        if (allUserIndex !== -1) {
          this.allUsers[allUserIndex].is_blocked = false;
          this.allUsers[allUserIndex].block_reason = null;
        }

        this.updateStats();
      } catch (error) {
        console.error("Ошибка при разблокировке:", error);
        alert("Не удалось разблокировать пользователя: " + error.message);
      }
    },

    async onUserBanned() {
      console.log("Пользователь заблокирован");
      this.banningUser = null;
      await this.loadUsers();
    },

    // Метод exportToExcel УДАЛЕН

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

    calculateAge(dateOfBirth) {
      if (!dateOfBirth) return "";
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },

    getUserColorClass(user) {
      if (user.is_blocked) return "bg-red-500";
      if (user.admin) return "bg-blue-500";
      return "bg-green-500";
    },

    getBlockStatusBadgeClass(isBlocked) {
      return isBlocked
        ? "bg-red-50 text-red-700 border border-red-200"
        : "bg-green-50 text-green-700 border border-green-200";
    },
  },

  async created() {
    console.log("AdminUsersPage created");
    await this.loadUsers();
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
