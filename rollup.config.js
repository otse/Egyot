const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'js/lib/App.js',
	output: {
		name: 'duc',
		file: 'bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: false,
		external: [ '' ]
	}
};