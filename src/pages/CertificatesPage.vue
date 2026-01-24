<template>
  <div class="min-h-screen bg-gradient-to-b from-rose-50 to-white pb-20">
    <!-- Шапка -->
    <div
      class="bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 text-white px-5 py-6"
    >
      <div class="flex items-center mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white hover:text-rose-100 transition-colors"
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
          class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white border-opacity-30 shadow-lg"
        >
          🎁
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">Подарочные сертификаты</h1>
          <p class="text-white text-opacity-95 text-sm mt-1">
            Подарите заботу, счастье и ресурсное состояние
          </p>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="relative">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-rose-200"
        ></div>
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent absolute top-0 left-0"
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

    <!-- Контент страницы -->
    <div v-else class="px-4 py-5 space-y-5">
      <!-- Список сертификатов -->
      <div v-if="certificates && certificates.length > 0">
        <div class="space-y-4">
          <!-- Карточка сертификата -->
          <div
            v-for="certificate in certificates"
            :key="certificate.id"
            class="bg-gradient-to-br from-white to-rose-50 rounded-2xl shadow-lg border border-rose-200 overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]"
          >
            <!-- Заголовок с градиентом -->
            <div
              class="px-5 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-lg">{{ certificate.title }}</h4>
                  <p
                    v-if="certificate.subtitle"
                    class="text-rose-100 text-sm mt-1"
                  >
                    {{ certificate.subtitle }}
                  </p>
                </div>
                <span class="text-2xl">🎁</span>
              </div>
            </div>

            <div class="p-5 space-y-4">
              <!-- Цена -->
              <div
                v-if="certificate.price"
                class="flex items-center justify-center"
              >
                <div
                  class="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg"
                >
                  <div class="flex items-center">
                    <span class="font-bold text-2xl">{{
                      formatPrice(certificate.price)
                    }}</span>
                    <span class="text-sm ml-2 opacity-90">руб.</span>
                  </div>
                </div>
              </div>

              <!-- Номинал (если отличается от цены) -->
              <div
                v-if="
                  certificate.nominal &&
                  certificate.nominal !== certificate.price
                "
                class="text-center"
              >
                <span class="text-sm text-gray-600"
                  >Номинальная стоимость:</span
                >
                <div class="text-lg font-bold text-gray-900 mt-1">
                  {{ formatPrice(certificate.nominal) }} руб.
                </div>
              </div>

              <!-- Срок действия -->
              <div
                v-if="certificate.validity"
                class="flex items-center justify-center"
              >
                <div
                  class="bg-rose-50 text-rose-800 px-4 py-2 rounded-lg border border-rose-200"
                >
                  <svg
                    class="w-4 h-4 inline mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="font-medium">Срок действия:</span>
                  <span class="ml-2">{{ certificate.validity }}</span>
                </div>
              </div>

              <!-- Описание -->
              <div
                v-if="certificate.description"
                class="bg-white rounded-xl p-4 border border-gray-100"
              >
                <div class="text-sm font-medium text-gray-700 mb-2">
                  Что включает:
                </div>
                <div class="text-gray-600 leading-relaxed">
                  {{ certificate.description }}
                </div>
              </div>

              <!-- Контент (HTML) -->
              <div
                v-if="certificate.content"
                class="prose prose-sm max-w-none bg-white rounded-xl p-4 border border-gray-100"
              >
                <div class="text-sm font-medium text-gray-700 mb-2">
                  Подробности:
                </div>
                <div
                  v-html="formatContent(certificate.content)"
                  class="text-gray-600"
                ></div>
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
                <div class="text-sm font-medium text-gray-700">
                  Преимущества:
                </div>
                <ul class="space-y-2">
                  <li
                    v-for="(feature, index) in certificate.features"
                    :key="index"
                    class="flex items-start"
                  >
                    <svg
                      class="w-5 h-5 text-rose-500 mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-gray-600">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Кнопки действий -->
              <div class="space-y-3 pt-2">
                <!-- Кнопка покупки -->
                <button
                  @click="openCertificateModal(certificate)"
                  class="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg active:scale-98 transform hover:shadow-xl"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Приобрести сертификат
                </button>

                <!-- Кнопка консультации -->
                <button
                  @click="callConsultation"
                  class="w-full bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 border-2 border-rose-200 text-rose-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm active:scale-98"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                    />
                  </svg>
                  Консультация
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Если сертификатов нет -->
      <div
        v-else
        class="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 text-center"
      >
        <div class="text-5xl mb-4">🎁</div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">
          Подарочные сертификаты
        </h3>
        <p class="text-gray-600 mb-4">
          Скоро здесь появится информация о подарочных сертификатах
        </p>
        <div class="inline-flex items-center text-rose-600">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
            />
          </svg>
          <span class="text-sm"
            >Позвоните, чтобы узнать о доступных сертификатах</span
          >
        </div>
      </div>
    </div>

    <!-- Модальное окно покупки сертификата -->
    <div
      v-if="showCertificateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeCertificateModal"
    >
      <div
        class="bg-white rounded-xl w-full max-w-md max-h-[70vh] overflow-y-auto"
      >
        <!-- Заголовок -->
        <div
          class="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-3 rounded-t-xl z-10"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center min-w-0 flex-1">
              <span class="text-2xl mr-2 sm:mr-3 flex-shrink-0">🎁</span>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-base sm:text-lg truncate">
                  Приобретение сертификата
                </h3>
                <p class="text-rose-100 text-xs sm:text-sm truncate">
                  {{ selectedCertificate?.title }}
                </p>
              </div>
            </div>
            <button
              @click="closeCertificateModal"
              class="text-white hover:text-rose-200 ml-2 flex-shrink-0"
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

        <!-- Содержимое -->
        <div class="p-4 sm:p-5 space-y-3 sm:space-y-4 pb-3 sm:pb-4">
          <!-- Проверка заполненности данных профиля -->
          <div
            v-if="!userHasRequiredData"
            class="bg-red-50 border-l-4 border-red-500 rounded-r p-4"
          >
            <div class="flex items-start">
              <svg
                class="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="flex-1">
                <p class="text-sm text-red-800 font-medium mb-1">
                  Недостаточно данных для покупки
                </p>
                <p class="text-xs text-red-600 mb-2">
                  Для покупки необходимо заполнить данные профиля
                </p>
                <button
                  @click="goToProfile"
                  class="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Перейти в профиль →
                </button>
              </div>
            </div>
          </div>

          <!-- Форма покупки (показывается только если данные заполнены) -->
          <div v-if="userHasRequiredData" class="space-y-4">
            <!-- Информация о контактах -->
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div class="flex items-center mb-2">
                <svg
                  class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium text-gray-700 text-sm"
                  >Ваши контактные данные</span
                >
              </div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Имя:</span>
                  <span class="font-medium text-gray-900">{{
                    user?.first_name
                      ? `${user.first_name} ${user.last_name || ""}`.trim()
                      : "Не указано"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Телефон:</span>
                  <span class="font-medium text-gray-900">{{
                    user?.phone || "Не указан"
                  }}</span>
                </div>
              </div>
              <button
                @click="goToProfile"
                class="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Изменить в профиле →
              </button>
            </div>

            <!-- Шаг 1: Выбор типа сертификата -->
            <div class="space-y-3">
              <h4 class="font-semibold text-gray-900">Тип сертификата</h4>
              <div class="space-y-2">
                <!-- Радио кнопки для выбора типа -->
                <label
                  class="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    v-model="purchaseData.certificate_type"
                    value="deposit"
                    class="text-rose-500 focus:ring-rose-500"
                  />
                  <div>
                    <span class="font-medium text-gray-900">На депозит</span>
                    <p class="text-sm text-gray-600">
                      Сертификат на определенную сумму
                    </p>
                  </div>
                </label>

                <label
                  class="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    v-model="purchaseData.certificate_type"
                    value="program"
                    class="text-rose-500 focus:ring-rose-500"
                  />
                  <div>
                    <span class="font-medium text-gray-900">На программу</span>
                    <p class="text-sm text-gray-600">
                      Сертификат на конкретную программу
                    </p>
                  </div>
                </label>

                <!-- Если выбран депозит -->
                <div
                  v-if="purchaseData.certificate_type === 'deposit'"
                  class="space-y-3 mt-3"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Сумма депозита
                    </label>
                    <!-- Пресеты сумм -->
                    <div class="grid grid-cols-3 gap-2 mb-3">
                      <button
                        v-for="preset in depositPresets"
                        :key="preset"
                        @click="purchaseData.amount = preset"
                        :class="[
                          'py-2 px-3 rounded-lg border transition-all',
                          purchaseData.amount === preset
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-rose-300',
                        ]"
                      >
                        {{ formatPrice(preset) }}
                      </button>
                    </div>
                    <!-- Своя сумма -->
                    <div class="relative">
                      <span
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        ₽
                      </span>
                      <input
                        type="number"
                        v-model="customAmount"
                        @input="updateCustomAmount"
                        placeholder="Другая сумма"
                        min="1000"
                        class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <!-- Если выбрана программа -->
                <div
                  v-if="purchaseData.certificate_type === 'program'"
                  class="space-y-3 mt-3"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Выберите программу
                    </label>
                    <select
                      v-model="purchaseData.program_id"
                      @change="onProgramSelect"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="">Выберите программу</option>
                      <option
                        v-for="program in authorPrograms"
                        :key="program.id"
                        :value="program.id"
                      >
                        {{ program.name }} — {{ getProgramPriceRange(program) }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Шаг 2: Выбор формата -->
            <div class="space-y-3">
              <h4 class="font-semibold text-gray-900">Формат сертификата</h4>
              <div class="space-y-2">
                <label
                  class="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div class="flex items-center space-x-3">
                    <input
                      type="radio"
                      v-model="purchaseData.format"
                      value="electronic"
                      class="text-rose-500 focus:ring-rose-500"
                    />
                    <div>
                      <span class="font-medium text-gray-900">Электронный</span>
                      <p class="text-sm text-gray-600">
                        Отправим на email или в Telegram
                      </p>
                    </div>
                  </div>
                  <span class="font-medium text-gray-900">Бесплатно</span>
                </label>

                <label
                  class="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div class="flex items-center space-x-3">
                    <input
                      type="radio"
                      v-model="purchaseData.format"
                      value="printed"
                      class="text-rose-500 focus:ring-rose-500"
                    />
                    <div>
                      <span class="font-medium text-gray-900">Печатный</span>
                      <p class="text-sm text-gray-600">
                        Красивый подарочный сертификат
                      </p>
                    </div>
                  </div>
                  <span class="font-medium text-gray-900">+500 руб.</span>
                </label>
              </div>
            </div>

            <!-- Шаг 3: Данные получателя -->
            <div class="space-y-3">
              <h4 class="font-semibold text-gray-900">Данные получателя</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Имя получателя *
                </label>
                <input
                  type="text"
                  v-model="purchaseData.recipient_name"
                  placeholder="Имя человека, кому дарите сертификат"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Итоговая сумма -->
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-700">Стоимость сертификата:</span>
                  <span class="font-medium text-gray-900">
                    {{ getCertificateAmountLabel() }}
                  </span>
                </div>
                <div
                  v-if="purchaseData.format === 'printed'"
                  class="flex justify-between items-center"
                >
                  <span class="text-gray-700">Печатный формат:</span>
                  <span class="font-medium text-gray-900">+500 руб.</span>
                </div>
                <div
                  class="pt-2 border-t border-gray-300 flex justify-between items-center"
                >
                  <span class="font-bold text-gray-900">Итого:</span>
                  <span class="font-bold text-lg text-gray-900">
                    {{ getTotalAmountLabel() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Кнопка отправки -->
            <button
              @click="submitCertificatePurchase"
              :disabled="!isFormValid || isSubmitting"
              class="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              <svg
                v-if="isSubmitting"
                class="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span class="text-sm sm:text-base">{{
                isSubmitting ? "Отправка..." : "Оформить покупку"
              }}</span>
            </button>

            <p class="text-xs text-gray-500 text-center px-2">
              После оплаты сертификат будет отправлен вам в течение 24 часов
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { programAPI, certificateAPI, branchAPI } from "@/utils/api";

export default {
  name: "CertificatePage",
  data() {
    return {
      isLoading: false,
      error: null,
      certificates: [],
      allBranches: [], // Все филиалы из API

      // Модальное окно покупки
      showCertificateModal: false,
      selectedCertificate: null,
      isSubmitting: false,

      // Данные для покупки
      purchaseData: {
        certificate_type: "deposit",
        format: "electronic",
        amount: 5000,
        program_id: null,
        recipient_name: "",
        buyer_name: "",
        buyer_phone: "",
      },

      customAmount: "",
      depositPresets: [3000, 5000, 10000, 15000, 20000, 30000],

      // Консультация
      isCalling: false,

      // Авторские программы для выбора
      authorPrograms: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch", "contentData", "user"]),

    // Текущий филиал с актуальными данными
    currentBranch() {
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

      console.log("Используем филиал из store:", this.selectedBranch);
      return this.selectedBranch;
    },

    // Телефон филиала для консультации
    branchPhoneNumber() {
      if (!this.currentBranch) {
        console.log("Нет currentBranch для получения телефона");
        return null;
      }

      const phone = this.currentBranch.phone;
      console.log(
        "Телефон филиала для консультации:",
        phone,
        "для филиала:",
        this.currentBranch.name
      );
      return phone;
    },

    // Telegram филиала
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

    // Проверка наличия данных пользователя
    userHasRequiredData() {
      const hasPhone = this.user?.phone;
      const hasName = this.user?.first_name;

      console.log("userHasRequiredData check:", {
        user: this.user,
        hasName,
        hasPhone,
        result: !!(hasName && hasPhone),
      });

      return !!(hasName && hasPhone);
    },

    // Валидация формы
    isFormValid() {
      return (
        this.userHasRequiredData &&
        this.purchaseData.certificate_type &&
        this.purchaseData.format &&
        this.purchaseData.recipient_name.trim() &&
        ((this.purchaseData.certificate_type === "deposit" &&
          this.purchaseData.amount > 0) ||
          (this.purchaseData.certificate_type === "program" &&
            this.purchaseData.program_id))
      );
    },
  },
  methods: {
    ...mapActions(useAppStore, ["loadSiteContent", "makeApiRequest"]),

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

    // Переход в профиль
    goToProfile() {
      this.closeCertificateModal();
      this.$router.push("/profile");
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
      if (!price && price !== 0) return "0";

      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;

      return priceNumber.toLocaleString("ru-RU");
    },

    // Загрузка сертификатов из API
    async loadCertificates() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("Загрузка подарочных сертификатов");

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
      } finally {
        this.isLoading = false;
      }
    },

    // Загрузка авторских программ через правильный API
    async loadAuthorPrograms() {
      try {
        const branchId = this.currentBranch?.id || this.selectedBranch?.id;
        if (!branchId) {
          console.log(
            "Филиал не выбран, пропускаем загрузку авторских программ"
          );
          return;
        }

        console.log("Загрузка авторских программ для филиала:", branchId);

        // Используем правильный API метод как на странице авторских программ
        const data = await programAPI.getAuthor(branchId);

        if (data && Array.isArray(data.programs)) {
          this.authorPrograms = data.programs
            .filter((program) => program.is_active !== false)
            .map((program) => ({
              ...program,
              price: this.getProgramPrice(program),
            }));

          console.log(
            "Загружено авторских программ:",
            this.authorPrograms.length
          );
        } else {
          this.authorPrograms = [];
          console.log("Авторские программы не найдены");
        }
      } catch (error) {
        console.error("Ошибка при загрузке авторских программ:", error);
        this.authorPrograms = [];
      }
    },

    // Получение цены программы (берем минимальную цену из pricing_tiers)
    getProgramPrice(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        return 0;
      }
      const activeTiers = program.pricing_tiers.filter(
        (tier) => tier.is_active !== false
      );
      if (activeTiers.length === 0) return 0;

      // Находим минимальную цену среди активных тиров
      const minPrice = Math.min(...activeTiers.map((tier) => tier.price));
      return minPrice;
    },

    // Получение диапазона цен программы для отображения
    getProgramPriceRange(program) {
      if (!program.pricing_tiers || program.pricing_tiers.length === 0) {
        return "Цена не указана";
      }

      const activeTiers = program.pricing_tiers.filter(
        (tier) => tier.is_active !== false
      );
      if (activeTiers.length === 0) return "Цена не указана";

      const prices = activeTiers.map((tier) => tier.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return `${this.formatPrice(minPrice)} руб.`;
      } else {
        return `${this.formatPrice(minPrice)} - ${this.formatPrice(maxPrice)} руб.`;
      }
    },

    // Позвонить для консультации (использует телефон филиала)
    async callConsultation() {
      // Предотвращаем двойное срабатывание
      if (this.isCalling) return;

      this.isCalling = true;

      try {
        console.log("=== callConsultation вызван ===");
        console.log("Текущий филиал:", this.currentBranch);
        console.log("Номер телефона филиала:", this.branchPhoneNumber);

        const phoneNumber = this.branchPhoneNumber;

        if (!phoneNumber) {
          // Показываем все доступные филиалы с телефонами
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

        // В Telegram Mini App
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
          // В обычном браузере
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

    // Открыть Telegram филиала для консультации
    async openTelegramConsultation() {
      try {
        console.log("=== openTelegramConsultation вызван ===");
        console.log("Текущий филиал:", this.currentBranch);
        console.log("TG URL филиала:", this.branchTelegramUrl);

        if (!this.branchTelegramUrl) {
          // Показываем все доступные филиалы с TG
          const branchesWithTg = this.allBranches.filter((b) => b.tg_username);
          if (branchesWithTg.length > 0) {
            const branchList = branchesWithTg
              .map((b) => `${b.name}: @${b.tg_username.replace("@", "")}`)
              .join("\n");

            this.showErrorPopup(
              `У текущего филиала нет Telegram.\n\nДругие филиалы с Telegram:\n${branchList}`
            );
          } else {
            this.showErrorPopup(
              "У этого филиала нет указанного Telegram для консультации"
            );
          }
          return;
        }

        // В Telegram Mini App
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.openTelegramLink(this.branchTelegramUrl);
        } else {
          // В обычном браузере
          window.open(this.branchTelegramUrl, "_blank");
        }
      } catch (error) {
        console.error("Ошибка при открытии Telegram:", error);
        alert("Ошибка при открытии Telegram");
      }
    },

    // Показать попап с ошибкой
    showErrorPopup(message) {
      console.log("Показываем ошибку:", message);
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(message);
      } else {
        alert(message);
      }
    },

    // Открыть модальное окно покупки с проверкой данных
    async openCertificateModal(certificate) {
      this.selectedCertificate = certificate;

      // Получаем данные из user
      const buyerName = this.user?.first_name
        ? `${this.user.first_name} ${this.user.last_name || ""}`.trim()
        : "";

      const buyerPhone = this.user?.phone || "";

      console.log("openCertificateModal - данные пользователя:", {
        user: this.user,
        buyerName,
        buyerPhone,
        userHasRequiredData: this.userHasRequiredData,
      });

      // Сбрасываем форму с автозаполнением
      this.purchaseData = {
        certificate_type: "deposit",
        format: "electronic",
        amount: 5000,
        program_id: null,
        recipient_name: "",
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
      };

      this.customAmount = "";
      this.showCertificateModal = true;

      // Загружаем авторские программы для выбора
      await this.loadAuthorPrograms();
    },

    // Закрыть модальное окно
    closeCertificateModal() {
      this.showCertificateModal = false;
      this.selectedCertificate = null;
      this.isSubmitting = false;
    },

    // Обновить свою сумму
    updateCustomAmount() {
      const amount = parseInt(this.customAmount);
      if (!isNaN(amount) && amount > 0) {
        this.purchaseData.amount = amount;
      }
    },

    // Обработка выбора программы
    onProgramSelect() {
      if (this.purchaseData.program_id) {
        const program = this.authorPrograms.find(
          (p) => p.id === this.purchaseData.program_id
        );
        if (program) {
          this.purchaseData.amount = program.price;
        }
      }
    },

    // Получить сумму сертификата
    getCertificateAmount() {
      if (this.purchaseData.certificate_type === "program") {
        const program = this.authorPrograms.find(
          (p) => p.id === this.purchaseData.program_id
        );
        return program ? program.price : 0;
      }
      return this.purchaseData.amount || 0;
    },

    // Получить итоговую сумму
    getTotalAmount() {
      let total = this.getCertificateAmount();
      if (this.purchaseData.format === "printed") {
        total += 500;
      }
      return total;
    },

    // Получить текст стоимости сертификата с "от" если нужно
    getCertificateAmountLabel() {
      const amount = this.getCertificateAmount();

      if (
        this.purchaseData.certificate_type === "program" &&
        this.purchaseData.program_id
      ) {
        const program = this.authorPrograms.find(
          (p) => p.id === this.purchaseData.program_id
        );

        if (
          program &&
          program.pricing_tiers &&
          program.pricing_tiers.length > 0
        ) {
          const activeTiers = program.pricing_tiers.filter(
            (tier) => tier.is_active !== false
          );

          if (activeTiers.length > 0) {
            const prices = activeTiers.map((tier) => tier.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            if (minPrice !== maxPrice) {
              return `от ${this.formatPrice(amount)} руб.`;
            }
          }
        }
      }

      return `${this.formatPrice(amount)} руб.`;
    },

    // Получить текст итоговой суммы с "от" если нужно
    getTotalAmountLabel() {
      const total = this.getTotalAmount();

      if (
        this.purchaseData.certificate_type === "program" &&
        this.purchaseData.program_id
      ) {
        const program = this.authorPrograms.find(
          (p) => p.id === this.purchaseData.program_id
        );

        if (
          program &&
          program.pricing_tiers &&
          program.pricing_tiers.length > 0
        ) {
          const activeTiers = program.pricing_tiers.filter(
            (tier) => tier.is_active !== false
          );

          if (activeTiers.length > 0) {
            const prices = activeTiers.map((tier) => tier.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            if (minPrice !== maxPrice) {
              return `от ${this.formatPrice(total)} руб.`;
            }
          }
        }
      }

      return `${this.formatPrice(total)} руб.`;
    },

    // Отправка покупки сертификата через правильный API
    async submitCertificatePurchase() {
      try {
        if (!this.isFormValid) {
          alert("Пожалуйста, заполните все обязательные поля");
          return;
        }

        if (!this.userHasRequiredData) {
          alert("Заполните данные профиля для покупки");
          return;
        }

        this.isSubmitting = true;

        // Получаем данные из user
        const buyerName = this.user?.first_name
          ? `${this.user.first_name} ${this.user.last_name || ""}`.trim()
          : "";

        const buyerPhone = this.user?.phone || "";
        const userId = this.user?.id || 0;
        const username = this.user?.username || null;

        // Подготовка данных согласно API
        const requestData = {
          user_id: userId,
          certificate_type: this.purchaseData.certificate_type,
          format: this.purchaseData.format,
          amount: this.getCertificateAmount(),
          recipient_name: this.purchaseData.recipient_name.trim(),
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
        };

        // Добавляем username только если он есть (опционально)
        if (username) {
          requestData.username = username;
        }

        // Добавляем program_id только если выбрана программа
        if (
          this.purchaseData.certificate_type === "program" &&
          this.purchaseData.program_id
        ) {
          requestData.program_id = this.purchaseData.program_id;
        }

        console.log("Отправка данных покупки сертификата:", requestData);

        // Используем правильный API метод
        const response = await certificateAPI.purchase(requestData);

        if (response) {
          console.log("Сертификат оформлен:", response);
          alert(
            "Заявка на сертификат успешно отправлена! Мы свяжемся с вами для подтверждения."
          );
          this.closeCertificateModal();
        } else {
          throw new Error("Ошибка при оформлении покупки");
        }
      } catch (error) {
        console.error("Ошибка при покупке сертификата:", error);
        alert(
          error.message ||
            "Произошла ошибка. Пожалуйста, попробуйте еще раз или позвоните нам."
        );
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  async created() {
    console.log("CertificatePage created");

    try {
      // Загружаем список филиалов для получения актуальных данных
      await this.loadAllBranches();

      // Загружаем сертификаты
      await this.loadCertificates();

      console.log("Страница подарочных сертификатов загружена успешно");
      console.log("Данные пользователя:", this.user);
      console.log("Текущий филиал:", this.currentBranch);
      console.log("Телефон филиала для консультации:", this.branchPhoneNumber);
    } catch (error) {
      console.error("Ошибка при загрузке страницы сертификатов:", error);
      this.error = "Ошибка при загрузке страницы";
    }
  },

  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log("Перезагружаем сертификаты для филиала:", newBranchId);
        this.loadCertificates();
      },
    },

    // Следим за обновлением данных пользователя
    user: {
      handler(newUser) {
        console.log("Данные пользователя обновлены:", newUser);
        if (newUser && this.showCertificateModal) {
          // Обновляем данные в форме если модальное окно открыто
          const buyerName = newUser.first_name
            ? `${newUser.first_name} ${newUser.last_name || ""}`.trim()
            : "";
          this.purchaseData.buyer_name = buyerName;
          this.purchaseData.buyer_phone = newUser.phone || "";
        }
      },
      immediate: true,
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

/* Анимация hover для карточек */
.transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* ✅ ИСПРАВЛЕНИЕ: Меньшая высота модального окна */
.max-h-\[70vh\] {
  max-height: 70vh;
}

/* ИСПРАВЛЕНИЕ: Цвет курсора в полях ввода */
input,
textarea,
select {
  caret-color: #f43f5e; /* Розовый цвет как у вашей темы */
  color: #111827; /* Темный цвет текста */
}

input::placeholder,
textarea::placeholder {
  color: #9ca3af; /* Серый цвет плейсхолдера */
}

/* Убираем белую полоску при фокусе */
input:focus,
textarea:focus,
select:focus {
  outline: none;
}

/* Убираем стандартную подсветку браузера */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: none;
}

/* Улучшаем кликабельность кнопок на мобильных */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Предотвращаем zoom при фокусе на input на iOS */
@media screen and (max-width: 640px) {
  input[type="text"],
  input[type="number"],
  textarea {
    font-size: 16px; /* iOS не зумит если размер >= 16px */
  }
}

.overflow-y-auto {
  overflow-y: auto;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Стили для радио кнопок */
input[type="radio"] {
  width: 1.25rem;
  height: 1.25rem;
}

/* Стиль для активной пресеты суммы */
.bg-rose-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(244 63 94 / var(--tw-bg-opacity));
}
</style>
