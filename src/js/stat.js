let UserDataRequest;

document.addEventListener('DOMContentLoaded',  () => {
    async function init() {
        UserDataRequest = await fetchUserData();
        if (UserDataRequest) renderTests(UserDataRequest);
        addEventOnTestBoxes();
    }

    init().catch(error => {
        console.error("Ошибка инициализации:", error);
        alert("Ошибка при загрузке страницы");
    });

})

function renderTests (userDataRequest) {
    const testsSection = document.querySelector(".box");
    testsSection.innerHTML = "";

    userDataRequest.tests.forEach(((test, index) => {
        const passingScore = test.passing_score;
        let testCount = 0;
        const testElement = document.createElement("div");
        testElement.className = "section-header";
        testElement.style = "cursor: pointer;"
        testElement.innerHTML = `
                <h1 class="section-header-h1">${test.title}</h1>
                <img src="/src/static/img/Chevron.svg" class="section-header-img" alt="plus">`

        const testContent = document.createElement("div");
        testContent.className = "section-content";
        testContent.style = "display: none;"

        testContent.innerHTML = `<ol id="test-${index}"></ol>`

        testsSection.appendChild(testElement);
        testsSection.appendChild(testContent);

        getUsersSentTest(test.id).then(data => {
            if (!Array.isArray(data.test)) {
                console.error("Данные не являются массивом:", data);
                return;
            }

            const testList = document.getElementById(`test-${index}`);
            console.log(data.test)
            data.test.forEach(user => {
                const userDataHtml = `
                    <div class="section-content-in">
                        <b><li>${user.first_name} ${user.last_name}</li></b>
                        <a href="#">${user.email}</a>
                        <button class="section-content-in-but">${user.score ?? "0"} из ${passingScore}</button>
                    </div>
                `;
                testList.insertAdjacentHTML('beforeend', userDataHtml);
            });
        }).catch(error => {
            console.error("Ошибка при загрузке пользователей:", error);
        });
    }))
}

function addEventOnTestBoxes () {
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
}

async function fetchUserData() {
    try {
        const response = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            credentials: "include",
            headers: {
              "Accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Ошибка при получении данных пользователя");
        }
        return response.json();
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

async function getUsersSentTest(testId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/tests/get_users_sent/${testId}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Ошибка при получении данных пользователей");
        }
        return response.json();
    } catch (error) {
        console.error("Ошибка:", error);
    }
}


// const token = getCookie('token');
// const userData = getAllUserDataFromToken(token);

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

function getAllUserDataFromToken(token) {
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadJson);
        return payload;
    } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
        return null;
    }
}
