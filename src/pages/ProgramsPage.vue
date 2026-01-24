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
          class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white border-opacity-30 shadow-lg"
        >
          📋
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-bold">Программы</h1>
          <p class="text-white text-opacity-95 text-sm mt-1">
            Наши услуги и предложения
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

    <!-- Программы -->
    <div v-else class="px-4 py-5 space-y-4">
      <!-- Коллективные программы -->
      <div
        class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-200 overflow-hidden"
      >
        <div
          class="px-5 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-2xl mr-3">👥</span>
              <div>
                <h2 class="font-bold text-lg">Коллективные программы</h2>
                <p class="text-green-100 text-sm mt-1">
                  Тепло, живой пар, общее действие и единение
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="collectivePrograms.length > 0"
          class="divide-y divide-gray-100"
        >
          <div
            v-for="program in collectivePrograms"
            :key="program.id"
            @click="goToCollectiveProgram(program.id)"
            class="px-4 py-3 hover:bg-green-50 transition-colors cursor-pointer active:scale-98"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ program.name }}</h3>
                <p
                  v-if="program.short_description"
                  class="text-sm text-gray-600 mt-1 line-clamp-2"
                >
                  {{ program.short_description }}
                </p>
              </div>
              <svg
                class="w-5 h-5 text-gray-400 ml-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
        <div v-else class="px-4 py-6 text-center">
          <p class="text-sm text-gray-500">
            Коллективные программы временно недоступны
          </p>
        </div>

        <div class="px-4 py-3 bg-green-50 border-t border-green-200">
          <router-link
            to="/collective-programs"
            class="text-green-700 text-sm font-semibold hover:text-green-800 transition-colors flex items-center"
          >
            Посмотреть все программы
            <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Авторские программы -->
      <div
        class="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border border-amber-200 overflow-hidden"
      >
        <div
          class="px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-2xl mr-3">✨</span>
              <div>
                <h2 class="font-bold text-lg">Авторские программы</h2>
                <p class="text-amber-100 text-sm mt-1">
                  Уникальные техники, глубокие состояния
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="authorPrograms.length > 0" class="divide-y divide-gray-100">
          <div
            v-for="program in authorPrograms"
            :key="program.id"
            @click="goToAuthorProgram(program.id)"
            class="px-4 py-3 hover:bg-amber-50 transition-colors cursor-pointer active:scale-98"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ program.name }}</h3>
                <p
                  v-if="program.short_description"
                  class="text-sm text-gray-600 mt-1 line-clamp-2"
                >
                  {{ program.short_description }}
                </p>
              </div>
              <svg
                class="w-5 h-5 text-gray-400 ml-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
        <div v-else class="px-4 py-6 text-center">
          <p class="text-sm text-gray-500">
            Авторские программы временно недоступны
          </p>
        </div>

        <div class="px-4 py-3 bg-amber-50 border-t border-amber-200">
          <router-link
            to="/author-programs"
            class="text-amber-700 text-sm font-semibold hover:text-amber-800 transition-colors flex items-center"
          >
            Смотреть авторские программы
            <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { programAPI } from "@/utils/api";

export default {
  name: "ProgramsPage",
  data() {
    return {
      isLoading: false,
      error: null,
      allPrograms: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectedBranch"]),

    collectivePrograms() {
      return this.allPrograms.filter(
        (program) =>
          program.program_type === "COLLECTIVE" && program.is_active !== false
      );
    },

    authorPrograms() {
      return this.allPrograms.filter(
        (program) =>
          program.program_type === "AUTHOR" && program.is_active !== false
      );
    },
  },
  methods: {
    async loadPrograms() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log("selectedBranch:", this.selectedBranch);
        const branchId = this.selectedBranch?.id;
        console.log("branchId для запроса:", branchId, typeof branchId);

        if (!branchId) {
          throw new Error("Филиал не выбран");
        }

        console.log("Загрузка программ для филиала:", branchId);
        console.log("Вызов: programAPI.getAll(", branchId, ", true)");

        // Используем метод из api.js с параметрами branch_id и short=true
        const response = await programAPI.getAll(branchId, true);

        console.log("Ответ API:", response);

        if (Array.isArray(response)) {
          this.allPrograms = response;
          console.log("Загружено программ:", this.allPrograms.length);
        } else {
          this.allPrograms = [];
          console.log("Программы не найдены");
        }
      } catch (error) {
        console.error("Ошибка при загрузке программ:", error);
        this.error =
          error.message || "Не удалось загрузить информацию о программах";
        this.allPrograms = [];
      } finally {
        this.isLoading = false;
      }
    },

    goToCollectiveProgram(programId) {
      this.$router.push({
        name: "CollectiveProgramDetail",
        params: { id: programId },
      });
    },

    goToAuthorProgram(programId) {
      this.$router.push({
        name: "AuthorProgramDetail",
        params: { id: programId },
      });
    },
  },
  async created() {
    console.log("ProgramsPage created");
    await this.loadPrograms();
  },

  watch: {
    "selectedBranch.id": {
      handler(newBranchId) {
        console.log("Перезагружаем программы для филиала:", newBranchId);
        this.loadPrograms();
      },
    },
  },
};
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
