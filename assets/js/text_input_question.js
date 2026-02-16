const TextInputQuestion = {
  props: {
    label: {
      type: String,
      default: "Question:"
    },
    placeholder: {
      type: String,
      default: "Enter your answer here"
    },
    id: {
      type: String,
      default: "textInput"
    },
    modelValue: {
      type: String,
      default: ""
    },
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

      <label :for="id" class="block text-gray-700 font-bold mb-2 required qtitle">
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

      <!-- TEXT INPUT -->
      <input
        type="text"
        :placeholder="placeholder"
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full border-0 border-b border-gray-300 px-0 py-2 bg-transparent focus:outline-none focus:border-blue-500 focus:ring-0 transition duration-200"
        @blur="$emit('blur')"
      />

      <p v-if="validation.$error" class="text-red-500 text-sm italic">
        <span v-if="validation.required.$invalid">
          This field is required.
        </span>
        <span v-if="validation.minLength && validation.minLength.$invalid">
          Must be at least 3 characters.
        </span>
      </p>

    </div>
  `
}
