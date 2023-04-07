chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    switch (message['action']) {
        case "url sekarang":
            sendResponse(document.URL);
            break;
        case "buka url":
            window.location = message['data'];
            break;
        case "pilih element":
            document.addEventListener("mouseover",LintarevtHover);
            document.addEventListener("click",LintarevtClick);
            break;
        case "tes element":
            if(document.querySelector(message['data'])){
                document.querySelector(message['data']).classList.add("alerts-border");
                setTimeout(() => {
                    document.querySelector(message['data']).classList.remove("alerts-border");
                }, 5000);
            }else{
                alert("Element tidak ditemukan")
            }
            break;
        default:
            break;
    }

    return true
});


var elmNt = '';
function LintarevtHover(params) {
    (elmNt !=='')?elmNt.classList.remove('lintar-active-class'):'';
    params.target.classList.add('lintar-active-class');
    elmNt = params.target;
}

function LintarevtClick(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    (elmNt !=='')?elmNt.classList.remove('lintar-active-class'):'';
    var msg = e.target.outerHTML

    //add element
    var element = '';
    if(e.target.id){
        element = '#'+e.target.id;
    }else{
        var taglagi = getDomPath(e.target)
        element = taglagi.join(" > ");
    }
    
    //end element
    
    var attr = [].slice.call(e.target.attributes)
    var attribute = [];
    attr.forEach(ttr=>{
        attribute.push(`${ttr.name}='${ttr.value}'`)
    })

    chrome.runtime.sendMessage({action: "kirim element",data:{'html':msg,'element':element,'attr':attribute}});
    document.removeEventListener("mouseover",LintarevtHover);
    document.removeEventListener("click",LintarevtClick);
    return false;

}

function getDomPath(el) {
  var stack = [];
  while ( el.parentNode != null ) {
    console.log(el.nodeName);
    var sibCount = 0;
    var sibIndex = 0;
    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
      var sib = el.parentNode.childNodes[i];
      if ( sib.nodeName == el.nodeName ) {
        if ( sib === el ) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if ( el.hasAttribute('id') && el.id != '' ) {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if ( sibCount > 1 ) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode;
  }
  return stack.slice(1); // removes the html element
}