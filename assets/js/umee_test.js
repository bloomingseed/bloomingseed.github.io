document.addEventListener('DOMContentLoaded', function() {

const { createApp, ref, computed, watch } = Vue
var { useVuelidate } = window.Vuelidate;
var { required, email, minLength } = window.VuelidateValidators;
// TESTING ONLY
const POST_URL = "https://script.google.com/macros/s/AKfycbzXj0ENb3pMrd-mT_sUryxeXL5gD4drczlyN4g1M-vbxBjFTB-2jVk5II_TjExV4gjsIQ/exec";

createApp({
    setup() {
        const step = ref(0);
        const formData = ref({
            name: '',
            email: '',
            question1: '',
            question2: '',
            question3: []
        });
        const rowNumber = ref(-1);    // store the submitted row result

        // Load data from session storage on component initialization
        if (sessionStorage.getItem('formData')) {
            formData.value = JSON.parse(sessionStorage.getItem('formData'));
        }
        if (sessionStorage.getItem('rowNumber')) {
            rowNumber.value = parseInt(sessionStorage.getItem('rowNumber'));
        }

        const rules = computed(() => ({
            name: { required, minLength: minLength(3) },
            email: { required, email },
            question1: step.value === 1
                ? {}
                : { required, minLength: minLength(5) },
            question2: step.value === 1
                ? {}
                : { required },
        }));


        const v$ = useVuelidate(rules, formData);

        const nextStep = async () => {
            const result = await v$.value.$validate();
            console.log('validation result: ', result)   // DEBUG
            if (result) {
             step.value++;
            }
        };

        const prevStep = () => {
            step.value--;
        };

        const startNewSubmission = () => {
          // Clear existing data
          formData.value = {
            name: '',
            email: '',
            question1: '',
            question2: '',
            question3: []
          };
          sessionStorage.removeItem('formData');
          rowNumber.value = 0;
          sessionStorage.removeItem('rowNumber');
          step.value++;
        };

        const submitForm = async () => {
            const result = await v$.value.$validate();
            debugger;
            if (result) {
                console.log('Form Data:', formData.value);
                try {
                    const response = await fetch(POST_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: JSON.stringify(formData.value)
                    });

                    if (response.ok) {
                        console.log('Form submitted successfully!');
                        resp = await response.json();
                        console.log(resp); // DEBUG
                        rowNumber.value = resp.row;
                        sessionStorage.setItem('rowNumber', rowNumber.value.toString()); // Persist rowNumber
                        nextStep();
                    } else {
                        console.error('Form submission failed:', response.status, response.statusText);
                        alert('Form submission failed.');
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    alert('An error occurred while submitting the form.');
                }
            }
        };

        // Watch formData for changes and persist to session storage
        watch(
            formData,
            (newFormData) => {
                sessionStorage.setItem('formData', JSON.stringify(newFormData));
            },
            { deep: true } // Deep watch for nested objects/arrays
        );

        return {
            step,
            formData,
            v$,
            rowNumber,
            nextStep,
            prevStep,
            startNewSubmission,
            submitForm,
        };
    },
}).mount('#app')

})