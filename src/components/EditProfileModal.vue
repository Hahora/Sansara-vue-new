<template>
  <!-- Модальное окно редактирования профиля -->
  <transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-[#202c27]/90 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4"
      @click.self="close"
    >
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
        enter-to-class="translate-y-0 sm:scale-100 sm:opacity-100"
        leave-active-class="transition-all duration-250 ease-in"
        leave-from-class="translate-y-0 sm:scale-100 sm:opacity-100"
        leave-to-class="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
      >
        <div
          class="bg-[#edeae6] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] flex flex-col shadow-2xl"
        >
          <!-- Заголовок -->
          <div
            class="flex-shrink-0 bg-[#202c27] text-white px-5 py-4 rounded-t-2xl sm:rounded-t-2xl"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-xl flex items-center justify-center"
                >
                  <User class="h-5 w-5 text-white" />
                </div>
                <h3 class="font-light text-lg tracking-wide">
                  Редактировать профиль
                </h3>
              </div>
              <button
                @click="close"
                class="text-white/80 hover:text-white ml-3 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Форма -->
          <form
            @submit.prevent="save"
            class="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin-modal space-y-4"
          >
            <!-- Имя -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Имя <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.first_name"
                type="text"
                required
                class="w-full px-4 py-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl text-sm focus:ring-2 focus:ring-[#c2a886] focus:border-transparent outline-none transition-all"
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
                class="w-full px-4 py-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl text-sm focus:ring-2 focus:ring-[#c2a886] focus:border-transparent outline-none transition-all"
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
                class="w-full px-4 py-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl text-sm focus:ring-2 focus:ring-[#c2a886] focus:border-transparent outline-none transition-all"
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
                class="w-full px-4 py-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl text-sm focus:ring-2 focus:ring-[#c2a886] focus:border-transparent outline-none transition-all"
              />
            </div>

            <!-- Ошибка валидации -->
            <div
              v-if="validationError"
              class="bg-red-50/90 border border-red-200 rounded-xl p-3"
            >
              <div class="flex items-start gap-2">
                <AlertCircle
                  class="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5"
                />
                <p class="text-sm text-red-800">{{ validationError }}</p>
              </div>
            </div>

            <!-- Ошибка API -->
            <div
              v-if="apiErrorMessage"
              class="bg-red-50/90 border border-red-200 rounded-xl p-3"
            >
              <div class="flex items-start gap-2">
                <AlertCircle
                  class="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5"
                />
                <p class="text-sm text-red-800">{{ apiErrorMessage }}</p>
              </div>
            </div>

            <!-- Кнопки -->
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="close"
                class="flex-1 bg-[#d9cebc] hover:bg-[#c2a886]/30 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-300 active:scale-[0.98]"
              >
                <span class="text-[15px]">Отмена</span>
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="flex-1 bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <span v-if="!isSaving" class="text-[15px]">Сохранить</span>
                <span v-else class="flex items-center gap-2">
                  <Loader2 class="h-4 w-4 animate-spin" />
                  <span class="text-[15px]">Сохранение...</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { userAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "EditProfileModal",
  components: {
    ...icons,
  },
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
    lockBodyScroll() {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY;

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    },

    unlockBodyScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      const scrollY = document.body.dataset.scrollY;
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
        delete document.body.dataset.scrollY;
      }
    },

    validateForm() {
      this.validationError = null;
      this.apiErrorMessage = null;

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

          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            if (!(year === 1970 && month === 1 && day === 1)) {
              const currentYear = new Date().getFullYear();
              if (year <= currentYear + 10 && year >= 1900) {
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
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() - 18);
      return defaultDate.toISOString().split("T")[0];
    },

    close() {
      this.$emit("close");
    },

    async save() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.isSaving = true;
        this.apiErrorMessage = null;

        const requestData = { ...this.formData };

        if (requestData.date_of_birth) {
          try {
            const date = new Date(requestData.date_of_birth);

            if (isNaN(date.getTime())) {
              throw new Error("Некорректная дата рождения");
            } else {
              requestData.date_of_birth = date.toISOString();
            }
          } catch (error) {
            console.error("Error formatting date for API:", error);
            this.apiErrorMessage = "Некорректная дата рождения";
            this.isSaving = false;
            return;
          }
        }

        requestData.first_name = requestData.first_name.trim();
        requestData.last_name = requestData.last_name.trim();
        requestData.phone = requestData.phone.trim();

        console.log("Сохранение профиля:", requestData);

        const updatedUser = await userAPI.updateMe(requestData);

        console.log("Профиль обновлен:", updatedUser);

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
    if (this.isOpen) {
      this.lockBodyScroll();
    }

    const handleEscape = (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    };

    document.addEventListener("keydown", handleEscape);
    this.handleEscapeKey = handleEscape;
  },

  beforeUnmount() {
    if (this.handleEscapeKey) {
      document.removeEventListener("keydown", this.handleEscapeKey);
    }
    this.unlockBodyScroll();
  },

  unmounted() {
    this.unlockBodyScroll();
  },
};
</script>

<style scoped>
/* Скролл для модалки */
.scrollbar-thin-modal::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin-modal::-webkit-scrollbar-track {
  background: rgba(194, 168, 134, 0.1);
  border-radius: 10px;
}

.scrollbar-thin-modal::-webkit-scrollbar-thumb {
  background: rgba(194, 168, 134, 0.5);
  border-radius: 10px;
}

.scrollbar-thin-modal::-webkit-scrollbar-thumb:hover {
  background: rgba(194, 168, 134, 0.7);
}

.scrollbar-thin-modal {
  scrollbar-width: thin;
  scrollbar-color: rgba(194, 168, 134, 0.5) rgba(194, 168, 134, 0.1);
}

/* Стили для input */
input[type="text"],
input[type="tel"],
input[type="date"] {
  caret-color: #c2a886;
  color: #111827;
}

input::placeholder {
  color: #9ca3af;
}

input:focus {
  outline: none;
}

/* Предотвращаем zoom на iOS */
@media screen and (max-width: 640px) {
  input[type="text"],
  input[type="tel"],
  input[type="date"] {
    font-size: 16px;
  }
}
</style>
