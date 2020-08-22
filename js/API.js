
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

var woocommerceAPI = {
    baseURL: "https://murmuring-scrubland-05877.herokuapp.com/api",
    getOrder: function(userID) { 
        return (
            axios({
                method: 'get',
                url: 'https://murmuring-scrubland-05877.herokuapp.com/api/orders/?customer_id=' + userID
            })
        )
    },
    createOrder: function(data) {
        console.log('create order data', data)
        return axios({
            method: 'post',
            url: this.baseURL + '/orders',
            data: data
        }).then(function(response) {
            console.log('create order response ', response)
            return response.data
        })
    },
    deleteOrder: function(orderID) { 
        return (
            axios({
                method: 'delete',
                url: 'https://murmuring-scrubland-05877.herokuapp.com/api/orders/' + orderID
            },{force: true})
        )
    },
    searchCustomerId: function(email) {
        return axios({
            method: 'get',
            url: this.baseURL + '/customers?email=' + email
        }).then(function(response) {
            console.log('search CustomerId response ', response)
            if (response.data[0] == undefined) return false
            return response.data[0].id
        })
    },
    createCustomer: function(data) {
        return axios({
            method: 'post',
            url: this.baseURL + '/customers',
            data: data
        }).then(function(response) {
            console.log('create customer response ', response)
        })
    }
}
