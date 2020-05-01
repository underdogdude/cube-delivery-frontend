
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
}
