var term = new Terminal({
  convertEol: true,
  scrollback: 10000,
  disableStdin: true,
  cursorBlink: true,
});
term.open(document.getElementById('terminal'), {
  focus: true,
});
term.fit();
window.addEventListener('resize', function() {
  term.fit();
});

var host = location.search.slice(1)
if(!host){
  var url = 'ws://localhost:43110/'  
}else if(!isNaN(parseInt(host))){
  var url = 'ws://localhost:' + host
}else{
  var url = host;
}

var socket = new WebSocket(url);
socket.binaryType = 'arraybuffer';
var stringWarning;

socket.onmessage = function(event) {
  var data = event.data;
  if(typeof data == 'string'){
    var str = data;
    if(!stringWarning){
      console.warn('Incoming messages are strings, use the --binary option.')
      stringWarning = true;
    }
  }else{
      var str = new TextDecoder('utf-8').decode(new Uint8Array(data));  
  }
  
  term.write(str);
};

socket.onclose = function() {
  term.setOption('cursorBlink', false);
};