const htmlElement = document.documentElement;
const tenantIdNumber = htmlElement.getAttribute("data-tenantidnumber");
const bodyId = document.body.id;

if (process.env.TENANT_ID === 'stg') {
    // stg環境の処理
    if (bodyId === "aaa") {
        functionA();
    } else if (bodyId === "bbb") {
        functionB();
    }

} else if (process.env.TENANT_ID === 'lmswaomirai') {
    // // lmswaomirai環境の処理（コンパイル時に削除される）
    // if (bodyId === "aaa") {
    //     functionA();
    // } else if (bodyId === "bbb") {
    //     functionB();
    // }
}

// functionA
function functionA() {
    console.log("Function A executed");
}

// functionB
function functionB() {
    console.log("Function B executed");
}