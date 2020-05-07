var slack_channelId = '';
var customer_displayName = '';
var customer_avatar = ''

function clean_display_name (name) {
    return name.replace(/\s/g, '_').toLowerCase();
}

var lineToken = '';
function liffInit() {

    if (!liff.isInClient()) {
        // window.location = "https://line.me/R/ti/p/@cubefamily7"
        window.location = "./add-line.html"
    }

    // var liffId = '1654140731-mR5YN8LL';
    var liffId = '1654165370-zNwlvWJZ'; // Production
    liff.init({
        liffId: liffId || ""
    }).then(() => {

        lineToken = liff.getIDToken();
        if ( lineToken != null ) {
            console.log('lineToken ', lineToken)
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

        localStorage.setItem('userInfo', JSON.stringify({
            line_userId: profile.userId,
            line_displayName: profile.displayName,
            line_pictureUrl: profile.pictureUrl,
            line_decodeToken: liff.getDecodedIDToken(lineToken)
        }))
          

      });
    }
}

liffInit()

function sendFlexMessage(order) { 

    var blockOrderArray = [];
    var TOTAL = 0;
    var AMOUNT = 0;

    for(var item in order) {
        var itemDetail = order[item];

        AMOUNT += itemDetail.qty
        TOTAL += itemDetail.totalPrice * itemDetail.qty;

        blockOrderArray.push(
            {
                "type": "box",
                "layout": "vertical",
                "contents": getOrderObject(order)
            }
        )
    }
    
    blockOrderArray.push({
        "type": "box",
        "layout": "horizontal",
        "margin": "xxl",
        "contents": [
          {
            "type": "text",
            "text": "จำนวนทั้งหมด",
            "size": "md",
            "color": "#555555"
          },
          {
            "type": "text",
            "text": AMOUNT.toLocaleString(),
            "size": "lg",
            "color": "#111111",
            "align": "end"
          }
        ]
      },
      {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "text",
            "text": "ยอดรวม",
            "size": "md",
            "color": "#111111",
            "weight": "bold"
          },
          {
            "type": "text",
            "text": TOTAL.toLocaleString(),
            "size": "lg",
            "color": "#111111",
            "align": "end",
            "weight": "bold"
          }
        ]
    });
    

    var flexMessage = {
    
            "type": "bubble",
            "size": "mega",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "RECEIPT",
                  "weight": "bold",
                  "color": "#77ac7f",
                  "size": "sm"
                },
                {
                  "type": "text",
                  "text": "คุณ " + customer_displayName,
                  "weight": "bold",
                  "size": "xxl",
                  "margin": "md"
                },
                {
                  "type": "separator",
                  "margin": "xxl"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "xxl",
                  "spacing": "sm",
                  "contents":
                    //   All order place here
                    blockOrderArray,
                },
                {
                  "type": "separator",
                  "margin": "xxl"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "margin": "md",
                  "contents": [
                    {
                      "type": "text",
                      "text": "ขอบคุณที่เข้ามาเป็นส่วนหนึ่งของ CUBE FAMILY 😋",
                      "size": "xs",
                      "color": "#aaaaaa",
                      "flex": 0,
                      "wrap": true
                    }
                  ],
                  "position": "relative",
                  "spacing": "none"
                }
              ]
            },
            "styles": {
              "footer": {
                "separator": true
              }
            }
    }


    var message = [{
        "type": "flex",
        "altText": `ออเดอร์ของคุณ`,
        "contents": flexMessage
    }];

    if (liff.isInClient()) {
        liff.sendMessages(message).then(function() { 
            loading.hide();
            localStorage.removeItem('cart');
            Swal.fire(
                'สำเร็จ!',
                '',
                'success'
            ).then(
                function() {
                    liff.closeWindow();
                }
            )
        }).catch(function(err) {
            alert(err);
            alert('Got Something Error');
        });
    }

    console.log(JSON.stringify(message));

}

$('#logoutBtn').click(function() {
    alert('logout')
    if (liff.isLoggedIn()) {
        liff.logout();
        try{
            localStorage.removeItem('cart');
            localStorage.removeItem('userInfo');
            alert('Logout Successful!');
        }catch(error) { 
            console.log(error);
        }
        window.location.reload();
    }
})