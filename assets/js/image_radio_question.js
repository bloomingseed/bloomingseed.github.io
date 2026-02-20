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
    audioState: {
      type: Object,
      required: true
    },
    countdownSeconds: {
      type: Number,
      default: 10
    }
  },
  
  computed: {
    state() {
      return this.audioState[this.audioSrc]
    },
    countdownText() {
      return this.state?.timeLeft === 0
        ? 'Time expired:'
        : 'Time left:'
    }
  },
  mounted() {
    if (!this.audioState[this.audioSrc]) {
      this.audioState[this.audioSrc] = {
        timeLeft: this.countdownSeconds,
        isPlaying: false,
        audioProgress: 0,
        countdownStarted: false,
        timer: null
      }
    }
  },

  emits: ['update:modelValue', 'blur'],

  methods: {
    play() {
      if (!this.state || this.state.timeLeft === 0) return

      if (!this.state.timer) {
        this.startCountdown()
      }

      this.state.isPlaying = true
      this.state.audioProgress = 0

      const audio = this.$refs.audio
      audio.currentTime = 0
      audio.play()
    },

    updateAudioProgress() {
      const audio = this.$refs.audio
      if (!audio.duration) return

      this.state.audioProgress =
        (audio.currentTime / audio.duration) * 100
    },

    onAudioEnded() {
      this.state.isPlaying = false
    },

    startCountdown() {
      if (this.state.timer) return

      this.state.timer = setInterval(() => {
        if (this.state.timeLeft > 0) {
          this.state.timeLeft--
        }

        if (this.state.timeLeft === 0) {
          clearInterval(this.state.timer)
          this.state.timer = null
        }
      }, 1000)
    }
  },

  beforeUnmount() {
    if (this.state?.timer) {
      clearInterval(this.state.timer)
      this.state.timer = null
    }
  },


  template: `
    <div class="qblock mb-4">

    <label class="block text-gray-700 font-bold mb-3 required qtitle">
      {{ label }}
    </label>

    <div class="qbody">
      <!-- AUDIO -->
      <audio
        ref="audio"
        :src="audioSrc"
        @timeupdate="updateAudioProgress"
        @ended="onAudioEnded"
      ></audio>
      <div class="flex flex-wrap items-center gap-3 mb-3">
        <!-- PLAY -->
        <button
          type="button"
          @click="play"
          :disabled="!state || state.isPlaying || state.timeLeft === 0"
          :class="[
            'play-btn flex-shrink-0',
            { locked: state?.timeLeft === 0, playing: state?.isPlaying }
          ]"
        >
          ▶ Play
        </button>
        <!-- PROGRESS -->
        <div class="progress-track flex-1 min-w-[120px] max-w-xs">
          <div
            class="progress-fill audio"
            :class="{ locked: state?.timeLeft === 0 }"
            :style="{ width: (state?.audioProgress || 0) + '%' }"
          ></div>
        </div>
        <!-- TIMER -->
        <div
          class="countdown-text text-sm ml-auto w-full sm:w-auto sm:ml-2 text-left"
          :class="{ expired: state?.timeLeft === 0 }"
        >
          {{ countdownText }} {{ state?.timeLeft ?? countdownSeconds }}s
        </div>
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
      <p v-if="validation.$error" class="text-red-500 text-sm italic mt-2 text-center">
        <span v-if="validation.required.$invalid">
          Please select an option.
        </span>
      </p>
    </div>

  </div>

  `
}
