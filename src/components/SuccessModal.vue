<template>
  <!-- Модальное окно успешной активации билета -->
  <transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      @click="closeModal"
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

      <transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="scale-0 rotate-180 opacity-0"
        enter-to-class="scale-100 rotate-0 opacity-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="scale-100 rotate-0 opacity-100"
        leave-to-class="scale-0 rotate-180 opacity-0"
      >
        <div
          class="bg-gradient-to-br from-[#c2a886] via-yellow-400 to-[#b5976e] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform relative overflow-hidden"
          @click.stop
        >
          <!-- Золотое сияние -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent animate-shine"
          ></div>

          <!-- Контент -->
          <div class="relative z-10">
            <!-- Анимированные иконки -->
            <div class="relative mb-6">
              <div class="text-8xl mb-4 animate-bounce-trophy">
                <PartyPopper
                  class="h-20 w-20 mx-auto text-white drop-shadow-2xl"
                />
              </div>
              <div
                class="absolute top-0 left-1/2 transform -translate-x-1/2 animate-float-sparkle"
              >
                <Sparkles class="h-12 w-12 text-yellow-200" />
              </div>
              <div
                class="absolute top-0 right-1/4 animate-float-sparkle-delayed"
              >
                <Star class="h-10 w-10 text-yellow-100" />
              </div>
            </div>

            <h3
              class="text-3xl font-black text-white mb-2 drop-shadow-lg animate-pulse-slow tracking-wide"
            >
              ПОЗДРАВЛЯЕМ!
            </h3>

            <p class="text-white text-lg mb-6 font-semibold drop-shadow">
              Ваш билет успешно активирован!
            </p>

            <!-- Билет -->
            <div
              class="bg-white rounded-2xl p-6 mb-6 shadow-xl transform hover:scale-105 transition-transform"
            >
              <div class="flex items-center justify-center mb-4">
                <div
                  class="h-14 w-14 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center mr-3"
                >
                  <Ticket class="h-8 w-8 text-white" />
                </div>
                <div class="text-left">
                  <div
                    class="text-gray-600 text-xs uppercase font-bold tracking-wide"
                  >
                    Номер билета
                  </div>
                  <div
                    class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c2a886] to-[#b5976e]"
                  >
                    #{{ ticket?.ticket_number || "000000" }}
                  </div>
                </div>
              </div>

              <div class="border-t-2 border-dashed border-gray-300 pt-4">
                <div
                  class="flex items-center justify-center text-sm text-gray-600"
                >
                  <CheckCircle class="h-4 w-4 mr-1.5 text-green-500" />
                  <span class="font-semibold">Активирован</span>
                </div>
              </div>
            </div>

            <div
              class="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/30"
            >
              <p
                class="text-white text-sm font-medium flex items-center justify-center gap-2"
              >
                <Sparkles class="h-4 w-4" />
                Вы участвуете в розыгрыше призов!
              </p>
            </div>

            <button
              @click="closeModal"
              class="w-full bg-white hover:bg-gray-100 text-[#c2a886] font-black py-4 px-8 rounded-xl transition-all duration-300 active:scale-[0.98] text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <PartyPopper class="h-5 w-5" />
              <span>Отлично!</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import icons from "@/utils/icons";

export default {
  name: "SuccessModal",
  components: {
    ...icons,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ticket: {
      type: Object,
      default: null,
    },
  },
  methods: {
    closeModal() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },

    getConfettiColor() {
      const colors = [
        "#c2a886", // Основной золотой
        "#FFD700", // Золотой
        "#FFA500", // Оранжевый
        "#FF6347", // Томатный
        "#FFE4B5", // Светло-персиковый
        "#FFDAB9", // Персиковый
        "#FFB6C1", // Светло-розовый
        "#FFC0CB", // Розовый
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        // Блокируем скролл при открытии
        document.body.style.overflow = "hidden";
      } else {
        // Разблокируем скролл при закрытии
        document.body.style.overflow = "";
      }
    },
  },

  mounted() {
    // Обработка нажатия Escape
    const handleEscape = (e) => {
      if (e.key === "Escape" && this.visible) {
        this.closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    this.handleEscapeKey = handleEscape;
  },

  beforeUnmount() {
    if (this.handleEscapeKey) {
      document.removeEventListener("keydown", this.handleEscapeKey);
    }
    // Разблокируем скролл при размонтировании
    document.body.style.overflow = "";
  },
};
</script>

<style scoped>
/* Конфетти */
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

/* Золотое сияние */
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

/* Подпрыгивающий кубок */
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

/* Плавающие звездочки */
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

/* Медленный пульс */
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
</style>
