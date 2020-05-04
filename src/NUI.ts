namespace NUI {
	var body;
	var watches;

	export function init() {
		body = $('body')

		watches = $('<div id="bloobs">')

		body.append(watches);
	}

	export class Bloob {
		el: JQuery

		constructor(text) {
			this.el = $('<div class="bloob">')
			this.set_text(text);

			watches.append(this.el);
		}

		set_text(text) {
			this.el.text(text);
		}
	}

	export function bloob(text: string) {

		return new Bloob(text);
		
	}
}

export { NUI };