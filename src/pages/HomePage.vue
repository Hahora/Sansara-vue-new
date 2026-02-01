<template>
  <div class="min-h-screen bg-[#edeae6]">
    <!-- Шапка -->
    <div class="relative overflow-hidden bg-[#202c27] text-white">
      <div class="relative px-5 pt-6 pb-8">
        <!-- Верхняя строка с логотипом -->
        <div class="flex justify-between items-start mb-6">
          <!-- Логотип - только изображение -->
          <div class="flex items-center">
            <!-- Если лого цветное и нужно сделать белым -->
            <img
              :src="logo"
              alt="САНСАРА"
              class="h-12 w-auto filter brightness-0 invert opacity-95"
            />
          </div>

          <!-- Кнопка выбора филиала -->
          <div class="relative">
            <button
              @click.stop="toggleBranchSelect"
              class="group bg-[#c2a886]/90 hover:bg-[#c2a886] backdrop-blur-sm border border-[#c2a886]/40 rounded-xl px-4 py-2.5 text-sm flex items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <MapPin class="h-4 w-4 text-white mr-2 text-black" />
              <span
                class="max-w-[100px] truncate text-white font-medium text-black"
              >
                {{
                  selectedBranch?.short_name || selectedBranch?.name || "Филиал"
                }}
              </span>
              <ChevronDown
                class="h-4 w-4 text-white/80 ml-1.5 transition-transform duration-200 group-hover:rotate-180 text-black"
                :class="{ 'rotate-180': showBranchSelect }"
              />
            </button>

            <!-- Dropdown с филиалами -->
            <transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="showBranchSelect"
                class="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 z-50 max-h-80 overflow-y-auto"
              >
                <!-- Загрузка -->
                <div
                  v-if="isLoading"
                  class="p-6 flex flex-col items-center justify-center"
                >
                  <Loader2 class="h-8 w-8 text-[#c2a886] animate-spin mb-3" />
                  <p class="text-sm text-gray-500">Загружаем филиалы...</p>
                </div>

                <!-- Список филиалов -->
                <div v-else class="py-2">
                  <div class="px-4 py-2 mb-1">
                    <p
                      class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Выберите филиал
                    </p>
                  </div>
                  <div class="space-y-0.5">
                    <div
                      v-for="branch in branches"
                      :key="branch.id"
                      @click="handleSelectBranch(branch)"
                      class="px-4 py-3 mx-2 rounded-lg hover:bg-gray-50/80 cursor-pointer transition-all duration-200 hover:pl-5"
                      :class="{
                        'bg-[#c2a886]/10 border-l-2 border-[#c2a886]':
                          selectedBranch?.id === branch.id,
                      }"
                    >
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <div
                            class="h-8 w-8 rounded-full bg-[#202c27]/5 flex items-center justify-center"
                          >
                            <MapPin class="h-3.5 w-3.5 text-[#202c27]" />
                          </div>
                        </div>
                        <div class="ml-3 flex-1 min-w-0">
                          <div class="font-medium text-gray-900 text-sm">
                            {{ branch.name }}
                          </div>
                          <div class="text-xs text-gray-500 mt-0.5 truncate">
                            {{ branch.address }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Анимированная загрузка контента -->
        <div v-if="isLoadingContent" class="space-y-4">
          <!-- Анимированный заголовок -->
          <div class="space-y-3">
            <div
              class="h-8 bg-gradient-to-r from-[#c2a886]/20 to-[#c2a886]/10 rounded-lg animate-pulse w-3/4"
            ></div>
            <div class="h-px w-16 bg-[#c2a886]/30"></div>
          </div>

          <!-- Анимированный текст -->
          <div class="space-y-2">
            <div
              class="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse"
            ></div>
            <div
              class="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse w-5/6"
            ></div>
            <div
              class="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse w-4/6"
            ></div>
          </div>

          <!-- Анимированный привет пользователя -->
          <div class="pt-4 mt-4 border-t border-white/10">
            <div class="flex items-center">
              <div class="h-8 w-8 rounded-full bg-white/10 animate-pulse"></div>
              <div class="ml-3 space-y-2">
                <div
                  class="h-3 bg-white/10 rounded-full w-24 animate-pulse"
                ></div>
                <div
                  class="h-2 bg-white/5 rounded-full w-32 animate-pulse"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Контент после загрузки -->
        <div v-else class="space-y-4">
          <!-- Заголовок из API -->
          <div>
            <h2
              class="text-2xl md:text-3xl font-light text-white leading-tight tracking-wide"
              v-html="welcomeTitle"
            ></h2>
            <div class="h-px w-16 bg-[#c2a886] mt-3 opacity-80"></div>
          </div>

          <!-- Описание из API -->
          <p
            class="text-sm text-white/80 leading-relaxed font-light max-w-2xl"
            v-html="welcomeSubtitle"
          ></p>

          <!-- Приветствие пользователя -->
          <div v-if="user" class="pt-4 mt-4 border-t border-white/10">
            <div class="flex items-center">
              <div
                class="h-8 w-8 rounded-full bg-[#c2a886]/20 flex items-center justify-center"
              >
                <div
                  class="h-5 w-5 rounded-full bg-[#c2a886] flex items-center justify-center"
                >
                  <span class="text-xs font-bold text-white">👤</span>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-white">
                  {{ user.first_name || user.username || "Дорогой гость" }}
                </p>
                <p class="text-xs text-white/60 mt-0.5">
                  Рады видеть вас в нашем ретрит-центре
                </p>
              </div>
            </div>
          </div>
        </div>
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
        class="mx-4 mt-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-lg"
      >
        <div class="flex items-start">
          <AlertCircle class="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-sm text-red-800 font-medium">{{ error }}</p>
            <p class="text-xs text-red-600 mt-1">
              Попробуйте обновить страницу
            </p>
          </div>
          <button
            @click="clearError"
            class="text-red-500 hover:text-red-700 ml-3 flex-shrink-0 transition-colors"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>
    </transition>

    <!-- Заголовок раздела с цветом кнопки -->
    <div class="px-5 py-6">
      <div class="mb-6">
        <div class="flex items-center">
          <div
            class="h-px flex-1 bg-gradient-to-r from-transparent to-[#c2a886]/30"
          ></div>
          <h2 class="mx-4 text-lg font-light text-gray-900 tracking-wide">
            Программы и услуги
          </h2>
          <div
            class="h-px flex-1 bg-gradient-to-l from-transparent to-[#c2a886]/30"
          ></div>
        </div>
        <p class="text-center text-sm text-gray-500 mt-2">
          Выберите формат, который подходит именно вам
        </p>
      </div>

      <!-- Анимированная загрузка карточек -->
      <div v-if="isLoadingContent" class="grid grid-cols-1 gap-4">
        <div
          v-for="n in 8"
          :key="n"
          class="bg-[#e3ded3] rounded-2xl p-5 animate-pulse"
        >
          <div class="flex items-center">
            <div class="w-14 h-14 bg-gray-200 rounded-xl"></div>
            <div class="ml-4 flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded-full w-3/4"></div>
              <div class="h-3 bg-gray-100 rounded-full w-full"></div>
              <div class="h-3 bg-gray-100 rounded-full w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Карточки программ после загрузки -->
      <div v-else class="space-y-3">
        <!-- Мальчишники и девичники -->
        <router-link
          to="/bachelor"
          class="group block bg-[#e3ded3] rounded-2xl shadow-sm border border-[#c2a886]/30 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#c2a886]/50 active:scale-[0.98]"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center shadow-sm"
            >
              <PartyPopper class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3
                class="font-semibold text-gray-900 text-[15px] leading-snug mb-1"
              >
                Коллективная баня и девичники
              </h3>
              <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                Отпразднуйте важное событие в особенной атмосфере
              </p>
            </div>
            <ChevronRight
              class="h-5 w-5 text-[#c2a886]/60 flex-shrink-0 mt-2.5 transition-transform group-active:translate-x-1"
            />
          </div>
        </router-link>

        <!-- Я первый раз -->
        <router-link
          to="/first-time"
          class="group block bg-[#e3ded3] rounded-2xl shadow-sm border border-[#c2a886]/30 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#c2a886]/50 active:scale-[0.98]"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#d4b896] to-[#c2a886] rounded-xl flex items-center justify-center shadow-sm"
            >
              <Star class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3
                class="font-semibold text-gray-900 text-[15px] leading-snug mb-1"
              >
                Я первый раз
              </h3>
              <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                Особое предложение для новых гостей
              </p>
            </div>
            <ChevronRight
              class="h-5 w-5 text-[#c2a886]/60 flex-shrink-0 mt-2.5 transition-transform group-active:translate-x-1"
            />
          </div>
        </router-link>

        <!-- Лотерея -->
        <router-link
          to="/lottery"
          class="group block bg-[#e3ded3] rounded-2xl shadow-sm border border-[#c2a886]/30 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#c2a886]/50 active:scale-[0.98]"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#b5976e] to-[#a68a5f] rounded-xl flex items-center justify-center shadow-sm"
            >
              <Ticket class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3
                class="font-semibold text-gray-900 text-[15px] leading-snug mb-1"
              >
                Лотерея
              </h3>
              <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                Участвуйте в розыгрышах и выигрывайте призы
              </p>
            </div>
            <ChevronRight
              class="h-5 w-5 text-[#c2a886]/60 flex-shrink-0 mt-2.5 transition-transform group-active:translate-x-1"
            />
          </div>
        </router-link>

        <!-- Клубные мероприятия -->
        <router-link
          to="/club-events"
          class="group block bg-[#e3ded3] rounded-2xl shadow-sm border border-[#c2a886]/30 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#c2a886]/50 active:scale-[0.98]"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#a68a5f] to-[#8f7550] rounded-xl flex items-center justify-center shadow-sm"
            >
              <Castle class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3
                class="font-semibold text-gray-900 text-[15px] leading-snug mb-1"
              >
                Клубные мероприятия
              </h3>
              <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                Регулярные встречи в особом формате
              </p>
            </div>
            <ChevronRight
              class="h-5 w-5 text-[#c2a886]/60 flex-shrink-0 mt-2.5 transition-transform group-active:translate-x-1"
            />
          </div>
        </router-link>

        <!-- Коллективные программы -->
        <router-link
          to="/collective-programs"
          class="group block bg-[#e3ded3] rounded-2xl shadow-sm border border-[#c2a886]/30 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#c2a886]/50 active:scale-[0.98]"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#c2a886] to-[#a68a5f] rounded-xl flex items-center justify-center shadow-sm"
            >
              <UsersRound class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3
                class="font-semibold text-gray-900 text-[15px] leading-snug mb-1"
              >
                Коллективные программы
              </h3>
              <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                Единение в кругу близких
              </p>
            </div>
            <ChevronRight
              class="h-5 w-5 text-[#c2a886]/60 flex-shrink-0 mt-2.5 transition-transform group-active:translate-x-1"
            />
          </div>
        </router-link>

        <!-- Авторские программы -->
        <router-link
          to="/author-programs"
          class="group block bg-[#e3ded3] rounded-2xl shadow-sm border border-[#c2a886]/30 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#c2a886]/50 active:scale-[0.98]"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#d4b896] to-[#b5976e] rounded-xl flex items-center justify-center shadow-sm"
            >
              <Wand2 class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3
                class="font-semibold text-gray-900 text-[15px] leading-snug mb-1"
              >
                Авторские программы
              </h3>
              <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                Уникальные техники и глубокие состояния
              </p>
            </div>
            <ChevronRight
              class="h-5 w-5 text-[#c2a886]/60 flex-shrink-0 mt-2.5 transition-transform group-active:translate-x-1"
            />
          </div>
        </router-link>

        <!-- Корпоративные программы -->
        <router-link
          to="/corporate"
          class="group block bg-[#e3ded3] rounded-2xl shadow-sm border border-[#c2a886]/30 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#c2a886]/50 active:scale-[0.98]"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#8f7550] to-[#7a6344] rounded-xl flex items-center justify-center shadow-sm"
            >
              <Briefcase class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3
                class="font-semibold text-gray-900 text-[15px] leading-snug mb-1"
              >
                Корпоративные программы
              </h3>
              <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                Отдых для вашей команды
              </p>
            </div>
            <ChevronRight
              class="h-5 w-5 text-[#c2a886]/60 flex-shrink-0 mt-2.5 transition-transform group-active:translate-x-1"
            />
          </div>
        </router-link>

        <!-- Система лояльности -->
        <router-link
          to="/loyalty"
          class="group block bg-[#e3ded3] rounded-2xl shadow-sm border border-[#c2a886]/30 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#c2a886]/50 active:scale-[0.98]"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#b5976e] to-[#c2a886] rounded-xl flex items-center justify-center shadow-sm"
            >
              <Tag class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3
                class="font-semibold text-gray-900 text-[15px] leading-snug mb-1"
              >
                Лояльность и промокоды
              </h3>
              <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                Скидки для постоянных гостей
              </p>
            </div>
            <ChevronRight
              class="h-5 w-5 text-[#c2a886]/60 flex-shrink-0 mt-2.5 transition-transform group-active:translate-x-1"
            />
          </div>
        </router-link>

        <!-- Подарочные сертификаты -->
        <router-link
          to="/certificates"
          class="group block bg-[#e3ded3] rounded-2xl shadow-sm border border-[#c2a886]/30 p-4 mb-8 transition-all duration-300 hover:shadow-lg hover:border-[#c2a886]/50 active:scale-[0.98]"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#d4b896] to-[#c2a886] rounded-xl flex items-center justify-center shadow-sm"
            >
              <Gift class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3
                class="font-semibold text-gray-900 text-[15px] leading-snug mb-1"
              >
                Подарочные сертификаты
              </h3>
              <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                Подарите заботу близким людям
              </p>
            </div>
            <ChevronRight
              class="h-5 w-5 text-[#c2a886]/60 flex-shrink-0 mt-2.5 transition-transform group-active:translate-x-1"
            />
          </div>
        </router-link>
      </div>
    </div>

    <!-- Декоративный элемент внизу -->
    <div class="relative h-12">
      <div class="absolute inset-x-0 bottom-0 flex justify-center">
        <div
          class="h-px w-32 bg-gradient-to-r from-transparent via-[#c2a886]/40 to-transparent"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import icons from "@/utils/icons";
import logo from "@/assets/logo.svg";

export default {
  name: "HomePage",
  components: {
    ...icons,
  },
  data() {
    return {
      showBranchSelect: false,
      isLoadingContent: true,
      logo,
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

    homeContent() {
      return this.contentData?.["HOME"];
    },

    welcomeTitle() {
      if (this.homeContent?.title) {
        return this.homeContent.title;
      }
      return "Добро пожаловать";
    },

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

    async toggleBranchSelect() {
      this.showBranchSelect = !this.showBranchSelect;

      if (this.showBranchSelect) {
        try {
          await this.loadBranches(true);
        } catch (error) {
          console.error("Failed to load branches:", error);
          this.showBranchSelect = false;
        }
      }
    },

    async handleSelectBranch(branch) {
      this.showBranchSelect = false;
      this.isLoadingContent = true;

      try {
        await this.selectBranch(branch);
        await this.loadSiteContent("HOME", true);

        // Небольшая задержка для плавности
        setTimeout(() => {
          this.isLoadingContent = false;
        }, 300);
      } catch (error) {
        console.error("Error selecting branch:", error);
        this.isLoadingContent = false;
      }
    },

    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.showBranchSelect = false;
      }
    },
  },
  async created() {
    try {
      await this.authenticate();
      await this.loadBranches();
      await this.loadSiteContent("HOME");

      // Имитация загрузки для плавности
      setTimeout(() => {
        this.isLoadingContent = false;
      }, 500);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      this.isLoadingContent = false;
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
/* Анимации */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Стили для скроллбара */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(194, 168, 136, 0.5);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(194, 168, 136, 0.7);
}

/* Плавные переходы для карточек */
.group {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Эффект нажатия */
.active\:scale-\[0\.99\]:active {
  transform: scale(0.99);
}
</style>
