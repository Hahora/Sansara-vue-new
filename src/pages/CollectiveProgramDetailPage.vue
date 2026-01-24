<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
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

    <!-- Контент программы -->
    <div v-else-if="program">
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
            <h1 class="text-2xl font-bold">{{ program.name }}</h1>
            <p
              v-if="program.short_description"
              class="text-white text-opacity-90 text-sm mt-1"
            >
              {{ program.short_description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="px-4 py-5 space-y-4">
        <!-- Карточка с основной информацией -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div v-if="getPriceRange(program)" class="mb-4">
            <!-- Таблица ценовых уровней -->
            <div
              v-if="program.pricing_tiers && program.pricing_tiers.length > 0"
              class="mt-3"
            >
              <div class="text-xs font-semibold text-gray-700 mb-2">
                Стоимость в зависимости от количества гостей:
              </div>
              <div class="space-y-1">
                <div
                  v-for="tier in program.pricing_tiers.filter(
                    (t) => t.is_active !== false
                  )"
                  :key="tier.id"
                  class="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <span class="text-gray-600">
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
                  <span class="font-semibold text-gray-900">{{
                    formatPrice(tier.price)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Длительность и участники -->
          <div class="flex gap-3 mb-4">
            <div
              v-if="getDurationRange(program)"
              class="flex-1 bg-gray-50 text-gray-800 px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 mr-2 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <div>
                  <div class="text-xs text-gray-500">Длительность</div>
                  <div class="font-medium">{{ getDurationRange(program) }}</div>
                </div>
              </div>
            </div>

            <div
              v-if="program.max_participants"
              class="flex-1 bg-gray-50 text-gray-800 px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 mr-2 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                  />
                </svg>
                <div>
                  <div class="text-xs text-gray-500">Участников</div>
                  <div class="font-medium">
                    До {{ program.max_participants }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Описание программы -->
          <div v-if="program.description" class="mt-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">
              О программе
            </h3>
            <div
              class="text-sm text-gray-700 leading-relaxed whitespace-pre-line"
            >
              {{ program.description }}
            </div>
          </div>
        </div>

        <!-- Кнопка записи -->
        <button
          @click="openBooking"
          class="block w-full bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm active:scale-98"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path
              d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
            />
          </svg>
          Записаться на программу
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

export default {
  name: "CollectiveProgramDetailPage",
  data() {
    return {
      isLoading: false,
      error: null,
      program: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch"]),
    // ✅ ИЗМЕНЕНО: Используем id вместо slug
    programId() {
      return this.$route.params.id;
    },
  },
  methods: {
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

    // Открыть модальное окно бронирования
    openBooking() {
      console.log("Открытие бронирования для программы:", this.program.name);
      console.log("Program ID:", this.program.id);

      // Передаем объект программы с id
      openBookingModal(
        { id: this.program.id, name: this.program.name },
        null,
        this.program.name
      );
    },

    // ✅ ОБНОВЛЕНО: Загрузка программы по ID через специальный эндпоинт
    async loadProgram() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка программы с ID:", this.programId);

        if (!this.programId) {
          throw new Error("ID программы не указан");
        }

        // Используем специальный эндпоинт для получения коллективной программы
        // GET /api/v1/programs/collective/{program_id}
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

  // ✅ ИЗМЕНЕНО: Следим за изменением programId вместо slug
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

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
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
