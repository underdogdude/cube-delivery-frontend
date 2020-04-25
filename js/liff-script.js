
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

        var slackChannelName = clean_display_name(profile.displayName);

        axios({
            method: 'get',
            url: 'https://asia-east2-cube-family-delivery-dev.cloudfunctions.net/api/slack/createChannel',
            data: {
                "name": slackChannelName,
                "user_ids": 'U012Q4PMCDA'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            console.log(response);
            window.slack_channelId = response.data.channelId
        })
          

      });
    }
}

liffInit()