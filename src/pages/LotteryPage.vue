<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-20"
  >
    <!-- Анимированный фон -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"
      ></div>
      <div
        class="absolute w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-20 -bottom-48 -right-48 animate-pulse"
        style="animation-delay: 1s"
      ></div>
    </div>

    <!-- Контент -->
    <div class="relative z-10">
      <!-- Шапка -->
      <div class="px-5 py-6 text-white">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white hover:text-gray-200 transition-colors mb-4"
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

        <!-- Заголовок -->
        <div class="text-center">
          <div class="text-6xl mb-3 animate-bounce">🎟️</div>
          <h1 class="text-3xl font-bold mb-2 text-shadow">Лотерея</h1>
          <p class="text-white text-opacity-90 text-sm">
            Получай билеты за покупки и выигрывай призы!
          </p>
        </div>
      </div>

      <!-- Табы -->
      <div class="px-4 mt-6">
        <div
          class="flex mb-4 bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-1"
        >
          <button
            @click="activeTab = 'lottery'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === 'lottery'
                ? 'bg-white text-purple-700 shadow-md'
                : 'text-white hover:bg-white hover:bg-opacity-10',
            ]"
          >
            🎟️ Лотерея
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === 'history'
                ? 'bg-white text-purple-700 shadow-md'
                : 'text-white hover:bg-white hover:bg-opacity-10',
            ]"
          >
            🏆 Мои призы
          </button>
        </div>

        <!-- Контент таба "Лотерея" -->
        <div v-if="activeTab === 'lottery'">
          <!-- Загрузка -->
          <div v-if="isLoading" class="flex justify-center items-center py-16">
            <div class="relative">
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-white border-opacity-30"
              ></div>
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent absolute top-0 left-0"
              ></div>
            </div>
          </div>

          <!-- Ошибка неполного профиля -->
          <div
            v-else-if="profileError"
            class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div class="text-center text-white">
              <div class="text-5xl mb-4">👤</div>
              <h3 class="text-xl font-bold mb-3">Заполните профиль</h3>
              <p class="text-sm text-white text-opacity-90 mb-6">
                Заполните полностью профиль и нажмите кнопку "Обновить", чтобы
                заново запросить данные
              </p>

              <div class="flex flex-col gap-3">
                <button
                  @click="goToProfile"
                  class="bg-white hover:bg-gray-100 text-purple-700 font-bold py-3 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg"
                >
                  Заполнить профиль
                </button>

                <button
                  @click="loadData"
                  class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all transform active:scale-95"
                >
                  🔄 Обновить
                </button>
              </div>
            </div>
          </div>

          <!-- Лотерея не активна (по статусу) -->
          <div
            v-else-if="!lotteryStatus?.is_enabled"
            class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 text-center text-white shadow-xl"
          >
            <div class="text-5xl mb-3">😴</div>
            <h3 class="text-xl font-bold mb-2">Лотерея не активна</h3>
            <p class="text-sm text-white text-opacity-80">
              Следите за обновлениями!
            </p>
          </div>

          <!-- Лотерея активна (по статусу) -->
          <div v-else>
            <!-- Если у пользователя уже есть активированный билет в этой лотерее -->
            <div v-if="hasActiveTicket">
              <!-- Карточка билета -->
              <div
                class="bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 rounded-2xl p-6 shadow-2xl mb-4"
              >
                <div class="text-center text-white">
                  <div class="text-6xl mb-4 animate-bounce">🎟️</div>
                  <h3 class="text-2xl font-bold mb-2">
                    Ваш билет активирован!
                  </h3>
                  <p class="text-white text-opacity-90 mb-6">
                    Вы участвуете в розыгрыше призов
                  </p>

                  <!-- Билет -->
                  <div class="bg-white rounded-2xl p-6 shadow-xl">
                    <div
                      class="text-gray-600 text-sm uppercase font-bold tracking-wide mb-2"
                    >
                      Номер билета
                    </div>
                    <div
                      class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4"
                    >
                      #{{ lastTicket.ticket_number }}
                    </div>

                    <div class="border-t-2 border-dashed border-gray-300 pt-4">
                      <div
                        class="flex items-center justify-center text-sm text-gray-600"
                      >
                        <svg
                          class="w-4 h-4 mr-1.5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="font-semibold"
                          >Активирован:
                          {{ formatDate(lastTicket.created_at) }}</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Статистика -->
                  <div
                    class="mt-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4"
                  >
                    <div class="text-center">
                      <div class="text-white text-opacity-70 text-sm mb-2">
                        Всего билетов в лотерее
                      </div>
                      <div class="text-3xl font-bold text-yellow-300">
                        {{ formatNumber(lotteryStatus.total_tickets) }}
                      </div>
                    </div>
                  </div>

                  <p class="text-white text-sm mt-6 text-opacity-80">
                    🍀 Желаем удачи в розыгрыше!
                  </p>
                </div>
              </div>

              <!-- Информация о том, что можно активировать только 1 билет -->
              <div
                class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-5 shadow-xl"
              >
                <div class="flex items-start">
                  <span class="text-xl mr-3">ℹ️</span>
                  <div>
                    <h4 class="text-white font-bold mb-2">Обратите внимание</h4>
                    <p class="text-sm text-white text-opacity-90">
                      В каждой лотерее можно активировать только
                      <span class="font-bold text-yellow-300">один билет</span>.
                      Ваш билет уже активирован и участвует в розыгрыше.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Если у пользователя нет активированного билета -->
            <div v-else>
              <!-- Статистика -->
              <div
                class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-4"
              >
                <div class="text-center">
                  <div class="text-white text-opacity-70 text-sm mb-2">
                    Всего билетов в лотерее
                  </div>
                  <div
                    class="text-5xl font-bold text-yellow-300 mb-1 animate-pulse"
                  >
                    {{ formatNumber(lotteryStatus.total_tickets) }}
                  </div>
                </div>
              </div>

              <!-- Форма активации билета -->
              <div
                class="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl mb-4"
              >
                <h3
                  class="text-xl font-bold text-white mb-4 text-center flex items-center justify-center"
                >
                  <span class="text-2xl mr-2">🎟️</span>
                  Активировать билет
                </h3>

                <div
                  class="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4"
                >
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

                  <!-- Ошибка под полем -->
                  <div
                    v-if="error"
                    class="mt-2 bg-red-500 bg-opacity-90 rounded-lg p-3 text-white text-sm font-medium flex items-start"
                  >
                    <svg
                      class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ error }}</span>
                  </div>

                  <button
                    @click="redeemTicket"
                    :disabled="!isCodeValid || isRedeeming"
                    class="w-full mt-4 bg-white hover:bg-gray-100 text-orange-600 font-bold py-3 px-6 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <span
                      v-if="!isRedeeming"
                      class="flex items-center justify-center"
                    >
                      <span class="text-xl mr-2">✨</span>
                      Активировать
                    </span>
                    <span v-else class="flex items-center justify-center">
                      <svg
                        class="animate-spin h-5 w-5 mr-2"
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
                      Активация...
                    </span>
                  </button>
                </div>
              </div>

              <!-- Информация -->
              <div
                class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-5 shadow-xl"
              >
                <h4 class="text-white font-bold mb-3 flex items-center">
                  <span class="text-xl mr-2">ℹ️</span>
                  Как это работает?
                </h4>
                <div class="space-y-2 text-sm text-white text-opacity-90">
                  <div class="flex items-start">
                    <span class="text-yellow-300 mr-2">1.</span>
                    <span>Получите код билета при покупке программы</span>
                  </div>
                  <div class="flex items-start">
                    <span class="text-yellow-300 mr-2">2.</span>
                    <span>Введите 6-значный код в форму выше</span>
                  </div>
                  <div class="flex items-start">
                    <span class="text-yellow-300 mr-2">3.</span>
                    <span>Активируйте билет и участвуйте в розыгрыше</span>
                  </div>
                  <div class="flex items-start">
                    <span class="text-yellow-300 mr-2">4.</span>
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
            class="flex justify-center items-center py-16"
          >
            <div class="relative">
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-white border-opacity-30"
              ></div>
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent absolute top-0 left-0"
              ></div>
            </div>
          </div>

          <!-- Ошибка неполного профиля -->
          <div
            v-else-if="profileError"
            class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div class="text-center text-white">
              <div class="text-5xl mb-4">👤</div>
              <h3 class="text-xl font-bold mb-3">Заполните профиль</h3>
              <p class="text-sm text-white text-opacity-90 mb-6">
                Заполните полностью профиль и нажмите кнопку "Обновить", чтобы
                заново запросить данные
              </p>

              <div class="flex flex-col gap-3">
                <button
                  @click="goToProfile"
                  class="bg-white hover:bg-gray-100 text-purple-700 font-bold py-3 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg"
                >
                  Заполнить профиль
                </button>

                <button
                  @click="loadData"
                  class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all transform active:scale-95"
                >
                  🔄 Обновить
                </button>
              </div>
            </div>
          </div>

          <!-- Список билетов -->
          <div v-else-if="history.length > 0" class="space-y-3">
            <div
              v-for="ticket in history"
              :key="ticket.id"
              class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-5 shadow-xl"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-white font-bold text-lg">
                      Билет #{{ ticket.ticket_number }}
                    </span>
                    <span
                      v-if="ticket.prize"
                      class="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold"
                    >
                      🏆 Приз
                    </span>
                  </div>

                  <div
                    v-if="ticket.prize"
                    class="text-white text-opacity-90 mb-2"
                  >
                    <span class="font-semibold">Выигрыш:</span>
                    <span class="ml-2 text-yellow-300 font-bold">{{
                      ticket.prize
                    }}</span>
                  </div>

                  <div class="text-white text-opacity-70 text-xs">
                    Активирован: {{ formatDate(ticket.created_at) }}
                  </div>
                </div>

                <div class="text-3xl">
                  {{ ticket.prize ? "🎁" : "🎟️" }}
                </div>
              </div>
            </div>
          </div>

          <!-- Пусто -->
          <div v-else class="text-center py-16">
            <div
              class="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-4xl">🏆</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Нет билетов</h3>
            <p class="text-white text-opacity-70 text-sm">
              У вас пока нет активированных билетов
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно успеха -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="showSuccessModal = false"
    >
      <!-- Конфетти -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          v-for="i in 50"
          :key="i"
          class="confetti"
          :style="{
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 3 + 's',
            animationDuration: 3 + Math.random() * 2 + 's',
            backgroundColor: getConfettiColor(),
          }"
        ></div>
      </div>

      <div
        class="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-prize-pop relative overflow-hidden"
        @click.stop
      >
        <!-- Сияние -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-30 animate-shine"
        ></div>

        <!-- Контент -->
        <div class="relative z-10">
          <!-- Анимированный эмодзи -->
          <div class="relative">
            <div class="text-8xl mb-4 animate-bounce-trophy">🎉</div>
            <div
              class="absolute top-0 left-1/2 transform -translate-x-1/2 text-6xl animate-float-sparkle"
            >
              ✨
            </div>
            <div
              class="absolute top-0 right-1/4 text-5xl animate-float-sparkle-delayed"
            >
              ⭐
            </div>
          </div>

          <h3
            class="text-3xl font-black text-white mb-2 drop-shadow-lg animate-pulse-slow"
          >
            ПОЗДРАВЛЯЕМ!
          </h3>

          <p class="text-white text-lg mb-4 font-semibold drop-shadow">
            Ваш билет успешно активирован!
          </p>

          <!-- Билет -->
          <div
            class="bg-white rounded-2xl p-6 mb-6 shadow-xl transform hover:scale-105 transition-transform"
          >
            <div class="flex items-center justify-center mb-3">
              <div class="text-5xl mr-3">🎟️</div>
              <div class="text-left">
                <div
                  class="text-gray-600 text-xs uppercase font-bold tracking-wide"
                >
                  Номер билета
                </div>
                <div
                  class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  #{{ redeemedTicket?.ticket_number }}
                </div>
              </div>
            </div>

            <div class="border-t-2 border-dashed border-gray-300 pt-3">
              <div
                class="flex items-center justify-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-1.5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-semibold">Активирован</span>
              </div>
            </div>
          </div>

          <div
            class="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-6"
          >
            <p class="text-white text-sm font-medium">
              🍀 Вы участвуете в розыгрыше призов!
            </p>
          </div>

          <button
            @click="showSuccessModal = false"
            class="w-full bg-white hover:bg-gray-100 text-orange-600 font-black py-4 px-8 rounded-xl transition-all transform active:scale-95 text-lg shadow-lg"
          >
            🎊 Отлично!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lotteryAPI } from "@/utils/api";

export default {
  name: "LotteryPage",
  data() {
    return {
      isLoading: false,
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

    // Получаем последний билет пользователя
    lastTicket() {
      if (!this.history.length) return null;
      // Сортируем по дате создания (новые первыми) и берем первый
      const sorted = [...this.history].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      return sorted[0];
    },

    // Проверяем, есть ли у пользователя активный билет (без приза)
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
        console.log("Статус лотереи:", data);
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

        console.log("История билетов:", this.history);
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

        console.log("Активация билета с кодом:", this.ticketCode);

        const ticket = await lotteryAPI.redeemTicket(this.ticketCode);

        console.log("Билет активирован:", ticket);

        this.redeemedTicket = ticket;
        this.showSuccessModal = true;
        this.ticketCode = "";

        // Обновляем данные
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

    getConfettiColor() {
      const colors = [
        "#FFD700", // Gold
        "#FF69B4", // Hot Pink
        "#00CED1", // Turquoise
        "#FF6347", // Tomato
        "#9370DB", // Purple
        "#32CD32", // Lime
        "#FF1493", // Deep Pink
        "#00BFFF", // Deep Sky Blue
      ];
      return colors[Math.floor(Math.random() * colors.length)];
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
/* Стили без изменений */
.text-shadow {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: confetti-fall linear infinite;
  opacity: 0.8;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes prize-pop {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-prize-pop {
  animation: prize-pop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounce-trophy {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.animate-bounce-trophy {
  animation: bounce-trophy 1s ease-in-out infinite;
}

@keyframes float-sparkle {
  0%,
  100% {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -15px) scale(1.2);
    opacity: 0.7;
  }
}

.animate-float-sparkle {
  animation: float-sparkle 2s ease-in-out infinite;
}

.animate-float-sparkle-delayed {
  animation: float-sparkle 2s ease-in-out infinite;
  animation-delay: 0.5s;
}

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

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>
