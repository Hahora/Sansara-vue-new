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

      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white border-opacity-30"
        >
          🎉
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
          <p class="text-white text-opacity-90 text-sm mt-1">
            Празднуйте важное событие в особенной атмосфере
          </p>
        </div>
      </div>
    </div>

    <!-- Переключатель вкладок -->
    <div class="px-4 py-3 border-b border-gray-200 bg-white">
      <div class="flex rounded-lg bg-gray-100 p-1">
        <button
          @click="activeTab = 'info'"
          :class="[
            'flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'info'
              ? 'bg-white shadow-sm text-[#4e5d51]'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          📋 Основная информация
        </button>
        <button
          @click="activeTab = 'gallery'"
          :class="[
            'flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'gallery'
              ? 'bg-white shadow-sm text-[#4e5d51]'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          📸 Галерея
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

    <!-- Контент: Основная информация -->
    <div v-else-if="activeTab === 'info'" class="px-4 py-5 space-y-4">
      <!-- Мальчишники -->
      <div
        v-if="bachelorContent && bachelorContent.title"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3"
      >
        <div class="flex items-center">
          <span class="text-2xl mr-3">👔</span>
          <div>
            <h2 class="font-semibold text-gray-900">
              {{ bachelorContent.title || "Мальчишники" }}
            </h2>
          </div>
        </div>

        <!-- Цена -->
        <div v-if="bachelorContent.price" class="flex items-center">
          <div
            class="bg-green-50 text-green-800 px-4 py-2 rounded-lg border border-green-200"
          >
            <div class="flex items-center">
              <span class="font-bold text-lg">{{
                formatPrice(bachelorContent.price)
              }}</span>
              <span class="text-sm ml-2 text-green-600">/ с гостя</span>
            </div>
          </div>
        </div>

        <!-- Контент из API -->
        <div
          v-if="bachelorContent.content"
          class="bg-gray-50 rounded-lg p-3 prose prose-sm max-w-none"
        >
          <div v-html="formatContent(bachelorContent.content)"></div>
        </div>

        <!-- Если контента нет -->
        <div
          v-else
          class="bg-gray-50 rounded-lg p-3 text-center text-gray-500 italic"
        >
          Информация о мальчишниках скоро появится
        </div>

        <!-- Кнопка бронирования -->
        <button
          @click="openBooking('BACHELOR', 'Мальчишник')"
          class="w-full bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 text-center shadow-sm active:scale-98"
        >
          📝 Забронировать мальчишник
        </button>
      </div>

      <!-- Девичники -->
      <div
        v-if="bacheloretteContent && bacheloretteContent.title"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3"
      >
        <div class="flex items-center">
          <span class="text-2xl mr-3">👗</span>
          <div>
            <h2 class="font-semibold text-gray-900">
              {{ bacheloretteContent.title || "Девичники" }}
            </h2>
          </div>
        </div>

        <!-- Цена -->
        <div v-if="bacheloretteContent.price" class="flex items-center">
          <div
            class="bg-green-50 text-green-800 px-4 py-2 rounded-lg border border-green-200"
          >
            <div class="flex items-center">
              <span class="font-bold text-lg">{{
                formatPrice(bacheloretteContent.price)
              }}</span>
              <span class="text-sm ml-2 text-green-600">/ с гостя</span>
            </div>
          </div>
        </div>

        <!-- Контент из API -->
        <div
          v-if="bacheloretteContent.content"
          class="bg-gray-50 rounded-lg p-3 prose prose-sm max-w-none"
        >
          <div v-html="formatContent(bacheloretteContent.content)"></div>
        </div>

        <!-- Если контента нет -->
        <div
          v-else
          class="bg-gray-50 rounded-lg p-3 text-center text-gray-500 italic"
        >
          Информация о девичниках скоро появится
        </div>

        <!-- Кнопка бронирования -->
        <button
          @click="openBooking('BACHELORETTE', 'Девичник')"
          class="w-full bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 text-center shadow-sm active:scale-98"
        >
          📝 Забронировать девичник
        </button>
      </div>

      <!-- Если оба раздела пустые -->
      <div
        v-if="
          (!bachelorContent || !bachelorContent.title) &&
          (!bacheloretteContent || !bacheloretteContent.title)
        "
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
      >
        <div class="text-4xl mb-4">🎉</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Информация о мальчишниках и девичниках
        </h3>
        <p class="text-gray-600">
          Скоро здесь появится подробная информация о наших программах
        </p>
      </div>
    </div>

    <!-- Контент: Фотогалерея -->
    <div v-else-if="activeTab === 'gallery'" class="pb-20">
      <!-- Используем отдельный компонент для галереи -->
      <MediaGallery
        :sections="['BACHELOR', 'BACHELORETTE']"
        :show-media-type-filter="true"
        :category-labels="{
          BACHELOR: 'Мальчишники',
          BACHELORETTE: 'Девичники',
        }"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { openBookingModal } from "@/utils/eventBus";
import MediaGallery from "@/components/MediaGallery.vue";

export default {
  name: "BachelorPage",
  components: {
    MediaGallery,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      bachelorContent: null,
      bacheloretteContent: null,
      activeTab: "info", // 'info' или 'gallery'
      selectedEventType: null, // Для галереи
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData"]),

    pageTitle() {
      const bachelorTitle = this.contentData?.["BACHELOR"]?.title;
      const bacheloretteTitle = this.contentData?.["BACHELORETTE"]?.title;

      if (bachelorTitle || bacheloretteTitle) {
        return "Мальчишники и девичники";
      }
      return "Мальчишники и девичники";
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

    async loadContent() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка контента для страницы мальчишников/девичников");
        console.log("Выбранный филиал:", this.selectedBranch?.id);

        try {
          await this.loadSiteContent("BACHELOR", true);
          this.bachelorContent = this.contentData?.["BACHELOR"];
          console.log("Контент для мальчишников:", this.bachelorContent);
        } catch (bachelorError) {
          console.error(
            "Ошибка загрузки контента для мальчишников:",
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
      this.selectedEventType = eventKey; // Сохраняем тип события для галереи
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
.active\:scale-98:active {
  transform: scale(0.98);
}

.prose :deep(p) {
  margin-bottom: 0.75em;
}

.prose :deep(ul) {
  margin-bottom: 0.75em;
  padding-left: 1.5em;
  list-style-type: disc;
}

.prose :deep(li) {
  margin-bottom: 0.25em;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #111827;
}
</style>
