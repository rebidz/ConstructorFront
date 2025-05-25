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

    let UsersSentTheTest = {};

    userDataRequest.tests.forEach(test => {
        const passingScore = test.passing_score;
        const usersData = getUsersSentTest(test.id);
        usersData.then(data => {
            console.log(data.test)
            UsersSentTheTest[data.id] = data.test;
        })
        // console.log(UsersSentTheTest);
        const testElement = document.createElement("div");
        testElement.className = "section-header";
        testElement.style = "cursor: pointer;"
        testElement.innerHTML = `
                <h1 class="section-header-h1">${test.title}</h1>
                <img src="/src/static/img/Chevron.svg" class="section-header-img" alt="plus">`

        const testContent = document.createElement("div");
        testContent.className = "section-content";
        testContent.style = "display: none;"
        testContent.innerHTML = `<ol>
                    <div class ="section-content-in"><b><li>Иванов Иван Иванович</li></b><a href="#">Ivanov.Ivan@example.com</a><button class="section-content-in-but">25 из 30</button></div>
                    <div class ="section-content-in"><b><li>Второй пункт</li></b><a href="#">Ivanov.Ivan@example.com</a><button class="section-content-in-but">25 из 30</button></div>
                    <div class ="section-content-in"><b><li>Третий пункт</li></b><a href="#">Ivanov.Ivan@example.com</a><button class="section-content-in-but">52 из 52</button></div>
                </ol>`

        testsSection.appendChild(testElement);
        testsSection.appendChild(testContent);
    })
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
        const userData = response.json();
        return userData;
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
