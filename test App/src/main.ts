// main.ts
import "./style.css";

import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode, vec, Color, NineSliceStretch, SpriteSheet } from "excalibur";
import { model, template } from "./UI/UI";
import {
  UIFocusManager,
  UIButton,
  UIButtonConfig,
  UISpriteButton,
  UISpriteButtonConfig,
  UIPanel,
  UIPanelConfig,
  UISpritePanel,
  UISpritePanelConfig,
  UINineSlicePanelConfig,
  UINineSlicePanel,
  UILabel,
  UILabelConfig,
  UISlider,
  UISliderConfig,
  UISpriteSlider,
  UISpriteSliderConfig,
  UISwitch,
  UISwitchConfig,
  UISpriteSwitchConfig,
  UISpriteSwitch,
  UITextInputConfig,
  UITextInput,
  UIProgressBarConfig,
  UIProgressBar,
  UISpriteProgressBar,
  UISpriteProgressBarConfig,
  UIImage,
  UIImageConfig,
  UICheckboxConfig,
  UICheckbox,
  UISpriteCheckboxConfig,
  UISpriteCheckbox,
  UINumeric,
  UINumericConfig,
  UIRadioGroupConfig,
  UIRadioGroup,
} from "../../excalibur-ui/Components/";
import { buttonSS, loader, Resources } from "./resources";
import { initializeTabbedPanelDemo } from "./tabbedExample";
import { initializeMenuDemo } from "./Components/Menu";

await UI.create(document.body, model, template).attached;

const game = new Engine({
  width: 800, // the width of the canvas
  height: 600, // the height of the canvas
  canvasElementId: "cnv", // the DOM canvas element ID, if you are providing your own
  displayMode: DisplayMode.Fixed, // the display mode
  pixelArt: false,
  suppressPlayButton: true,
});
await game.start(loader);
let cnv = document.getElementById("cnv") as HTMLCanvasElement;
cnv.setAttribute("tabindex", "0");
cnv.addEventListener("keydown", e => {
  if (e.key === "Tab") {
    e.preventDefault(); // stop browser focus jump

    if (e.shiftKey) {
      FM.moveFocus(false);
    } else {
      FM.moveFocus();
    }
  }
});
cnv.focus();

// ********************************
// buttons
// ********************************

let opt: UIButtonConfig = {
  name: "butt",
  width: 100,
  height: 80,
  pos: vec(50, 50),
  idleText: "Button",
  hoveredText: "Hovered",
  activeText: "Pressed",
  disabledText: "disabled",
  colors: {
    mainStarting: Color.fromHex("#f2b95a"),
    mainEnding: Color.fromHex("#b37305"),
    bottomStarting: Color.fromHex("#b87502"),
    bottomEnding: Color.fromHex("#4e3201"),
    hoverStarting: Color.fromHex("#f1dab2"),
    hoverEnding: Color.fromHex("#b37305"),
    disabledStarting: Color.Gray,
  },
  pressDepth: 6,
  tabStopIndex: 0,
  customFocus(ctx) {
    ctx.fillStyle = "#d20404";
    ctx.beginPath();
    ctx.arc(10, 10, 3, 0, Math.PI * 2);
    ctx.fill();
  },
};
let myButton = new UIButton(opt);
game.add(myButton);

const idleSprite = await buttonSS.getSpriteAsStandalone(3, 15);
const pressedSprite = await buttonSS.getSpriteAsStandalone(4, 15);
let spriteButtonConfig: UISpriteButtonConfig = {
  name: "sprite",
  width: 128,
  height: 64,
  pos: vec(175, 50),
  sprites: {
    idle: idleSprite,
    hovered: idleSprite,
    pressed: pressedSprite,
    disabled: idleSprite,
  },
  idleText: "CLICK",
  hoveredText: "HOVER",
  activeText: "CLICKED",
  disabledText: "DISABLED",
  pressDepth: 6,
  textOptions: {
    color: Color.White,
  },
  textOffset: vec(0, -4),
  focusIndicator: vec(20, 12),
  tabStopIndex: 1,
};

let spriteButton = new UISpriteButton(spriteButtonConfig);
game.add(spriteButton);

// ********************************
// panels
// ********************************

const myfirstPanelConfig: UIPanelConfig = {
  name: "UIPanel",
  width: 200,
  height: 150,
  pos: vec(50, 150),
  z: 0,
  colors: {
    backgroundStarting: Color.fromHex("#ec7575"),
    backgroundEnding: Color.fromHex("#3d2222"),
    borderColor: Color.fromHex("#cccccc"),
  },
  borderWidth: 4,
  panelRadius: 12,
  padding: vec(10, 10),
  visible: true,
};
const myfirstPanel = new UIPanel(myfirstPanelConfig);

game.add(myfirstPanel);

const mysecondPanelConfig: UISpritePanelConfig = {
  name: "UIPanel",
  width: 236,
  height: 96,
  pos: vec(50, 315),
  z: 0,
  padding: vec(10, 10),
  visible: true,
  sprite: Resources.woodPanelbig.toSprite(),
};
const mysecondPanel = new UISpritePanel(mysecondPanelConfig);
game.add(mysecondPanel);

const mythirdPanelConfig: UINineSlicePanelConfig = {
  name: "UINineSlicePanel",
  width: 236,
  height: 96,
  pos: vec(50, 430),
  z: 0,
  padding: vec(10, 10),
  visible: true,
  sprite: Resources.cozyPanel.toSprite(),
  sourceConfig: {
    width: 47,
    height: 80,
    topMargin: 6,
    bottomMargin: 6,
    leftMargin: 6,
    rightMargin: 6,
  },
  destinationConfig: {
    drawCenter: true,
    stretchH: NineSliceStretch.Stretch,
    stretchV: NineSliceStretch.Stretch,
  },
};
const mythirdPanel = new UINineSlicePanel(mythirdPanelConfig);
game.add(mythirdPanel);

// ********************************
// Labels, Numerics, and Inputs
// ********************************

const myLabelConfig: UILabelConfig = {
  name: "UILabel",
  width: 200,
  height: 40,
  pos: vec(5, 10),
  z: 0,
  text: "nineslice panel label",
  labelRadius: 8,
  padding: vec(8, 8),
  textOptions: {
    color: Color.Red,
  },
  colors: {
    hoverStarting: Color.Black,
    textHoverColor: Color.White,
  },
};

const myLabel = new UILabel(myLabelConfig);
const myTextInputConfig: UITextInputConfig = {
  name: "UITextInput",
  width: 200,
  height: 30,
  pos: vec(10, 50),
  z: 0,
  inputRadius: 8,
  padding: vec(8, 8),
  textOptions: {
    color: Color.Black,
  },
  maxLength: 20,
  colors: {
    cursorColor: Color.Orange,
  },
  tabStopIndex: 10,
};

const myTextInput = new UITextInput(myTextInputConfig);

mythirdPanel.addChild(myLabel);
mythirdPanel.addChild(myTextInput);

const myNumericConfig: UINumericConfig = {
  name: "UINumeric",
  width: 100,
  height: 40,
  pos: vec(25, 15),
  z: 0,
  min: 0,
  max: 100,
  value: 50,
  step: 2,
  colors: {
    borderNormal: Color.Black,
    arrowButtonBackground: Color.fromHex("#ec7575"),
    arrowButtonHover: Color.fromHex("#3d2222"),
    arrowColor: Color.fromHex("#cccccc"),
  },
  formatOptions: {
    decimals: 0,
  },
  tabStopIndex: 11,
};
const myNumeric: UINumeric = new UINumeric(myNumericConfig);
mysecondPanel.addChild(myNumeric);

// ********************************
// Sliders
// ********************************

const mysliderConfig: UISliderConfig = {
  name: "UISlider1",
  width: 300,
  height: 40,
  pos: vec(275, 150),
  z: 0,
  min: 0,
  max: 100,
  value: 50,
  step: 10,
  orientation: "horizontal",
  trackRadius: 8,
  knobRadius: 20,
  colors: {
    track: Color.fromHex("#ec7575"),
    fill: Color.fromHex("#3d2222"),
  },
  tabStopIndex: 6,
};
const myDrawnSlider = new UISlider(mysliderConfig);
game.add(myDrawnSlider);

const myvertSliderConfig: UISliderConfig = {
  name: "UISlider2",
  width: 20,
  height: 200,
  pos: vec(325, 300),
  z: 0,
  min: 0,
  max: 100,
  value: 50,
  step: 1,
  orientation: "vertical",
  trackRadius: 8,
  knobRadius: 10,
  colors: {
    track: Color.fromHex("#280ebb"),
    fill: Color.fromHex("#6fa86f"),
    knob: Color.fromHex("#dd8a0c"),
  },
  tabStopIndex: 7,
};
const myVerticalDrawnSlider = new UISlider(myvertSliderConfig);
game.add(myVerticalDrawnSlider);

const slicerKnobSS = SpriteSheet.fromImageSource({
  image: Resources.slider,
  grid: {
    rows: 1,
    columns: 1,
    spriteHeight: 48,
    spriteWidth: 16,
  },
});
const sliderKnob = await slicerKnobSS.getSpriteAsStandalone(0, 0);

const slicerFills = SpriteSheet.fromImageSource({
  image: Resources.slider,
  grid: {
    rows: 3,
    columns: 1,
    spriteHeight: 32,
    spriteWidth: 200,
  },
  spacing: {
    originOffset: vec(0, 48),
  },
});

const sliderBorder = await slicerFills.getSpriteAsStandalone(0, 0);
const sliderFill = await slicerFills.getSpriteAsStandalone(0, 1);
const sliderTrack = await slicerFills.getSpriteAsStandalone(0, 2);

const mySpriteSliderConfig: UISpriteSliderConfig = {
  name: "UISlider3",
  width: 200,
  height: 48,
  pos: vec(275, 215),
  z: 0,
  min: 0,
  max: 100,
  value: 50,
  step: 25,
  orientation: "horizontal",
  sprites: {
    knob: sliderKnob,
    track: sliderTrack,
    fill: sliderFill,
    border: sliderBorder,
  },
  tabStopIndex: 8,
};
const mySpriteSlider: UISpriteSlider = new UISpriteSlider(mySpriteSliderConfig);
game.add(mySpriteSlider);

const slicervertKnobSS = SpriteSheet.fromImageSource({
  image: Resources.vertslider,
  grid: {
    rows: 1,
    columns: 1,
    spriteHeight: 16,
    spriteWidth: 48,
  },
  spacing: {
    originOffset: vec(0, 184),
  },
});
const slidervertKnob = await slicervertKnobSS.getSpriteAsStandalone(0, 0);
const slicervertFills = SpriteSheet.fromImageSource({
  image: Resources.vertslider,
  grid: {
    rows: 1,
    columns: 3,
    spriteHeight: 200,
    spriteWidth: 32,
  },
  spacing: {
    originOffset: vec(48, 0),
  },
});

const slidervertBorder = await slicervertFills.getSpriteAsStandalone(0, 0);
const slidervertFill = await slicervertFills.getSpriteAsStandalone(1, 0);
const slidervertTrack = await slicervertFills.getSpriteAsStandalone(2, 0);

const myvertSpriteSliderConfig: UISpriteSliderConfig = {
  name: "UISlider4",
  width: 48,
  height: 200,
  pos: vec(360, 290),
  z: 0,
  min: 0,
  max: 100,
  value: 50,
  step: 1,
  orientation: "vertical",
  sprites: {
    knob: slidervertKnob,
    track: slidervertTrack,
    fill: slidervertFill,
    border: slidervertBorder,
  },
  tabStopIndex: 9,
};
const myvertSpriteSlider: UISpriteSlider = new UISpriteSlider(myvertSpriteSliderConfig);
game.add(myvertSpriteSlider);

// **********************************************
// Switches and Checkboxes
// **********************************************

const mySwitchConfig: UISwitchConfig = {
  name: "switch",
  width: 60,
  height: 25,
  pos: vec(350, 75),
  checked: false,
  focusIndicator: vec(5, 5),
  tabStopIndex: 2,
};
const mySwitch = new UISwitch(mySwitchConfig);
game.add(mySwitch);

// sprite switch
const mySpriteSwitchConfig: UISpriteSwitchConfig = {
  name: "switch",
  width: 100,
  height: 32,
  pos: vec(425, 70),
  checked: false,
  focusIndicator: vec(5, 5),
  sprites: {
    trackOff: Resources.toggleTrack.toSprite(),
    trackOn: Resources.toggleTrackOn.toSprite(),
    knobOff: Resources.toggleKnob.toSprite(),
    knobOn: Resources.toggleKnob.toSprite(),
  },
  tabStopIndex: 3,
};
const mySpriteSwitch = new UISpriteSwitch(mySpriteSwitchConfig);
game.add(mySpriteSwitch);

// checkbox
const myCheckboxConfig: UICheckboxConfig = {
  name: "checkbox",
  width: 25,
  height: 25,
  pos: vec(575, 70),
  checked: true,
  focusIndicator: vec(5, 5),
  borderRadius: 5,
  colors: {
    checkmark: Color.Green,
    border: Color.White,
    background: Color.DarkGray,
    backgroundChecked: Color.DarkGray,
  },
  tabStopIndex: 4,
};
const myCheckbox = new UICheckbox(myCheckboxConfig);
game.add(myCheckbox);

// sprite checkbox

const mySpriteCheckboxConfig: UISpriteCheckboxConfig = {
  name: "checkbox",
  width: 25,
  height: 25,
  pos: vec(625, 70),
  checked: true,
  focusIndicator: vec(5, 5),
  sprites: {
    unchecked: Resources.checkboxUnchecked.toSprite(),
    checked: Resources.checkboxChecked.toSprite(),
  },
  tabStopIndex: 5,
};
const mySpriteCheckbox = new UISpriteCheckbox(mySpriteCheckboxConfig);
game.add(mySpriteCheckbox);

//Radio Group
const myRadioGroupConfig: UIRadioGroupConfig = {
  name: "radioGroup",
  allowDeselect: true,
};
const myRadioGroup = new UIRadioGroup(myRadioGroupConfig);
myRadioGroup.add(myCheckbox);
myRadioGroup.add(mySpriteCheckbox);

// **********************************************
// Progress Bar
// **********************************************

const myProgressConfig: UIProgressBarConfig = {
  name: "progress",
  width: 250,
  height: 20,
  pos: vec(525, 200),
  min: 0,
  max: 100,
  value: 75,
  colors: {
    track: Color.DarkGray,
    fill: Color.Green,
  },
  orientation: "horizontal",
};
const myDrawnProgress: UIProgressBar = new UIProgressBar(myProgressConfig);
game.add(myDrawnProgress);

const mySpriteProgressBarConfig: UISpriteProgressBarConfig = {
  name: "progress",
  width: 250,
  height: 20,
  pos: vec(525, 250),
  min: 0,
  max: 100,
  value: 85,
  orientation: "horizontal",
  sprites: {
    border: Resources.barBorder.toSprite(),
    track: Resources.barTrack.toSprite(),
    fill: Resources.barFill.toSprite(),
  },
};

const mySpriteProgress: UISpriteProgressBar = new UISpriteProgressBar(mySpriteProgressBarConfig);
game.add(mySpriteProgress);

// **********************************************
// Images
// **********************************************

const mySmallImageConfig: UIImageConfig = {
  name: "image",
  width: 50,
  height: 50,
  pos: vec(450, 300),
  image: Resources.megaman,
  fit: "contain",
};
const mySmallImage: UIImage = new UIImage(mySmallImageConfig);
game.add(mySmallImage);

const myMedImageConfig: UIImageConfig = {
  name: "image",
  width: 100,
  height: 100,
  pos: vec(500, 300),
  image: Resources.megaman,
  fit: "contain",
};
const myMedImage: UIImage = new UIImage(myMedImageConfig);
game.add(myMedImage);

const mydistortedimageConfig: UIImageConfig = {
  name: "image",
  width: 50,
  height: 100,
  pos: vec(625, 290),
  image: Resources.megaman,
  fit: "cover",
};
const mycoverimage: UIImage = new UIImage(mydistortedimageConfig);
game.add(mycoverimage);

const mydistortedimageConfig2: UIImageConfig = {
  name: "image",
  width: 50,
  height: 100,
  pos: vec(700, 290),
  image: Resources.megaman,
  fit: "fill",
};
const mycontainimage: UIImage = new UIImage(mydistortedimageConfig2);
game.add(mycontainimage);

// **********************************************
// Tabbed Panel
// **********************************************

initializeTabbedPanelDemo(game);

let FM = new UIFocusManager();
FM.register([
  myButton,
  spriteButton,
  myDrawnSlider,
  myvertSpriteSlider,
  myVerticalDrawnSlider,
  mySpriteSlider,
  mySwitch,
  mySpriteSwitch,
  myCheckbox,
  mySpriteCheckbox,
  myTextInput,
  myNumeric,
]);
FM.setFocus(myButton);

initializeMenuDemo(game);
