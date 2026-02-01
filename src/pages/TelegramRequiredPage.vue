<template>
  <div class="min-h-screen bg-[#edeae6] flex flex-col">
    <!-- Контент -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <!-- Иконка Telegram -->
      <div
        class="h-24 w-24 rounded-full bg-[#e3ded3] flex items-center justify-center mb-6 shadow-lg border border-gray-200/80"
      >
        <svg
          class="h-12 w-12 text-[#0088cc]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
          />
        </svg>
      </div>

      <!-- Текст -->
      <h2 class="text-xl font-semibold text-gray-900 text-center mb-3">
        Откройте через Telegram
      </h2>

      <p
        class="text-sm text-gray-600 text-center leading-relaxed max-w-sm mb-8"
      >
        Это приложение работает только внутри Telegram. Пожалуйста, откройте его
        через нашего бота.
      </p>

      <!-- Кнопка открыть в Telegram -->
      <a
        href="https://t.me/SansaraBanyaBot"
        target="_blank"
        class="w-full max-w-xs bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg active:scale-[0.98]"
      >
        <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
          />
        </svg>
        Открыть в Telegram
      </a>

      <!-- Ссылка на политику -->
      <router-link
        to="/privacy-policy"
        class="mt-6 text-sm text-[#c2a886] hover:text-[#a08968] transition-colors"
      >
        Политика конфиденциальности
      </router-link>
    </div>

    <!-- Футер -->
    <div class="px-6 py-4 text-center">
      <p class="text-xs text-gray-400">
        © {{ new Date().getFullYear() }} Баня Сансара. Все права защищены.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TelegramRequiredPage",
};
</script>
