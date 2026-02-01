<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Шапка - статичная -->
    <div class="bg-[#202c27] text-white px-5 py-6">
      <div class="flex items-center mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft class="h-6 w-6 mr-1" />
          <span class="font-light">Назад</span>
        </button>
      </div>

      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center border-2 border-white/10 backdrop-blur-sm"
        >
          <UsersRound class="h-8 w-8 text-white" />
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-light tracking-wide">
            Коллективные программы
          </h1>
          <p class="text-white/70 text-sm mt-1 font-light">
            Тепло, живой пар, общее действие и единение
          </p>
        </div>
      </div>
    </div>

    <!-- Переключатель вкладок -->
    <div class="px-5 py-3 bg-[#e3ded3] border-b border-[#c2a886]/20">
      <div class="flex rounded-xl bg-[#d9cebc]/60 p-1">
        <button
          @click="activeTab = 'info'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'info'
              ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] shadow-md text-white'
              : 'text-gray-700 hover:bg-white/50',
          ]"
        >
          <FileText class="h-4 w-4" />
          <span>Информация</span>
        </button>
        <button
          @click="activeTab = 'gallery'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'gallery'
              ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] shadow-md text-white'
              : 'text-gray-700 hover:bg-white/50',
          ]"
        >
          <Images class="h-4 w-4" />
          <span>Галерея</span>
        </button>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center py-16 px-5"
    >
      <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
      <p class="text-sm text-gray-600 font-light">Загружаем программы...</p>
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

    <!-- Контент: Основная информация -->
    <div v-else-if="activeTab === 'info'" class="px-5 py-5 space-y-4">
      <!-- Описание раздела из контента -->
      <div
        v-if="pageContent"
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-4"
      >
        <h3 class="font-semibold text-gray-900 mb-3 text-[15px]">
          О коллективных программах
        </h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ pageContent }}
        </div>
      </div>

      <!-- Если программ нет -->
      <div
        v-if="!collectivePrograms || collectivePrograms.length === 0"
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-8 text-center"
      >
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UsersRound class="h-8 w-8 text-[#c2a886]" />
        </div>
        <h3 class="text-base font-semibold text-gray-900 mb-2">
          Коллективные программы
        </h3>
        <p class="text-sm text-gray-600 leading-relaxed">
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
          class="block bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden hover:shadow-md transition-all duration-300 active:scale-[0.98]"
        >
          <!-- Заголовок программы -->
          <div class="px-4 py-4 bg-[#d9cebc] border-b border-[#c2a886]/30">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start flex-1 min-w-0 gap-3">
                <div
                  class="h-11 w-11 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <UsersRound class="h-5 w-5 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <h2
                    class="font-semibold text-gray-900 text-[15px] leading-tight mb-1"
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
              <ChevronRight class="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          </div>

          <!-- Краткая информация -->
          <div class="px-4 py-3 space-y-2">
            <!-- Цена и длительность -->
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <!-- Цена -->
              <div
                v-if="getPriceRange(program)"
                class="bg-[#d9cebc] border border-[#c2a886]/30 px-3 py-2 rounded-xl flex items-center gap-2"
              >
                <div
                  class="h-6 w-6 rounded-full bg-[#c2a886]/30 flex items-center justify-center"
                >
                  <Wallet class="h-3.5 w-3.5 text-[#202c27]" />
                </div>
                <span class="font-semibold text-gray-900 text-sm">
                  {{ getPriceRange(program) }}
                </span>
              </div>

              <!-- Длительность -->
              <div
                v-if="getDurationRange(program)"
                class="bg-[#d9cebc]/40 text-gray-700 px-3 py-2 rounded-xl border border-[#c2a886]/20 text-sm flex items-center gap-1.5"
              >
                <Calendar class="h-4 w-4 text-[#c2a886]" />
                <span>{{ getDurationRange(program) }}</span>
              </div>
            </div>

            <!-- Количество участников -->
            <div
              v-if="getGuestsRange(program)"
              class="text-xs text-gray-600 flex items-center gap-1.5"
            >
              <Users class="h-4 w-4 text-[#c2a886]" />
              <span>{{ getGuestsRange(program) }}</span>
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
import icons from "@/utils/icons";

export default {
  name: "CollectiveProgramsPage",
  components: {
    MediaGallery,
    ...icons,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      collectivePrograms: [],
      pageContent: null,
      activeTab: "info",
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

    formatPrice(price) {
      if (!price && price !== 0) return "";

      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;

      return priceNumber.toLocaleString("ru-RU") + " ₽";
    },

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

    async loadPageContent() {
      try {
        await this.loadSiteContent("COLLECTIVE");

        const content = this.contentData?.["COLLECTIVE"];
        if (content && content.content) {
          this.pageContent = content.content;
        }
      } catch (error) {
        console.error("Ошибка при загрузке контента страницы:", error);
      }
    },

    async loadCollectivePrograms() {
      try {
        console.log(
          "Загрузка коллективных программ для филиала:",
          this.selectedBranch?.id
        );

        const branchId = this.selectedBranch?.id;
        if (!branchId) {
          throw new Error("Филиал не выбран");
        }

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
      }
    },
  },
  async created() {
    console.log("CollectiveProgramsPage created");

    try {
      await Promise.all([
        this.loadPageContent(),
        this.loadCollectivePrograms(),
      ]);
    } catch (error) {
      console.error("Ошибка при загрузке страницы:", error);
      this.error = error.message || "Ошибка при загрузке страницы";
    } finally {
      this.isLoading = false;
    }
  },

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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
