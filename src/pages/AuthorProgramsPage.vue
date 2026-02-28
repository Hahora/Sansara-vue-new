<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Шапка -->
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
        <div class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center border-2 border-white/10 backdrop-blur-sm">
          <PenTool class="h-8 w-8 text-white" />
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-light tracking-wide">Авторские программы</h1>
          <p class="text-white/70 text-sm mt-1 font-light">Уникальные техники, глубокие состояния</p>
        </div>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="isLoading" class="flex flex-col justify-center items-center py-16 px-5">
      <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
      <p class="text-sm text-gray-600 font-light">Загружаем программы...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="mx-5 mt-5 bg-red-50/90 border border-red-200 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Контент -->
    <div v-else class="px-5 py-5 space-y-4">
      <!-- Описание раздела -->
      <div v-if="pageContent" class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-4">
        <h3 class="font-semibold text-gray-900 mb-3 text-[15px]">Об авторских программах</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">{{ pageContent }}</div>
        <div class="space-y-2.5">
          <button
            @click="openRecommendationModal"
            class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center shadow-md active:scale-[0.98]"
          >
            <Wand2 class="h-5 w-5 mr-2" />
            <span class="text-[15px]">Подобрать программу для меня</span>
          </button>
          <button
            @click="scrollToPrograms"
            class="w-full bg-[#d9cebc] text-gray-800 font-medium py-3.5 px-4 rounded-xl flex items-center justify-center active:scale-[0.98]"
          >
            <span class="text-[15px]">Посмотреть все авторские программы</span>
            <ChevronDown class="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>

      <!-- Пусто -->
      <div
        v-if="!authorPrograms || authorPrograms.length === 0"
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-8 text-center"
      >
        <div class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <PenTool class="h-8 w-8 text-[#c2a886]" />
        </div>
        <h3 class="text-base font-semibold text-gray-900 mb-2">Авторские программы</h3>
        <p class="text-sm text-gray-600 leading-relaxed">Скоро здесь появится информация об авторских программах</p>
      </div>

      <!-- Список программ -->
      <div v-else ref="programsList" class="space-y-3">
        <router-link
          v-for="program in authorPrograms"
          :key="program.id"
          :to="{ name: 'AuthorProgramDetail', params: { id: program.id } }"
          class="block relative rounded-2xl overflow-hidden shadow-md active:scale-[0.98] transition-transform"
          style="min-height: 200px"
        >
          <!-- Тёмный фон: базовый слой, виден пока грузится медиа -->
          <div class="absolute inset-0 bg-gradient-to-br from-[#202c27] to-[#2a3b30]" />
          <!-- Видео-фон (приоритет над фото) -->
          <video
            v-if="program.video_url"
            :src="getProgramVideoUrl(program.id)"
            class="absolute inset-0 w-full h-full object-cover"
            v-autoplay autoplay loop playsinline
            @error="(e) => (e.target.style.display = 'none')"
          />
          <!-- Фото-фон (если нет видео) -->
          <img
            v-else-if="program.image_url"
            :src="getProgramImageUrl(program.id)"
            class="absolute inset-0 w-full h-full object-cover"
            @error="(e) => (e.target.style.display = 'none')"
          />

          <!-- Градиент слева направо -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#1a2620]/95 via-[#1a2620]/60 to-transparent" />

          <!-- Контент (левая часть) -->
          <div class="absolute inset-y-0 left-0 w-[64%] p-4 flex flex-col justify-between">
            <div>
              <h2 class="font-bold text-white text-[15px] leading-snug mb-1.5 drop-shadow">
                {{ program.name }}
              </h2>
              <p v-if="program.short_description" class="text-white/65 text-[11px] leading-relaxed line-clamp-4">
                {{ program.short_description }}
              </p>
            </div>

            <div>
              <div class="mb-2">
                <span v-if="getPriceRange(program)" class="block text-white font-bold text-[15px]">
                  {{ getPriceRange(program) }}
                </span>
                <span v-if="getDurationRange(program)" class="block text-white/50 text-[10px]">
                  {{ getDurationRange(program) }}
                </span>
              </div>
              <div class="flex items-center justify-center gap-1.5 bg-[#c2a886] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow">
                <CalendarDays class="h-3 w-3 flex-shrink-0" />
                <span>Забронировать</span>
                <ChevronRight class="h-3 w-3 flex-shrink-0" />
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <RecommendationModal
      v-model:visible="showRecommendationModal"
      :branch-id="selectedBranch?.id"
      @close="closeRecommendationModal"
      @view-program="handleViewProgram"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { programAPI } from "@/utils/api";
import RecommendationModal from "@/components/RecommendationModal.vue";
import icons from "@/utils/icons";

export default {
  name: "AuthorProgramsPage",
  components: { RecommendationModal, ...icons },
  data() {
    return {
      isLoading: true,
      error: null,
      authorPrograms: [],
      pageContent: null,
      showRecommendationModal: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData"]),
  },
  methods: {
    getProgramImageUrl(programId) {
      return programAPI.getImageUrl(programId);
    },

    getProgramVideoUrl(programId) {
      return programAPI.getVideoUrl(programId);
    },

    ...mapActions(useAppStore, ["loadSiteContent"]),

    formatPrice(price) {
      if (!price && price !== 0) return "";
      const n = Number(price);
      if (isNaN(n)) return price;
      return n.toLocaleString("ru-RU") + " ₽";
    },

    getPriceRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) return null;
      const active = program.pricing_tiers.filter((t) => t.is_active !== false);
      if (!active.length) return null;
      const prices = active.map((t) => t.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return min === max
        ? this.formatPrice(min)
        : `${this.formatPrice(min)} – ${this.formatPrice(max)}`;
    },

    getDurationRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) return null;
      const active = program.pricing_tiers.filter((t) => t.is_active !== false);
      if (!active.length) return null;
      const durations = active.map((t) => t.duration_minutes);
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      return min === max
        ? this.formatDuration(min)
        : `${this.formatDuration(min)} – ${this.formatDuration(max)}`;
    },

    formatDuration(minutes) {
      if (!minutes) return "";
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      if (h && m) return `${h} ч ${m} мин`;
      if (h) return `${h} ч`;
      return `${m} мин`;
    },

    async loadPageContent() {
      try {
        await this.loadSiteContent("AUTHOR");
        const c = this.contentData?.["AUTHOR"];
        if (c?.content) this.pageContent = c.content;
      } catch (e) {
        console.error(e);
      }
    },

    async loadAuthorPrograms() {
      try {
        const branchId = this.selectedBranch?.id;
        if (!branchId) throw new Error("Филиал не выбран");
        const data = await programAPI.getAuthor(branchId);
        this.authorPrograms = Array.isArray(data?.programs)
          ? data.programs.filter((p) => p.is_active !== false)
          : [];
      } catch (e) {
        this.error = e.message || "Не удалось загрузить программы";
        this.authorPrograms = [];
      }
    },

    openRecommendationModal() { this.showRecommendationModal = true; },
    closeRecommendationModal() { this.showRecommendationModal = false; },
    handleViewProgram(id) {
      this.$router.push({ name: "AuthorProgramDetail", params: { id } });
    },
    scrollToPrograms() {
      this.$refs.programsList?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  async created() {
    try {
      await Promise.all([this.loadPageContent(), this.loadAuthorPrograms()]);
    } catch (e) {
      this.error = e.message || "Ошибка при загрузке страницы";
    } finally {
      this.isLoading = false;
    }
  },
  watch: {
    "selectedBranch.id": {
      handler() {
        this.loadPageContent();
        this.loadAuthorPrograms();
      },
    },
  },
};
</script>
