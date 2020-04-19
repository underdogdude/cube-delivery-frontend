
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
                                        ${value.description.slice(0, 144)} ...
                                    </span>
                                    <div class="menu__layout-footer">
                                        <span class="price">
                                            ${value.price}
                                        </span>
                                        <a class="btn btn-sm btn-outline-secondary" href="menu_detail.html?id=${value.menu_id}">
                                            ADD
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

init();