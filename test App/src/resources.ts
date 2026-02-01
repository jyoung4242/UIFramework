// resources.ts
import { ImageSource, Loader, SpriteSheet } from "excalibur";
import buttons from "./Assets/Pixel Buttom.png"; // replace this
import woodPanel from "./Assets/woodPanel.png";
import woodPanelbig from "./Assets/woodPanelbig.png";
import cozyPanel from "./Assets/cozyPanel.png";
import customSlider from "./Assets/custom slider.png";
import customVertSlicer from "./Assets/custom slider vert.png";
import toggleOff from "./Assets/toggleTrack.png";
import toggleOn from "./Assets/toggleTrackOn.png";
import toggleknob from "./Assets/toggleKnob.png";
import barTrack from "./Assets/barTrack.png";
import barFill from "./Assets/barFill.png";
import barBorder from "./Assets/barBorder.png";
import megaman from "./Assets/megaman.png";
import checked from "./Assets/checkboxChecked.png";
import unchecked from "./Assets/checkboxUnchecked.png";

export const Resources = {
  buttons: new ImageSource(buttons),
  woodPanel: new ImageSource(woodPanel),
  woodPanelbig: new ImageSource(woodPanelbig),
  cozyPanel: new ImageSource(cozyPanel),
  slider: new ImageSource(customSlider),
  vertslider: new ImageSource(customVertSlicer),
  toggleTrack: new ImageSource(toggleOff),
  toggleTrackOn: new ImageSource(toggleOn),
  toggleKnob: new ImageSource(toggleknob),
  barTrack: new ImageSource(barTrack),
  barFill: new ImageSource(barFill),
  barBorder: new ImageSource(barBorder),
  megaman: new ImageSource(megaman),
  checkboxChecked: new ImageSource(checked),
  checkboxUnchecked: new ImageSource(unchecked),
};

export const loader = new Loader();

export const buttonSS = SpriteSheet.fromImageSource({
  image: Resources.buttons,
  grid: {
    rows: 16,
    columns: 10,
    spriteHeight: 32,
    spriteWidth: 64,
  },
});

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
