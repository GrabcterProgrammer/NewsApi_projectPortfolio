document.addEventListener("DOMContentLoaded", () => {
    const news = document.querySelector(".news");
    const url = "https://newsapi.org/v2/top-headlines?";
    const apiKey = "108c2bd8f9b6423f871c0bf5e6f532b9";

    // Селекторы для дальнейшего взаимодействия
    const newsCountrySelector = document.querySelector("#newsCountry");
    const themeNewsSelector = document.querySelector("#themeNews");
    const arrSelector = [newsCountrySelector, themeNewsSelector];

    // Обработчик событий
    arrSelector.forEach(item =>{
        item.addEventListener("change", ()=>{
            try{

                const wrapper = document.querySelectorAll(".news-wrapper");
                wrapper.forEach(item =>{
                    item.remove();
                })

            } catch (e) {
                console.error("Error!", e);
            }

            ajaxQuery(url, apiKey);

        })
    })

    ajaxQuery(url, apiKey);

    // Получение данных и дальнейший рендер
    function ajaxQuery(url, apiKey) {
        const query = httpRequest();

        let newsCountry = getValue(newsCountrySelector);
        let themeNews = getValue(themeNewsSelector);

        query.getQuery(url, apiKey, (err, data) =>{

            if (err !== null){
                console.error(err);
                return;
            }

            render(data, news);

        },{country: newsCountry, category: themeNews});
    }

});

// Получение значения из поля
function getValue(selector){
    return selector.value;
}

// Рендер внутреннего блока обертки
function renderNewsItem(data) {

    // Создание обёртки внутреннего содержимого карточки (текста)
    function generateNewsTextField({title, description, publishedAt}) {
        const fragmentNewsTextField = document.createDocumentFragment();
        const newsWrapper = document.createElement("div");
        const newsTitle = document.createElement("h2");
        const newsDesc = document.createElement("p");
        const newsTime = document.createElement("time");

        const arrClass = ["news-item__textField", "news-item__title", "news-item__desc", "news-item__time"];
        const arrTags = [newsWrapper, newsTitle, newsDesc, newsTime];

        for (let i = 0; i < arrTags.length; i++){
            arrTags[i].classList.add(arrClass[i]);

            if (i === 0) continue;
            arrTags[0].appendChild(arrTags[i]);
        }

        newsTitle.textContent = title;
        newsDesc.textContent = description;
        newsTime.innerHTML = `<span class="time-date">${publishedAt.slice(0, publishedAt.indexOf("T"))}</span> 
                               <span class="time-time">${publishedAt.slice(publishedAt.indexOf("T") + 1, publishedAt.indexOf("Z"))}</span>`;

        newsTime.setAttribute("datetime", publishedAt);

        fragmentNewsTextField.appendChild(newsWrapper);

        return fragmentNewsTextField;
    }

    // Создание Обертки изображения
    function generateImg({title, urlToImage}) {
        const fragmentImg = document.createDocumentFragment();
        const wrapperImg = document.createElement("div");
        const img = document.createElement("img");

        const imgStub = "https://via.placeholder.com/500";

        wrapperImg.classList.add("news-item__img");
        img.setAttribute("src", urlToImage ? urlToImage: imgStub);
        img.setAttribute('alt', title);

        wrapperImg.appendChild(img);
        fragmentImg.appendChild(wrapperImg);

        return fragmentImg;
    }

    const fragmentNewsItem = document.createDocumentFragment();
    const link = document.createElement("a");
    const img = generateImg(data);
    const textField = generateNewsTextField(data);

    const arrFragment = [img, textField];

    link.classList.add("news-item");
    link.setAttribute("href", data.url);
    link.setAttribute("target", '_blank');

    arrFragment.forEach(item =>{
        link.appendChild(item);
    })

    fragmentNewsItem.appendChild(link);

    return fragmentNewsItem;
}

// Рендер обёртки
function render(data, selector) {

    const jsonData = JSON.parse(data);
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement("div");
    wrapper.classList.add("news-wrapper");

    Object.values(jsonData.articles).forEach(item => {
        const newsItem = renderNewsItem(item);
        wrapper.append(newsItem);
    })

    fragment.appendChild(wrapper);
    selector.appendChild(fragment);
}

// Запрос на сервер
function httpRequest() {
    const request = new XMLHttpRequest();

    return {
        getQuery: function (url, apiKey = "", cb, ...args) {

            let settingSearch = "";

            Object.entries(args[0]).forEach(([key, value]) => {
                settingSearch += `${key}=${value}&`;
            })

            const newUrl = `${url}${settingSearch}apiKey=${apiKey}`;

            request.open("GET", newUrl);
            request.addEventListener("load", () => {
                if (Math.floor(request.status / 100) !== 2) {
                    const err = `Error. Status code: ${request.status}`;
                    cb(err, request);
                }
                cb(null, request.responseText);
            })

            request.addEventListener("error", () => {
                const err = `Error. Status code: ${request.status}`;
                cb(err, request);
            })

            request.send();
        }


    }

}