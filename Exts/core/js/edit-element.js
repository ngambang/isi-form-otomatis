
var url_string = window.location.href; 
var url = new URL(url_string);
var id = url.searchParams.get("id");
var label = url.searchParams.get("label");

$("#btn-pilih-element").click(e=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "pilih element"})
    });
})

$("#btn-tes-element").click(e=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "tes element",data:$("#pilih-element").val()})
    });
})

$("#batal-element").click(e=>{
    history.back();
})


// terima pesan dari luar 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch(message['action']){
    case "kirim element":
      var html = "";  
      var elm = message['data'];
          html += `<option>${elm['element']}</option>`;
          elm['attr'].forEach(e=>{
            html +=  `<option>[${e}]</option>`;
          })
      $("#pilih-element").html(html);
    break;
 
  }
 
})

axios.get('http://localhost:4696/element-detail/'+id)
.then(function (response) {
  console.log(response.data)
  $("#pilih-element").append("<option>"+response.data[0].elm+"</option>")
  $("#aksi-element").val(response.data[0].aksi);
  $("#label-db").val(response.data[0].database);
})
.catch(function (error) {
  alert(error.message);
});

$("#simpan-element").click(()=>{

  var pilih_elm = $("#pilih-element").val();
  var aksi_elm  = $("#aksi-element").val();
  var label_db  = $("#label-db").val();

  if(pilih_elm !== "" && aksi_elm !== "" && label_db !== ""){

      axios.post('http://localhost:4696/edit-element/'+id, {
        id:id,
        elm: pilih_elm,
        aksi_elm: aksi_elm,
        db : label_db
      })
      .then(function (response) {
        window.location.href= "element.html?id="+label;

      })
      .catch(function (error) {
        alert(error.message);
      });

  }else{
      alert("harap isi semua kolom");
  }

})