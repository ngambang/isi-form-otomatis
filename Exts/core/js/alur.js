
axios.get('http://localhost:4696/flow/')
.then(function (response) {
    var html = "";
    response.data.forEach(element => {
        html += `<a href="#" class="list-group-item list-group-item-action">
                        ${element['nama']} 
                        <button class='btn btn-danger btn-sm float-right hapus-element' data-id='${element['id']}'>Hapus</button>
                        <button class='btn btn-primary btn-sm float-right mr-2 edit-element' data-id='${element['id']}'>Edit</button>
                        <button class='btn btn-success btn-sm float-right mr-2 play-element' data-id='${element['id']}'>Mulai</button>
                </a>`;
    });

    $("#label").html(html)

    $(document).on('click', ".hapus-element", function() {
        var id = $(this).data("id");
        axios.delete('http://localhost:4696/flow/'+id)
        .then(function (response) {
         location.reload();
        })
    })
	
	
    $(document).on('click', ".play-element", function() {
        var id = $(this).data("id");
        axios.get('http://localhost:4696/mulai-flow/'+id)
        .then(function (response) {
		  console.log(response)
        })
    })
    
    $(document).on('click', ".edit-element", function() {
       window.location.href= "edit-flow.html?id="+$(this).data("id");
    })
})