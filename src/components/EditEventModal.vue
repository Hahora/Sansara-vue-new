<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-3"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-xl w-full max-w-xs max-h-[80vh] overflow-y-auto"
    >
      <!-- Шапка -->
      <div
        class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-3 py-2 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-base">Редактировать событие</h2>
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
          ID: {{ event.id }}
        </p>
      </div>

      <!-- Форма -->
      <form @submit.prevent="saveEvent" class="p-3 space-y-2">
        <!-- Название -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Название <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            placeholder="Название события"
          />
        </div>

        <!-- Event Key (Тип события) -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Тип события <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.event_key"
            required
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          >
            <option value="">Выберите тип</option>
            <option value="BACHELOR">Коллективная баня</option>
            <option value="BACHELORETTE">ДЕВИЧНИК</option>
            <option value="BATH_CLUB">БАННЫЙ КЛУБ С. ХАЧАТУРЬЯН</option>
            <option value="BUSINESS_BATH">Бизнес-баня МОСТ</option>
          </select>
        </div>

        <!-- Описание -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Описание
          </label>
          <textarea
            v-model="formData.description"
            rows="2"
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none resize-none"
            placeholder="Описание события"
          ></textarea>
        </div>

        <!-- Филиал -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Филиал <span class="text-red-500">*</span>
          </label>
          <select
            v-model.number="formData.branch_id"
            required
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          >
            <option :value="null">Выберите филиал</option>
            <option
              v-for="branch in branches"
              :key="branch.id"
              :value="branch.id"
            >
              {{ branch.name }}
            </option>
          </select>
        </div>

        <!-- Дата и время начала -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Дата и время начала <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.start_date"
            type="datetime-local"
            required
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          />
        </div>

        <!-- Длительность -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-0.5">
            Длительность (минуты)
          </label>
          <input
            v-model.number="formData.duration_minutes"
            type="number"
            min="0"
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
            placeholder="120"
          />
        </div>

        <!-- Управление местами -->
        <div class="pt-1.5 border-t border-gray-200">
          <h3 class="text-xs font-semibold text-gray-900 mb-2">
            👥 Управление местами
          </h3>

          <!-- Максимум участников -->
          <div class="mb-2">
            <label class="block text-xs font-medium text-gray-700 mb-0.5">
              Максимум участников
            </label>
            <input
              v-model.number="formData.max_participants"
              type="number"
              min="0"
              class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="10"
            />
          </div>

          <!-- Занято мест -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-0.5">
              Занято мест
            </label>
            <input
              v-model.number="formData.occupied_slots"
              type="number"
              min="0"
              :max="formData.max_participants || 999"
              class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              placeholder="0"
            />
            <p class="text-xs text-gray-500 mt-1">
              Используйте "Управление местами" для изменения через +1/-1
            </p>
          </div>
        </div>

        <!-- Повторяющееся событие -->
        <div class="pt-1.5 border-t border-gray-200">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-xs font-semibold text-gray-900">
              Повторяющееся событие
            </h3>
            <button
              type="button"
              @click="
                formData.recurring_day_of_week =
                  formData.recurring_day_of_week === null ? 0 : null
              "
              class="text-xs"
            >
              <span v-if="formData.recurring_day_of_week === null"
                >Включить</span
              >
              <span v-else class="text-red-600">Отключить</span>
            </button>
          </div>

          <div v-if="formData.recurring_day_of_week !== null" class="space-y-1">
            <!-- День недели -->
            <div>
              <label class="block text-xs text-gray-600 mb-0.5"
                >День недели</label
              >
              <select
                v-model.number="formData.recurring_day_of_week"
                class="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4e5d51] outline-none"
              >
                <option value="0">Понедельник</option>
                <option value="1">Вторник</option>
                <option value="2">Среда</option>
                <option value="3">Четверг</option>
                <option value="4">Пятница</option>
                <option value="5">Суббота</option>
                <option value="6">Воскресенье</option>
              </select>
            </div>

            <!-- Время -->
            <div>
              <label class="block text-xs text-gray-600 mb-0.5"
                >Время (HH:MM)</label
              >
              <input
                v-model="formData.recurring_time"
                type="time"
                class="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4e5d51] outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Активно -->
        <div class="flex items-center pt-1">
          <input
            v-model="formData.is_active"
            type="checkbox"
            id="is_active_edit"
            class="w-4 h-4 text-[#4e5d51] border-gray-300 rounded focus:ring-[#4e5d51]"
          />
          <label for="is_active_edit" class="ml-2 text-xs text-gray-700">
            Событие активно
          </label>
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
            :disabled="isSaving"
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
import { eventCalendarAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "EditEventModal",
  props: {
    event: {
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
        title: this.event.title || "",
        event_key: this.event.event_key || "",
        description: this.event.description || "",
        branch_id: this.event.branch_id || null,
        start_date: this.formatDateTimeForInput(this.event.start_date),
        duration_minutes: this.event.duration_minutes || 120,
        max_participants: this.event.max_participants || 10,
        occupied_slots: this.event.occupied_slots || 0,
        recurring_day_of_week:
          this.event.recurring_day_of_week !== undefined
            ? this.event.recurring_day_of_week
            : null,
        recurring_time: this.event.recurring_time || "19:00",
        is_active: this.event.is_active !== false,
      },
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),
  },
  methods: {
    formatDateTimeForInput(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    },

    async saveEvent() {
      try {
        this.isSaving = true;
        this.error = null;

        console.log("Сохранение события:", this.formData);

        const updateData = { ...this.formData };

        Object.keys(updateData).forEach((key) => {
          if (updateData[key] === "") {
            updateData[key] = null;
          }
        });

        if (updateData.recurring_day_of_week === null) {
          updateData.recurring_time = null;
        }

        if (updateData.start_date) {
          updateData.start_date = new Date(updateData.start_date).toISOString();
        }

        const updatedEvent = await eventCalendarAPI.adminUpdate(
          this.event.id,
          updateData
        );

        console.log("Событие обновлено:", updatedEvent);

        this.$emit("saved", updatedEvent);
        this.$emit("close");
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
        this.error = error.message || "Не удалось сохранить изменения";
      } finally {
        this.isSaving = false;
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
