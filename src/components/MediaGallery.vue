<template>
  <div class="media-gallery">
    <!-- Фильтры по категориям -->
    <div
      v-if="categories && categories.length > 1"
      class="px-4 py-3 bg-white border-b border-gray-100"
    >
      <div class="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectCategory(category.value)"
          :class="[
            'px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center',
            selectedCategory === category.value
              ? 'bg-[#4e5d51] text-white font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          <span v-if="category.icon" class="mr-2">{{ category.icon }}</span>
          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- Типы медиа (фото/видео) -->
    <div
      v-if="showMediaTypeFilter && currentMedia.length > 0"
      class="px-4 py-2 bg-gray-50 border-b border-gray-200"
    >
      <div class="flex space-x-2">
        <button
          @click="selectedMediaType = 'all'"
          :class="[
            'px-3 py-1.5 rounded-full text-sm transition-all duration-200',
            selectedMediaType === 'all'
              ? 'bg-[#4e5d51] text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400',
          ]"
        >
          Все
        </button>
        <button
          v-if="hasPhotos"
          @click="selectedMediaType = 'PHOTO'"
          :class="[
            'px-3 py-1.5 rounded-full text-sm transition-all duration-200',
            selectedMediaType === 'PHOTO'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400',
          ]"
        >
          📸 Фото
        </button>
        <button
          v-if="hasVideos"
          @click="selectedMediaType = 'VIDEO'"
          :class="[
            'px-3 py-1.5 rounded-full text-sm transition-all duration-200',
            selectedMediaType === 'VIDEO'
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400',
          ]"
        >
          🎬 Видео
        </button>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="relative">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
        ></div>
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-[#4e5d51] border-t-transparent absolute top-0 left-0"
        ></div>
      </div>
    </div>

    <!-- Галлерея -->
    <div v-else-if="filteredMedia.length > 0" class="p-2">
      <!-- Сетка медиа -->
      <div class="grid grid-cols-3 gap-1">
        <div
          v-for="(item, index) in filteredMedia"
          :key="item.id"
          @click="openLightbox(index)"
          class="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity duration-200 relative group"
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
            class="w-full h-full bg-black flex items-center justify-center relative"
          >
            <div
              class="w-full h-full bg-gradient-to-br from-gray-800 to-black"
            ></div>

            <!-- Иконка воспроизведения -->
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-200"
            >
              <div
                class="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200"
              >
                <svg
                  class="w-6 h-6 text-gray-800 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Индикатор типа медиа -->
          <div
            class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded"
          >
            {{ item.media_type === "VIDEO" ? "🎬" : "📸" }}
          </div>

          <!-- Заголовок при наведении -->
          <div
            v-if="item.title"
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black to-transparent text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <p class="text-xs truncate">{{ item.title }}</p>
          </div>
        </div>
      </div>

      <!-- Количество медиа -->
      <div class="text-center py-4 text-sm text-gray-600">
        Показано {{ filteredMedia.length }} из {{ currentMedia.length }}
        <span v-if="selectedMediaType !== 'all'">
          {{ selectedMediaType === "PHOTO" ? "фотографий" : "видео" }}
        </span>
      </div>
    </div>

    <!-- Сообщение, если медиа нет -->
    <div v-else class="text-center py-12">
      <div class="text-5xl mb-4">📸</div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Медиа скоро появятся
      </h3>
      <p class="text-gray-600">Мы работаем над наполнением галереи</p>
    </div>

    <!-- Лайтбокс -->
    <div
      v-if="showLightbox"
      class="fixed inset-0 bg-black bg-opacity-95 z-[100] overflow-y-auto flex items-center justify-center"
      @click.self="closeLightbox"
    >
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- Кнопка закрытия -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 text-white z-10 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Навигация -->
        <button
          v-if="filteredMedia.length > 1"
          @click="prevMedia"
          class="absolute left-4 text-white z-10 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          v-if="filteredMedia.length > 1"
          @click="nextMedia"
          class="absolute right-4 text-white z-10 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Контент лайтбокса -->
        <div class="max-w-4xl max-h-[90vh] w-full p-4">
          <div class="relative">
            <!-- Изображение -->
            <img
              v-if="currentLightboxMedia.media_type === 'PHOTO'"
              :src="getMediaUrl(currentLightboxMedia.id)"
              :alt="currentLightboxMedia.title || 'Фото'"
              class="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg"
            />

            <!-- Видео -->
            <video
              v-else-if="currentLightboxMedia.media_type === 'VIDEO'"
              :src="getMediaUrl(currentLightboxMedia.id)"
              controls
              autoplay
              class="max-w-full max-h-[70vh] mx-auto rounded-lg"
            ></video>

            <!-- Информация о медиа -->
            <div
              v-if="currentLightboxMedia.title"
              class="mt-4 text-white max-w-2xl mx-auto"
            >
              <h3 class="text-xl font-semibold mb-2">
                {{ currentLightboxMedia.title }}
              </h3>
            </div>
          </div>

          <!-- Индикатор прогресса -->
          <div v-if="filteredMedia.length > 1" class="mt-6">
            <div class="flex justify-center space-x-2 mb-2">
              <div
                v-for="(item, index) in filteredMedia"
                :key="item.id"
                @click="currentIndex = index"
                :class="[
                  'w-2 h-2 rounded-full cursor-pointer transition-all duration-200',
                  currentIndex === index
                    ? 'bg-white w-4'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75',
                ]"
              ></div>
            </div>
            <p class="text-white text-center text-sm">
              {{ currentIndex + 1 }} / {{ filteredMedia.length }}
              <span class="text-gray-400 ml-2">
                {{
                  currentLightboxMedia.media_type === "VIDEO"
                    ? "🎬 Видео"
                    : "📸 Фото"
                }}
              </span>
            </p>
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

export default {
  name: "MediaGallery",
  props: {
    // Категории для загрузки (например: ['BACHELOR', 'BACHELORETTE'])
    sections: {
      type: Array,
      required: true,
    },

    // Показывать фильтр по типу медиа
    showMediaTypeFilter: {
      type: Boolean,
      default: true,
    },

    // Начальная категория
    initialSection: {
      type: String,
      default: null,
    },

    // Лейблы для категорий
    categoryLabels: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      isLoading: false,
      error: null,
      mediaData: {}, // { 'BACHELOR': [...], 'BACHELORETTE': [...] }
      selectedCategory: this.initialSection || "all",
      selectedMediaType: "all",
      showLightbox: false,
      currentIndex: 0,
    };
  },

  computed: {
    ...mapState(useAppStore, ["selectedBranch"]),

    categories() {
      const cats = [
        {
          value: "all",
          label: "Все",
          icon: "",
        },
      ];

      this.sections.forEach((section) => {
        const label =
          this.categoryLabels[section] || this.getDefaultLabel(section);
        const icon = this.getDefaultIcon(section);

        cats.push({
          value: section,
          label: label,
          icon: icon,
        });
      });

      return cats;
    },

    currentMedia() {
      if (this.selectedCategory === "all") {
        // Объединяем все медиа
        return Object.values(this.mediaData).flat();
      } else {
        return this.mediaData[this.selectedCategory] || [];
      }
    },

    filteredMedia() {
      let items = this.currentMedia;

      // Фильтрация по типу медиа
      if (this.selectedMediaType !== "all") {
        items = items.filter(
          (item) => item.media_type === this.selectedMediaType
        );
      }

      // Сортируем по display_order
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

        // Формируем объект { 'BACHELOR': [...], 'BACHELORETTE': [...] }
        this.mediaData = {};
        results.forEach(({ section, items }) => {
          // Фильтруем только активные медиа
          this.mediaData[section] = items.filter((item) => item.is_active);
        });

        console.log("Загружено медиа:", this.mediaData);
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

    openLightbox(index) {
      this.currentIndex = index;
      this.showLightbox = true;
      // Блокируем скролл страницы на фоне
      document.body.style.overflow = "hidden";
    },

    closeLightbox() {
      this.showLightbox = false;
      // Разблокируем скролл страницы
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
      // URL для получения медиа файла (публичный эндпоинт - только активные)
      return mediaAPI.getDownloadUrl(mediaId);
    },

    onImageError(event) {
      event.target.src =
        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
    },

    getDefaultLabel(section) {
      const labels = {
        BACHELOR: "Мальчишники",
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

    getDefaultIcon(section) {
      const icons = {
        BACHELOR: "👔",
        BACHELORETTE: "👗",
        COLLECTIVE: "👥",
        AUTHOR: "✨",
        CERTIFICATE: "🎁",
        BATH_CLUB: "♨️",
        BUSINESS_BATH: "🏢",
        FIRST_TIME: "🌟",
        LOYALTY: "💝",
      };
      return icons[section] || "📸";
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
    // Обработка клавиш для навигации
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

    // Сохраняем ссылку для удаления в beforeUnmount
    this._handleKeydown = handleKeydown;
  },

  beforeUnmount() {
    // Удаляем обработчик при размонтировании
    if (this._handleKeydown) {
      window.removeEventListener("keydown", this._handleKeydown);
    }
    // Разблокируем скролл на случай если лайтбокс был открыт
    document.body.style.overflow = "";
  },
};
</script>

<style scoped>
.media-gallery {
  height: 100%;
  min-height: 300px;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Плавные переходы для сетки */
.grid > div {
  transition: transform 0.2s ease;
}

.grid > div:hover {
  transform: scale(0.98);
}
</style>
