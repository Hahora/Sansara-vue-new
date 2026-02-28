<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Шапка - статичная -->
    <div class="bg-[#202c27] text-white px-5 py-6">
      <div class="flex items-center mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft class="h-6 w-6 mr-1" />
          <span class="font-light">Назад</span>
        </button>
      </div>

      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center border-2 border-white/10 backdrop-blur-sm"
        >
          <Gift class="h-8 w-8 text-white" />
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-light tracking-wide">
            Подарочные сертификаты
          </h1>
          <p class="text-white/70 text-sm mt-1 font-light">
            Подарите заботу, счастье и ресурсное состояние
          </p>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center py-16 px-5"
    >
      <Loader2 class="h-12 w-12 text-[#c2a886] animate-spin mb-4" />
      <p class="text-sm text-gray-600 font-light">Загружаем сертификаты...</p>
    </div>

    <!-- Ошибка -->
    <div
      v-else-if="error"
      class="mx-5 mt-5 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-sm"
    >
      <div class="flex items-start gap-3">
        <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Контент страницы -->
    <div v-else class="px-5 py-5 space-y-4">

      <!-- Список сертификатов -->
      <div v-if="certificates && certificates.length > 0">
        <div class="space-y-4">
          <!-- Карточка сертификата -->
          <div
            v-for="certificate in certificates"
            :key="certificate.id"
            class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden hover:shadow-md transition-all duration-300"
          >
            <!-- Медиа слева + инфо справа -->
            <div class="flex bg-[#d9cebc] border-b border-[#c2a886]/30">
              <!-- Медиа-слайдер -->
              <div
                v-if="media.length > 0"
                class="w-[42%] flex-shrink-0 relative bg-[#202c27] overflow-hidden self-start"
                style="height: 160px"
              >
                <video
                  v-if="media[mediaIdx].media_type === 'VIDEO'"
                  :key="media[mediaIdx].id + '_cert'"
                  :src="getMediaUrl(media[mediaIdx].id)"
                  v-autoplay autoplay loop playsinline
                  class="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  @click="lightboxUrl = getMediaUrl(media[mediaIdx].id); lightboxType = 'VIDEO'"
                />
                <img
                  v-else
                  :src="getMediaUrl(media[mediaIdx].id)"
                  class="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  @click="lightboxUrl = getMediaUrl(media[mediaIdx].id); lightboxType = 'PHOTO'"
                  @error="(e) => e.target.style.display = 'none'"
                />
                <div v-if="media.length > 1" class="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                  <div
                    v-for="(_, i) in media" :key="i"
                    @click="mediaIdx = i"
                    :class="['h-1.5 rounded-full cursor-pointer transition-all duration-200', i === mediaIdx ? 'bg-[#c2a886] w-4' : 'bg-white/60 w-1.5']"
                  />
                </div>
              </div>

              <!-- Инфо: название + описание + цена -->
              <div class="flex-1 p-3 flex flex-col border-l border-[#c2a886]/15 min-h-[160px] overflow-hidden">
                <div class="flex items-center gap-2 mb-1.5">
                  <div class="h-7 w-7 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gift class="h-3.5 w-3.5 text-white" />
                  </div>
                  <h4 class="font-semibold text-gray-900 text-[13px] leading-tight">
                    {{ certificate.title }}
                  </h4>
                </div>
                <p v-if="certificate.subtitle" class="text-[11px] text-gray-500 mb-1 leading-snug">
                  {{ certificate.subtitle }}
                </p>
                <div
                  v-if="certificate.content || certificate.description"
                  class="text-[11px] text-gray-600 leading-snug line-clamp-4 flex-1 prose-content"
                  v-html="formatContent(certificate.content || certificate.description)"
                />
                <div class="mt-auto pt-1.5">
                  <div v-if="certificate.price">
                    <span class="text-[#c2a886] font-bold text-base">{{ formatPrice(certificate.price) }}</span>
                    <span class="text-gray-500 text-[11px] ml-1">руб.</span>
                  </div>
                  <div v-if="certificate.validity" class="flex items-center gap-1 mt-0.5">
                    <Calendar class="h-3 w-3 text-[#c2a886] flex-shrink-0" />
                    <span class="text-[11px] text-gray-600">{{ certificate.validity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 space-y-4">
              <!-- Номинал (если отличается от цены) -->
              <div
                v-if="certificate.nominal && certificate.nominal !== certificate.price"
                class="text-center bg-[#d9cebc]/40 rounded-xl p-3"
              >
                <span class="text-xs text-gray-600">Номинальная стоимость:</span>
                <div class="text-base font-semibold text-gray-900 mt-1">
                  {{ formatPrice(certificate.nominal) }} руб.
                </div>
              </div>

              <!-- Преимущества -->
              <div
                v-if="
                  certificate.features &&
                  Array.isArray(certificate.features) &&
                  certificate.features.length > 0
                "
                class="space-y-2"
              >
                <div class="text-sm font-medium text-gray-900">
                  Преимущества:
                </div>
                <ul class="space-y-2">
                  <li
                    v-for="(feature, index) in certificate.features"
                    :key="index"
                    class="flex items-start gap-2"
                  >
                    <CheckCircle
                      class="h-4 w-4 text-[#c2a886] mt-0.5 flex-shrink-0"
                    />
                    <span class="text-sm text-gray-700">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Кнопки действий -->
              <div class="space-y-2.5 pt-2">
                <!-- Кнопка покупки -->
                <button
                  @click="openCertificateModal(certificate)"
                  class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
                >
                  <Gift class="h-5 w-5 mr-2" />
                  <span class="text-[15px]">Приобрести сертификат</span>
                </button>

                <!-- Кнопка консультации -->
                <button
                  @click="callConsultation"
                  class="w-full bg-[#d9cebc] hover:bg-[#c2a886]/30 text-gray-800 font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center active:scale-[0.98]"
                >
                  <Phone class="h-4 w-4 mr-2" />
                  <span class="text-[15px]">Консультация</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Если сертификатов нет -->
      <div
        v-else
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-8 text-center"
      >
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Gift class="h-8 w-8 text-[#c2a886]" />
        </div>
        <h3 class="text-base font-semibold text-gray-900 mb-2">
          Подарочные сертификаты
        </h3>
        <p class="text-sm text-gray-600 leading-relaxed mb-4">
          Скоро здесь появится информация о подарочных сертификатах
        </p>
        <div class="inline-flex items-center text-[#c2a886]">
          <Phone class="h-4 w-4 mr-1.5" />
          <span class="text-sm"
            >Позвоните, чтобы узнать о доступных сертификатах</span
          >
        </div>
      </div>
    </div>

    <!-- Лайтбокс -->
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="lightboxUrl"
        class="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
        @click="lightboxUrl = null"
      >
        <video
          v-if="lightboxType === 'VIDEO'"
          :key="lightboxUrl"
          :src="lightboxUrl"
          controls autoplay playsinline
          class="max-w-full max-h-full"
          @click.stop
        />
        <img
          v-else
          :src="lightboxUrl"
          class="max-w-[100vw] max-h-[100vh] w-auto h-auto object-contain"
          @click.stop
        />
        <button
          @click="lightboxUrl = null"
          class="absolute top-5 right-5 text-white/70 hover:text-white bg-black/40 rounded-full p-1.5"
        >
          <X class="h-6 w-6" />
        </button>
      </div>
    </transition>

    <!-- Модальное окно покупки сертификата -->
    <CertificatePurchaseModal
      v-model:visible="showCertificateModal"
      :certificate="selectedCertificate"
      :branch-id="currentBranch?.id"
      :author-programs="authorPrograms"
      @close="closeCertificateModal"
      @purchase-complete="handlePurchaseComplete"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { programAPI, branchAPI, mediaAPI } from "@/utils/api";
import CertificatePurchaseModal from "@/components/CertificatePurchaseModal.vue";
import icons from "@/utils/icons";

export default {
  name: "CertificatePage",
  components: {
    CertificatePurchaseModal,
    ...icons,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      certificates: [],
      allBranches: [],
      showCertificateModal: false,
      selectedCertificate: null,
      isCalling: false,
      authorPrograms: [],
      media: [],
      mediaIdx: 0,
      mediaInterval: null,
      lightboxUrl: null,
      lightboxType: 'PHOTO',
      certPageContent: null,
      certExpanded: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData", "user"]),

    currentBranch() {
      if (!this.selectedBranch || !this.selectedBranch.id) {
        return null;
      }

      const actualBranch = this.allBranches.find(
        (branch) => branch.id === this.selectedBranch.id
      );

      return actualBranch || this.selectedBranch;
    },

    branchPhoneNumber() {
      return this.currentBranch?.phone || null;
    },
  },
  methods: {
    ...mapActions(useAppStore, ["loadSiteContent"]),

    async loadAllBranches() {
      try {
        const branches = await branchAPI.getAll();
        this.allBranches = branches.filter(
          (branch) => branch.is_active === true
        );
      } catch (error) {
        console.error("Ошибка при загрузке филиалов:", error);
      }
    },

    formatContent(content) {
      if (!content) return "";
      return content
        .replace(/\n/g, "<br>")
        .replace(/\\n/g, "<br>")
        .replace(/\r\n/g, "<br>");
    },

    formatPrice(price) {
      if (!price && price !== 0) return "0";

      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;

      return priceNumber.toLocaleString("ru-RU");
    },

    async loadCertificates() {
      try {
        await this.loadSiteContent("CERTIFICATE", true);
        const content = this.contentData?.["CERTIFICATE"];

        if (Array.isArray(content)) {
          this.certificates = content.filter(
            (cert) => cert.is_active !== false
          );
        } else if (content && typeof content === "object") {
          this.certificates = content.is_active !== false ? [content] : [];
        } else {
          this.certificates = [];
        }

        console.log("Загружено сертификатов:", this.certificates.length);
      } catch (error) {
        console.error("Ошибка при загрузке сертификатов:", error);
        this.error = "Не удалось загрузить информацию о сертификатах";
        this.certificates = [];
      }
    },

    async loadAuthorPrograms() {
      try {
        const branchId = this.currentBranch?.id || this.selectedBranch?.id;
        if (!branchId) {
          return;
        }

        const data = await programAPI.getAuthor(branchId);

        if (data && Array.isArray(data.programs)) {
          this.authorPrograms = data.programs
            .filter((program) => program.is_active !== false)
            .map((program) => ({
              ...program,
              price: this.getProgramPrice(program),
            }));
        } else {
          this.authorPrograms = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке авторских программ:", error);
        this.authorPrograms = [];
      }
    },

    getProgramPrice(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        return 0;
      }
      const activeTiers = program.pricing_tiers.filter(
        (tier) => tier.is_active !== false
      );
      if (activeTiers.length === 0) return 0;

      const minPrice = Math.min(...activeTiers.map((tier) => tier.price));
      return minPrice;
    },

    async callConsultation() {
      if (this.isCalling) return;

      this.isCalling = true;

      try {
        const phoneNumber = this.branchPhoneNumber;

        if (!phoneNumber) {
          const branchesWithPhone = this.allBranches.filter((b) => b.phone);
          if (branchesWithPhone.length > 0) {
            const branchList = branchesWithPhone
              .map((b) => `${b.name}: ${b.phone}`)
              .join("\n");

            this.showErrorPopup(
              `У текущего филиала нет телефона.\n\nДругие филиалы с телефонами:\n${branchList}`
            );
          } else {
            this.showErrorPopup(
              "У этого филиала нет указанного телефона для консультации"
            );
          }
          this.isCalling = false;
          return;
        }

        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.showPopup(
            {
              title: `Консультация (${this.currentBranch?.name || "филиал"})`,
              message: `Позвоните нам для консультации:\n${phoneNumber}`,
              buttons: [
                {
                  id: "copy",
                  type: "default",
                  text: "📋 Скопировать номер",
                },
                {
                  id: "close",
                  type: "cancel",
                  text: "Закрыть",
                },
              ],
            },
            (buttonId) => {
              if (buttonId === "copy") {
                navigator.clipboard.writeText(phoneNumber);
                window.Telegram.WebApp.showAlert("Номер скопирован!");
              }
              this.isCalling = false;
            }
          );
        } else {
          window.location.href = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;
          setTimeout(() => {
            this.isCalling = false;
          }, 1000);
        }
      } catch (error) {
        console.error("Ошибка при звонке для консультации:", error);
        alert(
          `Для консультации позвоните: ${this.branchPhoneNumber || "телефон не указан"}`
        );
        this.isCalling = false;
      }
    },

    showErrorPopup(message) {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(message);
      } else {
        alert(message);
      }
    },

    async openCertificateModal(certificate) {
      this.selectedCertificate = certificate;
      this.showCertificateModal = true;
      await this.loadAuthorPrograms();
    },

    closeCertificateModal() {
      this.showCertificateModal = false;
      this.selectedCertificate = null;
    },

    handlePurchaseComplete() {
      console.log("Покупка сертификата завершена");
    },

    isContentLong(content) {
      if (!content) return false;
      const textLength = content.replace(/<[^>]*>/g, "").length;
      const lineBreaks = (content.match(/\n|<br>/gi) || []).length;
      return textLength > 200 || lineBreaks > 3;
    },

    getMediaUrl(mediaId) {
      return mediaAPI.getDownloadUrl(mediaId);
    },

    async loadMedia() {
      const params = this.selectedBranch?.id ? { branch_id: this.selectedBranch.id } : {};
      try {
        const res = await mediaAPI.getBySection("CERTIFICATE", params);
        this.media = (res.items || []).filter(i => i.is_active);
        if (this.media.length > 1) {
          this.mediaInterval = setInterval(() => {
            this.mediaIdx = (this.mediaIdx + 1) % this.media.length;
          }, 4000);
        }
      } catch {
        // медиа не критично
      }
    },
  },
  async created() {
    console.log("CertificatePage created");

    try {
      await this.loadAllBranches();
      await Promise.all([this.loadCertificates(), this.loadMedia()]);

      console.log("Страница подарочных сертификатов загружена успешно");
    } catch (error) {
      console.error("Ошибка при загрузке страницы сертификатов:", error);
      this.error = "Ошибка при загрузке страницы";
    } finally {
      this.isLoading = false;
    }
  },

  beforeUnmount() {
    clearInterval(this.mediaInterval);
  },

  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log("Перезагружаем сертификаты для филиала:", newBranchId);
        this.loadCertificates();
      },
    },
  },
};
</script>

<style scoped>
.prose-content :deep(p) {
  margin-bottom: 0.75em;
}

.prose-content :deep(ul) {
  margin-bottom: 0.75em;
  padding-left: 1.5em;
  list-style-type: disc;
}

.prose-content :deep(li) {
  margin-bottom: 0.25em;
}

.prose-content :deep(strong) {
  font-weight: 600;
  color: #202c27;
}

.line-clamp-6 {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose :deep(p) { margin-bottom: 0.5em; color: #374151; }
.prose :deep(ul) { margin-bottom: 0.5em; padding-left: 1.25em; list-style-type: disc; }
.prose :deep(li) { margin-bottom: 0.25em; color: #4b5563; }
.prose :deep(strong) { font-weight: 600; color: #111827; }
.prose :deep(br) { content: ""; display: block; margin-bottom: 0.25em; }
</style>
