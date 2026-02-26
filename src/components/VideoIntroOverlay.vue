<script setup>
import { ref, onMounted } from "vue";
import { mediaAPI } from "@/utils/api";

const emit = defineEmits(["done"]);

const videoRef = ref(null);
const progress = ref(0);
const duration = ref(0);
const visible = ref(true);
const videoSrc = ref(null);

function onMetadata() {
  duration.value = videoRef.value?.duration || 0;
}

function onTimeUpdate() {
  if (!videoRef.value || !duration.value) return;
  progress.value = (videoRef.value.currentTime / duration.value) * 100;
}

function onEnded() {
  dismiss();
}

function skip() {
  dismiss();
}

function dismiss() {
  visible.value = false;
  sessionStorage.setItem("intro_shown", "1");
}

onMounted(async () => {
  // Пробуем загрузить видео интро с бэка
  try {
    const data = await mediaAPI.getBySection("INTRO", { media_type: "VIDEO" });
    const items = data?.items || [];
    const active = items.find((i) => i.is_active && i.media_type === "VIDEO");
    if (active) {
      videoSrc.value = mediaAPI.getDownloadUrl(active.id);
    }
  } catch {
    // нет видео — просто зелёный экран
  }

  if (!videoSrc.value) return;

  const v = videoRef.value;
  if (!v) return;
  v.setAttribute("muted", "");
  v.muted = true;
  v.play().catch(() => {});
});
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-700"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    @after-leave="emit('done')"
  >
    <div v-if="visible" class="fixed inset-0 z-[9999] bg-[#202c27] overflow-hidden">

      <!-- Video (только если есть с бэка) -->
      <video
        v-if="videoSrc"
        ref="videoRef"
        class="absolute inset-0 w-full h-full object-cover"
        :src="videoSrc"
        autoplay
        :muted="true"
        playsinline
        preload="auto"
        @loadedmetadata="onMetadata"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
      />

      <!-- Затемнение поверх видео -->
      <div class="absolute inset-0 bg-black/45 pointer-events-none" />

      <!-- Верхний градиент -->
      <div class="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

      <!-- Нижний градиент -->
      <div class="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      <!-- ─── ВЕРХ: логотип ─── -->
      <div class="absolute top-10 inset-x-0 flex flex-col items-center gap-3 pointer-events-none">
        <span class="text-white/95 text-[11px] tracking-[0.4em] font-light uppercase">
          САНСАРА
        </span>
        <div class="flex items-center gap-2">
          <div class="w-8 h-px bg-[#c2a886]/60" />
          <div class="w-1 h-1 rounded-full bg-[#c2a886]/80" />
          <div class="w-8 h-px bg-[#c2a886]/60" />
        </div>
      </div>

      <!-- ─── НИЗ: кнопка + прогресс ─── -->
      <div class="absolute bottom-10 inset-x-6 flex flex-col gap-4">
        <div class="flex justify-end">
          <button
            @click="skip"
            class="flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-[#c2a886]/40 text-white/90 text-sm font-light tracking-wider rounded-full px-4 py-2 active:scale-95 transition-transform duration-150"
          >
            Пропустить
            <svg
              class="w-3.5 h-3.5 text-[#c2a886]"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="h-[2px] bg-white/20 rounded-full overflow-hidden">
          <div
            class="h-full bg-[#c2a886] rounded-full transition-all duration-100 ease-linear"
            :style="{ width: progress + '%' }"
          />
        </div>
      </div>

    </div>
  </Transition>
</template>
