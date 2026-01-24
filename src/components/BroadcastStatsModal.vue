<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <!-- Шапка -->
      <div
        class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-4 py-3 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-base">Статистика рассылки</h3>
            <p class="text-xs text-white text-opacity-90 mt-1">
              {{ broadcast.title }} • ID: {{ broadcast.id }}
            </p>
          </div>
          <button @click="close" class="text-white hover:text-gray-200">
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

      <!-- Форма с прокруткой -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Основная статистика -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">
            Основная статистика
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <div class="text-2xl font-bold text-gray-900">
                {{ stats.total_recipients || 0 }}
              </div>
              <div class="text-xs text-gray-500">Всего получателей</div>
            </div>
            <div class="bg-green-50 rounded-lg p-3 text-center">
              <div class="text-2xl font-bold text-green-600">
                {{ stats.sent_count || 0 }}
              </div>
              <div class="text-xs text-green-500">Успешно отправлено</div>
            </div>
            <div class="bg-red-50 rounded-lg p-3 text-center">
              <div class="text-2xl font-bold text-red-600">
                {{ stats.failed_count || 0 }}
              </div>
              <div class="text-xs text-red-500">Ошибок отправки</div>
            </div>
            <div class="bg-blue-50 rounded-lg p-3 text-center">
              <div class="text-2xl font-bold text-blue-600">
                {{ stats.pending_count || 0 }}
              </div>
              <div class="text-xs text-blue-500">Ожидают отправки</div>
            </div>
          </div>
        </div>

        <!-- Информация о рассылке -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">
            Информация о рассылке
          </h4>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div class="text-xs text-gray-500">Статус</div>
                <div class="text-sm font-medium text-gray-900">
                  <span
                    :class="getStatusBadgeClass(broadcast.status)"
                    class="px-2 py-0.5 rounded text-xs"
                  >
                    {{ getStatusLabel(broadcast.status) }}
                  </span>
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Целевая аудитория</div>
                <div class="text-sm font-medium text-gray-900">
                  {{
                    broadcast.target_users === "all"
                      ? "Все пользователи"
                      : "Выбранные пользователи"
                  }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Создана</div>
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDateTime(broadcast.created_at) }}
                </div>
              </div>
              <div v-if="broadcast.scheduled_at">
                <div class="text-xs text-gray-500">Запланирована на</div>
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDateTime(broadcast.scheduled_at) }}
                </div>
              </div>
              <div v-if="broadcast.sent_at">
                <div class="text-xs text-gray-500">Отправлена</div>
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDateTime(broadcast.sent_at) }}
                </div>
              </div>
            </div>
            <!-- Добавьте блок статистики в инфо -->
            <div class="pt-2 border-t border-gray-200 mt-2">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">
                    {{ stats.total_recipients || 0 }}
                  </div>
                  <div class="text-xs text-gray-500">Получателей</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-green-600">
                    {{ stats.sent_count || 0 }}
                  </div>
                  <div class="text-xs text-green-500">Отправлено</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-red-600">
                    {{ stats.failed_count || 0 }}
                  </div>
                  <div class="text-xs text-red-500">Ошибок</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-blue-600">
                    {{ stats.pending_count || 0 }}
                  </div>
                  <div class="text-xs text-blue-500">Ожидают</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- История доставки -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-semibold text-gray-900">
              История доставки
            </h4>
            <button
              @click="loadHistory"
              :disabled="isLoadingHistory"
              class="text-xs text-[#4e5d51] hover:text-[#3d4a40] flex items-center gap-1"
            >
              <svg
                :class="{ 'animate-spin': isLoadingHistory }"
                class="w-3 h-3"
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
              Обновить
            </button>
          </div>

          <!-- Фильтры истории -->
          <div class="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
            <button
              @click="historyFilter.status = null"
              :class="
                historyFilter.status === null
                  ? 'bg-[#4e5d51] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
              class="px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors"
            >
              Все
            </button>
            <button
              @click="historyFilter.status = 'sent'"
              :class="
                historyFilter.status === 'sent'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
              class="px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors"
            >
              Успешно
            </button>
            <button
              @click="historyFilter.status = 'failed'"
              :class="
                historyFilter.status === 'failed'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
              class="px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors"
            >
              Ошибки
            </button>
            <button
              @click="historyFilter.status = 'pending'"
              :class="
                historyFilter.status === 'pending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
              class="px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors"
            >
              Ожидают
            </button>
          </div>

          <!-- Список истории -->
          <div v-if="filteredHistory.length > 0" class="space-y-2">
            <div
              v-for="item in filteredHistory"
              :key="item.id"
              class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="flex items-center">
                      <div
                        :class="
                          item.status === 'sent'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                        "
                        class="px-2 py-0.5 rounded text-xs font-medium"
                      >
                        {{
                          item.status === "sent"
                            ? "✓ Отправлено"
                            : item.status === "failed"
                              ? "✗ Ошибка"
                              : "⏳ Ожидает"
                        }}
                      </div>
                      <span class="text-xs text-gray-500 ml-2">
                        ID: {{ item.user_id }}
                      </span>
                    </div>
                  </div>
                  <div
                    v-if="item.error_message"
                    class="text-xs text-red-600 mb-1"
                  >
                    Ошибка: {{ item.error_message }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatDateTime(item.sent_at || item.created_at) }}
                  </div>
                </div>
                <button
                  v-if="item.status === 'failed'"
                  @click="retrySend(item.user_id)"
                  :disabled="isRetrying"
                  class="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Повторить
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <div class="text-gray-400 mb-2">
              <svg
                class="w-12 h-12 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <p class="text-sm text-gray-500">
              {{
                historyFilter.status
                  ? "Записей с таким статусом не найдено"
                  : "История доставки не найдена"
              }}
            </p>
          </div>
        </div>

        <!-- Предпросмотр сообщения -->
        <div class="border-t border-gray-200 pt-4">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">
            Предпросмотр сообщения
          </h4>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="text-sm font-medium text-gray-900 mb-2">
              {{ broadcast.title }}
            </div>
            <div
              class="text-sm text-gray-800 whitespace-pre-wrap"
              v-html="formatMessage(broadcast.message)"
            ></div>
            <div class="text-xs text-gray-500 mt-3">
              {{ broadcast.message.length }} символов
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div class="flex gap-3">
          <button
            type="button"
            @click="close"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm transition-all active:scale-98"
          >
            Закрыть
          </button>
          <button
            v-if="broadcast.status === 'draft'"
            type="button"
            @click="sendBroadcastNow"
            :disabled="isSending"
            class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isSending">
              <svg
                class="w-4 h-4 mr-2 inline"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Отправить сейчас
            </span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin h-4 w-4 mr-2"
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
              Отправка...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { broadcastAPI } from "@/utils/api";

export default {
  name: "BroadcastStatsModal",
  props: {
    broadcast: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isLoadingHistory: false,
      isSending: false,
      isRetrying: false,
      history: [],
      stats: {
        total_recipients: 0,
        sent_count: 0,
        failed_count: 0,
        pending_count: 0,
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
      },
      historyFilter: {
        status: null,
      },
    };
  },
  computed: {
    filteredHistory() {
      let filtered = this.history;

      if (this.historyFilter.status) {
        filtered = filtered.filter(
          (item) => item.status === this.historyFilter.status
        );
      }

      return filtered.sort((a, b) => {
        const dateA = new Date(a.sent_at || a.created_at);
        const dateB = new Date(b.sent_at || b.created_at);
        return dateB - dateA;
      });
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },

    async loadStats() {
      try {
        const response = await broadcastAPI.getStats(this.broadcast.id);

        // Адаптируем структуру данных под то, что приходит с сервера
        this.stats = {
          total_recipients: response.total_recipients || 0,
          sent_count: response.sent_count || 0,
          failed_count: response.failed_count || 0,
          pending_count: response.pending_count || 0,
          // Также добавляем короткие имена для удобства
          total: response.total_recipients || 0,
          sent: response.sent_count || 0,
          failed: response.failed_count || 0,
          pending: response.pending_count || 0,
        };
      } catch (error) {
        console.error("Ошибка при загрузке статистики:", error);
        // Используем данные из broadcast если есть
        this.stats = {
          total_recipients: this.broadcast.total_recipients || 0,
          sent_count: this.broadcast.sent_count || 0,
          failed_count: this.broadcast.failed_count || 0,
          pending_count: this.broadcast.pending_count || 0,
          total: this.broadcast.total_recipients || 0,
          sent: this.broadcast.sent_count || 0,
          failed: this.broadcast.failed_count || 0,
          pending: this.broadcast.pending_count || 0,
        };
      }
    },

    async loadHistory() {
      try {
        this.isLoadingHistory = true;
        const response = await broadcastAPI.getHistory(this.broadcast.id, {
          limit: 50,
        });
        this.history = response;
      } catch (error) {
        console.error("Ошибка при загрузке истории:", error);
        this.history = [];
      } finally {
        this.isLoadingHistory = false;
      }
    },

    async retrySend(userId) {
      if (!confirm("Повторить отправку этому пользователю?")) return;

      try {
        this.isRetrying = true;
        const itemIndex = this.history.findIndex(
          (item) => item.user_id === userId && item.status === "failed"
        );
        if (itemIndex !== -1) {
          this.history[itemIndex].status = "pending";
          this.history[itemIndex].error_message = null;

          // Обновляем статистику с правильными именами полей
          this.stats.failed_count = Math.max(0, this.stats.failed_count - 1);
          this.stats.pending_count = (this.stats.pending_count || 0) + 1;
          this.stats.failed = Math.max(0, this.stats.failed - 1);
          this.stats.pending = (this.stats.pending || 0) + 1;
        }
        alert("Запрос на повторную отправку отправлен");
      } catch (error) {
        console.error("Ошибка при повторной отправке:", error);
        alert("Не удалось отправить запрос: " + error.message);
      } finally {
        this.isRetrying = false;
      }
    },

    async sendBroadcastNow() {
      if (!confirm(`Отправить рассылку "${this.broadcast.title}" сейчас?`)) {
        return;
      }

      try {
        this.isSending = true;
        const response = await broadcastAPI.sendNow(this.broadcast.id);

        // Обновляем локальные данные с правильными именами полей
        this.stats = {
          total_recipients: response.total || this.stats.total_recipients,
          sent_count: response.sent_count || 0,
          failed_count: response.failed_count || 0,
          pending_count: 0,
          total: response.total || this.stats.total,
          sent: response.sent_count || 0,
          failed: response.failed_count || 0,
          pending: 0,
        };

        // Загружаем обновленную историю
        await this.loadHistory();

        alert(
          `Рассылка отправлена. Успешно: ${response.sent_count}, Ошибок: ${response.failed_count}`
        );
        this.close();
      } catch (error) {
        console.error("Ошибка при отправке рассылки:", error);
        alert("Не удалось отправить рассылку: " + error.message);
      } finally {
        this.isSending = false;
      }
    },

    // Вспомогательные методы
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

    formatMessage(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
        .replace(/&lt;(\/?)(b|i|u|code|pre|strong|em)&gt;/g, "<$1$2>");
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

    getStatusBadgeClass(status) {
      const classes = {
        draft: "bg-gray-100 text-gray-700",
        scheduled: "bg-blue-100 text-blue-700",
        sent: "bg-green-100 text-green-700",
        failed: "bg-red-100 text-red-700",
      };
      return classes[status] || "bg-gray-100 text-gray-700";
    },
  },

  async mounted() {
    if (this.isOpen) {
      await Promise.all([this.loadStats(), this.loadHistory()]);
    }
  },

  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.loadStats();
        this.loadHistory();
      }
    },
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
