var cartFunction = { 
    
    hasItem : function () { 
        if(localStorage.getItem('cart') !== null) { 
            return true;

        }else { 
            return false;
        }
    },
    getItem: function() { 
        if(cartFunction.hasItem()) { 
            return JSON.parse(localStorage.getItem('cart'));
        }else { 
            return { items: {} }
        }
    }
}

var amount_btn = { 
    increase: function() { 
        
    },
    decrease: function() { 

    },
    getButtonID() { 

    }
}





var loading = { 
    elem : $("#loading") ,
    show : function() {

        $(this.elem).show();
    },
    hide: function()  {

        $(this.elem).hide();
    }
}