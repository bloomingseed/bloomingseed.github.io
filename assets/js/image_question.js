const ImageQuestion = {
  props: {
    label: String,
    imageSrc: String,
    modelValue: String,
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div>
      <label class="block text-gray-700 text-sm font-bold mb-3 required">
        {{ label }}
      </label>

      <!-- Image -->
      <img :src="imageSrc" alt="Question Image" class="mb-4 rounded-lg max-w-full">

      <!-- Answer -->
      <textarea
        class="shadow appearance-none border rounded w-full py-2 px-3
               text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Describe what you see in the picture..."
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      ></textarea>

      <slot name="error"></slot>
    </div>
  `,
};