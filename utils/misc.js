/** Create a DOM Element
 * @param {string} type - Type of DOM element, eg. 'div', 'input', etc...
 * @param {Array<{ key: string, value: string }>} attributes - Attributes of the element, eg. 'onchange', 'title', etc...
 * @param {string} text - Text for inside the element
 * @returns {HTMLElement} - The created DOM element.
 */
function createDOMElement(type, attributes, text) {
	const element = document.createElement(type);
	if (text) {
		element.innerText = text;
	}
	if (attributes) {
		Object.entries(attributes).forEach(([key, value]) => {
			if (key.indexOf("on") === 0) {
				element.addEventListener(key.substring(2), value);
			} else {
				element.setAttribute(key, value);
			}
		});
	}
	return element;
}

/** Create input with label
 * @param {string} labelText - Text displayed on the label
 * @param {Array<{ key: string, value: string }>} attributes - Attributes of the element, eg. 'onchange', 'title', etc...
 * @returns {HTMLElement} - A div with a label and input elements.
 */
function createInputWithLabel(labelText, attributes) {
	const element = document.createElement("div");
	element.appendChild(
		createDOMElement(
			"label",
			{
				for: attributes["id"] || labelText.toLowerCase(),
				class: attributes["labelClass"],
			},
			labelText
		)
	);
	element.appendChild(
		createDOMElement("input", {
			id: labelText.toLowerCase(),
			title: labelText,
			...attributes,
		})
	);
	return element;
}

function createButtonWithIcon(attributes) {
	const button = createDOMElement("button", attributes);
	const image = new Image();
	image.src = `drawings/icons/${attributes.iconName}.png`;
	image.classList.add("icon");
	button.appendChild(image);
	return button;
}

function createRadioWithImage(iconName, labelText, attributes) {
	const element = document.createElement("div");
	const label = createDOMElement("label", {
		for: attributes["id"] || iconName.toLowerCase(),
		class: "radio-button-button",
	});
	const image = new Image();
	image.src = `drawings/icons/${iconName.toLowerCase()}.png`;
	image.classList.add("icon");
	image.title = attributes.title || labelText;
	label.appendChild(image);

	element.appendChild(label);
	element.appendChild(
		createDOMElement("input", {
			id: labelText.toLowerCase(),
			...attributes,
		})
	);
	return element;
}

function getValue(element) {
	return element.value;
}

function setValue(element, value) {
	element.value = value;
}

function formatAngle(angle) {
	return (angle * 180) / Math.PI;
}

function makeSpace(length) {
	let str = "";
	for (let i = 0; i < length; i++) {
		str += String.fromCharCode(8202); // append thin space
	}
	return str;
}

function resizeStage(newWidth, newHeight) {
	STAGE_PROPERTIES.width = newWidth;
	STAGE_PROPERTIES.height = newHeight;
	viewport.resizeStage(newWidth, newHeight);
	viewport.drawShapes();
}

function rotateCanvas(ctx, center, rotation) {
	if (rotation == 0) return;
	ctx.translate(center.x, center.y);
	ctx.rotate(rotation);
	ctx.translate(-center.x, -center.y);
}

class TimeSharer {
	static opRecords = {}

	static run(key, operation, opInterval = 500) {
		if (TimeSharer.opRecords[key]) {
			let opRecord = TimeSharer.opRecords[key]
			if (Date.now() - opRecord.opTime < opRecord.opInterval) {
				const latestOpTime = opRecord.opTime
				opRecord.latestOp = operation
				setTimeout(
					() => {
						if (opRecord.opTime === latestOpTime && opRecord.latestOp) {
							// no operations since so run the last skipped op
							opRecord.latestOp()
							opRecord.latestOp = null // dedup executing last op
						}
					},
					opRecord.opInterval
				)
				return opRecord.result
			}
			opRecord.result = operation()
			opRecord.opTime = Date.now()

			return opRecord.result
		}
		let opRecord = {}
		opRecord.result = operation()
		opRecord.opTime = Date.now()
		opRecord.opInterval = opInterval
		TimeSharer.opRecords[key] = opRecord
		return opRecord.result
	}

}

function hslToHex(h,s,l){
	const a = s * Math.min(l, 1 - l);
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex){
	const r = parseInt(hex.substring(1, 3), 16) / 255;
	const g = parseInt(hex.substring(3, 5), 16) / 255;
	const b = parseInt(hex.substring(5, 7), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [h * 360, s, l];
}