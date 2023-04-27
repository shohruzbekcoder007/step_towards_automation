$(document).ready(function () {

    document.querySelector('#log-add').addEventListener('click', async () => {

        const formData = {};

        formData.server_name = $('#server_name').val()
        formData.address = $('#address').val()
        formData.message = $('#message').val()

        console.log(formData)

        try {
            const response = await axios({
                method: "post",
                url: '/logs',
                data: formData,
            });
            console.log(response.data);
            window.location.href = "/all-logs"
        } catch (error) {
            console.log(error);
        }

    })

    $('#logs_search_btn').click(function(event){
        window.location.href = `/all-logs/?page=1&server_name=${$('#server_name_search').val()}&address=${$('#address_search').val()}&message=${$('#message_search').val()}`
    })
})

function removeLogs(event) {
    const options = {
        url: '/logs/remove',
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
            _id: event.target.getAttribute("data-id"),
        }
    };

    axios(options)
        .then(response => {
            window.location.reload();
        }).catch(error => {
            window.location.reload();
        });
}
