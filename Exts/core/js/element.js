var url_string = window.location.href; 
var url = new URL(url_string);
var id = url.searchParams.get("id");

axios.get('http://localhost:4696/element/'+id)
.then(function (response) {
    var html = "";
    response.data.forEach(element => {
        html += `<a href="#" class="list-group-item list-group-item-action">
                        ${element['elm']} [${element['database']}] 
                        <button class='btn btn-danger btn-sm float-right hapus-element' data-id='${element['id']}'>Hapus</button>
                        <button class='btn btn-primary btn-sm float-right mr-2 edit-element' data-id='${element['id']}' data-id-label='${id}'>Edit</button>
                </a>`;
    });

    $("#label").html(html)
    $(document).on('click', ".hapus-element", function() {
        var id = $(this).data("id");
        axios.delete('http://localhost:4696/element/'+id)
        .then(function (response) {
         location.reload();
        })
    })
    
    $(document).on('click', ".edit-element", function() {
       window.location.href= "edit-element.html?id="+$(this).data("id")+"&label="+$(this).data("id-label");
    })

})

$("#tambah-element").click(()=>{window.location.href="tambah-element.html?id="+id});