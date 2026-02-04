<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Шапка - статичная -->
    <div class="bg-[#202c27] text-white px-5 py-6">
      <div class="flex items-center mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft class="h-6 w-6 mr-1" />
          <span class="font-light">Назад</span>
        </button>
      </div>

      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center border-2 border-white/10 backdrop-blur-sm"
        >
          <Building2 class="h-8 w-8 text-white" />
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-light tracking-wide">
            Корпоративные программы
          </h1>
          <p class="text-white/70 text-sm mt-1 font-light">
            «Отдых, после которого не нужен отдых»
          </p>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center py-16 px-5"
    >
      <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
      <p class="text-sm text-gray-600 font-light">Загружаем программы...</p>
    </div>

    <!-- Ошибка -->
    <div
      v-else-if="error"
      class="mx-5 mt-5 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-sm"
    >
      <div class="flex items-start gap-3">
        <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Содержание корпоративных программ -->
    <div v-else class="px-5 py-5">
      <!-- Если нет корпоративных программ -->
      <div
        v-if="!corporatePrograms || corporatePrograms.length === 0"
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-8 text-center"
      >
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Building2 class="h-8 w-8 text-[#c2a886]" />
        </div>
        <h3 class="text-base font-semibold text-gray-900 mb-2">
          Корпоративные программы
        </h3>
        <p class="text-sm text-gray-600 leading-relaxed">
          Скоро здесь появится информация о корпоративных программах
        </p>
      </div>

      <!-- Список корпоративных программ -->
      <div v-else class="space-y-4">
        <!-- Карточка программы -->
        <div
          v-for="program in corporatePrograms"
          :key="program.id"
          class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden"
        >
          <!-- Заголовок программы -->
          <div class="px-4 py-4 bg-[#d9cebc] border-b border-[#c2a886]/30">
            <div class="flex items-center gap-3">
              <div
                class="h-12 w-12 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Building2 class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="font-semibold text-gray-900 text-base leading-tight">
                  {{ program.title }}
                </h2>
                <p
                  v-if="program.subtitle"
                  class="text-sm text-gray-600 mt-0.5 truncate"
                >
                  {{ program.subtitle }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <!-- Цена, если есть -->
            <div v-if="program.price" class="flex items-center">
              <div
                class="bg-[#d9cebc] border border-[#c2a886]/30 px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <div
                  class="h-8 w-8 rounded-full bg-[#c2a886]/30 flex items-center justify-center"
                >
                  <Wallet class="h-4 w-4 text-[#202c27]" />
                </div>
                <div>
                  <div class="font-semibold text-gray-900 text-base">
                    {{ formatPrice(program.price) }}
                  </div>
                  <div class="text-xs text-gray-600">с участника</div>
                </div>
              </div>
            </div>

            <!-- Длительность, если есть -->
            <div v-if="program.duration" class="flex items-center">
              <div
                class="bg-[#d9cebc]/40 text-gray-700 px-3 py-2 rounded-xl border border-[#c2a886]/20 text-sm flex items-center gap-2"
              >
                <Calendar class="h-4 w-4 text-[#c2a886]" />
                <span class="font-medium">Длительность:</span>
                <span>{{ program.duration }}</span>
              </div>
            </div>

            <!-- Формат проведения, если есть -->
            <div v-if="program.format" class="flex items-center">
              <div
                class="bg-[#d9cebc]/40 text-gray-700 px-3 py-2 rounded-xl border border-[#c2a886]/20 text-sm flex items-center gap-2"
              >
                <Layout class="h-4 w-4 text-[#c2a886]" />
                <span class="font-medium">Формат:</span>
                <span>{{ program.format }}</span>
              </div>
            </div>

            <!-- Контент программы с разворачиванием -->
            <div v-if="program.content" class="bg-[#d9cebc]/40 rounded-xl p-4">
              <div
                :class="[
                  'text-sm text-gray-700 leading-relaxed prose-content transition-all duration-300',
                  !expandedPrograms[program.id] &&
                  isContentLong(program.content)
                    ? 'line-clamp-4'
                    : '',
                ]"
                v-html="formatContent(program.content)"
              ></div>

              <!-- Кнопка развернуть/свернуть -->
              <button
                v-if="isContentLong(program.content)"
                @click="toggleExpanded(program.id)"
                class="mt-3 text-sm text-[#c2a886] hover:text-[#b5976e] font-medium flex items-center gap-1 transition-colors"
              >
                <span>{{
                  expandedPrograms[program.id] ? "Свернуть" : "Развернуть"
                }}</span>
                <ChevronDown
                  :class="[
                    'h-4 w-4 transition-transform duration-300',
                    expandedPrograms[program.id] ? 'rotate-180' : '',
                  ]"
                />
              </button>
            </div>

            <!-- Если контента нет -->
            <div
              v-else
              class="bg-[#d9cebc]/40 rounded-xl p-4 text-center text-gray-500 text-sm"
            >
              Описание программы скоро появится
            </div>

            <!-- Преимущества корпоративной программы -->
            <div
              v-if="
                program.benefits &&
                Array.isArray(program.benefits) &&
                program.benefits.length > 0
              "
              class="space-y-2"
            >
              <div
                class="text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                <Award class="h-4 w-4 text-[#c2a886]" />
                Преимущества для компании:
              </div>
              <ul class="space-y-1.5">
                <li
                  v-for="(benefit, index) in program.benefits"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <CheckCircle
                    class="h-4 w-4 text-[#c2a886] mt-0.5 flex-shrink-0"
                  />
                  <span class="text-sm text-gray-700">{{ benefit }}</span>
                </li>
              </ul>
            </div>

            <!-- Включено в программу -->
            <div
              v-if="
                program.included &&
                Array.isArray(program.included) &&
                program.included.length > 0
              "
              class="space-y-2"
            >
              <div
                class="text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                <List class="h-4 w-4 text-[#c2a886]" />
                Включено в программу:
              </div>
              <ul class="space-y-1.5">
                <li
                  v-for="(item, index) in program.included"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <CheckCircle
                    class="h-4 w-4 text-[#c2a886] mt-0.5 flex-shrink-0"
                  />
                  <span class="text-sm text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- Кнопки действий -->
            <div class="space-y-2.5 pt-2">
              <!-- Кнопка позвонить -->
              <button
                @click="callCorporateNumber"
                class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
              >
                <Phone class="h-5 w-5 mr-2" />
                <span class="text-[15px]">
                  {{
                    currentBranch?.phone
                      ? `Позвонить в ${currentBranch.name}`
                      : "Позвонить для уточнения деталей"
                  }}
                </span>
              </button>

              <!-- Кнопка написать в Telegram -->
              <button
                @click="openTelegramChat"
                class="w-full bg-gradient-to-r from-[#0088cc] to-[#24a1de] hover:from-[#0077b5] hover:to-[#0088cc] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.24-.02-.1.02-1.79 1.14-5.06 3.35-.48.33-.92.49-1.31.48-.43-.01-1.27-.25-1.89-.45-.76-.26-1.37-.4-1.32-.84.03-.23.33-.47.9-.72 3.5-1.52 5.83-2.53 6.99-3.03 3.33-1.36 4.03-1.6 4.48-1.61.1-.01.33.02.48.15.12.1.15.23.17.33.02.1.02.23.01.33z"
                  />
                </svg>
                <span class="text-[15px]">
                  {{
                    currentBranch?.tg_username
                      ? `Написать ${currentBranch.name} в Telegram`
                      : "Написать нам в Telegram"
                  }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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

      // Для остальных типов нужна дата и время
      return !!(this.form.desired_date && this.form.desired_time);
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

        if (
          !this.isEventBasedType &&
          (!this.form.desired_date || !this.form.desired_time)
        ) {
          alert("Укажите желаемую дату и время");
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
          const dateTime = `${this.form.desired_date}T${this.form.desired_time}:00`;
          bookingData.desired_datetime = new Date(dateTime).toISOString();

          bookingData.booking_date = this.form.desired_date;
          bookingData.booking_time = this.form.desired_time;
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
/* Line clamp для сворачивания текста */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Стили для контента из API */
.prose-content :deep(p) {
  margin-bottom: 0.75em;
}

.prose-content :deep(ul) {
  margin-bottom: 0.75em;
  padding-left: 1.5em;
  list-style-type: disc;
}

.prose-content :deep(li) {
  margin-bottom: 0.25em;
}

.prose-content :deep(strong) {
  font-weight: 600;
  color: #202c27;
}

/* Анимации для toast */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}

.animate-fade-out {
  animation: fade-out 0.3s ease-out;
}
</style>
