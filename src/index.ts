interface Window { save: any; }

{
	const PATH = require('path');
	const FS = require('fs');
	const H2C = require('html2canvas');

	const $holder = <HTMLDivElement>document.getElementById('holder');
	const $name = <HTMLDivElement>document.getElementById('name');
	const $canvas = <HTMLCanvasElement>document.getElementById('canvas');
	const context = $canvas.getContext('2d');

	H2C($holder).then(function(c:HTMLCanvasElement) {
		$canvas.width = c.width;
		$canvas.height = c.height;
		context.drawImage(c, 0, 0);
	});

	console.log(
		'Call %csave(userNameList)%c to export image files:',
		'color: #c7254e; background-color: #f9f2f4; padding: 0 3px;',
		'',
	);

	function* exportImage(userList) {
		for (let i = 0; i < userList.length; i += 1) {
			const name = String(userList[i]);
			$name.innerText = name;
			yield name;
		}
	}

	window.save = (userList: Array<string>) => {
		// Check list
		if (!Array.isArray(userList)) {
			console.error('Not a array!');
			return;
		}

		// file generation
		for (let name of exportImage(userList)) {
			console.log('!!!', name);
		}
	};
}
