$(document).ready(function () {

    $('#inverted_calendar').calendar({
        type: 'date'
    });

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
                    $('#agreement_type').append(`<option value="${element._id}">${element.name}</option>`)
                    $('#agreement_type_search').append(`<option value="${element._id}">${element.name}</option>`)
                });
            });
    })()

    const selectElement = document.querySelector('#file');

    selectElement.addEventListener('change', async (event) => {

        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        try {
            const response = await axios({
                method: "post",
                url: '/file/uploadfile',
                data: formData,
            });
            console.log(response.data);
            document.querySelector("#file_url").classList.add("text-green");
            $('#file_url').attr("file_url", response.data);
        } catch (error) {
            console.log(error);
        }
    });


    document.querySelector('#agreement-add').addEventListener('click', async () => {

        const formData = {};

        formData.organization_name = $('#organization_name').val()
        formData.tel_number = $('#tel_number').val()
        formData.contract_number = $('#contract_number').val()
        formData.contract_date = new Date($('#contract_date').val())
        formData.agreement_type = $('#agreement_type').val()
        formData.description = $('#description').val()
        formData.agreement_file = $('#file_url').attr("file_url")

        console.log(formData)

        try {
            const response = await axios({
                method: "post",
                url: '/agreement',
                data: formData,
            });
            console.log(response.data);
            window.location.href = "/agreements"
        } catch (error) {
            console.log(error);
        }

    })

    $('#agreements_search_btn').click(function(event){
        window.location.href = `/agreements/?page=1&organization_name=${$('#organization_name_search').val()}&contract_number=${$('#contract_number_search').val()}&tel_number=${$('#tel_number_search').val()}&agreement_type=${$('#agreement_type_search').val()}&description=${$('#description_search').val()}`
        console.log(`/agreements/?page=1&organization_name=${$('#organization_name_search').val()}&contract_number=${$('#contract_number_search').val()}&tel_number=${$('#tel_number_search').val()}&agreement_type=${$('#agreement_type_search').val()}&description=${$('#description_search').val()}`)
    })
})

function removeAgreements(event) {
    const options = {
        url: '/agreement/remove',
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
