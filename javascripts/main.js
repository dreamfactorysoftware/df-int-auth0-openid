const DF_API_KEY = "DF_API_KEY";
const DF_PROFILE_ENDPOINT = "http://{{your_df_domain}}com/api/v2/user/profile";
const DF_AUTH0_OPENID_SIGN_IN_ENDPOINT = "http://{{your_df_domain}}/api/v2/user/session?service=auth0_openid";
const DF_AUTH0_OPENID_CALLBACK_ENDPOINT = "http://{{your_df_domain}}/api/v2/user/session?oauth_callback=true";
const SIGN_IN_HREF = "http://{{your_application_domain}}/sign_in.html";
const HOMEPAGE_HREF = "http://{{your_application_domain}}/home.html";
const HELLO_HREF = "http://{{your_application_domain}}/hello.html";
var url = new URL(window.location.href);

saveSessionToken(url);
checkWindowLocation();

$(document).ready(() => {
    $("#logoutButton").click(() => {
        removeSessionToken();
        localStorage.clear();
    })
    $("#openIdButton").click(() => {
        $.ajax({
            type: "POST",
            url: DF_AUTH0_OPENID_SIGN_IN_ENDPOINT,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (data) {
                window.location = data.response.url;
            }
        })
    })
})

// return user's name from Dreamfactory profile
function getUserName() {
    var userName = "";
    $.ajax({
        type: "GET",
        url: DF_PROFILE_ENDPOINT,
        headers: {
            'X-DreamFactory-API-Key': DF_PROFILE_ENDPOINT,
            'X-DreamFactory-Session-Token': getSessionToken()
        },
        async: false,
        success: function (data) {
            userName = data.name;
        },
    });
    return userName;
}

function checkWindowLocation() {
    //if token exist redirect from the sign_in page to the home page
    if (getSessionToken() && url.href == SIGN_IN_HREF) {
        window.location.replace(HOMEPAGE_HREF);
    }
    //if token not exist redirect users to the sign_in page
    if (!getSessionToken() && url.href != SIGN_IN_HREF) {
        window.location.replace(SIGN_IN_HREF);
    }
}

// save a token into local storage 
function saveSessionToken(url) {
    if (url.searchParams.get('code') && url.searchParams.get('state')) {
        $.ajax({
            type: "POST",
            url: DF_AUTH0_OPENID_CALLBACK_ENDPOINT + '&code=' + url.searchParams.get('code') + '&state=' + url.searchParams.get('state'),
            async: false,
            success: function (data) {
                localStorage.setItem('token', data.session_token);
                localStorage.setItem('name', getUserName());
            }
        })
        // uncomment two lines below if you want to hide code and state which are contained in URL
        // var new_url = url.href.substring(0, url.href.indexOf("?"));
        // window.location.replace(new_url)
    }
}

// return token value from local storage 
function getSessionToken() {
    if (localStorage.getItem('token') == "null") {
        return false
    } else {
        return localStorage.getItem('token');
    }
}

// remove token value from local storage 
function removeSessionToken() {
    if (getSessionToken()) {
        localStorage.removeItem('token');
    }
}
