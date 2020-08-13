
var get = {
    menu_group : function () { 
        return (
            axios({
                method: 'get',
                url: 'https://asia-east2-cube-family-delivery-dev.cloudfunctions.net/api/menu_group'
            })
        )
    },

    menu : function (id = '') { 
        return (
            axios({
                method: 'get',
                url: 'https://asia-east2-cube-family-delivery-dev.cloudfunctions.net/api/menu/' + id
            })
        )
    },

    menu_group2: function() { 
        return (
            axios({
                method: 'get',
                url: 'https://murmuring-scrubland-05877.herokuapp.com/api/products/categories'
            })
        )
    },


    menu2 : function (id = '') { 
        return (
            axios({
                method: 'get',
                url: 'https://murmuring-scrubland-05877.herokuapp.com/api/products/' + id
            })
        )
    },
}
