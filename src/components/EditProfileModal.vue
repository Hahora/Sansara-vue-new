<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
    >
      <!-- Заголовок -->
      <div
        class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-5 py-4 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-lg">Редактировать профиль</h3>
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

      <!-- Форма -->
      <form @submit.prevent="save" class="p-5 space-y-4">
        <!-- Имя -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Имя <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.first_name"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none transition-all"
            placeholder="Введите ваше имя"
          />
        </div>

        <!-- Фамилия -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Фамилия <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.last_name"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none transition-all"
            placeholder="Введите вашу фамилию"
          />
        </div>

        <!-- Телефон -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Телефон <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.phone"
            type="tel"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none transition-all"
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <!-- Дата рождения -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Дата рождения <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.date_of_birth"
            type="date"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none transition-all"
          />
        </div>

        <!-- Ошибка валидации -->
        <div
          v-if="validationError"
          class="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-3"
        >
          <p class="text-sm text-red-800">{{ validationError }}</p>
        </div>

        <!-- Ошибка API -->
        <div
          v-if="apiErrorMessage"
          class="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-3"
        >
          <p class="text-sm text-red-800">{{ apiErrorMessage }}</p>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="close"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 active:scale-98"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isSaving">Сохранить</span>
            <span v-else class="flex items-center">
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
              Сохранение...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { userAPI } from "@/utils/api";

export default {
  name: "EditProfileModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    userData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {
        first_name: "",
        last_name: "",
        phone: "",
        date_of_birth: "",
      },
      isSaving: false,
      validationError: null,
      apiErrorMessage: null,
    };
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.lockBodyScroll();
        this.resetForm();
      } else {
        this.unlockBodyScroll();
      }
    },
    userData: {
      handler() {
        if (this.isOpen) {
          this.resetForm();
        }
      },
      deep: true,
    },
  },
  methods: {
    // Блокировка прокрутки тела документа
    lockBodyScroll() {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Сохраняем позицию скролла в data атрибуте
      document.body.dataset.scrollY = scrollY;

      // Добавляем padding-right для компенсации скроллбара
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    },

    // Разблокировка прокрутки тела документа
    unlockBodyScroll() {
      // Восстанавливаем стили
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Восстанавливаем позицию скролла
      const scrollY = document.body.dataset.scrollY;
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
        delete document.body.dataset.scrollY;
      }
    },

    validateForm() {
      this.validationError = null;
      this.apiErrorMessage = null;

      // Проверка обязательных полей
      if (!this.formData.first_name?.trim()) {
        this.validationError = "Имя является обязательным полем";
        return false;
      }

      if (!this.formData.last_name?.trim()) {
        this.validationError = "Фамилия является обязательным полем";
        return false;
      }

      if (!this.formData.phone?.trim()) {
        this.validationError = "Телефон является обязательным полем";
        return false;
      }

      if (!this.formData.date_of_birth) {
        this.validationError = "Дата рождения является обязательным полем";
        return false;
      }

      // Валидация даты рождения
      try {
        const birthDate = new Date(this.formData.date_of_birth);
        const today = new Date();

        if (isNaN(birthDate.getTime())) {
          this.validationError = "Некорректная дата рождения";
          return false;
        }

        if (birthDate > today) {
          this.validationError = "Дата рождения не может быть в будущем";
          return false;
        }

        // Проверка на слишком раннюю дату (например, до 1900 года)
        if (birthDate.getFullYear() < 1900) {
          this.validationError = "Укажите корректную дату рождения";
          return false;
        }
      } catch (error) {
        this.validationError = "Некорректная дата рождения";
        return false;
      }

      return true;
    },

    resetForm() {
      let dateOfBirth = "";

      if (this.userData?.date_of_birth) {
        try {
          const date = new Date(this.userData.date_of_birth);

          // Проверяем, не является ли дата нулевой или некорректной
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            // Если дата не 1970-01-01 и не в далеком будущем
            if (!(year === 1970 && month === 1 && day === 1)) {
              const currentYear = new Date().getFullYear();
              if (year <= currentYear + 10 && year >= 1900) {
                // Форматируем для input type="date" (YYYY-MM-DD)
                dateOfBirth = date.toISOString().split("T")[0];
              }
            }
          }
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }

      this.formData = {
        first_name: this.userData?.first_name || "",
        last_name: this.userData?.last_name || "",
        phone: this.userData?.phone || "",
        date_of_birth: dateOfBirth || this.getDefaultDateOfBirth(),
      };
      this.validationError = null;
      this.apiErrorMessage = null;
    },

    getDefaultDateOfBirth() {
      // Устанавливаем дату рождения по умолчанию (например, 18 лет назад)
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() - 18);
      return defaultDate.toISOString().split("T")[0];
    },

    close() {
      this.$emit("close");
    },

    async save() {
      // Валидация формы
      if (!this.validateForm()) {
        return;
      }

      try {
        this.isSaving = true;
        this.apiErrorMessage = null;

        // Подготавливаем данные
        const requestData = { ...this.formData };

        // Обработка даты рождения
        if (requestData.date_of_birth) {
          try {
            // Создаем дату из строки
            const date = new Date(requestData.date_of_birth);

            // Проверяем валидность
            if (isNaN(date.getTime())) {
              throw new Error("Некорректная дата рождения");
            } else {
              // Форматируем в ISO строку
              requestData.date_of_birth = date.toISOString();
            }
          } catch (error) {
            console.error("Error formatting date for API:", error);
            this.apiErrorMessage = "Некорректная дата рождения";
            this.isSaving = false;
            return;
          }
        }

        // Обрезаем пробелы в текстовых полях
        requestData.first_name = requestData.first_name.trim();
        requestData.last_name = requestData.last_name.trim();
        requestData.phone = requestData.phone.trim();

        console.log("Сохранение профиля:", requestData);

        // Отправляем данные на сервер
        const updatedUser = await userAPI.updateMe(requestData);

        console.log("Профиль обновлен:", updatedUser);

        // Уведомляем родителя об успешном сохранении
        this.$emit("saved", updatedUser);
        this.close();
      } catch (error) {
        console.error("Ошибка при сохранении профиля:", error);
        this.apiErrorMessage =
          error.message ||
          "Не удалось сохранить изменения. Попробуйте ещё раз.";
      } finally {
        this.isSaving = false;
      }
    },
  },

  mounted() {
    // Блокируем прокрутку при монтировании
    if (this.isOpen) {
      this.lockBodyScroll();
    }

    // Добавляем обработчик клавиши Escape
    const handleEscape = (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Сохраняем ссылку на обработчик для удаления
    this.handleEscapeKey = handleEscape;
  },

  beforeUnmount() {
    // Удаляем обработчик клавиши Escape
    if (this.handleEscapeKey) {
      document.removeEventListener("keydown", this.handleEscapeKey);
    }

    // Убедимся, что разблокируем прокрутку при уничтожении компонента
    this.unlockBodyScroll();
  },

  unmounted() {
    // Убедимся, что разблокируем прокрутку при уничтожении компонента
    this.unlockBodyScroll();
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
