namespace NUI {
	var body;
	var watches;

	export function init() {
		body = $('body')

		watches = $('<div id="watches">')

		body.append(watches);
	}

	export class Watch {
		el: JQuery

		constructor(text) {
			this.el = $('<div class="watch">')
			this.set_text(text);

			watches.append(this.el);
		}

		set_text(text) {
			this.el.text(text);
		}
	}

	export function watch(text: string) {

		return new Watch(text);
		
	}
}

export { NUI };