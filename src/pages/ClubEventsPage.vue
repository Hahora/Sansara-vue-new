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
          🏛
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
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
    <div v-else-if="activeTab === 'info'" class="px-4 py-5">
      <!-- Если нет программ -->
      <div
        v-if="
          (!bathClubContent || !bathClubContent.title) &&
          (!businessBathContent || !businessBathContent.title)
        "
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
      >
        <div class="text-4xl mb-4">🏛</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Клубные мероприятия
        </h3>
        <p class="text-gray-600">
          Скоро здесь появится информация о клубных мероприятиях
        </p>
      </div>

      <!-- Список клубных мероприятий -->
      <div v-else class="space-y-4">
        <!-- Банный клуб С. Хачатурьяна -->
        <div
          v-if="bathClubContent && bathClubContent.title"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div
            class="px-4 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100"
          >
            <div class="flex items-center">
              <span class="text-3xl mr-3">♨️</span>
              <div class="flex-1">
                <h2 class="font-bold text-gray-900 text-lg">
                  {{ bathClubContent.title }}
                </h2>
                <p v-if="bathClubSubtitle" class="text-sm text-gray-600 mt-0.5">
                  {{ bathClubSubtitle }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <!-- Цена -->
            <div v-if="bathClubContent.price" class="flex items-center">
              <div
                class="bg-green-50 text-green-800 px-4 py-2 rounded-lg border border-green-200"
              >
                <div class="flex items-center">
                  <span class="font-bold text-lg">{{
                    formatPrice(bathClubContent.price)
                  }}</span>
                  <span class="text-sm ml-2 text-green-600">/ с участника</span>
                </div>
              </div>
            </div>

            <!-- Контент из API -->
            <div
              v-if="bathClubContent.content"
              class="prose prose-sm max-w-none"
            >
              <div v-html="formatContent(bathClubContent.content)"></div>
            </div>

            <!-- Если контента нет -->
            <div
              v-else
              class="bg-gray-50 rounded-lg p-3 text-center text-gray-500 italic"
            >
              Информация о банном клубе скоро появится
            </div>

            <!-- Кнопка записи - ИЗМЕНЕНО: используем тот же подход, что и в мальчишниках -->
            <button
              @click="
                openBooking('BATH_CLUB', bathClubContent.title || 'Банный клуб')
              "
              class="w-full bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm active:scale-98"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path
                  d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
                />
              </svg>
              Записаться на клуб
            </button>
          </div>
        </div>

        <!-- Бизнес-баня с клубом МОСТ -->
        <div
          v-if="businessBathContent && businessBathContent.title"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div
            class="px-4 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100"
          >
            <div class="flex items-center">
              <span class="text-3xl mr-3">💼</span>
              <div class="flex-1">
                <h2 class="font-bold text-gray-900 text-lg">
                  {{ businessBathContent.title }}
                </h2>
              </div>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <!-- Цена -->
            <div v-if="businessBathContent.price" class="flex items-center">
              <div
                class="bg-green-50 text-green-800 px-4 py-2 rounded-lg border border-green-200"
              >
                <div class="flex items-center">
                  <span class="font-bold text-lg">{{
                    formatPrice(businessBathContent.price)
                  }}</span>
                  <span class="text-sm ml-2 text-green-600">/ с участника</span>
                </div>
              </div>
            </div>

            <!-- Контент из API -->
            <div
              v-if="businessBathContent.content"
              class="prose prose-sm max-w-none"
            >
              <div v-html="formatContent(businessBathContent.content)"></div>
            </div>

            <!-- Если контента нет -->
            <div
              v-else
              class="bg-gray-50 rounded-lg p-3 text-center text-gray-500 italic"
            >
              Информация о бизнес-бане скоро появится
            </div>

            <!-- Кнопка записи - ИЗМЕНЕНО: используем тот же подход, что и в мальчишниках -->
            <button
              @click="
                openBooking(
                  'BUSINESS_BATH',
                  businessBathContent.title || 'Бизнес-баня'
                )
              "
              class="w-full bg-[#4e5d51] hover:bg-[#3d4a40] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm active:scale-98"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path
                  d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
                />
              </svg>
              Записаться на бизнес-баню
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
import { openBookingModal } from "@/utils/eventBus"; // Добавляем импорт, как в мальчишниках
import MediaGallery from "@/components/MediaGallery.vue";

export default {
  name: "ClubEventsPage",
  components: {
    MediaGallery,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      bathClubContent: null, // БАННЫЙ КЛУБ С. ХАЧАТУРЬЯН
      businessBathContent: null, // Бизнес-баня МОСТ
      activeTab: "info", // 'info' или 'gallery'
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

    // НОВЫЙ МЕТОД - такой же как в мальчишниках
    openBooking(eventKey, title) {
      console.log("ClubEventsPage: Opening booking", { eventKey, title });
      openBookingModal(null, eventKey, title);
    },

    // Убрали метод findProgramForBooking, так как больше не нужен
    // Поиск программы теперь будет происходить в модальном окне бронирования

    async loadClubEvents() {
      try {
        this.isLoading = true;
        this.error = null;

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
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    console.log("ClubEventsPage created");

    try {
      // Загружаем контент для страницы
      await this.loadClubEvents();

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
        this.loadClubEvents();
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
