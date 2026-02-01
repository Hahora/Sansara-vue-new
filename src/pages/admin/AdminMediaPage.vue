<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
    <!-- Шапка -->
    <div
      class="bg-gradient-to-br from-[#4e5d51] via-[#5a6d5e] to-[#4e5d51] text-white px-5 py-6"
    >
      <div class="flex items-center mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white hover:text-gray-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">Назад</span>
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white border-opacity-30"
          >
            🖼️
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление медиа</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ mediaItems.length }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка обновления -->
          <button
            @click="loadMedia"
            :disabled="isLoading"
            class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-lg transition-all active:scale-98 disabled:opacity-50"
            title="Обновить список"
          >
            <svg
              :class="{ 'animate-spin': isLoading }"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <!-- Кнопка загрузки -->
          <button
            @click="showUploadModal = true"
            class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all active:scale-98 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="px-4 py-4 space-y-3">
      <!-- Раздел меню -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Раздел меню</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.section = null;
              applyFilters();
            "
            :class="
              filters.section === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все разделы
          </button>
          <button
            v-for="section in menuSections"
            :key="section.value"
            @click="
              filters.section = section.value;
              applyFilters();
            "
            :class="
              filters.section === section.value
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            {{ section.label }}
          </button>
        </div>
      </div>

      <!-- Филиал -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Филиал</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.branch_id = null;
              applyFilters();
            "
            :class="
              filters.branch_id === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все филиалы
          </button>
          <button
            v-for="branch in branches"
            :key="branch.id"
            @click="
              filters.branch_id = branch.id;
              applyFilters();
            "
            :class="
              filters.branch_id === branch.id
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            {{ branch.name }}
          </button>
        </div>
      </div>

      <!-- Тип медиа -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Тип медиа</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.media_type = null;
              applyFilters();
            "
            :class="
              filters.media_type === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все типы
          </button>
          <button
            v-for="type in mediaTypes"
            :key="type.value"
            @click="
              filters.media_type = type.value;
              applyFilters();
            "
            :class="
              filters.media_type === type.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            {{ type.icon }} {{ type.label }}
          </button>
        </div>
      </div>

      <!-- Сброс фильтров -->
      <div
        v-if="hasActiveFilters"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-gray-700">
            Активные фильтры:
            <span class="text-amber-600 font-semibold">{{
              activeFiltersCount
            }}</span>
          </div>
          <button
            @click="clearAllFilters"
            class="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Сбросить все
          </button>
        </div>
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

    <!-- Ошибка -->
    <div
      v-else-if="error"
      class="mx-4 mt-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm"
    >
      <div class="flex items-start">
        <svg
          class="h-5 w-5 text-red-500 mt-0.5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Список медиа -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик -->
      <div class="mb-3">
        <div class="text-sm text-gray-600">
          Найдено: <span class="font-semibold">{{ filteredMedia.length }}</span>
        </div>
      </div>

      <!-- Медиа -->
      <div v-if="filteredMedia.length > 0" class="grid grid-cols-2 gap-3">
        <div
          v-for="item in filteredMedia"
          :key="item.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Превью медиа -->
          <div class="relative aspect-square bg-gray-100">
            <!-- Фото -->
            <img
              v-if="item.media_type === 'PHOTO'"
              :src="getMediaUrl(item.id)"
              :alt="item.title || 'Медиа'"
              class="w-full h-full object-cover"
              @error="onImageError"
            />

            <!-- Видео -->
            <div
              v-else-if="item.media_type === 'VIDEO'"
              class="w-full h-full flex items-center justify-center bg-gray-200"
            >
              <svg
                class="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"
                />
              </svg>
            </div>

            <!-- Документ -->
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-200"
            >
              <svg
                class="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Бейдж типа -->
            <div class="absolute top-2 left-2 flex gap-1">
              <span
                :class="getMediaTypeBadgeClass(item.media_type)"
                class="text-xs px-2 py-1 rounded font-semibold"
              >
                {{ getMediaTypeLabel(item.media_type) }}
              </span>

              <!-- Статус активности -->
              <span
                v-if="item.is_active"
                class="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold"
              >
                ✓ Активно
              </span>
              <span
                v-else
                class="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold"
              >
                ✕ Неактивно
              </span>
            </div>

            <!-- Кнопка удаления -->
            <button
              @click="confirmDelete(item)"
              class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all active:scale-95 shadow-lg"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Информация -->
          <div class="p-3">
            <div class="text-sm font-semibold text-gray-900 truncate mb-1">
              {{ item.title || item.original_filename || "Без названия" }}
            </div>

            <div class="flex flex-wrap items-center gap-1 mb-2">
              <!-- Раздел -->
              <span
                class="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200"
              >
                {{ getSectionLabel(item.menu_section) }}
              </span>

              <!-- Филиал -->
              <span
                v-if="item.branch_id"
                class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200"
              >
                {{ getBranchName(item.branch_id) }}
              </span>
            </div>

            <div class="text-xs text-gray-500">
              <div>Порядок: {{ item.display_order }}</div>
              <div class="truncate">{{ formatFileSize(item.file_size) }}</div>
            </div>

            <!-- Кнопка редактирования -->
            <button
              @click="openEditModal(item)"
              class="w-full mt-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              Редактировать
            </button>
          </div>
        </div>
      </div>

      <!-- Нет медиа -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">🖼️</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет медиа</h3>
        <p class="text-sm text-gray-600 mb-4">
          {{
            hasActiveFilters
              ? "По выбранным фильтрам медиа не найдено"
              : "Загрузите первый файл"
          }}
        </p>
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="text-sm text-[#4e5d51] hover:text-[#3d4a40] font-medium"
        >
          Сбросить фильтры
        </button>
        <button
          v-else
          @click="showUploadModal = true"
          class="bg-[#4e5d51] hover:bg-[#3d4a40] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Загрузить медиа
        </button>
      </div>
    </div>

    <!-- Модальные окна -->
    <UploadMediaModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @uploaded="onMediaUploaded"
    />

    <EditMediaModal
      v-if="editingMedia"
      :media="editingMedia"
      @close="editingMedia = null"
      @updated="onMediaUpdated"
    />
  </div>
</template>

<script>
import { mediaAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import UploadMediaModal from "@/components/admin/media/UploadMediaModal.vue";
import EditMediaModal from "@/components/admin/media/EditMediaModal.vue";

export default {
  name: "AdminMediaPage",
  components: {
    UploadMediaModal,
    EditMediaModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      mediaItems: [],
      filters: {
        section: null,
        branch_id: null,
        media_type: null,
      },
      showUploadModal: false,
      editingMedia: null,

      menuSections: [
        { value: "BACHELOR", label: "Коллективная баня" },
        { value: "BACHELORETTE", label: "Девичник" },
        { value: "COLLECTIVE", label: "Коллективная программа" },
        { value: "AUTHOR", label: "Авторская программа" },
        { value: "CERTIFICATE", label: "Сертификаты" },
        { value: "BATH_CLUB", label: "Банный клуб" },
        { value: "BUSINESS_BATH", label: "Бизнес-баня" },
        { value: "FIRST_TIME", label: "Первый раз" },
        { value: "LOYALTY", label: "Лояльность" },
      ],

      mediaTypes: [
        { value: "PHOTO", label: "Фото", icon: "📷" },
        { value: "VIDEO", label: "Видео", icon: "🎥" },
        { value: "DOCUMENT", label: "Документ", icon: "📄" },
      ],
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),

    filteredMedia() {
      let filtered = this.mediaItems;

      if (this.filters.section) {
        filtered = filtered.filter(
          (item) => item.menu_section === this.filters.section
        );
      }

      if (this.filters.branch_id !== null) {
        filtered = filtered.filter(
          (item) => item.branch_id === this.filters.branch_id
        );
      }

      if (this.filters.media_type) {
        filtered = filtered.filter(
          (item) => item.media_type === this.filters.media_type
        );
      }

      // Сортируем по display_order
      return filtered.sort((a, b) => a.display_order - b.display_order);
    },

    hasActiveFilters() {
      return (
        this.filters.section !== null ||
        this.filters.branch_id !== null ||
        this.filters.media_type !== null
      );
    },

    activeFiltersCount() {
      let count = 0;
      if (this.filters.section) count++;
      if (this.filters.branch_id !== null) count++;
      if (this.filters.media_type) count++;
      return count;
    },
  },
  methods: {
    async loadMedia() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка медиа...");

        // Если выбран раздел - используем эндпоинт с секцией
        if (this.filters.section) {
          const params = {};
          if (this.filters.branch_id !== null)
            params.branch_id = this.filters.branch_id;
          if (this.filters.media_type)
            params.media_type = this.filters.media_type;

          const data = await mediaAPI.getBySection(
            this.filters.section,
            params
          );
          this.mediaItems = Array.isArray(data.items) ? data.items : [];
        } else {
          // Иначе используем общий список
          const data = await mediaAPI.getAll();
          this.mediaItems = Array.isArray(data) ? data : [];
        }

        console.log("Загружено медиа:", this.mediaItems.length);
      } catch (error) {
        console.error("Ошибка при загрузке медиа:", error);
        this.error = error.message || "Не удалось загрузить медиа";
        this.mediaItems = [];
      } finally {
        this.isLoading = false;
      }
    },

    applyFilters() {
      // Перезагружаем данные с учетом фильтров
      this.loadMedia();
    },

    clearAllFilters() {
      this.filters = {
        section: null,
        branch_id: null,
        media_type: null,
      };
    },

    openEditModal(media) {
      this.editingMedia = { ...media };
    },

    async onMediaUploaded() {
      console.log("Медиа загружено");
      this.showUploadModal = false;
      await this.loadMedia();
    },

    async onMediaUpdated() {
      console.log("Медиа обновлено");
      this.editingMedia = null;
      await this.loadMedia();
    },

    async confirmDelete(media) {
      if (
        !confirm(
          `Удалить медиа "${media.title || media.original_filename}"?\n\nЭто действие нельзя отменить.`
        )
      ) {
        return;
      }

      try {
        await mediaAPI.delete(media.id);
        console.log("Медиа удалено:", media.id);
        await this.loadMedia();
      } catch (error) {
        console.error("Ошибка при удалении медиа:", error);
        alert("Не удалось удалить медиа: " + error.message);
      }
    },

    getMediaUrl(mediaId) {
      // URL для получения медиа файла (админ эндпоинт - все медиа)
      return mediaAPI.getAdminDownloadUrl(mediaId);
    },

    onImageError(event) {
      // Заглушка при ошибке загрузки изображения
      event.target.src =
        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
    },

    getBranchName(branchId) {
      if (!branchId || !this.branches) return "";
      const branch = this.branches.find((b) => b.id === branchId);
      return branch ? branch.name : "";
    },

    getSectionLabel(section) {
      const item = this.menuSections.find((s) => s.value === section);
      return item ? item.label : section;
    },

    getMediaTypeLabel(type) {
      const item = this.mediaTypes.find((t) => t.value === type);
      return item ? item.label : type;
    },

    getMediaTypeBadgeClass(type) {
      switch (type) {
        case "PHOTO":
          return "bg-green-500 text-white";
        case "VIDEO":
          return "bg-blue-500 text-white";
        case "DOCUMENT":
          return "bg-gray-500 text-white";
        default:
          return "bg-gray-500 text-white";
      }
    },

    formatFileSize(bytes) {
      if (!bytes) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    },
  },

  async created() {
    console.log("AdminMediaPage created");

    const store = useAppStore();
    if (!store.areBranchesLoaded) {
      try {
        await store.loadBranches();
      } catch (error) {
        console.error("Failed to load branches:", error);
      }
    }

    await this.loadMedia();
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
