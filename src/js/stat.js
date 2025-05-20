document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
        header.classList.toggle('open');

        const content = header.nextElementSibling;
        if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
});

// document.querySelectorAll('.section-header').forEach(header => {
//     header.addEventListener('click', () => {
//         const content = header.nextElementSibling;
//         content.classList.toggle('show');
//     });
// });