<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
    <!-- Шапка -->
    <div
      class="bg-gradient-to-br from-[#4e5d51] via-[#5a6d5e] to-[#4e5d51] text-white px-5 py-6"
    >
      <div class="flex items-center mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white hover:text-gray-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">Назад</span>
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white border-opacity-30"
          >
            🎁
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление сертификатами</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ totalCertificates }}
            </p>
          </div>
        </div>

        <!-- Кнопка обновления -->
        <button
          @click="loadCertificates"
          :disabled="isLoading"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-lg transition-all active:scale-98 disabled:opacity-50"
          title="Обновить список"
        >
          <svg
            :class="{ 'animate-spin': isLoading }"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="px-4 py-4 space-y-3">
      <!-- Поиск по имени -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Поиск по имени получателя или телефону
        </h3>
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Введите имя или телефон получателя..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4e5d51] focus:border-transparent outline-none"
          />
          <svg
            class="absolute left-3 top-3 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button
            v-if="searchQuery"
            @click="
              searchQuery = '';
              onSearchInput();
            "
            class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Тип сертификата -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Тип сертификата
        </h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.certificate_type = null;
              applyFilters();
            "
            :class="
              filters.certificate_type === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все
          </button>
          <button
            @click="
              filters.certificate_type = 'program';
              applyFilters();
            "
            :class="
              filters.certificate_type === 'program'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            На программу
          </button>
          <button
            @click="
              filters.certificate_type = 'deposit';
              applyFilters();
            "
            :class="
              filters.certificate_type === 'deposit'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Депозитный
          </button>
        </div>
      </div>

      <!-- Формат -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Формат</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              localFormatFilter = null;
              applyLocalFilters();
            "
            :class="
              localFormatFilter === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все
          </button>
          <button
            @click="
              localFormatFilter = 'physical';
              applyLocalFilters();
            "
            :class="
              localFormatFilter === 'physical'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Физический
          </button>
          <button
            @click="
              localFormatFilter = 'electronic';
              applyLocalFilters();
            "
            :class="
              localFormatFilter === 'electronic'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Электронный
          </button>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="relative">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
        ></div>
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-[#4e5d51] border-t-transparent absolute top-0 left-0"
        ></div>
      </div>
    </div>

    <!-- Ошибка -->
    <div
      v-else-if="error"
      class="mx-4 mt-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm"
    >
      <div class="flex items-start">
        <svg
          class="h-5 w-5 text-red-500 mt-0.5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Список сертификатов -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик -->
      <div class="text-sm text-gray-600 mb-3">
        Найдено: <span class="font-semibold">{{ certificates.length }}</span>
      </div>

      <!-- Сертификаты -->
      <div v-if="certificates.length > 0" class="space-y-3">
        <div
          v-for="certificate in certificates"
          :key="certificate.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска -->
          <div
            :class="getTypeColorClass(certificate.certificate_type)"
            class="h-1"
          ></div>

          <div class="p-4">
            <!-- Заголовок и тип -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 class="font-bold text-gray-900 text-base">
                    ID: {{ certificate.id }}
                  </h3>
                  <span
                    v-if="
                      certificate.username && certificate.username !== 'unknown'
                    "
                    class="text-sm text-gray-500"
                  >
                    @{{ certificate.username }}
                  </span>
                </div>
                <div class="flex items-center gap-2 flex-wrap mt-1">
                  <div
                    :class="getTypeBadgeClass(certificate.certificate_type)"
                    class="px-2 py-1 rounded text-xs font-semibold"
                  >
                    {{ getTypeLabel(certificate.certificate_type) }}
                  </div>
                  <div
                    :class="getFormatBadgeClass(certificate.format)"
                    class="px-2 py-1 rounded text-xs font-semibold"
                  >
                    {{ getFormatLabel(certificate.format) }}
                  </div>
                </div>
              </div>

              <!-- Сумма -->
              <div class="text-right ml-2">
                <div class="text-lg font-bold text-[#4e5d51]">
                  {{ certificate.amount }} ₽
                </div>
              </div>
            </div>

            <!-- Информация -->
            <div class="space-y-2">
              <!-- Программа -->
              <div
                v-if="certificate.program_name"
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                  />
                </svg>
                {{ certificate.program_name }}
              </div>

              <!-- Получатель -->
              <div
                v-if="certificate.recipient_name"
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                Получатель: {{ certificate.recipient_name }}
                <span
                  v-if="certificate.recipient_phone"
                  class="ml-1 text-gray-500"
                >
                  ({{ certificate.recipient_phone }})
                </span>
              </div>

              <!-- Покупатель -->
              <div
                v-if="certificate.buyer_name"
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                  <path
                    d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"
                  />
                </svg>
                Покупатель: {{ certificate.buyer_name }}
                <span v-if="certificate.buyer_phone" class="ml-1 text-gray-500">
                  ({{ certificate.buyer_phone }})
                </span>
              </div>

              <!-- Дата создания -->
              <div
                class="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100"
              >
                <svg
                  class="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ formatDateTime(certificate.created_at) }}
              </div>
            </div>

            <!-- Кнопка редактирования -->
            <div class="mt-3 pt-3 border-t border-gray-100">
              <button
                @click="openEditModal(certificate)"
                class="w-full bg-[#4e5d51] hover:bg-[#3d4a40] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ✏️ Редактировать
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет сертификатов -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">🎁</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Нет сертификатов
        </h3>
        <p class="text-sm text-gray-600">
          {{
            filters.certificate_type
              ? "По выбранному фильтру сертификатов не найдено"
              : "Сертификаты ещё не созданы"
          }}
        </p>
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <EditCertificateModal
      v-if="editingCertificate"
      :certificate="editingCertificate"
      @close="editingCertificate = null"
      @saved="onCertificateSaved"
    />
  </div>
</template>

<script>
import { certificateAPI } from "@/utils/api";
import { useAppStore } from "@/stores/appStore";
import EditCertificateModal from "@/components/EditCertificateModal.vue";

export default {
  name: "AdminCertificatesPage",
  components: {
    EditCertificateModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      certificates: [],
      allCertificates: [],
      totalCertificates: 0,
      searchQuery: "",
      filters: {
        certificate_type: null,
        program_id: null,
        username: null,
      },
      localFormatFilter: null,
      editingCertificate: null,
    };
  },
  methods: {
    async loadCertificates() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка сертификатов с фильтрами:", this.filters);

        let data;

        // Если есть фильтры - используем filter endpoint
        if (
          this.filters.certificate_type ||
          this.filters.program_id ||
          this.filters.username
        ) {
          const params = {};
          if (this.filters.certificate_type)
            params.certificate_type = this.filters.certificate_type;
          if (this.filters.program_id)
            params.program_id = this.filters.program_id;
          if (this.filters.username) params.username = this.filters.username;

          data = await certificateAPI.adminFilter(params);
        } else {
          // Иначе загружаем все
          data = await certificateAPI.adminGetAll();
        }

        if (Array.isArray(data)) {
          this.allCertificates = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // Применяем локальные фильтры
          this.applyLocalFilters();

          this.totalCertificates = this.allCertificates.length;
          console.log("Загружено сертификатов:", this.allCertificates.length);
        } else {
          this.allCertificates = [];
          this.certificates = [];
          this.totalCertificates = 0;
        }
      } catch (error) {
        console.error("Ошибка при загрузке сертификатов:", error);
        this.error = error.message || "Не удалось загрузить сертификаты";
        this.allCertificates = [];
        this.certificates = [];
      } finally {
        this.isLoading = false;
      }
    },

    applyLocalFilters() {
      let filtered = this.allCertificates;

      // Применяем фильтр по формату
      if (this.localFormatFilter) {
        filtered = filtered.filter(
          (cert) => cert.format === this.localFormatFilter
        );
      }

      // Применяем поиск по имени или телефону получателя
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter((cert) => {
          const recipientName = (cert.recipient_name || "").toLowerCase();
          const recipientPhone = (cert.recipient_phone || "").toLowerCase();
          return (
            recipientName.includes(query) || recipientPhone.includes(query)
          );
        });
      }

      this.certificates = filtered;
    },

    onSearchInput() {
      this.applyLocalFilters();
    },

    applyFilters() {
      this.loadCertificates();
    },

    openEditModal(certificate) {
      this.editingCertificate = { ...certificate };
    },

    async onCertificateSaved(updatedCertificate) {
      // Обновляем сертификат в списке
      const index = this.allCertificates.findIndex(
        (c) => c.id === updatedCertificate.id
      );
      if (index !== -1) {
        this.allCertificates[index] = updatedCertificate;
        this.applyLocalFilters();
      }
      this.editingCertificate = null;
    },

    formatDateTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    getTypeLabel(type) {
      const labels = {
        program: "На программу",
        deposit: "Депозитный",
      };
      return labels[type] || type;
    },

    getFormatLabel(format) {
      const labels = {
        physical: "Физический",
        electronic: "Электронный",
      };
      return labels[format] || format;
    },

    getTypeColorClass(type) {
      const colors = {
        program: "bg-blue-500",
        deposit: "bg-green-500",
      };
      return colors[type] || "bg-gray-500";
    },

    getTypeBadgeClass(type) {
      const classes = {
        program: "bg-blue-50 text-blue-700 border border-blue-200",
        deposit: "bg-green-50 text-green-700 border border-green-200",
      };
      return classes[type] || "bg-gray-50 text-gray-700 border border-gray-200";
    },

    getFormatBadgeClass(format) {
      const classes = {
        physical: "bg-purple-50 text-purple-700 border border-purple-200",
        electronic: "bg-orange-50 text-orange-700 border border-orange-200",
      };
      return (
        classes[format] || "bg-gray-50 text-gray-700 border border-gray-200"
      );
    },
  },

  async created() {
    console.log("AdminCertificatesPage created");
    await this.loadCertificates();
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
