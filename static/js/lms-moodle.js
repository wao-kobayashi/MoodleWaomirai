document.addEventListener("DOMContentLoaded", function() {
    // <html>タグの属性を取得
    const htmlElement = document.querySelector("html");
    const tenantIdNumber = htmlElement.getAttribute("data-tenantidnumber");

    // テナントごとに処理を切り替え
    if (tenantIdNumber === "stg") {
        // stg環境の処理
        const bodyElement = document.querySelector("body");
        const bodyId = bodyElement.getAttribute("id");
        const courseDiv = document.querySelector('div[data-courseid="206"]');
        console.log('stg');
        // dashboard
        if (bodyId === "page-my-index") {
            if (courseDiv) {
                document.querySelector('.alert-setting-level').style.display = "flex";
            } else {
                document.querySelector('.alert-buy-course').style.display = "flex";
            }
        }
    }
});