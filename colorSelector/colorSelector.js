class ColorSelector {
	constructor(
		holderDiv,
		width = 150,
		height = 100,
		hue = 0,
		saturation = 0.5,
		value = 1,
		showFill = true
	) {
		this.holderDiv = holderDiv;

		this.width = width;
		this.height = height;

		this.hue = hue;
		this.saturation = saturation;
		this.value = value;
		this.showFill = showFill;

		// controls saturation and lightness
		this.svCanvas = document.createElement("canvas");
		this.svCanvas.width = this.width;
		this.svCanvas.height = this.height;

		this.svCtx = this.svCanvas.getContext("2d");
		this.holderDiv.appendChild(this.svCanvas);

		this.outputAndHue = document.createElement("div");
		this.outputAndHue.style.display = "flex";
		this.outputAndHue.style.justifyContent = "space-between";
		this.holderDiv.appendChild(this.outputAndHue);

		this.outputCanvas = document.createElement("canvas");
		this.outputCanvas.width = 30;
		this.outputCanvas.height = 30;
		this.outputAndHue.appendChild(this.outputCanvas);

		this.outputAndHue.appendChild(
			createDOMElement("input", {
				id: "hueControl",
				max: "360",
				min: "0",
				step: "1",
				onchange: (e) => this.#changeHue(e.currentTarget.value),
				oninput: (e) => this.#changeHue(e.currentTarget.value, false),
				title: "Hue",
				type: "range",
				value: this.hue,
			})
		);

		this.#generateSVGradient(this.hue, this.svCtx);
		this.#showOutputColor(
			this.hue,
			this.saturation,
			this.value,
			this.showFill,
			this.outputCanvas
		);

		this.#addEventListeners();
	}

	getFill() {
		if (this.showFill) {
			const [h, s, l] = this.#hsv2hsl(
				this.hue / 360,
				this.saturation,
				this.value
			);
			return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`;
		} else {
			return null;
		}
	}

	#addEventListeners() {
		this.outputCanvas.addEventListener("click", (e) => {
			this.showFill = !this.showFill;
			this.#showOutputColor(
				this.hue,
				this.saturation,
				this.value,
				this.showFill,
				this.outputCanvas
			);
		});

		this.svCanvas.addEventListener("pointerdown", (e) => {
			const updateSV = (e) => this.#updateSV(e);
			updateSV(e);
			this.svCanvas.addEventListener("pointermove", updateSV);
			this.svCanvas.addEventListener("pointerup", () => {
				this.svCanvas.removeEventListener("pointermove", updateSV);
			});
		});
	}

	#updateSV(e) {
		const x = e.offsetX;
		const y = e.offsetY;
		this.saturation = x / this.svCanvas.width;
		this.value = 1 - y / this.svCanvas.height;

		this.#generateSVGradient(this.hue, this.svCtx);
		this.#showOutputColor(
			this.hue,
			this.saturation,
			this.value,
			this.showFill,
			this.outputCanvas
		);
	}

	#changeHue(value, save = true) {
		this.hue = value;
		this.#generateSVGradient(this.hue, this.svCtx);
		this.#showOutputColor(
			this.hue,
			this.saturation,
			this.value,
			this.showFill,
			this.outputCanvas
		);
	}

	#showOutputColor(hue, saturation, value, showFill, canvas) {
		const ctx = canvas.getContext("2d");
		if (showFill) {
			const [h, s, l] = this.#hsv2hsl(
				this.hue / 360,
				this.saturation,
				this.value
			);
			ctx.fillStyle = `hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		} else {
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = "red";
			ctx.lineWidth = 2;
			ctx.moveTo(0, 0);
			ctx.lineTo(canvas.width, canvas.height);
			ctx.stroke();
		}
	}

	#generateSVGradient(hue, ctx) {
		const { width, height } = ctx.canvas;

		// To-Do speedup this
		const stepSize = 2;
		for (let x = 0; x < width; x += stepSize) {
			for (let y = 0; y < height; y += stepSize) {
				const saturation = x / width;
				const value = 1 - y / height;
				const [h, s, l] = this.#hsv2hsl(this.hue / 360, saturation, value);
				ctx.fillStyle = `hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`;
				ctx.fillRect(x, y, stepSize, stepSize);
			}
		}

		// Warning, inverting the formula must be done again if we change it
		const dotX = this.saturation * width;
		const dotY = (1 - this.value) * height;

		ctx.strokeStyle = "white";
		ctx.beginPath();
		ctx.arc(dotX, dotY, 5, 0, 2 * Math.PI);
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	#hsv2hsl(h, s, v) {
		const l = v - (v * s) / 2;
		const m = Math.min(l, 1 - l);
		return [h, m ? (v - l) / m : 0, l];
	}
}
