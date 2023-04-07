axios.get('http://localhost:4696/label')
.then(function (response) {
    var html = "";
    response.data.forEach(element => {
        html += `<a href="#" class="list-group-item list-group-item-action">
                        ${element['nama']} - ${element['file']} 
                        <button class='btn btn-danger btn-sm float-right hapus-label' data-id='${element['id']}'>Hapus</button>
                        <button class='btn btn-success btn-sm float-right mr-2 edit-label-element' data-id='${element['id']}'>Edit Element</button>
                        <button class='btn btn-primary btn-sm float-right mr-2 edit-label' data-id='${element['id']}'>Edit</button>
                </a>`;
    });

    $("#label").html(html)
    
    $(document).on('click', ".edit-label", function() {
       window.location.href= "edit-script.html?id="+$(this).data("id");
    })

    $(document).on('click', ".edit-label-element", function() {
      window.location.href= "element.html?id="+$(this).data("id");
   })

    $(document).on('click', ".hapus-label", function() {
       var id = $(this).data("id");
       axios.delete('http://localhost:4696/label/'+id)
       .then(function (response) {
        location.reload();
       })
    })
})
.catch(function (error) {
  alert(error.message); 
});
