var url_string = window.location.href; 
var url = new URL(url_string);
var id = url.searchParams.get("id");

axios.get('http://localhost:4696/label/'+id)
.then(function (response) {
    $("#nama_label").val(response.data[0].nama);
    $("#url_label").val(response.data[0].url);
})


$("form#form").submit(function(e) {
    e.preventDefault();    
    let file = document.querySelector('input[type="file"]').files[0];
    var nama = $("#nama_label").val();
    var url = $("#url_label").val();
    
    // Membuat objek FormData untuk mengirim file
    let formData = new FormData();
    formData.append('file', file);
    formData.append('nama', nama);
    formData.append('url', url);

    // Mengirim data menggunakan Axios
    axios.post('http://localhost:4696/edit-label/'+id, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
    })
    .then(function(response) {
        window.location.href = "index.html";
    })
    .catch(function(error) {
        console.error('Upload gagal:', error);
    });
})
