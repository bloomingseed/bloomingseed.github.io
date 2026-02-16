const ImageRadioQuestion = {
  props: {
    label: String,
    options: {
      type: Array, // { value, imageSrc, label }
      required: true
    },
    modelValue: String,
    validation: {
      type: Object,
      default: () => ({ $error: false, required: { $invalid: false } })
    },
    audioSrc: {
      type: String,
      default: ""
    },
    countdownSeconds: {
      type: Number,
      default: 10
    }
  },

  emits: ['update:modelValue', 'blur'],

  data() {
    return {
      isPlaying: false,
      audioProgress: 0,
      timeLeft: this.countdownSeconds,
      countdownTimer: null,
      countdownText: 'Time limit: '
    }
  },

  methods: {
    play() {
      if (this.timeLeft === 0) return

      // Start countdown only once
      if (!this.countdownTimer) {
        this.startCountdown()
      }

      this.isPlaying = true
      this.audioProgress = 0
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.countdownText = 'Time left: '
    },

    updateAudioProgress() {
      const audio = this.$refs.audio
      if (!audio.duration) return

      this.audioProgress =
        (audio.currentTime / audio.duration) * 100
    },

    onAudioEnded() {
      this.isPlaying = false
    },

    startCountdown() {
      this.countdownTimer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        }

        if (this.timeLeft === 0) {
          clearInterval(this.countdownTimer)
          this.countdownTimer = null
        }
      }, 1000)
    }
  },

  beforeUnmount() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },

  template: `
    <div class="qblock mb-4">

      <label class="block text-gray-700 font-bold mb-3 required qtitle">
        <span class="qnumber">Q1. </span>{{ label }}
      </label>

      <!-- AUDIO -->
      <audio
        ref="audio"
        :src="audioSrc"
        @timeupdate="updateAudioProgress"
        @ended="onAudioEnded"
      ></audio>

      <!-- CONTROLS -->
      <div class="flex justify-between gap-3 mb-3">

        <button
          type="button"
          @click="play"
          :disabled="isPlaying || timeLeft === 0"
          :class="[
            'play-btn',
            { locked: timeLeft === 0, playing: isPlaying }
          ]"
        >
          ▶ Play
        </button>

        <div
          class="countdown-text"
          :class="{ expired: timeLeft === 0 }"
        >
          {{ countdownText }} {{ timeLeft }}s
        </div>

      </div>

      <!-- AUDIO PROGRESS BAR -->
      <div class="progress-track">
        <div
          class="progress-fill audio"
          :class="{ locked: timeLeft === 0 }"
          :style="{ width: audioProgress + '%' }"
        ></div>
      </div>

      <!-- IMAGE RADIO OPTIONS -->
      <div class="flex flex-col md:flex-row gap-4 justify-center">

        <label
          v-for="option in options"
          :key="option.value"
          class="flex flex-col items-center mb-2 md:mb-0"
        >

          <div>
            <input
              type="radio"
              :value="option.value"
              :checked="modelValue === option.value"
              @change="$emit('update:modelValue', option.value)"
              @blur="$emit('blur')"
              class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span class="text-center ml-2">
              {{ option.value }}
            </span>
          </div>

          <div class="flex justify-center items-center h-52 px-2 rounded border border-gray-200 shadow-md">
            <img
              :src="option.imageSrc"
              :alt="option.value"
              class="max-h-52 w-auto"
            >
          </div>

        </label>

      </div>

      <p v-if="validation.$error" class="text-red-500 text-sm italic mt-2">
        <span v-if="validation.required.$invalid">
          Please select an option.
        </span>
      </p>

    </div>
  `
}
