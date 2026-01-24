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
          👥
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">Коллективные программы</h1>
          <p class="text-white text-opacity-90 text-sm mt-1">
            Тепло, живой пар, общее действие и единение
          </p>
        </div>
      </div>
    </div>

    <!-- Переключатель вкладок -->
    <div class="px-4 py-3 border-b border-gray-200 bg-white">
      <div class="flex rounded-lg bg-gray-100 p-1">
        <button
          @click="activeTab = 'info'"
          :class="[
            'flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'info'
              ? 'bg-white shadow-sm text-[#4e5d51]'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          📋 Основная информация
        </button>
        <button
          @click="activeTab = 'gallery'"
          :class="[
            'flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'gallery'
              ? 'bg-white shadow-sm text-[#4e5d51]'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          📸 Галерея
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

    <!-- Контент: Основная информация -->
    <div v-else-if="activeTab === 'info'" class="px-4 py-5">
      <!-- Описание раздела из контента -->
      <div
        v-if="pageContent"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
      >
        <h3 class="font-semibold text-gray-900 mb-3">
          О коллективных программах
        </h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ pageContent }}
        </div>
      </div>

      <!-- Если программ нет -->
      <div
        v-if="!collectivePrograms || collectivePrograms.length === 0"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
      >
        <div class="text-4xl mb-4">👥</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Коллективные программы
        </h3>
        <p class="text-gray-600">
          Скоро здесь появится информация о коллективных программах
        </p>
      </div>

      <!-- Список программ -->
      <div v-else class="space-y-3">
        <!-- Карточка программы -->
        <router-link
          v-for="program in collectivePrograms"
          :key="program.id"
          :to="{
            name: 'CollectiveProgramDetail',
            params: { id: program.id },
          }"
          class="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 active:scale-98"
        >
          <!-- Заголовок программы -->
          <div class="px-4 py-4 bg-gradient-to-r from-green-50 to-emerald-50">
            <div class="flex items-start justify-between">
              <div class="flex items-start flex-1 min-w-0">
                <span class="text-2xl mr-3 flex-shrink-0">👥</span>
                <div class="flex-1 min-w-0">
                  <h2
                    class="font-bold text-gray-900 text-base leading-tight mb-1"
                  >
                    {{ program.name }}
                  </h2>
                  <p
                    v-if="program.short_description"
                    class="text-sm text-gray-600 line-clamp-2"
                  >
                    {{ program.short_description }}
                  </p>
                </div>
              </div>
              <svg
                class="w-5 h-5 text-gray-400 flex-shrink-0 ml-2 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <!-- Краткая информация -->
          <div class="px-4 py-3 space-y-2">
            <!-- Цена и длительность -->
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <!-- Цена -->
              <div
                v-if="getPriceRange(program)"
                class="bg-green-50 text-green-800 px-3 py-1.5 rounded-lg border border-green-200 text-sm font-semibold"
              >
                {{ getPriceRange(program) }}
              </div>

              <!-- Длительность -->
              <div
                v-if="getDurationRange(program)"
                class="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 text-sm flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ getDurationRange(program) }}
              </div>
            </div>

            <!-- Количество участников -->
            <div
              v-if="getGuestsRange(program)"
              class="text-xs text-gray-500 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                />
              </svg>
              {{ getGuestsRange(program) }}
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Контент: Фотогалерея -->
    <div v-else-if="activeTab === 'gallery'">
      <MediaGallery
        :sections="gallerySections"
        :show-media-type-filter="true"
        :category-labels="categoryLabels"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { programAPI } from "@/utils/api";
import MediaGallery from "@/components/MediaGallery.vue";

export default {
  name: "CollectiveProgramsPage",
  components: {
    MediaGallery,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      collectivePrograms: [], // Список коллективных программ из API
      pageContent: null, // Контент страницы (описание)
      activeTab: "info", // 'info' или 'gallery'
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData"]),

    gallerySections() {
      return ["COLLECTIVE"];
    },

    categoryLabels() {
      return {
        COLLECTIVE: "Коллективные программы",
      };
    },
  },
  methods: {
    ...mapActions(useAppStore, ["loadSiteContent"]),
    // Форматирование цены
    formatPrice(price) {
      if (!price && price !== 0) return "";

      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;

      return priceNumber.toLocaleString("ru-RU") + " ₽";
    },

    // Получить диапазон цен из pricing_tiers
    getPriceRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        return null;
      }

      const activeTiers = program.pricing_tiers.filter(
        (tier) => tier.is_active !== false
      );
      if (activeTiers.length === 0) return null;

      const prices = activeTiers.map((tier) => tier.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return this.formatPrice(minPrice);
      } else {
        return `${this.formatPrice(minPrice)} - ${this.formatPrice(maxPrice)}`;
      }
    },

    // Получить диапазон длительности
    getDurationRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        return null;
      }

      const activeTiers = program.pricing_tiers.filter(
        (tier) => tier.is_active !== false
      );
      if (activeTiers.length === 0) return null;

      const durations = activeTiers.map((tier) => tier.duration_minutes);
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);

      if (minDuration === maxDuration) {
        return this.formatDuration(minDuration);
      } else {
        return `${this.formatDuration(minDuration)} - ${this.formatDuration(maxDuration)}`;
      }
    },

    // Получить диапазон гостей
    getGuestsRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        if (program.max_participants) {
          return `До ${program.max_participants} гостей`;
        }
        return null;
      }

      const activeTiers = program.pricing_tiers.filter(
        (tier) => tier.is_active !== false
      );
      if (activeTiers.length === 0) return null;

      const minGuests = Math.min(...activeTiers.map((tier) => tier.min_guests));
      const maxGuests = Math.max(...activeTiers.map((tier) => tier.max_guests));

      if (minGuests === maxGuests) {
        return `${minGuests} ${minGuests === 1 ? "гость" : minGuests <= 4 ? "гостя" : "гостей"}`;
      } else {
        return `${minGuests}-${maxGuests} гостей`;
      }
    },

    // Форматирование длительности
    formatDuration(minutes) {
      if (!minutes) return "";

      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      if (hours > 0 && mins > 0) {
        return `${hours} ч ${mins} мин`;
      } else if (hours > 0) {
        return `${hours} ч`;
      } else {
        return `${mins} мин`;
      }
    },

    // Загрузка контента страницы
    async loadPageContent() {
      try {
        await this.loadSiteContent("COLLECTIVE");

        // Получаем контент из contentData
        const content = this.contentData?.["COLLECTIVE"];
        if (content && content.content) {
          this.pageContent = content.content;
        }
      } catch (error) {
        console.error("Ошибка при загрузке контента страницы:", error);
        // Не показываем ошибку пользователю, просто не отображаем контент
      }
    },

    // Загрузка коллективных программ из API
    async loadCollectivePrograms() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log(
          "Загрузка коллективных программ для филиала:",
          this.selectedBranch?.id
        );

        const branchId = this.selectedBranch?.id;
        if (!branchId) {
          throw new Error("Филиал не выбран");
        }

        // Загружаем программы с API используя programAPI
        const data = await programAPI.getCollective(branchId);

        if (data && Array.isArray(data.programs)) {
          this.collectivePrograms = data.programs.filter(
            (program) => program.is_active !== false
          );
          console.log(
            "Загружено коллективных программ:",
            this.collectivePrograms.length
          );
        } else {
          this.collectivePrograms = [];
          console.log("Коллективные программы не найдены");
        }
      } catch (error) {
        console.error("Ошибка при загрузке коллективных программ:", error);
        this.error =
          error.message ||
          "Не удалось загрузить информацию о коллективных программах";
        this.collectivePrograms = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    console.log("CollectiveProgramsPage created");

    // Загружаем контент страницы и программы параллельно
    await Promise.all([this.loadPageContent(), this.loadCollectivePrograms()]);
  },

  // Следим за изменением филиала
  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log(
          "Филиал изменился, перезагружаем коллективные программы:",
          newBranchId
        );
        this.loadPageContent();
        this.loadCollectivePrograms();
      },
    },
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Стили для градиентных кнопок */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-green-500 {
  --tw-gradient-from: #10b981;
  --tw-gradient-stops:
    var(--tw-gradient-from), var(--tw-gradient-to, rgba(16, 185, 129, 0));
}

.to-emerald-500 {
  --tw-gradient-to: #34d399;
}
</style>
