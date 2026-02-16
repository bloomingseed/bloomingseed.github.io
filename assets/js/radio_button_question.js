const RadioButtonQuestion = {
  props: {
    label: {
      type: String,
      default: "Question:"
    },
    options: {
      type: Array,
      default: () => [
        { value: "Option 1", label: "Option 1" },
        { value: "Option 2", label: "Option 2" }
      ]
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
    },
    audioState: {                // ✅ NEW
      type: Object,
      required: true
    }
  },

  emits: ['update:modelValue', 'blur'],

  computed: {
    audioKey() {
      return this.audioSrc
    },
    state() {
      return this.audioState[this.audioKey]
    },
    countdownText() {
      return this.state?.timeLeft === 0
        ? 'Time expired:'
        : 'Time left:'
    }
  },

  mounted() {
    if (!this.audioState[this.audioKey]) {
      this.audioState[this.audioKey] = {
        timeLeft: this.countdownSeconds,
        isPlaying: false,
        audioProgress: 0,
        timer: null
      }
    }
  },

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
      if (this.state) {
        this.state.isPlaying = false
      }
    },

    startCountdown() {
      if (!this.state || this.state.timer) return

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

      <label class="block text-gray-700 font-bold mb-2 required qtitle">
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
          :disabled="!state || state.isPlaying || state.timeLeft === 0"
          :class="[
            'play-btn',
            { 
              locked: state?.timeLeft === 0,
              playing: state?.isPlaying
            }
          ]"
        >
          ▶ Play
        </button>

        <div
          class="countdown-text"
          :class="{ expired: state?.timeLeft === 0 }"
        >
          {{ countdownText }} {{ state?.timeLeft ?? countdownSeconds }}s
        </div>

      </div>

      <!-- AUDIO PROGRESS BAR -->
      <div class="progress-track">
        <div
          class="progress-fill audio"
          :class="{ locked: state?.timeLeft === 0 }"
          :style="{ width: (state?.audioProgress || 0) + '%' }"
        ></div>
      </div>

      <!-- RADIO OPTIONS -->
      <div
        v-for="option in options"
        :key="option.value"
        class="flex items-center mb-2"
      >
        <input
          type="radio"
          :id="'radio-' + option.value"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          class="mr-2 leading-tight"
          @blur="$emit('blur')"
        />
        <label
          :for="'radio-' + option.value"
          class="text-gray-700"
        >
          {{ option.label }}
        </label>
      </div>

      <p v-if="validation.$error" class="text-red-500 text-sm italic">
        <span v-if="validation.required.$invalid">
          Please select an option.
        </span>
      </p>

    </div>
  `
}
