<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Шапка - статичная -->
    <div class="bg-[#202c27] text-white px-5 py-6 relative z-10">
      <div class="flex items-center justify-between mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft class="h-6 w-6 mr-1" />
          <span class="font-light">Назад</span>
        </button>
        <div class="relative">
          <button @click.stop="showBranchSelect = !showBranchSelect" class="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-1.5 transition-all duration-200">
            <MapPin class="h-3.5 w-3.5 text-[#c2a886]" />
            <span class="text-white font-medium text-[13px] max-w-[90px] truncate">{{ selectedBranch?.short_name || selectedBranch?.name || "Филиал" }}</span>
            <ChevronDown :class="['h-3.5 w-3.5 text-white/70 transition-transform', showBranchSelect ? 'rotate-180' : '']" />
          </button>
          <div v-if="showBranchSelect" class="fixed inset-0 z-40" @click="showBranchSelect = false" />
          <transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <div v-if="showBranchSelect" class="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 z-50 max-h-72 overflow-y-auto">
              <div class="py-2">
                <p class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Выберите филиал</p>
                <div class="space-y-0.5">
                  <div v-for="branch in allBranches" :key="branch.id" @click="handleSelectBranch(branch)" class="px-4 py-2.5 mx-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all" :class="{ 'bg-[#c2a886]/10 border-l-2 border-[#c2a886]': selectedBranch?.id === branch.id }">
                    <div class="flex items-center gap-2.5">
                      <div class="h-7 w-7 rounded-full bg-[#202c27]/5 flex items-center justify-center flex-shrink-0"><MapPin class="h-3 w-3 text-[#202c27]" /></div>
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-900 text-sm">{{ branch.name }}</div>
                        <div v-if="branch.address" class="text-xs text-gray-500 truncate">{{ branch.address }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center border-2 border-white/10 backdrop-blur-sm"
        >
          <Tag class="h-8 w-8 text-white" />
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-light tracking-wide">
            Лояльность и промокоды
          </h1>
          <p class="text-white/70 text-sm mt-1 font-light">
            Программа лояльности и специальные предложения
          </p>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center py-16 px-5"
    >
      <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
      <p class="text-sm text-gray-600 font-light">Загружаем информацию...</p>
    </div>

    <!-- Ошибка -->
    <div
      v-else-if="error"
      class="mx-5 mt-5 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-sm"
    >
      <div class="flex items-start gap-3">
        <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Контент страницы -->
    <div v-else class="px-5 py-5">
      <!-- Переключатель вкладок -->
      <div class="flex rounded-xl bg-[#d9cebc]/60 p-1 mb-5">
        <button
          @click="activeTab = 'loyalty'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'loyalty'
              ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] shadow-md text-white'
              : 'text-gray-700 hover:bg-white/50',
          ]"
        >
          <Crown class="h-4 w-4" />
          <span>Лояльность</span>
        </button>

        <button
          @click="activeTab = 'promo'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'promo'
              ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] shadow-md text-white'
              : 'text-gray-700 hover:bg-white/50',
          ]"
        >
          <Tag class="h-4 w-4" />
          <span>Промокоды ({{ promoCodes.length }})</span>
        </button>
      </div>

      <!-- Контент вкладок -->
      <div>
        <!-- Вкладка: Система лояльности -->
        <div v-if="activeTab === 'loyalty'">
          <!-- Если нет данных о лояльности -->
          <div
            v-if="!loyaltyInfo"
            class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-8 text-center"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Crown class="h-8 w-8 text-[#c2a886]" />
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-2">
              Система лояльности
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              Информация о системе лояльности скоро появится
            </p>
          </div>

          <!-- Если есть данные о лояльности -->
          <div v-else class="space-y-4">
            <!-- Основная информация о лояльности -->
            <div
              class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden"
            >
              <div class="px-4 py-4 bg-[#d9cebc] border-b border-[#c2a886]/30">
                <div class="flex items-center gap-3">
                  <div
                    class="h-12 w-12 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <Crown class="h-6 w-6 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h2
                      class="font-semibold text-gray-900 text-base leading-tight"
                    >
                      {{ loyaltyInfo.title || "Система лояльности" }}
                    </h2>
                  </div>
                </div>
              </div>

              <div class="p-4">
                <!-- Контент из API с разворачиванием -->
                <div
                  v-if="loyaltyInfo.content"
                  class="bg-[#d9cebc]/40 rounded-xl p-4"
                >
                  <div
                    :class="[
                      'text-sm text-gray-700 leading-relaxed prose-content transition-all duration-300',
                      !expandedLoyalty && isContentLong(loyaltyInfo.content)
                        ? 'line-clamp-4'
                        : '',
                    ]"
                    v-html="formatContent(loyaltyInfo.content)"
                  ></div>

                  <!-- Кнопка развернуть/свернуть -->
                  <button
                    v-if="isContentLong(loyaltyInfo.content)"
                    @click="expandedLoyalty = !expandedLoyalty"
                    class="mt-3 text-sm text-[#c2a886] hover:text-[#b5976e] font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>{{
                      expandedLoyalty ? "Свернуть" : "Развернуть"
                    }}</span>
                    <ChevronDown
                      :class="[
                        'h-4 w-4 transition-transform duration-300',
                        expandedLoyalty ? 'rotate-180' : '',
                      ]"
                    />
                  </button>
                </div>

                <!-- Если контента нет -->
                <div
                  v-else
                  class="text-gray-500 text-sm text-center py-4 bg-[#d9cebc]/40 rounded-xl"
                >
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
            class="mb-5 bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-4"
          >
            <h3
              class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"
            >
              <BarChart3 class="h-4 w-4 text-[#c2a886]" />
              Статистика промокодов
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-[#d9cebc]/40 rounded-xl p-3 text-center">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ promoCodes.length }}
                </div>
                <div class="text-xs text-gray-600 mt-1">Всего</div>
              </div>

              <div class="bg-[#d9cebc]/40 rounded-xl p-3 text-center">
                <div class="text-2xl font-semibold text-[#c2a886]">
                  {{ firstVisitPromosCount }}
                </div>
                <div class="text-xs text-gray-600 mt-1">Первый визит</div>
              </div>
            </div>
          </div>

          <!-- Список промокодов -->
          <div v-if="promoCodes && promoCodes.length > 0" class="space-y-3">
            <!-- Карточка промокода -->
            <div
              v-for="promo in promoCodes"
              :key="promo.id"
              class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden"
            >
              <!-- Цветная полоска -->
              <div :class="getPromoColorClass(promo)" class="h-1"></div>

              <!-- Заголовок промокода -->
              <div class="px-4 py-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2 flex-wrap">
                      <h2 class="font-bold text-gray-900 text-base font-mono">
                        {{ promo.code }}
                      </h2>
                      <span class="text-xs text-gray-500"
                        >ID: {{ promo.id }}</span
                      >
                    </div>

                    <!-- Статусы -->
                    <div class="flex flex-wrap items-center gap-2">
                      <span
                        v-if="promo.is_active"
                        class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg border border-green-200 flex items-center gap-1"
                      >
                        <CheckCircle class="h-3 w-3" />
                        Активен
                      </span>
                      <span
                        v-else
                        class="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-lg border border-red-200 flex items-center gap-1"
                      >
                        <XCircle class="h-3 w-3" />
                        Неактивен
                      </span>
                      <span
                        v-if="promo.for_first_visit_only"
                        class="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg border border-purple-200 flex items-center gap-1"
                      >
                        <Sparkles class="h-3 w-3" />
                        Первый визит
                      </span>
                    </div>
                  </div>

                  <!-- Скидка -->
                  <div
                    class="px-3 py-2 bg-gradient-to-br from-[#c2a886] to-[#b5976e] text-white rounded-xl text-sm font-bold shadow-md flex-shrink-0"
                  >
                    -{{ promo.discount_percent }}%
                  </div>
                </div>
              </div>

              <div class="px-4 pb-4 space-y-3">
                <!-- Описание -->
                <div
                  v-if="promo.description"
                  class="text-sm text-gray-700 leading-relaxed"
                >
                  {{ promo.description }}
                </div>

                <!-- Типы программ -->
                <div>
                  <div
                    class="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1"
                  >
                    <Target class="h-3 w-3 text-[#c2a886]" />
                    Применяется к:
                  </div>
                  <!-- Конкретные программы (приоритет) -->
                  <div
                    v-if="promo.program_ids && promo.program_ids.length > 0"
                    class="flex flex-wrap gap-1.5"
                  >
                    <span
                      v-for="name in getProgramNames(promo.program_ids)"
                      :key="name"
                      class="text-xs bg-[#d9cebc]/60 text-gray-700 px-2 py-1 rounded-lg border border-[#c2a886]/20"
                    >
                      {{ name }}
                    </span>
                  </div>
                  <!-- Типы программ -->
                  <div
                    v-else-if="promo.program_types && promo.program_types.length > 0"
                    class="flex flex-wrap gap-1.5"
                  >
                    <span
                      v-for="type in promo.program_types"
                      :key="type"
                      class="text-xs bg-[#d9cebc]/60 text-gray-700 px-2 py-1 rounded-lg border border-[#c2a886]/20"
                    >
                      {{ getProgramTypeLabel(type) }}
                    </span>
                  </div>
                  <div v-else class="text-sm text-gray-600">
                    Применяется ко всем программам и мероприятиям
                  </div>
                </div>

                <!-- Информация о создании -->
                <div class="pt-3 border-t border-[#c2a886]/20">
                  <div class="flex items-center text-xs text-gray-600">
                    <Calendar class="h-3 w-3 mr-1.5 text-[#c2a886]" />
                    Создан: {{ formatDateTime(promo.created_at) }}
                  </div>
                </div>

                <!-- Как использовать -->
                <div
                  class="bg-[#d9cebc]/60 rounded-xl p-3 border border-[#c2a886]/30"
                >
                  <div
                    class="text-xs font-medium text-gray-900 mb-1.5 flex items-center gap-1"
                  >
                    <Info class="h-3 w-3 text-[#c2a886]" />
                    Как использовать:
                  </div>
                  <p class="text-xs text-gray-700 leading-relaxed">
                    При оформлении записи введите промокод
                    <span class="font-mono font-bold text-[#c2a886]">{{
                      promo.code
                    }}</span>
                    в поле "Промокод".
                    <span
                      v-if="promo.for_first_visit_only"
                      class="text-purple-700 font-medium"
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
            class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-8 text-center"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Tag class="h-8 w-8 text-[#c2a886]" />
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-2">
              Активные промокоды
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              Сейчас нет доступных промокодов
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { loyaltyAPI, programAPI, branchAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "LoyaltyPage",
  components: {
    ...icons,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      loyaltyInfo: null,
      promoCodes: [],
      allPrograms: [],
      allBranches: [],
      showBranchSelect: false,
      activeTab: "loyalty",
      expandedLoyalty: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData"]),

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
    ...mapActions(useAppStore, ["loadSiteContent", "selectBranch"]),

    formatContent(content) {
      if (!content) return "";
      return content
        .replace(/\n/g, "<br>")
        .replace(/\\n/g, "<br>")
        .replace(/\r\n/g, "<br>");
    },

    isContentLong(content) {
      if (!content) return false;
      const textLength = content.replace(/<[^>]*>/g, "").length;
      const lineBreaks = (content.match(/\n|<br>/gi) || []).length;
      return textLength > 200 || lineBreaks > 3;
    },

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

    getUsagePercentage(promo) {
      if (!promo.max_uses || promo.max_uses === 0) return 0;
      return Math.min(
        100,
        Math.round((promo.current_uses / promo.max_uses) * 100)
      );
    },

    getPromoColorClass(promo) {
      if (!promo.is_active) return "bg-gray-400";
      if (promo.for_first_visit_only)
        return "bg-gradient-to-r from-purple-500 to-purple-600";

      if (promo.valid_until) {
        const now = new Date();
        const validUntil = new Date(promo.valid_until);
        if (validUntil < now) return "bg-red-500";
      }

      if (promo.max_uses && promo.current_uses >= promo.max_uses) {
        return "bg-red-500";
      }

      return "bg-gradient-to-r from-[#c2a886] to-[#b5976e]";
    },

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

    async loadAllBranches() {
      try {
        const branches = await branchAPI.getAll();
        this.allBranches = branches.filter((b) => b.is_active !== false);
      } catch (e) {
        this.allBranches = [];
      }
    },

    async handleSelectBranch(branch) {
      this.showBranchSelect = false;
      await this.selectBranch(branch);
    },

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

    async loadPromoCodes() {
      try {
        const promos = await loyaltyAPI.getPromos(this.selectedBranch?.id);
        console.log("Получены промокоды из API:", promos);

        if (Array.isArray(promos)) {
          this.promoCodes = promos.sort((a, b) => {
            if (a.is_active !== b.is_active) {
              return a.is_active ? -1 : 1;
            }
            return new Date(b.created_at) - new Date(a.created_at);
          });

          console.log("Загружено промокодов:", this.promoCodes.length);
        } else {
          this.promoCodes = [];
          console.log("Промокоды не найдены или не в формате массива");
        }
      } catch (error) {
        console.error("Ошибка при загрузке промокодов:", error);
        this.promoCodes = [];
      }
    },

    async loadAllPrograms() {
      try {
        const data = await programAPI.getAll(this.selectedBranch?.id);
        this.allPrograms = Array.isArray(data) ? data : [];
      } catch (e) {
        this.allPrograms = [];
      }
    },

    getProgramNames(ids) {
      if (!ids || ids.length === 0) return [];
      return ids.map((id) => {
        const prog = this.allPrograms.find((p) => p.id === id);
        return prog ? prog.name : `#${id}`;
      });
    },

    async loadData() {
      try {
        console.log("Загрузка данных для страницы лояльности");

        await Promise.all([this.loadLoyaltyInfo(), this.loadPromoCodes(), this.loadAllPrograms()]);

        console.log("Все данные загружены успешно");
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        this.error = error.message || "Не удалось загрузить информацию";
      }
    },
  },
  async created() {
    console.log("LoyaltyPage created");

    try {
      await Promise.all([this.loadData(), this.loadAllBranches()]);
      console.log("Страница лояльности загружена успешно");
    } catch (error) {
      console.error("Ошибка при загрузке страницы лояльности:", error);
      this.error = error.message || "Ошибка при загрузке страницы";
    } finally {
      this.isLoading = false;
    }
  },

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
/* Line clamp для сворачивания текста */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Стили для контента из API */
.prose-content :deep(p) {
  margin-bottom: 0.75em;
}

.prose-content :deep(ul) {
  margin-bottom: 0.75em;
  padding-left: 1.5em;
  list-style-type: disc;
}

.prose-content :deep(li) {
  margin-bottom: 0.25em;
}

.prose-content :deep(strong) {
  font-weight: 600;
  color: #202c27;
}
</style>
