document.addEventListener('DOMContentLoaded', async () => {
    const getToTest = (event) => {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get("test_id") || 15;
        const email = document.getElementById("email").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;

        if (!email || !firstName || !lastName) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        window.location.href = `test.html?test_id=${testId}&first_name=${firstName}&last_name=${lastName}&email=${email}`;
    }

    const getToTestButton = document.getElementById("getToTest");
    getToTestButton.addEventListener('click', getToTest);
});
