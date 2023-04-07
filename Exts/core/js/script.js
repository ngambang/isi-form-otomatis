$("form#form").submit(function(e) {
  e.preventDefault();    
    let file = document.querySelector('input[type="file"]').files[0];
    var nama = $("#nama_label").val();
    var url = $("#url_label").val();

    let formData = new FormData();
    formData.append('file', file);
    formData.append('nama', nama);
    formData.append('url', url);

    if(nama !== "" && url !== ""){      
      axios.post('http://localhost:4696/simpan-label',formData)
      .then(function (response) {
        window.location.href="element.html?id="+response.data.msg;
      })
      .catch(function (error) {
        alert(error.message);
      });
    }else{
        alert("Nama & Url harus diisi");
    }

})

function isValidURL(string) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(string);
};
  