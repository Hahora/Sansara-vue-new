<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-3"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-xl w-full max-w-xs max-h-[70vh] overflow-y-auto"
    >
      <!-- Шапка -->
      <div
        class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-3 py-2 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-base">Редактировать сертификат</h2>
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors"
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
        <p class="text-xs text-white text-opacity-90 mt-0.5">
          ID: {{ certificate.id
          }}<span
            v-if="certificate.username && certificate.username !== 'unknown'"
          >
            • @{{ certificate.username }}</span
          >
        </p>
      </div>

      <!-- Форма -->
      <form @submit.prevent="saveCertificate" class="p-3 space-y-2">
        <!-- Тип сертификата -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Тип сертификата
          </label>
          <select
            v-model="formData.certificate_type"
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          >
            <option value="program">На программу</option>
            <option value="deposit">Депозитный</option>
          </select>
        </div>

        <!-- Формат -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Формат
          </label>
          <select
            v-model="formData.format"
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          >
            <option value="physical">Физический</option>
            <option value="electronic">Электронный</option>
          </select>
        </div>

        <!-- Сумма -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Сумма (₽) <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="formData.amount"
            type="number"
            min="0"
            step="100"
            required
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            placeholder="Введите сумму"
          />
        </div>

        <!-- ID программы -->
        <div v-if="formData.certificate_type === 'program'">
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Программа
          </label>
          <select
            v-model.number="formData.program_id"
            @change="onProgramSelect"
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          >
            <option :value="null">Выберите программу</option>
            <option
              v-for="program in authorPrograms"
              :key="program.id"
              :value="program.id"
            >
              {{ program.name }} — {{ getProgramPriceRange(program) }}
            </option>
          </select>
        </div>

        <!-- Получатель -->
        <div class="pt-1.5 border-t border-gray-200">
          <h3 class="text-xs font-semibold text-gray-900 mb-1.5">Получатель</h3>

          <div class="space-y-1.5">
            <input
              v-model="formData.recipient_name"
              type="text"
              class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Имя получателя"
            />
            <input
              v-model="formData.recipient_phone"
              type="tel"
              class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="+7 900 123-45-67"
            />
          </div>
        </div>

        <!-- Покупатель -->
        <div class="pt-1.5 border-t border-gray-200">
          <h3 class="text-xs font-semibold text-gray-900 mb-1.5">Покупатель</h3>

          <div class="space-y-1.5">
            <input
              v-model="formData.buyer_name"
              type="text"
              class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="Имя покупателя"
            />
            <input
              v-model="formData.buyer_phone"
              type="tel"
              class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="+7 900 123-45-67"
            />
          </div>
        </div>

        <!-- Ошибка -->
        <div
          v-if="error"
          class="bg-red-50 border-l-4 border-red-500 rounded-r p-2"
        >
          <p class="text-xs text-red-800">{{ error }}</p>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-2 pt-0.5">
          <button
            @click="$emit('close')"
            type="button"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-2 rounded-lg text-xs transition-all active:scale-98"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isSaving || !formData.amount"
            class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-1.5 px-2 rounded-lg text-xs transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
          >
            <span v-if="!isSaving">Сохранить</span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin h-3 w-3 mr-1"
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
import { certificateAPI, programAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "EditCertificateModal",
  props: {
    certificate: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isSaving: false,
      error: null,
      formData: {
        certificate_type: this.certificate.certificate_type || "program",
        format: this.certificate.format || "electronic",
        amount: this.certificate.amount || 0,
        program_id: this.certificate.program_id || null,
        recipient_name: this.certificate.recipient_name || "",
        recipient_phone: this.certificate.recipient_phone || "",
        buyer_name: this.certificate.buyer_name || "",
        buyer_phone: this.certificate.buyer_phone || "",
      },
      authorPrograms: [], // Список программ для выбора
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch"]),
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

    // Загрузка авторских программ
    async loadAuthorPrograms() {
      try {
        const branchId = this.selectedBranch?.id;
        if (!branchId) {
          console.log("Филиал не выбран, пропускаем загрузку программ");
          return;
        }

        console.log("Загрузка авторских программ для филиала:", branchId);

        const data = await programAPI.getAuthor(branchId);

        if (data && Array.isArray(data.programs)) {
          this.authorPrograms = data.programs
            .filter((program) => program.is_active !== false)
            .map((program) => ({
              ...program,
              price: this.getProgramPrice(program),
            }));

          console.log("Загружено программ:", this.authorPrograms.length);
        } else {
          this.authorPrograms = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке программ:", error);
        this.authorPrograms = [];
      }
    },

    // Получение минимальной цены программы
    getProgramPrice(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        return 0;
      }
      const activeTiers = program.pricing_tiers.filter(
        (tier) => tier.is_active !== false
      );
      if (activeTiers.length === 0) return 0;

      const minPrice = Math.min(...activeTiers.map((tier) => tier.price));
      return minPrice;
    },

    // Форматирование диапазона цен
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

    // Форматирование цены
    formatPrice(price) {
      if (!price && price !== 0) return "0";
      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;
      return priceNumber.toLocaleString("ru-RU");
    },

    // Обработка выбора программы
    onProgramSelect() {
      if (this.formData.program_id) {
        const program = this.authorPrograms.find(
          (p) => p.id === this.formData.program_id
        );
        if (program) {
          this.formData.amount = program.price;
        }
      }
    },

    async saveCertificate() {
      try {
        this.isSaving = true;
        this.error = null;

        console.log("Сохранение сертификата:", this.formData);

        // Подготавливаем данные для отправки
        const updateData = { ...this.formData };

        // Если тип не "program", удаляем program_id
        if (updateData.certificate_type !== "program") {
          updateData.program_id = null;
        }

        // Преобразуем пустые строки в null
        Object.keys(updateData).forEach((key) => {
          if (updateData[key] === "") {
            updateData[key] = null;
          }
        });

        const updatedCertificate = await certificateAPI.adminUpdate(
          this.certificate.id,
          updateData
        );

        console.log("Сертификат обновлен:", updatedCertificate);

        this.$emit("saved", updatedCertificate);
        this.$emit("close");
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
        this.error = error.message || "Не удалось сохранить изменения";
      } finally {
        this.isSaving = false;
      }
    },
  },

  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.lockBodyScroll();
      } else {
        this.unlockBodyScroll();
      }
    },
  },

  async mounted() {
    // Блокируем прокрутку при монтировании
    if (this.isOpen) {
      this.lockBodyScroll();
    }

    // Добавляем обработчик клавиши Escape
    const handleEscape = (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.$emit("close");
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Сохраняем ссылку на обработчик для удаления
    this.handleEscapeKey = handleEscape;

    // Загружаем программы при открытии модалки
    await this.loadAuthorPrograms();
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
