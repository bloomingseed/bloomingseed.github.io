const TextInputQuestion = {
  props: {
    label: {
      type: String,
      default: "Question:"
    },
    placeholder: {
      type: String,
      default: "Điền câu trả lời của bạn ở đây"
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
      default: 6
    },
    audioState: {               // ✅ NEW
      type: Object,
      required: true
    },
    caseNormalization: {
      type: String,
      default: "lowercase"
    },
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
    normalizeText(text) {
      if (!text) return ""; // Handle null or undefined input

      // 1. Trim whitespace from both ends
      let trimmedText = text.trim();

      // 2. Normalize case
      let caseNormText = trimmedText.toLowerCase();
      if(this.caseNormalization === 'uppercase')
        caseNormText = caseNormText.toUpperCase();

      // 3. Replace multiple spaces with a single space
      let singleSpacedText = caseNormText.replace(/\s+/g, ' ');

      return singleSpacedText;
    },

    handleBlur(e) {
      const normalizedText = this.normalizeText(e.target.value)

      // update visual text
      e.target.value = normalizedText

      // update v-model
      this.$emit('update:modelValue', normalizedText)

      // notify parent (this triggers vuelidate $touch())
      this.$emit('blur')
    },
    
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

      <label :for="id" class="block text-gray-700 font-bold mb-2 required qtitle">
        {{ label }}
      </label>

      <div class="qbody">
        <!-- AUDIO SECTION (only if audioSrc exists) -->
        <template v-if="audioSrc">
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
        </template>
          <!-- TEXT INPUT -->
          <input
              type="text"
              :placeholder="placeholder"
              :id="id"
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
              class="w-full border-0 border-b border-gray-300 px-0 py-2 bg-transparent focus:outline-none focus:border-blue-500 focus:ring-0 transition duration-200"
              @blur="handleBlur"
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

    </div>
  `
}