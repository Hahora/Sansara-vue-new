<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Шапка -->
    <div class="relative z-10 bg-[#202c27] text-white">
      <!-- Декоративная текстура -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10"
        ></div>
      </div>

      <div class="relative px-5 pt-6 pb-8">
        <!-- Кнопка назад + выбор филиала -->
        <div class="flex items-center justify-between mb-6">
          <button @click="$router.go(-1)" class="flex items-center text-white/90 hover:text-white transition-all duration-300">
            <ChevronLeft class="h-6 w-6" />
            <span class="ml-2 font-medium text-sm">Назад</span>
          </button>
          <div class="relative">
            <button @click.stop="showBranchSelect = !showBranchSelect" class="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-1.5 transition-all duration-200">
              <MapPin class="h-3.5 w-3.5 text-[#c2a886]" />
              <span class="text-white font-medium text-[13px] max-w-[90px] truncate">{{ selectedBranch?.short_name || selectedBranch?.name || "Филиал" }}</span>
              <ChevronDown :class="['h-3.5 w-3.5 text-white/70 transition-transform', showBranchSelect ? 'rotate-180' : '']" />
            </button>
            <div v-if="showBranchSelect" class="fixed inset-0 z-40" @click="showBranchSelect = false" />
            <transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
              <div v-if="showBranchSelect" class="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 z-50 max-h-72 overflow-y-auto">
                <div class="py-2">
                  <p class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Выберите филиал</p>
                  <div class="space-y-0.5">
                    <div v-for="branch in allBranches" :key="branch.id" @click="handleSelectBranch(branch)" class="px-4 py-2.5 mx-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all" :class="{ 'bg-[#c2a886]/10 border-l-2 border-[#c2a886]': selectedBranch?.id === branch.id }">
                      <div class="flex items-center gap-2.5">
                        <div class="h-7 w-7 rounded-full bg-[#202c27]/5 flex items-center justify-center flex-shrink-0"><MapPin class="h-3 w-3 text-[#202c27]" /></div>
                        <div class="flex-1 min-w-0">
                          <div class="font-medium text-gray-900 text-sm">{{ branch.name }}</div>
                          <div v-if="branch.address" class="text-xs text-gray-500 truncate">{{ branch.address }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

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

    <!-- Контент -->
    <div v-if="!isLoading" class="px-5 py-5 space-y-4">

      <!-- Карточка: Коллективная баня -->
      <div
        v-if="bachelorContent && bachelorContent.title"
        class="bg-[#e3ded3] rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden"
      >
        <!-- Заголовок -->
        <div class="px-4 py-3 bg-[#d9cebc] border-b border-[#c2a886]/20">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-[#c2a886] to-[#b5976e] flex items-center justify-center shadow-sm flex-shrink-0">
              <Users class="h-4 w-4 text-white" />
            </div>
            <h2 class="font-semibold text-gray-900 text-[15px] leading-tight">
              {{ bachelorContent.title || "Коллективная баня" }}
            </h2>
          </div>
        </div>

        <!-- Двухколоночный контент -->
        <div class="flex">
          <!-- Фото слайдер -->
          <div
            ref="bachelorPhoto"
            class="w-[42%] flex-shrink-0 relative bg-[#202c27] overflow-hidden"
            :style="bachelorPhotoH ? { height: bachelorPhotoH + 'px' } : {}"
          >
            <template v-if="bachelorMedia.length > 0">
              <video
                v-if="bachelorMedia[bachelorMediaIdx].media_type === 'VIDEO'"
                :key="bachelorMedia[bachelorMediaIdx].id"
                :src="getMediaUrl(bachelorMedia[bachelorMediaIdx].id)"
                v-autoplay autoplay loop playsinline
                class="absolute inset-0 w-full h-full object-cover cursor-pointer"
                @click="lightboxUrl = getMediaUrl(bachelorMedia[bachelorMediaIdx].id); lightboxType = 'VIDEO'"
              />
              <img
                v-else
                :src="getMediaUrl(bachelorMedia[bachelorMediaIdx].id)"
                class="absolute inset-0 w-full h-full object-cover cursor-pointer"
                @click="lightboxUrl = getMediaUrl(bachelorMedia[bachelorMediaIdx].id); lightboxType = 'PHOTO'"
                @error="onImgError"
              />
              <div v-if="bachelorMedia.length > 1" class="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                <div
                  v-for="(_, i) in bachelorMedia" :key="i"
                  @click="bachelorMediaIdx = i"
                  :class="['h-1.5 rounded-full cursor-pointer transition-all duration-200', i === bachelorMediaIdx ? 'bg-[#c2a886] w-4' : 'bg-white/60 w-1.5']"
                />
              </div>
            </template>
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <Images class="h-8 w-8 text-[#c2a886]/30" />
            </div>
          </div>

          <!-- Инфо -->
          <div class="flex-1 p-3 flex flex-col gap-2 border-l border-[#c2a886]/15 overflow-hidden">
            <div v-if="bachelorContent.price" class="inline-flex">
              <div class="bg-[#d9cebc] border border-[#c2a886]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Wallet class="h-3.5 w-3.5 text-[#202c27] flex-shrink-0" />
                <span class="font-bold text-sm text-gray-900">{{ formatPrice(bachelorContent.price) }}</span>
                <span class="text-xs text-gray-600">/ гость</span>
              </div>
            </div>

            <div v-if="bachelorContent.content" class="flex-1 overflow-hidden">
              <div
                :class="['text-xs text-gray-600 leading-relaxed prose prose-xs max-w-none', !expandedBachelor && isContentLong(bachelorContent.content) ? 'line-clamp-4' : '']"
                v-html="formatContent(bachelorContent.content)"
              />
              <button
                v-if="isContentLong(bachelorContent.content)"
                @click="toggleBachelor"
                class="mt-1 text-xs text-[#c2a886] font-medium flex items-center gap-0.5"
              >
                {{ expandedBachelor ? "Свернуть" : "Развернуть" }}
                <ChevronDown :class="['h-3 w-3 transition-transform', expandedBachelor ? 'rotate-180' : '']" />
              </button>
            </div>
            <div v-else class="flex-1 flex items-center justify-center">
              <p class="text-gray-400 text-xs text-center">Информация скоро появится</p>
            </div>

            <button
              @click="openBooking('BACHELOR', 'Коллективная баня')"
              class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform mt-auto"
            >
              <CalendarCheck class="h-4 w-4" />
              <span>Забронировать</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Карточка: Девичники -->
      <div
        v-if="bacheloretteContent && bacheloretteContent.title"
        class="bg-[#e3ded3] rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden"
      >
        <!-- Заголовок -->
        <div class="px-4 py-3 bg-[#d9cebc] border-b border-[#c2a886]/20">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-[#d4b896] to-[#c2a886] flex items-center justify-center shadow-sm flex-shrink-0">
              <Flower2 class="h-4 w-4 text-white" />
            </div>
            <h2 class="font-semibold text-gray-900 text-[15px] leading-tight">
              {{ bacheloretteContent.title || "Девичники" }}
            </h2>
          </div>
        </div>

        <!-- Двухколоночный контент -->
        <div class="flex">
          <!-- Фото слайдер -->
          <div
            ref="bachelorettePhoto"
            class="w-[42%] flex-shrink-0 relative bg-[#202c27] overflow-hidden"
            :style="bachelorettePhotoH ? { height: bachelorettePhotoH + 'px' } : {}"
          >
            <template v-if="bacheloretteMedia.length > 0">
              <video
                v-if="bacheloretteMedia[bacheloretteMediaIdx].media_type === 'VIDEO'"
                :key="bacheloretteMedia[bacheloretteMediaIdx].id"
                :src="getMediaUrl(bacheloretteMedia[bacheloretteMediaIdx].id)"
                v-autoplay autoplay loop playsinline
                class="absolute inset-0 w-full h-full object-cover cursor-pointer"
                @click="lightboxUrl = getMediaUrl(bacheloretteMedia[bacheloretteMediaIdx].id); lightboxType = 'VIDEO'"
              />
              <img
                v-else
                :src="getMediaUrl(bacheloretteMedia[bacheloretteMediaIdx].id)"
                class="absolute inset-0 w-full h-full object-cover cursor-pointer"
                @click="lightboxUrl = getMediaUrl(bacheloretteMedia[bacheloretteMediaIdx].id); lightboxType = 'PHOTO'"
                @error="onImgError"
              />
              <div v-if="bacheloretteMedia.length > 1" class="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                <div
                  v-for="(_, i) in bacheloretteMedia" :key="i"
                  @click="bacheloretteMediaIdx = i"
                  :class="['h-1.5 rounded-full cursor-pointer transition-all duration-200', i === bacheloretteMediaIdx ? 'bg-[#c2a886] w-4' : 'bg-white/60 w-1.5']"
                />
              </div>
            </template>
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <Images class="h-8 w-8 text-[#c2a886]/30" />
            </div>
          </div>

          <!-- Инфо -->
          <div class="flex-1 p-3 flex flex-col gap-2 border-l border-[#c2a886]/15 overflow-hidden">
            <div v-if="bacheloretteContent.price" class="inline-flex">
              <div class="bg-[#d9cebc] border border-[#c2a886]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Wallet class="h-3.5 w-3.5 text-[#202c27] flex-shrink-0" />
                <span class="font-bold text-sm text-gray-900">{{ formatPrice(bacheloretteContent.price) }}</span>
                <span class="text-xs text-gray-600">/ гость</span>
              </div>
            </div>

            <div v-if="bacheloretteContent.content" class="flex-1 overflow-hidden">
              <div
                :class="['text-xs text-gray-600 leading-relaxed prose prose-xs max-w-none', !expandedBachelorette && isContentLong(bacheloretteContent.content) ? 'line-clamp-4' : '']"
                v-html="formatContent(bacheloretteContent.content)"
              />
              <button
                v-if="isContentLong(bacheloretteContent.content)"
                @click="toggleBachelorette"
                class="mt-1 text-xs text-[#c2a886] font-medium flex items-center gap-0.5"
              >
                {{ expandedBachelorette ? "Свернуть" : "Развернуть" }}
                <ChevronDown :class="['h-3 w-3 transition-transform', expandedBachelorette ? 'rotate-180' : '']" />
              </button>
            </div>
            <div v-else class="flex-1 flex items-center justify-center">
              <p class="text-gray-400 text-xs text-center">Информация скоро появится</p>
            </div>

            <button
              @click="openBooking('BACHELORETTE', 'Девичник')"
              class="w-full bg-gradient-to-r from-[#d4b896] to-[#c2a886] text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform mt-auto"
            >
              <CalendarCheck class="h-4 w-4" />
              <span>Забронировать</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Если оба пустые -->
      <div
        v-if="(!bachelorContent || !bachelorContent.title) && (!bacheloretteContent || !bacheloretteContent.title)"
        class="bg-[#e3ded3] rounded-2xl p-6 text-center border border-gray-200/80"
      >
        <PartyPopper class="h-7 w-7 text-[#c2a886] mx-auto mb-3" />
        <p class="text-gray-600 text-sm">Информация скоро появится</p>
      </div>
    </div>

    <!-- Декоративный элемент внизу -->
    <div class="relative h-8 mt-4">
      <div class="absolute inset-x-0 bottom-0 flex justify-center">
        <div
          class="h-px w-24 bg-gradient-to-r from-transparent via-[#c2a886]/30 to-transparent"
        ></div>
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
        <img
          v-else
          :src="lightboxUrl"
          class="max-w-full max-h-full object-contain"
          @click.stop
        />
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
import { mediaAPI, branchAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "BachelorPage",
  components: {
    ...icons,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      bachelorContent: null,
      bacheloretteContent: null,
      expandedBachelor: false,
      expandedBachelorette: false,
      bachelorMedia: [],
      bachelorMediaIdx: 0,
      bacheloretteMedia: [],
      bacheloretteMediaIdx: 0,
      bachelorPhotoH: 0,
      bachelorettePhotoH: 0,
      bachelorInterval: null,
      bacheloretteInterval: null,
      lightboxUrl: null,
      lightboxType: 'PHOTO',
      allBranches: [],
      showBranchSelect: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData"]),

    pageTitle() {
      return "Коллективная баня и девичники";
    },
  },
  methods: {
    ...mapActions(useAppStore, ["loadSiteContent", "selectBranch"]),

    async loadAllBranches() {
      try {
        const branches = await branchAPI.getAll();
        this.allBranches = branches.filter(b => b.is_active !== false);
      } catch {}
    },

    async handleSelectBranch(branch) {
      this.showBranchSelect = false;
      await this.selectBranch(branch);
    },

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

    startSlideIntervals() {
      if (this.bachelorMedia.length > 1) {
        this.bachelorInterval = setInterval(() => {
          this.bachelorMediaIdx = (this.bachelorMediaIdx + 1) % this.bachelorMedia.length;
        }, 4000);
      }
      if (this.bacheloretteMedia.length > 1) {
        this.bacheloretteInterval = setInterval(() => {
          this.bacheloretteMediaIdx = (this.bacheloretteMediaIdx + 1) % this.bacheloretteMedia.length;
        }, 4000);
      }
    },

    stopSlideIntervals() {
      clearInterval(this.bachelorInterval);
      clearInterval(this.bacheloretteInterval);
    },

    toggleBachelor() {
      if (!this.expandedBachelor) {
        this.bachelorPhotoH = this.$refs.bachelorPhoto?.offsetHeight || 0;
      } else {
        this.bachelorPhotoH = 0;
      }
      this.expandedBachelor = !this.expandedBachelor;
    },

    toggleBachelorette() {
      if (!this.expandedBachelorette) {
        this.bachelorettePhotoH = this.$refs.bachelorettePhoto?.offsetHeight || 0;
      } else {
        this.bachelorettePhotoH = 0;
      }
      this.expandedBachelorette = !this.expandedBachelorette;
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
      try {
        const [bRes, brRes] = await Promise.allSettled([
          mediaAPI.getBySection("BACHELOR", params),
          mediaAPI.getBySection("BACHELORETTE", params),
        ]);
        this.bachelorMedia = bRes.status === "fulfilled"
          ? (bRes.value.items || []).filter(i => i.is_active)
          : [];
        this.bacheloretteMedia = brRes.status === "fulfilled"
          ? (brRes.value.items || []).filter(i => i.is_active)
          : [];
      } catch (e) {
        // медиа не критично
      }
    },
  },
  async created() {
    try {
      await this.loadContent();
      await Promise.all([this.loadMedia(), this.loadAllBranches()]);
      this.startSlideIntervals();
    } catch (error) {
      this.error = error.message || "Ошибка при загрузке страницы";
    }
  },

  beforeUnmount() {
    this.stopSlideIntervals();
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
  line-clamp: 4;
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
