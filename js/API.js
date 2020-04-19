axios({
    method: 'get',
    url: 'http://localhost:5000/cube-family-delivery-dev/asia-east2/api/menu_group'
});


var get = {
    menu_group : function () { 
        return (
            axios({
                method: 'get',
                url: 'http://localhost:5000/cube-family-delivery-dev/asia-east2/api/menu_group'
            })
        )
    },

    menu : function (id = '') { 
        return (
            axios({
                method: 'get',
                url: 'http://localhost:5000/cube-family-delivery-dev/asia-east2/api/menu/' + id
            })
        )
    },
}
