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
                            ${ (items[i].totalPrice * items[i].qty).toLocaleString()}
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
}


function checkout() { 

    axios({
            method: 'post',
            url: 'https://asia-east2-cube-family-delivery-dev.cloudfunctions.net/api/slack/sendMessage',
            data: {
                "channel": window.slack_channelId,
                "blocks": 
                        [
                            {
                                "type": "context",
                                "elements": [
                                    {
                                        "text": "*November 12, 2019*  |  Ordering Team Announcements",
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
                                    "text": `\n\n *Name*, ${window.customer_displayName} \n\n *Phone*, 0838692401 \n\n *Address*, 1004/142 Nirun Residence 9, floor 6, building C,  Sukhumwit Road, Bang Na, Bang Na, Bangkok 10260`
                                },
                                "accessory": {
                                    "type": "image",
                                    "image_url": `${window.customer_avatar}`,
                                    "alt_text": `${window.customer_displayName} avatar`
                                }
                            },
                            {
                                "type": "divider"
                            },
                            {
                                "type": "section",
                                "text": {
                                    "type": "mrkdwn",
                                    "text": ":calendar: |   *COMING ORDER*  | :calendar: "
                                }
                            },
                            {
                                "type": "section",
                                "text": {
                                    "type": "mrkdwn",
                                    "text": "*Buy 3 Get 1, ROOIBOS MILK TEA*"
                                },
                                "accessory": {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "x1",
                                        "emoji": true
                                    }
                                }
                            },
                            {
                                "type": "context",
                                "elements": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*รายการที่ 1*: \n\n • ใส่แก้ว หวานธรรมชาติ \n• ใส่แก้ว เพิ่มน้ำตาลช่อดอกมะพร้าว 3กรัม"
                                    }
                                ]
                            },
                            {
                                "type": "context",
                                "elements": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*รายการที่ 2*: \n\n • ใส่แก้ว หวานธรรมชาติ \n• ใส่แก้ว เพิ่มน้ำตาลช่อดอกมะพร้าว 3กรัม"
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
                                    "text": "*Rooibos - LATTE ( ชารอยบอสลาเต้ )*"
                                },
                                "accessory": {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "x3",
                                        "emoji": true
                                    }
                                }
                            },
                            {
                                "type": "context",
                                "elements": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Topping*: \n\n •  Rooibos - Bubble"
                                    }
                                ]
                            },
                            {
                                "type": "context",
                                "elements": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*package*: \n\n • ใส่แก้ว"
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "text": {
                                    "type": "mrkdwn",
                                    "text": "*Rooibos - LATTE ( ชารอยบอสลาเต้ )*"
                                },
                                "accessory": {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "x1",
                                        "emoji": true
                                    }
                                }
                            },
                            {
                                "type": "context",
                                "elements": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*package*: \n\n • ใส่ขวด"
                                    }
                                ]
                            },
                            {
                                "type": "divider"
                            },
                            {
                                "type": "context",
                                "elements": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "\n\n`Total Price : 1000 Baht`\n\n"
                                    }
                                ]
                            },
                                {
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
                            }
                        ]
            },
            headers: {
                'Content-Type': 'application/json'
            }
    })
    .then(function (response) {
        console.log(response);
    })
}