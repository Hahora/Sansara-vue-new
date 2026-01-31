<template>
  <nav
    class="bg-[#202c27] border-t border-[#202c27]/80 px-3 py-2 fixed bottom-0 left-0 right-0 z-50 shadow-xl backdrop-blur-lg"
  >
    <!-- Декоративная полоска сверху -->
    <div
      class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c2a886]/50 to-transparent"
    ></div>

    <!-- Для обычных пользователей - 4 пункта без скролла -->
    <div
      v-if="!isAdmin"
      class="max-w-md mx-auto flex justify-between items-center"
    >
      <!-- Главная -->
      <router-link to="/" class="nav-item group" active-class="nav-item-active">
        <div
          class="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 group-hover:bg-[#202c27]/70"
        >
          <div class="icon-wrapper mb-0.5">
            <Home
              class="w-5 h-5 transition-all duration-300 group-hover:scale-110"
            />
            <div class="active-indicator"></div>
          </div>
          <span class="nav-label">Главная</span>
          <div class="active-line"></div>
        </div>
      </router-link>

      <!-- События -->
      <router-link
        to="/events"
        class="nav-item group"
        active-class="nav-item-active"
      >
        <div
          class="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 group-hover:bg-[#202c27]/70"
        >
          <div class="icon-wrapper mb-0.5">
            <CalendarDays
              class="w-5 h-5 transition-all duration-300 group-hover:scale-110"
            />
            <div class="active-indicator"></div>
          </div>
          <span class="nav-label">События</span>
          <div class="active-line"></div>
        </div>
      </router-link>

      <!-- Программы -->
      <router-link
        to="/programs"
        class="nav-item group"
        active-class="nav-item-active"
      >
        <div
          class="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 group-hover:bg-[#202c27]/70"
        >
          <div class="icon-wrapper mb-0.5">
            <CheckCircle
              class="w-5 h-5 transition-all duration-300 group-hover:scale-110"
            />
            <div class="active-indicator"></div>
          </div>
          <span class="nav-label">Программы</span>
          <div class="active-line"></div>
        </div>
      </router-link>

      <!-- Профиль -->
      <router-link
        to="/profile"
        class="nav-item group"
        active-class="nav-item-active"
      >
        <div
          class="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 group-hover:bg-[#202c27]/70"
        >
          <div class="icon-wrapper mb-0.5">
            <UserIcon
              class="w-5 h-5 transition-all duration-300 group-hover:scale-110"
            />
            <div class="active-indicator"></div>
          </div>
          <span class="nav-label">Профиль</span>
          <div class="active-line"></div>
        </div>
      </router-link>
    </div>

    <!-- Для админа - 5 компактных пунктов -->
    <div v-else class="max-w-md mx-auto">
      <div class="flex justify-between items-center">
        <!-- Главная -->
        <router-link
          to="/"
          class="nav-item-compact group"
          active-class="nav-item-active"
        >
          <div
            class="relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-300 group-hover:bg-[#202c27]/70"
          >
            <div class="icon-wrapper mb-0.5">
              <Home
                class="w-4 h-4 transition-all duration-300 group-hover:scale-110"
              />
              <div class="active-indicator-compact"></div>
            </div>
            <span class="nav-label-compact">Главная</span>
            <div class="active-line-compact"></div>
          </div>
        </router-link>

        <!-- События -->
        <router-link
          to="/events"
          class="nav-item-compact group"
          active-class="nav-item-active"
        >
          <div
            class="relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-300 group-hover:bg-[#202c27]/70"
          >
            <div class="icon-wrapper mb-0.5">
              <CalendarDays
                class="w-4 h-4 transition-all duration-300 group-hover:scale-110"
              />
              <div class="active-indicator-compact"></div>
            </div>
            <span class="nav-label-compact">События</span>
            <div class="active-line-compact"></div>
          </div>
        </router-link>

        <!-- Программы -->
        <router-link
          to="/programs"
          class="nav-item-compact group"
          active-class="nav-item-active"
        >
          <div
            class="relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-300 group-hover:bg-[#202c27]/70"
          >
            <div class="icon-wrapper mb-0.5">
              <CheckCircle
                class="w-4 h-4 transition-all duration-300 group-hover:scale-110"
              />
              <div class="active-indicator-compact"></div>
            </div>
            <span class="nav-label-compact">Программы</span>
            <div class="active-line-compact"></div>
          </div>
        </router-link>

        <!-- Профиль -->
        <router-link
          to="/profile"
          class="nav-item-compact group"
          active-class="nav-item-active"
        >
          <div
            class="relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-300 group-hover:bg-[#202c27]/70"
          >
            <div class="icon-wrapper mb-0.5">
              <UserIcon
                class="w-4 h-4 transition-all duration-300 group-hover:scale-110"
              />
              <div class="active-indicator-compact"></div>
            </div>
            <span class="nav-label-compact">Профиль</span>
            <div class="active-line-compact"></div>
          </div>
        </router-link>

        <!-- Админ -->
        <router-link
          to="/admin"
          class="nav-item-compact group"
          active-class="nav-item-active"
        >
          <div
            class="relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-300 group-hover:bg-[#202c27]/70"
          >
            <div class="icon-wrapper mb-0.5">
              <Settings
                class="w-4 h-4 transition-all duration-300 group-hover:scale-110"
              />
              <div class="active-indicator-compact"></div>
            </div>
            <span class="nav-label-compact">Админ</span>
            <div class="active-line-compact"></div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Декоративная полоска снизу -->
    <div
      class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c2a886]/30 to-transparent"
    ></div>
  </nav>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import icons from "@/utils/icons";

export default {
  name: "Navigation",
  components: {
    ...icons,
  },
  computed: {
    ...mapState(useAppStore, ["user"]),
    isAdmin() {
      return this.user && this.user.admin === true;
    },
  },
};
</script>

<style scoped>
/* Базовые стили для навигации обычных пользователей */
.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  min-width: 0;
}

.nav-item:active {
  transform: scale(0.95);
}

/* Компактные стили для админа */
.nav-item-compact {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  min-width: 0;
}

.nav-item-compact:active {
  transform: scale(0.95);
}

/* Иконки */
.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* Текст под иконкой */
.nav-label {
  font-size: 0.7rem;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  letter-spacing: 0.2px;
  margin-top: 2px;
}

.nav-label-compact {
  font-size: 0.65rem;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  letter-spacing: 0.1px;
  margin-top: 1px;
}

/* Эффект при наведении */
.nav-item:hover,
.nav-item-compact:hover {
  color: #c2a886;
}

.nav-item:hover .icon-wrapper,
.nav-item-compact:hover .icon-wrapper {
  transform: translateY(-1px);
}

.nav-item:hover .nav-label,
.nav-item-compact:hover .nav-label-compact {
  color: #c2a886;
  font-weight: 500;
}

/* Активное состояние */
.nav-item-active {
  color: #c2a886 !important;
}

.nav-item-active .nav-label,
.nav-item-active .nav-label-compact {
  color: #c2a886 !important;
  font-weight: 600;
}

/* Активный индикатор (кружок под иконкой) */
.active-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 36px;
  height: 36px;
  background: rgba(194, 168, 136, 0.15);
  border-radius: 12px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.active-indicator-compact {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 32px;
  height: 32px;
  background: rgba(194, 168, 136, 0.15);
  border-radius: 10px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.nav-item-active .active-indicator,
.nav-item-active .active-indicator-compact {
  transform: translate(-50%, -50%) scale(1);
}

.nav-item:hover .active-indicator,
.nav-item-compact:hover .active-indicator-compact {
  background: rgba(194, 168, 136, 0.1);
}

/* Активная полоска снизу */
.active-line {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #c2a886, transparent);
  border-radius: 1px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.active-line-compact {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 16px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, #c2a886, transparent);
  border-radius: 1px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.nav-item-active .active-line,
.nav-item-active .active-line-compact {
  transform: translateX(-50%) scaleX(1);
  opacity: 1;
}

/* Эффект при нажатии */
.nav-item:active .icon-wrapper,
.nav-item-compact:active .icon-wrapper {
  transform: scale(0.95);
}

/* Плавные переходы */
* {
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease,
    opacity 0.3s ease;
}

/* Эффект безопасности для iPhone */
.nav-item,
.nav-item-compact {
  -webkit-tap-highlight-color: transparent;
}

/* Убедимся, что все помещается */
@media (max-width: 400px) {
  .nav-label {
    font-size: 0.65rem;
  }

  .nav-label-compact {
    font-size: 0.6rem;
  }

  .nav-item {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .nav-item-compact {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
}

@media (max-width: 360px) {
  .nav-label {
    font-size: 0.6rem;
  }

  .nav-label-compact {
    font-size: 0.55rem;
  }

  .nav-item {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }

  .nav-item-compact {
    padding-left: 0.125rem;
    padding-right: 0.125rem;
  }
}
</style>
