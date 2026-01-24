<template>
  <div class="relative min-h-screen bg-white">
    <main class="pb-16">
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
import { ref, onMounted, watch } from "vue";
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

const showNavigation = ref(true);
const route = useRoute();
const store = useAppStore();

const hideNavigationOnPages = ["booking"];

const updateNavigationVisibility = () => {
  showNavigation.value = !hideNavigationOnPages.includes(route.name);
};

const handleCloseModal = () => {
  bookingModalState.value = {
    visible: false,
    program: null,
    eventKey: "",
    title: "",
  };
};

watch(() => route.name, updateNavigationVisibility);

onMounted(() => {
  initTelegramWebApp();

  try {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.setHeaderColor("#4e5d51");
      tg.setBackgroundColor("#ffffff");

      if (tg.BackButton) {
        tg.BackButton.hide();
      }

      tg.enableClosingConfirmation();
      tg.expand();

      console.log("Telegram WebApp configured:", {
        headerColor: tg.headerColor,
        backgroundColor: tg.backgroundColor,
        themeParams: tg.themeParams,
      });
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

  updateNavigationVisibility();
});
</script>
