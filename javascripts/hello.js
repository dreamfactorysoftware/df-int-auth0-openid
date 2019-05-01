$(document).ready(function () {
    if (url.href == HELLO_HREF) {
        $('#userFullName').html(localStorage.getItem('name'));
    }
})
