<template>
  <nav
    class="bg-white border-t border-gray-200 px-2 py-2 fixed bottom-0 left-0 right-0 z-50 shadow-lg"
  >
    <!-- Без админки - обычная раскладка -->
    <div
      v-if="!isAdmin"
      class="max-w-md mx-auto flex justify-around items-center"
    >
      <router-link to="/" class="nav-item group" active-class="nav-item-active">
        <div
          class="relative flex flex-col items-center justify-center py-2 px-6 rounded-xl transition-all duration-200"
        >
          <div class="icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="nav-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <span class="nav-label">Главная</span>
        </div>
      </router-link>

      <router-link
        to="/events"
        class="nav-item group"
        active-class="nav-item-active"
      >
        <div
          class="relative flex flex-col items-center justify-center py-2 px-6 rounded-xl transition-all duration-200"
        >
          <div class="icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="nav-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span class="nav-label">События</span>
        </div>
      </router-link>

      <router-link
        to="/programs"
        class="nav-item group"
        active-class="nav-item-active"
      >
        <div
          class="relative flex flex-col items-center justify-center py-2 px-6 rounded-xl transition-all duration-200"
        >
          <div class="icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="nav-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span class="nav-label">Программы</span>
        </div>
      </router-link>

      <router-link
        to="/profile"
        class="nav-item group"
        active-class="nav-item-active"
      >
        <div
          class="relative flex flex-col items-center justify-center py-2 px-6 rounded-xl transition-all duration-200"
        >
          <div class="icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="nav-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span class="nav-label">Профиль</span>
        </div>
      </router-link>
    </div>

    <!-- С админкой - скролл -->
    <div v-else class="max-w-md mx-auto relative">
      <!-- Кнопка прокрутки влево -->
      <button
        v-if="canScrollLeft"
        @click="scrollLeft"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-colors"
        style="margin-left: -8px"
      >
        <svg
          class="w-4 h-4 text-gray-600"
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

      <!-- Контейнер для скролла -->
      <div
        ref="scrollContainer"
        class="flex overflow-x-auto scrollbar-hide"
        style="scrollbar-width: none; -ms-overflow-style: none"
        @scroll="handleScroll"
      >
        <div class="flex flex-nowrap items-center">
          <!-- Главная -->
          <router-link
            to="/"
            class="nav-item group"
            active-class="nav-item-active"
          >
            <div
              class="relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 min-w-max"
            >
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="nav-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span class="nav-label">Главная</span>
            </div>
          </router-link>

          <!-- События -->
          <router-link
            to="/events"
            class="nav-item group"
            active-class="nav-item-active"
          >
            <div
              class="relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 min-w-max"
            >
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="nav-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span class="nav-label">События</span>
            </div>
          </router-link>

          <!-- Программы -->
          <router-link
            to="/programs"
            class="nav-item group"
            active-class="nav-item-active"
          >
            <div
              class="relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 min-w-max"
            >
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="nav-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span class="nav-label">Программы</span>
            </div>
          </router-link>

          <!-- Профиль -->
          <router-link
            to="/profile"
            class="nav-item group"
            active-class="nav-item-active"
          >
            <div
              class="relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 min-w-max"
            >
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="nav-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span class="nav-label">Профиль</span>
            </div>
          </router-link>

          <!-- Админ панель -->
          <router-link
            to="/admin"
            class="nav-item group"
            active-class="nav-item-active"
          >
            <div
              class="relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 min-w-max"
            >
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="nav-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span class="nav-label">Админ</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Кнопка прокрутки вправо -->
      <button
        v-if="canScrollRight"
        @click="scrollRight"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-colors"
        style="margin-right: -8px"
      >
        <svg
          class="w-4 h-4 text-gray-600"
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
    </div>
  </nav>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";

export default {
  name: "Navigation",
  data() {
    return {
      canScrollLeft: false,
      canScrollRight: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ["user"]),
    isAdmin() {
      return this.user && this.user.admin === true;
    },
  },
  mounted() {
    if (this.isAdmin) {
      this.checkScrollButtons();
      window.addEventListener("resize", this.checkScrollButtons);
    }
  },
  beforeDestroy() {
    if (this.isAdmin) {
      window.removeEventListener("resize", this.checkScrollButtons);
    }
  },
  methods: {
    scrollLeft() {
      if (this.$refs.scrollContainer) {
        this.$refs.scrollContainer.scrollBy({ left: -100, behavior: "smooth" });
      }
    },

    scrollRight() {
      if (this.$refs.scrollContainer) {
        this.$refs.scrollContainer.scrollBy({ left: 100, behavior: "smooth" });
      }
    },

    handleScroll() {
      this.checkScrollButtons();
    },

    checkScrollButtons() {
      if (!this.$refs.scrollContainer) return;

      const container = this.$refs.scrollContainer;
      this.canScrollLeft = container.scrollLeft > 0;
      this.canScrollRight =
        container.scrollLeft < container.scrollWidth - container.clientWidth;
    },

    scrollToActiveTab() {
      this.$nextTick(() => {
        const activeElement =
          this.$refs.scrollContainer.querySelector(".nav-item-active");
        if (activeElement) {
          activeElement.scrollIntoView({
            behavior: "smooth",
            inline: "center",
          });
        }
      });
    },
  },
  watch: {
    $route() {
      if (this.isAdmin) {
        setTimeout(this.scrollToActiveTab, 100);
      }
    },
  },
};
</script>

<style scoped>
.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
  flex: 1;
  max-width: 90px;
}

.nav-item:active {
  transform: scale(0.95);
}

.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.nav-icon {
  width: 22px;
  height: 22px;
  transition: all 0.2s ease;
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

/* Эффект при наведении */
.nav-item:hover .icon-wrapper::before {
  content: "";
  position: absolute;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 12px;
  z-index: -1;
  transform: scale(1);
  transition: transform 0.2s ease;
}

.nav-item:hover .nav-icon {
  color: #4e5d51;
  transform: translateY(-1px);
}

.nav-item:hover .nav-label {
  color: #4e5d51;
}

/* Активное состояние */
.nav-item-active {
  color: #4e5d51;
}

.nav-item-active .icon-wrapper::before {
  content: "";
  position: absolute;
  width: 40px;
  height: 40px;
  background: #f1f5f2;
  border-radius: 12px;
  z-index: -1;
}

.nav-item-active .nav-icon {
  color: #4e5d51;
  stroke-width: 2.5;
}

.nav-item-active .nav-label {
  color: #4e5d51;
  font-weight: 600;
}

/* Скрываем скроллбар */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Для Firefox */
.scrollbar-hide {
  scrollbar-width: none;
}

/* Для админской навигации */
.nav-item.min-w-max {
  flex: 0 0 auto;
  max-width: none;
  margin: 0 2px;
}

/* Адаптация для маленьких экранов */
@media (max-width: 360px) {
  .nav-icon {
    width: 20px;
    height: 20px;
  }

  .nav-label {
    font-size: 0.65rem;
  }

  .nav-item {
    max-width: 85px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
