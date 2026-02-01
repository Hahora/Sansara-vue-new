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
          <Building2 class="h-8 w-8 text-white" />
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-light tracking-wide">
            Корпоративные программы
          </h1>
          <p class="text-white/70 text-sm mt-1 font-light">
            «Отдых, после которого не нужен отдых»
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
      <p class="text-sm text-gray-600 font-light">Загружаем программы...</p>
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

    <!-- Содержание корпоративных программ -->
    <div v-else class="px-5 py-5">
      <!-- Если нет корпоративных программ -->
      <div
        v-if="!corporatePrograms || corporatePrograms.length === 0"
        class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 p-8 text-center"
      >
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Building2 class="h-8 w-8 text-[#c2a886]" />
        </div>
        <h3 class="text-base font-semibold text-gray-900 mb-2">
          Корпоративные программы
        </h3>
        <p class="text-sm text-gray-600 leading-relaxed">
          Скоро здесь появится информация о корпоративных программах
        </p>
      </div>

      <!-- Список корпоративных программ -->
      <div v-else class="space-y-4">
        <!-- Карточка программы -->
        <div
          v-for="program in corporatePrograms"
          :key="program.id"
          class="bg-[#e3ded3] rounded-xl border border-[#c2a886]/20 overflow-hidden"
        >
          <!-- Заголовок программы -->
          <div class="px-4 py-4 bg-[#d9cebc] border-b border-[#c2a886]/30">
            <div class="flex items-center gap-3">
              <div
                class="h-12 w-12 bg-gradient-to-br from-[#c2a886] to-[#b5976e] rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Building2 class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="font-semibold text-gray-900 text-base leading-tight">
                  {{ program.title }}
                </h2>
                <p
                  v-if="program.subtitle"
                  class="text-sm text-gray-600 mt-0.5 truncate"
                >
                  {{ program.subtitle }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <!-- Цена, если есть -->
            <div v-if="program.price" class="flex items-center">
              <div
                class="bg-[#d9cebc] border border-[#c2a886]/30 px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <div
                  class="h-8 w-8 rounded-full bg-[#c2a886]/30 flex items-center justify-center"
                >
                  <Wallet class="h-4 w-4 text-[#202c27]" />
                </div>
                <div>
                  <div class="font-semibold text-gray-900 text-base">
                    {{ formatPrice(program.price) }}
                  </div>
                  <div class="text-xs text-gray-600">с участника</div>
                </div>
              </div>
            </div>

            <!-- Длительность, если есть -->
            <div v-if="program.duration" class="flex items-center">
              <div
                class="bg-[#d9cebc]/40 text-gray-700 px-3 py-2 rounded-xl border border-[#c2a886]/20 text-sm flex items-center gap-2"
              >
                <Calendar class="h-4 w-4 text-[#c2a886]" />
                <span class="font-medium">Длительность:</span>
                <span>{{ program.duration }}</span>
              </div>
            </div>

            <!-- Формат проведения, если есть -->
            <div v-if="program.format" class="flex items-center">
              <div
                class="bg-[#d9cebc]/40 text-gray-700 px-3 py-2 rounded-xl border border-[#c2a886]/20 text-sm flex items-center gap-2"
              >
                <Layout class="h-4 w-4 text-[#c2a886]" />
                <span class="font-medium">Формат:</span>
                <span>{{ program.format }}</span>
              </div>
            </div>

            <!-- Контент программы с разворачиванием -->
            <div v-if="program.content" class="bg-[#d9cebc]/40 rounded-xl p-4">
              <div
                :class="[
                  'text-sm text-gray-700 leading-relaxed prose-content transition-all duration-300',
                  !expandedPrograms[program.id] &&
                  isContentLong(program.content)
                    ? 'line-clamp-4'
                    : '',
                ]"
                v-html="formatContent(program.content)"
              ></div>

              <!-- Кнопка развернуть/свернуть -->
              <button
                v-if="isContentLong(program.content)"
                @click="toggleExpanded(program.id)"
                class="mt-3 text-sm text-[#c2a886] hover:text-[#b5976e] font-medium flex items-center gap-1 transition-colors"
              >
                <span>{{
                  expandedPrograms[program.id] ? "Свернуть" : "Развернуть"
                }}</span>
                <ChevronDown
                  :class="[
                    'h-4 w-4 transition-transform duration-300',
                    expandedPrograms[program.id] ? 'rotate-180' : '',
                  ]"
                />
              </button>
            </div>

            <!-- Если контента нет -->
            <div
              v-else
              class="bg-[#d9cebc]/40 rounded-xl p-4 text-center text-gray-500 text-sm"
            >
              Описание программы скоро появится
            </div>

            <!-- Преимущества корпоративной программы -->
            <div
              v-if="
                program.benefits &&
                Array.isArray(program.benefits) &&
                program.benefits.length > 0
              "
              class="space-y-2"
            >
              <div
                class="text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                <Award class="h-4 w-4 text-[#c2a886]" />
                Преимущества для компании:
              </div>
              <ul class="space-y-1.5">
                <li
                  v-for="(benefit, index) in program.benefits"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <CheckCircle
                    class="h-4 w-4 text-[#c2a886] mt-0.5 flex-shrink-0"
                  />
                  <span class="text-sm text-gray-700">{{ benefit }}</span>
                </li>
              </ul>
            </div>

            <!-- Включено в программу -->
            <div
              v-if="
                program.included &&
                Array.isArray(program.included) &&
                program.included.length > 0
              "
              class="space-y-2"
            >
              <div
                class="text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                <List class="h-4 w-4 text-[#c2a886]" />
                Включено в программу:
              </div>
              <ul class="space-y-1.5">
                <li
                  v-for="(item, index) in program.included"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <CheckCircle
                    class="h-4 w-4 text-[#c2a886] mt-0.5 flex-shrink-0"
                  />
                  <span class="text-sm text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- Кнопки действий -->
            <div class="space-y-2.5 pt-2">
              <!-- Кнопка позвонить -->
              <button
                @click="callCorporateNumber"
                class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
              >
                <Phone class="h-5 w-5 mr-2" />
                <span class="text-[15px]">
                  {{
                    currentBranch?.phone
                      ? `Позвонить в ${currentBranch.name}`
                      : "Позвонить для уточнения деталей"
                  }}
                </span>
              </button>

              <!-- Кнопка написать в Telegram -->
              <button
                @click="openTelegramChat"
                class="w-full bg-gradient-to-r from-[#0088cc] to-[#24a1de] hover:from-[#0077b5] hover:to-[#0088cc] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98]"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.24-.02-.1.02-1.79 1.14-5.06 3.35-.48.33-.92.49-1.31.48-.43-.01-1.27-.25-1.89-.45-.76-.26-1.37-.4-1.32-.84.03-.23.33-.47.9-.72 3.5-1.52 5.83-2.53 6.99-3.03 3.33-1.36 4.03-1.6 4.48-1.61.1-.01.33.02.48.15.12.1.15.23.17.33.02.1.02.23.01.33z"
                  />
                </svg>
                <span class="text-[15px]">
                  {{
                    currentBranch?.tg_username
                      ? `Написать ${currentBranch.name} в Telegram`
                      : "Написать нам в Telegram"
                  }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { branchAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "CorporateProgramsPage",
  components: {
    ...icons,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      corporatePrograms: [],
      isTelegramWebApp: false,
      telegramWebApp: null,
      allBranches: [],
      expandedPrograms: {}, // Объект для отслеживания развернутых программ
    };
  },
  computed: {
    ...mapState(useAppStore, [
      "programs",
      "programsLoaded",
      "selectedBranch",
      "contentData",
    ]),

    currentBranch() {
      if (!this.selectedBranch || !this.selectedBranch.id) {
        console.log("Нет selectedBranch в store");
        return null;
      }

      const actualBranch = this.allBranches.find(
        (branch) => branch.id === this.selectedBranch.id
      );

      if (actualBranch) {
        console.log("Найден актуальный филиал по ID:", actualBranch);
        return actualBranch;
      }

      console.log(
        "Используем филиал из store (может быть устаревшим):",
        this.selectedBranch
      );
      return this.selectedBranch;
    },

    branchPhoneNumber() {
      if (!this.currentBranch) {
        console.log("Нет currentBranch для получения телефона");
        return null;
      }

      const phone = this.currentBranch.phone;
      console.log(
        "Телефон филиала:",
        phone,
        "для филиала:",
        this.currentBranch.name
      );
      return phone;
    },

    branchTelegramUrl() {
      if (!this.currentBranch) {
        console.log("Нет currentBranch для получения TG");
        return null;
      }

      const tgUsername = this.currentBranch.tg_username;
      if (tgUsername) {
        let cleanUsername = tgUsername.trim();
        if (cleanUsername.startsWith("@")) {
          cleanUsername = cleanUsername.substring(1);
        }

        if (!cleanUsername) {
          console.log("TG username пустой после очистки");
          return null;
        }

        const url = `https://t.me/${cleanUsername}`;
        console.log(
          "TG URL филиала:",
          url,
          "для филиала:",
          this.currentBranch.name
        );
        return url;
      }

      console.log("Нет TG у филиала:", this.currentBranch.name);
      return null;
    },
  },
  methods: {
    ...mapActions(useAppStore, ["loadPrograms", "loadSiteContent"]),

    async loadAllBranches() {
      try {
        console.log("Загрузка списка филиалов из API...");
        const branches = await branchAPI.getAll();

        this.allBranches = branches.filter(
          (branch) => branch.is_active === true
        );
        console.log("Загружено филиалов:", this.allBranches.length);

        this.allBranches.forEach((branch, index) => {
          console.log(`Филиал ${index + 1}:`, {
            id: branch.id,
            name: branch.name,
            phone: branch.phone,
            tg_username: branch.tg_username,
            hasPhone: !!branch.phone,
            hasTg: !!branch.tg_username,
          });
        });
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
      if (!price && price !== 0) return "";

      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;

      return priceNumber.toLocaleString("ru-RU") + " ₽";
    },

    isContentLong(content) {
      if (!content) return false;
      // Проверяем длину контента (более 200 символов) или количество переносов строк (более 3)
      const textLength = content.replace(/<[^>]*>/g, "").length;
      const lineBreaks = (content.match(/\n|<br>/gi) || []).length;
      return textLength > 200 || lineBreaks > 3;
    },

    toggleExpanded(programId) {
      // Vue 3 способ - напрямую изменяем объект
      this.expandedPrograms[programId] = !this.expandedPrograms[programId];
    },

    callCorporateNumber() {
      console.log("=== callCorporateNumber вызван ===");
      console.log("selectedBranch из store:", this.selectedBranch);
      console.log("Актуальный currentBranch:", this.currentBranch);
      console.log("Номер телефона:", this.branchPhoneNumber);

      const phoneNumber = this.branchPhoneNumber;

      if (!phoneNumber) {
        this.showErrorPopup(
          this.currentBranch
            ? `У филиала "${this.currentBranch.name}" нет указанного телефона`
            : "Телефон для связи не указан"
        );
        return;
      }

      if (this.isTelegramWebApp && this.telegramWebApp) {
        this.telegramWebApp
          .showPopup({
            title: `Позвонить в ${this.currentBranch?.name || "филиал"}`,
            message: `Для связи по корпоративным вопросам:\n${phoneNumber}`,
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
          })
          .then((buttonId) => {
            if (buttonId === "copy") {
              this.copyToClipboard(phoneNumber);
              this.telegramWebApp.showAlert("Номер скопирован в буфер обмена!");
            }
          });
      } else {
        try {
          window.location.href = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;
        } catch (error) {
          this.showPhonePopup(
            phoneNumber,
            this.currentBranch?.name || "филиал"
          );
        }
      }
    },

    openTelegramChat() {
      console.log("=== openTelegramChat вызван ===");
      console.log("selectedBranch из store:", this.selectedBranch);
      console.log("Актуальный currentBranch:", this.currentBranch);
      console.log("TG URL:", this.branchTelegramUrl);

      if (!this.branchTelegramUrl) {
        this.showErrorPopup(
          this.currentBranch
            ? `У филиала "${this.currentBranch.name}" нет указанного Telegram аккаунта`
            : "Telegram для связи не указан"
        );
        return;
      }

      if (this.isTelegramWebApp && this.telegramWebApp) {
        this.telegramWebApp.openTelegramLink(this.branchTelegramUrl);
      } else {
        window.open(this.branchTelegramUrl, "_blank");
      }
    },

    showErrorPopup(message) {
      console.log("Показываем ошибку:", message);
      if (this.isTelegramWebApp && this.telegramWebApp) {
        this.telegramWebApp.showAlert(message);
      } else {
        alert(message);
      }
    },

    showPhonePopup(phoneNumber, branchName = "филиал") {
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-[#202c27]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4";
      modal.innerHTML = `
        <div class="bg-[#edeae6] rounded-2xl max-w-sm w-full p-6">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-[#c2a886]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <h3 class="text-xl font-light text-gray-900 mb-2 tracking-wide">Позвонить в ${branchName}</h3>
            <p class="text-gray-600 text-sm mb-4 font-light">Для связи по корпоративным вопросам</p>
            <div class="text-2xl font-medium text-[#c2a886] mb-6">${phoneNumber}</div>
            ${
              this.currentBranch?.name
                ? `<p class="text-sm text-gray-500 font-light">${this.currentBranch.name}</p>`
                : ""
            }
          </div>
          <div class="space-y-3">
            <button onclick="window.location.href='tel:${phoneNumber.replace(
              /[^\d+]/g,
              ""
            )}'" class="w-full bg-gradient-to-r from-[#c2a886] to-[#b5976e] hover:from-[#b5976e] hover:to-[#a68a5f] text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-md">
              Позвонить
            </button>
            <button id="copyPhoneBtn" class="w-full bg-[#d9cebc] hover:bg-[#c2a886]/30 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-300">
              Скопировать номер
            </button>
            <button id="closePhoneModal" class="w-full bg-white hover:bg-gray-50 text-gray-600 font-medium py-3 px-4 rounded-xl transition-all duration-300 border border-[#c2a886]/20">
              Закрыть
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector("#copyPhoneBtn").addEventListener("click", () => {
        this.copyToClipboard(phoneNumber);
        this.showToast("Номер скопирован в буфер обмена!");
      });

      modal.querySelector("#closePhoneModal").addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    },

    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Текст скопирован:", text);
        })
        .catch((err) => {
          console.error("Ошибка копирования:", err);
          const textArea = document.createElement("textarea");
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        });
    },

    showToast(message) {
      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#202c27] text-white px-4 py-3 rounded-xl shadow-2xl z-50 animate-fade-in-up backdrop-blur-sm";
      toast.textContent = message;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("animate-fade-out");
        setTimeout(() => {
          if (toast.parentNode) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 3000);
    },

    checkTelegramWebApp() {
      if (window.Telegram && window.Telegram.WebApp) {
        this.isTelegramWebApp = true;
        this.telegramWebApp = window.Telegram.WebApp;
        console.log("Telegram Web App detected");
      } else {
        console.log("Not in Telegram Web App");
      }
    },

    async loadCorporatePrograms() {
      try {
        console.log(
          "Загрузка корпоративных программ для филиала:",
          this.currentBranch?.id,
          this.currentBranch?.name
        );

        await this.loadSiteContent("CORPORATE", true);

        const content = this.contentData?.["CORPORATE"];

        if (Array.isArray(content)) {
          this.corporatePrograms = content.filter(
            (program) => program.is_active !== false
          );
          console.log(
            "Загружено корпоративных программ:",
            this.corporatePrograms.length
          );
        } else if (content && typeof content === "object") {
          this.corporatePrograms = content.is_active !== false ? [content] : [];
          console.log("Загружена одна корпоративная программа:", content.title);
        } else {
          this.corporatePrograms = [];
          console.log("Корпоративные программы не найдены");
        }
      } catch (error) {
        console.error("Ошибка при загрузке корпоративных программ:", error);
        this.error =
          error.message ||
          "Не удалось загрузить информацию о корпоративных программах";
        this.corporatePrograms = [];
      }
    },
  },
  async created() {
    console.log("=== CorporateProgramsPage created ===");
    console.log("selectedBranch из store при создании:", this.selectedBranch);

    this.checkTelegramWebApp();

    try {
      await this.loadAllBranches();

      console.log("Актуальный currentBranch:", this.currentBranch);
      console.log("branchPhoneNumber:", this.branchPhoneNumber);
      console.log("branchTelegramUrl:", this.branchTelegramUrl);

      await this.loadCorporatePrograms();

      console.log("Страница корпоративных программ загружена успешно");
    } catch (error) {
      console.error(
        "Ошибка при загрузке страницы корпоративных программ:",
        error
      );
      this.error = error.message || "Ошибка при загрузке страницы";
    } finally {
      this.isLoading = false;
    }
  },

  watch: {
    selectedBranch: {
      handler(newVal) {
        console.log("selectedBranch изменился в store:", newVal);
        console.log("Новый актуальный currentBranch:", this.currentBranch);
        this.loadCorporatePrograms();
      },
      deep: true,
    },

    allBranches: {
      handler() {
        console.log(
          "allBranches обновился, актуальный currentBranch:",
          this.currentBranch
        );
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
/* Line clamp для сворачивания текста */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Стили для контента из API */
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

/* Анимации для toast */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}

.animate-fade-out {
  animation: fade-out 0.3s ease-out;
}
</style>
