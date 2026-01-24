<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] overflow-y-auto">
    <!-- Оверлей -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click.self="close"></div>

    <!-- Контейнер для центрирования -->
    <div class="flex items-center justify-center min-h-screen p-4">
      <!-- Модальное окно -->
      <div
        class="relative bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col z-[101] shadow-2xl"
      >
        <!-- Шапка -->
        <div
          class="sticky top-0 bg-gradient-to-r from-[#4e5d51] to-[#5a6d5e] text-white px-4 py-3 rounded-t-xl z-10"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base">Создать новую рассылку</h3>
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
        <!-- Форма с прокруткой -->
        <div class="flex-1 overflow-y-auto p-4">
          <form @submit.prevent="createBroadcast" class="space-y-4">
            <!-- Заголовок -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                Заголовок рассылки *
              </label>
              <input
                v-model="formData.title"
                type="text"
                maxlength="200"
                required
                placeholder="Например: Важное объявление или Специальное предложение"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ formData.title.length }}/200 символов
              </p>
            </div>

            <!-- Сообщение -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-medium text-gray-700">
                  Сообщение *
                </label>
                <div class="text-xs text-gray-500">
                  {{ formData.message.length }}/4096 символов
                </div>
              </div>

              <!-- Панель форматирования -->
              <div
                class="mb-2 border border-gray-300 rounded-lg p-2 bg-gray-50"
              >
                <div class="flex flex-wrap gap-1">
                  <button
                    type="button"
                    @click="insertTag('<b>', '</b>')"
                    class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
                    title="Жирный текст"
                  >
                    <span class="font-bold text-gray-700">B</span>
                  </button>
                  <button
                    type="button"
                    @click="insertTag('<i>', '</i>')"
                    class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
                    title="Курсив"
                  >
                    <span class="italic text-gray-700">I</span>
                  </button>
                  <button
                    type="button"
                    @click="insertTag('<u>', '</u>')"
                    class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
                    title="Подчеркнутый"
                  >
                    <span class="underline text-gray-700">U</span>
                  </button>
                  <div class="flex-1"></div>
                  <button
                    type="button"
                    @click="showPreview = !showPreview"
                    :class="
                      showPreview
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-white text-gray-700'
                    "
                    class="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Предпросмотр
                  </button>
                </div>
              </div>

              <textarea
                ref="messageInput"
                v-model="formData.message"
                rows="6"
                maxlength="4096"
                required
                placeholder="Введите текст рассылки..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none resize-none font-mono bg-gray-50 text-gray-900 caret-gray-900"
                @keydown.tab.prevent="handleTabKey"
              ></textarea>

              <!-- Предпросмотр -->
              <div
                v-if="showPreview"
                class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div
                  class="text-xs text-gray-500 mb-1 flex justify-between items-center"
                >
                  <span>Предпросмотр:</span>
                  <span class="text-xs"
                    >{{ formData.message.length }} символов</span
                  >
                </div>
                <div
                  class="text-sm text-gray-800"
                  v-html="formatPreview(formData.message)"
                ></div>
              </div>
            </div>

            <!-- Целевая аудитория -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-semibold text-gray-900 mb-3">
                Целевая аудитория
              </h4>

              <div class="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  @click="formData.target_users = 'all'"
                  :class="
                    formData.target_users === 'all'
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  "
                  class="p-3 border-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center"
                >
                  <svg
                    class="w-6 h-6 mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="font-semibold">Всем пользователям</span>
                  <span class="text-xs mt-1">Отправить всем</span>
                </button>

                <button
                  type="button"
                  @click="formData.target_users = 'selected'"
                  :class="
                    formData.target_users === 'selected'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  "
                  class="p-3 border-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center"
                >
                  <svg
                    class="w-6 h-6 mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="font-semibold">Выбранным пользователям</span>
                  <span class="text-xs mt-1">Выбрать конкретных</span>
                </button>
              </div>

              <!-- Выбор пользователей (если выбран "selected") -->
              <div
                v-if="formData.target_users === 'selected'"
                class="bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-medium text-blue-900">
                    Выберите пользователей
                  </label>
                  <button
                    type="button"
                    @click="toggleSelectAllUsers"
                    class="text-xs text-blue-700 hover:text-blue-900"
                  >
                    {{
                      selectedUsers.length === users.length
                        ? "Сбросить всех"
                        : "Выбрать всех"
                    }}
                  </button>
                </div>

                <!-- Поиск пользователей -->
                <div class="relative mb-3">
                  <input
                    v-model="userSearch"
                    @input="onUserSearchInput"
                    type="text"
                    placeholder="Поиск по имени или телефону..."
                    class="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <svg
                    class="absolute right-3 top-2.5 w-4 h-4 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <!-- Выбранные пользователи -->
                <div
                  v-if="selectedUsers.length > 0"
                  class="mb-3 bg-white border border-blue-100 rounded-lg p-2 max-h-32 overflow-y-auto"
                >
                  <div class="text-xs font-medium text-blue-800 mb-1">
                    Выбрано: {{ selectedUsers.length }}
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="user in selectedUsers.slice(0, 5)"
                      :key="user.id"
                      class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center"
                    >
                      {{ getUserDisplayName(user) }}
                      <button
                        @click.stop="removeUser(user.id)"
                        class="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                    <span
                      v-if="selectedUsers.length > 5"
                      class="text-xs text-blue-600 font-medium"
                    >
                      +{{ selectedUsers.length - 5 }} пользователей
                    </span>
                  </div>
                </div>

                <!-- Список пользователей -->
                <div
                  v-if="filteredUsers.length > 0"
                  class="border border-blue-100 rounded-lg max-h-40 overflow-y-auto"
                >
                  <div
                    v-for="user in filteredUsers"
                    :key="user.id"
                    class="flex items-center px-3 py-2 hover:bg-blue-50 border-b border-blue-50 last:border-b-0"
                  >
                    <input
                      v-model="selectedUsers"
                      :value="user"
                      type="checkbox"
                      :id="'user_' + user.id"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                    />
                    <label
                      :for="'user_' + user.id"
                      class="ml-2 flex-1 cursor-pointer"
                    >
                      <div class="text-sm font-medium text-gray-900">
                        {{ getUserFullName(user) }}
                      </div>
                      <div class="text-xs text-gray-500">
                        ID: {{ user.id }} • {{ user.phone || "Без телефона" }}
                      </div>
                    </label>
                  </div>
                </div>
                <div v-else class="text-center py-4 text-sm text-gray-500">
                  Пользователи не найдены
                </div>
              </div>
            </div>

            <!-- Расписание -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-semibold text-gray-900 mb-3">
                Расписание отправки
              </h4>

              <div class="grid grid-cols-2 gap-3 mb-3">
                <!-- Черновик -->
                <button
                  type="button"
                  @click="setAsDraft"
                  :class="
                    !formData.scheduled_at
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  "
                  class="p-3 border-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center"
                >
                  <svg
                    class="w-6 h-6 mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="font-semibold">Черновик</span>
                  <span class="text-xs mt-1">Отправить вручную позже</span>
                </button>

                <!-- Запланировать -->
                <button
                  type="button"
                  @click="setAsScheduled"
                  :class="
                    formData.scheduled_at
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  "
                  class="p-3 border-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center"
                >
                  <svg
                    class="w-6 h-6 mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="font-semibold">Запланировать</span>
                  <span class="text-xs mt-1">Автоматическая отправка</span>
                </button>
              </div>

              <!-- Выбор даты и времени -->
              <div v-if="formData.scheduled_at" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      Дата отправки
                    </label>
                    <input
                      v-model="scheduledDate"
                      type="date"
                      :min="getTodayDate()"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      Время отправки
                    </label>
                    <input
                      v-model="scheduledTime"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 text-blue-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-xs text-blue-700">
                      Рассылка будет отправлена автоматически
                      {{ formatScheduledDate() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ошибка -->
            <div
              v-if="error"
              class="bg-red-50 border-l-4 border-red-500 rounded-r p-3"
            >
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </form>
        </div>

        <!-- Кнопки -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div class="flex gap-3">
            <button
              type="button"
              @click="close"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm transition-all active:scale-98"
            >
              Отмена
            </button>
            <button
              type="button"
              @click="createBroadcast"
              :disabled="isCreating"
              class="flex-1 bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center active:scale-98 disabled:opacity-50"
            >
              <span v-if="!isCreating">
                {{
                  formData.scheduled_at ? "Запланировать" : "Создать черновик"
                }}
              </span>
              <span v-else class="flex items-center">
                <svg
                  class="animate-spin h-4 w-4 mr-2"
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
                {{ formData.scheduled_at ? "Планирование..." : "Создание..." }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { broadcastAPI } from "@/utils/api";
import { userAPI } from "@/utils/api";

export default {
  name: "CreateBroadcastModal",
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isCreating: false,
      error: null,
      formData: {
        title: "",
        message: "",
        target_users: "all",
        selected_user_ids: [],
        scheduled_at: null,
      },
      showPreview: false,
      cursorPosition: 0,

      // Для выбора пользователей
      users: [],
      userSearch: "",
      selectedUsers: [],

      // Для расписания
      scheduledDate: "",
      scheduledTime: "18:00",
    };
  },
  computed: {
    filteredUsers() {
      if (!this.userSearch.trim()) {
        return this.users;
      }
      const query = this.userSearch.toLowerCase().trim();
      return this.users.filter((user) => {
        const firstName = (user.first_name || "").toLowerCase();
        const lastName = (user.last_name || "").toLowerCase();
        const phone = (user.phone || "").toLowerCase();

        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          phone.includes(query) ||
          `${firstName} ${lastName}`.includes(query)
        );
      });
    },
  },
  watch: {
    "formData.scheduled_at"(newVal) {
      if (newVal) {
        // Если установлено расписание, парсим дату для полей ввода
        const date = new Date(newVal);
        this.scheduledDate = date.toISOString().split("T")[0];
        this.scheduledTime = date.toTimeString().slice(0, 5);
      } else {
        // Если черновик - очищаем поля
        this.scheduledDate = "";
        this.scheduledTime = "18:00";
      }
    },
    scheduledDate(newVal) {
      this.updateScheduledAt();
    },
    scheduledTime(newVal) {
      this.updateScheduledAt();
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },

    setAsDraft() {
      this.formData.scheduled_at = null;
      this.scheduledDate = "";
      this.scheduledTime = "18:00";
    },

    setAsScheduled() {
      // Устанавливаем завтра 18:00 по умолчанию
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);

      this.formData.scheduled_at = tomorrow.toISOString();
      this.scheduledDate = tomorrow.toISOString().split("T")[0];
      this.scheduledTime = "18:00";
    },

    async loadUsers() {
      try {
        const data = await userAPI.getAll();
        if (Array.isArray(data)) {
          this.users = data;
        }
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
      }
    },

    // Методы для выбора пользователей
    toggleSelectAllUsers() {
      if (this.selectedUsers.length === this.users.length) {
        this.selectedUsers = [];
      } else {
        this.selectedUsers = [...this.users];
      }
      this.updateSelectedUserIds();
    },

    removeUser(userId) {
      this.selectedUsers = this.selectedUsers.filter(
        (user) => user.id !== userId
      );
      this.updateSelectedUserIds();
    },

    updateSelectedUserIds() {
      this.formData.selected_user_ids = this.selectedUsers.map(
        (user) => user.id
      );
    },

    onUserSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        // Фильтрация происходит в computed
      }, 300);
    },

    getUserDisplayName(user) {
      const firstName = user.first_name || "";
      const lastName = user.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();

      if (fullName) {
        return fullName.split(" ")[0];
      } else if (user.username) {
        return `@${user.username.substring(0, 8)}`;
      } else {
        return `ID:${user.id}`;
      }
    },

    getUserFullName(user) {
      const firstName = user.first_name || "";
      const lastName = user.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();

      return fullName || "Без имени";
    },

    // Методы для форматирования
    insertTag(startTag, endTag) {
      const textarea = this.$refs.messageInput;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = this.formData.message.substring(start, end);

      if (selectedText) {
        const newText =
          this.formData.message.substring(0, start) +
          startTag +
          selectedText +
          endTag +
          this.formData.message.substring(end);

        this.formData.message = newText;

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + startTag.length + selectedText.length + endTag.length,
            start + startTag.length + selectedText.length + endTag.length
          );
        }, 10);
      } else {
        const newText =
          this.formData.message.substring(0, start) +
          startTag +
          endTag +
          this.formData.message.substring(end);

        this.formData.message = newText;

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + startTag.length,
            start + startTag.length
          );
        }, 10);
      }
    },

    handleTabKey(event) {
      event.preventDefault();
      const textarea = this.$refs.messageInput;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newText =
        this.formData.message.substring(0, start) +
        "    " +
        this.formData.message.substring(end);

      this.formData.message = newText;

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 4, start + 4);
      }, 10);
    },

    formatPreview(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
        .replace(/&lt;(\/?)(b|i|u|code|pre|strong|em)&gt;/g, "<$1$2>");
    },

    // Методы для расписания
    getDefaultScheduledDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);
      return tomorrow.toISOString();
    },

    getTodayDate() {
      return new Date().toISOString().split("T")[0];
    },

    updateScheduledAt() {
      if (this.scheduledDate && this.scheduledTime) {
        const [hours, minutes] = this.scheduledTime.split(":");
        const date = new Date(this.scheduledDate);
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        this.formData.scheduled_at = date.toISOString();
      } else {
        this.formData.scheduled_at = null; // null для черновика
      }
    },

    formatScheduledDate() {
      if (!this.formData.scheduled_at) return "";
      const date = new Date(this.formData.scheduled_at);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    // Создание рассылки
    async createBroadcast() {
      if (!this.formData.title.trim() || !this.formData.message.trim()) {
        this.error = "Заполните заголовок и сообщение";
        return;
      }

      if (
        this.formData.target_users === "selected" &&
        this.selectedUsers.length === 0
      ) {
        this.error = "Выберите хотя бы одного пользователя";
        return;
      }

      try {
        this.isCreating = true;
        this.error = null;

        const dataToSend = {
          title: this.formData.title.trim(),
          message: this.formData.message.trim(),
          target_users: this.formData.target_users,
        };

        if (this.formData.target_users === "selected") {
          dataToSend.selected_user_ids = this.selectedUsers.map(
            (user) => user.id
          );
        }

        // scheduled_at может быть null (черновик) или ISO строка (запланированная)
        dataToSend.scheduled_at = this.formData.scheduled_at;

        // Определяем статус
        if (this.formData.scheduled_at) {
          dataToSend.status = "scheduled";
        } else {
          dataToSend.status = "draft";
        }

        console.log("Создание рассылки:", dataToSend);

        const response = await broadcastAPI.create(dataToSend);

        console.log("Рассылка создана:", response);

        this.$emit("created", response);
        this.resetForm();
        this.close();
      } catch (error) {
        console.error("Ошибка при создании рассылки:", error);
        this.error = error.message || "Не удалось создать рассылку";
      } finally {
        this.isCreating = false;
      }
    },

    resetForm() {
      this.formData = {
        title: "",
        message: "",
        target_users: "all",
        selected_user_ids: [],
        scheduled_at: null,
      };
      this.selectedUsers = [];
      this.scheduledDate = "";
      this.scheduledTime = "18:00";
      this.showPreview = false;
    },
  },

  async mounted() {
    if (this.isOpen) {
      await this.loadUsers();
      // Устанавливаем дату по умолчанию для расписания
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.scheduledDate = tomorrow.toISOString().split("T")[0];
    }
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
