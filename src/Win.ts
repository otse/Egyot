namespace Win {
	var body, win;

	var bloobs;

	export function init() {
		(document as any).Win = Win;

		body = $('body');
		win = $('#win');

		bloobs = $('<div id="bloobs">');

		body.append(bloobs);
	}

	export function raw(html: string) {
		let jay = $(html);

		win.append(jay);

		return jay;
	}
}

export { Win };