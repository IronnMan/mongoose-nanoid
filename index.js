const { nanoid, customAlphabet } = require('nanoid');

const DEFAULT_LENGTH = 12;

function generator(opts) {
	return opts.alphabets ? customAlphabet(opts.alphabets, DEFAULT_LENGTH) : nanoid
}

function nanoidPlugin(schema, opts) {

	opts.length = opts.length || DEFAULT_LENGTH;
	const filed = opts.field || '_id';

	schema.add({
		[filed]: {
			type: String,
			default: '',
		},
	});

	schema.pre('save', function (next) {
		if (this.isNew && !this.constructor.$isArraySubdocument) {
			attemptToGenerate(this, opts)
				.then(function (newId) {
					this[opts.field] = newId;
					next()
				})
				.catch(next)
		} else next();
	});
}

function attemptToGenerate(doc, opts) {
	const id = generator(opts)(opts.length);
	return doc.constructor.findById(id)
		.then(function (found) {
			if (found) return attemptToGenerate(doc, opts.length);
			return id
		})
}

module.exports = nanoidPlugin;
