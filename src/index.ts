interface Window { save: any; }

{
	const PATH = require('path');
	const FS = require('fs');
	const MKDIR = require('mkdirp');
	const H2C = require('html2canvas');

	const $holder = <HTMLDivElement>document.getElementById('holder');
	const $name = <HTMLDivElement>document.getElementById('name');
	const $canvas = <HTMLCanvasElement>document.getElementById('canvas');
	const context = $canvas.getContext('2d');

	/* H2C($holder).then(function(c:HTMLCanvasElement) {
		$canvas.width = c.width;
		$canvas.height = c.height;
		context.drawImage(c, 0, 0);
	}); */

	console.log(
		'Call %csave(userNameList)%c to export image files:',
		'color: #c7254e; background-color: #f9f2f4; padding: 0 3px;',
		'',
	);

	const exportImage = async (name, dir) => (
		new Promise((resolve, reject) => {
			const path = PATH.resolve(dir, `${name}.png`);
			$name.innerText = name;

			console.log('Export:', path);
			requestAnimationFrame(() => {
				// Draw canvas
				H2C($holder).then(function(c:HTMLCanvasElement) {
					$canvas.width = c.width;
					$canvas.height = c.height;
					context.drawImage(c, 0, 0);

					const dataURL = $canvas.toDataURL();
					const base64 = dataURL.replace(/^data:image\/\w+;base64,/, "");
					const buffer = new Buffer(base64, 'base64');

					FS.writeFile(path, buffer, (err, res) => {
						if (err) {
							console.error(err);
							reject(err);
							return;
						}

						resolve(res);
					});
				});
			});
		})
	);

	const exportUserImages = async (userList, dir, index = 0) => {
		const current = userList[index];
		if (!current) return Promise.resolve(true);

		return exportImage(current, dir).then(() => {
			return exportUserImages(userList, dir, index + 1);
		});
	};

	window.save = (userList: Array<string>) => {
		// Check list
		if (!Array.isArray(userList)) {
			console.error('Not a array!');
			return;
		}

		// file generation
		const dir = PATH.resolve(__dirname, 'export');
		MKDIR(dir, (err) => {
			if (err) throw err;

			exportUserImages(userList, dir).then(() => {
				console.log('Export done!');
			});
		});
	};
}
