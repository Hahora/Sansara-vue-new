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

    <!-- Контент -->
    <div v-else class="px-5 py-5 space-y-4">

      <!-- Пусто -->
      <div
        v-if="(!bathClubContent || !bathClubContent.title) && (!businessBathContent || !businessBathContent.title)"
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-8 text-center"
      >
        <Castle class="h-8 w-8 text-[#c2a886] mx-auto mb-3" />
        <p class="text-sm text-gray-600">Скоро здесь появится информация о клубных мероприятиях</p>
      </div>

      <!-- Карточка: Банный клуб -->
      <div
        v-if="bathClubContent && bathClubContent.title"
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden"
      >
        <div class="px-4 py-3 bg-[#d9cebc] border-b border-[#c2a886]/30">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles class="h-4 w-4 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="font-semibold text-gray-900 text-[15px] truncate">{{ bathClubContent.title }}</h2>
              <p v-if="bathClubSubtitle" class="text-xs text-gray-600 mt-0.5 truncate">{{ bathClubSubtitle }}</p>
            </div>
          </div>
        </div>

        <div class="flex">
          <!-- Фото -->
          <div
            ref="bathClubPhoto"
            class="w-[42%] flex-shrink-0 relative bg-[#202c27] overflow-hidden"
            :style="bathClubPhotoH ? { height: bathClubPhotoH + 'px' } : {}"
          >
            <template v-if="bathClubMedia.length > 0">
              <video
                v-if="bathClubMedia[bathClubMediaIdx].media_type === 'VIDEO'"
                :key="bathClubMedia[bathClubMediaIdx].id"
                :src="getMediaUrl(bathClubMedia[bathClubMediaIdx].id)"
                v-autoplay autoplay loop playsinline
                class="absolute inset-0 w-full h-full object-cover cursor-pointer"
                @click="lightboxUrl = getMediaUrl(bathClubMedia[bathClubMediaIdx].id); lightboxType = 'VIDEO'"
              />
              <img v-else :src="getMediaUrl(bathClubMedia[bathClubMediaIdx].id)" class="absolute inset-0 w-full h-full object-cover cursor-pointer" @click="lightboxUrl = getMediaUrl(bathClubMedia[bathClubMediaIdx].id); lightboxType = 'PHOTO'" @error="onImgError" />
              <div v-if="bathClubMedia.length > 1" class="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                <div v-for="(_, i) in bathClubMedia" :key="i" @click="bathClubMediaIdx = i"
                  :class="['h-1.5 rounded-full cursor-pointer transition-all duration-200', i === bathClubMediaIdx ? 'bg-[#c2a886] w-4' : 'bg-white/60 w-1.5']" />
              </div>
            </template>
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <Images class="h-8 w-8 text-[#c2a886]/30" />
            </div>
          </div>

          <!-- Инфо -->
          <div class="flex-1 p-3 flex flex-col gap-2 border-l border-[#c2a886]/15 overflow-hidden">
            <div v-if="bathClubContent.price" class="inline-flex">
              <div class="bg-[#d9cebc] border border-[#c2a886]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Wallet class="h-3.5 w-3.5 text-[#202c27] flex-shrink-0" />
                <span class="font-bold text-sm text-gray-900">{{ formatPrice(bathClubContent.price) }}</span>
                <span class="text-xs text-gray-600">/ уч.</span>
              </div>
            </div>
            <div v-if="bathClubContent.content" class="flex-1 overflow-hidden">
              <div :class="['text-xs text-gray-600 leading-relaxed prose-content', !expandedBathClub && isContentLong(bathClubContent.content) ? 'line-clamp-4' : '']"
                v-html="formatContent(bathClubContent.content)" />
              <button v-if="isContentLong(bathClubContent.content)" @click="toggleBathClub"
                class="mt-1 text-xs text-[#c2a886] font-medium flex items-center gap-0.5">
                {{ expandedBathClub ? "Свернуть" : "Развернуть" }}
                <ChevronDown :class="['h-3 w-3 transition-transform', expandedBathClub ? 'rotate-180' : '']" />
              </button>
            </div>
            <div v-else class="flex-1 flex items-center justify-center">
              <p class="text-gray-400 text-xs text-center">Информация скоро появится</p>
            </div>
            <button @click="openBooking('BATH_CLUB', bathClubContent.title || 'Банный клуб')"
              class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform mt-auto">
              <CalendarCheck class="h-4 w-4" /><span>Записаться</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Карточка: Бизнес-баня -->
      <div
        v-if="businessBathContent && businessBathContent.title"
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden"
      >
        <div class="px-4 py-3 bg-[#d9cebc] border-b border-[#c2a886]/30">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Briefcase class="h-4 w-4 text-white" />
            </div>
            <h2 class="font-semibold text-gray-900 text-[15px] truncate">{{ businessBathContent.title }}</h2>
          </div>
        </div>

        <div class="flex">
          <!-- Фото -->
          <div
            ref="businessBathPhoto"
            class="w-[42%] flex-shrink-0 relative bg-[#202c27] overflow-hidden"
            :style="businessBathPhotoH ? { height: businessBathPhotoH + 'px' } : {}"
          >
            <template v-if="businessBathMedia.length > 0">
              <video
                v-if="businessBathMedia[businessBathMediaIdx].media_type === 'VIDEO'"
                :key="businessBathMedia[businessBathMediaIdx].id"
                :src="getMediaUrl(businessBathMedia[businessBathMediaIdx].id)"
                v-autoplay autoplay loop playsinline
                class="absolute inset-0 w-full h-full object-cover cursor-pointer"
                @click="lightboxUrl = getMediaUrl(businessBathMedia[businessBathMediaIdx].id); lightboxType = 'VIDEO'"
              />
              <img v-else :src="getMediaUrl(businessBathMedia[businessBathMediaIdx].id)" class="absolute inset-0 w-full h-full object-cover cursor-pointer" @click="lightboxUrl = getMediaUrl(businessBathMedia[businessBathMediaIdx].id); lightboxType = 'PHOTO'" @error="onImgError" />
              <div v-if="businessBathMedia.length > 1" class="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                <div v-for="(_, i) in businessBathMedia" :key="i" @click="businessBathMediaIdx = i"
                  :class="['h-1.5 rounded-full cursor-pointer transition-all duration-200', i === businessBathMediaIdx ? 'bg-[#c2a886] w-4' : 'bg-white/60 w-1.5']" />
              </div>
            </template>
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <Images class="h-8 w-8 text-[#c2a886]/30" />
            </div>
          </div>

          <!-- Инфо -->
          <div class="flex-1 p-3 flex flex-col gap-2 border-l border-[#c2a886]/15 overflow-hidden">
            <div v-if="businessBathContent.price" class="inline-flex">
              <div class="bg-[#d9cebc] border border-[#c2a886]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Wallet class="h-3.5 w-3.5 text-[#202c27] flex-shrink-0" />
                <span class="font-bold text-sm text-gray-900">{{ formatPrice(businessBathContent.price) }}</span>
                <span class="text-xs text-gray-600">/ уч.</span>
              </div>
            </div>
            <div v-if="businessBathContent.content" class="flex-1 overflow-hidden">
              <div :class="['text-xs text-gray-600 leading-relaxed prose-content', !expandedBusinessBath && isContentLong(businessBathContent.content) ? 'line-clamp-4' : '']"
                v-html="formatContent(businessBathContent.content)" />
              <button v-if="isContentLong(businessBathContent.content)" @click="toggleBusinessBath"
                class="mt-1 text-xs text-[#c2a886] font-medium flex items-center gap-0.5">
                {{ expandedBusinessBath ? "Свернуть" : "Развернуть" }}
                <ChevronDown :class="['h-3 w-3 transition-transform', expandedBusinessBath ? 'rotate-180' : '']" />
              </button>
            </div>
            <div v-else class="flex-1 flex items-center justify-center">
              <p class="text-gray-400 text-xs text-center">Информация скоро появится</p>
            </div>
            <button @click="openBooking('BUSINESS_BATH', businessBathContent.title || 'Бизнес-баня')"
              class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform mt-auto">
              <CalendarCheck class="h-4 w-4" /><span>Записаться</span>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Лайтбокс -->
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="lightboxUrl"
        class="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
        @click="lightboxUrl = null"
      >
        <video
          v-if="lightboxType === 'VIDEO'"
          :key="lightboxUrl"
          :src="lightboxUrl"
          controls
          autoplay
          playsinline
          class="max-w-full max-h-full"
          @click.stop
        />
        <img v-else :src="lightboxUrl" class="max-w-full max-h-full object-contain" @click.stop />
        <button
          @click="lightboxUrl = null"
          class="absolute top-5 right-5 text-white/70 hover:text-white bg-black/40 rounded-full p-1.5"
        >
          <X class="h-6 w-6" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { openBookingModal } from "@/utils/eventBus";
import { mediaAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "ClubEventsPage",
  components: {
    ...icons,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      bathClubContent: null,
      businessBathContent: null,
      expandedBathClub: false,
      expandedBusinessBath: false,
      bathClubMedia: [],
      bathClubMediaIdx: 0,
      businessBathMedia: [],
      businessBathMediaIdx: 0,
      bathClubPhotoH: 0,
      businessBathPhotoH: 0,
      bathClubInterval: null,
      businessBathInterval: null,
      lightboxUrl: null,
      lightboxType: 'PHOTO',
    };
  },
  computed: {
    ...mapState(useAppStore, [
      "selectedBranch",
      "contentData",
    ]),

    bathClubSubtitle() {
      return this.contentData?.["BATH_CLUB"]?.subtitle || "";
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

    startSlideIntervals() {
      if (this.bathClubMedia.length > 1) {
        this.bathClubInterval = setInterval(() => {
          this.bathClubMediaIdx = (this.bathClubMediaIdx + 1) % this.bathClubMedia.length;
        }, 4000);
      }
      if (this.businessBathMedia.length > 1) {
        this.businessBathInterval = setInterval(() => {
          this.businessBathMediaIdx = (this.businessBathMediaIdx + 1) % this.businessBathMedia.length;
        }, 4000);
      }
    },

    stopSlideIntervals() {
      clearInterval(this.bathClubInterval);
      clearInterval(this.businessBathInterval);
    },

    toggleBathClub() {
      if (!this.expandedBathClub) {
        this.bathClubPhotoH = this.$refs.bathClubPhoto?.offsetHeight || 0;
      } else {
        this.bathClubPhotoH = 0;
      }
      this.expandedBathClub = !this.expandedBathClub;
    },

    toggleBusinessBath() {
      if (!this.expandedBusinessBath) {
        this.businessBathPhotoH = this.$refs.businessBathPhoto?.offsetHeight || 0;
      } else {
        this.businessBathPhotoH = 0;
      }
      this.expandedBusinessBath = !this.expandedBusinessBath;
    },

    openBooking(eventKey, title) {
      openBookingModal(null, eventKey, title);
    },

    getMediaUrl(mediaId) {
      return mediaAPI.getDownloadUrl(mediaId);
    },

    onImgError(e) {
      e.target.style.display = "none";
    },

    async loadMedia() {
      const params = this.selectedBranch?.id ? { branch_id: this.selectedBranch.id } : {};
      const [bcRes, bbRes] = await Promise.allSettled([
        mediaAPI.getBySection("BATH_CLUB", params),
        mediaAPI.getBySection("BUSINESS_BATH", params),
      ]);
      this.bathClubMedia = bcRes.status === "fulfilled"
        ? (bcRes.value.items || []).filter(i => i.is_active)
        : [];
      this.businessBathMedia = bbRes.status === "fulfilled"
        ? (bbRes.value.items || []).filter(i => i.is_active)
        : [];
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
    try {
      await this.loadClubEvents();
      await this.loadMedia();
      this.startSlideIntervals();
    } catch (error) {
      this.error = error.message || "Ошибка при загрузке страницы";
    } finally {
      this.isLoading = false;
    }
  },

  beforeUnmount() {
    this.stopSlideIntervals();
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
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
