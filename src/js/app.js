document.addEventListener("DOMContentLoaded", () =>
{
    const url = "https://newsapi.org/v2/top-headlines?";
    const apiKey = "108c2bd8f9b6423f871c0bf5e6f532b9";

    const query = httpRequest();
    query.getQuery(url, apiKey, (err, data) =>{

        if (err !== null){
            console.error(err);
            return;
        }

    },{country: newsCountry, category: themeNews, q: ''});

});

function getValue(selector){
    let val = selector.value;
    selector.addEventListener("change", ()=>{
        val = selector.value;
    });
    return val;
}

function httpRequest() {
    const request = new XMLHttpRequest();

    return {
        getQuery(url, apiKey="", cb, ...args) {

            let settingSearch = "";

            Object.entries(args[0]).forEach(([key, value]) =>{
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

            request.addEventListener("error", ()=>{
                const err = `Error. Status code: ${request.status}`;
                cb(err, request);
            })

            request.send();
        }



    }

}