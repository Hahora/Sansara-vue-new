import { createRouter, createWebHistory } from "vue-router";
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

const routes = [
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
    path: "/admin",
    name: "Admin",
    component: AdminPage,
  },
  {
    path: "/admin/bookings",
    name: "AdminBookings",
    component: AdminBookingsPage,
  },
  {
    path: "/admin/certificates",
    name: "AdminCertificates",
    component: () => import("@/pages/admin/AdminCertificatesPage.vue"),
  },
  {
    path: "/admin/programs",
    name: "AdminPrograms",
    component: () => import("@/pages/admin/AdminProgramsPage.vue"),
  },
  {
    path: "/admin/events",
    name: "AdminEvents",
    component: () => import("@/pages/admin/AdminEventsPage.vue"),
  },
  {
    path: "/admin/users",
    name: "AdminUsersPage",
    component: () => import("@/pages/admin/AdminUsersPage.vue"),
  },
  {
    path: "/admin/promocodes",
    name: "AdminPromoPage",
    component: () => import("@/pages/admin/AdminPromoPage.vue"),
  },
  {
    path: "/admin/branches",
    name: "AdminBranchesPage",
    component: () => import("@/pages/admin/AdminBranchesPage.vue"),
  },
  {
    path: "/admin/recommendations",
    name: "AdminRecommendations",
    component: () => import("@/pages/admin/AdminRecommendationsPage.vue"),
  },
  {
    path: "/admin/content",
    name: "AdminContentPage",
    component: AdminContentPage,
  },
  {
    path: "/admin/mailing",
    name: "AdminMailingPage",
    component: () => import("@/pages/admin/AdminMailingPage.vue"),
  },
  {
    path: "/admin/lottery",
    name: "AdminLotteryPage",
    component: () => import("@/pages/admin/AdminLotteryPage.vue"),
  },
  {
    path: "/admin/media",
    name: "AdminMediaPage",
    component: () => import("@/pages/admin/AdminMediaPage.vue"),
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
