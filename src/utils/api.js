// src/utils/api.js

import { getTelegramInitData } from "./telegram.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const SKIP_NGROK_WARNING = import.meta.env.VITE_SKIP_NGROK_WARNING || "true";

function getTelegramAuthData() {
  const initData = getTelegramInitData();

  if (initData) {
    console.log("Telegram WebApp initData found");
    console.log("InitData length:", initData.length);
    console.log("InitData preview:", initData.substring(0, 150) + "...");

    const hasUser = initData.includes("user=");
    const hasHash = initData.includes("hash=");
    const hasAuthDate = initData.includes("auth_date=");

    console.log("InitData validation:", { hasUser, hasHash, hasAuthDate });

    if (!hasUser || !hasHash) {
      console.error("InitData missing required fields");
      return null;
    }
  } else {
    console.error("No Telegram WebApp initData available");
  }

  return initData;
}

function getTelegramUserId() {
  if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
    return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
  }
  return null;
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const telegramAuthData = getTelegramAuthData();

  if (!telegramAuthData && !endpoint.includes("/health")) {
    console.error("No Telegram auth data available - request blocked");
    throw new Error(
      "Telegram authentication required. Please open the app through Telegram."
    );
  }

  const headers = {
    "Content-Type": "application/json",
    ...(SKIP_NGROK_WARNING === "true" && {
      "ngrok-skip-browser-warning": "true",
    }),
    ...options.headers,
  };

  if (telegramAuthData) {
    headers["X-Telegram-Init-Data"] = telegramAuthData;
    console.log("Added __init_data to headers");
  }

  const config = {
    ...options,
    headers,
  };

  if (
    (config.method === "POST" ||
      config.method === "PUT" ||
      config.method === "PATCH") &&
    !(config.body instanceof FormData)
  ) {
    if (telegramAuthData) {
      let bodyData = {};

      if (config.body) {
        try {
          bodyData = JSON.parse(config.body);
        } catch (e) {
          console.warn("Could not parse existing request body:", e);
        }
      }

      bodyData.__init_data = telegramAuthData;
      config.body = JSON.stringify(bodyData);
      console.log("Added __init_data to request body");
    }
  }

  if (config.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  try {
    console.log(`Making ${config.method || "GET"} request to: ${url}`);
    console.log("Request config:", {
      method: config.method || "GET",
      headers: Object.keys(config.headers),
      hasBody: !!config.body,
    });

    const response = await fetch(url, config);

    console.log(`Response status: ${response.status}`);
    console.log(
      `Response content-type: ${response.headers.get("content-type")}`
    );

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData = null;

      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
          console.error("API Error:", errorData);
        } else {
          const errorText = await response.text();
          console.warn("Non-JSON error response:", errorText);
          errorMessage = errorText || errorMessage;
        }
      } catch (e) {
        console.warn("Could not parse error response:", e);
      }

      console.error("Request failed:", {
        url,
        method: config.method || "GET",
        status: response.status,
        statusText: response.statusText,
        errorData,
        errorMessage,
      });

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      console.log("Empty response (204 No Content)");
      return {};
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.warn(`Expected JSON response but got ${contentType}`);
    }

    const responseText = await response.text();

    if (!responseText.trim()) {
      console.log("Empty response body");
      return {};
    }

    try {
      const trimmedText = responseText.trim();

      if (!trimmedText.startsWith("{") && !trimmedText.startsWith("[")) {
        console.error(
          "Response does not appear to be JSON:",
          trimmedText.substring(0, 100)
        );
        throw new Error(
          `Response is not valid JSON. Received: ${trimmedText.substring(0, 100)}...`
        );
      }

      const data = JSON.parse(trimmedText);
      console.log("Successfully parsed response:", {
        dataType: Array.isArray(data) ? "array" : typeof data,
        dataLength: Array.isArray(data)
          ? data.length
          : Object.keys(data).length,
      });
      return data;
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      console.error("Raw response:", responseText.substring(0, 500));
      throw new Error(`Invalid JSON response: ${e.message}`);
    }
  } catch (error) {
    console.error(`Request error for ${url}:`, error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error detected:", {
        url,
        message: error.message,
        stack: error.stack,
      });
      throw new Error(
        `Network error: Could not connect to ${url}. Please check your connection.`
      );
    }

    if (
      error.message.includes("HTTP error!") ||
      error.message.includes("Invalid JSON response") ||
      error.message.includes("Telegram authentication required")
    ) {
      throw error;
    }

    console.error("Unexpected error:", {
      url,
      error,
      errorMessage: error.message,
      stack: error.stack,
    });

    throw error;
  }
}

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: () => apiRequest("/api/v1/auth/login", { method: "POST" }),
  verify: () => apiRequest("/api/v1/auth/verify", { method: "POST" }),
  getCurrentUser: () => apiRequest("/api/v1/auth/me", { method: "GET" }),
};

// ============================================
// USER API
// ============================================
export const userAPI = {
  // PUBLIC
  getMe: () => apiRequest("/api/v1/users/me", { method: "GET" }),

  updateMe: (userData) =>
    apiRequest("/api/v1/users/me", {
      method: "PATCH",
      body: JSON.stringify(userData),
    }),

  uploadContact: (contactData) =>
    apiRequest("/api/v1/users/me/upload-contact", {
      method: "POST",
      body: JSON.stringify(contactData),
    }),

  // ADMIN
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return apiRequest(`/api/v1/admin/users?${queryParams}`, { method: "GET" });
  },

  getUserById: (userId) =>
    apiRequest(`/api/v1/admin/users/${userId}`, { method: "GET" }),

  updateStatus: (userId, status) =>
    apiRequest(`/api/v1/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  banUser: (userId) =>
    apiRequest(`/api/v1/admin/users/${userId}/ban`, { method: "POST" }),

  unbanUser: (userId) =>
    apiRequest(`/api/v1/admin/users/${userId}/unban`, { method: "POST" }),

  exportExcel: () =>
    apiRequest("/api/v1/admin/users/export-excel", { method: "POST" }),
};

// ============================================
// BRANCH API
// ============================================
export const branchAPI = {
  // PUBLIC
  getAll: () => apiRequest("/api/v1/branches", { method: "GET" }),

  getById: (branchId) =>
    apiRequest(`/api/v1/branches/${branchId}`, { method: "GET" }),

  select: (branchId) =>
    apiRequest("/api/v1/branches/select", {
      method: "POST",
      body: JSON.stringify({ branch_id: branchId }),
    }),

  // ADMIN
  getAllAdmin: () => apiRequest("/api/v1/admin/branches/", { method: "GET" }),

  create: (branchData) =>
    apiRequest("/api/v1/admin/branches/", {
      method: "POST",
      body: JSON.stringify(branchData),
    }),

  update: (branchId, branchData) =>
    apiRequest(`/api/v1/admin/branches/${branchId}`, {
      method: "PUT",
      body: JSON.stringify(branchData),
    }),

  delete: (branchId) =>
    apiRequest(`/api/v1/admin/branches/${branchId}`, {
      method: "DELETE",
    }),
};

// ============================================
// ADMIN API (специальные админ-методы)
// ============================================
export const adminAPI = {
  // Филиалы
  getBranches: () => apiRequest("/api/v1/admin/branches/", { method: "GET" }),

  createBranch: (branchData) =>
    apiRequest("/api/v1/admin/branches/", {
      method: "POST",
      body: JSON.stringify(branchData),
    }),

  updateBranch: (branchId, branchData) =>
    apiRequest(`/api/v1/admin/branches/${branchId}`, {
      method: "PUT",
      body: JSON.stringify(branchData),
    }),
};

// ============================================
// RECOMMENDATION API
// ============================================
// ============================================
// RECOMMENDATION API
// ============================================
export const recommendationAPI = {
  // PUBLIC - для пользователей
  getRecommendation: (currentMood, desiredMood) =>
    apiRequest(
      `/api/v1/recommendations?current_mood=${currentMood}&desired_mood=${desiredMood}`,
      {
        method: "GET",
      }
    ),

  // ADMIN
  getAllAdmin: () =>
    apiRequest("/api/v1/admin/recommendations", { method: "GET" }),

  getById: (recId) =>
    apiRequest(`/api/v1/admin/recommendations/${recId}`, { method: "GET" }),

  create: (recommendationData) => {
    console.log("API create with data:", recommendationData); // Логируем данные

    return apiRequest("/api/v1/admin/recommendations", {
      method: "POST",
      body: JSON.stringify(recommendationData),
    });
  },

  update: (recId, recommendationData) => {
    console.log("API update with data:", recommendationData); // Логируем данные

    return apiRequest(`/api/v1/admin/recommendations/${recId}`, {
      method: "PUT",
      body: JSON.stringify(recommendationData),
    });
  },

  delete: (recId) =>
    apiRequest(`/api/v1/admin/recommendations/${recId}`, {
      method: "DELETE",
    }),
};

// ============================================
// PROGRAM API
// ============================================
export const programAPI = {
  // PUBLIC - ОБЩИЕ МЕТОДЫ
  getAll: (branchId = null, short = true) => {
    const params = new URLSearchParams();
    if (branchId) params.append("branch_id", branchId);
    if (short) params.append("short", "true");
    const queryString = params.toString();
    return apiRequest(
      `/api/v1/programs${queryString ? "?" + queryString : ""}`,
      { method: "GET" }
    );
  },

  getById: (programId) =>
    apiRequest(`/api/v1/programs/${programId}`, { method: "GET" }),

  // КОЛЛЕКТИВНЫЕ ПРОГРАММЫ
  getCollective: (branchId) => {
    const params = branchId ? `?branch_id=${branchId}` : "";
    return apiRequest(`/api/v1/programs/collective${params}`, {
      method: "GET",
    });
  },

  getCollectiveById: (programId) =>
    apiRequest(`/api/v1/programs/collective/${programId}`, {
      method: "GET",
    }),

  getCollectiveMedia: (programId) =>
    apiRequest(`/api/v1/programs/collective/${programId}/media`, {
      method: "GET",
    }),

  // АВТОРСКИЕ ПРОГРАММЫ
  getAuthor: (branchId) => {
    const params = branchId ? `?branch_id=${branchId}` : "";
    return apiRequest(`/api/v1/programs/author${params}`, {
      method: "GET",
    });
  },

  getAuthorById: (programId) =>
    apiRequest(`/api/v1/programs/author/${programId}`, {
      method: "GET",
    }),

  getAuthorMedia: (programId) =>
    apiRequest(`/api/v1/programs/author/${programId}/media`, {
      method: "GET",
    }),

  getAuthorRecommendation: (branchId, currentMood, desiredMood) => {
    return apiRequest(
      `/api/v1/programs/author/recommend?branch_id=${branchId}&current_mood=${currentMood}&desired_mood=${desiredMood}`,
      {
        method: "POST",
      }
    );
  },

  // ADMIN
  adminGetAll: () => apiRequest("/api/v1/admin/programs/"),

  adminGetById: (programId) =>
    apiRequest(`/api/v1/admin/programs/${programId}`),

  adminCreate: (data) =>
    apiRequest("/api/v1/admin/programs/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  adminUpdate: (programId, data) =>
    apiRequest(`/api/v1/admin/programs/${programId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  adminDelete: (programId) =>
    apiRequest(`/api/v1/admin/programs/${programId}`, {
      method: "DELETE",
    }),
};

// ============================================
// EVENT API
// ============================================
export const eventAPI = {
  // PUBLIC
  getAll: (branchId = null) => {
    const params = branchId ? `?branch_id=${branchId}` : "";
    return apiRequest(`/api/v1/events-calendar${params}`, {
      method: "GET",
    });
  },

  getById: (eventId) =>
    apiRequest(`/api/v1/events/${eventId}`, { method: "GET" }),

  getBachelorDescription: () =>
    apiRequest("/api/v1/events/bachelor/description", { method: "GET" }),

  getBachelorMedia: () =>
    apiRequest("/api/v1/events/bachelor/media", { method: "GET" }),

  getBachelorPricing: () =>
    apiRequest("/api/v1/events/bachelor/pricing", { method: "GET" }),

  getClubEvents: () => apiRequest("/api/v1/events/club", { method: "GET" }),

  getClubDescription: (clubId) =>
    apiRequest(`/api/v1/events/club/${clubId}/description`, { method: "GET" }),

  getClubMedia: (clubId) =>
    apiRequest(`/api/v1/events/club/${clubId}/media`, { method: "GET" }),

  // ADMIN
  create: (eventData) =>
    apiRequest("/api/v1/admin/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),

  update: (eventId, eventData) =>
    apiRequest(`/api/v1/admin/events/${eventId}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    }),

  delete: (eventId) =>
    apiRequest(`/api/v1/admin/events/${eventId}`, { method: "DELETE" }),

  uploadMedia: (eventId, formData) =>
    apiRequest(`/api/v1/admin/events/${eventId}/media/upload`, {
      method: "POST",
      body: formData,
    }),

  setUpcoming: (upcomingData) =>
    apiRequest("/api/v1/admin/events/set-upcoming", {
      method: "POST",
      body: JSON.stringify(upcomingData),
    }),
};

// ============================================
// MEDIA API
// ============================================
export const mediaAPI = {
  // ADMIN - Upload media
  upload: (formData) =>
    apiRequest("/api/v1/admin/media/upload", {
      method: "POST",
      body: formData,
    }),

  // ADMIN - List all media
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.section) queryParams.append("section", params.section);
    if (params.branch_id) queryParams.append("branch_id", params.branch_id);
    if (params.media_type) queryParams.append("media_type", params.media_type);
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/admin/media${queryString ? "?" + queryString : ""}`,
      { method: "GET" }
    );
  },

  // PUBLIC - Get media by section
  getBySection: (section, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.branch_id) queryParams.append("branch_id", params.branch_id);
    if (params.media_type) queryParams.append("media_type", params.media_type);
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/media/${section}${queryString ? "?" + queryString : ""}`,
      { method: "GET" }
    );
  },

  // ADMIN - Create media record
  create: (mediaData) =>
    apiRequest("/api/v1/admin/media", {
      method: "POST",
      body: JSON.stringify(mediaData),
    }),

  // ADMIN - Update media
  update: (mediaId, mediaData) =>
    apiRequest(`/api/v1/admin/media/${mediaId}`, {
      method: "PUT",
      body: JSON.stringify(mediaData),
    }),

  // ADMIN - Delete media
  delete: (mediaId) =>
    apiRequest(`/api/v1/admin/media/${mediaId}`, {
      method: "DELETE",
    }),

  // ADMIN - Reorder media in section
  reorder: (section, mediaIds) =>
    apiRequest(`/api/v1/admin/media/section/${section}/reorder`, {
      method: "POST",
      body: JSON.stringify({ media_ids: mediaIds }),
    }),

  // PUBLIC - Get media download URL
  getDownloadUrl: (mediaId) =>
    `${import.meta.env.VITE_API_URL}/api/v1/media/download/${mediaId}`,

  // ADMIN - Get media download URL
  getAdminDownloadUrl: (mediaId) =>
    `${import.meta.env.VITE_API_URL}/api/v1/admin/media/download/${mediaId}`,
};

// ============================================
// BOOKING API
// ============================================
export const bookingAPI = {
  // PUBLIC
  create: (bookingData) =>
    apiRequest("/api/v1/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  getStats: (userId = null) => {
    let url = "/api/v1/bookings/stats";
    if (userId) {
      url += `?user_id=${userId}`;
    }
    return apiRequest(url, { method: "GET" });
  },

  getById: (bookingId) =>
    apiRequest(`/api/v1/bookings/${bookingId}`, { method: "GET" }),

  getMyBookings: () =>
    apiRequest("/api/v1/users/me/bookings", { method: "GET" }),

  // ✅ ИСПРАВЛЕНО - добавлен userId как параметр
  getMy: (userId) =>
    apiRequest(`/api/v1/bookings/my?user_id=${userId}`, { method: "GET" }),

  // ADMIN
  getAll: () => apiRequest("/api/v1/admin/bookings", { method: "GET" }),

  filter: (filterParams) => {
    const params = new URLSearchParams(filterParams);
    return apiRequest(`/api/v1/admin/bookings/filter?${params}`, {
      method: "GET",
    });
  },

  update: (bookingId, bookingData) =>
    apiRequest(`/api/v1/admin/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(bookingData),
    }),

  updateStatus: (bookingId, status) =>
    apiRequest(
      `/api/v1/admin/bookings/${bookingId}/status?new_status=${status}`,
      {
        method: "PATCH",
      }
    ),

  cancel: (bookingId) =>
    apiRequest(`/api/v1/admin/bookings/${bookingId}`, {
      method: "DELETE",
    }),

  exportExcel: () =>
    apiRequest("/api/v1/admin/bookings/export-excel", { method: "POST" }),
};

// ============================================
// CERTIFICATE API
// ============================================
export const certificateAPI = {
  // PUBLIC
  getDescription: () => apiRequest("/api/v1/certificates", { method: "GET" }),

  getTypes: () => apiRequest("/api/v1/certificates/types", { method: "GET" }),

  purchase: (purchaseData) =>
    apiRequest("/api/v1/certificates/purchase", {
      method: "POST",
      body: JSON.stringify(purchaseData),
    }),

  getMyCertificates: () =>
    apiRequest("/api/v1/certificates/my-certificates", { method: "GET" }),

  // ADMIN
  updateDescription: (descriptionData) =>
    apiRequest("/api/v1/admin/certificates", {
      method: "PUT",
      body: JSON.stringify(descriptionData),
    }),

  adminGetAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append("skip", params.skip);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/admin/certificates${queryString ? "?" + queryString : ""}`
    );
  },

  adminFilter: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.certificate_type)
      queryParams.append("certificate_type", params.certificate_type);
    if (params.program_id) queryParams.append("program_id", params.program_id);
    if (params.username) queryParams.append("username", params.username);
    if (params.skip !== undefined) queryParams.append("skip", params.skip);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/admin/certificates/filter${queryString ? "?" + queryString : ""}`
    );
  },

  adminGetById: (certificateId) =>
    apiRequest(`/api/v1/admin/certificates/${certificateId}`),

  adminUpdate: (certificateId, data) =>
    apiRequest(`/api/v1/admin/certificates/${certificateId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ============================================
// PROMO CODE API
// ============================================
export const promoAPI = {
  // PUBLIC
  getAll: () => apiRequest("/api/v1/loyalty/promos", { method: "GET" }),

  applyPromo: (bookingId, promoCode) =>
    apiRequest(`/api/v1/loyalty/apply-promo/${bookingId}`, {
      method: "POST",
      body: JSON.stringify({ promo_code: promoCode }),
    }),

  // ADMIN
  create: (promoData) =>
    apiRequest("/api/v1/admin/loyalty/promos", {
      method: "POST",
      body: JSON.stringify(promoData),
    }),

  update: (promoId, promoData) =>
    apiRequest(`/api/v1/admin/loyalty/promos/${promoId}`, {
      method: "PUT",
      body: JSON.stringify(promoData),
    }),

  delete: (promoId) =>
    apiRequest(`/api/v1/admin/loyalty/promos/${promoId}`, {
      method: "DELETE",
    }),
};

// ============================================
// LOYALTY API
// ============================================
export const loyaltyAPI = {
  // PUBLIC
  getInfo: () => apiRequest("/api/v1/loyalty", { method: "GET" }),

  getPromos: () => apiRequest("/api/v1/loyalty/promos", { method: "GET" }),

  applyPromo: (bookingId, promoCode) =>
    apiRequest(`/api/v1/loyalty/apply-promo/${bookingId}`, {
      method: "POST",
      body: JSON.stringify({ promo_code: promoCode }),
    }),

  // ADMIN
  updateInfo: (loyaltyData) =>
    apiRequest("/api/v1/admin/loyalty", {
      method: "PUT",
      body: JSON.stringify(loyaltyData),
    }),
};

// ============================================
// FIRST TIME API
// ============================================
export const firstTimeAPI = {
  // PUBLIC
  getInfo: () => apiRequest("/api/v1/first-time", { method: "GET" }),

  requestUTP: () =>
    apiRequest("/api/v1/first-time/request-utp", { method: "POST" }),

  requestConsultation: (consultationData) =>
    apiRequest("/api/v1/first-time/request-consultation", {
      method: "POST",
      body: JSON.stringify(consultationData),
    }),

  // ADMIN
  updateUTP: (utpData) =>
    apiRequest("/api/v1/admin/first-time", {
      method: "PUT",
      body: JSON.stringify(utpData),
    }),
};

// ============================================
// CORPORATE API
// ============================================
export const corporateAPI = {
  // PUBLIC
  getInfo: () => apiRequest("/api/v1/corporate", { method: "GET" }),

  requestTerms: (requestData) =>
    apiRequest("/api/v1/corporate/request-terms", {
      method: "POST",
      body: JSON.stringify(requestData),
    }),

  // ADMIN
  update: (corporateData) =>
    apiRequest("/api/v1/admin/corporate", {
      method: "PUT",
      body: JSON.stringify(corporateData),
    }),
};

// ============================================
// CONTENT API
// ============================================
export const contentAPI = {
  // PUBLIC
  getByPage: (page, params = {}) => {
    const queryParams = new URLSearchParams(params);
    return apiRequest(`/api/v1/content/${page}?${queryParams}`, {
      method: "GET",
    });
  },

  // Для обратной совместимости
  getAll: () => apiRequest("/api/v1/content", { method: "GET" }),

  // ADMIN
  // ADMIN
  getAllAdmin: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.include_inactive !== undefined) {
      queryParams.append("include_inactive", params.include_inactive);
    }
    if (params.skip !== undefined) queryParams.append("skip", params.skip);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    return apiRequest(`/api/v1/admin/content?${queryString}`, {
      method: "GET",
    });
  },

  create: (contentData) =>
    apiRequest("/api/v1/admin/content", {
      method: "POST",
      body: JSON.stringify(contentData),
    }),

  update: (contentId, contentData) =>
    apiRequest(`/api/v1/admin/content/${contentId}`, {
      method: "PUT",
      body: JSON.stringify(contentData),
    }),

  delete: (contentId) =>
    apiRequest(`/api/v1/admin/content/${contentId}`, {
      method: "DELETE",
    }),
};

// ============================================
// LOTTERY API
// ============================================
export const lotteryAPI = {
  // ========== PUBLIC ==========
  getStatus: () => apiRequest("/api/v1/lottery/status"),

  getHistory: () => apiRequest("/api/v1/lottery/history", { method: "GET" }),

  redeemTicket: (code) =>
    apiRequest(`/api/v1/lottery/tickets/redeem?code=${code}`, {
      method: "POST",
    }),

  getSettings: () =>
    apiRequest("/api/v1/admin/lottery/settings", { method: "GET" }),

  requestCode: () =>
    apiRequest("/api/v1/lottery/tickets/request-code", { method: "POST" }),

  getMyTicket: () => apiRequest("/api/v1/lottery/my-ticket", { method: "GET" }),

  // ========== ADMIN - Настройки ==========
  getAdminSettings: () =>
    apiRequest("/api/v1/admin/lottery/settings", { method: "GET" }),

  updateSettings: (settingsData) =>
    apiRequest("/api/v1/admin/lottery/settings", {
      method: "PUT",
      body: JSON.stringify(settingsData),
    }),

  // ========== ADMIN - Статистика ==========
  getStats: () => apiRequest("/api/v1/admin/lottery/stats", { method: "GET" }),

  // ========== ADMIN - Билеты ==========
  getAllTickets: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append("skip", params.skip);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/admin/lottery/tickets${queryString ? "?" + queryString : ""}`,
      { method: "GET" }
    );
  },

  addUserWithTicket: (userId, ticketNumber) =>
    apiRequest(
      `/api/v1/admin/lottery/tickets/add-user?user_id=${userId}&ticket_number=${ticketNumber}`,
      {
        method: "POST",
      }
    ),

  importTicketsExcel: (formData) =>
    apiRequest("/api/v1/admin/lottery/tickets/import-excel", {
      method: "POST",
      body: formData,
    }),

  exportTicketsExcel: () =>
    apiRequest("/api/v1/admin/lottery/tickets/export-excel", {
      method: "GET",
    }),

  exportTicketsTelegram: (telegramId) =>
    apiRequest(
      `/api/v1/admin/lottery/tickets/export-telegram?admin_telegram_id=${telegramId}`,
      {
        method: "POST",
      }
    ),

  // ========== ADMIN - Призы ==========
  getAllPrizes: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append("skip", params.skip);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/admin/lottery/prizes${queryString ? "?" + queryString : ""}`,
      { method: "GET" }
    );
  },

  importPrizesExcel: (formData) =>
    apiRequest("/api/v1/admin/lottery/prizes/import-excel", {
      method: "POST",
      body: formData,
    }),

  exportPrizesExcel: () =>
    apiRequest("/api/v1/admin/lottery/prizes/export-excel", {
      method: "GET",
    }),

  exportPrizesTelegram: (telegramId) =>
    apiRequest(
      `/api/v1/admin/lottery/prizes/export-telegram?admin_telegram_id=${telegramId}`,
      {
        method: "POST",
      }
    ),

  // ========== ADMIN - Коды ==========
  generateCodes: (count) =>
    apiRequest("/api/v1/admin/lottery/codes/generate", {
      method: "POST",
      body: JSON.stringify({ count }),
    }),

  getUnusedCodes: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append("skip", params.skip);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/admin/lottery/codes${queryString ? "?" + queryString : ""}`,
      { method: "GET" }
    );
  },

  // ========== ADMIN - Проведение розыгрыша ==========
  conductDraw: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.admin_user_id)
      queryParams.append("admin_user_id", params.admin_user_id);
    if (params.cleanup_after_draw !== undefined) {
      queryParams.append("cleanup_after_draw", params.cleanup_after_draw);
    }
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/admin/lottery/draw${queryString ? "?" + queryString : ""}`,
      { method: "POST" }
    );
  },
};

// ============================================
// EVENT CALENDAR API
// ============================================
export const eventCalendarAPI = {
  // Admin endpoints
  adminGetAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append("skip", params.skip);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/api/v1/admin/events-calendar/${queryString ? `?${queryString}` : ""}`;

    return apiRequest(url);
  },

  adminCreate: (data) => {
    return apiRequest("/api/v1/admin/events-calendar/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  adminGet: (id) => {
    return apiRequest(`/api/v1/admin/events-calendar/${id}`);
  },

  adminUpdate: (id, data) => {
    return apiRequest(`/api/v1/admin/events-calendar/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  adminDelete: (id) => {
    return apiRequest(`/api/v1/admin/events-calendar/${id}`, {
      method: "DELETE",
    });
  },

  adminSetUpcoming: (data) => {
    return apiRequest("/api/v1/admin/events-calendar/set-upcoming", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// BROADCAST API (Рассылки)
// ============================================
export const broadcastAPI = {
  // Создать рассылку
  create: (data) => {
    return apiRequest("/api/v1/admin/broadcasts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Получить список рассылок
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append("skip", params.skip);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/admin/broadcasts${queryString ? "?" + queryString : ""}`,
      { method: "GET" }
    );
  },

  // Получить детали рассылки
  getById: (broadcastId) => {
    return apiRequest(`/api/v1/admin/broadcasts/${broadcastId}`, {
      method: "GET",
    });
  },

  // Обновить рассылку
  update: (broadcastId, data) => {
    return apiRequest(`/api/v1/admin/broadcasts/${broadcastId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Отправить рассылку вручную
  sendNow: (broadcastId) => {
    return apiRequest(`/api/v1/admin/broadcasts/${broadcastId}/send`, {
      method: "POST",
    });
  },

  // Получить историю доставки
  getHistory: (broadcastId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append("skip", params.skip);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);
    const queryString = queryParams.toString();
    return apiRequest(
      `/api/v1/admin/broadcasts/${broadcastId}/history${queryString ? "?" + queryString : ""}`,
      { method: "GET" }
    );
  },

  // Получить статистику рассылки
  getStats: (broadcastId) => {
    return apiRequest(`/api/v1/admin/broadcasts/${broadcastId}/stats`, {
      method: "GET",
    });
  },

  // Удалить рассылку
  delete: (broadcastId) => {
    return apiRequest(`/api/v1/admin/broadcasts/${broadcastId}`, {
      method: "DELETE",
    });
  },
};

// ============================================
// HEALTH CHECK
// ============================================
export const healthAPI = {
  check: () => apiRequest("/health", { method: "GET" }),
};
