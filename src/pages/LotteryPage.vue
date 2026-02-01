<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#202c27] via-[#2a3833] to-[#202c27] pb-20 relative overflow-hidden"
  >
    <!-- Анимированный фон с золотыми частицами -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute w-96 h-96 bg-gradient-to-br from-[#c2a886]/10 to-[#b5976e]/5 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
      ></div>
      <div
        class="absolute w-96 h-96 bg-gradient-to-br from-[#c2a886]/10 to-[#b5976e]/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
        style="animation-delay: 1s"
      ></div>
      <!-- Золотые звездочки -->
      <div class="stars-container">
        <div v-for="i in 20" :key="i" class="star" :style="getStarStyle(i)">
          ✨
        </div>
      </div>
    </div>

    <!-- Контент -->
    <div class="relative z-10">
      <!-- Шапка -->
      <div class="px-5 py-6">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white/80 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft class="h-6 w-6 mr-1" />
          <span class="font-light">Назад</span>
        </button>

        <!-- Заголовок с золотым акцентом -->
        <div class="text-center">
          <div class="relative inline-block">
            <div class="text-7xl mb-4 animate-bounce-slow relative">
              <Ticket
                class="h-20 w-20 mx-auto text-[#c2a886] drop-shadow-glow"
              />
              <Sparkles
                class="h-8 w-8 absolute -top-2 -right-2 text-yellow-300 animate-spin-slow"
              />
            </div>
          </div>
          <h1
            class="text-4xl font-light tracking-wider mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#c2a886] via-yellow-200 to-[#c2a886] animate-gradient"
          >
            Лотерея
          </h1>
          <p class="text-white/70 text-sm font-light">
            Получай билеты за покупки и выигрывай призы
          </p>
        </div>
      </div>

      <!-- Табы -->
      <div class="px-5 mt-6">
        <div
          class="flex mb-5 bg-[#202c27]/40 backdrop-blur-md rounded-xl p-1 border border-[#c2a886]/20"
        >
          <button
            @click="activeTab = 'lottery'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2',
              activeTab === 'lottery'
                ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white shadow-md'
                : 'text-white/70 hover:bg-white/5',
            ]"
          >
            <Ticket class="h-4 w-4" />
            <span>Лотерея</span>
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2',
              activeTab === 'history'
                ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white shadow-md'
                : 'text-white/70 hover:bg-white/5',
            ]"
          >
            <Award class="h-4 w-4" />
            <span>Мои призы</span>
          </button>
        </div>

        <!-- Контент таба "Лотерея" -->
        <div v-if="activeTab === 'lottery'">
          <!-- Загрузка -->
          <div
            v-if="isLoading"
            class="flex flex-col justify-center items-center py-16"
          >
            <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
            <p class="text-sm text-white/70 font-light">Загружаем лотерею...</p>
          </div>

          <!-- Ошибка неполного профиля -->
          <div
            v-else-if="profileError"
            class="bg-[#edeae6] rounded-2xl p-6 shadow-2xl"
          >
            <div class="text-center">
              <div
                class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <User class="h-8 w-8 text-[#c2a886]" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Заполните профиль
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed mb-6">
                Заполните полностью профиль и нажмите кнопку "Обновить", чтобы
                заново запросить данные
              </p>

              <div class="flex flex-col gap-3">
                <button
                  @click="goToProfile"
                  class="bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-md active:scale-[0.98]"
                >
                  Заполнить профиль
                </button>

                <button
                  @click="loadData"
                  class="bg-[#d9cebc] hover:bg-[#c2a886]/30 text-gray-800 font-medium py-2.5 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <RefreshCw class="h-4 w-4" />
                  <span>Обновить</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Лотерея не активна -->
          <div
            v-else-if="!lotteryStatus?.is_enabled"
            class="bg-[#edeae6] rounded-2xl p-6 text-center shadow-2xl"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Moon class="h-8 w-8 text-[#c2a886]" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Лотерея не активна
            </h3>
            <p class="text-sm text-gray-600">Следите за обновлениями!</p>
          </div>

          <!-- Лотерея активна -->
          <div v-else>
            <!-- Если у пользователя уже есть активный билет -->
            <div v-if="hasActiveTicket">
              <!-- Карточка билета - золотая версия -->
              <div
                class="bg-gradient-to-br from-[#c2a886] via-yellow-400 to-[#b5976e] rounded-2xl p-6 shadow-2xl mb-4 relative overflow-hidden"
              >
                <!-- Золотой блеск -->
                <div
                  class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-shine"
                ></div>

                <div class="text-center text-white relative z-10">
                  <div class="text-6xl mb-4 animate-bounce-slow">
                    <Ticket class="h-16 w-16 mx-auto drop-shadow-glow" />
                  </div>
                  <h3 class="text-2xl font-semibold mb-2 drop-shadow-md">
                    Ваш билет активирован!
                  </h3>
                  <p class="text-white/90 mb-6 text-sm font-light">
                    Вы участвуете в розыгрыше призов
                  </p>

                  <!-- Билет -->
                  <div class="bg-white rounded-2xl p-6 shadow-xl">
                    <div
                      class="text-gray-600 text-xs uppercase font-bold tracking-wide mb-2"
                    >
                      Номер билета
                    </div>
                    <div
                      class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c2a886] to-[#b5976e] mb-4"
                    >
                      #{{ lastTicket.ticket_number }}
                    </div>

                    <div class="border-t-2 border-dashed border-gray-300 pt-4">
                      <div
                        class="flex items-center justify-center text-sm text-gray-600"
                      >
                        <CheckCircle class="h-4 w-4 mr-1.5 text-green-500" />
                        <span class="font-semibold">
                          Активирован: {{ formatDate(lastTicket.created_at) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Статистика -->
                  <div class="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div class="text-center">
                      <div class="text-white/70 text-sm mb-2">
                        Всего билетов в лотерее
                      </div>
                      <div class="text-3xl font-bold text-white drop-shadow-md">
                        {{ formatNumber(lotteryStatus.total_tickets) }}
                      </div>
                    </div>
                  </div>

                  <p
                    class="text-white text-sm mt-6 flex items-center justify-center gap-2"
                  >
                    <Sparkles class="h-4 w-4" />
                    Желаем удачи в розыгрыше!
                  </p>
                </div>
              </div>

              <!-- Информация -->
              <div class="bg-[#edeae6] rounded-2xl p-5 shadow-xl">
                <div class="flex items-start gap-3">
                  <div
                    class="h-10 w-10 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <Info class="h-5 w-5 text-[#c2a886]" />
                  </div>
                  <div>
                    <h4 class="text-gray-900 font-semibold mb-2 text-[15px]">
                      Обратите внимание
                    </h4>
                    <p class="text-sm text-gray-700 leading-relaxed">
                      В каждой лотерее можно активировать только
                      <span class="font-bold text-[#c2a886]">один билет</span>.
                      Ваш билет уже активирован и участвует в розыгрыше.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Если нет активного билета -->
            <div v-else>
              <!-- Статистика -->
              <div class="bg-[#edeae6] rounded-2xl p-6 shadow-xl mb-4">
                <div class="text-center">
                  <div class="text-gray-600 text-sm mb-2 font-medium">
                    Всего билетов в лотерее
                  </div>
                  <div
                    class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c2a886] to-[#b5976e] animate-pulse-slow"
                  >
                    {{ formatNumber(lotteryStatus.total_tickets) }}
                  </div>
                </div>
              </div>

              <!-- Форма активации - золотая -->
              <div
                class="bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-2xl p-6 shadow-2xl mb-4 relative overflow-hidden"
              >
                <!-- Золотой блеск -->
                <div
                  class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-shine"
                ></div>

                <div class="relative z-10">
                  <h3
                    class="text-xl font-semibold text-white mb-4 text-center flex items-center justify-center gap-2"
                  >
                    <Ticket class="h-6 w-6" />
                    Активировать билет
                  </h3>

                  <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <label class="block text-white text-sm font-semibold mb-2">
                      Введите 6-значный код
                    </label>

                    <input
                      v-model="ticketCode"
                      type="text"
                      maxlength="6"
                      pattern="[0-9]*"
                      inputmode="numeric"
                      @input="onCodeInput"
                      :class="[
                        'w-full px-4 py-3 text-center text-2xl font-bold tracking-widest rounded-xl focus:ring-4 outline-none transition-all',
                        error
                          ? 'bg-red-100 border-2 border-red-500 focus:ring-red-300'
                          : 'bg-white focus:ring-yellow-300',
                      ]"
                      placeholder="000000"
                    />

                    <!-- Ошибка -->
                    <div
                      v-if="error"
                      class="mt-3 bg-red-500/90 rounded-lg p-3 text-white text-sm font-medium flex items-start gap-2"
                    >
                      <AlertCircle class="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>{{ error }}</span>
                    </div>

                    <button
                      @click="redeemTicket"
                      :disabled="!isCodeValid || isRedeeming"
                      class="w-full mt-4 bg-white hover:bg-gray-100 text-[#c2a886] font-bold py-3 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                    >
                      <span v-if="!isRedeeming" class="flex items-center gap-2">
                        <Sparkles class="h-5 w-5" />
                        <span>Активировать</span>
                      </span>
                      <span v-else class="flex items-center gap-2">
                        <Loader2 class="h-5 w-5 animate-spin" />
                        <span>Активация...</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Инструкция -->
              <div class="bg-[#edeae6] rounded-2xl p-5 shadow-xl">
                <h4
                  class="text-gray-900 font-semibold mb-3 flex items-center gap-2 text-[15px]"
                >
                  <Info class="h-4 w-4 text-[#c2a886]" />
                  Как это работает?
                </h4>
                <div class="space-y-2.5 text-sm text-gray-700">
                  <div class="flex items-start gap-2">
                    <span class="text-[#c2a886] font-bold flex-shrink-0"
                      >1.</span
                    >
                    <span>Получите код билета при покупке программы</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[#c2a886] font-bold flex-shrink-0"
                      >2.</span
                    >
                    <span>Введите 6-значный код в форму выше</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[#c2a886] font-bold flex-shrink-0"
                      >3.</span
                    >
                    <span>Активируйте билет и участвуйте в розыгрыше</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[#c2a886] font-bold flex-shrink-0"
                      >4.</span
                    >
                    <span
                      >В каждой лотерее можно активировать только один
                      билет</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Контент таба "История" -->
        <div v-else-if="activeTab === 'history'">
          <!-- Загрузка -->
          <div
            v-if="isLoadingHistory"
            class="flex flex-col justify-center items-center py-16"
          >
            <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
            <p class="text-sm text-white/70 font-light">Загружаем историю...</p>
          </div>

          <!-- Ошибка профиля -->
          <div
            v-else-if="profileError"
            class="bg-[#edeae6] rounded-2xl p-6 shadow-2xl"
          >
            <div class="text-center">
              <div
                class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <User class="h-8 w-8 text-[#c2a886]" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Заполните профиль
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed mb-6">
                Для просмотра истории необходимо заполнить профиль
              </p>

              <div class="flex flex-col gap-3">
                <button
                  @click="goToProfile"
                  class="bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-md active:scale-[0.98]"
                >
                  Заполнить профиль
                </button>

                <button
                  @click="loadData"
                  class="bg-[#d9cebc] hover:bg-[#c2a886]/30 text-gray-800 font-medium py-2.5 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <RefreshCw class="h-4 w-4" />
                  <span>Обновить</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Список билетов -->
          <div v-else-if="history.length > 0" class="space-y-3">
            <div
              v-for="ticket in history"
              :key="ticket.id"
              class="bg-[#edeae6] rounded-2xl p-5 shadow-xl"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2 flex-wrap">
                    <span class="text-gray-900 font-bold text-base">
                      Билет #{{ ticket.ticket_number }}
                    </span>
                    <span
                      v-if="ticket.prize"
                      class="bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1"
                    >
                      <Award class="h-3 w-3" />
                      Приз
                    </span>
                  </div>

                  <div v-if="ticket.prize" class="text-gray-700 mb-2 text-sm">
                    <span class="font-semibold">Выигрыш:</span>
                    <span class="ml-2 text-[#c2a886] font-bold">{{
                      ticket.prize
                    }}</span>
                  </div>

                  <div class="text-gray-600 text-xs flex items-center gap-1">
                    <Calendar class="h-3 w-3" />
                    Активирован: {{ formatDate(ticket.created_at) }}
                  </div>
                </div>

                <div class="flex-shrink-0">
                  <div
                    :class="[
                      'h-12 w-12 rounded-xl flex items-center justify-center',
                      ticket.prize
                        ? 'bg-gradient-to-br from-[#c2a886] to-[#b5976e]'
                        : 'bg-[#d9cebc]',
                    ]"
                  >
                    <Award v-if="ticket.prize" class="h-6 w-6 text-white" />
                    <Ticket v-else class="h-6 w-6 text-[#c2a886]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Пусто -->
          <div v-else class="text-center py-16">
            <div
              class="w-20 h-20 bg-[#edeae6] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Award class="h-10 w-10 text-[#c2a886]" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Нет билетов</h3>
            <p class="text-white/70 text-sm">
              У вас пока нет активированных билетов
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно успеха -->
    <SuccessModal
      v-model:visible="showSuccessModal"
      :ticket="redeemedTicket"
      @close="showSuccessModal = false"
    />
  </div>
</template>

<script>
import { lotteryAPI } from "@/utils/api";
import SuccessModal from "@/components/SuccessModal.vue";
import icons from "@/utils/icons";

export default {
  name: "LotteryPage",
  components: {
    SuccessModal,
    ...icons,
    // Добавляем недостающие иконки
    Moon: icons.Moon || icons.Circle,
    RefreshCw: icons.RefreshCw || icons.Loader2,
    User: icons.User || icons.UserIcon,
  },
  data() {
    return {
      isLoading: true,
      isRedeeming: false,
      error: null,
      profileError: null,
      lotteryStatus: null,
      ticketCode: "",
      showSuccessModal: false,
      redeemedTicket: null,
      activeTab: "lottery",
      history: [],
      isLoadingHistory: false,
    };
  },
  computed: {
    isCodeValid() {
      return this.ticketCode.length === 6 && /^\d{6}$/.test(this.ticketCode);
    },

    lastTicket() {
      if (!this.history.length) return null;
      const sorted = [...this.history].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      return sorted[0];
    },

    hasActiveTicket() {
      return this.lastTicket && !this.lastTicket.prize;
    },
  },
  watch: {
    activeTab(newTab) {
      if (
        newTab === "history" &&
        !this.history.length &&
        !this.isLoadingHistory
      ) {
        this.loadHistory();
      }
    },
  },
  methods: {
    async loadData() {
      await Promise.all([this.loadLotteryStatus(), this.loadHistory()]);
    },

    async loadLotteryStatus() {
      try {
        const data = await lotteryAPI.getStatus();
        this.lotteryStatus = data;
      } catch (error) {
        console.error("Ошибка при загрузке статуса:", error);
        this.lotteryStatus = null;
      }
    },

    async loadHistory() {
      try {
        this.isLoadingHistory = true;
        this.isLoading = true;
        this.profileError = null;

        const data = await lotteryAPI.getHistory();

        this.history = Array.isArray(data)
          ? data.map((ticket) => ({
              user_id: ticket.user_id,
              ticket_number: ticket.ticket_number,
              code_id: ticket.code_id,
              prize: ticket.prize,
              is_redeemed: ticket.is_redeemed,
              redeemed_at: ticket.redeemed_at,
              id: ticket.id,
              created_at: ticket.created_at,
            }))
          : [];
      } catch (error) {
        console.error("Ошибка при загрузке истории:", error);

        if (
          error.message &&
          error.message.includes("User profile is incomplete")
        ) {
          this.profileError = error.message;
        }

        this.history = [];
      } finally {
        this.isLoadingHistory = false;
        this.isLoading = false;
      }
    },

    onCodeInput(event) {
      this.ticketCode = event.target.value.replace(/[^0-9]/g, "");
      if (this.error) {
        this.error = null;
      }
    },

    async redeemTicket() {
      if (!this.isCodeValid) return;

      try {
        this.isRedeeming = true;
        this.error = null;

        const ticket = await lotteryAPI.redeemTicket(this.ticketCode);

        this.redeemedTicket = ticket;
        this.showSuccessModal = true;
        this.ticketCode = "";

        await this.loadData();
      } catch (error) {
        console.error("Ошибка при активации билета:", error);

        let errorMessage = error.message || "Не удалось активировать билет";

        if (errorMessage.toLowerCase().includes("invalid code")) {
          errorMessage = "Неправильный код. Проверьте код и попробуйте снова";
        }
        if (errorMessage.toLowerCase().includes("already used")) {
          errorMessage = "Этот код уже был использован";
        }
        if (errorMessage.toLowerCase().includes("already have ticket")) {
          errorMessage = "У вас уже есть активированный билет в этой лотерее";
        }

        this.error = errorMessage;
      } finally {
        this.isRedeeming = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    formatNumber(num) {
      if (!num && num !== 0) return "0";
      return num.toLocaleString("ru-RU");
    },

    getStarStyle(index) {
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      };
    },

    goToProfile() {
      this.$router.push("/profile");
    },
  },

  async created() {
    console.log("LotteryPage created");
    await this.loadData();
  },
};
</script>

<style scoped>
/* Золотое свечение */
.drop-shadow-glow {
  filter: drop-shadow(0 0 20px rgba(194, 168, 134, 0.6));
}

/* Звездочки */
.stars-container {
  position: absolute;
  inset: 0;
}

.star {
  position: absolute;
  font-size: 12px;
  animation: twinkle linear infinite;
  opacity: 0;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Золотой блеск */
@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.animate-shine {
  animation: shine 3s ease-in-out infinite;
}

/* Медленное подпрыгивание */
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* Медленный пульс */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

/* Градиент анимация */
@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* Медленное вращение */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
