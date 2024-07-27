class PropertiesPanel {
   constructor(holderDiv) {
      this.holderDiv = holderDiv;
      this.holderDiv.innerHTML = `
         Properties
         <br/>
         <label for="x">X:</label>
         <input
            type="number"
            id="x"
            title="X"
            onchange="PropertiesPanel.changeX(this.value)"
         />
         <br />
         <label for="y">Y:</label>
         <input
            type="number"
            id="y"
            title="Y"
            onchange="PropertiesPanel.changeY(this.value)"
         />
         <br />
         <label for="width">Width:</label>
         <input
            type="number"
            id="width"
            title="Width"
            onchange="PropertiesPanel.changeWidth(this.value)"
         />
         <br />
         <label for="height">Height:</label>
         <input
            type="number"
            id="height"
            title="Height"
            onchange="PropertiesPanel.changeHeight(this.value)"
         />
         <br />
         <input
            type="color"
            id="fillColor"
            value="#ff0000"
            title="Fill Color"
            oninput="PropertiesPanel.changeFillColor(this.value)"
         />
         <input
            type="checkbox"
            id="fill"
            checked
            title="Fill"
            onchange="PropertiesPanel.changeFill(this.checked)"
         />
         <br />
         <input
            type="color"
            id="strokeColor"
            value="#0000ff"
            title="Stroke Color"
            oninput="PropertiesPanel.changeStrokeColor(this.value)"
         />
         <input
            type="checkbox"
            id="stroke"
            checked
            title="Stroke"
            onchange="PropertiesPanel.changeStroke(this.checked)"
         />
         <br />
         <input
            type="range"
            id="strokeWidth"
            value="5"
            min="1"
            max="100"
            title="Stroke Width"
            oninput="PropertiesPanel.changeStrokeWidth(this.value)"
         />
         <br />`;
   }

   static changeX(value) {
      shapes
         .filter((s) => s.selected)
         .forEach((s) => (s.center.x = Number(value) + stageProperties.left));

      updateHistory(shapes);
      drawShapes(shapes);
   }

   static changeY(value) {
      shapes
         .filter((s) => s.selected)
         .forEach((s) => (s.center.y = Number(value) + stageProperties.top));

      updateHistory(shapes);
      drawShapes(shapes);
   }

   static changeWidth(value) {
      shapes
         .filter((s) => s.selected)
         .forEach((s) => s.setWidth(Number(value)));

      updateHistory(shapes);
      drawShapes(shapes);
   }

   static changeHeight(value) {
      shapes
         .filter((s) => s.selected)
         .forEach((s) => s.setHeight(Number(value)));

      updateHistory(shapes);
      drawShapes(shapes);
   }

   static changeFillColor(value) {
      shapes
         .filter((s) => s.selected)
         .forEach((s) => (s.options.fillColor = value));

      updateHistory(shapes);
      drawShapes(shapes);
   }

   static changeFill(value) {
      shapes.filter((s) => s.selected).forEach((s) => (s.options.fill = value));

      updateHistory(shapes);
      drawShapes(shapes);
   }

   static changeStrokeColor(value) {
      shapes
         .filter((s) => s.selected)
         .forEach((s) => (s.options.strokeColor = value));

      updateHistory(shapes);
      drawShapes(shapes);
   }

   static changeStroke(value) {
      shapes
         .filter((s) => s.selected)
         .forEach((s) => (s.options.stroke = value));

      updateHistory(shapes);
      drawShapes(shapes);
   }

   static changeStrokeWidth(value) {
      shapes
         .filter((s) => s.selected)
         .forEach((s) => (s.options.strokeWidth = Number(value)));

      updateHistory(shapes);
      drawShapes(shapes);
   }

   static reset() {
      x.value = "";
      y.value = "";
      width.value = "";
      height.value = "";
      x.placeholder = "";
      y.placeholder = "";
      width.placeholder = "";
      height.placeholder = "";
   }

   static updateDisplay(selectedShapes) {
      if (selectedShapes.length === 0) {
         return;
      }

      let newProperties = null;
      for (const shape of selectedShapes) {
         if (newProperties === null) {
            newProperties = {
               x: shape.center.x - stageProperties.left,
               y: shape.center.y - stageProperties.top,
               width: shape.size.width,
               height: shape.size.height,
               fillColor: shape.options.fillColor,
               fill: shape.options.fill,
               strokeColor: shape.options.strokeColor,
               stroke: shape.options.stroke,
               strokeWidth: shape.options.strokeWidth,
            };
         } else {
            if (newProperties.x !== shape.center.x - stageProperties.left) {
               newProperties.x = null;
            }
            if (newProperties.y !== shape.center.y - stageProperties.top) {
               newProperties.y = null;
            }
            if (newProperties.width !== shape.size.width) {
               newProperties.width = null;
            }
            if (newProperties.height !== shape.size.height) {
               newProperties.height = null;
            }
            if (newProperties.fillColor !== shape.options.fillColor) {
               newProperties.fillColor = null;
            }
            if (newProperties.fill !== shape.options.fill) {
               newProperties.fill = null;
            }
            if (newProperties.strokeColor !== shape.options.strokeColor) {
               newProperties.strokeColor = null;
            }
            if (newProperties.stroke !== shape.options.stroke) {
               newProperties.stroke = null;
            }
            if (newProperties.strokeWidth !== shape.options.strokeWidth) {
               newProperties.strokeWidth = null;
            }
         }
      }
      if (newProperties === null) {
         return;
      } else {
         x.value = newProperties.x ? Math.round(newProperties.x) : "";
         y.value = newProperties.y ? Math.round(newProperties.y) : "";
         width.value = newProperties.width
            ? Math.round(newProperties.width)
            : "";
         height.value = newProperties.height
            ? Math.round(newProperties.height)
            : "";
         fillColor.value = newProperties.fillColor
            ? newProperties.fillColor
            : "";
         fill.checked = newProperties.fill ? newProperties.fill : false;
         strokeColor.value = newProperties.strokeColor
            ? newProperties.strokeColor
            : "";
         stroke.checked = newProperties.stroke ? newProperties.stroke : false;
         strokeWidth.value = newProperties.strokeWidth
            ? newProperties.strokeWidth
            : "";

         const placeholderText = "Multiple Values";
         x.placeholder = newProperties.x ? "" : placeholderText;
         y.placeholder = newProperties.y ? "" : placeholderText;
         width.placeholder = newProperties.width ? "" : placeholderText;
         height.placeholder = newProperties.height ? "" : placeholderText;
         fillColor.placeholder = newProperties.fillColor ? "" : placeholderText;
         fill.placeholder = newProperties.fill ? "" : placeholderText;
         strokeColor.placeholder = newProperties.strokeColor ? "" : placeholderText;
         stroke.placeholder = newProperties.stroke ? "" : placeholderText;
         strokeWidth.placeholder = newProperties.strokeWidth ? "" : placeholderText;
      }
   }
}