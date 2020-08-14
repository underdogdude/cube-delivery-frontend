/*
    ในตอนแอดเมนู  ${isRecommend(value.recommended)}
    ยังไม่ได้ทำเพราะไม่รู้ทำไง
    TODO : ถ้าแก้ http -> https แล้วไปเปลี่ยนลิ่งรูปโดยไม่ต้องตัด string ด้วย !!!!
*/

var cart = {
    items: {}
}

var current_price = 0
var product_price;
var ALL_OPTIONS_LIST = [];


function init () { 

    loading.show();
    get.menu_group2().then(res => { 
        if(res.data) {
            // Sort Menu Tab
            let menuGroup = res.data.sort(function (a, b) {
                return a.menu_order - b.menu_order;
            }); 

            menuGroup.forEach(value => {
                $(`
                    <li class="nav-item">
                        <a class="nav-link ${(value.menu_order == 1) ? 'active' : ''}" 
                            id="${value.id}-tab" 
                            data-toggle="tab" 
                            href="#group${value.id}" 
                            role="tab" 
                            aria-controls="group${value.id}"
                            aria-selected="${(value.menu_order == 1) ? 'true' : 'false'}">
                                ${value.name}
                        </a>
                    </li>
                `).appendTo($('#menuTab'));
                
                $(`
                    <div class="tab-pane fade ${(value.menu_order == 1) ? 'show active' : ''}" 
                         id="group${value.id}" 
                         role="tabpanel" 
                         aria-labelledby="${value.id}-tab"
                    >
                        <div class="menu__content" 
                             id="${value.id}_list"
                        >
                            <span class="menu__layout-title">
                                ${value.name}
                            </span>
                        </div>
                    </div>
                `).appendTo($('#menuTabContent'));
            });

            // list prods

            get.menu2().then(res=> {
                loading.hide();
                res.data.forEach(value => {
                    value.categories.map((item) => {
                        // Image remote https -> http
                        
                        let image = value.images[0].src.slice(0,4) + value.images[0].src.slice(5, value.images[0].src.length) ? value.images[0].src.slice(0,4) + value.images[0].src.slice(5, value.images[0].src.length) : "./img/logo.png";

                        if(value.name)
                            $(`
                            <a class="menu__link menu__layout-hasimg" data-toggle="modal" data-target="#prodModal" data-id="${ value.id }" href="#">
                                    <div class="menu__layout-hasimg-imgsection">
                                        <div class="menu__layout-hasimg-thumbnail">
                                            <img src="${ image }" alt="">
                                        </div>
                                        ${isRecommend(value.recommended)}
                                    </div>
                                    <div class="menu__layout-hasimg-detail">
                                        <h4 class="title">
                                            ${value.name}
                                        </h4>
                                        <span class="desc">
                                            ${value.short_description.slice(0, 144)}
                                        </span>
                                        <div class="menu__layout-footer">
                                            <span class="price">
                                                ${ Math.round(value.price) }บาท
                                            </span>
                                        </div>
                                    </div>
                            </a>
    
                        `).appendTo($(`#${item.id}_list`));
                        
                    })
                })
            });
        }
    })
}

$('#prodModal').on('show.bs.modal', function(e) {
    try { 

        var dataID = e.relatedTarget
        var prod_content = $("#prod_content");
        var id = $(dataID).attr("data-id") 

        loading.show();
        get.menu2(id).then(res=> {

            console.log(res ,' mene2 ID');
            let image = "";
            let imgThumbnail = res.data.images[0].src.slice(0,4) + res.data.images[0].src.slice(5, res.data.images[0].src.length) ? res.data.images[0].src.slice(0,4) + res.data.images[0].src.slice(5, res.data.images[0].src.length) : "./img/logo.png"

            res.data.images.map((img)=>{
                image += `
                    <div class="slide-item" style="background-image: url('${ img.src.slice(0,4) + img.src.slice(5, img.src.length) }')"></div>
                `
            });
            
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
                            <div class="slick-container"> 
                                ${image}
                            </div>
                        <div class="product__order">
                            
                            <section class="prod__desc" id="prod_desc_section">
                                ${ isRecommend(res.data.recommended) }
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
                                    value="1" 
                                    min="1"
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

            let obj = res.data.meta_data.find(o => o.key === "_product_addons");
            listProdOption(obj.value);
            loading.hide();

            $('#btnAddToCart').click(function(e) {

                // make option list
                var optionGroupList = [];
                var hashOptionGroupList = '';
                var totalAdditionalPrice = 0;

                // for (var optionGroup of res.data.option_group_list) {
                obj.value.forEach((value, idx) => {

                    var nameRemoveSpace = value.name.replace(/\s/g, '');
                    var checkedList = $(`input[name="${nameRemoveSpace + idx}"]:checked`);

                    if (checkedList.length > 0) {

                        let optionList = [];
                        var radioButtonId = $(`input[name="${nameRemoveSpace + idx}"]:checked`).attr('id');
                        var optionGroupId = radioButtonId.split('-')[0];
                        var optionGroupName = $(`#optionGroupName-${nameRemoveSpace + idx}`).text().trim();

                        $(`input[name="${nameRemoveSpace + idx}"]:checked`).each(function(index) {
                            
                            var radioButtonId = $(`input[name="${nameRemoveSpace + idx}"]:checked`).eq(index).attr('id');
                            
                            var optionId = radioButtonId.split('-')[1];
                            var optionName = $(`#optionName-${optionGroupId}-${optionId}`).text().trim();
                            var optionPrice = $(`#optionPrice-${idx}-${optionId}`).text().trim();

                            optionList.push({
                                "name": optionName,
                                "displayName": optionName,
                                "quantity": 1,
                                "additionalPrice": parseInt(optionPrice)
                            });

                            totalAdditionalPrice += parseInt(optionPrice)
                            
                            console.log('optionGroupName', radioButtonId, optionGroupId, optionId, optionGroupName, optionName, optionPrice)
                        })

                        optionGroupList.push({
                            "name": optionGroupName,
                            "displayName": optionGroupName,
                            "values": optionList
                        })

                        hashOptionGroupList = md5(JSON.stringify(optionGroupList));
                    }
                });

                // hashOptionGroupList is for check user chooice same menu with same option (md5 of optionlist)
                var refCardItem = cart.items[`${res.data.id}-${hashOptionGroupList}`];

                // In the first select [refCardItem] will be undefined because it doesn't have this menu with this option yet;
                if (refCardItem == undefined) {
                    refCardItem = {
                        "menuId": res.data.id,
                        "name": res.data.name,
                        "description": res.data.description,
                        "memo": $('#additionalReqInput').val(),
                        "basePrice": Math.round(res.data.price),
                        "price": Math.round(res.data.price),
                        "totalPrice": Math.round(res.data.price) + totalAdditionalPrice,
                        "qty": parseInt($('#quatityInput').val()),
                        "options": optionGroupList,
                        "promotionId": "",
                        "imageURL": imgThumbnail,
                        "reason": null
                    }
                    
                    cart.items[`${res.data.id}-${hashOptionGroupList}`] = refCardItem
                } else {
                    var currentQty = refCardItem.qty;
                    refCardItem.memo = $('#additionalReqInput').val();
                    refCardItem.qty = parseInt(currentQty) + parseInt($('#quatityInput').val());
                }

                // cart.item มีแน่อน
                if(cartFunction.hasItem()) { 
                    // ต้องเอาไปเติม
                    var cartInLocal = cartFunction.getItem(); // is{ } inside cart;
                    $.extend( true, cartInLocal.items, cart.items );
                    localStorage.setItem('cart', JSON.stringify(cartInLocal));

                }else{ 

                    localStorage.setItem('cart', JSON.stringify(cart));
                }

                addtoCart();
            });

            descToggle.init();
            $('.slick-container').slick({
                infinite: true,
                slidesToShow: 1,
                dots: true,
            }) 

        });
    }
    catch (err) {
        console.log(err);
    }

});

function isRecommend(value = "") {
    
    if(value) { 
        if(value === 1) {
            return `<span class="badge badge-pill badge__recommend">Recommend</span>`;
        }else { 
            return "";
        }
    }else { 
        return "";
    }
}

function listProdOption(option) { 

    ALL_OPTIONS_LIST = sortArrayOfObjects(option, 'position');
    
    if (ALL_OPTIONS_LIST.length !== 0) {
        
        ALL_OPTIONS_LIST.forEach((value, idx) => {

            var selectButtonListHTML = '';
            var nameRemoveSpace = value.name.replace(/\s/g, '');

            value.options.map((opsItem, opsItemIdx) => {

                var price = opsItem.price !== "" ? opsItem.price : "0";
                // If options has only ONE use radiobutton will not WORK;
                if(value.type === "radiobutton" && value.options.length !== 1) { 
                    selectButtonListHTML += `
                            <div class="form-check">
                                <div class="custom-control custom-radio">
                                    <input type="radio" 
                                        name="${nameRemoveSpace + idx}"
                                        value="${ Math.round(price)}"
                                        id="${nameRemoveSpace + idx}-${opsItemIdx}"
                                        class="form-check-input custom-control-input">

                                    <label class="custom-control-label" 
                                        for="${nameRemoveSpace + idx}-${opsItemIdx}">
                                        <p id="optionName-${nameRemoveSpace + idx}-${opsItemIdx}">
                                            ${opsItem.label}
                                        </p>
                                    </label>
                                </div>

                                <label class="pure-material-radio"  
                                for="">
                                    <b class="prod__option-price">
                                        <span id="optionPrice-${idx}-${opsItemIdx}">
                                        ${ Math.round(price)}
                                        </span> บาท
                                    </b>
                                </label>
                            </div>
                        `;
                }else { 
                    selectButtonListHTML += `
                        <div class="form-check">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" 
                                    name="${nameRemoveSpace + idx}"
                                    value="${ Math.round(price)}"
                                    id="${nameRemoveSpace + idx}-${opsItemIdx}"
                                    class="form-check-input custom-control-input"
                                />
                                <label class="custom-control-label" 
                                    for="${nameRemoveSpace + idx}-${opsItemIdx}">
                                    <p id="optionName-${nameRemoveSpace + idx}-${opsItemIdx}">
                                        ${opsItem.label}
                                    </p>
                                </label>
                            </div>
                            <label class="pure-material-radio"  
                                for="">
                                    <b class="prod__option-price">
                                        <span id="optionPrice-${idx}-${opsItemIdx}">
                                        ${ Math.round(price)}
                                        </span> บาท
                                    </b>
                            </label>
                        </div>
                    `;
                }
            })
            var isRequiredHTML = `<div class="badge__required">
                    1 REQUIRED
                </div>`
            var isRequired = value.required === 1 ? isRequiredHTML : "";
            $(`
                <div class="prod__option-title">
                    <div>
                        <span class="text__primary">
                            ${ isRequired.length > 0 ? "*" : "" }
                        </span>
                        ${ value.name }
                    </div>
                    ${ isRequired }
                </div>
                <span style="display:none;" id="optionGroupName-${nameRemoveSpace + idx}">
                    ${ value.name }
                </span>
                </span>
                <div class="prod__option-radio">
                    ${selectButtonListHTML}
                </div>
            `).appendTo($('#prod__option'));
        });

        // Check button again
        var required_amount = ALL_OPTIONS_LIST.filter((item) => {
            return item.required === 1;
        });
        if(required_amount.length === 0) { 
            activeAddToCart();
        }
        
    }else{
        activeAddToCart();
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

    var input_name_lists = [];
    
    ALL_OPTIONS_LIST.forEach((value, idx) => {

        var nameRemoveSpace = value.name.replace(/\s/g, '');

        let checkedList = $(`input[name="${nameRemoveSpace + idx}"]:checked`);
        if (checkedList.length > 0) {
            // var input_name = $(checkedList).attr("name");
            var option_selected = Number($(`input[name="${nameRemoveSpace + idx}"]:checked`).val());
            
            if(!isNaN(option_selected)) { 
                option_price += option_selected;
            }
            
            if(value.required === 1) {
                var input_name = $(checkedList).attr("name");

                var required_amount = ALL_OPTIONS_LIST.filter((item) => {
                    return item.required === 1;
                });

                input_name_lists.push(input_name);

                var unique_name_lists = input_name_lists.filter(function(item, pos) {
                    return input_name_lists.indexOf(item) == pos;
                })
                if(unique_name_lists.length < required_amount.length) { 
                    inactiveAddToCart();
                }else{ 
                    activeAddToCart();
                }
            }
            // input_name_lists.push(input_name);
            // var unique_name_lists = input_name_lists.filter(function(item, pos) {
            //     return input_name_lists.indexOf(item) == pos;
            // })

            // if(unique_name_lists.length < ALL_OPTIONS_LIST.length) { 
            //     inactiveAddToCart();
            // }else{ 
            //     activeAddToCart();
            // }
        }
    });
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


function addtoCart() { 
    var element = document.querySelector('#prodModal');
        element.classList.add('slideOutDown');

        element.addEventListener('animationend', function() { 
            // class modal when CLICK ADDTOCART ONLY!
            if($(this).hasClass('slideOutDown')) { 
                element.classList.remove('slideOutDown');
                $('#prodModal').modal('hide');
            }
        });

    myCart.showBtn();
}

var myCart = { 
    showBtn: function() { 
        var cartItems = JSON.parse(localStorage.getItem('cart')).items;
        var get_amount = 0;
        var get_total = 0;
        console.log(cartItems, 'CArt ITEM');
        for (var i in cartItems){ 
            get_total += (cartItems[i].totalPrice * cartItems[i].qty);
            get_amount += cartItems[i].qty;
        }
        $("#mycart_total").html(get_total.toLocaleString());
        $("#mycart_amount").html(get_amount);
        $("#mycart__btn_container").css("display","block");
        // Add Notify;
        $("#icon_cart .dot").addClass("is_active");
        $("#icon_cart .dot").html(get_amount);
    },
    clicked: function() { 
        var element =  document.querySelector('main')
            element.classList.add('animated', 'slideOutLeft')
            element.addEventListener('animationend', function() { 
                window.location = "./mycart.html";
            })
    },
    // verifyToCart: function() { 
    //     try  { 
    //         let cartItems  = cartFunction.getItem().items;
    //         if(Object.keys(cartItems).length === 0) { 
    //             alert("ตะกร้าของคุณไม่มีสินค้าอยู่");
    //         }else { 
    //             myCart.clicked();
    //         }
    //     }catch(err) { 
    //         console.log(err);
    //     }
    // }
}

function activeAddToCart() { 
    var elem = $("#btnAddToCart");
    $(elem).removeClass("inactive");
}
function inactiveAddToCart() { 
    var elem = $("#btnAddToCart");
    $(elem).addClass("inactive");
}

var descToggle = { 

    $elem: function() {
        return $("#prod_desc_section");
    },
    init : function() { 

        var $elem_prod_desc_section = this.$elem();
        if($($elem_prod_desc_section).height() > 200) { 
            $($elem_prod_desc_section).append(`
                <div class="showmore" id="showmore" onclick="descToggle.toggle()">
                    Show More
                </div>`
            );
            $elem_prod_desc_section.css("height" , "200px");
            $elem_prod_desc_section.css("overflow" , "hidden");
        }
    },
    toggle: function() { 
        var showmore_btn = $("#showmore");
        var $elem_prod_desc_section = this.$elem();

        if($(showmore_btn).hasClass('clicked')) { 

            // $($elem_prod_desc_section).css("max-height" , "200px");
            $($elem_prod_desc_section).animate({ "height": "200px" } , "slow");
            $(showmore_btn).removeClass("clicked");
            $(showmore_btn).html("Show More");

        }else { 
            // $($elem_prod_desc_section).css("max-height" , "100%");
            $($elem_prod_desc_section).animate({ "height": "100%" } , "slow");
            $(showmore_btn).addClass("clicked");
            $(showmore_btn).html("Show Less");
        }
    }
}



const sortArrayOfObjects = (arr, key) => {
    return arr.sort((a, b) => {
        return a[key] - b[key];
    });
};