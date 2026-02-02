document.addEventListener('DOMContentLoaded', function() {

const { createApp, ref, computed } = Vue
var { useVuelidate } = window.Vuelidate;
var { required, email, minLength } = window.VuelidateValidators;
// TESTING ONLY
const POST_URL = "https://script.google.com/macros/s/AKfycbxAwRbJbJW6AI8_1oU9QewuMuTVhBilFcy_934fDiSUCSdajc1GFjHwd5-SPWHfW99nkA/exec";

createApp({
    setup() {
        const step = ref(1);
        const formData = ref({
            name: '',
            email: '',
            question1: '',
            question2: '',
            question3: []
        });

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
            console.log('Step1  validation result: ', result)   // DEBUG
            if (result) {
             step.value++;
            }
        };

        const prevStep = () => {
            step.value--;
        };

        const submitViaFormElm = () => {
            
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = POST_URL;

            // Create input elements and append them to the form
            const nameInput = document.createElement('input');
            nameInput.type = 'hidden'; // Use hidden input
            nameInput.name = 'Name';
            nameInput.value = formData.value.name;
            form.appendChild(nameInput);

            const emailInput = document.createElement('input');
            emailInput.type = 'hidden'; // Use hidden input
            emailInput.name = 'Email';
            emailInput.value = formData.value.email;
            form.appendChild(emailInput);

            // Append the form to the document (it won't be visible)
            document.body.appendChild(form);
            debugger;

            // form.addEventListener("submit", function(e) {
            //     debugger;
            //     e.preventDefault();
            //     const data = new FormData(form);
            //     const action = e.target.action;
            //     fetch(action, {
            //     method: 'POST',
            //     body: data,
            //     })
            //     .then(response => {
            //         if (!response.ok) {
            //             // If the response status code is not in the 200-299 range,
            //             // it's considered an error.
            //             throw new Error(`HTTP error! Status: ${response.status}`);
            //         }
            //         return response.text(); // Or response.json() if your server returns JSON
            //     })
            //     .then(data => {
            //         // Handle the successful response data here
            //         console.log("Success!", data); // Log the response data
            //         alert("Success!"); // Show a success message
            //     })
            //     .catch(error => {
            //         // This block will catch network errors and errors thrown in the 'then' blocks
            //         console.error("Error during form submission:", error);

            //         // Display a user-friendly error message
            //         alert("An error occurred during form submission. Please try again later.");
            //     });
            // });

            // Submit the form programmatically
            form.submit();

            // Clean up: Remove the form from the document after submission
            document.body.removeChild(form);

            console.log('Form submitted successfully (using virtual form)!');
        }

        const submitForm = async () => {
            const result = await v$.value.$validate();
            debugger;
            if (result) {
                console.log('Form Data:', formData.value);
                try {
                    const response = await fetch(POST_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', // Or 'multipart/form-data' if needed
                        },
                        mode: "no-cors",
                        body: JSON.stringify(formData.value) // Or use FormData if you need multipart
                    });

                    if (response.ok) {
                        console.log('Form submitted successfully!');
                        // Optionally reset the form
                        formData.value = {
                            name: '',
                            email: '',
                            question1: '',
                            question2: '',
                            question3: []
                        };
                    } else {
                        console.error('Form submission failed:', response.status, response.statusText);
                        alert('Form submission failed.');
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    alert('An error occurred while submitting the form.');
                }
                // submitViaFormElm()
            }
        };

        return {
            step,
            formData,
            v$,
            nextStep,
            prevStep,
            submitForm,
        };
    },
}).mount('#app')

})