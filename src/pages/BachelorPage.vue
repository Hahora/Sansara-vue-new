<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Шапка -->
    <div class="relative overflow-hidden bg-[#202c27] text-white">
      <!-- Декоративная текстура -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10"
        ></div>
      </div>

      <div class="relative px-5 pt-6 pb-8">
        <!-- Кнопка назад -->
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white/90 hover:text-white transition-all duration-300 mb-6"
        >
          <ChevronLeft class="h-6 w-6" />
          <span class="ml-2 font-medium text-sm">Назад</span>
        </button>

        <!-- Заголовок -->
        <div class="flex items-start gap-3">
          <div
            class="w-14 h-14 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-[#c2a886]/30 shadow-lg flex-shrink-0"
          >
            <PartyPopper class="h-7 w-7 text-white" />
          </div>
          <div class="flex-1 min-w-0 pt-1">
            <h1
              class="text-xl font-light tracking-wide text-white leading-tight"
            >
              {{ pageTitle }}
            </h1>
            <p class="text-sm text-white/70 font-light mt-1.5 leading-relaxed">
              Празднуйте в особенной атмосфере
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Переключатель вкладок -->
    <div class="px-5 py-3 bg-[#e3ded3] border-b border-[#c2a886]/20">
      <div class="flex rounded-xl bg-[#d9cebc] p-1 gap-1">
        <button
          @click="activeTab = 'info'"
          :class="[
            'flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300',
            activeTab === 'info'
              ? 'bg-[#c2a886] shadow-md text-white'
              : 'text-gray-700 hover:text-gray-900',
          ]"
        >
          <div class="flex items-center justify-center gap-1.5">
            <FileText
              :class="['h-4 w-4', activeTab === 'info' ? 'text-white' : '']"
            />
            <span>Инфо</span>
          </div>
        </button>
        <button
          @click="activeTab = 'gallery'"
          :class="[
            'flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300',
            activeTab === 'gallery'
              ? 'bg-[#c2a886] shadow-md text-white'
              : 'text-gray-700 hover:text-gray-900',
          ]"
        >
          <div class="flex items-center justify-center gap-1.5">
            <Images
              :class="['h-4 w-4', activeTab === 'gallery' ? 'text-white' : '']"
            />
            <span>Галерея</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="flex flex-col items-center">
        <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-3" />
        <p class="text-sm text-gray-600 font-light">Загружаем...</p>
      </div>
    </div>

    <!-- Ошибка -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="error"
        class="mx-5 mt-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-lg"
      >
        <div class="flex items-start">
          <AlertCircle class="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-sm text-red-800 font-medium">{{ error }}</p>
          </div>
          <button
            @click="error = null"
            class="text-red-500 hover:text-red-700 ml-3 flex-shrink-0 transition-colors"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>
    </transition>

    <!-- Контент: Основная информация -->
    <div v-if="!isLoading && activeTab === 'info'" class="px-5 py-5 space-y-4">
      <!-- Мальчишники -->
      <div
        v-if="bachelorContent && bachelorContent.title"
        class="bg-[#e3ded3] rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden"
      >
        <!-- Заголовок -->
        <div class="p-4 bg-[#d9cebc] border-b border-[#c2a886]/20">
          <div class="flex items-center gap-3">
            <div
              class="h-11 w-11 rounded-xl bg-gradient-to-br from-[#c2a886] to-[#b5976e] flex items-center justify-center shadow-sm flex-shrink-0"
            >
              <Users class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="font-semibold text-gray-900 text-[15px] leading-tight">
                {{ bachelorContent.title || "Коллективная баня" }}
              </h2>
            </div>
          </div>
        </div>

        <!-- Контент -->
        <div class="p-4 space-y-3">
          <!-- Цена -->
          <div v-if="bachelorContent.price">
            <div
              class="bg-[#d9cebc] border border-[#c2a886]/30 px-4 py-3 rounded-xl inline-flex items-center"
            >
              <div class="flex items-center gap-2">
                <div
                  class="h-6 w-6 rounded-full bg-[#c2a886]/30 flex items-center justify-center"
                >
                  <Wallet class="h-3.5 w-3.5 text-[#202c27]" />
                </div>
                <div>
                  <span class="font-bold text-base text-gray-900">{{
                    formatPrice(bachelorContent.price)
                  }}</span>
                  <span class="text-xs ml-1 text-gray-600">/ гость</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Описание с кнопкой "Развернуть" -->
          <div
            v-if="bachelorContent.content"
            class="bg-[#d9cebc]/40 backdrop-blur-sm rounded-xl p-4 border border-[#c2a886]/20"
          >
            <div
              :class="[
                'prose prose-sm max-w-none text-sm leading-relaxed text-gray-700 transition-all duration-300',
                !expandedBachelor && isContentLong(bachelorContent.content)
                  ? 'line-clamp-4'
                  : '',
              ]"
              v-html="formatContent(bachelorContent.content)"
            ></div>

            <!-- Кнопка развернуть -->
            <button
              v-if="isContentLong(bachelorContent.content)"
              @click="expandedBachelor = !expandedBachelor"
              class="mt-3 text-sm text-[#c2a886] hover:text-[#b5976e] font-medium flex items-center gap-1 transition-colors"
            >
              <span>{{ expandedBachelor ? "Свернуть" : "Развернуть" }}</span>
              <ChevronDown
                :class="[
                  'h-4 w-4 transition-transform duration-300',
                  expandedBachelor ? 'rotate-180' : '',
                ]"
              />
            </button>
          </div>

          <!-- Если контента нет -->
          <div
            v-else
            class="bg-[#d9cebc]/40 backdrop-blur-sm rounded-xl p-5 text-center border border-[#c2a886]/20"
          >
            <Calendar class="h-7 w-7 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 text-xs">Информация скоро появится</p>
          </div>

          <!-- Кнопка бронирования -->
          <button
            @click="openBooking('BACHELOR', 'Коллективная баня')"
            class="group w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
          >
            <CalendarCheck class="h-5 w-5 mr-2 text-white" />
            <span class="text-[15px] text-white">Забронировать</span>
            <ChevronRight
              class="h-5 w-5 ml-2 group-active:translate-x-1 transition-transform text-white"
            />
          </button>
        </div>
      </div>

      <!-- Девичники -->
      <div
        v-if="bacheloretteContent && bacheloretteContent.title"
        class="bg-[#e3ded3] rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden"
      >
        <!-- Заголовок -->
        <div class="p-4 bg-[#d9cebc] border-b border-[#c2a886]/20">
          <div class="flex items-center gap-3">
            <div
              class="h-11 w-11 rounded-xl bg-gradient-to-br from-[#d4b896] to-[#c2a886] flex items-center justify-center shadow-sm flex-shrink-0"
            >
              <Flower2 class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="font-semibold text-gray-900 text-[15px] leading-tight">
                {{ bacheloretteContent.title || "Девичники" }}
              </h2>
            </div>
          </div>
        </div>

        <!-- Контент -->
        <div class="p-4 space-y-3">
          <!-- Цена -->
          <div v-if="bacheloretteContent.price">
            <div
              class="bg-[#d9cebc] border border-[#c2a886]/30 px-4 py-3 rounded-xl inline-flex items-center"
            >
              <div class="flex items-center gap-2">
                <div
                  class="h-6 w-6 rounded-full bg-[#c2a886]/30 flex items-center justify-center"
                >
                  <Wallet class="h-3.5 w-3.5 text-[#202c27]" />
                </div>
                <div>
                  <span class="font-bold text-base text-gray-900">{{
                    formatPrice(bacheloretteContent.price)
                  }}</span>
                  <span class="text-xs ml-1 text-gray-600">/ гость</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Описание с кнопкой "Развернуть" -->
          <div
            v-if="bacheloretteContent.content"
            class="bg-[#d9cebc]/40 backdrop-blur-sm rounded-xl p-4 border border-[#c2a886]/20"
          >
            <div
              :class="[
                'prose prose-sm max-w-none text-sm leading-relaxed text-gray-700 transition-all duration-300',
                !expandedBachelorette &&
                isContentLong(bacheloretteContent.content)
                  ? 'line-clamp-4'
                  : '',
              ]"
              v-html="formatContent(bacheloretteContent.content)"
            ></div>

            <!-- Кнопка развернуть -->
            <button
              v-if="isContentLong(bacheloretteContent.content)"
              @click="expandedBachelorette = !expandedBachelorette"
              class="mt-3 text-sm text-[#c2a886] hover:text-[#b5976e] font-medium flex items-center gap-1 transition-colors"
            >
              <span>{{
                expandedBachelorette ? "Свернуть" : "Развернуть"
              }}</span>
              <ChevronDown
                :class="[
                  'h-4 w-4 transition-transform duration-300',
                  expandedBachelorette ? 'rotate-180' : '',
                ]"
              />
            </button>
          </div>

          <!-- Если контента нет -->
          <div
            v-else
            class="bg-[#d9cebc]/40 backdrop-blur-sm rounded-xl p-5 text-center border border-[#c2a886]/20"
          >
            <Calendar class="h-7 w-7 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 text-xs">Информация скоро появится</p>
          </div>

          <!-- Кнопка бронирования -->
          <button
            @click="openBooking('BACHELORETTE', 'Девичник')"
            class="group w-full bg-gradient-to-r from-[#d4b896] to-[#c2a886] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
          >
            <CalendarCheck class="h-5 w-5 mr-2 text-white" />
            <span class="text-[15px] text-white">Забронировать</span>
            <ChevronRight
              class="h-5 w-5 ml-2 group-active:translate-x-1 transition-transform text-white"
            />
          </button>
        </div>
      </div>

      <!-- Если оба раздела пустые -->
      <div
        v-if="
          (!bachelorContent || !bachelorContent.title) &&
          (!bacheloretteContent || !bacheloretteContent.title)
        "
        class="bg-[#e3ded3] rounded-2xl shadow-sm border border-gray-200/80 p-6 text-center"
      >
        <div
          class="w-14 h-14 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-3"
        >
          <PartyPopper class="h-7 w-7 text-[#c2a886]" />
        </div>
        <h3 class="text-base font-semibold text-gray-900 mb-1.5">
          Коллективная баня и девичники
        </h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          Информация скоро появится
        </p>
      </div>
    </div>

    <!-- Контент: Фотогалерея -->
    <div v-else-if="!isLoading && activeTab === 'gallery'">
      <MediaGallery
        :sections="['BACHELOR', 'BACHELORETTE']"
        :show-media-type-filter="true"
        :category-labels="{
          BACHELOR: 'Коллективная баня',
          BACHELORETTE: 'Девичники',
        }"
      />
    </div>

    <!-- Декоративный элемент внизу -->
    <div class="relative h-8 mt-4">
      <div class="absolute inset-x-0 bottom-0 flex justify-center">
        <div
          class="h-px w-24 bg-gradient-to-r from-transparent via-[#c2a886]/30 to-transparent"
        ></div>
      </div>
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
  name: "BachelorPage",
  components: {
    MediaGallery,
    ...icons,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      bachelorContent: null,
      bacheloretteContent: null,
      activeTab: "info",
      selectedEventType: null,
      expandedBachelor: false,
      expandedBachelorette: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData"]),

    pageTitle() {
      return "Коллективная баня и девичники";
    },
  },
  methods: {
    ...mapActions(useAppStore, ["loadSiteContent"]),

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
      // Проверяем, длинный ли текст (более 200 символов или 3 переносов строк)
      const textLength = content.replace(/<[^>]*>/g, "").length;
      const lineBreaks = (content.match(/\n|<br>/gi) || []).length;
      return textLength > 200 || lineBreaks > 3;
    },

    async loadContent() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log(
          "Загрузка контента для страницы Коллективная баня/девичников"
        );
        console.log("Выбранный филиал:", this.selectedBranch?.id);

        try {
          await this.loadSiteContent("BACHELOR", true);
          this.bachelorContent = this.contentData?.["BACHELOR"];
          console.log("Контент для Коллективная баня:", this.bachelorContent);
        } catch (bachelorError) {
          console.error(
            "Ошибка загрузки контента для Коллективная баня:",
            bachelorError
          );
          this.bachelorContent = null;
        }

        try {
          await this.loadSiteContent("BACHELORETTE", true);
          this.bacheloretteContent = this.contentData?.["BACHELORETTE"];
          console.log("Контент для девичников:", this.bacheloretteContent);
        } catch (bacheloretteError) {
          console.error(
            "Ошибка загрузки контента для девичников:",
            bacheloretteError
          );
          this.bacheloretteContent = null;
        }

        if (!this.bachelorContent && !this.bacheloretteContent) {
          console.log("Контент для обоих разделов не найден");
        }
      } catch (error) {
        console.error("Ошибка при загрузке контента:", error);
        this.error = error.message || "Не удалось загрузить информацию";
      } finally {
        this.isLoading = false;
      }
    },

    openBooking(eventKey, title) {
      console.log("BachelorPage: Opening booking", { eventKey, title });
      this.selectedEventType = eventKey;
      openBookingModal(null, eventKey, title);
    },
  },
  async created() {
    console.log("BachelorPage created");

    try {
      await this.loadContent();
      console.log("Страница загружена успешно");
    } catch (error) {
      console.error("Ошибка при загрузке страницы:", error);
      this.error = error.message || "Ошибка при загрузке страницы";
    }
  },

  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log("Филиал изменился, перезагружаем контент:", newBranchId);
        this.loadContent();
      },
    },
  },
};
</script>

<style scoped>
.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose :deep(p) {
  margin-bottom: 0.5em;
  color: #374151;
}

.prose :deep(ul) {
  margin-bottom: 0.5em;
  padding-left: 1.25em;
  list-style-type: disc;
}

.prose :deep(li) {
  margin-bottom: 0.25em;
  color: #4b5563;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.prose :deep(br) {
  content: "";
  display: block;
  margin-bottom: 0.25em;
}
</style>
