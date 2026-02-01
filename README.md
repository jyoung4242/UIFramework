# Excalibur UI Framework

A comprehensive UI component library for [Excalibur.js](https://excaliburjs.com/), providing interactive and accessible UI elements for game development.

## Features

- **Full Excalibur Integration**: Built specifically for Excalibur.js game engine
- **Interactive Components**: Buttons, panels, sliders, checkboxes, text inputs, and more
- **Keyboard Navigation**: Full keyboard and focus management support
- **Customizable Theming**: Extensive color and styling options
- **TypeScript Support**: Fully typed for better development experience
- **Event-Driven**: Rich event system for component interactions
- **Accessibility**: Focus indicators and keyboard navigation

## Components

- **UIButton** - Clickable buttons with hover/press states
- **UIPanel** - Container panels with optional borders and backgrounds
- **UILabel** - Text display labels
- **UISlider** - Draggable sliders for value selection
- **UISwitch** - Toggle switches
- **UITextInput** - Text input fields
- **UIProgressBar** - Progress indicators
- **UIImage** - Image display components
- **UICheckbox** - Checkable boxes
- **UINumeric** - Numeric input controls
- **UITabbedPanel** - Tabbed interface containers
- **UIRadioGroup** - Radio button groups
- **UIFocusManager** - Keyboard navigation management

## Installation

```bash
npm install excalibur-ui
```

## Quick Start

```typescript
import { Engine } from "excalibur";
import { UIButton, UIPanel } from "excalibur-ui";

const engine = new Engine();

// Create a panel
const panel = new UIPanel({
  name: "mainPanel",
  width: 300,
  height: 200,
  pos: vec(100, 100),
  colors: {
    backgroundStarting: Color.LightGray,
  }
});

// Create a button
const button = new UIButton({
  name: "myButton",
  width: 100,
  height: 50,
  pos: vec(150, 150),
  idleText: "Click Me!",
  callback: () => console.log("Button clicked!")
});

// Add to engine
engine.add(panel);
engine.add(button);

engine.start();
```

## Documentation

### Component Configuration

Each component accepts a configuration object with common properties:

- `name`: Component identifier
- `width/height`: Dimensions
- `pos`: Position vector
- `z`: Z-index for layering
- `colors`: Color scheme configuration
- `tabStopIndex`: Keyboard navigation order

### Events

Components emit various events you can listen to:

```typescript
button.on("UIButtonClicked", (event) => {
  console.log("Button was clicked!");
});
```

### Theming

Components support extensive theming through color configurations:

```typescript
const button = new UIButton({
  colors: {
    mainStarting: Color.Blue,
    hoverStarting: Color.LightBlue,
    disabledStarting: Color.Gray
  }
});
```

## Examples

Check out the `test App/` directory for comprehensive examples showing all components in action.

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Running Examples

```bash
cd "test App"
npm install
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

ISC License

## Dependencies

- [Excalibur.js](https://excaliburjs.com/) ^0.32.0
- [canvas-txt](https://github.com/georgedoescode/canvas-txt) ^4.1.1
- [canvas](https://github.com/Automattic/node-canvas) ^3.2.1

## Development Dependencies

- TypeScript ^5.9.3
- Vitest ^4.0.18
- @vitest/coverage-v8 ^4.0.18
- jsdom ^27.4.0</content>
<parameter name="filePath">c:\programming\UIFramework\README.md