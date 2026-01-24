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

      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white border-opacity-30"
        >
          🎁
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">Лояльность и промокоды</h1>
          <p class="text-white text-opacity-90 text-sm mt-1">
            Программа лояльности и специальные предложения
          </p>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="relative">
        <div class="rounded-full h-12 w-12 border-4 border-gray-200"></div>
        <div
          class="rounded-full h-12 w-12 border-4 border-[#4e5d51] border-t-transparent absolute top-0 left-0"
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

    <!-- Контент страницы -->
    <div v-else class="px-4 py-5">
      <!-- Переключатель вкладок -->
      <div
        class="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6"
      >
        <button
          @click="activeTab = 'loyalty'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all',
            activeTab === 'loyalty'
              ? 'bg-[#4e5d51] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          <div class="flex items-center justify-center">
            <span class="text-lg mr-2">👑</span>
            <span>Система лояльности</span>
          </div>
        </button>

        <button
          @click="activeTab = 'promo'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all',
            activeTab === 'promo'
              ? 'bg-[#4e5d51] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          <div class="flex items-center justify-center">
            <span class="text-lg mr-2">🏷️</span>
            <span>Промокоды ({{ promoCodes.length }})</span>
          </div>
        </button>
      </div>

      <!-- Контент вкладок -->
      <div>
        <!-- Вкладка: Система лояльности -->
        <div v-if="activeTab === 'loyalty'">
          <!-- Если нет данных о лояльности -->
          <div
            v-if="!loyaltyInfo"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <div class="text-4xl mb-4">👑</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Система лояльности
            </h3>
            <p class="text-gray-600">
              Информация о системе лояльности скоро появится
            </p>
          </div>

          <!-- Если есть данные о лояльности -->
          <div v-else class="space-y-4">
            <!-- Основная информация о лояльности -->
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div
                class="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"
              >
                <div class="flex items-center">
                  <span class="text-3xl mr-3">👑</span>
                  <div class="flex-1">
                    <h2 class="font-bold text-gray-900 text-lg">
                      {{ loyaltyInfo.title || "Система лояльности" }}
                    </h2>
                  </div>
                </div>
              </div>

              <div class="p-4">
                <!-- Контент из API -->
                <div
                  v-if="loyaltyInfo.content"
                  class="prose prose-sm max-w-none"
                >
                  <div v-html="formatContent(loyaltyInfo.content)"></div>
                </div>

                <!-- Если контента нет -->
                <div v-else class="text-gray-500 italic text-center py-4">
                  Описание программы лояльности скоро появится
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Вкладка: Промокоды -->
        <div v-else>
          <!-- Статистика промокодов -->
          <div
            class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              Статистика промокодов
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">
                  {{ promoCodes.length }}
                </div>
                <div class="text-xs text-gray-500">Всего</div>
              </div>

              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">
                  {{ firstVisitPromosCount }}
                </div>
                <div class="text-xs text-gray-500">Для первого визита</div>
              </div>
            </div>
          </div>

          <!-- Список промокодов -->
          <div v-if="promoCodes && promoCodes.length > 0" class="space-y-4">
            <!-- Карточка промокода -->
            <div
              v-for="promo in promoCodes"
              :key="promo.id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <!-- Цветная полоска -->
              <div :class="getPromoColorClass(promo)" class="h-1"></div>

              <!-- Заголовок промокода -->
              <div class="px-4 py-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h2 class="font-bold text-gray-900 text-lg">
                        {{ promo.code }}
                      </h2>
                      <span class="text-sm text-gray-500"
                        >ID: {{ promo.id }}</span
                      >
                    </div>

                    <!-- Статусы -->
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        v-if="promo.is_active"
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
                      <span
                        v-if="promo.for_first_visit_only"
                        class="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200"
                      >
                        Только первый визит
                      </span>
                    </div>
                  </div>

                  <!-- Скидка -->
                  <div
                    class="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold"
                  >
                    -{{ promo.discount_percent }}%
                  </div>
                </div>
              </div>

              <div class="px-4 pb-4 space-y-3">
                <!-- Типы программ -->
                <div>
                  <div class="text-xs font-medium text-gray-700 mb-2">
                    Применяется к:
                  </div>
                  <div
                    v-if="promo.program_types && promo.program_types.length > 0"
                    class="flex flex-wrap gap-1"
                  >
                    <span
                      v-for="type in promo.program_types"
                      :key="type"
                      class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border"
                    >
                      {{ getProgramTypeLabel(type) }}
                    </span>
                  </div>
                  <div v-else class="text-sm text-gray-600">
                    Применяется ко всем программам и мероприятиям
                  </div>
                </div>

                <!-- Информация о создании -->
                <div class="pt-3 border-t border-gray-100">
                  <div class="flex items-center text-xs text-gray-500">
                    <svg
                      class="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Создан: {{ formatDateTime(promo.created_at) }}
                  </div>
                </div>

                <!-- Как использовать -->
                <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div class="text-xs font-medium text-gray-700 mb-1">
                    Как использовать:
                  </div>
                  <p class="text-xs text-gray-600">
                    При оформлении записи введите промокод
                    <span class="font-mono font-bold text-blue-700">{{
                      promo.code
                    }}</span>
                    в поле "Промокод".
                    <span
                      v-if="promo.for_first_visit_only"
                      class="text-blue-600 font-medium"
                    >
                      Доступно только для первого визита.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Если нет промокодов -->
          <div
            v-else
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <div class="text-4xl mb-4">🏷️</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Активные промокоды
            </h3>
            <p class="text-gray-600">Сейчас нет доступных промокодов</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { loyaltyAPI } from "@/utils/api";

export default {
  name: "LoyaltyPage",
  data() {
    return {
      isLoading: false,
      error: null,
      loyaltyInfo: null, // Информация о лояльности из LOYALTY
      promoCodes: [], // Промокоды из API
      activeTab: "loyalty",
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData"]),

    // Статистика промокодов
    activePromosCount() {
      return this.promoCodes.filter((promo) => promo.is_active).length;
    },

    totalUses() {
      return this.promoCodes.reduce(
        (sum, promo) => sum + (promo.current_uses || 0),
        0
      );
    },

    firstVisitPromosCount() {
      return this.promoCodes.filter((promo) => promo.for_first_visit_only)
        .length;
    },
  },
  methods: {
    ...mapActions(useAppStore, ["loadSiteContent"]),

    // Форматирование контента
    formatContent(content) {
      if (!content) return "";
      return content
        .replace(/\n/g, "<br>")
        .replace(/\\n/g, "<br>")
        .replace(/\r\n/g, "<br>");
    },

    // Форматирование даты
    formatDate(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      } catch (e) {
        return dateString;
      }
    },

    // Форматирование даты и времени
    formatDateTime(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        return dateString;
      }
    },

    // Получение процента использования
    getUsagePercentage(promo) {
      if (!promo.max_uses || promo.max_uses === 0) return 0;
      return Math.min(
        100,
        Math.round((promo.current_uses / promo.max_uses) * 100)
      );
    },

    // Получение цвета для промокода
    getPromoColorClass(promo) {
      if (!promo.is_active) return "bg-gray-400";
      if (promo.for_first_visit_only) return "bg-purple-500";

      // Проверяем срок действия
      if (promo.valid_until) {
        const now = new Date();
        const validUntil = new Date(promo.valid_until);
        if (validUntil < now) return "bg-red-500";
      }

      // Проверяем использование
      if (promo.max_uses && promo.current_uses >= promo.max_uses) {
        return "bg-red-500";
      }

      return "bg-green-500";
    },

    // Получение названия типа программы
    getProgramTypeLabel(type) {
      const labels = {
        COLLECTIVE: "Коллективные программы",
        AUTHOR: "Авторские программы",
        BACHELOR: "Батчеллы",
        CLUB_EVENT: "Клубные мероприятия",
        CERTIFICATE: "Подарочные сертификаты",
      };
      return labels[type] || type;
    },

    // Загрузка данных о лояльности из contentData
    async loadLoyaltyInfo() {
      try {
        await this.loadSiteContent("LOYALTY", true);

        const content = this.contentData?.["LOYALTY"];

        if (content && typeof content === "object") {
          this.loyaltyInfo = content;
          console.log("Загружена информация о лояльности:", this.loyaltyInfo);
        } else {
          this.loyaltyInfo = null;
          console.log("Информация о лояльности не найдена");
        }
      } catch (error) {
        console.error("Ошибка при загрузке информации о лояльности:", error);
        this.loyaltyInfo = null;
      }
    },

    // Загрузка промокодов из API
    async loadPromoCodes() {
      try {
        const promos = await loyaltyAPI.getPromos();
        console.log("Получены промокоды из API:", promos);

        if (Array.isArray(promos)) {
          // Сохраняем все промокоды (без фильтрации по дате)
          this.promoCodes = promos.sort((a, b) => {
            // Сначала активные, потом неактивные
            if (a.is_active !== b.is_active) {
              return a.is_active ? -1 : 1;
            }
            // Новые сверху
            return new Date(b.created_at) - new Date(a.created_at);
          });

          console.log("Загружено промокодов:", this.promoCodes.length);
          console.log("Пример промокода:", this.promoCodes[0]);
        } else {
          this.promoCodes = [];
          console.log("Промокоды не найдены или не в формате массива");
        }
      } catch (error) {
        console.error("Ошибка при загрузке промокодов:", error);
        this.promoCodes = [];
      }
    },

    // Основная загрузка данных
    async loadData() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка данных для страницы лояльности");

        // Параллельно загружаем обе части
        await Promise.all([this.loadLoyaltyInfo(), this.loadPromoCodes()]);

        console.log("Все данные загружены успешно");
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        this.error = error.message || "Не удалось загрузить информацию";
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    console.log("LoyaltyPage created");

    try {
      await this.loadData();
      console.log("Страница лояльности загружена успешно");
    } catch (error) {
      console.error("Ошибка при загрузке страницы лояльности:", error);
      this.error = error.message || "Ошибка при загрузке страницы";
    }
  },

  // Следим за изменением филиала
  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log("Филиал изменился, перезагружаем данные:", newBranchId);
        this.loadData();
      },
    },
  },
};
</script>

<style scoped>
.prose :deep(p) {
  margin-bottom: 0.75em;
}

.prose :deep(ul) {
  margin-bottom: 0.75em;
  padding-left: 1.5em;
  list-style-type: disc;
}

.prose :deep(li) {
  margin-bottom: 0.25em;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #111827;
}
</style>
