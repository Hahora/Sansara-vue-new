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
          <Castle class="h-8 w-8 text-white" />
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-light tracking-wide">Клубные мероприятия</h1>
        </div>
      </div>
    </div>

    <!-- Переключатель вкладок -->
    <div class="px-5 py-3 bg-[#e3ded3] border-b border-[#c2a886]/20">
      <div class="flex rounded-xl bg-[#d9cebc]/60 p-1">
        <button
          @click="activeTab = 'info'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'info'
              ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] shadow-md text-white'
              : 'text-gray-700 hover:bg-white/50',
          ]"
        >
          <FileText class="h-4 w-4" />
          <span>Информация</span>
        </button>
        <button
          @click="activeTab = 'gallery'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'gallery'
              ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] shadow-md text-white'
              : 'text-gray-700 hover:bg-white/50',
          ]"
        >
          <Images class="h-4 w-4" />
          <span>Галерея</span>
        </button>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center py-16 px-5"
    >
      <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
      <p class="text-sm text-gray-600 font-light">Загружаем информацию...</p>
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

    <!-- Контент: Основная информация -->
    <div v-else-if="activeTab === 'info'" class="px-5 py-5">
      <!-- Если нет программ -->
      <div
        v-if="
          (!bathClubContent || !bathClubContent.title) &&
          (!businessBathContent || !businessBathContent.title)
        "
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-8 text-center"
      >
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Castle class="h-8 w-8 text-[#c2a886]" />
        </div>
        <h3 class="text-base font-semibold text-gray-900 mb-2">
          Клубные мероприятия
        </h3>
        <p class="text-sm text-gray-600 leading-relaxed">
          Скоро здесь появится информация о клубных мероприятиях
        </p>
      </div>

      <!-- Список клубных мероприятий -->
      <div v-else class="space-y-4">
        <!-- Банный клуб С. Хачатурьяна -->
        <div
          v-if="bathClubContent && bathClubContent.title"
          class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden"
        >
          <div class="px-4 py-4 bg-[#d9cebc] border-b border-[#c2a886]/30">
            <div class="flex items-center gap-3">
              <div
                class="h-12 w-12 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Sparkles class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="font-semibold text-gray-900 text-[15px] truncate">
                  {{ bathClubContent.title }}
                </h2>
                <p
                  v-if="bathClubSubtitle"
                  class="text-sm text-gray-600 mt-0.5 truncate"
                >
                  {{ bathClubSubtitle }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <!-- Цена -->
            <div v-if="bathClubContent.price" class="flex items-center">
              <div
                class="bg-[#d9cebc] px-4 py-2.5 rounded-xl border border-[#c2a886]/30 flex items-center gap-2"
              >
                <div
                  class="h-8 w-8 bg-[#c2a886]/30 rounded-lg flex items-center justify-center"
                >
                  <Wallet class="h-4 w-4 text-[#202c27]" />
                </div>
                <div>
                  <div class="font-semibold text-gray-900 text-base">
                    {{ formatPrice(bathClubContent.price) }}
                  </div>
                  <div class="text-xs text-gray-600">с участника</div>
                </div>
              </div>
            </div>

            <!-- Контент из API с разворачиванием -->
            <div
              v-if="bathClubContent.content"
              class="bg-[#d9cebc]/40 rounded-xl p-4"
            >
              <div
                :class="[
                  'text-sm text-gray-700 leading-relaxed prose-content transition-all duration-300',
                  !expandedBathClub && isContentLong(bathClubContent.content)
                    ? 'line-clamp-4'
                    : '',
                ]"
                v-html="formatContent(bathClubContent.content)"
              ></div>

              <!-- Кнопка развернуть/свернуть -->
              <button
                v-if="isContentLong(bathClubContent.content)"
                @click="expandedBathClub = !expandedBathClub"
                class="mt-3 text-sm text-[#c2a886] hover:text-[#b5976e] font-medium flex items-center gap-1 transition-colors"
              >
                <span>{{ expandedBathClub ? "Свернуть" : "Развернуть" }}</span>
                <ChevronDown
                  :class="[
                    'h-4 w-4 transition-transform duration-300',
                    expandedBathClub ? 'rotate-180' : '',
                  ]"
                />
              </button>
            </div>

            <!-- Если контента нет -->
            <div
              v-else
              class="bg-[#d9cebc]/40 rounded-xl p-4 text-center text-gray-500 text-sm"
            >
              Информация о банном клубе скоро появится
            </div>

            <!-- Кнопка записи -->
            <button
              @click="
                openBooking('BATH_CLUB', bathClubContent.title || 'Банный клуб')
              "
              class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
            >
              <CalendarCheck class="h-5 w-5 mr-2" />
              <span class="text-[15px]">Записаться</span>
            </button>
          </div>
        </div>

        <!-- Бизнес-баня с клубом МОСТ -->
        <div
          v-if="businessBathContent && businessBathContent.title"
          class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden"
        >
          <div class="px-4 py-4 bg-[#d9cebc] border-b border-[#c2a886]/30">
            <div class="flex items-center gap-3">
              <div
                class="h-12 w-12 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Briefcase class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="font-semibold text-gray-900 text-[15px] truncate">
                  {{ businessBathContent.title }}
                </h2>
              </div>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <!-- Цена -->
            <div v-if="businessBathContent.price" class="flex items-center">
              <div
                class="bg-[#d9cebc] px-4 py-2.5 rounded-xl border border-[#c2a886]/30 flex items-center gap-2"
              >
                <div
                  class="h-8 w-8 bg-[#c2a886]/30 rounded-lg flex items-center justify-center"
                >
                  <Wallet class="h-4 w-4 text-[#202c27]" />
                </div>
                <div>
                  <div class="font-semibold text-gray-900 text-base">
                    {{ formatPrice(businessBathContent.price) }}
                  </div>
                  <div class="text-xs text-gray-600">с участника</div>
                </div>
              </div>
            </div>

            <!-- Контент из API с разворачиванием -->
            <div
              v-if="businessBathContent.content"
              class="bg-[#d9cebc]/40 rounded-xl p-4"
            >
              <div
                :class="[
                  'text-sm text-gray-700 leading-relaxed prose-content transition-all duration-300',
                  !expandedBusinessBath &&
                  isContentLong(businessBathContent.content)
                    ? 'line-clamp-4'
                    : '',
                ]"
                v-html="formatContent(businessBathContent.content)"
              ></div>

              <!-- Кнопка развернуть/свернуть -->
              <button
                v-if="isContentLong(businessBathContent.content)"
                @click="expandedBusinessBath = !expandedBusinessBath"
                class="mt-3 text-sm text-[#c2a886] hover:text-[#b5976e] font-medium flex items-center gap-1 transition-colors"
              >
                <span>{{
                  expandedBusinessBath ? "Свернуть" : "Развернуть"
                }}</span>
                <ChevronDown
                  :class="[
                    'h-4 w-4 transition-transform duration-300',
                    expandedBusinessBath ? 'rotate-180' : '',
                  ]"
                />
              </button>
            </div>

            <!-- Если контента нет -->
            <div
              v-else
              class="bg-[#d9cebc]/40 rounded-xl p-4 text-center text-gray-500 text-sm"
            >
              Информация о бизнес-бане скоро появится
            </div>

            <!-- Кнопка записи -->
            <button
              @click="
                openBooking(
                  'BUSINESS_BATH',
                  businessBathContent.title || 'Бизнес-баня'
                )
              "
              class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
            >
              <CalendarCheck class="h-5 w-5 mr-2" />
              <span class="text-[15px]">Записаться</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Контент: Фотогалерея -->
    <div v-else-if="activeTab === 'gallery'">
      <MediaGallery
        :sections="gallerySections"
        :show-media-type-filter="true"
        :category-labels="categoryLabels"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { openBookingModal } from "@/utils/eventBus";
import MediaGallery from "@/components/MediaGallery.vue";
import icons from "@/utils/icons";

export default {
  name: "ClubEventsPage",
  components: {
    MediaGallery,
    ...icons,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      bathClubContent: null,
      businessBathContent: null,
      activeTab: "info",
      expandedBathClub: false,
      expandedBusinessBath: false,
    };
  },
  computed: {
    ...mapState(useAppStore, [
      "programs",
      "programsLoaded",
      "selectedBranch",
      "contentData",
    ]),

    pageTitle() {
      return this.contentData?.["CLUB_EVENTS"]?.title || "Клубные мероприятия";
    },

    bathClubSubtitle() {
      return this.contentData?.["BATH_CLUB"]?.subtitle || "";
    },

    gallerySections() {
      return ["BATH_CLUB", "BUSINESS_BATH"];
    },

    categoryLabels() {
      return {
        BATH_CLUB: "Банный клуб",
        BUSINESS_BATH: "Бизнес-баня",
      };
    },
  },
  methods: {
    ...mapActions(useAppStore, ["loadPrograms", "loadSiteContent"]),

    formatContent(content) {
      if (!content) return "";
      return content
        .replace(/\n/g, "<br>")
        .replace(/\\n/g, "<br>")
        .replace(/\r\n/g, "<br>");
    },

    formatPrice(price) {
      if (!price && price !== 0) return "";

      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;

      return priceNumber.toLocaleString("ru-RU") + " ₽";
    },

    isContentLong(content) {
      if (!content) return false;
      // Проверяем длину контента (более 200 символов) или количество переносов строк (более 3)
      const textLength = content.replace(/<[^>]*>/g, "").length;
      const lineBreaks = (content.match(/\n|<br>/gi) || []).length;
      return textLength > 200 || lineBreaks > 3;
    },

    openBooking(eventKey, title) {
      console.log("ClubEventsPage: Opening booking", { eventKey, title });
      openBookingModal(null, eventKey, title);
    },

    async loadClubEvents() {
      try {
        console.log("Загрузка контента для страницы клубных мероприятий");
        console.log("Выбранный филиал:", this.selectedBranch?.id);

        // Загружаем контент для BATH_CLUB
        try {
          await this.loadSiteContent("BATH_CLUB", true);
          this.bathClubContent = this.contentData?.["BATH_CLUB"];
          console.log("Контент для банного клуба:", this.bathClubContent);
        } catch (bathClubError) {
          console.error(
            "Ошибка загрузки контента для банного клуба:",
            bathClubError
          );
          this.bathClubContent = null;
        }

        // Загружаем контент для BUSINESS_BATH
        try {
          await this.loadSiteContent("BUSINESS_BATH", true);
          this.businessBathContent = this.contentData?.["BUSINESS_BATH"];
          console.log("Контент для бизнес-бани:", this.businessBathContent);
        } catch (businessBathError) {
          console.error(
            "Ошибка загрузки контента для бизнес-бани:",
            businessBathError
          );
          this.businessBathContent = null;
        }

        if (!this.bathClubContent && !this.businessBathContent) {
          console.log("Контент для обоих клубов не найден");
        }
      } catch (error) {
        console.error("Ошибка при загрузке контента:", error);
        this.error = error.message || "Не удалось загрузить информацию";
      }
    },
  },
  async created() {
    console.log("ClubEventsPage created");

    try {
      await this.loadClubEvents();
      console.log("Страница загружена успешно");
    } catch (error) {
      console.error("Ошибка при загрузке страницы:", error);
      this.error = error.message || "Ошибка при загрузке страницы";
    } finally {
      this.isLoading = false;
    }
  },

  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log("Филиал изменился, перезагружаем контент:", newBranchId);
        this.loadClubEvents();
      },
    },
  },
};
</script>

<style scoped>
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

/* Line clamp для сворачивания текста */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
