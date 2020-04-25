var cart = {
    items: []
}


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
                                        <a class="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#prodModal" data-id="${ value.menu_id }" >
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

    console.log(id,'id');

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
                    <div class="product__img"
                        style="background-image: url('https://d2waa76v2pig3r.cloudfront.net/${res.data.image_key}');">
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
                                max="10"
                            />
                            <button type="button" class="cin-btn cin-btn-1 cin-btn-md cin-increment">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        `;

        var footer = `
            <div class="modal-footer">
                <button type="button" class="btn btn-lg btn__primary btn-tocart inactive" id="btnAddToCart">
                    <span>
                        Add to Cart
                    </span>
                    <span class="">${ Math.round(res.data.price) }บาท</span>
                </button>
            </div>
        `;

        $(prod_content).append(header);
        $(prod_content).append(body);
        $(prod_content).append(footer);

        listProdOption(res.data.option_group_list);

        $('#btnAddToCart').click(function(e) {
            window.cart.items.push({
                "menuId": res.data.menu_id,
                "name": res.data.name,
                "displayName": res.data.description,
                "memo": $('#additionalReqInput').val(),
                "basePrice": Math.round(res.data.price),
                "price": Math.round(res.data.price),
                "totalPrice": Math.round(res.data.price),
                "qty": parseInt($('#quatityInput').val()),
                "options": [{
                    "name": "บราวชูการ์-null-null-2-0-1-h5ozslyiynR5UWTmQsPChQ==",
                    "displayName": "บราวชูการ์",
                    "values": [{
                        "name": "บราวน์ชูการ์-null-null-10.00",
                        "displayName": "บราวน์ชูการ์",
                        "quantity": 0,
                        "additionalPrice": 10
                    }]
                }, {
                    "name": "วุ้นฟรุ๊ตสลัด-null-null-2-0-1-qmJjgepFYTWt/rw2l181Qg==",
                    "displayName": "วุ้นฟรุ๊ตสลัด",
                    "values": [{
                        "name": "วุ้นฟรุ๊ตสลัด-null-null-5.00",
                        "displayName": "วุ้นฟรุ๊ตสลัด",
                        "quantity": 0,
                        "additionalPrice": 5
                    }]
                }, {
                    "name": "วุ้นลิ้นจี่-null-null-2-0-1-XdSginszG0Y1fNS5fabRYw==",
                    "displayName": "วุ้นลิ้นจี่",
                    "values": [{
                        "name": "วุ้นลิ้นจี่-null-null-5.00",
                        "displayName": "วุ้นลิ้นจี่",
                        "quantity": 0,
                        "additionalPrice": 5
                    }]
                }, {
                    "name": "วุ้นสตรอเบอร์รี่-null-null-2-0-1-CeMAZdSfht0uoL40nyEfTQ==",
                    "displayName": "วุ้นสตรอเบอร์รี่",
                    "values": [{
                        "name": "วุ้นสตรอเบอร์รี่-null-null-5.00",
                        "displayName": "วุ้นสตรอเบอร์รี่",
                        "quantity": 0,
                        "additionalPrice": 5
                    }]
                }],
                "promotionId": "",
                "reason": null
            })
        })
    });
});


function listProdOption(option) { 

    
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
                                <label class="pure-material-radio"  
                                    for="${option_group.option_group_id}-${option.option_id}">

                                    <input type="radio" 
                                        name="${option_group.option_group_id}"
                                        id="${option_group.option_group_id}-${option.option_id}"
                                        class="form-check-input">

                                    <span class="form-check-label">
                                        ${option.option_name}
                                    </span>
                                </label>

                                <b class="prod__option-price">
                                ${ Math.round(option.option_price) } บาท
                                </b>
                            </div>
                        `;
                    } else {
                        selectButtonList += `

                            <div class="form-check">
                                <label  class="pure-material-checkbox"
                                    for="${option_group.option_group_id}-${option.option_id}">

                                    <input type="checkbox" 
                                        name="${option_group.option_group_id}"
                                        id="${option_group.option_group_id}-${option.option_id}"
                                        class="form-check-input">

                                    <span class="form-check-label">
                                        ${option.option_name}
                                    </span>
                                </label>
                                
                                <b class="prod__option-price">
                                    ${ Math.round(option.option_price) } บาท
                                </b>
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
                    <div class="prod__option-radio">
                        ${selectButtonList}
                    </div>
                    
            `).appendTo($('#prod__option'));
            }  
        })
    }
}

$('#prodModal').on('hide.bs.modal', function(e) {
    $("#prod_content").empty();
});

init();