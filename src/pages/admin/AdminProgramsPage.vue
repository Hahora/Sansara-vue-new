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
            📚
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold">Управление программами</h1>
            <p class="text-white text-opacity-90 text-sm mt-1">
              Всего: {{ totalPrograms }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <!-- Кнопка обновления -->
          <button
            @click="loadPrograms"
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

          <!-- Кнопка создания -->
          <button
            @click="openCreateModal"
            class="bg-white hover:bg-opacity-90 text-[#4e5d51] p-3 rounded-lg transition-all active:scale-98 font-semibold flex items-center"
          >
            <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="hidden sm:inline">Создать</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="px-4 py-4 space-y-3">
      <!-- Филиал -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Филиал</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.branch_id = null;
              applyFilters();
            "
            :class="
              filters.branch_id === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все филиалы
          </button>
          <button
            v-for="branch in branches"
            :key="branch.id"
            @click="
              filters.branch_id = branch.id;
              applyFilters();
            "
            :class="
              filters.branch_id === branch.id
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            {{ branch.name }}
          </button>
        </div>
      </div>

      <!-- Тип программы -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Тип программы</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.program_type = null;
              applyFilters();
            "
            :class="
              filters.program_type === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все типы
          </button>
          <button
            @click="
              filters.program_type = 'COLLECTIVE';
              applyFilters();
            "
            :class="
              filters.program_type === 'COLLECTIVE'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Коллективные
          </button>
          <button
            @click="
              filters.program_type = 'AUTHOR';
              applyFilters();
            "
            :class="
              filters.program_type === 'AUTHOR'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Авторские
          </button>
        </div>
      </div>

      <!-- Статус -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Статус</h3>
        <!-- Добавьте эти классы к div ниже -->
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="
              filters.is_active = null;
              applyFilters();
            "
            :class="
              filters.is_active === null
                ? 'bg-[#4e5d51] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Все статусы
          </button>
          <button
            @click="
              filters.is_active = true;
              applyFilters();
            "
            :class="
              filters.is_active === true
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Активные
          </button>
          <button
            @click="
              filters.is_active = false;
              applyFilters();
            "
            :class="
              filters.is_active === false
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Неактивные
          </button>
        </div>
      </div>

      <!-- Сброс фильтров -->
      <div
        v-if="hasActiveFilters"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-gray-700">
            Активные фильтры:
            <span class="text-amber-600 font-semibold">{{
              activeFiltersCount
            }}</span>
          </div>
          <button
            @click="clearAllFilters"
            class="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Сбросить все
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

    <!-- Список программ -->
    <div v-else class="px-4 pb-5">
      <!-- Счётчик -->
      <div class="text-sm text-gray-600 mb-3">
        Найдено: <span class="font-semibold">{{ programs.length }}</span>
      </div>

      <!-- Программы -->
      <div v-if="programs.length > 0" class="space-y-3">
        <div
          v-for="program in programs"
          :key="program.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Цветная полоска -->
          <div
            :class="getTypeColorClass(program.program_type)"
            class="h-1"
          ></div>

          <!-- Медиа программы: фото ИЛИ видео -->
          <div
            class="relative bg-gray-100 overflow-hidden cursor-pointer"
            style="height:140px"
            @click="program.video_url ? previewMedia = { url: getProgramVideoUrl(program.id), type: 'video' } : program.image_url ? previewMedia = { url: getProgramImageUrl(program.id), type: 'photo' } : null"
          >
            <!-- Видео -->
            <video
              v-if="program.video_url"
              :src="getProgramVideoUrl(program.id)"
              class="w-full h-full object-cover pointer-events-none"
              muted preload="metadata"
              @error="e => e.target.style.display='none'"
            />
            <!-- Фото -->
            <img
              v-else-if="program.image_url"
              :src="getProgramImageUrl(program.id)"
              class="w-full h-full object-cover pointer-events-none"
              @error="e => e.target.style.display='none'"
            />
            <!-- Нет медиа -->
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
              </svg>
              <span class="text-xs">Нет медиа</span>
            </div>
            <!-- Тип метка + иконка открытия -->
            <div v-if="program.video_url || program.image_url" class="absolute top-2 left-2 bg-black/50 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
              {{ program.video_url ? '🎬 видео' : '📷 фото' }}
            </div>
            <div v-if="program.video_url || program.image_url" class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
              <div class="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                {{ program.video_url ? '▶ Открыть видео' : '🔍 Открыть фото' }}
              </div>
            </div>
            <!-- Оверлей загрузки медиа -->
            <div
              v-if="isMediaBusy(program.id)"
              class="absolute inset-0 bg-black/65 flex flex-col items-center justify-center z-10"
            >
              <div class="animate-spin rounded-full h-9 w-9 border-[3px] border-white/30 border-t-white mb-2"></div>
              <span class="text-white text-xs font-medium">
                {{ isDeletingMedia(program.id) ? 'Удаление...' : 'Загрузка...' }}
              </span>
            </div>
          </div>

          <div class="p-4">
            <!-- Заголовок -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 class="font-bold text-gray-900 text-base">
                    {{ program.name }}
                  </h3>
                  <span class="text-xs text-gray-500"
                    >ID: {{ program.id }}</span
                  >
                </div>
                <div class="flex items-center gap-2 flex-wrap mt-1">
                  <div
                    :class="getTypeBadgeClass(program.program_type)"
                    class="px-2 py-1 rounded text-xs font-semibold"
                  >
                    {{ getTypeLabel(program.program_type) }}
                  </div>
                  <div
                    :class="
                      program.is_active
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    "
                    class="px-2 py-1 rounded text-xs font-semibold"
                  >
                    {{ program.is_active ? "Активна" : "Неактивна" }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Описание -->
            <p
              v-if="program.short_description"
              class="text-sm text-gray-600 mb-3"
            >
              {{ program.short_description }}
            </p>

            <!-- Pricing Tiers -->
            <div
              v-if="program.pricing_tiers && program.pricing_tiers.length > 0"
              class="mb-3"
            >
              <div class="text-xs font-semibold text-gray-700 mb-2">Цены:</div>
              <div class="space-y-1">
                <div
                  v-for="tier in program.pricing_tiers"
                  :key="tier.id"
                  class="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1.5"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-gray-600">
                      {{
                        tier.min_guests === tier.max_guests
                          ? tier.min_guests +
                            " " +
                            (tier.min_guests % 100 >= 11 &&
                            tier.min_guests % 100 <= 14
                              ? "гостей"
                              : tier.min_guests % 10 === 1
                                ? "гость"
                                : tier.min_guests % 10 >= 2 &&
                                    tier.min_guests % 10 <= 4
                                  ? "гостя"
                                  : "гостей")
                          : `${tier.min_guests}-${tier.max_guests} гостей`
                      }}
                    </span>
                    <span class="text-gray-400">•</span>
                    <span class="text-gray-600"
                      >{{ tier.duration_minutes }} мин</span
                    >
                  </div>
                  <div class="font-semibold text-gray-900">
                    {{ formatPrice(tier.price) }} ₽
                    <span class="text-gray-500 font-normal">
                      {{ tier.price_type === "per_guest" ? "/ чел" : "всего" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="mb-3">
              <div
                class="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1.5"
              >
                ⚠️ Цены не установлены
              </div>
            </div>

            <!-- Детали -->
            <div class="space-y iii2 mb-3">
              <div
                v-if="program.max_participants"
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                  />
                </svg>
                Макс. участников: {{ program.max_participants }}
              </div>

              <div
                v-if="getBranchName(program.branch_id)"
                class="flex items-center text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ getBranchName(program.branch_id) }}
              </div>

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
                {{ formatDateTime(program.created_at) }}
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
              <button
                @click="openEditModal(program)"
                class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                ✏️ Редактировать
              </button>
              <button
                @click="confirmDelete(program)"
                class="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                🗑️ Удалить
              </button>
              <!-- Загрузить фото ИЛИ видео -->
              <label
                :class="isMediaBusy(program.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-amber-100'"
                class="bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-center flex items-center justify-center gap-1"
              >
                <input type="file" accept="image/jpeg,image/png,image/webp,image/*" class="hidden" :disabled="isMediaBusy(program.id)" @change="uploadMedia(program, $event, 'PHOTO')" />
                <span v-if="uploadingMedia[`${program.id}-PHOTO`]" class="inline-block animate-spin mr-1">⏳</span>
                📷 {{ program.image_url ? 'Заменить фото' : 'Загрузить фото' }}
              </label>
              <label
                :class="isMediaBusy(program.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-purple-100'"
                class="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-center flex items-center justify-center gap-1"
              >
                <input type="file" accept="video/mp4,video/webm,video/ogg,video/*" class="hidden" :disabled="isMediaBusy(program.id)" @change="uploadMedia(program, $event, 'VIDEO')" />
                <span v-if="uploadingMedia[`${program.id}-VIDEO`]" class="inline-block animate-spin mr-1">⏳</span>
                🎬 {{ program.video_url ? 'Заменить видео' : 'Загрузить видео' }}
              </label>
              <!-- Удалить текущее медиа -->
              <button
                v-if="program.image_url"
                @click="deleteMedia(program, 'PHOTO')"
                :disabled="isMediaBusy(program.id)"
                class="col-span-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                <span v-if="deletingMedia[`${program.id}-PHOTO`]" class="inline-block animate-spin mr-1">⏳</span>
                🗑️ Удалить фото
              </button>
              <button
                v-if="program.video_url"
                @click="deleteMedia(program, 'VIDEO')"
                :disabled="isMediaBusy(program.id)"
                class="col-span-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                <span v-if="deletingMedia[`${program.id}-VIDEO`]" class="inline-block animate-spin mr-1">⏳</span>
                🗑️ Удалить видео
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Нет программ -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-4xl">📚</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет программ</h3>
        <p class="text-sm text-gray-600">
          {{
            hasActiveFilters
              ? "По выбранным фильтрам программ не найдено"
              : "Программы ещё не созданы"
          }}
        </p>
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="mt-3 text-sm text-[#4e5d51] hover:text-[#3d4a40] font-medium"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>

    <!-- Модальные окна -->
    <CreateProgramModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="onProgramCreated"
    />

    <EditProgramModal
      v-if="editingProgram"
      :program="editingProgram"
      @close="editingProgram = null"
      @saved="onProgramSaved"
    />

    <!-- Полноэкранный просмотр медиа -->
    <div
      v-if="previewMedia"
      class="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center"
      @click.self="previewMedia = null"
    >
      <button
        @click="previewMedia = null"
        class="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-xl z-10"
      >✕</button>
      <video
        v-if="previewMedia.type === 'video'"
        :src="previewMedia.url"
        class="max-w-full max-h-full rounded-lg"
        controls
        autoplay
        style="max-height: 90vh; max-width: 95vw"
      />
      <img
        v-else
        :src="previewMedia.url"
        class="max-w-full max-h-full rounded-lg object-contain"
        style="max-height: 90vh; max-width: 95vw"
      />
    </div>
  </div>
</template>

<script>
import { programAPI } from "@/utils/api";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import CreateProgramModal from "@/components/CreateProgramModal.vue";
import EditProgramModal from "@/components/EditProgramModal.vue";

export default {
  name: "AdminProgramsPage",
  components: {
    CreateProgramModal,
    EditProgramModal,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      programs: [],
      allPrograms: [],
      totalPrograms: 0,
      filters: {
        branch_id: null, // Новый фильтр по филиалу
        program_type: null,
        is_active: null,
      },
      showCreateModal: false,
      editingProgram: null,
      previewMedia: null, // { url, type: 'photo'|'video' }
      uploadingMedia: {}, // ключ: `${programId}-${mediaType}`
      deletingMedia: {},  // ключ: `${programId}-${mediaType}`
    };
  },
  computed: {
    ...mapState(useAppStore, ["branches"]),
    // Проверяем, есть ли активные фильтры
    hasActiveFilters() {
      return (
        this.filters.branch_id !== null ||
        this.filters.program_type !== null ||
        this.filters.is_active !== null
      );
    },
    // Считаем количество активных фильтров
    activeFiltersCount() {
      let count = 0;
      if (this.filters.branch_id !== null) count++;
      if (this.filters.program_type !== null) count++;
      if (this.filters.is_active !== null) count++;
      return count;
    },
  },
  methods: {
    async loadPrograms() {
      try {
        this.isLoading = true;
        this.error = null;

        let programs = [];

        // Сначала пробуем admin endpoint
        try {
          const data = await programAPI.adminGetAll();
          if (Array.isArray(data)) {
            programs = data;
          } else if (data && Array.isArray(data.programs)) {
            programs = data.programs;
          }
        } catch (adminError) {
          console.warn("Admin endpoint не ответил, грузим по подсекциям:", adminError);
        }

        // Если admin endpoint вернул пусто — грузим через публичные подсекции для всех филиалов
        if (programs.length === 0) {
          const branches = this.branches || [];
          const promises = [];
          for (const branch of branches) {
            promises.push(
              programAPI.getCollective(branch.id).catch(() => ({ programs: [] }))
            );
            promises.push(
              programAPI.getAuthor(branch.id).catch(() => ({ programs: [] }))
            );
          }
          const results = await Promise.all(promises);
          const seen = new Set();
          for (const res of results) {
            for (const p of res?.programs || []) {
              if (!seen.has(p.id)) {
                seen.add(p.id);
                programs.push(p);
              }
            }
          }
        }

        this.allPrograms = programs.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        this.totalPrograms = this.allPrograms.length;
        this.applyLocalFilters();
        console.log("Загружено программ:", this.allPrograms.length);
      } catch (error) {
        console.error("Ошибка при загрузке программ:", error);
        this.error = error.message || "Не удалось загрузить программы";
        this.allPrograms = [];
        this.programs = [];
      } finally {
        this.isLoading = false;
      }
    },

    applyLocalFilters() {
      let filtered = this.allPrograms;

      // Фильтр по филиалу
      if (this.filters.branch_id !== null) {
        filtered = filtered.filter(
          (p) => p.branch_id === this.filters.branch_id
        );
      }

      // Фильтр по типу
      if (this.filters.program_type !== null) {
        filtered = filtered.filter(
          (p) => p.program_type === this.filters.program_type
        );
      }

      // Фильтр по статусу
      if (this.filters.is_active !== null) {
        filtered = filtered.filter(
          (p) => p.is_active === this.filters.is_active
        );
      }

      this.programs = filtered;
    },

    applyFilters() {
      this.applyLocalFilters();
    },

    clearAllFilters() {
      this.filters = {
        branch_id: null,
        program_type: null,
        is_active: null,
      };
      this.applyFilters();
    },

    getBranchName(branchId) {
      if (!branchId || !this.branches) return "";
      const branch = this.branches.find((b) => b.id === branchId);
      return branch ? branch.name : "";
    },

    openCreateModal() {
      this.showCreateModal = true;
    },

    openEditModal(program) {
      this.editingProgram = { ...program };
    },

    getProgramImageUrl(programId) {
      return programAPI.getImageUrl(programId);
    },

    getProgramVideoUrl(programId) {
      return programAPI.getVideoUrl(programId);
    },

    isMediaBusy(programId) {
      return ['PHOTO', 'VIDEO'].some(
        t => this.uploadingMedia[`${programId}-${t}`] || this.deletingMedia[`${programId}-${t}`]
      );
    },

    isDeletingMedia(programId) {
      return ['PHOTO', 'VIDEO'].some(t => this.deletingMedia[`${programId}-${t}`]);
    },

    async uploadMedia(program, event, mediaType) {
      const file = event.target.files[0];
      if (!file) return;
      event.target.value = "";

      // Проверка конфликта типов медиа
      if (mediaType === 'VIDEO' && program.image_url) {
        alert('Сначала удалите фото, чтобы загрузить видео.');
        return;
      }
      if (mediaType === 'PHOTO' && program.video_url) {
        alert('Сначала удалите видео, чтобы загрузить фото.');
        return;
      }

      const key = `${program.id}-${mediaType}`;
      this.uploadingMedia = { ...this.uploadingMedia, [key]: true };
      try {
        await programAPI.adminUploadMedia(program.id, file, mediaType);
        await this.loadPrograms();
      } catch (error) {
        console.error(`Ошибка загрузки ${mediaType}:`, error);
        alert(`Не удалось загрузить ${mediaType === 'PHOTO' ? 'фото' : 'видео'}: ` + error.message);
      } finally {
        this.uploadingMedia = { ...this.uploadingMedia, [key]: false };
      }
    },

    async deleteMedia(program, mediaType) {
      const label = mediaType === 'PHOTO' ? 'фото' : 'видео';
      if (!confirm(`Удалить ${label} программы?`)) return;
      const key = `${program.id}-${mediaType}`;
      this.deletingMedia = { ...this.deletingMedia, [key]: true };
      try {
        await programAPI.adminDeleteMedia(program.id, mediaType);
        await this.loadPrograms();
      } catch (error) {
        console.error(`Ошибка удаления ${mediaType}:`, error);
        alert(`Не удалось удалить ${label}: ` + error.message);
      } finally {
        this.deletingMedia = { ...this.deletingMedia, [key]: false };
      }
    },

    async confirmDelete(program) {
      if (!confirm(`Удалить программу "${program.name}"?`)) {
        return;
      }

      try {
        await programAPI.adminDelete(program.id);
        console.log("Программа удалена:", program.id);
        await this.loadPrograms();
      } catch (error) {
        console.error("Ошибка при удалении:", error);
        alert("Не удалось удалить программу: " + error.message);
      }
    },

    async onProgramCreated(newProgram) {
      console.log("Программа создана:", newProgram);
      this.showCreateModal = false;
      await this.loadPrograms();
    },

    async onProgramSaved(updatedProgram) {
      console.log("Программа обновлена:", updatedProgram);
      this.editingProgram = null;
      await this.loadPrograms();
    },

    formatDateTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },

    formatPrice(price) {
      if (!price && price !== 0) return "0";
      const priceNumber = Number(price);
      if (isNaN(priceNumber)) return price;
      return priceNumber.toLocaleString("ru-RU");
    },

    getTypeLabel(type) {
      const labels = {
        COLLECTIVE: "Коллективная",
        AUTHOR: "Авторская",
      };
      return labels[type] || type;
    },

    getTypeColorClass(type) {
      const colors = {
        COLLECTIVE: "bg-blue-500",
        AUTHOR: "bg-purple-500",
      };
      return colors[type] || "bg-gray-500";
    },

    getTypeBadgeClass(type) {
      const classes = {
        COLLECTIVE: "bg-blue-50 text-blue-700 border border-blue-200",
        AUTHOR: "bg-purple-50 text-purple-700 border border-purple-200",
      };
      return classes[type] || "bg-gray-50 text-gray-700 border border-gray-200";
    },
  },

  async created() {
    console.log("AdminProgramsPage created");

    // Загружаем филиалы если не загружены
    const store = useAppStore();
    if (!store.areBranchesLoaded) {
      try {
        await store.loadBranches();
      } catch (error) {
        console.error("Failed to load branches:", error);
      }
    }

    await this.loadPrograms();
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
