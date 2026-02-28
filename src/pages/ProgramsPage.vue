<template>
  <div class="min-h-screen bg-[#edeae6] pb-20">
    <!-- Шапка - статичная -->
    <div class="bg-[#202c27] text-white px-5 py-6 relative z-10">
      <div class="flex items-center justify-between mb-4">
        <button @click="$router.go(-1)" class="flex items-center text-white/80 hover:text-white transition-colors">
          <ChevronLeft class="h-6 w-6 mr-1" />
          <span class="font-light">Назад</span>
        </button>
        <div class="relative">
          <button @click.stop="showBranchSelect = !showBranchSelect" class="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-1.5 transition-all duration-200">
            <MapPin class="h-3.5 w-3.5 text-[#c2a886]" />
            <span class="text-white font-medium text-[13px] max-w-[90px] truncate">{{ selectedBranch?.short_name || selectedBranch?.name || "Филиал" }}</span>
            <ChevronDown :class="['h-3.5 w-3.5 text-white/70 transition-transform', showBranchSelect ? 'rotate-180' : '']" />
          </button>
          <div v-if="showBranchSelect" class="fixed inset-0 z-40" @click="showBranchSelect = false" />
          <transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <div v-if="showBranchSelect" class="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 z-50 max-h-72 overflow-y-auto">
              <div class="py-2">
                <p class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Выберите филиал</p>
                <div class="space-y-0.5">
                  <div v-for="branch in allBranches" :key="branch.id" @click="handleSelectBranch(branch)" class="px-4 py-2.5 mx-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all" :class="{ 'bg-[#c2a886]/10 border-l-2 border-[#c2a886]': selectedBranch?.id === branch.id }">
                    <div class="flex items-center gap-2.5">
                      <div class="h-7 w-7 rounded-full bg-[#202c27]/5 flex items-center justify-center flex-shrink-0"><MapPin class="h-3 w-3 text-[#202c27]" /></div>
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-900 text-sm">{{ branch.name }}</div>
                        <div v-if="branch.address" class="text-xs text-gray-500 truncate">{{ branch.address }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="flex items-center">
        <div
          class="w-16 h-16 bg-gradient-to-br from-[#c2a886]/20 to-[#c2a886]/10 rounded-full flex items-center justify-center border-2 border-white/10 backdrop-blur-sm"
        >
          <FileText class="h-8 w-8 text-white" />
        </div>
        <div class="ml-4 flex-1">
          <h1 class="text-2xl font-light tracking-wide">Программы</h1>
          <p class="text-white/70 text-sm mt-1 font-light">
            Наши услуги и предложения
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

    <!-- Программы -->
    <div v-else class="px-5 py-5 space-y-4">
      <!-- Коллективные программы -->
      <div
        class="bg-[#e3ded3] rounded-2xl border border-[#c2a886]/20 overflow-hidden shadow-lg"
      >
        <div
          class="px-5 py-4 bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white"
        >
          <div class="flex items-center">
            <div
              class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3"
            >
              <Users class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1">
              <h2 class="font-semibold text-lg">Коллективные программы</h2>
              <p class="text-white/90 text-sm mt-0.5 font-light">
                Тепло, живой пар, общее действие и единение
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="collectivePrograms.length > 0"
          class="divide-y divide-[#c2a886]/10"
        >
          <div
            v-for="program in collectivePrograms"
            :key="program.id"
            @click="goToCollectiveProgram(program.id)"
            class="px-4 py-3.5 hover:bg-[#d9cebc]/60 transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-[15px]">
                  {{ program.name }}
                </h3>
                <p
                  v-if="program.short_description"
                  class="text-sm text-gray-600 mt-1 line-clamp-2"
                >
                  {{ program.short_description }}
                </p>
              </div>
              <ChevronRight class="h-5 w-5 text-[#c2a886] flex-shrink-0" />
            </div>
          </div>
        </div>
        <div v-else class="px-4 py-8 text-center">
          <Users class="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p class="text-sm text-gray-600">
            Коллективные программы временно недоступны
          </p>
        </div>

        <div class="px-4 py-3 bg-[#d9cebc]/80 border-t border-[#c2a886]/30">
          <router-link
            to="/collective-programs"
            class="text-[#8b6f47] text-sm font-bold hover:text-[#6d5435] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Посмотреть все коллективные программы</span>
            <ChevronRight class="h-4 w-4" />
          </router-link>
        </div>
      </div>

      <!-- Авторские программы -->
      <div
        class="bg-[#e3ded3] rounded-2xl border border-[#c2a886]/20 overflow-hidden shadow-lg"
      >
        <div
          class="px-5 py-4 bg-gradient-to-r from-[#c2a886] to-[#b5976e] text-white"
        >
          <div class="flex items-center">
            <div
              class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3"
            >
              <PenTool class="h-6 w-6 text-white" />
            </div>
            <div class="flex-1">
              <h2 class="font-semibold text-lg">Авторские программы</h2>
              <p class="text-white/90 text-sm mt-0.5 font-light">
                Уникальные техники, глубокие состояния
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="authorPrograms.length > 0"
          class="divide-y divide-[#c2a886]/10"
        >
          <div
            v-for="program in authorPrograms"
            :key="program.id"
            @click="goToAuthorProgram(program.id)"
            class="px-4 py-3.5 hover:bg-[#d9cebc]/60 transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-[15px]">
                  {{ program.name }}
                </h3>
                <p
                  v-if="program.short_description"
                  class="text-sm text-gray-600 mt-1 line-clamp-2"
                >
                  {{ program.short_description }}
                </p>
              </div>
              <ChevronRight class="h-5 w-5 text-[#c2a886] flex-shrink-0" />
            </div>
          </div>
        </div>
        <div v-else class="px-4 py-8 text-center">
          <PenTool class="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p class="text-sm text-gray-600">
            Авторские программы временно недоступны
          </p>
        </div>

        <div class="px-4 py-3 bg-[#d9cebc]/80 border-t border-[#c2a886]/30">
          <router-link
            to="/author-programs"
            class="text-[#8b6f47] text-sm font-bold hover:text-[#6d5435] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Посмотреть все авторские программы</span>
            <ChevronRight class="h-4 w-4" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/appStore";
import { programAPI, branchAPI } from "@/utils/api";
import icons from "@/utils/icons";

export default {
  name: "ProgramsPage",
  components: {
    ...icons,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      allPrograms: [],
      allBranches: [],
      showBranchSelect: false,
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
    ...mapActions(useAppStore, ["selectBranch"]),

    async loadAllBranches() {
      try {
        const branches = await branchAPI.getAll();
        this.allBranches = branches.filter(b => b.is_active !== false);
      } catch {}
    },

    async handleSelectBranch(branch) {
      this.showBranchSelect = false;
      await this.selectBranch(branch);
    },

    async loadPrograms() {
      try {
        this.error = null;

        const branchId = this.selectedBranch?.id;

        if (!branchId) {
          throw new Error("Филиал не выбран");
        }

        console.log("Загрузка программ для филиала:", branchId);

        const response = await programAPI.getAll(branchId, true);

        if (Array.isArray(response)) {
          this.allPrograms = response;
          console.log("Загружено программ:", this.allPrograms.length);
        } else {
          this.allPrograms = [];
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
    await Promise.all([this.loadPrograms(), this.loadAllBranches()]);
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
}
</style>
