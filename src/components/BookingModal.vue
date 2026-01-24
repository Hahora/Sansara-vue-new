<template>
  <!-- Модальное окно -->
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
    >
      <!-- Заголовок -->
      <div
        class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-4 sm:px-5 py-4 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center min-w-0 flex-1">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path
                d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
              />
            </svg>
            <div class="min-w-0 flex-1">
              <h3 class="font-bold text-base sm:text-lg truncate">
                Бронирование
              </h3>
              <p class="text-white text-opacity-90 text-xs sm:text-sm truncate">
                {{ bookingTitle }}
              </p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="text-white hover:text-gray-200 ml-2 flex-shrink-0"
          >
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

      <!-- Содержимое -->
      <div class="p-4 sm:p-5 space-y-3 sm:space-y-4">
        <!-- Ошибки профиля -->
        <div
          v-if="!userHasRequiredData"
          class="bg-red-50 border-l-4 border-red-500 rounded-r p-3 sm:p-4"
        >
          <div class="flex items-start">
            <svg
              class="h-5 w-5 text-red-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-red-800 font-medium mb-1">
                Недостаточно данных для бронирования
              </p>
              <p class="text-xs text-red-600">
                Для бронирования необходимо заполнить данные профиля
              </p>
              <button
                @click="goToProfile"
                class="mt-2 text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Перейти в профиль →
              </button>
            </div>
          </div>
        </div>

        <!-- Информация о бронировании -->
        <div class="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-gray-900 text-sm sm:text-base truncate">
                {{ bookingTitle }}
              </h4>
              <p class="text-xs sm:text-sm text-gray-600 truncate">
                {{ getEventTypeName(eventKey) }}
              </p>
            </div>
          </div>

          <div v-if="selectedBranch" class="text-xs sm:text-sm text-gray-600">
            <span class="font-medium">Филиал:</span>
            <span class="ml-2">{{ selectedBranch.name }}</span>
          </div>
        </div>

        <!-- Форма бронирования -->
        <div v-if="userHasRequiredData" class="space-y-3 sm:space-y-4">
          <!-- Информация о контактах -->
          <div class="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
            <div class="flex items-center mb-2">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="font-medium text-gray-700 text-xs sm:text-sm"
                >Ваши контактные данные</span
              >
            </div>
            <div class="space-y-1 text-xs sm:text-sm">
              <div class="flex justify-between items-start">
                <span class="text-gray-600 flex-shrink-0">Имя:</span>
                <span
                  class="font-medium text-gray-900 text-right ml-2 break-words"
                  >{{ user?.first_name }} {{ user?.last_name || "" }}</span
                >
              </div>
              <div class="flex justify-between items-start">
                <span class="text-gray-600 flex-shrink-0">Телефон:</span>
                <span class="font-medium text-gray-900 text-right ml-2">{{
                  user?.phone || "Не указан"
                }}</span>
              </div>
            </div>
            <button
              @click="goToProfile"
              class="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Изменить в профиле →
            </button>
          </div>

          <!-- Количество гостей -->
          <div>
            <label
              class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
            >
              Количество гостей <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.participants_count"
                type="number"
                min="1"
                :max="program?.max_participants || 100"
                placeholder="Укажите количество гостей"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent text-sm"
                :key="`participants-${visible}`"
              />
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                  />
                </svg>
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              <span v-if="program?.max_participants">
                Максимум: {{ program.max_participants }} гостей
              </span>
              <span v-else> Укажите планируемое количество гостей </span>
            </p>
          </div>

          <!-- Промокод -->
          <div>
            <label
              class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
            >
              Промокод
            </label>
            <div class="relative">
              <input
                v-model="form.promo_code"
                type="text"
                placeholder="Введите промокод"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent text-sm uppercase"
                maxlength="20"
                :key="`promo-${visible}`"
                @input="clearPromoError"
              />
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Если у вас есть промокод, введите его для получения скидки
            </p>

            <!-- Сообщение об ошибке промокода -->
            <div
              v-if="promoError"
              class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600"
            >
              {{ promoError }}
            </div>
          </div>

          <!-- Комментарий -->
          <div>
            <label
              class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
            >
              Комментарий к бронированию
            </label>
            <textarea
              v-model="form.comment"
              placeholder="Дополнительные пожелания, удобное время для связи и т.д."
              rows="3"
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent text-sm resize-none"
              maxlength="500"
              :key="`comment-${visible}`"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500 text-right">
              {{ form.comment.length }}/500
            </p>
          </div>

          <!-- Кнопка отправки -->
          <button
            @click="submitBooking"
            :disabled="
              isSubmitting || !userHasRequiredData || !form.participants_count
            "
            class="w-full bg-[#4e5d51] hover:bg-[#3d4a40] active:bg-[#2d3a30] text-white font-bold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 text-white"
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
            <svg
              v-else
              class="h-4 w-4 sm:h-5 sm:h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path
                d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
              />
            </svg>
            <span class="text-sm sm:text-base">{{
              isSubmitting ? "Отправка..." : "Забронировать"
            }}</span>
          </button>

          <p class="text-xs text-gray-500 text-center px-2">
            После отправки заявки наш менеджер свяжется с вами для подтверждения
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { bookingAPI } from "@/utils/api";

export default {
  name: "BookingModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    program: {
      type: Object,
      default: null,
    },
    eventKey: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isSubmitting: false,
      promoError: "",
      form: {
        participants_count: null,
        comment: "",
        promo_code: "",
      },
    };
  },
  computed: {
    ...mapState(useAppStore, ["user", "selectedBranch"]),

    userHasRequiredData() {
      return this.user?.phone && this.user?.first_name;
    },

    bookingTitle() {
      if (this.title) return this.title;
      if (this.program?.name) return this.program.name;
      return this.getEventTypeName(this.eventKey) || "Бронирование";
    },
  },
  methods: {
    closeModal() {
      console.log("BookingModal: closeModal called");
      this.$emit("update:visible", false);
      this.$emit("close");
      // Сбрасываем форму с небольшой задержкой после закрытия
      setTimeout(() => {
        this.resetForm();
      }, 300);
    },

    resetForm() {
      // Полностью пересоздаем объект формы
      this.form = {
        participants_count: null,
        comment: "",
        promo_code: "",
      };
      this.promoError = "";
      this.isSubmitting = false;

      // Принудительно обновляем компонент
      this.$forceUpdate();
    },

    clearPromoError() {
      this.promoError = "";
    },

    getEventTypeName(eventKey) {
      const types = {
        BACHELOR: "Мальчишник",
        BACHELORETTE: "Девичник",
        CLUB_EVENT: "Клубное мероприятие",
        FIRST_TIME: "Первый раз",
        CORPORATE: "Корпоративное мероприятие",
      };
      return types[eventKey] || "";
    },

    goToProfile() {
      this.closeModal();
      this.$router.push("/profile");
    },

    parsePromoError(errorDetail) {
      console.log("Parsing promo error detail:", errorDetail);

      // Приводим к нижнему регистру для поиска
      const errorLower = errorDetail.toLowerCase();

      if (
        errorLower.includes("not found") ||
        errorLower.includes("не найден")
      ) {
        return "Промокод не найден. Проверьте правильность ввода.";
      }

      if (
        errorLower.includes("not active") ||
        errorLower.includes("неактивен")
      ) {
        return "Промокод неактивен.";
      }

      if (
        errorLower.includes("not yet active") ||
        errorLower.includes("еще не начал")
      ) {
        return "Промокод еще не начал действовать.";
      }

      if (errorLower.includes("expired") || errorLower.includes("истек")) {
        return "Срок действия промокода истек.";
      }

      if (errorLower.includes("maximum uses") || errorLower.includes("лимит")) {
        return "Лимит использований промокода исчерпан.";
      }

      if (
        errorLower.includes("already used") ||
        errorLower.includes("уже использовали")
      ) {
        return "Вы уже использовали этот промокод.";
      }

      if (
        errorLower.includes("first visit only") ||
        errorLower.includes("первого посещения")
      ) {
        return "Промокод только для первого посещения. У вас уже есть бронирования.";
      }

      if (
        errorLower.includes("not valid for program") ||
        errorLower.includes("не действует")
      ) {
        // Пытаемся извлечь тип программы
        const match =
          errorDetail.match(/type:?\s*(\w+)/i) ||
          errorDetail.match(/программ[а-я]*:\s*(\w+)/i);
        const programType = match ? match[1] : "";

        // Получаем название типа программы на русском
        const programTypeNames = {
          BACHELOR: "мальчишник",
          BACHELORETTE: "девичник",
          CLUB_EVENT: "клубное мероприятие",
          FIRST_TIME: "первый раз",
          CORPORATE: "корпоративное мероприятие",
          COLLECTIVE: "групповое мероприятие",
          AUTHOR: "авторская программа",
        };

        const programName =
          programTypeNames[programType] || programType.toLowerCase();
        return `Промокод не действует на ${programName}.`;
      }

      if (
        errorLower.includes("invalid configuration") ||
        errorLower.includes("некорректная конфигурация")
      ) {
        return "Некорректная конфигурация промокода.";
      }

      // Общее сообщение для других ошибок промокода
      if (
        errorLower.includes("promo code") ||
        errorLower.includes("промокод")
      ) {
        return "Ошибка промокода. Проверьте правильность ввода или попробуйте без промокода.";
      }

      return "Ошибка промокода. Проверьте правильность ввода.";
    },

    async submitBooking() {
      try {
        if (!this.userHasRequiredData) {
          alert("Заполните данные профиля для бронирования");
          return;
        }

        if (!this.form.participants_count || this.form.participants_count < 1) {
          alert("Укажите количество гостей");
          return;
        }

        if (!this.selectedBranch?.id) {
          alert("Выберите филиал");
          return;
        }

        if (!this.user?.id) {
          alert("Необходима авторизация");
          return;
        }

        this.isSubmitting = true;
        this.promoError = "";

        const bookingData = {
          user_id: this.user.id,
          username: this.user?.username || `user_${this.user.id}`,
          branch_id: this.selectedBranch.id,
          contact_name:
            `${this.user.first_name} ${this.user.last_name || ""}`.trim(),
          contact_phone: this.user.phone,
          participants_count: this.form.participants_count,
          comment: this.form.comment,
        };

        // Добавляем промокод только если он заполнен
        if (this.form.promo_code && this.form.promo_code.trim()) {
          bookingData.promo_code = this.form.promo_code.trim().toUpperCase();
        }

        if (this.eventKey) {
          bookingData.event_key = this.eventKey;
        } else if (this.program?.id) {
          bookingData.program_id = this.program.id;
        } else {
          throw new Error("Не указано что бронировать");
        }

        console.log("Отправка данных бронирования:", bookingData);

        const response = await bookingAPI.create(bookingData);

        console.log("Ответ от сервера:", response);

        alert(
          "Бронирование успешно отправлено! Менеджер свяжется с вами в ближайшее время."
        );

        // Просто закрываем модальное окно
        this.closeModal();
      } catch (error) {
        console.error("Ошибка при бронировании:", error);
        console.error("Error details:", error.response?.data);
        console.error("Error message:", error.message);

        // Обработка ошибок промокода
        // Проверяем разные места где может быть детализация ошибки
        const errorDetail = error.response?.data?.detail || error.message || "";
        console.log("Error detail for parsing:", errorDetail);

        // Проверяем, содержит ли ошибка информацию о промокоде
        if (
          errorDetail.includes("Promo code") ||
          errorDetail.includes("promo code") ||
          error.message.includes("Promo code") ||
          error.message.includes("promo code")
        ) {
          const promoErrorMessage = this.parsePromoError(errorDetail);
          this.promoError = promoErrorMessage;
          console.log("Promo error set:", promoErrorMessage);

          // Если ошибка промокода, не показываем общий alert
          return;
        }

        // Общие ошибки HTTP
        let errorMessage = "Ошибка при бронировании. Попробуйте еще раз.";

        if (error.message.includes("400") || errorDetail.includes("400")) {
          errorMessage = "Проверьте правильность заполнения данных";
        } else if (
          error.message.includes("404") ||
          errorDetail.includes("404")
        ) {
          errorMessage = "Запрашиваемый ресурс не найден";
        } else if (
          error.message.includes("409") ||
          errorDetail.includes("409")
        ) {
          errorMessage = "Вы уже забронировали эту программу";
        } else if (
          error.message.includes("422") ||
          errorDetail.includes("422")
        ) {
          errorMessage = "Неверные данные для бронирования";
        } else if (error.message.includes("Не указано что бронировать")) {
          errorMessage = "Ошибка: не указано что бронировать";
        }

        alert(errorMessage);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  watch: {
    visible(newVal) {
      console.log("BookingModal watch visible:", newVal);
      if (newVal) {
        // При открытии модального окна сбрасываем форму
        this.$nextTick(() => {
          this.resetForm();
        });
      }
    },
  },
};
</script>

<style scoped>
/* Стили для скролла в модальном окне */
.max-h-\[90vh\] {
  max-height: 90vh;
}

.overflow-y-auto {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Плавная прокрутка на iOS */
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* ИСПРАВЛЕНИЕ: Цвет курсора в полях ввода */
input,
textarea {
  caret-color: #4e5d51; /* Зеленый цвет как у вашей темы */
  color: #111827; /* Темный цвет текста */
}

input::placeholder,
textarea::placeholder {
  color: #9ca3af; /* Серый цвет плейсхолдера */
}

/* Убираем outline на мобильных при фокусе */
@media (max-width: 640px) {
  input:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }
}

/* Улучшаем кликабельность кнопок на мобильных */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Предотвращаем zoom при фокусе на input на iOS */
@media screen and (max-width: 640px) {
  input[type="text"],
  input[type="number"],
  textarea {
    font-size: 16px; /* iOS не зумит если размер >= 16px */
  }
}
</style>
