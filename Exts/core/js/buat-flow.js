arr = [];
$( "#sortable" ).sortable({
    activate: function( event, ui ) {
       var arr = [];
       $(".pilihan-a").each((idx,elm)=>{
        var id = $(elm).data("value");
        arr.push(id)
       })

       $("#label-value").val(arr.join(","))
    }
});

axios.get('http://localhost:4696/label')
.then(function (response) {
    var html = "";
    response.data.forEach(element => {
        html += `<option value='${element['id']}'>${element['nama']}</option>`;
    });
    $("#pilihan").html(html)
})
.catch(function (error) {
  alert(error.message); 
});

$("#tambah").click(()=>{
    var inp     = $("#pilihan").val();
    var inpText = $("#pilihan option:selected").text();

    if(arr.indexOf(inp) == -1){
        var list = `<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s pilihan-a" data-value='${inp}'></span>${inpText.toUpperCase()}</li>`;
        arr.push(inp);
    }
    $("#label-value").val(arr.join(","));
    $("#sortable").append(list)
})

$('form').submit(function (evt) {
    evt.preventDefault();
    var label = $("#label").val();
    var label_value = $("#label-value").val();
    var arr = {label:label,label_value:label_value};
    
    // Mengirim data menggunakan Axios
    axios.post('http://localhost:4696/simpan-flow/', arr)
    .then(function(response) {
            window.location.href = "alur.html";
    })
    .catch(function(error) {
        console.log(error)
    });


});