$(document).ready(function () {
    (() => {
        const options = {
            url: '/agreements-type/types',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {}
        };

        axios(options)
            .then(response => {
                response.data.forEach((element, index) => {
                    $('#agreements-tb').append(`<tr>
                        <td data-label="TR">${index+1}</td>
                        <td data-label="Nomi">${element.name}</td>
                        <td data-label="Update">
                            <button data-id=${element._id} class="ui primary basic button" onclick="updateAgreements(event)">
                                <i class="pencil alternate icon" data-id=${element._id}></i>
                            </button>
                            <button data-id=${element._id} class="ui red basic button" onclick="deleteAgreements(event)">
                                <i class="archive icon" data-id=${element._id}></i>
                            </button>
                        </td>
                    </tr>`)
                });
            });
    })()

    $( "#agreements-add-btn" ).click(function() {
        const options = {
            url: '/agreements-type',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
                name: $('#new-agreements-name').val(),
            }
        };

        axios(options)
            .then(response => {
                window.location.reload();
            }).catch(error => {
                window.location.reload();
            });
      });

    $("#agreements-exit-btn").click(function(){
        $('#agreements-modal').addClass('dbn')
    })
    $("#agreements-update-btn").click(function(event){
        const options = {
            url: '/agreements-type/update',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
                _id: event.target.getAttribute("data-id"),
                name: $('#update-agreements-name').val()
            }
        };

        axios(options)
            .then(response => {
                window.location.reload();
            }).catch(error => {
                window.location.reload();
            })
    })
})

function deleteAgreements(event){
    console.log(event.target.getAttribute("data-id"));
    const options = {
        url: '/agreements-type/remove',
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

function updateAgreements(event){
    const options = {
        url: `/agreements-type/type-one?id=${event.target.getAttribute("data-id")}`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {}
    };

    axios(options)
        .then(response => {
            $('#update-agreements-name').val(response.data.name)
            $('#agreements-update-btn').attr('data-id',response.data._id) 
        });
    $('#agreements-modal').removeClass('dbn')
}