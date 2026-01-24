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
            📢
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление рассылками</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего рассылок: {{ broadcasts.length }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка обновления -->
          <button
            @click="loadBroadcasts"
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
            class="bg-white hover:bg-opacity-90 text-[#4e5d51] p-3 rounded-lg transition-all active:scale-98 font-semibold flex items-center"
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

    <!-- Вкладки -->
    <div class="px-4 py-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Фильтр по статусу
        </h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="filters.status = null"
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
            @click="filters.status = 'draft'"
            :class="
              filters.status === 'draft'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Черновики
          </button>
          <button
            @click="filters.status = 'scheduled'"
            :class="
              filters.status === 'scheduled'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Запланированные
          </button>
          <button
            @click="filters.status = 'sent'"
            :class="
              filters.status === 'sent'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Отправленные
          </button>
          <button
            @click="filters.status = 'failed'"
            :class="
              filters.status === 'failed'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Ошибки
          </button>
        </div>
      </div>
    </div>

    <!-- Статистика -->
    <div class="px-4 py-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Статистика рассылок
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ stats.total || 0 }}
            </div>
            <div class="text-xs text-gray-500">Всего рассылок</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ stats.sent || 0 }}
            </div>
            <div class="text-xs text-gray-500">Отправлено</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ stats.scheduled || 0 }}
            </div>
            <div class="text-xs text-gray-500">Запланировано</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">
              {{ stats.failed || 0 }}
            </div>
            <div class="text-xs text-gray-500">Ошибки</div>
          </div>
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

    <!-- Список рассылок -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик -->
      <div class="text-sm text-gray-600 mb-3">
        Найдено:
        <span class="font-semibold">{{ filteredBroadcasts.length }}</span>
      </div>

      <!-- Рассылки -->
      <div v-if="filteredBroadcasts.length > 0" class="space-y-3">
        <div
          v-for="broadcast in filteredBroadcasts"
          :key="broadcast.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска по статусу -->
          <div :class="getStatusColorClass(broadcast.status)" class="h-1"></div>

          <div class="p-4">
            <!-- Заголовок и статус -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 text-base">
                    {{ broadcast.title }}
                  </h3>
                  <span class="text-xs text-gray-500">
                    ID: {{ broadcast.id }}
                  </span>
                </div>

                <!-- Статус и статистика -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    :class="getStatusBadgeClass(broadcast.status)"
                    class="text-xs px-2 py-0.5 rounded border"
                  >
                    {{ getStatusLabel(broadcast.status) }}
                  </span>

                  <!-- Целевая аудитория -->
                  <span
                    :class="
                      broadcast.target_users === 'all'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    "
                    class="text-xs px-2 py-0.5 rounded border"
                  >
                    {{
                      broadcast.target_users === "all" ? "Всем" : "Выбранным"
                    }}
                  </span>

                  <!-- Статистика отправки -->
                  <span
                    v-if="broadcast.status === 'sent'"
                    class="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded"
                  >
                    {{ broadcast.sent_count || 0 }}/{{
                      broadcast.total_recipients || 0
                    }}
                  </span>
                </div>
              </div>

              <!-- Меню действий -->
              <div class="flex items-center gap-2">
                <button
                  @click="toggleBroadcastMenu(broadcast.id)"
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

            <!-- Сообщение -->
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ broadcast.message }}
            </p>

            <!-- Детали -->
            <div class="space-y-2 mb-3">
              <!-- Получатели -->
              <div
                v-if="
                  broadcast.target_users === 'selected' &&
                  broadcast.selected_user_ids
                "
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
                Выбрано пользователей: {{ broadcast.selected_user_ids.length }}
              </div>

              <!-- Расписание -->
              <div
                v-if="broadcast.scheduled_at"
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
                Запланировано на: {{ formatDateTime(broadcast.scheduled_at) }}
              </div>

              <!-- Дата отправки -->
              <div
                v-if="broadcast.sent_at"
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Отправлено: {{ formatDateTime(broadcast.sent_at) }}
              </div>

              <!-- Дата создания -->
              <div
                class="flex items-center text-xs text-gray-500 pt-2 border-t border-gray-100"
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
                Создано: {{ formatDateTime(broadcast.created_at) }}
              </div>
            </div>

            <!-- Меню действий -->
            <div
              v-if="openMenuId === broadcast.id"
              class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2"
            >
              <!-- Для черновика -->
              <button
                v-if="broadcast.status === 'draft'"
                @click="openEditModal(broadcast)"
                class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ✏️ Редактировать
              </button>
              <button
                v-if="broadcast.status === 'draft'"
                @click="sendBroadcastNow(broadcast)"
                class="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                📤 Отправить сейчас
              </button>

              <!-- Для запланированной -->
              <button
                v-if="broadcast.status === 'scheduled'"
                @click="openEditModal(broadcast)"
                class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ✏️ Изменить расписание
              </button>
              <button
                v-if="broadcast.status === 'scheduled'"
                @click="sendBroadcastNow(broadcast)"
                class="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ⏰ Отправить сейчас
              </button>

              <!-- Для отправленных -->
              <button
                v-if="broadcast.status === 'sent'"
                @click="openBroadcastStats(broadcast)"
                class="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                📊 Статистика
              </button>

              <!-- Удаление (только для черновиков) -->
              <button
                v-if="broadcast.status === 'draft'"
                @click="deleteBroadcast(broadcast)"
                class="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет рассылок -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">📢</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет рассылок</h3>
        <p class="text-sm text-gray-600">
          {{
            filters.status
              ? "По выбранному фильтру рассылок не найдено"
              : "Рассылки ещё не созданы"
          }}
        </p>
        <button
          v-if="filters.status"
          @click="filters.status = null"
          class="mt-3 text-sm text-[#4e5d51] hover:text-[#3d4a40] font-medium"
        >
          Сбросить фильтр
        </button>
        <button
          v-else
          @click="openCreateModal"
          class="mt-3 text-sm text-[#4e5d51] hover:text-[#3d4a40] font-medium"
        >
          Создать первую рассылку
        </button>
      </div>
    </div>

    <!-- Модальные окна -->
    <CreateBroadcastModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="onBroadcastCreated"
    />

    <EditBroadcastModal
      v-if="editingBroadcast"
      :broadcast="editingBroadcast"
      @close="editingBroadcast = null"
      @updated="onBroadcastUpdated"
    />

    <BroadcastStatsModal
      v-if="selectedStatsBroadcast"
      :broadcast="selectedStatsBroadcast"
      @close="selectedStatsBroadcast = null"
    />
  </div>
</template>

<script>
import { broadcastAPI } from "@/utils/api";
import CreateBroadcastModal from "@/components/CreateBroadcastModal.vue";
import EditBroadcastModal from "@/components/EditBroadcastModal.vue";
import BroadcastStatsModal from "@/components/BroadcastStatsModal.vue";

export default {
  name: "AdminBroadcastsPage",
  components: {
    CreateBroadcastModal,
    EditBroadcastModal,
    BroadcastStatsModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      broadcasts: [],
      filters: {
        status: null,
      },
      showCreateModal: false,
      editingBroadcast: null,
      selectedStatsBroadcast: null,
      openMenuId: null,
      stats: {
        total: 0,
        sent: 0,
        scheduled: 0,
        failed: 0,
        draft: 0,
      },
    };
  },
  computed: {
    filteredBroadcasts() {
      let filtered = this.broadcasts;

      // Фильтр по статусу
      if (this.filters.status) {
        filtered = filtered.filter((b) => b.status === this.filters.status);
      }

      // Сортировка: сначала запланированные, потом черновики, потом отправленные
      return filtered.sort((a, b) => {
        const statusOrder = { scheduled: 0, draft: 1, sent: 2, failed: 3 };
        const orderA = statusOrder[a.status] || 4;
        const orderB = statusOrder[b.status] || 4;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        // По дате создания (новые сверху)
        return new Date(b.created_at) - new Date(a.created_at);
      });
    },
  },
  methods: {
    async loadBroadcasts() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка рассылок...");

        // Загружаем все рассылки
        const data = await broadcastAPI.getAll({ limit: 100 });

        if (Array.isArray(data)) {
          this.broadcasts = data;
          this.updateStats();
          console.log("Загружено рассылок:", this.broadcasts.length);
        } else {
          this.broadcasts = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке рассылок:", error);
        this.error = error.message || "Не удалось загрузить рассылки";
        this.broadcasts = [];
      } finally {
        this.isLoading = false;
      }
    },

    updateStats() {
      this.stats = {
        total: this.broadcasts.length,
        sent: this.broadcasts.filter((b) => b.status === "sent").length,
        scheduled: this.broadcasts.filter((b) => b.status === "scheduled")
          .length,
        failed: this.broadcasts.filter((b) => b.status === "failed").length,
        draft: this.broadcasts.filter((b) => b.status === "draft").length,
      };
    },

    toggleBroadcastMenu(broadcastId) {
      this.openMenuId = this.openMenuId === broadcastId ? null : broadcastId;
    },

    openCreateModal() {
      this.showCreateModal = true;
      this.openMenuId = null;
    },

    openEditModal(broadcast) {
      this.editingBroadcast = { ...broadcast };
      this.openMenuId = null;
    },

    openBroadcastStats(broadcast) {
      this.selectedStatsBroadcast = { ...broadcast };
      this.openMenuId = null;
    },

    async sendBroadcastNow(broadcast) {
      if (!confirm(`Отправить рассылку "${broadcast.title}" сейчас?`)) {
        return;
      }

      try {
        const response = await broadcastAPI.sendNow(broadcast.id);
        console.log("Рассылка отправлена:", response);

        // Обновляем локально
        const index = this.broadcasts.findIndex((b) => b.id === broadcast.id);
        if (index !== -1) {
          this.broadcasts[index] = {
            ...this.broadcasts[index],
            status: "sent",
            sent_at: new Date().toISOString(),
            sent_count: response.sent_count,
            failed_count: response.failed_count,
          };
          this.updateStats();
        }

        alert(
          `Рассылка отправлена. Успешно: ${response.sent_count}, Ошибок: ${response.failed_count}`
        );
      } catch (error) {
        console.error("Ошибка при отправке рассылки:", error);
        alert("Не удалось отправить рассылку: " + error.message);
      }
    },

    async deleteBroadcast(broadcast) {
      if (!confirm(`Удалить рассылку "${broadcast.title}"?`)) {
        return;
      }

      try {
        await broadcastAPI.delete(broadcast.id);
        console.log("Рассылка удалена:", broadcast.id);

        // Удаляем из локального списка
        this.broadcasts = this.broadcasts.filter((b) => b.id !== broadcast.id);
        this.updateStats();
      } catch (error) {
        console.error("Ошибка при удалении рассылки:", error);
        alert("Не удалось удалить рассылку: " + error.message);
      }
    },

    async onBroadcastCreated(newBroadcast) {
      console.log("Рассылка создана:", newBroadcast);
      this.showCreateModal = false;
      await this.loadBroadcasts();
    },

    async onBroadcastUpdated(updatedBroadcast) {
      console.log("Рассылка обновлена:", updatedBroadcast);
      this.editingBroadcast = null;
      await this.loadBroadcasts();
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

    getStatusLabel(status) {
      const labels = {
        draft: "Черновик",
        scheduled: "Запланирована",
        sent: "Отправлена",
        failed: "Ошибка",
      };
      return labels[status] || status;
    },

    getStatusColorClass(status) {
      const colors = {
        draft: "bg-gray-500",
        scheduled: "bg-blue-500",
        sent: "bg-green-500",
        failed: "bg-red-500",
      };
      return colors[status] || "bg-gray-400";
    },

    getStatusBadgeClass(status) {
      const classes = {
        draft: "bg-gray-100 text-gray-700 border-gray-300",
        scheduled: "bg-blue-50 text-blue-700 border-blue-200",
        sent: "bg-green-50 text-green-700 border-green-200",
        failed: "bg-red-50 text-red-700 border-red-200",
      };
      return classes[status] || "bg-gray-50 text-gray-700 border-gray-200";
    },
  },

  async created() {
    console.log("AdminBroadcastsPage created");
    await this.loadBroadcasts();
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
