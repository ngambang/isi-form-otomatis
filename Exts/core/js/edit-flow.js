var url_string = window.location.href; 
var url = new URL(url_string);
var id = url.searchParams.get("id");

(async ()=>{
    var arr = [];
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

    await axios.get('http://localhost:4696/label')
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
    
    
    await axios.get('http://localhost:4696/flow/'+id)
    .then(function (response) {
        
        data = response.data;
        console.log(data)
        $("#label").val(data[0]['nama']);
        data[0]['id_label'].split(",").forEach(element => {
            if(element){
                var txt = document.querySelector(`#pilihan [value='${element}']`).innerText;
    
                var list = `<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s pilihan-a" data-value='${element}'></span>${txt.toUpperCase()}</li>`;
                arr.push(element);
                $("#sortable").append(list)
            }
        });

        $("#label-value").val(arr.join(","));
        
        if(data[0]['aktif'] == 1){
            $("#aktif").attr("checked", "checked");
        }
    })


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
        var aktif = ($('#aktif').is(':checked'))?1:0;
        var arr = {label:label,label_value:label_value,aktif:aktif};
        console.log(arr)
        // Mengirim data menggunakan Axios
        axios.post('http://localhost:4696/edit-flow/'+id, arr)
        .then(function(response) {
                window.location.href = "alur.html";
        })
        .catch(function(error) {
            console.log(error)
        });


    });




})()