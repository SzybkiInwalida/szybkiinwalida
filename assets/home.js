var params = new URLSearchParams(window.location.search);
//github nznowu niger
function sendTo(page) {
    location.href = '' + page + '.html?' + params;
}