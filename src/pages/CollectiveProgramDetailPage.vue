<template>
  <div class="min-h-screen bg-[#edeae6] pb-36">
    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center py-16 px-5"
    >
      <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
      <p class="text-sm text-gray-600 font-light">Загружаем программу...</p>
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

    <!-- Контент программы -->
    <div v-else-if="program">
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
            <Users class="h-8 w-8 text-white" />
          </div>
          <div class="ml-4 flex-1">
            <h1 class="text-2xl font-light tracking-wide">
              {{ program.name }}
            </h1>
            <p
              v-if="program.short_description"
              class="text-white/70 text-sm mt-1 font-light"
            >
              {{ program.short_description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="px-5 py-5 space-y-4">
        <!-- Карточка с основной информацией -->
        <div class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-4">
          <!-- Цены -->
          <div v-if="getPriceRange(program)" class="mb-4">
            <div
              v-if="program.pricing_tiers && program.pricing_tiers.length > 0"
              class="space-y-3"
            >
              <div
                class="flex items-center gap-2 text-sm font-semibold text-gray-900"
              >
                <Wallet class="h-4 w-4 text-[#c2a886]" />
                <span>Стоимость в зависимости от количества гостей</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="tier in program.pricing_tiers.filter(
                    (t) => t.is_active !== false
                  )"
                  :key="tier.id"
                  class="flex items-center justify-between bg-[#d9cebc]/60 px-4 py-3 rounded-xl border border-[#c2a886]/20"
                >
                  <span class="text-sm text-gray-700 flex items-center gap-2">
                    <Users class="h-4 w-4 text-[#c2a886]" />
                    {{ tier.min_guests
                    }}{{
                      tier.max_guests !== tier.min_guests
                        ? `-${tier.max_guests}`
                        : ""
                    }}
                    {{
                      tier.min_guests === 1
                        ? "гость"
                        : tier.max_guests <= 4
                          ? "гостя"
                          : "гостей"
                    }}
                  </span>
                  <span class="font-bold text-gray-900 text-base">{{
                    formatPrice(tier.price)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Длительность и участники -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div
              v-if="getDurationRange(program)"
              class="bg-[#d9cebc]/60 px-4 py-3 rounded-xl border border-[#c2a886]/20"
            >
              <div class="flex items-start gap-2">
                <div
                  class="h-8 w-8 bg-[#c2a886]/20 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <Calendar class="h-4 w-4 text-[#c2a886]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-gray-600 mb-0.5">Длительность</div>
                  <div class="font-semibold text-gray-900 text-sm">
                    {{ getDurationRange(program) }}
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="program.max_participants"
              class="bg-[#d9cebc]/60 px-4 py-3 rounded-xl border border-[#c2a886]/20"
            >
              <div class="flex items-start gap-2">
                <div
                  class="h-8 w-8 bg-[#c2a886]/20 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <Users class="h-4 w-4 text-[#c2a886]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-gray-600 mb-0.5">Участников</div>
                  <div class="font-semibold text-gray-900 text-sm">
                    До {{ program.max_participants }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Описание программы -->
          <div v-if="program.description" class="mt-4">
            <h3
              class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"
            >
              <FileText class="h-4 w-4 text-[#c2a886]" />
              <span>О программе</span>
            </h3>
            <div
              class="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-[#d9cebc]/40 rounded-xl p-4"
            >
              {{ program.description }}
            </div>
          </div>
        </div>

      </div>

      <!-- Фиксированная кнопка записи -->
      <div class="fixed bottom-20 left-0 right-0 px-5 z-40">
        <button
          @click="openBooking"
          class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white font-medium py-4 px-4 rounded-xl flex items-center justify-center shadow-xl active:scale-[0.98]"
        >
          <CalendarCheck class="h-5 w-5 mr-2 text-white" />
          <span class="text-[15px]">Записаться</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { programAPI } from "@/utils/api";
import { openBookingModal } from "@/utils/eventBus";
import icons from "@/utils/icons";

export default {
  name: "CollectiveProgramDetailPage",
  components: {
    ...icons,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      program: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch"]),
    programId() {
      return this.$route.params.id;
    },
  },
  methods: {
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

    openBooking() {
      console.log("Открытие бронирования для программы:", this.program.name);
      console.log("Program ID:", this.program.id);

      openBookingModal(
        { id: this.program.id, name: this.program.name },
        null,
        this.program.name
      );
    },

    async loadProgram() {
      try {
        this.error = null;

        console.log("Загрузка программы с ID:", this.programId);

        if (!this.programId) {
          throw new Error("ID программы не указан");
        }

        const program = await programAPI.getCollectiveById(this.programId);

        if (program && program.is_active !== false) {
          this.program = program;
          console.log("Программа загружена:", this.program.name);
        } else {
          throw new Error("Программа не найдена или неактивна");
        }
      } catch (error) {
        console.error("Ошибка при загрузке программы:", error);
        this.error =
          error.message || "Не удалось загрузить информацию о программе";
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    console.log("CollectiveProgramDetailPage created");
    await this.loadProgram();
  },

  watch: {
    programId: {
      handler() {
        this.loadProgram();
      },
    },
    "selectedBranch.id": {
      handler() {
        this.loadProgram();
      },
    },
  },
};
</script>
