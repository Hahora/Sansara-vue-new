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
            🏢
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление филиалами</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ branches.length }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка обновления -->
          <button
            @click="loadBranches"
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
            class="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-all active:scale-98 font-semibold flex items-center"
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
      <!-- Статус активности -->
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
            Все статусы
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

      <!-- Поиск -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Поиск по названию или адресу
        </h3>
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Введите название или адрес..."
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

    <!-- Список филиалов -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик и статистика -->
      <div class="mb-3">
        <div class="text-sm text-gray-600 mb-2">
          Найдено:
          <span class="font-semibold">{{ filteredBranches.length }}</span>
        </div>
        <div class="flex gap-3 text-xs">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600">Активные: {{ stats.active }}</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <span class="text-gray-600">Неактивные: {{ stats.inactive }}</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600"
              >С менеджерами: {{ stats.withManager }}</span
            >
          </div>
        </div>
      </div>

      <!-- Филиалы -->
      <div v-if="filteredBranches.length > 0" class="space-y-3">
        <div
          v-for="branch in filteredBranches"
          :key="branch.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска -->
          <div
            :class="branch.is_active ? 'bg-green-500' : 'bg-red-500'"
            class="h-1"
          ></div>

          <div class="p-4">
            <!-- Заголовок и кнопки -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 text-base">
                    {{ branch.name }}
                  </h3>
                  <span class="text-sm text-gray-500">
                    ID: {{ branch.id }}
                  </span>
                </div>

                <!-- Статусы -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <!-- Статус активности -->
                  <span
                    v-if="branch.is_active"
                    class="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200"
                  >
                    Активен
                  </span>
                  <span
                    v-else
                    class="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200"
                  >
                    Неактивен
                  </span>

                  <!-- Телефон -->
                  <span
                    v-if="branch.phone"
                    class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                      />
                    </svg>
                    {{ branch.phone }}
                  </span>

                  <!-- Telegram -->
                  <span
                    v-if="branch.tg_username"
                    class="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                      />
                    </svg>
                    @{{ branch.tg_username }}
                  </span>
                </div>
              </div>

              <!-- Меню действий -->
              <div class="flex flex-col items-end gap-2">
                <button
                  @click="toggleBranchMenu(branch.id)"
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

            <!-- Информация о филиале -->
            <div class="space-y-2">
              <!-- Адрес -->
              <div
                v-if="branch.address"
                class="flex items-start text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ branch.address }}</span>
              </div>

              <!-- Описание -->
              <div
                v-if="branch.description"
                class="text-sm text-gray-600 line-clamp-2"
              >
                {{ truncateText(branch.description, 100) }}
              </div>

              <!-- В шаблоне AdminBranchesPage.vue заменить блок отображения менеджера: -->
              <!-- Менеджер -->
              <div
                v-if="branch.manager_name"
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
                <span class="font-medium">{{ branch.manager_name }}</span>
              </div>
            </div>

            <!-- Даты -->
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
              Создан: {{ formatDateTimeShort(branch.created_at) }}
              <span class="mx-2">•</span>
              Обновлён: {{ formatDateTimeShort(branch.updated_at) }}
            </div>

            <!-- Меню действий -->
            <div
              v-if="openMenuId === branch.id"
              class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2"
            >
              <button
                @click="openEditModal(branch)"
                class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ✏️ Редакт.
              </button>
              <button
                v-if="branch.is_active"
                @click="toggleBranchStatus(branch)"
                class="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ⚡ Деактив.
              </button>
              <button
                v-else
                @click="toggleBranchStatus(branch)"
                class="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ✅ Активир.
              </button>
              <button
                @click="copyBranchId(branch.id)"
                class="bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors col-span-1"
              >
                📋 ID
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет филиалов -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">🏢</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет филиалов</h3>
        <p class="text-sm text-gray-600">
          {{
            hasActiveFilters
              ? "По выбранным фильтрам филиалов не найдено"
              : "Филиалы ещё не созданы"
          }}
        </p>
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="mt-3 text-sm text-[#4e5d51] hover:text-[#3d4a40] font-medium"
        >
          Сбросить фильтры
        </button>
        <button
          v-else
          @click="openCreateModal"
          class="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Создать первый филиал
        </button>
      </div>
    </div>

    <!-- Модальные окна -->
    <CreateBranchModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="onBranchCreated"
    />

    <EditBranchModal
      v-if="editingBranch"
      :branch="editingBranch"
      @close="editingBranch = null"
      @updated="onBranchUpdated"
    />
  </div>
</template>

<script>
import { branchAPI } from "@/utils/api";
import CreateBranchModal from "@/components/CreateBranchModal.vue";
import EditBranchModal from "@/components/EditBranchModal.vue";

export default {
  name: "AdminBranchesPage",
  components: {
    CreateBranchModal,
    EditBranchModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      branches: [],
      filters: {
        is_active: null,
      },
      searchQuery: "",
      searchTimeout: null,
      showCreateModal: false,
      editingBranch: null,
      openMenuId: null,
      stats: {
        active: 0,
        inactive: 0,
        withManager: 0,
      },
    };
  },
  computed: {
    filteredBranches() {
      let filtered = this.branches;

      // Фильтр по статусу активности
      if (this.filters.is_active !== null) {
        filtered = filtered.filter(
          (branch) => branch.is_active === this.filters.is_active
        );
      }

      // Поиск по названию или адресу
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (branch) =>
            branch.name.toLowerCase().includes(query) ||
            (branch.address && branch.address.toLowerCase().includes(query))
        );
      }

      return filtered;
    },

    hasActiveFilters() {
      return this.filters.is_active !== null || this.searchQuery.trim() !== "";
    },

    activeFiltersCount() {
      let count = 0;
      if (this.filters.is_active !== null) count++;
      if (this.searchQuery.trim() !== "") count++;
      return count;
    },
  },
  methods: {
    async loadBranches() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка филиалов...");
        const data = await branchAPI.getAllAdmin();

        if (Array.isArray(data)) {
          // Сортируем по дате создания (новые сверху)
          this.branches = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // Обновляем статистику
          this.updateStats();

          console.log("Загружено филиалов:", this.branches.length);
        } else {
          this.branches = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке филиалов:", error);
        this.error = error.message || "Не удалось загрузить филиалы";
        this.branches = [];
      } finally {
        this.isLoading = false;
      }
    },

    applyFilters() {
      // Фильтрация происходит в computed свойстве filteredBranches
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
        is_active: null,
      };
      this.searchQuery = "";
    },

    updateStats() {
      this.stats = {
        active: this.branches.filter((branch) => branch.is_active).length,
        inactive: this.branches.filter((branch) => !branch.is_active).length,
        withManager: this.branches.filter((branch) => branch.manager_name)
          .length,
      };
    },

    toggleBranchMenu(branchId) {
      this.openMenuId = this.openMenuId === branchId ? null : branchId;
    },

    openCreateModal() {
      this.showCreateModal = true;
      this.openMenuId = null;
    },

    openEditModal(branch) {
      this.editingBranch = { ...branch };
      this.openMenuId = null;
    },

    async toggleBranchStatus(branch) {
      const newStatus = !branch.is_active;
      const action = newStatus ? "активировать" : "деактивировать";

      if (
        !confirm(
          `${action.charAt(0).toUpperCase() + action.slice(1)} филиал "${branch.name}"?`
        )
      ) {
        return;
      }

      try {
        // Создаем объект для обновления с новым статусом
        const updateData = {
          name: branch.name,
          address: branch.address,
          phone: branch.phone || null,
          tg_username: branch.tg_username || null,
          description: branch.description || null,
          manager_name: branch.manager_name || null,
          is_active: newStatus,
        };

        await branchAPI.update(branch.id, updateData);

        console.log(`Статус филиала обновлен: ${branch.id} -> ${newStatus}`);

        // Обновляем локально
        branch.is_active = newStatus;
        this.updateStats();

        // Закрываем меню
        this.openMenuId = null;
      } catch (error) {
        console.error("Ошибка при изменении статуса филиала:", error);
        alert("Не удалось изменить статус филиала: " + error.message);
      }
    },

    async copyBranchId(branchId) {
      try {
        await navigator.clipboard.writeText(branchId.toString());
        alert(`ID филиала ${branchId} скопирован в буфер обмена`);
        this.openMenuId = null;
      } catch (error) {
        console.error("Ошибка при копировании ID:", error);
        // Fallback для старых браузеров
        const textArea = document.createElement("textarea");
        textArea.value = branchId.toString();
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert(`ID филиала ${branchId} скопирован в буфер обмена`);
      }
    },

    async onBranchCreated() {
      console.log("Филиал создан");
      this.showCreateModal = false;
      await this.loadBranches();
    },

    async onBranchUpdated() {
      console.log("Филиал обновлен");
      this.editingBranch = null;
      await this.loadBranches();
    },

    formatDateTimeShort(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },

    truncateText(text, maxLength) {
      if (!text) return "";
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    },
  },

  async created() {
    console.log("AdminBranchesPage created");
    await this.loadBranches();
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
