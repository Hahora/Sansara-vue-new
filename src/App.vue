<template>
  <div class="relative min-h-screen bg-[#edeae6]">
    <main class="pb-20">
      <RouterView />
    </main>

    <Navigation v-if="showNavigation" />

    <BookingModal
      :visible="bookingModalState.visible"
      :program="bookingModalState.program"
      :event-key="bookingModalState.eventKey"
      :title="bookingModalState.title"
      @update:visible="handleCloseModal"
      @close="handleCloseModal"
      :key="`modal-${bookingModalState.visible}`"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores/appStore";
import BookingModal from "@/components/BookingModal.vue";
import Navigation from "@/components/Navigation.vue";
import {
  initTelegramWebApp,
  getTelegramUserInfo,
  hasValidTelegramData,
} from "@/utils/telegram.js";
import { bookingModalState } from "@/utils/eventBus";

const route = useRoute();
const store = useAppStore();

// Страницы без навигации
const hideNavigationOnPages = ["booking", "TelegramRequired", "PrivacyPolicy"];

// Показывать навигацию?
const showNavigation = computed(() => {
  // Скрываем на определённых страницах
  if (hideNavigationOnPages.includes(route.name)) {
    return false;
  }
  // Скрываем на публичных страницах (meta.public)
  if (route.meta?.public) {
    return false;
  }
  return true;
});

const handleCloseModal = () => {
  bookingModalState.value = {
    visible: false,
    program: null,
    eventKey: "",
    title: "",
  };
};

onMounted(() => {
  initTelegramWebApp();

  try {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.setHeaderColor("#202c27");
      tg.setBackgroundColor("#edeae6");

      if (tg.BackButton) {
        tg.BackButton.hide();
      }

      tg.enableClosingConfirmation();
      tg.expand();

      console.log("Telegram WebApp configured with new colors");
    }
  } catch (error) {
    console.warn("Failed to configure Telegram buttons:", error);
  }

  localStorage.removeItem("telegram_user");
  delete window.testInitData;

  if (hasValidTelegramData()) {
    const userInfo = getTelegramUserInfo();
    console.log("Telegram user authenticated:", userInfo);
    localStorage.setItem("telegram_user", JSON.stringify(userInfo));
  } else {
    console.warn(
      "No valid Telegram data available - application must be run through Telegram"
    );
  }
});
</script>

<style>
/* Глобальные стили для премиум дизайна */
body {
  background-color: #edeae6;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    sans-serif;
}

/* Плавные переходы для всех интерактивных элементов */
* {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease,
    opacity 0.3s ease;
}

/* Улучшение скроллбара для всего приложения */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(32, 44, 39, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(194, 168, 136, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(194, 168, 136, 0.5);
}
</style>
