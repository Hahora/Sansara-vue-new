<template>
  <!-- Модальное окно покупки сертификата -->
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
      class="fixed inset-0 bg-[#202c27]/90 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4"
      @click.self="closeModal"
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
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div
                  class="h-10 w-10 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <Gift class="h-5 w-5 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-light text-base tracking-wide">
                    Приобретение сертификата
                  </h3>
                  <p class="text-white/70 text-xs truncate">
                    {{ certificate?.title }}
                  </p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="text-white/80 hover:text-white ml-3 p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Содержимое -->
          <div
            class="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin-modal space-y-4"
          >
            <!-- Проверка заполненности данных профиля -->
            <div
              v-if="!userHasRequiredData"
              class="bg-red-50/90 border border-red-200 rounded-xl p-4"
            >
              <div class="flex items-start gap-3">
                <AlertCircle
                  class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
                />
                <div class="flex-1">
                  <p class="text-sm text-red-800 font-medium mb-1">
                    Недостаточно данных для покупки
                  </p>
                  <p class="text-xs text-red-600 mb-2">
                    Для покупки необходимо заполнить данные профиля
                  </p>
                  <button
                    @click="goToProfile"
                    class="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                  >
                    <span>Перейти в профиль</span>
                    <ChevronRight class="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Форма покупки (показывается только если данные заполнены) -->
            <div v-if="userHasRequiredData" class="space-y-4">
              <!-- Информация о контактах -->
              <div
                class="bg-[#d9cebc]/60 rounded-xl p-4 border border-[#c2a886]/30"
              >
                <div class="flex items-center gap-2 mb-3">
                  <Info class="h-4 w-4 text-[#c2a886]" />
                  <span class="font-medium text-gray-900 text-sm"
                    >Ваши контактные данные</span
                  >
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Имя:</span>
                    <span class="font-medium text-gray-900">{{
                      user?.first_name
                        ? `${user.first_name} ${user.last_name || ""}`.trim()
                        : "Не указано"
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Телефон:</span>
                    <span class="font-medium text-gray-900">{{
                      user?.phone || "Не указан"
                    }}</span>
                  </div>
                </div>
                <button
                  @click="goToProfile"
                  class="mt-3 text-xs text-[#c2a886] hover:text-[#b5976e] font-medium flex items-center gap-1"
                >
                  <span>Изменить в профиле</span>
                  <ChevronRight class="h-3 w-3" />
                </button>
              </div>

              <!-- Шаг 1: Выбор типа сертификата -->
              <div class="space-y-3">
                <h4 class="font-semibold text-gray-900 text-[15px]">
                  Тип сертификата
                </h4>
                <div class="space-y-2">
                  <!-- Радио кнопки для выбора типа -->
                  <label
                    class="flex items-center space-x-3 p-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl hover:bg-[#d9cebc] cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      v-model="purchaseData.certificate_type"
                      value="deposit"
                      class="text-[#c2a886] focus:ring-[#c2a886]"
                    />
                    <div>
                      <span class="font-medium text-gray-900 text-sm"
                        >На депозит</span
                      >
                      <p class="text-xs text-gray-600">
                        Сертификат на определенную сумму
                      </p>
                    </div>
                  </label>

                  <label
                    class="flex items-center space-x-3 p-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl hover:bg-[#d9cebc] cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      v-model="purchaseData.certificate_type"
                      value="program"
                      class="text-[#c2a886] focus:ring-[#c2a886]"
                    />
                    <div>
                      <span class="font-medium text-gray-900 text-sm"
                        >На программу</span
                      >
                      <p class="text-xs text-gray-600">
                        Сертификат на конкретную программу
                      </p>
                    </div>
                  </label>

                  <!-- Если выбран депозит -->
                  <div
                    v-if="purchaseData.certificate_type === 'deposit'"
                    class="space-y-3 mt-3"
                  >
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Сумма депозита
                      </label>
                      <!-- Пресеты сумм -->
                      <div class="grid grid-cols-3 gap-2 mb-3">
                        <button
                          v-for="preset in depositPresets"
                          :key="preset"
                          @click="purchaseData.amount = preset"
                          :class="[
                            'py-2 px-3 rounded-lg border transition-all text-sm font-medium',
                            purchaseData.amount === preset
                              ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white border-[#c2a886] shadow-md'
                              : 'bg-[#e3ded3] text-gray-700 border-[#c2a886]/20 hover:border-[#c2a886]/40',
                          ]"
                        >
                          {{ formatPrice(preset) }}
                        </button>
                      </div>
                      <!-- Своя сумма -->
                      <div class="relative">
                        <span
                          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          ₽
                        </span>
                        <input
                          type="number"
                          v-model="customAmount"
                          @input="updateCustomAmount"
                          placeholder="Другая сумма"
                          min="1000"
                          class="w-full pl-8 pr-4 py-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl text-sm focus:ring-2 focus:ring-[#c2a886] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Если выбрана программа -->
                  <div
                    v-if="purchaseData.certificate_type === 'program'"
                    class="space-y-3 mt-3"
                  >
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Выберите программу
                      </label>
                      <select
                        v-model="purchaseData.program_id"
                        @change="onProgramSelect"
                        class="w-full px-4 py-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl text-sm focus:ring-2 focus:ring-[#c2a886] focus:border-transparent outline-none"
                      >
                        <option value="">Выберите программу</option>
                        <option
                          v-for="program in authorPrograms"
                          :key="program.id"
                          :value="program.id"
                        >
                          {{ program.name }} —
                          {{ getProgramPriceRange(program) }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Шаг 2: Выбор формата -->
              <div class="space-y-3">
                <h4 class="font-semibold text-gray-900 text-[15px]">
                  Формат сертификата
                </h4>
                <div class="space-y-2">
                  <label
                    class="flex items-center justify-between p-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl hover:bg-[#d9cebc] cursor-pointer transition-colors"
                  >
                    <div class="flex items-center space-x-3">
                      <input
                        type="radio"
                        v-model="purchaseData.format"
                        value="electronic"
                        class="text-[#c2a886] focus:ring-[#c2a886]"
                      />
                      <div>
                        <span class="font-medium text-gray-900 text-sm"
                          >Электронный</span
                        >
                        <p class="text-xs text-gray-600">
                          Отправим на email или в Telegram
                        </p>
                      </div>
                    </div>
                    <span class="font-medium text-gray-900 text-sm"
                      >Бесплатно</span
                    >
                  </label>

                  <label
                    class="flex items-center justify-between p-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl hover:bg-[#d9cebc] cursor-pointer transition-colors"
                  >
                    <div class="flex items-center space-x-3">
                      <input
                        type="radio"
                        v-model="purchaseData.format"
                        value="printed"
                        class="text-[#c2a886] focus:ring-[#c2a886]"
                      />
                      <div>
                        <span class="font-medium text-gray-900 text-sm"
                          >Печатный</span
                        >
                        <p class="text-xs text-gray-600">
                          Красивый подарочный сертификат
                        </p>
                      </div>
                    </div>
                    <span class="font-medium text-gray-900 text-sm"
                      >+500 руб.</span
                    >
                  </label>
                </div>
              </div>

              <!-- Шаг 3: Данные получателя -->
              <div class="space-y-3">
                <h4 class="font-semibold text-gray-900 text-[15px]">
                  Данные получателя
                </h4>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Имя получателя *
                  </label>
                  <input
                    type="text"
                    v-model="purchaseData.recipient_name"
                    placeholder="Имя человека, кому дарите сертификат"
                    class="w-full px-4 py-3 bg-[#e3ded3] border border-[#c2a886]/20 rounded-xl text-sm focus:ring-2 focus:ring-[#c2a886] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <!-- Итоговая сумма -->
              <div
                class="bg-[#d9cebc]/60 rounded-xl p-4 border border-[#c2a886]/30"
              >
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-700"
                      >Стоимость сертификата:</span
                    >
                    <span class="font-medium text-gray-900 text-sm">
                      {{ getCertificateAmountLabel() }}
                    </span>
                  </div>
                  <div
                    v-if="purchaseData.format === 'printed'"
                    class="flex justify-between items-center"
                  >
                    <span class="text-sm text-gray-700">Печатный формат:</span>
                    <span class="font-medium text-gray-900 text-sm"
                      >+500 руб.</span
                    >
                  </div>
                  <div
                    class="pt-2 border-t border-[#c2a886]/30 flex justify-between items-center"
                  >
                    <span class="font-bold text-gray-900">Итого:</span>
                    <span class="font-bold text-base text-gray-900">
                      {{ getTotalAmountLabel() }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Кнопка отправки -->
              <button
                @click="submitPurchase"
                :disabled="!isFormValid || isSubmitting"
                class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <Loader2
                  v-if="isSubmitting"
                  class="h-5 w-5 mr-2 animate-spin"
                />
                <span class="text-[15px]">{{
                  isSubmitting ? "Отправка..." : "Оформить покупку"
                }}</span>
              </button>

              <p class="text-xs text-gray-600 text-center">
                После оплаты сертификат будет отправлен вам в течение 24 часов
              </p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { certificateAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "CertificatePurchaseModal",
  components: {
    ...icons,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    certificate: {
      type: Object,
      default: null,
    },
    branchId: {
      type: Number,
      required: false,
    },
    authorPrograms: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isSubmitting: false,
      purchaseData: {
        certificate_type: "deposit",
        format: "electronic",
        amount: 5000,
        program_id: null,
        recipient_name: "",
      },
      customAmount: "",
      depositPresets: [3000, 5000, 10000, 15000, 20000, 30000],
    };
  },
  computed: {
    ...mapState(useAppStore, ["user"]),

    userHasRequiredData() {
      return !!(this.user?.first_name && this.user?.phone);
    },

    isFormValid() {
      return (
        this.userHasRequiredData &&
        this.purchaseData.certificate_type &&
        this.purchaseData.format &&
        this.purchaseData.recipient_name.trim() &&
        ((this.purchaseData.certificate_type === "deposit" &&
          this.purchaseData.amount > 0) ||
          (this.purchaseData.certificate_type === "program" &&
            this.purchaseData.program_id))
      );
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

    closeModal() {
      this.$emit("update:visible", false);
      this.$emit("close");
      this.unlockBodyScroll();

      setTimeout(() => {
        this.resetForm();
      }, 300);
    },

    resetForm() {
      this.purchaseData = {
        certificate_type: "deposit",
        format: "electronic",
        amount: 5000,
        program_id: null,
        recipient_name: "",
      };
      this.customAmount = "";
      this.isSubmitting = false;
    },

    goToProfile() {
      this.closeModal();
      this.$router.push("/profile");
    },

    formatPrice(price) {
      if (!price && price !== 0) return "0";
      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;
      return priceNumber.toLocaleString("ru-RU");
    },

    updateCustomAmount() {
      const amount = parseInt(this.customAmount);
      if (!isNaN(amount) && amount > 0) {
        this.purchaseData.amount = amount;
      }
    },

    onProgramSelect() {
      if (this.purchaseData.program_id) {
        const program = this.authorPrograms.find(
          (p) => p.id === this.purchaseData.program_id
        );
        if (program) {
          this.purchaseData.amount = program.price;
        }
      }
    },

    getProgramPriceRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        return "Цена не указана";
      }

      const activeTiers = program.pricing_tiers.filter(
        (tier) => tier.is_active !== false
      );
      if (activeTiers.length === 0) return "Цена не указана";

      const prices = activeTiers.map((tier) => tier.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return `${this.formatPrice(minPrice)} руб.`;
      } else {
        return `${this.formatPrice(minPrice)} - ${this.formatPrice(maxPrice)} руб.`;
      }
    },

    getCertificateAmount() {
      if (this.purchaseData.certificate_type === "program") {
        const program = this.authorPrograms.find(
          (p) => p.id === this.purchaseData.program_id
        );
        return program ? program.price : 0;
      }
      return this.purchaseData.amount || 0;
    },

    getTotalAmount() {
      let total = this.getCertificateAmount();
      if (this.purchaseData.format === "printed") {
        total += 500;
      }
      return total;
    },

    getCertificateAmountLabel() {
      const amount = this.getCertificateAmount();

      if (
        this.purchaseData.certificate_type === "program" &&
        this.purchaseData.program_id
      ) {
        const program = this.authorPrograms.find(
          (p) => p.id === this.purchaseData.program_id
        );

        if (
          program &&
          program.pricing_tiers &&
          program.pricing_tiers.length > 0
        ) {
          const activeTiers = program.pricing_tiers.filter(
            (tier) => tier.is_active !== false
          );

          if (activeTiers.length > 0) {
            const prices = activeTiers.map((tier) => tier.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            if (minPrice !== maxPrice) {
              return `от ${this.formatPrice(amount)} руб.`;
            }
          }
        }
      }

      return `${this.formatPrice(amount)} руб.`;
    },

    getTotalAmountLabel() {
      const total = this.getTotalAmount();

      if (
        this.purchaseData.certificate_type === "program" &&
        this.purchaseData.program_id
      ) {
        const program = this.authorPrograms.find(
          (p) => p.id === this.purchaseData.program_id
        );

        if (
          program &&
          program.pricing_tiers &&
          program.pricing_tiers.length > 0
        ) {
          const activeTiers = program.pricing_tiers.filter(
            (tier) => tier.is_active !== false
          );

          if (activeTiers.length > 0) {
            const prices = activeTiers.map((tier) => tier.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            if (minPrice !== maxPrice) {
              return `от ${this.formatPrice(total)} руб.`;
            }
          }
        }
      }

      return `${this.formatPrice(total)} руб.`;
    },

    async submitPurchase() {
      try {
        if (!this.isFormValid) {
          alert("Пожалуйста, заполните все обязательные поля");
          return;
        }

        if (!this.userHasRequiredData) {
          alert("Заполните данные профиля для покупки");
          return;
        }

        this.isSubmitting = true;

        const buyerName = this.user?.first_name
          ? `${this.user.first_name} ${this.user.last_name || ""}`.trim()
          : "";

        const buyerPhone = this.user?.phone || "";
        const userId = this.user?.id || 0;
        const username = this.user?.username || null;

        const requestData = {
          user_id: userId,
          certificate_type: this.purchaseData.certificate_type,
          format: this.purchaseData.format,
          amount: this.getCertificateAmount(),
          recipient_name: this.purchaseData.recipient_name.trim(),
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
        };

        if (username) {
          requestData.username = username;
        }

        if (
          this.purchaseData.certificate_type === "program" &&
          this.purchaseData.program_id
        ) {
          requestData.program_id = this.purchaseData.program_id;
        }

        console.log("Отправка данных покупки сертификата:", requestData);

        const response = await certificateAPI.purchase(requestData);

        if (response) {
          console.log("Сертификат оформлен:", response);
          alert(
            "Заявка на сертификат успешно отправлена! Мы свяжемся с вами для подтверждения."
          );
          this.$emit("purchase-complete");
          this.closeModal();
        } else {
          throw new Error("Ошибка при оформлении покупки");
        }
      } catch (error) {
        console.error("Ошибка при покупке сертификата:", error);
        alert(
          error.message ||
            "Произошла ошибка. Пожалуйста, попробуйте еще раз или позвоните нам."
        );
      } finally {
        this.isSubmitting = false;
      }
    },
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.lockBodyScroll();
        this.$nextTick(() => {
          this.resetForm();
        });
      } else {
        this.unlockBodyScroll();
      }
    },
  },

  mounted() {
    if (this.visible) {
      this.lockBodyScroll();
    }

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
input[type="number"],
select {
  caret-color: #c2a886;
  color: #111827;
}

input::placeholder {
  color: #9ca3af;
}

input:focus,
select:focus {
  outline: none;
}

/* Радио кнопки */
input[type="radio"] {
  width: 1.25rem;
  height: 1.25rem;
}

/* Предотвращаем zoom на iOS */
@media screen and (max-width: 640px) {
  input[type="text"],
  input[type="number"],
  select {
    font-size: 16px;
  }
}
</style>
