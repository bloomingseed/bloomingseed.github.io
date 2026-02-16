document.addEventListener('DOMContentLoaded', function() {
    const RatingQuestion = {
        props: {
            label: {
                type: String,
                default: "Rate this:"
            },
            range: {
                type: Number,
                default: 5
            },
            iconType: {
                type: String,
                default: "star"
            },
            modelValue: {
                type: Number,
                default: 0
            }
        },
        emits: ['change'],
        setup(props, { emit }) {
            const rating = ref(props.modelValue);
            const hoverRating = ref(0);

            const icons = {
                star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>`,
                heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.248C11.384 3.584 10.632 3 9.744 3C8.112 3 7 4.112 7 5.744C7 7.584 8.712 9.328 12 12.576C15.288 9.328 17 7.584 17 5.744C17 4.112 15.888 3 14.256 3C13.368 3 12.616 3.584 12 4.248Z"/></svg>`,
                smile: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 14C9 12.8954 9.89543 12 11 12H13C14.1046 12 15 12.8954 15 14H9ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9ZM17 9C17 7.89543 16.1046 7 15 7C13.8954 7 13 7.89543 13 9C13 10.1046 13.8954 11 15 11C16.1046 11 17 10.1046 17 9Z"/></svg>`,
                check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2.01 6.48 2.01 12S6.48 22 12 22s9.99-4.48 9.99-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
                thumbsup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23 11H17V3H7v8H1v10h7v-5h8v5h7V11z"/></svg>`,
            };

            const handleClick = (value) => {
                rating.value = value;
                emit('change', value);
            };

            const handleHover = (value) => {
                hoverRating.value = value;
            };

            const handleMouseLeave = () => {
                hoverRating.value = 0;
            };

            return {
                rating,
                hoverRating,
                icons,
                handleClick,
                handleHover,
                handleMouseLeave,
            };
        },
        template: `
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">{{ label }}</label>
                <div class="flex items-center">
                <button
                    v-for="value in range"
                    :key="value"
                    class="p-1 text-gray-500 focus:outline-none"
                    @click="handleClick(value)"
                    @mouseenter="handleHover(value)"
                    @mouseleave="handleMouseLeave"
                >
                    <span v-html="icons[iconType] && (value <= (hoverRating || rating) ? icons[iconType].replace('currentColor', 'yellow') : icons[iconType]) || icons['star']"></span>
                </button>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                You rated this: {{ rating }}
                </p>
            </div>
        `
    };
});