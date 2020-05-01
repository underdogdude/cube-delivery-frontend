var myCart = {
    showBtn: function () {
        var cartItems = JSON.parse(localStorage.getItem("cart")).items;
        var get_amount = 0;
        var get_total = 0;

        for (var i in cartItems) {
            get_total += cartItems[i].totalPrice * cartItems[i].qty;
            get_amount += cartItems[i].qty;
        }

        $("#mycart_total").html(get_total.toLocaleString());
        $("#mycart_amount").html(get_amount);
        $("#mycart__btn_container").css("display", "block");
    },
    clicked: function () {
        console.log("add cart slick");
        var element = document.querySelector("main");
        element.classList.add("animated", "slideOutLeft");
        element.addEventListener("animationend", function () {
            window.location = "./mycart.html";
        });
    },
};


var cartLists = {
    
    render: function(items) { 

        var cartlist_elem = $("#cartlist");
            $(cartlist_elem).empty();
        var string = ``;

        for( var i in items ) {

           console.log(items[i] , "list");
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
                        <i class="far fa-trash-alt"></i>
                    </div>
                </div>
                <div class="cartlist__footer">
                    <span class="price">
                        ${ (items[i].totalPrice * items[i].qty).toLocaleString()}
                        บาท
                    </span>
                    <div class="custom-input-checkout">
                        <button type="button" class="cic-btn cic-btn-1 cic-btn-small cic-decrement">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                            class="cic-input" id="quatityInput"
                            step="1" 
                            value="${items[i].qty}" 
                            min="0"
                            max="99"
                        />
                        <button type="button" class="cic-btn cic-btn-1 cic-btn-small cic-increment">
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
                        console.log(optionLists[i].values[j],' J');
                        optionStringValues += `${optionLists[i].values[j].name } `;
                    }
                    optionString += optionStringValues;
                }
                optionString += `</br>`;
            }
        }
        return optionString;
    }
}
