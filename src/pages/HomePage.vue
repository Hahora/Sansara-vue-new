<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Приветственный баннер с выбором филиала -->
    <div
      class="relative overflow-hidden bg-gradient-to-br from-[#4e5d51] via-[#5a6d5e] to-[#4e5d51] text-white"
    >
      <!-- Декоративные элементы -->
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"
      ></div>

      <div class="relative px-5 py-8">
        <!-- Верхняя строка с заголовком и выбором филиала -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center">
            <span class="text-4xl mr-3">🌿</span>
            <h1
              class="text-2xl font-bold leading-tight"
              v-html="welcomeTitle"
            ></h1>
          </div>

          <!-- Кнопка выбора филиала -->
          <div class="relative">
            <button
              @click.stop="toggleBranchSelect"
              class="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 text-sm flex items-center transition-all"
            >
              <span class="max-w-[120px] truncate">
                {{
                  selectedBranch?.short_name || selectedBranch?.name || "Филиал"
                }}
              </span>
              <svg
                class="w-3 h-3 ml-1.5 transition-transform"
                :class="{ 'rotate-180': showBranchSelect }"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Dropdown с филиалами -->
            <div
              v-if="showBranchSelect"
              class="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-80 overflow-y-auto"
            >
              <!-- ДОБАВИТЬ индикатор загрузки -->
              <div v-if="isLoading" class="p-4 flex justify-center">
                <div
                  class="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-gray-600"
                ></div>
              </div>
              <div v-else class="p-2 space-y-1">
                <div
                  v-for="branch in branches"
                  :key="branch.id"
                  @click="handleSelectBranch(branch)"
                  class="px-3 py-2.5 rounded-md hover:bg-gray-50 cursor-pointer"
                  :class="{
                    'bg-blue-50 text-blue-700':
                      selectedBranch?.id === branch.id,
                  }"
                >
                  <div class="font-medium text-gray-900">{{ branch.name }}</div>
                  <div class="text-xs text-gray-500 mt-0.5 truncate">
                    {{ branch.address }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Остальной контент баннера -->
        <div class="space-y-2.5 text-sm leading-relaxed">
          <p class="opacity-95" v-html="welcomeSubtitle"></p>
          <p
            v-if="user"
            class="opacity-100 font-medium mt-4 pt-3 border-t border-white border-opacity-20"
          >
            👋 Здравствуйте, {{ user.first_name || user.username || "гость" }}!
          </p>
        </div>
      </div>
    </div>

    <!-- Ошибка -->
    <div
      v-if="error"
      class="mx-4 mt-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm"
    >
      <div class="flex items-start">
        <svg
          class="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="flex-1">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
        <button
          @click="clearError"
          class="text-red-500 hover:text-red-700 ml-3 flex-shrink-0"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Карточки меню -->
    <div v-else class="px-4 py-5 space-y-3">
      <!-- Мальчишники и девичники -->
      <router-link
        to="/bachelor"
        class="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 active:scale-98 hover:shadow-md"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl flex items-center justify-center"
          >
            <span class="text-2xl">🎉</span>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-base">
              Мальчишники и девичники
            </h3>
            <p class="text-sm text-gray-500 mt-0.5 line-clamp-2">
              Отпразднуйте важное событие в особенной атмосфере!
            </p>
          </div>
          <svg
            class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </router-link>

      <!-- Я первый раз -->
      <router-link
        to="/first-time"
        class="block bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-sm border-2 border-yellow-200 p-4 transition-all duration-200 active:scale-98 hover:shadow-md"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center"
          >
            <span class="text-2xl">🌟</span>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-base">Я первый раз</h3>
            <p class="text-sm text-gray-600 mt-0.5 truncate">
              Особое предложение для новых гостей
            </p>
          </div>
          <svg
            class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </router-link>

      <!-- 🎟️ Лотерея -->
      <router-link
        to="/lottery"
        class="block bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border-2 border-blue-200 p-4 transition-all duration-200 active:scale-98 hover:shadow-md"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center"
          >
            <span class="text-2xl">🎟️</span>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-base">Лотерея</h3>
            <p class="text-sm text-gray-600 mt-0.5 truncate">
              Участвуйте и выигрывайте призы!
            </p>
          </div>
          <svg
            class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </router-link>

      <!-- Клубные мероприятия -->
      <router-link
        to="/club-events"
        class="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 active:scale-98 hover:shadow-md"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center"
          >
            <span class="text-2xl">🏛</span>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-base">
              Клубные мероприятия
            </h3>
            <p class="text-sm text-gray-500 mt-0.5 line-clamp-2">
              Регулярные встречи единомышленников в банном формате
            </p>
          </div>
          <svg
            class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </router-link>

      <!-- Коллективные программы -->
      <router-link
        to="/collective-programs"
        class="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 active:scale-98 hover:shadow-md"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center"
          >
            <span class="text-2xl">👥</span>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-base">
              Коллективные программы
            </h3>
            <p class="text-sm text-gray-500 mt-0.5 line-clamp-2">
              Тепло, живой пар, общее действие и единение
            </p>
          </div>
          <svg
            class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </router-link>

      <!-- Авторские программы -->
      <router-link
        to="/author-programs"
        class="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 active:scale-98 hover:shadow-md"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl flex items-center justify-center"
          >
            <span class="text-2xl">✨</span>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-base">
              Авторские программы
            </h3>
            <p class="text-sm text-gray-500 mt-0.5 line-clamp-2">
              Уникальные техники, глубокие состояния, работа с телом и энергией
            </p>
          </div>
          <svg
            class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </router-link>

      <!-- Корпоративные программы -->
      <router-link
        to="/corporate"
        class="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 active:scale-98 hover:shadow-md"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center"
          >
            <span class="text-2xl">🏢</span>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-base">
              Корпоративные программы
            </h3>
            <p class="text-sm text-gray-500 mt-0.5 truncate">
              «Отдых, после которого не нужен отдых»
            </p>
          </div>
          <svg
            class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </router-link>

      <!-- Система лояльности -->
      <router-link
        to="/loyalty"
        class="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 active:scale-98 hover:shadow-md"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center"
          >
            <span class="text-2xl">🎁</span>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-base">
              Лояльность и промокоды
            </h3>
            <p class="text-sm text-gray-500 mt-0.5 truncate">
              Актуальные скидки и специальные предложения
            </p>
          </div>
          <svg
            class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </router-link>

      <!-- Подарочные сертификаты -->
      <router-link
        to="/certificates"
        class="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 transition-all duration-200 active:scale-98 hover:shadow-md"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl flex items-center justify-center"
          >
            <span class="text-2xl">🎁</span>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-base">
              Подарочные сертификаты
            </h3>
            <p class="text-sm text-gray-500 mt-0.5 line-clamp-2">
              Подарите заботу, счастье и ресурсное состояние
            </p>
          </div>
          <svg
            class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "HomePage",
  data() {
    return {
      showBranchSelect: false,
    };
  },
  computed: {
    ...mapState(useAppStore, [
      "user",
      "isLoading",
      "error",
      "contentData",
      "branches",
      "selectedBranch",
    ]),

    // Получаем контент для главной страницы
    homeContent() {
      // contentData - это объект с ключами, например: {"HOME": {title: "...", content: "..."}}
      return this.contentData?.["HOME"];
    },

    // Заголовок: используем title из API или fallback
    welcomeTitle() {
      if (this.homeContent?.title) {
        const title = this.homeContent.title;
        // Если в title есть "Добро пожаловать", добавляем <br/>
        if (title.includes("Добро пожаловать")) {
          return title.replace("Добро пожаловать", "Добро пожаловать<br/>");
        }
        return title;
      }
      // Fallback заголовок
      return "Добро пожаловать<br/>в САНСАРУ";
    },

    // Подзаголовок: используем content из API или fallback
    welcomeSubtitle() {
      return (
        this.homeContent?.content ||
        "Первый городской ретрит-центр, где банные традиции встречаются с заботой о себе."
      );
    },
  },
  methods: {
    ...mapActions(useAppStore, [
      "authenticate",
      "loadSiteContent",
      "loadBranches",
      "selectBranch",
      "clearError",
    ]),

    // ДОБАВИТЬ этот метод вместо кнопки @click
    async toggleBranchSelect() {
      this.showBranchSelect = !this.showBranchSelect;

      // Если открываем dropdown, загружаем актуальный список филиалов
      if (this.showBranchSelect) {
        try {
          console.log("Opening branch dropdown, loading branches...");
          // force: true - всегда загружать заново
          await this.loadBranches(true);
          console.log("Branches loaded:", this.branches?.length);
        } catch (error) {
          console.error("Failed to load branches:", error);
          this.showBranchSelect = false;
          this.setError("Не удалось загрузить список филиалов");
        }
      }
    },

    async handleSelectBranch(branch) {
      console.log("Selecting branch:", branch.name);
      this.showBranchSelect = false;

      try {
        // 1. Сохраняем выбранный филиал в store
        await this.selectBranch(branch);

        // 2. Перезагружаем контент с новым branch_id
        console.log("Loading content for new branch:", branch.name);
        await this.loadSiteContent("HOME", true); // force reload

        console.log("Content updated for branch:", branch.name);
      } catch (error) {
        console.error("Error selecting branch:", error);
        this.setError(error.message || "Ошибка при выборе филиала");
      }
    },

    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.showBranchSelect = false;
      }
    },
  },
  async created() {
    console.log("HomePage created");

    try {
      // 1. Сначала аутентификация
      await this.authenticate();
      console.log("Аутентификация успешна");

      // 2. Загружаем филиалы
      await this.loadBranches();
      console.log("Филиалы загружены");

      // 3. Загружаем контент для главной страницы
      // Если есть выбранный филиал, он будет использован автоматически в loadSiteContent
      await this.loadSiteContent("HOME");
      console.log("Контент загружен");

      console.log("Все данные загружены успешно");
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  },
  mounted() {
    // Закрытие dropdown при клике вне его
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
