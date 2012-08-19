var fs = require('fs'),
	prompt = require('prompt'),
	spawn = require('child_process').spawn,
	optimist = require('optimist'),
	async = require('async');

function spawnProcess(program, args, callback) {
	var ps = spawn(program, args);
	
	var progData = '';
	ps.stdout.on('data', function (data) {
	  progData += data;
	});
	ps.on('exit', function (code) {
	  if (code == 0) {
		callback(progData);
	  }
	});
}

function runFTP(host,user,pass,addList,deleteList){
	var FTPClient = require('ftp');
	var conn = new FTPClient({host:host});
	conn.on('connect', function(){
		conn.auth(user,pass,function(err){
			if (err) throw err;
			console.log('Connected. Uploading...');
			function uploadFile(err) {
				if (err) { console.log(err); conn.end(); }
				if (addList.length > 0) {
					var fileName = addList.shift();
					console.log('Uploading: ' + fileName);
					conn.put(fs.createReadStream(fileName), fileName, uploadFile);
				} else {
					conn.end();
				}
			};
			uploadFile();
		});
	});
	conn.on('close', function(hasError){
		if (hasError){
			console.log('Connection closed with an error.');
		} else {
			console.log('Publish completed sucessfully.');
			process.exit();
			//TODO: update published file
		}
	});
	conn.on('error', function(err){
		console.log(err);
		conn.end();
	});
	conn.connect();
}

spawnProcess('hg', ['summary'], function(summary){
	var toRev = parseInt(summary.split('\n')[0].split(':')[1]);
	var fromRev = 0;
	if (fs.existsSync('.lastpublish')) {
		fromRev = parseInt(fs.readFileSync('.lastpublish'));
	}
	console.log('publishing from revision ' + fromRev + ' to ' + toRev);
	
	if (toRev > fromRev) {
		console.log('getting file list');
		spawnProcess('hg', ['status', '--rev', fromRev+':'+toRev], 
			function(fileList){
				fileList = fileList.split('\n');
				var removeList = [], copyList = [];
				for (var i in fileList) {
					var file = fileList[i].substring(2);
					//only interested in added or modified files
					if (fileList[i][0] == 'A' || fileList[i][0] == 'M') {
						copyList[copyList.length] = file;
					}
					//otherwise add to remove list
					else {
						removeList[removeList.length] = fileList[i].substring(2);
					}
				}
				console.log('upload list: ' + copyList);
				console.log('delete list: ' + removeList);
				console.log('');
				prompt.override = optimist.argv;
				prompt.start();
				prompt.get(['host', 'username', { name: 'password', hidden:true }],
					function(err, result){
						if (err) console.log(err);
						else runFTP(result.host, result.username, result.password, copyList, removeList);
					});
		});
	} else {
		console.log('website is up to date');
	}
});