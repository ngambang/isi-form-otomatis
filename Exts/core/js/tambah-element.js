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

var url_string = window.location.href; 
var url = new URL(url_string);
var id = url.searchParams.get("id");

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

  $("#simpan-element").click(()=>{

    var pilih_elm = $("#pilih-element").val();
    var aksi_elm  = $("#aksi-element").val();
    var label_db  = $("#label-db").val();

    if(pilih_elm !== "" && aksi_elm !== "" && label_db !== ""){

        axios.post('http://localhost:4696/simpan-element', {
          id:id,
          elm: pilih_elm,
          aksi_elm: aksi_elm,
          db : label_db
        })
        .then(function (response) {
          window.location.href="element.html?id="+id;
        })
        .catch(function (error) {
          alert(error.message);
        });

    }else{
        alert("harap isi semua kolom");
    }

  })