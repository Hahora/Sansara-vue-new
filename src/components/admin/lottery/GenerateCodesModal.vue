<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl w-full max-w-md overflow-hidden flex flex-col"
    >
      <!-- Шапка -->
      <div
        class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-4 py-3 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-base">Сгенерировать код</h3>
          <button @click="close" class="text-white hover:text-gray-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Контент -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Подтверждение -->
        <div v-if="!generatedCode && !isGenerating">
          <div class="text-center mb-6">
            <div
              class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-4xl">❓</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              Создать новый код?
            </h3>
            <p class="text-sm text-gray-600">
              Будет сгенерирован новый 6-значный код для участия в лотерее
            </p>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="close"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg text-sm transition-all active:scale-98"
            >
              Отмена
            </button>
            <button
              type="button"
              @click="generateCode"
              class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all active:scale-98"
            >
              Создать
            </button>
          </div>
        </div>

        <!-- Генерация -->
        <div v-else-if="isGenerating" class="text-center py-8">
          <div class="relative mx-auto w-16 h-16 mb-4">
            <div
              class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"
            ></div>
            <div
              class="animate-spin rounded-full h-16 w-16 border-4 border-[#4e5d51] border-t-transparent absolute top-0 left-0"
            ></div>
          </div>
          <p class="text-sm text-gray-600">Генерация кода...</p>
        </div>

        <!-- Сгенерированный код -->
        <div v-else-if="generatedCode" class="text-center">
          <div
            class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in"
          >
            <span class="text-4xl">✅</span>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-2">
            Код успешно создан!
          </h3>

          <!-- Код -->
          <div
            class="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-4"
          >
            <div class="text-sm text-gray-600 mb-2">Код для активации</div>
            <div
              class="font-mono text-4xl font-bold text-purple-600 tracking-widest"
            >
              {{ generatedCode }}
            </div>
            <button
              @click="copyCode"
              class="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center mx-auto"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path
                  d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
                />
              </svg>
              {{ copied ? "Скопировано!" : "Скопировать код" }}
            </button>
          </div>

          <p class="text-xs text-gray-500 mb-6">
            Отправьте этот код пользователю для активации билета
          </p>

          <button
            @click="close"
            class="w-full bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all active:scale-98"
          >
            Готово
          </button>
        </div>

        <!-- Ошибка -->
        <div
          v-if="error"
          class="mt-4 bg-red-50 border-l-4 border-red-500 rounded-r p-3"
        >
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lotteryAPI } from "@/utils/api";

export default {
  name: "GenerateCodesModal",
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isGenerating: false,
      error: null,
      generatedCode: null,
      copied: false,
      scrollY: 0,
    };
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.lockBodyScroll();
        // Сбрасываем состояние при открытии
        this.generatedCode = null;
        this.error = null;
        this.copied = false;
      } else {
        this.unlockBodyScroll();
      }
    },
  },
  methods: {
    lockBodyScroll() {
      this.scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    },

    unlockBodyScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, this.scrollY);
    },

    close() {
      if (this.generatedCode) {
        this.$emit("generated");
      }
      this.$emit("close");
    },

    async generateCode() {
      try {
        this.isGenerating = true;
        this.error = null;

        console.log("Генерация одного кода");

        // Генерируем 1 код
        const response = await lotteryAPI.generateCodes(1);

        // Предполагаем, что API возвращает массив кодов или объект с кодом
        if (response && response.codes && response.codes.length > 0) {
          this.generatedCode = response.codes[0].code;
        } else if (response && response.code) {
          this.generatedCode = response.code;
        } else {
          throw new Error("Не удалось получить код из ответа");
        }

        console.log("Код сгенерирован:", this.generatedCode);
      } catch (error) {
        console.error("Ошибка при генерации кода:", error);
        this.error = error.message || "Не удалось сгенерировать код";
        this.generatedCode = null;
      } finally {
        this.isGenerating = false;
      }
    },

    async copyCode() {
      try {
        await navigator.clipboard.writeText(this.generatedCode);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (error) {
        console.error("Ошибка при копировании:", error);
        alert("Не удалось скопировать код");
      }
    },
  },
  beforeDestroy() {
    this.unlockBodyScroll();
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>
