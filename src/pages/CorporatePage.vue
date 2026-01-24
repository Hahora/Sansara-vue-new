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

      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white border-opacity-30"
        >
          🏢
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">Корпоративные программы</h1>
          <p class="text-white text-opacity-90 text-sm mt-1">
            «Отдых, после которого не нужен отдых»
          </p>
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

    <!-- Содержание корпоративных программ -->
    <div v-else class="px-4 py-5">
      <!-- Если нет корпоративных программ -->
      <div
        v-if="!corporatePrograms || corporatePrograms.length === 0"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
      >
        <div class="text-4xl mb-4">🏢</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Корпоративные программы
        </h3>
        <p class="text-gray-600">
          Скоро здесь появится информация о корпоративных программах
        </p>
      </div>

      <!-- Список корпоративных программ -->
      <div v-else class="space-y-4">
        <!-- Карточка программы -->
        <div
          v-for="program in corporatePrograms"
          :key="program.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Заголовок программы -->
          <div
            class="px-4 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100"
          >
            <div class="flex items-center">
              <span class="text-3xl mr-3">🏢</span>
              <div class="flex-1">
                <h2 class="font-bold text-gray-900 text-lg">
                  {{ program.title }}
                </h2>
                <p v-if="program.subtitle" class="text-sm text-gray-600 mt-0.5">
                  {{ program.subtitle }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <!-- Цена, если есть -->
            <div v-if="program.price" class="flex items-center">
              <div
                class="bg-green-50 text-green-800 px-4 py-2 rounded-lg border border-green-200"
              >
                <div class="flex items-center">
                  <span class="font-bold text-lg">{{
                    formatPrice(program.price)
                  }}</span>
                  <span class="text-sm ml-2 text-green-600">/ с участника</span>
                </div>
              </div>
            </div>

            <!-- Длительность, если есть -->
            <div v-if="program.duration" class="flex items-center">
              <div
                class="bg-gray-50 text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">Длительность:</span>
                <span class="ml-1">{{ program.duration }}</span>
              </div>
            </div>

            <!-- Формат проведения, если есть -->
            <div v-if="program.format" class="flex items-center">
              <div
                class="bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-200 text-sm"
              >
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">Формат:</span>
                <span class="ml-1">{{ program.format }}</span>
              </div>
            </div>

            <!-- Контент программы -->
            <div v-if="program.content" class="prose prose-sm max-w-none">
              <div v-html="formatContent(program.content)"></div>
            </div>

            <!-- Если контента нет -->
            <div
              v-else
              class="bg-gray-50 rounded-lg p-3 text-center text-gray-500 italic"
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
              <div class="text-sm font-medium text-gray-700">
                Преимущества для компании:
              </div>
              <ul class="space-y-1">
                <li
                  v-for="(benefit, index) in program.benefits"
                  :key="index"
                  class="flex items-start"
                >
                  <svg
                    class="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-sm text-gray-600">{{ benefit }}</span>
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
              <div class="text-sm font-medium text-gray-700">
                Включено в программу:
              </div>
              <ul class="space-y-1">
                <li
                  v-for="(item, index) in program.included"
                  :key="index"
                  class="flex items-start"
                >
                  <svg
                    class="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-sm text-gray-600">{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- Кнопки действий -->
            <div class="space-y-3 pt-4">
              <!-- Кнопка позвонить -->
              <button
                @click="callCorporateNumber"
                class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm active:scale-98"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                  />
                </svg>
                {{
                  selectedBranch?.phone
                    ? "Позвонить в филиал"
                    : "Позвонить для уточнения деталей"
                }}
              </button>

              <!-- Кнопка написать в Telegram -->
              <button
                @click="openTelegramChat"
                class="w-full bg-gradient-to-r from-[#0088cc] to-[#24a1de] hover:from-[#0077b5] hover:to-[#0088cc] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm active:scale-98 mt-2"
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
                {{
                  selectedBranch?.tg_username
                    ? "Написать в Telegram филиала"
                    : "Написать нам в Telegram"
                }}
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

export default {
  name: "CorporateProgramsPage",
  data() {
    return {
      isLoading: false,
      error: null,
      corporatePrograms: [],
      isTelegramWebApp: false,
      telegramWebApp: null,
      allBranches: [],
    };
  },
  computed: {
    ...mapState(useAppStore, [
      "programs",
      "programsLoaded",
      "selectedBranch", // Из Pinia store (может быть устаревшим!)
      "contentData",
    ]),

    // Находим актуальные данные филиала по ID из selectedBranch
    currentBranch() {
      // Если нет selectedBranch, возвращаем null
      if (!this.selectedBranch || !this.selectedBranch.id) {
        console.log("Нет selectedBranch в store");
        return null;
      }

      // Ищем актуальные данные в allBranches по ID
      const actualBranch = this.allBranches.find(
        (branch) => branch.id === this.selectedBranch.id
      );

      if (actualBranch) {
        console.log("Найден актуальный филиал по ID:", actualBranch);
        return actualBranch;
      }

      // Если не нашли в allBranches, используем то что есть в store
      console.log(
        "Используем филиал из store (может быть устаревшим):",
        this.selectedBranch
      );
      return this.selectedBranch;
    },

    // Динамическое получение телефона филиала
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

    // Динамическое получение Telegram username филиала
    branchTelegramUrl() {
      if (!this.currentBranch) {
        console.log("Нет currentBranch для получения TG");
        return null;
      }

      const tgUsername = this.currentBranch.tg_username;
      if (tgUsername) {
        // Очищаем username от лишних символов
        let cleanUsername = tgUsername.trim();
        if (cleanUsername.startsWith("@")) {
          cleanUsername = cleanUsername.substring(1);
        }

        // Проверяем, что username не пустой после очистки
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

    // Загрузка всех филиалов из API
    async loadAllBranches() {
      try {
        console.log("Загрузка списка филиалов из API...");
        const branches = await branchAPI.getAll();

        // Фильтруем только активные филиалы
        this.allBranches = branches.filter(
          (branch) => branch.is_active === true
        );
        console.log("Загружено филиалов:", this.allBranches.length);

        // Выводим информацию о каждом филиале для отладки
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

    // Форматирование контента
    formatContent(content) {
      if (!content) return "";
      return content
        .replace(/\n/g, "<br>")
        .replace(/\\n/g, "<br>")
        .replace(/\r\n/g, "<br>");
    },

    // Форматирование цены
    formatPrice(price) {
      if (!price && price !== 0) return "";

      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;

      return priceNumber.toLocaleString("ru-RU") + " ₽";
    },

    // Звонок на номер филиала
    callCorporateNumber() {
      console.log("=== callCorporateNumber вызван ===");
      console.log("selectedBranch из store:", this.selectedBranch);
      console.log("Актуальный currentBranch:", this.currentBranch);
      console.log("Номер телефона:", this.branchPhoneNumber);

      const phoneNumber = this.branchPhoneNumber;

      if (!phoneNumber) {
        this.showErrorPopup("У этого филиала нет указанного телефона");
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

    // Открыть чат в Telegram филиала
    openTelegramChat() {
      console.log("=== openTelegramChat вызван ===");
      console.log("selectedBranch из store:", this.selectedBranch);
      console.log("Актуальный currentBranch:", this.currentBranch);
      console.log("TG URL:", this.branchTelegramUrl);

      if (!this.branchTelegramUrl) {
        this.showErrorPopup("У этого филиала нет указанного Telegram аккаунта");
        return;
      }

      if (this.isTelegramWebApp && this.telegramWebApp) {
        this.telegramWebApp.openTelegramLink(this.branchTelegramUrl);
      } else {
        window.open(this.branchTelegramUrl, "_blank");
      }
    },

    // Показать попап с ошибкой
    showErrorPopup(message) {
      console.log("Показываем ошибку:", message);
      if (this.isTelegramWebApp && this.telegramWebApp) {
        this.telegramWebApp.showAlert(message);
      } else {
        alert(message);
      }
    },

    // Показать попап с номером телефона
    showPhonePopup(phoneNumber, branchName = "филиал") {
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
      modal.innerHTML = `
          <div class="bg-white rounded-2xl max-w-sm w-full p-6">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Позвонить в ${branchName}</h3>
              <p class="text-gray-600 mb-4">Для связи по корпоративным вопросам</p>
              <div class="text-2xl font-bold text-blue-600 mb-6">${phoneNumber}</div>
              ${
                this.currentBranch?.name
                  ? `<p class="text-sm text-gray-500">${this.currentBranch.name}</p>`
                  : ""
              }
            </div>
            <div class="space-y-3">
              <button onclick="window.location.href='tel:${phoneNumber.replace(
                /[^\d+]/g,
                ""
              )}'" class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                Позвонить
              </button>
              <button id="copyPhoneBtn" class="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                Скопировать номер
              </button>
              <button id="closePhoneModal" class="w-full bg-white hover:bg-gray-50 text-gray-600 font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-gray-200">
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

    // Копирование в буфер обмена
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

    // Показать toast-уведомление
    showToast(message) {
      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up";
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

    // Проверяем, запущено ли приложение в Telegram Web App
    checkTelegramWebApp() {
      if (window.Telegram && window.Telegram.WebApp) {
        this.isTelegramWebApp = true;
        this.telegramWebApp = window.Telegram.WebApp;
        console.log("Telegram Web App detected");
      } else {
        console.log("Not in Telegram Web App");
      }
    },

    // Загрузка корпоративных программ из API
    async loadCorporatePrograms() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log(
          "Загрузка корпоративных программ для филиала:",
          this.currentBranch?.id,
          this.currentBranch?.name
        );

        // Загружаем контент для CORPORATE
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
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    console.log("=== CorporateProgramsPage created ===");
    console.log("selectedBranch из store при создании:", this.selectedBranch);

    // Проверяем, находимся ли мы в Telegram Web App
    this.checkTelegramWebApp();

    try {
      // 1. Загружаем список филиалов из API (актуальные данные)
      await this.loadAllBranches();

      // 2. Выводим отладочную информацию
      console.log("Актуальный currentBranch:", this.currentBranch);
      console.log("branchPhoneNumber:", this.branchPhoneNumber);
      console.log("branchTelegramUrl:", this.branchTelegramUrl);

      // 3. Загружаем корпоративные программы
      await this.loadCorporatePrograms();

      console.log("Страница корпоративных программ загружена успешно");
    } catch (error) {
      console.error(
        "Ошибка при загрузке страницы корпоративных программ:",
        error
      );
      this.error = error.message || "Ошибка при загрузке страницы";
    }
  },

  // Следим за изменениями
  watch: {
    // Следим за изменением филиала в store
    selectedBranch: {
      handler(newVal) {
        console.log("selectedBranch изменился в store:", newVal);
        console.log("Новый актуальный currentBranch:", this.currentBranch);
        this.loadCorporatePrograms();
      },
      deep: true,
    },

    // Следим за загрузкой филиалов
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
.active\:scale-98:active {
  transform: scale(0.98);
}

.prose :deep(p) {
  margin-bottom: 0.75em;
}

.prose :deep(ul) {
  margin-bottom: 0.75em;
  padding-left: 1.5em;
  list-style-type: disc;
}

.prose :deep(li) {
  margin-bottom: 0.25em;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #111827;
}

/* Стили для градиентных кнопок */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-blue-500 {
  --tw-gradient-from: #3b82f6;
  --tw-gradient-stops:
    var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 130, 246, 0));
}

.to-blue-600 {
  --tw-gradient-to: #2563eb;
}

.hover\:from-blue-600:hover {
  --tw-gradient-from: #2563eb;
}

.hover\:to-blue-700:hover {
  --tw-gradient-to: #1d4ed8;
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
