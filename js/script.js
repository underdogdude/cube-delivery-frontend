var cart = {
    items: {}
}
var current_price = 0
var product_price;
var all_option_lists = [];


function init() { 

    get.menu_group().then(res => { 
        
        if(res.data) {
            res.data.forEach(value => {
                $(`
                    <li class="nav-item">
                        <a class="nav-link ${(value.seqMenuGroup == 0) ? 'active' : ''}" 
                            id="${value.menu_group_id}-tab" 
                            data-toggle="tab" 
                            href="#group${value.menu_group_id}" 
                            role="tab" 
                            aria-controls="group${value.menu_group_id}"
                            aria-selected="${(value.seqMenuGroup == 0) ? 'true' : 'false'}">
                                ${value.menu_group_name}
                        </a>
                    </li>
                `).appendTo($('#menuTab'));

                $(`
                    <div class="tab-pane fade ${(value.seqMenuGroup == 0) ? 'show active' : ''}" 
                         id="group${value.menu_group_id}" 
                         role="tabpanel" 
                         aria-labelledby="${value.menu_group_id}-tab"
                    >
                        <div class="menu__content" 
                             id="${value.menu_group_id}_list"
                        >
                            <span class="menu__layout-title">
                                ${value.menu_group_name}
                            </span>
                        </div>
                    </div>
                `).appendTo($('#menuTabContent'));
            });

            // list prods

            get.menu().then(res=> {
                res.data.forEach(value => {
                    if(value.name) {
                        $(`
                            <div class="menu__layout-hasimg">
                                <div class="menu__layout-hasimg-thumbnail">
                                    <img src="https://d2waa76v2pig3r.cloudfront.net/${value.image_key}"
                                        alt="">
                                </div>
                                <div class="menu__layout-hasimg-detail">
                                    <h4 class="title">
                                        ${value.name}
                                    </h4>
                                    <span class="desc">
                                        ${value.description.slice(0, 144)}
                                    </span>
                                    <div class="menu__layout-footer">
                                        <span class="price">
                                            ${ Math.round(value.price) }บาท
                                        </span>
                                        <a class="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#prodModal" data-id="${ value.menu_id }" href="#">
                                            <i class="fas fa-plus"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `).appendTo($(`#${value.menu_group_id}_list`));
                    }
                })
            });
        }
    })
}

$('#prodModal').on('show.bs.modal', function(e) {

    var dataID = e.relatedTarget
    var prod_content = $("#prod_content");
    var id = $(dataID).attr("data-id") 

    get.menu(id).then(res=> {
        console.log(res,'test');
        var header = `
            <div class="modal-header">
                <button type="button" class="close close-left mr-1" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <span class="text__ellipsis">
                   ${ res.data.name }
                </span>
            </div>
        `;

        var body = `
                <div class="modal-body">
                    <div class="product__img">
                        <img src="https://d2waa76v2pig3r.cloudfront.net/${res.data.image_key}"  width="100%" />
                    </div>
                    <div class="product__order">
                        <section class="prod__desc">
                            ${ res.data.description }
                        </section>
                    
                    <section class="prod__option" id="prod__option"></section>

                    <section class="prod__option">
                        <p class="prod__option-title">
                            Additional Request
                        </p>
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="E.g. No veggies" id="additionalReqInput" />
                        </div>

                        <div class="custom-input-number">
                            <button type="button" class="cin-btn cin-btn-1 cin-btn-md cin-decrement">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" 
                                class="cin-input basket-quantity" id="quatityInput"
                                step="1" 
                                value="0" 
                                min="0"
                                max="99"
                            />
                            <button type="button" class="cin-btn cin-btn-1 cin-btn-md cin-increment">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        `;
        product_price = Math.round(res.data.price);
        current_price = Math.round(res.data.price);
        var footer = `
            <div class="modal-footer">
                <button type="button" class="btn btn-lg btn__primary btn-tocart inactive" id="btnAddToCart">
                    <span>
                        Add to Cart
                    </span>
                    <span class="" >
                        <span id="current_price">${ product_price.toLocaleString() }</span>
                        บาท
                    </span>
                </button>
            </div>
        `;

        $(prod_content).append(header);
        $(prod_content).append(body);
        $(prod_content).append(footer);

        listProdOption(res.data.option_group_list);


        $('#btnAddToCart').click(function(e) {

            // make option list
            var optionGroupList = [];
            var hashOptionGroupList = '';
            for (var optionGroup of res.data.option_group_list) {

                var checkedList = $(`input[name=${optionGroup.option_group_id}]:checked`);
                if (checkedList.length > 0) {

                    let optionList = [];
                    var radioButtonId = $(`input[name=${optionGroup.option_group_id}]:checked`).attr('id');
                    var optionGroupId = radioButtonId.split('-')[0];
                    var optionGroupName = $(`#optionGroupName-${optionGroupId}`).text().trim();

                    $(`input[name=${optionGroup.option_group_id}]:checked`).each(function(index) {
                        var radioButtonId = $(`input[name=${optionGroup.option_group_id}]:checked`).eq(index).attr('id');
                        var optionId = radioButtonId.split('-')[1];

                        var optionName = $(`#optionName-${optionGroupId}-${optionId}`).text().trim();
                        var optionPrice = $(`#optionPrice-${optionGroupId}-${optionId}`).text().trim();

                        optionList.push({
                            "name": optionName,
                            "displayName": optionName,
                            "quantity": 1,
                            "additionalPrice": optionPrice
                        })
                        
                        console.log('optionGroupName', radioButtonId, optionGroupId, optionId, optionGroupName, optionName, optionPrice)
                    })

                    optionGroupList.push({
                        "name": optionGroupName,
                        "displayName": optionGroupName,
                        "values": optionList
                    })

                    hashOptionGroupList = md5(JSON.stringify(optionGroupList));
                }
                
            }


            console.log('optionGroupList', optionGroupList, hashOptionGroupList)

            // hashOptionGroupList is for check user chooice same menu with same option (md5 of optionlist)

            var refCardItem = window.cart.items[`${res.data.menu_id}-${hashOptionGroupList}`];

            // In the first select [refCardItem] will be undefined because it doesn't have this menu with this option yet;
            if (refCardItem == undefined) {
                refCardItem = {
                    "menuId": res.data.menu_id,
                    "name": res.data.name,
                    "displayName": res.data.description,
                    "memo": $('#additionalReqInput').val(),
                    "basePrice": Math.round(res.data.price),
                    "price": Math.round(res.data.price),
                    "totalPrice": Math.round(res.data.price),
                    "qty": parseInt($('#quatityInput').val()),
                    "options": optionGroupList,
                    "promotionId": "",
                    "reason": null
                }
                window.cart.items[`${res.data.menu_id}-${hashOptionGroupList}`] = refCardItem
            } else {
                var currentQty = refCardItem.qty;
                refCardItem.memo = $('#additionalReqInput').val();
                refCardItem.qty = parseInt(currentQty) + parseInt($('#quatityInput').val());
            }
            
        })
    });
});


function listProdOption(option) { 

    all_option_lists = option;
    
    if (option) {
        option.forEach((value) => {

            let option_group = value.option_group

            if (option_group) {

                var selectButtonList = '';
                var option_list = option_group.option_list;

                for (let optionKey in option_list) {

                    var option = option_list[optionKey];

                    if (option_group.max_choice == 1) {
                        selectButtonList += `

                            <div class="form-check">
                                <label class="pure-material-radio form-check__labelwrapper"  
                                    for="${option_group.option_group_id}-${option.option_id}">

                                    <input type="radio" 
                                        name="${option_group.option_group_id}"
                                        id="${option_group.option_group_id}-${option.option_id}"
                                        value="${ Math.round(option.option_price) }"
                                        class="form-check-input">

                                    <span class="form-check-label" id="optionName-${option_group.option_group_id}-${option.option_id}">
                                    <p>
                                        ${option.option_name}
                                    </p>
                                </label>

                                <label class="pure-material-radio"  
                                for="${option_group.option_group_id}-${option.option_id}">
                                    <b class="prod__option-price">
                                    ${ Math.round(option.option_price) } บาท
                                    </b>
                                </label>
                            </div>
                        `;
                    } else {
                        selectButtonList += `

                            <div class="form-check">
                                <label class="pure-material-checkbox form-check__labelwrapper"
                                    for="${option_group.option_group_id}-${option.option_id}">
                                    <input type="checkbox" 
                                        name="${option_group.option_group_id}"
                                        id="${option_group.option_group_id}-${option.option_id}"
                                        value="${ Math.round(option.option_price) }"
                                        class="form-check-input">

                                    <span class="form-check-label" id="optionName-${option_group.option_group_id}-${option.option_id}">
                                    <p>
                                        ${option.option_name}
                                    </p>
                                   
                                </label>
                                <label class="pure-material-radio"  
                                    for="${option_group.option_group_id}-${option.option_id}">
                                    <b class="prod__option-price">
                                        ${ Math.round(option.option_price) } บาท
                                    </b>
                                </label>
                                <span style="display:none;" id="optionPrice-${option_group.option_group_id}-${option.option_id}">${ Math.round(option.option_price) }</span>
                            </div>
                        `;
                    }
                }

                $(`
                    <p class="prod__option-title">
                        <span class="text__primary">
                            *
                        </span>
                        ${ option_group.option_group_name }
                    </p>
                    <span style="display:none;" id="optionGroupName-${option_group.option_group_id}">${ option_group.option_group_name }</span>
                    <div class="prod__option-radio">
                        ${selectButtonList}
                    </div>
                    
            `).appendTo($('#prod__option'));
            }  
        })
    }

    $('input:radio').change(function () {
        updatePriceOption();
    });
    $('input:checkbox').change(function () {
        updatePriceOption();
    });
}

$('#prodModal').on('hide.bs.modal', function(e) {
    $("#prod_content").empty();
    // Clear all price
    current_price = 0;
    product_price = 0;
    amount = 0;
    amount_price = 0;
    option_price = 0;
});

init();


var amount_price = 0;
function updatePriceAmount(amount) { 

    amount = amount;
    if(amount != 0) { 
        // current_price = product_price * amount;
        amount_price = product_price * amount;
        updatePrice();
    }
}

var option_price = 0;
function updatePriceOption() { 

    option_price = 0; // set value to zero.

    for (optionGroup of all_option_lists) {

        let checkedList = $(`input[name=${optionGroup.option_group_id}]:checked`);

        if (checkedList.length > 0) {

            var option_selected = Number($(`input[name=${optionGroup.option_group_id}]:checked`).val());
            
            if(!isNaN(option_selected)) { 
                option_price += option_selected;
            }
        }
    }
    updatePrice();
}

/*
    @param
    ${current_price} = total price 
    ${product_price} = 1piece of price
    ${amount_price} = kind a all total but exclude option_price
    ${option_price} = option price
*/

function updatePrice() { 

    if (amount_price == 0) {
        current_price = product_price + option_price;

    }else { 
        current_price = amount_price + (option_price * amount);
    }
    $("#current_price").html(current_price.toLocaleString());
}

