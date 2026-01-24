<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-4"
  >
    <div
      class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6 space-y-4">
        <!-- Заголовок -->
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-semibold text-gray-900">
            Детали бронирования #{{ booking?.id }}
          </h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div v-if="booking" class="space-y-4">
          <!-- Информация о клиенте -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 class="font-semibold text-gray-900">Клиент</h4>
            <div class="space-y-1 text-sm">
              <p>
                <span class="font-medium">Имя:</span> {{ booking.contact_name }}
              </p>
              <p>
                <span class="font-medium">Телефон:</span>
                {{ booking.contact_phone }}
              </p>
              <p v-if="booking.user">
                <span class="font-medium">Telegram ID:</span>
                {{ booking.user.telegram_id }}
              </p>
            </div>
          </div>

          <!-- Информация о программе -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 class="font-semibold text-gray-900">Программа</h4>
            <div class="space-y-1 text-sm">
              <p>
                <span class="font-medium">Тип:</span>
                {{ getProgramTypeName(booking.program_type) }}
              </p>
              <p v-if="booking.program">
                <span class="font-medium">Название:</span>
                {{ booking.program.name }}
              </p>
              <p v-if="booking.event">
                <span class="font-medium">Событие:</span>
                {{ booking.event.title }}
              </p>
            </div>
          </div>

          <!-- Дата и время -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 class="font-semibold text-gray-900">Дата и время</h4>
            <div class="space-y-1 text-sm">
              <p>
                <span class="font-medium">Дата:</span>
                {{ formatDate(booking.booking_date) }}
              </p>
              <p v-if="booking.booking_time">
                <span class="font-medium">Время:</span>
                {{ booking.booking_time }}
              </p>
            </div>
          </div>

          <!-- Участники и статус -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 class="font-semibold text-gray-900">Дополнительно</h4>
            <div class="space-y-1 text-sm">
              <p>
                <span class="font-medium">Участники:</span>
                {{ booking.participants_count }}
              </p>
              <p class="flex items-center">
                <span class="font-medium">Статус:</span>
                <span
                  :class="getStatusClass(localStatus)"
                  class="ml-2 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getStatusName(localStatus) }}
                </span>
              </p>
              <p v-if="booking.promo_code">
                <span class="font-medium">Промокод:</span>
                {{ booking.promo_code }}
              </p>
              <p v-if="booking.discount_percent">
                <span class="font-medium">Скидка:</span>
                {{ booking.discount_percent }}%
              </p>
            </div>
          </div>

          <!-- Комментарии -->
          <div
            v-if="booking.comment"
            class="bg-gray-50 rounded-lg p-4 space-y-2"
          >
            <h4 class="font-semibold text-gray-900">Комментарий</h4>
            <p class="text-sm text-gray-700">{{ booking.comment }}</p>
          </div>

          <!-- Дополнительные опции -->
          <div
            v-if="
              booking.additional_services &&
              booking.additional_services.length > 0
            "
            class="bg-gray-50 rounded-lg p-4 space-y-2"
          >
            <h4 class="font-semibold text-gray-900">Дополнительные услуги</h4>
            <ul class="list-disc list-inside text-sm space-y-1">
              <li
                v-for="(service, index) in booking.additional_services"
                :key="index"
                class="text-gray-700"
              >
                {{ service }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Статус -->
        <div class="space-y-3">
          <h4 class="font-semibold text-gray-900">Статус бронирования</h4>
          <div class="space-y-3">
            <select
              v-model="localStatus"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent"
            >
              <option value="PENDING">Ожидает подтверждения</option>
              <option value="CONFIRMED">Подтверждено</option>
              <option value="CANCELLED">Отменено</option>
              <option value="COMPLETED">Завершено</option>
            </select>
            <button
              @click="updateStatus"
              class="w-full bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 shadow-sm active:scale-98"
            >
              Сохранить статус
            </button>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="pt-4">
          <button
            @click="closeModal"
            class="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-4 px-4 rounded-xl border border-gray-200 transition-all duration-200 active:scale-98"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "BookingDetailsModal",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    booking: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "confirmed", "cancelled"],
  data() {
    return {
      localStatus: this.booking?.status || "",
    };
  },
  watch: {
    booking(newBooking) {
      if (newBooking) {
        this.localStatus = newBooking.status;
      }
    },
  },
  methods: {
    ...mapActions(useAppStore, ["updateBookingStatus"]),

    closeModal() {
      this.$emit("close");
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU");
    },

    getProgramTypeName(type) {
      const types = {
        bachelor: "Мальчишник",
        bachelorette: "Девичники",
        collective: "Коллективная",
        author: "Авторская",
        club_event: "Клубное мероприятие",
      };
      return types[type] || type;
    },

    getStatusName(status) {
      const statuses = {
        PENDING: "Ожидает",
        CONFIRMED: "Подтверждено",
        CANCELLED: "Отменено",
        COMPLETED: "Завершено",
      };
      return statuses[status] || status;
    },

    getStatusClass(status) {
      const classes = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        COMPLETED: "bg-blue-100 text-blue-800",
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    },

    async updateStatus() {
      if (!this.booking || !this.localStatus) return;

      try {
        // Обновляем статус бронирования
        await this.updateBookingStatus(this.booking.id, this.localStatus);

        // В зависимости от нового статуса, вызываем соответствующее событие
        if (this.localStatus === "CONFIRMED") {
          this.$emit("confirmed", this.booking.id);
        } else if (this.localStatus === "CANCELLED") {
          this.$emit("cancelled", this.booking.id);
        }

        // Обновляем статус в родительском компоненте
        this.booking.status = this.localStatus;
      } catch (error) {
        console.error("Ошибка при обновлении статуса бронирования:", error);
      }
    },
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
