<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
    >
      <!-- Шапка -->
      <div
        class="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-xl z-10"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-3xl mr-3">📋</span>
            <h3 class="font-bold text-xl">Инструкция по работе с лотереей</h3>
          </div>
          <button @click="close" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Контент -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="space-y-6">
          <!-- Шаг 1 -->
          <div
            class="bg-purple-50 border-l-4 border-purple-500 rounded-r-lg p-5"
          >
            <div class="flex items-start">
              <div
                class="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4"
              >
                1
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 mb-2 text-lg">
                  📊 Импорт призов из Excel
                </h4>
                <p class="text-gray-700 mb-3">
                  Подготовьте Excel файл с призами в формате:
                </p>
                <div
                  class="bg-white rounded-lg p-3 font-mono text-sm border border-purple-200"
                >
                  <div class="text-purple-600 font-semibold mb-1">
                    Ticket Number | Prize
                  </div>
                  <div class="text-gray-600">1 | Спа-пакет</div>
                  <div class="text-gray-600">2 | Массаж спины</div>
                  <div class="text-gray-600">3 | Процедура для лица</div>
                </div>
                <p class="text-gray-600 text-sm mt-3">
                  💡 Перейдите во вкладку "Призы" → нажмите "Импорт" → выберите
                  файл
                </p>
              </div>
            </div>
          </div>

          <!-- Шаг 2 -->
          <div class="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-5">
            <div class="flex items-start">
              <div
                class="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4"
              >
                2
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 mb-2 text-lg">
                  ✅ Включение лотереи
                </h4>
                <p class="text-gray-700 mb-3">
                  Активируйте лотерею для участников:
                </p>
                <div class="space-y-2 text-gray-700">
                  <div class="flex items-center">
                    <span class="text-green-500 mr-2">▸</span>
                    Нажмите "Настройки лотереи"
                  </div>
                  <div class="flex items-center">
                    <span class="text-green-500 mr-2">▸</span>
                    Установите "Статус: Активна"
                  </div>
                  <div class="flex items-center">
                    <span class="text-green-500 mr-2">▸</span>
                    Сохраните изменения
                  </div>
                </div>
                <p class="text-gray-600 text-sm mt-3">
                  ⚠️ Только после активации пользователи смогут вводить коды
                </p>
              </div>
            </div>
          </div>

          <!-- Шаг 3 -->
          <div
            class="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-5"
          >
            <div class="flex items-start">
              <div
                class="flex-shrink-0 w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4"
              >
                3
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 mb-2 text-lg">
                  🎟️ Генерация кодов для гостей
                </h4>
                <p class="text-gray-700 mb-3">
                  Создайте коды активации для участников:
                </p>
                <div class="space-y-2 text-gray-700">
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-2">▸</span>
                    Нажмите "Сгенерировать код"
                  </div>
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-2">▸</span>
                    Подтвердите создание кода
                  </div>
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-2">▸</span>
                    Скопируйте 6-значный код
                  </div>
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-2">▸</span>
                    Отправьте код гостю
                  </div>
                </div>
                <p class="text-gray-600 text-sm mt-3">
                  💡 Каждый код можно использовать один раз. Генерируйте новый
                  код для каждого гостя.
                </p>
              </div>
            </div>
          </div>

          <!-- Шаг 4 -->
          <div class="bg-pink-50 border-l-4 border-pink-500 rounded-r-lg p-5">
            <div class="flex items-start">
              <div
                class="flex-shrink-0 w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4"
              >
                4
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 mb-2 text-lg">
                  🎰 Проведение розыгрыша
                </h4>
                <p class="text-gray-700 mb-3">
                  Когда все участники активировали коды:
                </p>
                <div class="space-y-2 text-gray-700">
                  <div class="flex items-center">
                    <span class="text-pink-500 mr-2">▸</span>
                    Убедитесь, что все призы импортированы
                  </div>
                  <div class="flex items-center">
                    <span class="text-pink-500 mr-2">▸</span>
                    Нажмите "Провести розыгрыш"
                  </div>
                  <div class="flex items-center">
                    <span class="text-pink-500 mr-2">▸</span>
                    Выберите администратора для получения результатов
                  </div>
                  <div class="flex items-center">
                    <span class="text-pink-500 mr-2">▸</span>
                    Подтвердите проведение розыгрыша
                  </div>
                </div>
                <div class="bg-pink-100 rounded-lg p-3 mt-3">
                  <p class="text-pink-800 text-sm font-semibold">
                    ⚠️ Важно: Розыгрыш нельзя отменить!
                  </p>
                  <p class="text-pink-700 text-xs mt-1">
                    Выбранному администратору придёт Excel файл с результатами в
                    Telegram
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Шаг 5 -->
          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-5">
            <div class="flex items-start">
              <div
                class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4"
              >
                5
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 mb-2 text-lg">
                  📢 Автоматическая рассылка победителям
                </h4>
                <p class="text-gray-700 mb-3">
                  После розыгрыша система автоматически:
                </p>
                <div class="space-y-2 text-gray-700">
                  <div class="flex items-center">
                    <span class="text-blue-500 mr-2">✓</span>
                    Присваивает призы билетам
                  </div>
                  <div class="flex items-center">
                    <span class="text-blue-500 mr-2">✓</span>
                    Отправляет уведомления всем победителям
                  </div>
                  <div class="flex items-center">
                    <span class="text-blue-500 mr-2">✓</span>
                    Показывает призы в приложении пользователей
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Шаг 6 -->
          <div
            class="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5"
          >
            <div class="flex items-start">
              <div
                class="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4"
              >
                6
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 mb-2 text-lg">
                  📤 Отправка результатов администратору
                </h4>
                <p class="text-gray-700 mb-3">
                  Результаты автоматически отправляются в Telegram:
                </p>
                <div class="space-y-2 text-gray-700">
                  <div class="flex items-center">
                    <span class="text-indigo-500 mr-2">✓</span>
                    Excel файл с полным списком победителей
                  </div>
                  <div class="flex items-center">
                    <span class="text-indigo-500 mr-2">✓</span>
                    Информация: User ID, Username, Phone, Ticket, Prize
                  </div>
                  <div class="flex items-center">
                    <span class="text-indigo-500 mr-2">✓</span>
                    Дата активации билета
                  </div>
                </div>
                <p class="text-gray-600 text-sm mt-3">
                  💡 Файл придёт администратору, указанному в настройках
                </p>
              </div>
            </div>
          </div>

          <!-- Шаг 7 -->
          <div class="bg-gray-50 border-l-4 border-gray-500 rounded-r-lg p-5">
            <div class="flex items-start">
              <div
                class="flex-shrink-0 w-10 h-10 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4"
              >
                7
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 mb-2 text-lg">
                  ⏸️ Автоматическая деактивация лотереи
                </h4>
                <p class="text-gray-700 mb-3">После проведения розыгрыша:</p>
                <div class="space-y-2 text-gray-700">
                  <div class="flex items-center">
                    <span class="text-gray-500 mr-2">✓</span>
                    Лотерея переходит в статус "Неактивна"
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 mr-2">✓</span>
                    Новые коды нельзя активировать
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 mr-2">✓</span>
                    Пользователи видят свои выигрыши в истории
                  </div>
                </div>
                <div class="bg-gray-100 rounded-lg p-3 mt-3">
                  <p class="text-gray-800 text-sm">
                    🔄 Для нового розыгрыша нужно снова активировать лотерею и
                    импортировать новые призы
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка закрытия -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <button
          @click="close"
          class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all active:scale-98"
        >
          Понятно, закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LotteryInstructionsModal",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrollY: 0,
    };
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.lockBodyScroll();
      } else {
        this.unlockBodyScroll();
      }
    },
  },
  methods: {
    lockBodyScroll() {
      this.scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    },

    unlockBodyScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, this.scrollY);
    },

    close() {
      this.$emit("close");
    },
  },
  beforeDestroy() {
    this.unlockBodyScroll();
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
