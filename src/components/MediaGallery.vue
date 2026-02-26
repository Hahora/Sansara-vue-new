<template>
  <div class="media-gallery bg-[#edeae6]">
    <!-- Фильтры по категориям -->
    <div
      v-if="categories && categories.length > 1"
      class="px-5 py-3 bg-[#e3ded3] border-b border-[#c2a886]/20"
    >
      <div class="flex space-x-2 overflow-x-scroll pb-1 scrollbar-thin">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectCategory(category.value)"
          :class="[
            'px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 flex items-center text-sm font-medium flex-shrink-0',
            selectedCategory === category.value
              ? 'bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white shadow-md'
              : 'bg-[#d9cebc] text-gray-700 hover:bg-[#c2a886]/30',
          ]"
        >
          <!-- Иконки вместо эмодзи -->
          <Users v-if="category.icon === 'BACHELOR'" class="h-4 w-4 mr-2" />
          <Flower2
            v-else-if="category.icon === 'BACHELORETTE'"
            class="h-4 w-4 mr-2"
          />
          <UsersRound
            v-else-if="category.icon === 'COLLECTIVE'"
            class="h-4 w-4 mr-2"
          />
          <Wand2 v-else-if="category.icon === 'AUTHOR'" class="h-4 w-4 mr-2" />
          <Gift
            v-else-if="category.icon === 'CERTIFICATE'"
            class="h-4 w-4 mr-2"
          />
          <Sparkles
            v-else-if="category.icon === 'BATH_CLUB'"
            class="h-4 w-4 mr-2"
          />
          <Briefcase
            v-else-if="category.icon === 'BUSINESS_BATH'"
            class="h-4 w-4 mr-2"
          />
          <Star
            v-else-if="category.icon === 'FIRST_TIME'"
            class="h-4 w-4 mr-2"
          />
          <Award v-else-if="category.icon === 'LOYALTY'" class="h-4 w-4 mr-2" />

          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- Типы медиа (фото/видео) -->
    <div
      v-if="showMediaTypeFilter && currentMedia.length > 0"
      class="px-5 py-2.5 bg-[#d9cebc]/60 border-b border-[#c2a886]/20"
    >
      <div class="flex space-x-2">
        <button
          @click="selectedMediaType = 'all'"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm transition-all duration-300 font-medium',
            selectedMediaType === 'all'
              ? 'bg-[#c2a886] text-white shadow-sm'
              : 'bg-white/60 text-gray-700 border border-[#c2a886]/20 hover:bg-white',
          ]"
        >
          Все
        </button>
        <button
          v-if="hasPhotos"
          @click="selectedMediaType = 'PHOTO'"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm transition-all duration-300 font-medium flex items-center gap-1.5',
            selectedMediaType === 'PHOTO'
              ? 'bg-[#c2a886] text-white shadow-sm'
              : 'bg-white/60 text-gray-700 border border-[#c2a886]/20 hover:bg-white',
          ]"
        >
          <Camera class="h-3.5 w-3.5" /> Фото
        </button>
        <button
          v-if="hasVideos"
          @click="selectedMediaType = 'VIDEO'"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm transition-all duration-300 font-medium flex items-center gap-1.5',
            selectedMediaType === 'VIDEO'
              ? 'bg-[#c2a886] text-white shadow-sm'
              : 'bg-white/60 text-gray-700 border border-[#c2a886]/20 hover:bg-white',
          ]"
        >
          <Video class="h-3.5 w-3.5" /> Видео
        </button>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="flex flex-col items-center">
        <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-3" />
        <p class="text-sm text-gray-600 font-light">Загружаем галерею...</p>
      </div>
    </div>

    <!-- Галерея -->
    <div v-else-if="filteredMedia.length > 0" class="p-3">
      <!-- Сетка медиа -->
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="(item, index) in filteredMedia"
          :key="item.id"
          @click="handleItemClick($event, index)"
          class="aspect-square bg-[#d9cebc] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 relative group hover:shadow-lg active:scale-95"
        >
          <!-- Фото -->
          <img
            v-if="item.media_type === 'PHOTO'"
            :src="getMediaUrl(item.id)"
            :alt="item.title || 'Фото'"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="onImageError"
          />

          <!-- Видео превью -->
          <div
            v-else-if="item.media_type === 'VIDEO'"
            class="w-full h-full relative"
          >
            <!-- iOS: controls без playsinline → нативный iOS плеер при тапе -->
            <video
              v-if="isIOS"
              :src="getMediaUrl(item.id)"
              :poster="item.preview_file_id ? getMediaUrl(item.preview_file_id) : undefined"
              controls
              preload="none"
              class="w-full h-full object-cover"
              @click.stop="onIOSVideoClick($event, item)"
              @play="addDebug('▶ play event: ' + item.id)"
              @error="onVideoError($event, item)"
            ></video>
            <!-- Не-iOS: автовоспроизведение превью без звука -->
            <video
              v-else
              :src="getMediaUrl(item.id)"
              :muted="true"
              autoplay
              loop
              playsinline
              preload="metadata"
              class="w-full h-full object-cover"
              @loadstart="e => e.target.muted = true"
            ></video>
            <!-- Иконка видео (только не-iOS, у iOS есть нативные controls) -->
            <div v-if="!isIOS" class="absolute top-2 left-2 bg-[#202c27]/70 rounded-md px-1.5 py-0.5 flex items-center gap-1">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>

          <!-- Индикатор типа медиа -->
          <div
            class="absolute top-2 right-2 bg-[#202c27]/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1"
          >
            <Video v-if="item.media_type === 'VIDEO'" class="h-3 w-3" />
            <Camera v-else class="h-3 w-3" />
          </div>

          <!-- Заголовок при наведении -->
          <div
            v-if="item.title"
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#202c27] via-[#202c27]/90 to-transparent text-white p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <p class="text-xs font-light truncate">{{ item.title }}</p>
          </div>
        </div>
      </div>

      <!-- Количество медиа -->
      <div class="text-center py-4 text-sm text-gray-600 font-light">
        Показано {{ filteredMedia.length }} из {{ currentMedia.length }}
        <span v-if="selectedMediaType !== 'all'">
          {{ selectedMediaType === "PHOTO" ? "фотографий" : "видео" }}
        </span>
      </div>
    </div>

    <!-- Сообщение, если медиа нет -->
    <div v-else class="text-center py-12 px-5">
      <div
        class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Images class="h-8 w-8 text-[#c2a886]" />
      </div>
      <h3 class="text-base font-semibold text-gray-900 mb-2">
        Галерея скоро появится
      </h3>
      <p class="text-sm text-gray-600 leading-relaxed">
        Мы работаем над наполнением фотографиями и видео
      </p>
    </div>

    <!-- Лайтбокс -->
    <div
      v-if="showLightbox"
      class="fixed inset-0 bg-[#202c27]/95 backdrop-blur-sm z-[100] overflow-y-auto flex items-center justify-center"
      @click.self="closeLightbox"
    >
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- Кнопка закрытия -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 text-white z-10 p-3 bg-[#202c27]/60 hover:bg-[#202c27]/80 backdrop-blur-sm rounded-full transition-all duration-300 border border-white/10"
        >
          <X class="w-6 h-6" />
        </button>

        <!-- Навигация -->
        <button
          v-if="filteredMedia.length > 1"
          @click="prevMedia"
          class="absolute left-4 text-white z-10 p-3 bg-[#202c27]/60 hover:bg-[#202c27]/80 backdrop-blur-sm rounded-full transition-all duration-300 border border-white/10"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>

        <button
          v-if="filteredMedia.length > 1"
          @click="nextMedia"
          class="absolute right-4 text-white z-10 p-3 bg-[#202c27]/60 hover:bg-[#202c27]/80 backdrop-blur-sm rounded-full transition-all duration-300 border border-white/10"
        >
          <ChevronRight class="w-6 h-6" />
        </button>

        <!-- Контент лайтбокса -->
        <div class="max-w-4xl max-h-[90vh] w-full p-4">
          <div class="relative">
            <!-- Изображение -->
            <img
              v-if="currentLightboxMedia.media_type === 'PHOTO'"
              :src="getMediaUrl(currentLightboxMedia.id)"
              :alt="currentLightboxMedia.title || 'Фото'"
              class="max-w-full max-h-[70vh] object-contain mx-auto rounded-xl shadow-2xl"
            />

            <!-- Видео (со звуком в лайтбоксе) -->
            <video
              v-else-if="currentLightboxMedia.media_type === 'VIDEO'"
              :key="currentLightboxMedia.id"
              :src="getMediaUrl(currentLightboxMedia.id)"
              controls
              autoplay
              playsinline
              class="max-w-full max-h-[70vh] mx-auto rounded-xl shadow-2xl"
            ></video>

            <!-- Информация о медиа -->
            <div
              v-if="currentLightboxMedia.title"
              class="mt-4 text-white max-w-2xl mx-auto bg-[#202c27]/60 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <h3 class="text-lg font-light tracking-wide">
                {{ currentLightboxMedia.title }}
              </h3>
            </div>
          </div>

          <!-- Индикатор прогресса -->
          <div
            v-if="filteredMedia.length > 1"
            class="mt-6 flex flex-col items-center"
          >
            <div class="flex justify-center space-x-2 mb-3">
              <div
                v-for="(item, index) in filteredMedia"
                :key="item.id"
                @click="currentIndex = index"
                :class="[
                  'h-1.5 rounded-full cursor-pointer transition-all duration-300',
                  currentIndex === index
                    ? 'bg-[#c2a886] w-8'
                    : 'bg-white/30 hover:bg-white/50 w-1.5',
                ]"
              ></div>
            </div>
            <div class="bg-[#202c27]/60 backdrop-blur-sm rounded-lg px-4 py-2">
              <p
                class="text-white text-center text-sm font-light flex items-center justify-center gap-2"
              >
                {{ currentIndex + 1 }} / {{ filteredMedia.length }}
                <span class="text-[#c2a886] flex items-center gap-1">
                  <Video
                    v-if="currentLightboxMedia.media_type === 'VIDEO'"
                    class="h-3.5 w-3.5"
                  />
                  <Camera v-else class="h-3.5 w-3.5" />
                  {{
                    currentLightboxMedia.media_type === "VIDEO"
                      ? "Видео"
                      : "Фото"
                  }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mediaAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import icons from "@/utils/icons";

export default {
  name: "MediaGallery",
  components: {
    ...icons,
  },
  props: {
    sections: {
      type: Array,
      required: true,
    },
    showMediaTypeFilter: {
      type: Boolean,
      default: true,
    },
    initialSection: {
      type: String,
      default: null,
    },
    categoryLabels: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      isLoading: false,
      error: null,
      mediaData: {},
      selectedCategory: this.initialSection || "all",
      selectedMediaType: "all",
      showLightbox: false,
      currentIndex: 0,
      isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
      iosDebug: [],
    };
  },

  computed: {
    ...mapState(useAppStore, ["selectedBranch"]),

    categories() {
      const cats = [
        {
          value: "all",
          label: "Все",
          icon: null,
        },
      ];

      this.sections.forEach((section) => {
        const label =
          this.categoryLabels[section] || this.getDefaultLabel(section);

        cats.push({
          value: section,
          label: label,
          icon: section,
        });
      });

      return cats;
    },

    currentMedia() {
      if (this.selectedCategory === "all") {
        return Object.values(this.mediaData).flat();
      } else {
        return this.mediaData[this.selectedCategory] || [];
      }
    },

    filteredMedia() {
      let items = this.currentMedia;

      if (this.selectedMediaType !== "all") {
        items = items.filter(
          (item) => item.media_type === this.selectedMediaType
        );
      }

      return items.sort((a, b) => a.display_order - b.display_order);
    },

    currentLightboxMedia() {
      return this.filteredMedia[this.currentIndex] || {};
    },

    hasPhotos() {
      return this.currentMedia.some((item) => item.media_type === "PHOTO");
    },

    hasVideos() {
      return this.currentMedia.some((item) => item.media_type === "VIDEO");
    },
  },

  methods: {
    async loadMedia() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка медиа для разделов:", this.sections);

        const promises = this.sections.map(async (section) => {
          try {
            const params = {};
            if (this.selectedBranch?.id) {
              params.branch_id = this.selectedBranch.id;
            }

            const data = await mediaAPI.getBySection(section, params);
            return { section, items: data.items || [] };
          } catch (error) {
            console.error(`Ошибка загрузки медиа для ${section}:`, error);
            return { section, items: [] };
          }
        });

        const results = await Promise.all(promises);

        this.mediaData = {};
        results.forEach(({ section, items }) => {
          this.mediaData[section] = items.filter((item) => item.is_active);
        });

        console.log("Загружено медиа:", this.mediaData);

        // Дебаг — инфа о загруженных видео
        const allItems = Object.values(this.mediaData).flat();
        const videos = allItems.filter(i => i.media_type === "VIDEO");
        this.addDebug(`Loaded: ${allItems.length} items, ${videos.length} videos`);
        if (videos.length > 0) {
          const v = videos[0];
          this.addDebug(`video[0]: id=${v.id}, preview_file_id=${v.preview_file_id}`);
          if (v.preview_file_id) {
            this.addDebug(`posterURL: ...${this.getMediaUrl(v.preview_file_id).slice(-40)}`);
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке медиа:", error);
        this.error = error.message || "Не удалось загрузить медиа";
      } finally {
        this.isLoading = false;
      }
    },

    selectCategory(category) {
      this.selectedCategory = category;
      this.showLightbox = false;
      this.currentIndex = 0;
    },

    addDebug(msg) {
      const time = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      this.iosDebug.unshift(`[${time}] ${msg}`);
      if (this.iosDebug.length > 15) this.iosDebug.pop();
    },

    onIOSVideoClick(event, item) {
      const video = event.currentTarget;
      this.addDebug(`tap video ${item.id}, readyState=${video.readyState}, hasWEFS=${typeof video.webkitEnterFullscreen === "function"}`);
      // controls нативные уже обработают tap, но дополнительно пробуем webkitEnterFullscreen
      if (typeof video.webkitEnterFullscreen === "function") {
        try {
          video.webkitEnterFullscreen();
          this.addDebug("webkitEnterFullscreen() OK");
        } catch (err) {
          this.addDebug(`webkitEnterFullscreen ERR: ${err.name}: ${err.message}`);
          // Fallback
          video.removeAttribute("playsinline");
          video.muted = false;
          video.play()
            .then(() => this.addDebug("play() resolved"))
            .catch(e => this.addDebug(`play() ERR: ${e.name}: ${e.message}`));
        }
      } else {
        this.addDebug("webkitEnterFullscreen NOT available, trying play()");
        video.removeAttribute("playsinline");
        video.muted = false;
        video.play()
          .then(() => this.addDebug("play() resolved"))
          .catch(e => this.addDebug(`play() ERR: ${e.name}: ${e.message}`));
      }
    },

    onVideoError(event, item) {
      const err = event.target.error;
      const code = err ? err.code : "?";
      const msg = err ? err.message : "unknown";
      const src = event.target.src || "";
      this.addDebug(`video error ${item.id}: code=${code} "${msg}" src=${src.slice(-30)}`);
    },

    handleItemClick(_event, index) {
      const item = this.filteredMedia[index];
      // iOS видео обрабатываются нативно через controls (click.stop на video)
      if (this.isIOS && item.media_type === "VIDEO") return;
      this.openLightbox(index);
    },

    openLightbox(index) {
      this.currentIndex = index;
      this.showLightbox = true;
      document.body.style.overflow = "hidden";
    },

    closeLightbox() {
      this.showLightbox = false;
      document.body.style.overflow = "";
    },

    prevMedia() {
      this.currentIndex =
        this.currentIndex > 0
          ? this.currentIndex - 1
          : this.filteredMedia.length - 1;
    },

    nextMedia() {
      this.currentIndex =
        this.currentIndex < this.filteredMedia.length - 1
          ? this.currentIndex + 1
          : 0;
    },

    getMediaUrl(mediaId) {
      return mediaAPI.getDownloadUrl(mediaId);
    },

    onImageError(event) {
      event.target.src =
        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
    },

    getDefaultLabel(section) {
      const labels = {
        BACHELOR: "Коллективная баня",
        BACHELORETTE: "Девичники",
        COLLECTIVE: "Коллективные",
        AUTHOR: "Авторские",
        CERTIFICATE: "Сертификаты",
        BATH_CLUB: "Банный клуб",
        BUSINESS_BATH: "Бизнес-баня",
        FIRST_TIME: "Первый раз",
        LOYALTY: "Лояльность",
      };
      return labels[section] || section;
    },
  },

  async created() {
    console.log("MediaGallery created");
    await this.loadMedia();
  },

  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log("Филиал изменился, перезагружаем медиа:", newBranchId);
        this.loadMedia();
      },
    },
  },

  mounted() {
    // Дебаг — сразу показываем ключевую инфу
    const ua = navigator.userAgent;
    this.addDebug(`UA: ${ua.slice(0, 90)}`);
    this.addDebug(`isIOS=${this.isIOS} | Telegram=${ua.includes("Telegram")}`);

    const handleKeydown = (e) => {
      if (!this.showLightbox) return;

      switch (e.key) {
        case "Escape":
          this.closeLightbox();
          break;
        case "ArrowLeft":
          this.prevMedia();
          break;
        case "ArrowRight":
          this.nextMedia();
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    this._handleKeydown = handleKeydown;
  },

  beforeUnmount() {
    if (this._handleKeydown) {
      window.removeEventListener("keydown", this._handleKeydown);
    }
    document.body.style.overflow = "";
  },
};
</script>

<style scoped>
.media-gallery {
  min-height: 300px;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(194, 168, 134, 0.1);
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(194, 168, 134, 0.5);
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(194, 168, 134, 0.7);
}

.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(194, 168, 134, 0.5) rgba(194, 168, 134, 0.1);
}

/* Плавные переходы для карточек */
.grid > div {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
