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
        // window.location = "./add-line.html"
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


function getOrderObject(order) { 
    
    var bubbleBlock = []
    var blockOrderArray = [];
    for(var item in order) {

        var itemDetail = order[item];
        
        blockOrderArray.push(
            {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "text",
                        "text": itemDetail.name,
                        "size": "md",
                        "weight": "bold",
                        "flex": 4,
                        "wrap": false,
                        "color": "#707070"
                    },
                    {
                        "type": "separator",
                        "margin": "xl"
                    }
                ],
                "position": "relative"
            },
            {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "image",
                        "url": itemDetail.imageURL,
                        "align": "start",
                        "size": "full"
                    },
                    {
                        "type": "separator",
                        "color": "#ffffff",
                        "margin": "xxl"
                    }
                ]
            },
            {
                "type": "box",
                "layout": "vertical",
                "contents":  getSubOption(itemDetail)
            },
            {
                "type": "box",
                "layout": "vertical",
                "contents":  [
                    {
                        "type": "separator",
                        "color": "#ffffff",
                        "margin": "xxl"
                    },
                    {
                        "type": "separator",
                        "margin": "xxl"
                    },
                    {
                        "type": "separator",
                        "color": "#ffffff",
                        "margin": "xxl"
                    },
                    {
                        "type": "text",
                        "text": "Additional Requirement",
                        "weight": "bold",
                        "flex": 4,
                        "wrap": false,
                        "size": "xs",
                        "color": "#a9a9a9"
                    },
                    {
                        "type": "text",
                        "text": itemDetail.memo,
                        "weight": "bold",
                        "flex": 4,
                        "wrap": false,
                        "size": "xs",
                        "color": "#a9a9a9"
                    }
                ]
            }
        );

        bubbleBlock.push({
            "type": "bubble",
            "size": "mega",
            "body": {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": blockOrderArray
            },
            "footer": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "จำนวน: x" + itemDetail.qty,
                    "align": "start",
                    "size": "md"
                  },
                  {
                    "type": "text",
                    "text": itemDetail.totalPrice + "บาท",
                    "align": "end",
                    "weight": "bold",
                    "color": "#3D6A40"
                  }
                ]
            }
        })

        blockOrderArray = []

    }

    return bubbleBlock;
}

function getSubOption(itemDetail) { 

    var optionArr = [];
    for (var option of itemDetail.options) {
        
        optionArr.push({
            "type": "text",
            "text": option.displayName,
            "size": "sm",
            "weight": "bold",
            "color": "#a9a9a9"
        })
        for (var value of option.values) {
            optionArr.push({
                "type": "text",
                "text": "• " + value.displayName + "(" + value.additionalPrice + "บาท)",
                "size": "xs",
                "color": "#a9a9a9",
                "offsetStart": "20px"
            })
        }
    }

    return optionArr;
}

function sendFlexMessage(order) { 

    // var blockOrderArray = [];
    var TOTAL = 0;
    var AMOUNT = 0;

    for(var item in order) {
        var itemDetail = order[item];

        AMOUNT += itemDetail.qty
        TOTAL += itemDetail.totalPrice * itemDetail.qty;
    }

    let carouselMessage = {
        "type": "carousel",
        "contents": [
            {
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
                      "size": "md"
                    },
                    {
                        "type": "separator",
                        "color": "#ffffff",
                        "margin": "xxl"
                    },
                    {
                        "type": "image",
                        "url": customer_avatar,
                        "align": "start",
                        "size": "full"
                    },
                    {
                      "type": "text",
                      "text": "คุณ " + customer_displayName,
                      "weight": "bold",
                      "size": "xl",
                      "margin": "md"
                    },
                    {
                        "type": "text",
                        "text": "(เลื่อนไปทางขวาเพื่อดูรายการที่สั่ง)",
                        "color": "#cccccc",
                        "weight": "bold",
                        "size": "sm",
                        "margin": "md"
                    },
                    {
                      "type": "separator",
                      "margin": "xxl"
                    },
                    {
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
                            "color": "#77ac7f",
                            "weight": "bold"
                          },
                          {
                            "type": "text",
                            "text": TOTAL.toLocaleString(),
                            "size": "lg",
                            "color": "#77ac7f",
                            "align": "end",
                            "weight": "bold"
                          }
                        ]
                    }
                  ]
                },
                "styles": {
                  "footer": {
                    "separator": true
                  }
                }
            }
        ]
    }

    getOrderObject(order).forEach(value => carouselMessage.contents.push(value))

    carouselMessage.contents.push({
          "type": "bubble",
          "size": "mega",
          "body": {
              "type": "box",
              "layout": "vertical",
              "margin": "md",
              "contents": [
                {
                    "type": "image",
                    "url": "https://cube-family-delivery-dev.web.app/img/logo.png",
                    "size": "full"
                },
                {
                    "type": "separator",
                    "color": "#ffffff",
                    "margin": "xxl"
                },
                {
                    "type": "separator",
                    "color": "#ffffff",
                    "margin": "xxl"
                },
                {
                  "type": "text",
                  "text": "ขอบคุณที่เข้ามาเป็นส่วนหนึ่งของ CUBE FAMILY 😋",
                  "size": "md",
                  "color": "#aaaaaa",
                  "flex": 0,
                  "wrap": true
                }
              ]
          }
    })

    var message = [{
        "type": "flex",
        "altText": `ออเดอร์ของคุณ`,
        "contents": carouselMessage
    }];

    console.log('flexMessage ', message)

    if (liff.isInClient()) {
        liff.sendMessages(message).then(function() { 
            loading.hide();
            localStorage.removeItem('cart');                  // Uncomment
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