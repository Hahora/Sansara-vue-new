import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "@/stores/appStore";
import HomePage from "@/pages/HomePage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import BachelorPage from "@/pages/BachelorPage.vue";
import ClubEventsPage from "@/pages/ClubEventsPage.vue";
import CollectiveProgramsPage from "@/pages/CollectiveProgramsPage.vue";
import AuthorProgramsPage from "@/pages/AuthorProgramsPage.vue";
import LoyaltyPage from "@/pages/LoyaltyPage.vue";
import FirstTimePage from "@/pages/FirstTimePage.vue";
import CorporatePage from "@/pages/CorporatePage.vue";
import CertificatesPage from "@/pages/CertificatesPage.vue";
import ProgramsPage from "@/pages/ProgramsPage.vue";
import EventsPage from "@/pages/EventsPage.vue";
import AdminPage from "@/pages/admin/AdminPage.vue";
import AdminBookingsPage from "@/pages/admin/AdminBookingsPage.vue";
import AdminContentPage from "@/pages/admin/AdminContentPage.vue";

// ══════════════════════════════════════════════════════════════
// Проверка запуска из Telegram
// ══════════════════════════════════════════════════════════════
function isTelegramWebApp() {
  const tg = window.Telegram?.WebApp;
  return !!(tg && tg.initData && tg.initData.length > 0);
}

const routes = [
  // ══════════════════════════════════════════════════════════════
  // Публичные страницы (доступны без Telegram)
  // ══════════════════════════════════════════════════════════════
  {
    path: "/telegram-required",
    name: "TelegramRequired",
    component: () => import("@/pages/TelegramRequiredPage.vue"),
    meta: { public: true },
  },
  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    component: () => import("@/pages/PrivacyPolicyPage.vue"),
    meta: { public: true },
  },

  // ══════════════════════════════════════════════════════════════
  // Страницы требующие Telegram
  // ══════════════════════════════════════════════════════════════
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
  },
  {
    path: "/bachelor",
    name: "Bachelor",
    component: BachelorPage,
  },
  {
    path: "/club-events",
    name: "ClubEvents",
    component: ClubEventsPage,
  },
  {
    path: "/collective-programs",
    name: "CollectivePrograms",
    component: CollectiveProgramsPage,
  },
  {
    path: "/author-programs",
    name: "AuthorPrograms",
    component: AuthorProgramsPage,
  },
  {
    path: "/loyalty",
    name: "Loyalty",
    component: LoyaltyPage,
  },
  {
    path: "/first-time",
    name: "FirstTime",
    component: FirstTimePage,
  },
  {
    path: "/corporate",
    name: "Corporate",
    component: CorporatePage,
  },
  {
    path: "/certificates",
    name: "Certificates",
    component: CertificatesPage,
  },
  {
    path: "/programs",
    name: "Programs",
    component: ProgramsPage,
  },
  {
    path: "/events",
    name: "Events",
    component: EventsPage,
  },
  {
    path: "/lottery",
    name: "Lottery",
    component: () => import("@/pages/LotteryPage.vue"),
  },
  {
    path: "/collective-programs/:id",
    name: "CollectiveProgramDetail",
    component: () => import("@/pages/CollectiveProgramDetailPage.vue"),
  },
  {
    path: "/author-programs/:id",
    name: "AuthorProgramDetail",
    component: () => import("@/pages/AuthorProgramDetailPage.vue"),
  },
  {
    path: "/profile/history",
    name: "BookingHistory",
    component: () => import("@/pages/BookingHistoryPage.vue"),
  },

  // ══════════════════════════════════════════════════════════════
  // Админские роуты (требуют admin: true)
  // ══════════════════════════════════════════════════════════════
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/bookings",
    name: "AdminBookings",
    component: AdminBookingsPage,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/certificates",
    name: "AdminCertificates",
    component: () => import("@/pages/admin/AdminCertificatesPage.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/programs",
    name: "AdminPrograms",
    component: () => import("@/pages/admin/AdminProgramsPage.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/events",
    name: "AdminEvents",
    component: () => import("@/pages/admin/AdminEventsPage.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/users",
    name: "AdminUsersPage",
    component: () => import("@/pages/admin/AdminUsersPage.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/promocodes",
    name: "AdminPromoPage",
    component: () => import("@/pages/admin/AdminPromoPage.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/branches",
    name: "AdminBranchesPage",
    component: () => import("@/pages/admin/AdminBranchesPage.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/recommendations",
    name: "AdminRecommendations",
    component: () => import("@/pages/admin/AdminRecommendationsPage.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/content",
    name: "AdminContentPage",
    component: AdminContentPage,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/mailing",
    name: "AdminMailingPage",
    component: () => import("@/pages/admin/AdminMailingPage.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/lottery",
    name: "AdminLotteryPage",
    component: () => import("@/pages/admin/AdminLotteryPage.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/media",
    name: "AdminMediaPage",
    component: () => import("@/pages/admin/AdminMediaPage.vue"),
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

// ══════════════════════════════════════════════════════════════
// Navigation Guard
// ══════════════════════════════════════════════════════════════
router.beforeEach(async (to, from, next) => {
  // 1. Публичные страницы - пропускаем без проверок
  if (to.meta.public) {
    return next();
  }

  // 2. Проверяем запуск из Telegram
  if (!isTelegramWebApp()) {
    console.warn("Not running in Telegram WebApp");
    return next({ name: "TelegramRequired" });
  }

  // 3. Проверяем админские права
  if (to.meta.requiresAdmin) {
    const store = useAppStore();

    // Если пользователь ещё не загружен - ждём
    if (!store.user) {
      try {
        await store.authenticate();
      } catch (error) {
        console.error("Auth error:", error);
        return next({ path: "/" });
      }
    }

    // Проверяем права админа
    if (!store.user || store.user.admin !== true) {
      console.warn("Access denied: admin rights required");
      return next({ path: "/" });
    }
  }

  next();
});

export default router;
