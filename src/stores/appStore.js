import { defineStore } from "pinia";
import {
  userAPI,
  authAPI,
  programAPI,
  eventAPI,
  bookingAPI,
  certificateAPI,
  promoAPI,
  lotteryAPI,
  contentAPI,
  branchAPI,
} from "@/utils/api";
import { getTelegramUserInfo } from "@/utils/telegram";

// Утилиты для преобразования enum значений
const transformEnumsToLowerCase = (obj) => {
  if (!obj) return obj;

  const transformed = { ...obj };

  const enumFields = [
    "user_type",
    "gender",
    "status",
    "program_type",
    "club_type",
    "certificate_type",
    "promo_type",
    "format",
  ];

  enumFields.forEach((field) => {
    if (transformed[field] && typeof transformed[field] === "string") {
      transformed[field] = transformed[field].toLowerCase();
    }
  });

  return transformed;
};

const transformEnumsToUpperCase = (obj) => {
  if (!obj) return obj;

  const transformed = { ...obj };

  const enumFields = [
    "user_type",
    "gender",
    "status",
    "program_type",
    "club_type",
    "certificate_type",
    "promo_type",
    "format",
  ];

  enumFields.forEach((field) => {
    if (transformed[field] && typeof transformed[field] === "string") {
      transformed[field] = transformed[field].toUpperCase();
    }
  });

  return transformed;
};

export const useAppStore = defineStore("app", {
  persist: {
    pick: ["isAuthenticated"],
  },
  state: () => ({
    // Состояние пользователя
    user: null,
    isAuthenticated: false,
    userLoaded: false,

    // Состояние программ
    programs: [],
    collectivePrograms: [],
    authorPrograms: [],
    programsLoaded: false,

    // Состояние мероприятий
    events: [],
    eventsLoaded: false,

    // Состояние бронирований
    bookings: [],
    bookingsLoaded: false,

    // Состояние сертификатов и промокодов
    certificates: [],
    promos: [],
    certificatesLoaded: false,
    promosLoaded: false,

    // Состояние лотереи
    lotterySettings: null,
    lotteryCodes: [],
    lotteryPrizes: [],
    userLotteryTickets: [],
    lotteryDataLoaded: false,

    // Состояние загрузки
    isLoading: false,
    error: null,
    errorTimeoutId: null,

    // Состояние контента сайта
    siteContent: [],
    contentLoaded: false,
    contentData: {},

    // Список пользователей (для админки)
    users: [],
    usersLoaded: false,

    // Состояние филиалов
    branches: [],
    selectedBranch: null,
    branchesLoaded: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getAllBranches: (state) => state.branches,
    getSelectedBranch: (state) => state.selectedBranch,
    areBranchesLoaded: (state) => state.branchesLoaded,
    getUserBookings: (state) => {
      if (!state.user) return [];
      return state.bookings.filter(
        (booking) => booking.user_id === state.user.id
      );
    },
  },

  actions: {
    // Установить состояние загрузки
    setLoading(loading) {
      this.isLoading = loading;
      if (loading && this.error) {
        this.clearError();
      }
    },

    // Установить ошибку
    setError(error) {
      if (this.errorTimeoutId) {
        clearTimeout(this.errorTimeoutId);
        this.errorTimeoutId = null;
      }

      this.error = error;
      console.error("Store error:", error);

      this.errorTimeoutId = setTimeout(() => {
        this.clearError();
      }, 10000);
    },

    // Очистить ошибку
    clearError() {
      this.error = null;
      if (this.errorTimeoutId) {
        clearTimeout(this.errorTimeoutId);
        this.errorTimeoutId = null;
      }
    },

    async updateUserProfile(userData) {
      try {
        this.setLoading(true);
        console.log("Updating user profile with data:", userData);

        // Преобразуем enum-значения в верхний регистр перед отправкой
        const transformedUserData = transformEnumsToUpperCase(userData);
        console.log("Transformed user data for API:", transformedUserData);

        // Используем userAPI.updateMe (правильный метод)
        const updatedUser = await userAPI.updateMe(transformedUserData);
        console.log("Profile updated successfully:", updatedUser);

        // Преобразуем enum-значения в нижний регистр
        const transformedUpdatedUser = transformEnumsToLowerCase(updatedUser);

        // Обновляем локальные данные
        this.user = { ...this.user, ...transformedUpdatedUser };

        return this.user;
      } catch (error) {
        console.error("Profile update failed:", error);
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // Аутентифицировать пользователя
    async authenticate(force = false) {
      try {
        this.setLoading(true);
        console.log("Authenticating user...");

        const telegramUser = getTelegramUserInfo();
        if (telegramUser) {
          console.log("Telegram user info:", {
            id: telegramUser.id,
            username: telegramUser.username,
            firstName: telegramUser.firstName,
          });
        }

        const userData = await authAPI.getCurrentUser();
        console.log("User data received from API:", userData);

        this.user = transformEnumsToLowerCase(userData);
        this.isAuthenticated = true;
        this.userLoaded = true;

        console.log("Authentication successful, user:", this.user);
      } catch (error) {
        console.error("Authentication failed:", error);
        this.setError(error.message);
        this.isAuthenticated = false;
        this.userLoaded = false;
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // Загрузить филиалы
    async loadBranches(force = false) {
      try {
        this.setLoading(true);
        console.log("Loading branches...");

        const branches = await branchAPI.getAll();
        console.log("Branches received:", branches);

        this.branches = branches;
        this.branchesLoaded = true;

        // Если филиалы загружены впервые
        if (branches.length > 0 && !this.selectedBranch) {
          const savedBranchId = localStorage.getItem("selectedBranchId");

          if (savedBranchId) {
            const savedBranch = branches.find(
              (b) => b.id.toString() === savedBranchId
            );
            if (savedBranch) {
              this.selectedBranch = savedBranch;
              console.log(
                "Restored branch from localStorage:",
                savedBranch.name
              );
            } else {
              // Если сохраненный филиал не найден в новом списке, выбираем первый
              this.selectedBranch = branches[0];
              localStorage.setItem(
                "selectedBranchId",
                branches[0].id.toString()
              );
              localStorage.setItem("selectedBranchName", branches[0].name);
              console.log(
                "Saved branch not found, selected first:",
                branches[0].name
              );
            }
          } else {
            // Если ничего не сохранено, выбираем первый филиал
            this.selectedBranch = branches[0];
            localStorage.setItem("selectedBranchId", branches[0].id.toString());
            localStorage.setItem("selectedBranchName", branches[0].name);
            console.log("No saved branch, selected first:", branches[0].name);
          }
        }

        // Проверяем, что текущий выбранный филиал существует в новом списке
        if (this.selectedBranch && branches.length > 0) {
          const currentBranchStillExists = branches.find(
            (b) => b.id === this.selectedBranch.id
          );
          if (!currentBranchStillExists) {
            // Если выбранный филиал больше не существует, выбираем первый
            this.selectedBranch = branches[0];
            localStorage.setItem("selectedBranchId", branches[0].id.toString());
            localStorage.setItem("selectedBranchName", branches[0].name);
            console.log(
              "Current branch no longer exists, selected first:",
              branches[0].name
            );
          }
        }

        console.log(
          `Loaded ${branches.length} branches, current selected:`,
          this.selectedBranch?.name
        );
        return branches;
      } catch (error) {
        console.error("Failed to load branches:", error);
        this.setError(error.message);
        this.branchesLoaded = false;
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // Выбрать филиал
    async selectBranch(branch) {
      try {
        console.log("Selecting branch:", branch.name);

        // Просто сохраняем выбранный филиал в store
        this.selectedBranch = branch;

        // Сбрасываем данные контента — при следующем запросе загрузится для нового филиала
        this.contentData = {};

        // Сохраняем в localStorage для восстановления при перезагрузке
        localStorage.setItem("selectedBranchId", branch.id.toString());
        localStorage.setItem("selectedBranchName", branch.name);

        console.log("Branch selected:", branch.name);
        return branch;
      } catch (error) {
        console.error("Failed to select branch:", error);
        this.setError(error.message);
        throw error;
      }
    },

    // Загрузить контент сайта
    async loadSiteContent(page = "HOME", force = false) {
      try {
        this.setLoading(true);
        console.log(`Loading site content for page: ${page}`);

        // Загружаем контент для конкретной страницы с branch_id если есть
        const params = {};
        if (this.selectedBranch?.id) {
          params.branch_id = this.selectedBranch.id;
        }

        console.log("Request params:", params);
        console.log(
          "Request URL:",
          `/api/v1/content/${page}?branch_id=${params.branch_id}`
        );

        const response = await contentAPI.getByPage(page, params);

        console.log("Site content API response:", response);

        // ВАЖНО: API возвращает один объект, а не массив
        let content = [];

        if (response && typeof response === "object") {
          // Проверяем, если это массив объектов (старый формат)
          if (Array.isArray(response)) {
            content = response.filter((item) => item != null);
          } else {
            // Это один объект - создаем массив с ним
            content = [response];
          }
        } else {
          console.warn("Unexpected content response format:", response);
          content = [];
        }

        console.log("Processed site content:", {
          page,
          contentLength: content?.length || 0,
          contentKeys: content?.map((item) => item?.key).filter(Boolean) || [],
        });

        this.siteContent = content;

        // Мёрджим новый контент в существующий (не затираем другие страницы)
        const newPageData = content.reduce((acc, item) => {
          if (item && typeof item === "object" && item.key) {
            acc[item.key] = item;
          } else if (item && typeof item === "object") {
            acc[page] = item;
          } else {
            console.warn("Skipping invalid content item:", item);
          }
          return acc;
        }, {});
        this.contentData = { ...this.contentData, ...newPageData };

        this.contentLoaded = true;
        console.log(
          `Successfully loaded ${content.length} content items for page: ${page}`
        );
        console.log("Available content keys:", Object.keys(this.contentData));
        console.log("HOME content data:", this.contentData["HOME"]);
      } catch (error) {
        console.error("Failed to load site content:", error);
        this.setError(error.message);
        this.contentLoaded = false;
        this.siteContent = [];
        this.contentData = {};
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async loadAllContent(force = false) {
      try {
        console.log("Loading all content...");

        // Загружаем контент для главной страницы
        await this.loadSiteContent("HOME", force);

        if (this.contentLoaded) {
          console.log("Content loaded successfully");
          console.log("Available content keys:", Object.keys(this.contentData));
        } else {
          throw new Error("Failed to load essential site content");
        }
      } catch (error) {
        console.error("Failed to load content:", error);
        this.setError(error.message);
        throw error;
      }
    },

    // Загрузить программы
    async loadPrograms(force = false) {
      try {
        this.setLoading(true);
        const programs = await programAPI.getAll();

        this.programs = programs.map(transformEnumsToLowerCase);
        this.programsLoaded = true;
        console.log(`Loaded ${this.programs.length} programs`);
      } catch (error) {
        console.error("Failed to load programs:", error);
        this.setError(error.message);
        this.programsLoaded = false;
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // Загрузить мероприятия
    async loadEvents(force = false) {
      try {
        this.setLoading(true);
        const events = await eventAPI.getAll();

        this.events = events.map(transformEnumsToLowerCase);
        this.eventsLoaded = true;
        console.log(`Loaded ${this.events.length} events`);
      } catch (error) {
        console.error("Failed to load events:", error);
        this.setError(error.message);
        this.eventsLoaded = false;
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
