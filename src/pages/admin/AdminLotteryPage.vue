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
            🎟️
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление лотереей</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Лотерея: {{ lotteryStatus }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка инструкции -->
          <button
            @click="showInstructionsModal = true"
            class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-lg transition-all active:scale-98"
            title="Инструкция"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Кнопка обновления -->
          <button
            @click="loadAllData"
            :disabled="isLoading"
            class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-lg transition-all active:scale-98 disabled:opacity-50"
            title="Обновить данные"
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
    </div>

    <!-- Статистика -->
    <div class="px-4 py-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <!-- Статус лотереи -->
          <div class="text-center">
            <div class="text-sm text-gray-600 mb-1">Статус лотереи</div>
            <div
              :class="settings.is_enabled ? 'text-green-600' : 'text-red-600'"
              class="text-lg font-bold"
            >
              {{ settings.is_enabled ? "Активна" : "Отключена" }}
            </div>
          </div>

          <!-- Выдано билетов -->
          <div class="text-center">
            <div class="text-sm text-gray-600 mb-1">Выдано билетов</div>
            <div class="text-lg font-bold text-blue-600">
              {{ stats.issuedTickets || 0 }}
            </div>
          </div>

          <!-- Призов -->
          <div class="text-center">
            <div class="text-sm text-gray-600 mb-1">Распределено призов</div>
            <div class="text-lg font-bold text-purple-600">
              {{ stats.prizesDistributed || 0 }}
            </div>
          </div>
        </div>

        <!-- Кнопка настроек -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <button
            @click="openSettingsModal"
            class="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
            Настройки лотереи
          </button>
        </div>

        <!-- Быстрые действия -->
        <div class="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <!-- Сгенерировать код - отдельно -->
          <button
            @click="openGenerateCodesModal"
            class="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all shadow-md flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clip-rule="evenodd"
              />
            </svg>
            Сгенерировать код
          </button>

          <!-- Провести розыгрыш -->
          <button
            @click="openConductDrawModal"
            class="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Провести розыгрыш
          </button>
        </div>
      </div>
    </div>

    <!-- Табы -->
    <div class="px-4 pb-4">
      <div class="flex border-b border-gray-200">
        <button
          @click="activeTab = 'tickets'"
          :class="
            activeTab === 'tickets'
              ? 'border-b-2 border-[#4e5d51] text-[#4e5d51]'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-4 py-2 text-sm font-medium transition-colors"
        >
          Билеты ({{ tickets.length }})
        </button>
        <button
          @click="activeTab = 'prizes'"
          :class="
            activeTab === 'prizes'
              ? 'border-b-2 border-[#4e5d51] text-[#4e5d51]'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-4 py-2 text-sm font-medium transition-colors"
        >
          Призы ({{ prizes.length }})
        </button>
        <button
          @click="activeTab = 'codes'"
          :class="
            activeTab === 'codes'
              ? 'border-b-2 border-[#4e5d51] text-[#4e5d51]'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-4 py-2 text-sm font-medium transition-colors"
        >
          Коды ({{ unusedCodes.length }})
        </button>
        <button
          @click="activeTab = 'importExport'"
          :class="
            activeTab === 'importExport'
              ? 'border-b-2 border-[#4e5d51] text-[#4e5d51]'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-4 py-2 text-sm font-medium transition-colors"
        >
          Импорт/Экспорт
        </button>
      </div>
    </div>

    <!-- Контент табов -->
    <div class="px-4 pb-5">
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
        class="mb-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm"
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

      <!-- Билеты -->
      <div v-else-if="activeTab === 'tickets'">
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Список билетов</h3>
        </div>

        <div v-if="tickets.length > 0" class="space-y-3">
          <div
            v-for="ticket in tickets"
            :key="ticket.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h4 class="font-semibold text-gray-900">
                    Билет #{{ ticket.ticket_number }}
                  </h4>
                  <span
                    :class="
                      ticket.is_used
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    "
                    class="text-xs px-2 py-1 rounded-full"
                  >
                    {{ ticket.is_used ? "Использован" : "Активен" }}
                  </span>
                  <span
                    v-if="ticket.prize"
                    class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                  >
                    Приз: {{ ticket.prize }}
                  </span>
                </div>

                <!-- Информация о пользователе -->
                <div v-if="ticket.user" class="space-y-1 mb-3">
                  <div class="text-sm text-gray-600">
                    Пользователь: {{ ticket.user.first_name }}
                    {{ ticket.user.last_name }}
                  </div>
                  <div class="text-sm text-gray-600">
                    @{{ ticket.user.username || "нет username" }}
                  </div>
                  <div class="text-sm text-gray-600">
                    Телефон: {{ ticket.user.phone || "не указан" }}
                  </div>
                </div>

                <!-- Код -->
                <div v-if="ticket.code" class="text-sm">
                  <span class="text-gray-600">Код:</span>
                  <span class="font-mono text-gray-900 ml-2">{{
                    ticket.code.code
                  }}</span>
                </div>
              </div>

              <!-- Информация о датах -->
              <div class="text-xs text-gray-500 text-right">
                <div>Создан: {{ formatDateShort(ticket.created_at) }}</div>
                <div v-if="ticket.used_at">
                  Использован: {{ formatDateShort(ticket.used_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div
            class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span class="text-3xl">🎫</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет билетов</h3>
          <p class="text-sm text-gray-600">Билеты ещё не были добавлены</p>
        </div>
      </div>

      <!-- Призы -->
      <div v-else-if="activeTab === 'prizes'">
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Список призов</h3>
          <div class="flex gap-2">
            <button
              @click="openImportPrizesModal"
              class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Импорт
            </button>
          </div>
        </div>

        <div v-if="prizes.length > 0" class="space-y-3">
          <div
            v-for="prize in prizes"
            :key="prize.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">
                  Билет #{{ prize.ticket_number }}
                </h4>
                <p class="text-sm text-gray-600">
                  Приз:
                  <span class="font-medium text-purple-600">{{
                    prize.prize
                  }}</span>
                </p>
              </div>
              <div class="text-xs text-gray-500">
                Создан: {{ formatDateShort(prize.created_at) }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div
            class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span class="text-3xl">🏆</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет призов</h3>
          <p class="text-sm text-gray-600">Призы ещё не были добавлены</p>
        </div>
      </div>

      <!-- Коды -->
      <div v-else-if="activeTab === 'codes'">
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">
            Свободные коды ({{ unusedCodes.length }})
          </h3>
        </div>

        <div
          v-if="unusedCodes.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
        >
          <div
            v-for="code in unusedCodes"
            :key="code.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div class="text-center">
              <div class="font-mono text-lg font-bold text-gray-900 mb-2">
                {{ code.code }}
              </div>
              <div class="text-xs text-gray-500">
                Создан: {{ formatDateShort(code.created_at) }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div
            class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span class="text-3xl">🔑</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Нет свободных кодов
          </h3>
          <p class="text-sm text-gray-600">
            Все коды использованы или не созданы
          </p>
        </div>
      </div>

      <!-- Импорт/Экспорт -->
      <div v-else-if="activeTab === 'importExport'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Импорт -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Импорт данных
            </h3>

            <!-- Импорт билетов -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Импорт участников из Excel
              </h4>
              <p class="text-xs text-gray-500 mb-3">
                Формат файла: Phone Number | Ticket Number (по одному на строку)
              </p>
              <div class="flex items-center">
                <input
                  ref="ticketsFileInput"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  class="hidden"
                  @change="handleTicketsFileChange"
                />
                <button
                  @click="$refs.ticketsFileInput.click()"
                  class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Выбрать файл
                </button>
              </div>
              <div
                v-if="selectedTicketsFile"
                class="mt-2 text-sm text-gray-600"
              >
                Выбран: {{ selectedTicketsFile.name }}
              </div>
              <button
                v-if="selectedTicketsFile"
                @click="importTicketsExcel"
                :disabled="isImporting"
                class="mt-3 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {{ isImporting ? "Импорт..." : "Загрузить билеты" }}
              </button>
            </div>

            <!-- Импорт призов -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Импорт призов из Excel
              </h4>
              <p class="text-xs text-gray-500 mb-3">
                Формат файла: Ticket Number | Prize (по одному на строку)
              </p>
              <div class="flex items-center">
                <input
                  ref="prizesFileInput"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  class="hidden"
                  @change="handlePrizesFileChange"
                />
                <button
                  @click="$refs.prizesFileInput.click()"
                  class="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Выбрать файл
                </button>
              </div>
              <div v-if="selectedPrizesFile" class="mt-2 text-sm text-gray-600">
                Выбран: {{ selectedPrizesFile.name }}
              </div>
              <button
                v-if="selectedPrizesFile"
                @click="importPrizesExcel"
                :disabled="isImporting"
                class="mt-3 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {{ isImporting ? "Импорт..." : "Загрузить призы" }}
              </button>
            </div>
          </div>

          <!-- Экспорт -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Экспорт данных
            </h3>

            <div class="space-y-4">
              <!-- Экспорт билетов -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">
                  Экспорт участников
                </h4>
                <button
                  @click="openExportTelegramModal('tickets')"
                  :disabled="tickets.length === 0"
                  class="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Telegram
                </button>
              </div>

              <!-- Экспорт призов -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">
                  Экспорт призов
                </h4>
                <button
                  @click="openExportTelegramModal('prizes')"
                  :disabled="prizes.length === 0"
                  class="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Telegram
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальные окна -->
    <LotteryInstructionsModal
      v-if="showInstructionsModal"
      :isOpen="showInstructionsModal"
      @close="showInstructionsModal = false"
    />

    <ConductDrawModal
      v-if="showConductDrawModal"
      :isOpen="showConductDrawModal"
      @close="showConductDrawModal = false"
      @success="onDrawSuccess"
    />

    <SettingsModal
      v-if="showSettingsModal"
      :settings="settings"
      @close="showSettingsModal = false"
      @updated="onSettingsUpdated"
    />

    <GenerateCodesModal
      v-if="showGenerateCodesModal"
      @close="showGenerateCodesModal = false"
      @generated="onCodesGenerated"
    />

    <ExportTelegramModal
      v-if="showExportTelegramModal"
      :exportType="exportType"
      @close="showExportTelegramModal = false"
      @export="handleTelegramExport"
    />
  </div>
</template>

<script>
import { lotteryAPI } from "@/utils/api";
import LotteryInstructionsModal from "@/components/admin/lottery/LotteryInstructionsModal.vue";
import ConductDrawModal from "@/components/admin/lottery/ConductDrawModal.vue";
import SettingsModal from "@/components/admin/lottery/SettingsModal.vue";
import GenerateCodesModal from "@/components/admin/lottery/GenerateCodesModal.vue";
import ExportTelegramModal from "@/components/admin/lottery/ExportTelegramModal.vue";

export default {
  name: "AdminLotteryPage",
  components: {
    LotteryInstructionsModal,
    ConductDrawModal,
    SettingsModal,
    GenerateCodesModal,
    ExportTelegramModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      activeTab: "tickets",

      // Данные
      settings: {
        is_enabled: false,
        total_tickets: 0,
      },
      stats: {
        issuedTickets: 0,
        prizesDistributed: 0,
      },
      tickets: [],
      prizes: [],
      unusedCodes: [],

      // Состояния
      isImporting: false,

      // Файлы
      selectedTicketsFile: null,
      selectedPrizesFile: null,

      // Модальные окна
      showInstructionsModal: false,
      showConductDrawModal: false,
      showSettingsModal: false,
      showGenerateCodesModal: false,
      showExportTelegramModal: false,
      exportType: "tickets",
    };
  },
  computed: {
    lotteryStatus() {
      return this.settings.is_enabled ? "Активна" : "Отключена";
    },
  },
  methods: {
    async loadAllData() {
      try {
        this.isLoading = true;
        this.error = null;

        // Загружаем все данные параллельно
        await Promise.all([
          this.loadSettings(),
          this.loadStats(),
          this.loadTickets(),
          this.loadPrizes(),
          this.loadUnusedCodes(),
        ]);

        console.log("Все данные лотереи загружены");
      } catch (error) {
        console.error("Ошибка при загрузке данных лотереи:", error);
        this.error = error.message || "Не удалось загрузить данные лотереи";
      } finally {
        this.isLoading = false;
      }
    },

    async loadSettings() {
      try {
        const data = await lotteryAPI.getSettings();
        this.settings = data || { is_enabled: false, total_tickets: 0 };
      } catch (error) {
        console.error("Ошибка при загрузке настроек лотереи:", error);
        throw error;
      }
    },

    async loadStats() {
      try {
        const data = await lotteryAPI.getStats();
        this.stats = data || { issuedTickets: 0, prizesDistributed: 0 };
      } catch (error) {
        console.error("Ошибка при загрузке статистики лотереи:", error);
        this.stats = { issuedTickets: 0, prizesDistributed: 0 };
      }
    },

    async loadTickets() {
      try {
        const data = await lotteryAPI.getAllTickets();
        this.tickets = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Ошибка при загрузке билетов:", error);
        this.tickets = [];
      }
    },

    async loadPrizes() {
      try {
        const data = await lotteryAPI.getAllPrizes();
        this.prizes = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Ошибка при загрузке призов:", error);
        this.prizes = [];
      }
    },

    async loadUnusedCodes() {
      try {
        const data = await lotteryAPI.getUnusedCodes();
        // API возвращает { total: 1, codes: [...] }
        this.unusedCodes = data?.codes || [];
        console.log("Неиспользованные коды:", this.unusedCodes);
      } catch (error) {
        console.error("Ошибка при загрузке свободных кодов:", error);
        this.unusedCodes = [];
      }
    },

    // Настройки
    openSettingsModal() {
      this.showSettingsModal = true;
    },

    async onSettingsUpdated() {
      console.log("Настройки обновлены");
      this.showSettingsModal = false;
      await this.loadSettings();
    },

    // Коды
    openGenerateCodesModal() {
      this.showGenerateCodesModal = true;
    },

    async onCodesGenerated() {
      console.log("Коды сгенерированы");
      this.showGenerateCodesModal = false;
      await this.loadUnusedCodes();
    },

    // Розыгрыш
    openConductDrawModal() {
      this.showConductDrawModal = true;
    },

    async onDrawSuccess() {
      console.log("Розыгрыш успешно проведен");
      this.showConductDrawModal = false;

      alert(
        "Розыгрыш успешно проведен! Уведомления отправлены пользователям, результаты отправлены администратору."
      );

      // Обновляем данные
      await Promise.all([
        this.loadSettings(),
        this.loadTickets(),
        this.loadPrizes(),
        this.loadStats(),
      ]);
    },

    // Импорт файлов
    handleTicketsFileChange(event) {
      this.selectedTicketsFile = event.target.files[0];
    },

    handlePrizesFileChange(event) {
      this.selectedPrizesFile = event.target.files[0];
    },

    async importTicketsExcel() {
      if (!this.selectedTicketsFile) {
        alert("Пожалуйста, выберите файл");
        return;
      }

      try {
        this.isImporting = true;
        this.error = null;

        const formData = new FormData();
        formData.append("file", this.selectedTicketsFile);

        await lotteryAPI.importTicketsExcel(formData);

        alert("Билеты успешно импортированы!");
        this.selectedTicketsFile = null;

        // Обновляем данные
        await Promise.all([this.loadTickets(), this.loadStats()]);
      } catch (error) {
        console.error("Ошибка при импорте билетов:", error);
        alert("Ошибка при импорте билетов: " + error.message);
      } finally {
        this.isImporting = false;
      }
    },

    async importPrizesExcel() {
      if (!this.selectedPrizesFile) {
        alert("Пожалуйста, выберите файл");
        return;
      }

      try {
        this.isImporting = true;
        this.error = null;

        const formData = new FormData();
        formData.append("file", this.selectedPrizesFile);

        await lotteryAPI.importPrizesExcel(formData);

        alert("Призы успешно импортированы!");
        this.selectedPrizesFile = null;

        // Обновляем данные
        await this.loadPrizes();
      } catch (error) {
        console.error("Ошибка при импорте призов:", error);
        alert("Ошибка при импорте призов: " + error.message);
      } finally {
        this.isImporting = false;
      }
    },

    openExportTelegramModal(type) {
      this.exportType = type;
      this.showExportTelegramModal = true;
    },

    async handleTelegramExport(adminTelegramId) {
      try {
        this.error = null;

        if (this.exportType === "tickets") {
          await lotteryAPI.exportTicketsTelegram(adminTelegramId);
          alert("Билеты экспортированы и отправлены в Telegram!");
        } else {
          await lotteryAPI.exportPrizesTelegram(adminTelegramId);
          alert("Призы экспортированы и отправлены в Telegram!");
        }

        this.showExportTelegramModal = false;
      } catch (error) {
        console.error("Ошибка при экспорте в Telegram:", error);
        alert("Ошибка при экспорте в Telegram: " + error.message);
      }
    },

    // Утилиты
    formatDateShort(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
      });
    },
  },

  async created() {
    console.log("AdminLotteryPage created");
    await this.loadAllData();
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
