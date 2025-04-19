// Функция для открытия диалогового окна
function openDialog(vacancyId, testId) {
    const dialog = document.getElementById(`overlayMenu-${vacancyId}`);
    if (dialog) {
        dialog.showModal();
        console.log(testId);
        // Найти кнопку "Пройти тест" внутри открытого диалогового окна
        const testButton = dialog.querySelector('.menu-test-b');
        console.log(testButton.dataset);
        if (testButton) {
            // Убедиться, что обработчик не добавлен
            if (!testButton.dataset.listenerAdded) {
                testButton.addEventListener('click', () => {
                    window.location.href = `../edit_test/${testId}/`;
                });
                testButton.dataset.listenerAdded = true; // Отметить, что обработчик добавлен
            }
        }
    }
}
