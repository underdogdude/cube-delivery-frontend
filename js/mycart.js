var myCart = {
    showBtn: function () {
        var cartItems = cartFunction.getItem().items;
        var get_amount = 0;
        var get_total = 0;

        if(Object.keys(cartItems).length > 0) { 
            for (var i in cartItems) {
                get_total += cartItems[i].totalPrice * cartItems[i].qty;
                get_amount += cartItems[i].qty;
            }
    
            $("#mycart_total").html(get_total.toLocaleString());
            $("#mycart_amount").html(get_amount);
            $("#mycart__btn_container").css("display", "block");
        }else { 
            $("#mycart__btn_container").css("display", "none");
            window.location = "./index.html";
        }
    }
};


var amount_btn = { 

    increase: function(key) { 

        var amount = this.getCurrentAmount(key);
        let $input = $("#" + key + "-quatityInput"),
            val = parseInt($input.val()),
            max = parseInt($input.attr('max')),
            step = parseInt($input.attr('step'));

        let temp = val + step;
        if (temp <= max) { 
            $input.val(temp);
            amount = temp;
        }else{
            $input.val(max);
            amount = max;
        }
        this.changeAmount(key, amount);
    },
    decrease: function(key) { 

        var amount = this.getCurrentAmount(key);
        let $input = $("#" + key + "-quatityInput"),
            val = parseInt($input.val()),
            min = parseInt($input.attr('min')),
            step = parseInt($input.attr('step'));

        let temp = val - step;
        if (temp >= min) { 
            $input.val(temp);
            amount = temp;
        }else{
            $input.val(min);
            amount = min;
        }
        this.changeAmount(key, amount);
    },

    getCurrentAmount: function(key) { 
        return $("#" + key + "-quatityInput").val();
    },

    changeAmount: function(id, amount){

        var cartInLocal = cartFunction.getItem();
        cartInLocal.items[id].qty = Number(amount);
        localStorage.setItem("cart", JSON.stringify(cartInLocal));
        reRender();
    }
}



var cartLists = {
    
    render: function(items) { 

        var cartlist_elem = $("#cartlist");
            $(cartlist_elem).empty();
        var string = ``;

        for( var i in items ) {

           string += `
            <div class="cartlist__item">
                <div class="cartlist__header">
                    <div class="mr-3">
                        <h4 class="title"> 
                            ${ items[i].name }
                        </h4>
                        <span class="desc">
                            ${this.getOptionString( items[i].options )}
                        </span>
                    </div>
                    <div class="text-danger">
                        <i class="far fa-trash-alt  btn__remove"  onclick="cartLists.remove('${i}')"></i>
                    </div>
                </div>
                <div class="cartlist__footer">
                    <div class="d-flex flex-column">
                        <i class="morerequest text__primary">${ items[i].memo}</i>
                        <span class="price">
                            ${ (items[i].totalPrice * items[i].qty).toLocaleString() }
                            บาท
                        </span>
                    </div>
                    
                    <div class="custom-input-checkout">
                        <button type="button" class="cic-btn cic-btn-1 cic-btn-small cic-decrement"
                            onclick="amount_btn.decrease('${i}')">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                            class="cic-input" id="${i}-quatityInput"
                            step="1" 
                            value="${items[i].qty}" 
                            min="1"
                            max="99"
                        />
                        <button type="button" class="cic-btn cic-btn-1 cic-btn-small cic-increment"
                            onclick="amount_btn.increase('${i}')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>`
        }
        $(cartlist_elem).html(string);
    },

    getOptionString : function(optionLists) { 
        
        var optionString =  ``; 
        
        if(optionLists.length > 0) { 
            for(var i in optionLists) {
                
                optionString += `<strong> ${optionLists[i].name} </strong> : `;

                var optionStringValues =  ``; 
                if(optionLists[i].values.length > 0) {
                    for(var j in optionLists[i].values) {
                        optionStringValues += `${optionLists[i].values[j].name } `;
                    }
                    optionString += optionStringValues;
                }
                optionString += `</br>`;
            }
        }
        return optionString;
    },

    remove: function(key) { 

        var cartInLocal = cartFunction.getItem();
            delete cartInLocal.items[key];

        localStorage.setItem("cart", JSON.stringify(cartInLocal));
        reRender();
    }
}

function reRender() { 
    var cartInLocal = cartFunction.getItem();
    myCart.showBtn();
    cartLists.render(cartInLocal.items);
    loading.hide();
}


function checkout() {
    loading.show();
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var cartCheckout = JSON.parse(localStorage.getItem('cart'));
    var orderDate = moment(new Date()).format("LL");

    var blockArray = [
        {
            "type": "context",
            "elements": [
                {
                    "text": `*${orderDate}*  |  Ordering Team Announcements`,
                    "type": "mrkdwn"
                }
            ]
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Customer Detail*"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `\n\n *Name*, ${userInfo.line_displayName} \n\n *Phone*, [-] \n\n *Address*, [-]`
            },
            "accessory": {
                "type": "image",
                "image_url": `${userInfo.line_pictureUrl}`,
                "alt_text": `${userInfo.line_displayName} avatar`
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": ":calendar: |  *COMING ORDER*  | :calendar: "
            }
        }
    ];

    for(var item in cartCheckout.items) {
        var itemDetail = cartCheckout.items[item];
        blockArray.push(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${itemDetail.name}*`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": `x${itemDetail.qty}`,
                        "emoji": true
                    }
                }
            }
        )

        for (var option of itemDetail.options) {

            var valueStr = "";
            for (var value of option.values) {
                valueStr += `• ${value.displayName} (${value.additionalPrice} Baht) \n`;
            }

            blockArray.push(
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": `*${option.displayName}*: \n\n ${valueStr}`
                        }
                    ]
                }
            )
        }

        blockArray.push(
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": `* remark * \n\n ${itemDetail.memo}`
                    }
                ]
            }
        );

        blockArray.push(
            {
                "type": "divider"
            }
        );

    }
    var cartArr = Object.values(cartCheckout.items);
    var totalCartPrice = cartArr.reduce(function(total, num) {
        return total + (num.totalPrice * num.qty);
    }, 0);


    blockArray.push({
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "\n\n`Total Price : " + totalCartPrice + " Baht`\n\n"
            }
        ]
    });

    blockArray.push({
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Approve"
                },
                "style": "primary",
                "value": "click_me_123"
            },
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Deny"
                },
                "style": "danger",
                "value": "click_me_123"
            }
        ]
    });

    axios({
            method: 'post',
            url: 'https://asia-east2-cube-family-delivery-dev.cloudfunctions.net/api/slack/sendMessage',
            data: {
                "channel": userInfo.slack_channelId,
                "blocks": blockArray
            },
            headers: {
                'Content-Type': 'application/json'
            }
    })
    .then(function (response) {

        axios({
            method: 'post',
            url: 'https://asia-east2-cube-family-delivery-dev.cloudfunctions.net/api/line/notify',
            data: {
                "channelID": userInfo.slack_channelId,
                "imageURL": userInfo.line_pictureUrl,
                "from": userInfo.line_displayName,
                "amount": totalCartPrice
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        sendFlexMessage(userInfo.line_displayName,  cartCheckout.items);
        
    }).catch(function () { 
        localStorage.removeItem('cart');
        Swal.fire(
            'กรุณาลองใหม่อีกครั้ง',
            '',
            'error'
        )
    })
}


function sendFlexMessage(name, order) { 

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
                  "text": "คุณ" + name,
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

    if (liff.isInClient()) {
        liff.sendMessages([{
            "type": "flex",
            "altText": `ออเดอร์ของคุณ`,
            "contents": flexMessage
        }]).then(function() { 

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
        });
    }
}


function getOrderObject(order) { 

    var blockOrderArray = [];
    for(var item in order) {

        var itemDetail = order[item];
        
        blockOrderArray.push({
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
              }
            ],
            "position": "relative"
        },{
            "type": "box",
            "layout": "vertical",
            "contents":  getSubOption(itemDetail)
        });

        blockOrderArray.push(
            {
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
        );

        blockOrderArray.push({
            "type": "separator",
            "margin": "xl",
            "color": "#ffffff"
        })


    }
    return blockOrderArray;
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
        var valueStr = "";
        for (var value of option.values) {
            valueStr += `• ${value.displayName} (${value.additionalPrice} บาท) \n`;
            optionArr.push({
                "type": "text",
                "text": "•" + value.displayName + "(" + value.additionalPrice + "บาท)",
                "size": "xs",
                "color": "#a9a9a9",
                "offsetStart": "20px"
            })
        }
    }

    return optionArr;
}