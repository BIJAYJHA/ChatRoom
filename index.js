var http=require('http');
var fs= require('fs');
var path=require('path');
var mime=require('mime');
var cache={};
var chatServer=require('./lib/chat_server');

function send404(response){
	response.writeHead(404,{'Content-Type':'text/plain'});
	response.write('Error 404 :page not found.');
	response.end();
}
function sendFile(response,filepath,fileContents){
  response.writeHead(
   200,
   {"Content-Type":mime.lookup(path.basename(filepath))}
  	);
  response.end(fileContents);

}
function serverStatic(response,cache,absPath){
if(cache[absPath]){
	sendFile(response,absPath,cache[absPath]);
}
else{
	fs.exists(absPath,function(exists){
		if(exists){
			fs.readFile(absPath,function(err,data){
				if(err){
					send404(response);
				}
				else{
					cache[absPath]=data;
					sendFile(response,absPath,cache[absPath]);
				}
			})
		}
		else{
			send404(response);
		}
	})
}

}
var server=http.createServer(function(request,response){
   var filepath=false;
   if(request.url=='/'){
  filepath='public/index.html';
   }
   else{
   	filepath='public'+request.url;
   }
var absPath='./'+filepath;
serverStatic(response,cache,absPath);
}).listen(3000,'192.168.43.131',function(){
	console.log("server is started on port 3000");
})
chatServer.listen(server);