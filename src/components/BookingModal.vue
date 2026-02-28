<template>
  <!-- Модальное окно с transition -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed inset-0 bg-[#202c27]/90 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4"
      @click.self="closeModal"
    >
      <!-- Контейнер модалки с анимацией выезда -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
        enter-to-class="translate-y-0 sm:scale-100 sm:opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="translate-y-0 sm:scale-100 sm:opacity-100"
        leave-to-class="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
      >
        <div
          v-if="visible"
          class="bg-[#edeae6] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          <!-- Заголовок -->
          <div
            class="flex-shrink-0 bg-[#202c27] text-white px-5 py-4 rounded-t-2xl sm:rounded-t-2xl"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center min-w-0 flex-1 gap-3">
                <div
                  class="h-10 w-10 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <CalendarCheck class="h-5 w-5 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-light text-lg tracking-wide truncate">
                    Бронирование
                  </h3>
                  <p class="text-white/70 text-sm truncate font-light">
                    {{ bookingTitle }}
                  </p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="text-white/80 hover:text-white ml-3 flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Содержимое - с отдельным скроллом -->
          <div
            class="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin-modal"
          >
            <!-- Ошибки профиля -->
            <div
              v-if="!userHasRequiredData"
              class="bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4"
            >
              <div class="flex items-start gap-3">
                <AlertCircle
                  class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-red-800 font-medium mb-1">
                    Недостаточно данных для бронирования
                  </p>
                  <p class="text-xs text-red-600 mb-2">
                    Для бронирования необходимо заполнить данные профиля
                  </p>
                  <button
                    @click="goToProfile"
                    class="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    Перейти в профиль
                    <ChevronRight class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Информация о бронировании -->
            <div class="bg-[#e3ded3] rounded-xl p-4 border border-[#c2a886]/20">
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1 min-w-0">
                  <h4
                    class="font-semibold text-gray-900 text-[15px] truncate mb-1"
                  >
                    {{ bookingTitle }}
                  </h4>
                  <p class="text-sm text-gray-600 truncate">
                    {{ getEventTypeName(eventKey) }}
                  </p>
                </div>
              </div>

              <div
                v-if="selectedBranch"
                class="flex items-center gap-2 text-sm text-gray-600"
              >
                <MapPin class="h-4 w-4 text-[#c2a886]" />
                <span class="font-medium">{{ selectedBranch.name }}</span>
              </div>
            </div>

            <!-- Форма бронирования -->
            <div v-if="userHasRequiredData" class="space-y-4">
              <!-- Информация о контактах -->
              <div
                class="bg-[#d9cebc]/60 backdrop-blur-sm rounded-xl p-4 border border-[#c2a886]/30"
              >
                <div class="flex items-center mb-3 gap-2">
                  <div
                    class="h-7 w-7 rounded-lg bg-[#c2a886]/20 flex items-center justify-center"
                  >
                    <UserIcon class="h-4 w-4 text-[#202c27]" />
                  </div>
                  <span class="font-medium text-gray-900 text-sm"
                    >Ваши контактные данные</span
                  >
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between items-start gap-3">
                    <span class="text-gray-600 flex-shrink-0">Имя:</span>
                    <span
                      class="font-medium text-gray-900 text-right break-words"
                    >
                      {{ user?.first_name }} {{ user?.last_name || "" }}
                    </span>
                  </div>
                  <div class="flex justify-between items-start gap-3">
                    <span class="text-gray-600 flex-shrink-0">Телефон:</span>
                    <span class="font-medium text-gray-900 text-right">{{
                      user?.phone || "Не указан"
                    }}</span>
                  </div>
                </div>
                <button
                  @click="goToProfile"
                  class="mt-3 text-sm text-[#c2a886] hover:text-[#b5976e] font-medium flex items-center gap-1 transition-colors"
                >
                  Изменить в профиле
                  <ChevronRight class="h-4 w-4" />
                </button>
              </div>

              <!-- Выбор даты и времени -->
              <!-- Если это событийный тип (мальчишник/девичник/бизнес-баня/банный клуб) -->
              <div v-if="isEventBasedType">
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Выберите событие <span class="text-red-500">*</span>
                </label>

                <!-- Загрузка событий -->
                <div
                  v-if="loadingEvents"
                  class="bg-[#e3ded3] rounded-xl p-4 text-center"
                >
                  <Loader2
                    class="h-6 w-6 text-[#c2a886] animate-spin mx-auto mb-2"
                  />
                  <p class="text-sm text-gray-600">
                    Загружаем доступные события...
                  </p>
                </div>

                <!-- Список событий -->
                <div v-else-if="availableEvents.length > 0" class="space-y-2">
                  <div
                    v-for="(event, eIdx) in availableEvents"
                    :key="event.id || eIdx"
                    @click="selectEvent(event)"
                    :class="[
                      'bg-[#e3ded3] rounded-xl p-3 border-2 cursor-pointer transition-all duration-200',
                      selectedEvent === event
                        ? 'border-[#c2a886] bg-[#d9cebc]'
                        : 'border-[#c2a886]/20 hover:border-[#c2a886]/40',
                      isEventFullSlots(event)
                        ? 'opacity-50 cursor-not-allowed'
                        : '',
                    ]"
                  >
                    <div class="flex items-start gap-3">
                      <div
                        :class="[
                          'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0',
                          selectedEvent === event
                            ? 'bg-gradient-to-br from-[#c2a886] to-[#b5976e]'
                            : 'bg-[#c2a886]/20',
                        ]"
                      >
                        <CalendarDays
                          :class="[
                            'h-5 w-5',
                            selectedEvent === event
                              ? 'text-white'
                              : 'text-[#c2a886]',
                          ]"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4
                          class="font-semibold text-gray-900 text-sm truncate mb-1"
                        >
                          {{ event.title }}
                        </h4>
                        <p
                          class="text-xs text-gray-600 flex items-center gap-1 mb-1"
                        >
                          <Calendar class="h-3 w-3" />
                          {{ formatEventDate(event.start_date) }}
                        </p>
                        <!-- Занятость мест -->
                        <div
                          v-if="event.max_participants"
                          class="text-xs text-gray-600"
                        >
                          <span
                            :class="
                              isEventFullSlots(event)
                                ? 'text-red-600 font-semibold'
                                : 'text-gray-600'
                            "
                          >
                            Мест: {{ getEventAvailableSlots(event) }} /
                            {{ event.max_participants }}
                          </span>
                        </div>
                      </div>
                      <div
                        v-if="selectedEvent === event && !isEventFullSlots(event)"
                        class="flex-shrink-0"
                      >
                        <CheckCircle class="h-5 w-5 text-[#c2a886]" />
                      </div>
                      <div v-if="isEventFullSlots(event)" class="flex-shrink-0">
                        <XCircle class="h-5 w-5 text-red-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Нет доступных событий -->
                <div v-else class="bg-[#e3ded3] rounded-xl p-4 text-center">
                  <CalendarDays class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p class="text-sm text-gray-600 mb-1">
                    Нет доступных событий
                  </p>
                  <p class="text-xs text-gray-500">
                    В ближайшее время нет запланированных мероприятий
                  </p>
                </div>
              </div>

              <!-- Для остальных типов - обычный выбор даты и времени -->
              <div v-else>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Желаемая дата <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.desired_date"
                  type="date"
                  :min="minDate"
                  class="w-full px-4 py-3 bg-white border border-[#c2a886]/30 rounded-xl focus:ring-2 focus:ring-[#c2a886] focus:border-transparent text-sm transition-all date-input"
                />
                <p class="mt-1.5 text-xs text-gray-500">
                  Выберите желаемую дату посещения
                </p>

                <label
                  class="block text-sm font-medium text-gray-900 mb-2 mt-4"
                >
                  Желаемое время
                </label>
                <input
                  v-model="form.desired_time"
                  type="time"
                  class="w-full px-4 py-3 bg-white border border-[#c2a886]/30 rounded-xl focus:ring-2 focus:ring-[#c2a886] focus:border-transparent text-sm transition-all time-input"
                />
                <p class="mt-1.5 text-xs text-gray-500">
                  Укажите удобное время
                </p>
              </div>

              <!-- Количество гостей -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Количество гостей <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model.number="form.participants_count"
                    type="number"
                    min="1"
                    :max="program?.max_participants || 100"
                    placeholder="Укажите количество"
                    class="w-full px-4 py-3 pr-10 bg-white border border-[#c2a886]/30 rounded-xl focus:ring-2 focus:ring-[#c2a886] focus:border-transparent text-sm transition-all"
                  />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <Users class="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p class="mt-1.5 text-xs text-gray-500">
                  <span v-if="program?.max_participants">
                    Максимум: {{ program.max_participants }} гостей
                  </span>
                  <span v-else>Укажите планируемое количество гостей</span>
                </p>
                <!-- Предупреждение о превышении свободных мест -->
                <div
                  v-if="
                    isEventBasedType &&
                    selectedEvent &&
                    selectedEvent.max_participants &&
                    form.participants_count >
                      getEventAvailableSlots(selectedEvent)
                  "
                  class="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-2"
                >
                  <AlertCircle
                    class="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <p class="text-xs text-red-700">
                    Недостаточно свободных мест! Доступно только
                    {{ getEventAvailableSlots(selectedEvent) }}
                    {{
                      getEventAvailableSlots(selectedEvent) === 1
                        ? "место"
                        : "мест"
                    }}.
                  </p>
                </div>
              </div>

              <!-- Промокод -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Промокод
                </label>
                <div class="relative">
                  <input
                    v-model="form.promo_code"
                    type="text"
                    placeholder="Введите промокод"
                    class="w-full px-4 py-3 pr-10 bg-white border border-[#c2a886]/30 rounded-xl focus:ring-2 focus:ring-[#c2a886] focus:border-transparent text-sm uppercase transition-all"
                    maxlength="20"
                    @input="clearPromoError"
                  />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <Ticket class="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p class="mt-1.5 text-xs text-gray-500">
                  Если у вас есть промокод, введите его для получения скидки
                </p>

                <!-- Сообщение об ошибке промокода -->
                <div
                  v-if="promoError"
                  class="mt-2 p-3 bg-red-50/90 border border-red-200 rounded-lg text-xs text-red-600 flex items-start gap-2"
                >
                  <AlertCircle class="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{{ promoError }}</span>
                </div>
              </div>

              <!-- Комментарий -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Комментарий к бронированию
                </label>
                <textarea
                  v-model="form.comment"
                  placeholder="Дополнительные пожелания, удобное время для связи..."
                  rows="3"
                  class="w-full px-4 py-3 bg-white border border-[#c2a886]/30 rounded-xl focus:ring-2 focus:ring-[#c2a886] focus:border-transparent text-sm resize-none transition-all"
                  maxlength="500"
                ></textarea>
                <p class="mt-1.5 text-xs text-gray-500 text-right">
                  {{ form.comment.length }}/500
                </p>
              </div>

              <!-- Информация -->
              <div
                class="bg-[#d9cebc]/60 backdrop-blur-sm border border-[#c2a886]/30 rounded-xl p-3"
              >
                <p class="text-xs text-gray-700 leading-relaxed text-center">
                  После отправки заявки наш менеджер свяжется с вами для
                  подтверждения
                </p>
              </div>

              <!-- Или свяжитесь с менеджером -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="flex-1 h-px bg-[#c2a886]/20"></div>
                  <span class="text-xs text-gray-500 font-medium"
                    >Или свяжитесь напрямую</span
                  >
                  <div class="flex-1 h-px bg-[#c2a886]/20"></div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <!-- Позвонить менеджеру -->
                  <button
                    v-if="branchPhoneNumber"
                    @click="callManager"
                    class="flex flex-col items-center justify-center gap-2 bg-[#d9cebc]/60 hover:bg-[#c2a886]/30 border border-[#c2a886]/30 rounded-xl p-4 transition-all duration-200 active:scale-[0.98]"
                  >
                    <div
                      class="h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center"
                    >
                      <Phone class="h-5 w-5 text-white" />
                    </div>
                    <span class="text-xs font-medium text-gray-900"
                      >Позвонить</span
                    >
                  </button>

                  <!-- Написать в Telegram -->
                  <button
                    v-if="branchTelegram"
                    @click="openTelegram"
                    class="flex flex-col items-center justify-center gap-2 bg-[#d9cebc]/60 hover:bg-[#c2a886]/30 border border-[#c2a886]/30 rounded-xl p-4 transition-all duration-200 active:scale-[0.98]"
                  >
                    <div
                      class="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center"
                    >
                      <svg
                        class="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
                        />
                      </svg>
                    </div>
                    <span class="text-xs font-medium text-gray-900"
                      >Telegram</span
                    >
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Кнопка отправки - зафиксирована внизу -->
          <div
            class="flex-shrink-0 p-5 bg-[#edeae6] border-t border-[#c2a886]/20"
          >
            <button
              @click="submitBooking"
              :disabled="!canSubmit"
              class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <Loader2
                v-if="isSubmitting"
                class="animate-spin h-5 w-5 mr-2 text-white"
              />
              <XCircle
                v-else-if="
                  !canSubmit &&
                  form.participants_count &&
                  isEventBasedType &&
                  selectedEvent
                "
                class="h-5 w-5 mr-2 text-white"
              />
              <CalendarCheck v-else class="h-5 w-5 mr-2 text-white" />
              <span class="text-[15px] text-white">{{ submitButtonText }}</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { bookingAPI, eventAPI, branchAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "BookingModal",
  components: {
    ...icons,
  },
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
      loadingEvents: false,
      availableEvents: [],
      selectedEvent: null,
      actualBranch: null,
      form: {
        participants_count: null,
        comment: "",
        promo_code: "",
        desired_date: "",
        desired_time: "",
      },
    };
  },
  computed: {
    ...mapState(useAppStore, ["user", "selectedBranch"]),

    // Актуальный филиал — свежие данные из API, fallback на store
    currentBranch() {
      if (this.actualBranch) return this.actualBranch;
      return this.selectedBranch;
    },

    userHasRequiredData() {
      return this.user?.phone && this.user?.first_name;
    },

    bookingTitle() {
      if (this.title) return this.title;
      if (this.program?.name) return this.program.name;
      return this.getEventTypeName(this.eventKey) || "Бронирование";
    },

    // Телефон филиала — из актуальных данных
    branchPhoneNumber() {
      return this.currentBranch?.phone || null;
    },

    // Telegram филиала — из актуальных данных
    branchTelegram() {
      return (
        this.currentBranch?.tg_username || this.currentBranch?.telegram || null
      );
    },

    // Проверяем, является ли тип событийным (из календаря)
    isEventBasedType() {
      const eventTypes = [
        "BACHELOR",
        "BACHELORETTE",
        "BATH_CLUB",
        "BUSINESS_BATH",
      ];
      return eventTypes.includes(this.eventKey);
    },

    // Минимальная дата (сегодня)
    minDate() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },

    // Можно ли отправить форму
    canSubmit() {
      if (
        !this.userHasRequiredData ||
        !this.form.participants_count ||
        this.isSubmitting
      ) {
        return false;
      }

      // Для событийных типов нужно выбрать событие
      if (this.isEventBasedType) {
        if (!this.selectedEvent) {
          return false;
        }

        // Проверяем доступность мест
        if (this.selectedEvent.max_participants) {
          const availableSlots = this.getEventAvailableSlots(
            this.selectedEvent
          );
          if (this.form.participants_count > availableSlots) {
            return false;
          }
        }

        return true;
      }

      // Для остальных типов нужна дата (время опционально)
      return !!this.form.desired_date;
    },

    // Текст кнопки бронирования
    submitButtonText() {
      if (this.isSubmitting) {
        return "Отправка...";
      }

      if (
        this.isEventBasedType &&
        this.selectedEvent &&
        this.selectedEvent.max_participants &&
        this.form.participants_count
      ) {
        const availableSlots = this.getEventAvailableSlots(this.selectedEvent);
        if (this.form.participants_count > availableSlots) {
          return "Недостаточно мест";
        }
      }

      return "Забронировать";
    },
  },
  methods: {
    // Загрузка актуальных данных филиала из API
    async loadActualBranch() {
      try {
        if (!this.selectedBranch?.id) return;

        const branches = await branchAPI.getAll();
        const found = branches.find(
          (b) => b.id === this.selectedBranch.id && b.is_active === true
        );

        if (found) {
          this.actualBranch = found;
          console.log("BookingModal - актуальный филиал загружен:", {
            id: found.id,
            name: found.name,
            phone: found.phone,
            tg_username: found.tg_username,
          });
        } else {
          console.warn(
            "BookingModal - филиал не найден в API, используем store"
          );
        }
      } catch (error) {
        console.error("BookingModal - ошибка загрузки филиала:", error);
      }
    },

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
      this.form = {
        participants_count: null,
        comment: "",
        promo_code: "",
        desired_date: "",
        desired_time: "",
      };
      this.selectedEvent = null;
      this.promoError = "";
      this.isSubmitting = false;
    },

    clearPromoError() {
      this.promoError = "";
    },

    // Позвонить менеджеру
    callManager() {
      if (!this.branchPhoneNumber) {
        alert("Номер телефона филиала не указан");
        return;
      }

      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;

        tg.showPopup(
          {
            title: "Позвонить менеджеру",
            message: `Номер телефона: ${this.branchPhoneNumber}`,
            buttons: [
              { id: "copy", type: "default", text: "Скопировать" },
              { id: "close", type: "cancel", text: "Закрыть" },
            ],
          },
          (buttonId) => {
            if (buttonId === "copy") {
              if (navigator.clipboard) {
                navigator.clipboard
                  .writeText(this.branchPhoneNumber)
                  .then(() => {
                    tg.showAlert("Номер скопирован!");
                  });
              }
            }
          }
        );
      } else {
        const phoneLink = `tel:${this.branchPhoneNumber}`;
        window.location.href = phoneLink;
      }
    },

    // Открыть Telegram
    openTelegram() {
      if (!this.branchTelegram) {
        alert("Telegram филиала не указан");
        return;
      }

      let telegramUrl = this.branchTelegram;

      if (!telegramUrl.startsWith("http")) {
        const username = telegramUrl.replace("@", "");
        telegramUrl = `https://t.me/${username}`;
      }

      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(telegramUrl);
      } else {
        window.open(telegramUrl, "_blank");
      }
    },

    getEventTypeName(eventKey) {
      const types = {
        BACHELOR: "Коллективная баня",
        BACHELORETTE: "Девичник",
        BATH_CLUB: "Банный клуб",
        BUSINESS_BATH: "Бизнес-баня",
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

    // Загрузка доступных событий
    async loadAvailableEvents() {
      if (!this.isEventBasedType) {
        return;
      }

      try {
        this.loadingEvents = true;
        const branchId = this.currentBranch?.id;

        if (!branchId) {
          console.log("Нет выбранного филиала");
          return;
        }

        const data = await eventAPI.getAll(branchId);

        if (Array.isArray(data)) {
          const now = new Date();
          this.availableEvents = data
            .filter((event) => {
              const eventDate = new Date(event.start_date);
              return (
                event.event_key === this.eventKey &&
                event.branch_id === branchId &&
                eventDate >= now
              );
            })
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        }
      } catch (error) {
        console.error("Ошибка при загрузке событий:", error);
        this.availableEvents = [];
      } finally {
        this.loadingEvents = false;
      }
    },

    // Выбор события
    selectEvent(event) {
      if (this.isEventFullSlots(event)) {
        return;
      }
      this.selectedEvent = event;
    },

    // Проверка заполненности события
    isEventFullSlots(event) {
      if (!event.max_participants) return false;
      const occupied = event.occupied_slots || 0;
      return occupied >= event.max_participants;
    },

    // Доступные места в событии
    getEventAvailableSlots(event) {
      if (!event.max_participants) return 0;
      const occupied = event.occupied_slots || 0;
      return Math.max(event.max_participants - occupied, 0);
    },

    // Форматирование даты события
    formatEventDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    parsePromoError(errorDetail) {
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
        return "Промокод не действует на эту программу.";
      }

      return "Ошибка промокода. Проверьте правильность ввода.";
    },

    async submitBooking() {
      if (!this.canSubmit) return;
      try {
        if (!this.userHasRequiredData) {
          alert("Заполните данные профиля для бронирования");
          return;
        }

        if (!this.form.participants_count || this.form.participants_count < 1) {
          alert("Укажите количество гостей");
          return;
        }

        if (this.isEventBasedType && !this.selectedEvent) {
          alert("Выберите событие");
          return;
        }

        if (
          this.isEventBasedType &&
          this.selectedEvent &&
          this.isEventFullSlots(this.selectedEvent)
        ) {
          alert("К сожалению, все места на это событие уже заняты");
          return;
        }

        if (!this.isEventBasedType && !this.form.desired_date) {
          alert("Укажите желаемую дату");
          return;
        }

        // Используем currentBranch вместо selectedBranch
        if (!this.currentBranch?.id) {
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
          branch_id: this.currentBranch.id,
          contact_name:
            `${this.user.first_name} ${this.user.last_name || ""}`.trim(),
          contact_phone: this.user.phone,
          participants_count: this.form.participants_count,
          comment: this.form.comment,
        };

        // Для событийных типов добавляем event_calendar_id, booking_date и booking_time
        if (this.isEventBasedType && this.selectedEvent) {
          bookingData.event_calendar_id = this.selectedEvent.id;

          if (this.selectedEvent.start_date) {
            const eventDate = new Date(this.selectedEvent.start_date);

            if (!isNaN(eventDate.getTime())) {
              const year = eventDate.getFullYear();
              const month = String(eventDate.getMonth() + 1).padStart(2, "0");
              const day = String(eventDate.getDate()).padStart(2, "0");
              const hours = String(eventDate.getHours()).padStart(2, "0");
              const minutes = String(eventDate.getMinutes()).padStart(2, "0");

              bookingData.booking_date = `${year}-${month}-${day}`;
              bookingData.booking_time = `${hours}:${minutes}`;
            }
          }
        } else {
          const timeStr = this.form.desired_time || "00:00";
          const dateTime = `${this.form.desired_date}T${timeStr}:00`;
          bookingData.desired_datetime = new Date(dateTime).toISOString();
          bookingData.booking_date = this.form.desired_date;
          if (this.form.desired_time) {
            bookingData.booking_time = this.form.desired_time;
          }
        }

        if (this.form.promo_code && this.form.promo_code.trim()) {
          bookingData.promo_code = this.form.promo_code.trim().toUpperCase();
        }

        // Определяем что бронируем
        if (this.isEventBasedType && this.selectedEvent) {
          // event_calendar_id уже добавлен выше
        } else if (this.eventKey) {
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

        this.closeModal();
      } catch (error) {
        console.error("Ошибка при бронировании:", error);

        const errorDetail = error.response?.data?.detail || error.message || "";

        if (
          errorDetail.includes("Promo code") ||
          errorDetail.includes("promo code")
        ) {
          this.promoError = this.parsePromoError(errorDetail);
          return;
        }

        let errorMessage = "Ошибка при бронировании. Попробуйте еще раз.";

        if (error.message.includes("400") || errorDetail.includes("400")) {
          errorMessage = "Проверьте правильность заполнения данных";
        } else if (
          error.message.includes("409") ||
          errorDetail.includes("409")
        ) {
          errorMessage = "Вы уже забронировали эту программу";
        }

        alert(errorMessage);
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
        // Загружаем актуальные данные филиала из API
        this.loadActualBranch();
        // Загружаем события если это событийный тип
        if (this.isEventBasedType) {
          this.loadAvailableEvents();
        }
      } else {
        this.unlockBodyScroll();
      }
    },

    // Также загружаем события при изменении типа
    eventKey() {
      if (this.visible && this.isEventBasedType) {
        this.loadAvailableEvents();
      }
    },

    // При смене филиала в store — перезагружаем актуальные данные
    selectedBranch: {
      handler() {
        if (this.visible) {
          this.actualBranch = null;
          this.loadActualBranch();
        }
      },
      deep: true,
    },
  },

  mounted() {
    if (this.visible) {
      this.lockBodyScroll();
      this.loadActualBranch();
      if (this.isEventBasedType) {
        this.loadAvailableEvents();
      }
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
/* Скролл для содержимого */
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
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* Цвет курсора в полях ввода */
input,
textarea {
  caret-color: #c2a886;
  color: #111827;
}

input::placeholder,
textarea::placeholder {
  color: #9ca3af;
}

/* Предотвращаем zoom при фокусе на input на iOS */
@media screen and (max-width: 640px) {
  input[type="text"],
  input[type="number"],
  input[type="date"],
  input[type="time"],
  textarea {
    font-size: 16px;
  }

  /* Специальные стили для date и time на мобильных */
  .date-input,
  .time-input {
    appearance: none;
    max-width: 100%;
    overflow: hidden;
  }

  /* Делаем поля более компактными на маленьких экранах */
  .date-input,
  .time-input {
    padding: 0.75rem 1rem;
    min-height: 44px; /* Минимальная высота для удобного тапа */
  }
}

/* Стили для date и time на всех устройствах */
input[type="date"],
input[type="time"] {
  display: block;
  width: 100%;
  box-sizing: border-box;
}

/* Убираем spinner для webkit */
input[type="date"]::-webkit-inner-spin-button,
input[type="time"]::-webkit-inner-spin-button {
  display: none;
  -webkit-appearance: none;
}

/* Убираем стрелки для Firefox */
input[type="date"],
input[type="time"] {
  -moz-appearance: textfield;
}
</style>
