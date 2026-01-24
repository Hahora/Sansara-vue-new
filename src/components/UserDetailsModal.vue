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
          <h2 class="font-bold text-base">Детали пользователя</h2>
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
          ID: {{ user.id }}
        </p>
      </div>

      <!-- Контент -->
      <div class="p-3 space-y-4">
        <!-- Аватар и основная информация -->
        <div class="flex items-center space-x-3">
          <!-- Аватар -->
          <div
            v-if="user.avatar_url"
            class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300"
          >
            <img
              :src="user.avatar_url"
              :alt="user.first_name"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold border-2 border-white"
          >
            {{ user.first_name?.charAt(0) || "?" }}
          </div>

          <!-- Имя и Telegram -->
          <div>
            <h3 class="text-lg font-bold text-gray-900">
              {{ user.first_name }} {{ user.last_name }}
            </h3>
            <div class="flex items-center space-x-2 mt-1">
              <div class="flex items-center text-sm text-gray-600">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M18.384 4.318a2.036 2.036 0 00-1.592-.504L3.828 6.848a1.543 1.543 0 00-1.138 1.865l1.22 4.56a2.036 2.036 0 001.592 1.504l2.536.422 1.204 3.682a.542.542 0 00.86.268l2.128-1.704 3.65 2.68c.36.264.828.228 1.146-.096l1.896-1.896a1.036 1.036 0 00.096-1.146L15.45 13.65l3.682-1.204a2.036 2.036 0 001.504-1.592l.422-2.536a1.543 1.543 0 00-1.865-1.138l-4.56 1.22-9.366-3.146a2.036 2.036 0 00-1.592.504L2.512 5.83a1.036 1.036 0 00.268 1.62l3.146 1.054 1.22 4.56a1.543 1.543 0 001.865 1.138l4.56-1.22 3.146 1.054a2.036 2.036 0 001.62-.268l1.704-1.704a1.036 1.036 0 00-.268-1.62l-1.054-3.146 4.56-1.22a1.543 1.543 0 001.138-1.865l-1.22-4.56z"
                  />
                </svg>
                {{ user.telegram_id }}
              </div>
              <div
                v-if="user.username"
                class="text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
              >
                @{{ user.username }}
              </div>
            </div>
          </div>
        </div>

        <!-- Контактная информация -->
        <div class="space-y-2">
          <h4 class="text-sm font-semibold text-gray-700 border-b pb-1">
            Контактная информация
          </h4>

          <div class="space-y-1.5">
            <!-- Телефон -->
            <div
              v-if="user.phone"
              class="flex items-center text-sm text-gray-600"
            >
              <svg
                class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                />
              </svg>
              <span class="font-medium">Телефон:</span>
              <span class="ml-1">{{ user.phone }}</span>
            </div>

            <!-- Дата рождения -->
            <div
              v-if="user.date_of_birth"
              class="flex items-center text-sm text-gray-600"
            >
              <svg
                class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="font-medium">Дата рождения:</span>
              <span class="ml-1">
                {{ formatDate(user.date_of_birth) }}
                ({{ calculateAge(user.date_of_birth) }} лет)
              </span>
            </div>

            <!-- Пол -->
            <div
              v-if="user.gender"
              class="flex items-center text-sm text-gray-600"
            >
              <svg
                class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="font-medium">Пол:</span>
              <span class="ml-1">
                {{ user.gender === "MALE" ? "Мужской" : "Женский" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Статистика бронирований (ТОЛЬКО ЗДЕСЬ) -->
        <div class="space-y-2">
          <h4 class="text-sm font-semibold text-gray-700 border-b pb-1">
            Статистика бронирований
          </h4>

          <div class="grid grid-cols-3 gap-2">
            <div class="bg-gray-50 rounded-lg p-2 text-center">
              <div class="text-lg font-bold text-gray-900">
                {{ user.bookings_count || 0 }}
              </div>
              <div class="text-xs text-gray-500">Всего</div>
            </div>
            <div class="bg-green-50 rounded-lg p-2 text-center">
              <div class="text-lg font-bold text-green-600">
                {{ user.confirmed_bookings_count || 0 }}
              </div>
              <div class="text-xs text-gray-500">Подтверждено</div>
            </div>
            <div class="bg-red-50 rounded-lg p-2 text-center">
              <div class="text-lg font-bold text-red-600">
                {{ user.cancelled_bookings_count || 0 }}
              </div>
              <div class="text-xs text-gray-500">Отменено</div>
            </div>
          </div>
        </div>

        <!-- Статусы -->
        <div class="space-y-2">
          <h4 class="text-sm font-semibold text-gray-700 border-b pb-1">
            Статусы
          </h4>

          <div class="flex flex-wrap gap-2">
            <span
              v-if="user.admin"
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
            >
              Администратор
            </span>
            <span
              v-if="user.is_blocked"
              class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
            >
              Заблокирован
            </span>
            <span
              v-if="user.is_first_visit"
              class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
            >
              Первый визит
            </span>
          </div>

          <!-- Причина блокировки -->
          <div
            v-if="user.is_blocked && user.block_reason"
            class="mt-2 pt-2 border-t border-red-100"
          >
            <p class="text-xs text-red-600">
              <span class="font-medium">Причина блокировки:</span>
              {{ user.block_reason }}
            </p>
          </div>
        </div>

        <!-- Даты -->
        <div class="space-y-1 text-xs text-gray-500">
          <div class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
            Зарегистрирован: {{ formatDateTime(user.created_at) }}
          </div>
          <div class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd"
              />
            </svg>
            Обновлён: {{ formatDateTime(user.updated_at) }}
          </div>
        </div>

        <!-- Кнопки -->
        <div class="pt-3 border-t border-gray-200">
          <button
            @click="$emit('close')"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg text-sm transition-all active:scale-98"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserDetailsModal",
  props: {
    user: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    formatDateTime(dateString) {
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

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    calculateAge(dateOfBirth) {
      if (!dateOfBirth) return "";
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },
  },
};
</script>
