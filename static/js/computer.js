$(document).ready(function () {

    document.querySelector('#computer-add').addEventListener('click', async () => {

        const formData = {};

        // computer_number model ram cpu memory video_card window_size
    
        formData.computer_number = $('#computer_number').val()
        formData.model = $('#model').val()
        formData.ram = $('#ram').val()
        formData.cpu = $('#cpu').val()
        formData.memory = $('#memory').val()
        formData.video_card = $('#video_card').val()
        formData.window_size = $('#window_size').val()
    
        console.log(formData)
    
        try {
            const response = await axios({
                method: "post",
                url: '/computer',
                data: formData,
            });
            console.log(response.data);
            window.location.href = "/computer"
        } catch (error) {
            console.log(error);
        }
    
    })

    $('#computer_search_btn').click(function(event){
        window.location.href = `/computer/?page=1&computer_number=${$('#computer_number_search').val()}&model=${$('#model_search').val()}&ram=${$('#ram_search').val()}&cpu=${$('#cpu_search').val()}&memory=${$('#memory_search').val()}&video_card=${$('#video_card_search').val()}&window_size=${$('#window_size_search').val()}`
    })
})

function removeComputer(event) {
    const options = {
        url: '/computer/remove',
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