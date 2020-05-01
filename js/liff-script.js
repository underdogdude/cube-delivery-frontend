
var slack_channelId = '';
var customer_displayName = '';
var customer_avatar = ''

function clean_display_name (name) {
    return name.replace(/\s/g, '_').toLowerCase();
}

function liffInit() {
    var liffId = '1654140731-mR5YN8LL';
    liff.init({
        liffId: liffId || ""
    }).then(() => {

        var token = liff.getAccessToken();
        if ( token != null ) {
            console.log('token', token)
        }

        appInit();
    });
}

function appInit() {
    if (!liff.isLoggedIn() && !liff.isInClient()) {
        liff.login();
    } else {
      liff.getProfile().then(async (profile) => {

        userId = profile.userId;
        
        window.customer_displayName = profile.displayName;
        customer_avatar = profile.pictureUrl;

        $("#avartar").attr("src", customer_avatar);

        var slackChannelName = clean_display_name(profile.displayName);

        axios({
            method: 'post',
            url: 'http://localhost:5000/cube-family-delivery-dev/asia-east2/api/slack/createChannel',
            data: {
                "name": slackChannelName,
                "user_ids": 'U012Q4PMCDA'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            window.slack_channelId = response.data.channelId

            localStorage.setItem('userInfo', JSON.stringify({
                line_userId: profile.userId,
                line_displayName: profile.displayName,
                line_pictureUrl: profile.pictureUrl,
                slack_channelId: response.data.channelId,
                slack_channelName: slackChannelName,
            }))
        })
          

      });
    }
}

liffInit()