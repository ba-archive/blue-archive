import Slider from "./src/slider.vue";
import { withInstall } from "./utils/install";

export * from "./src/constants";

export * from "./src/slider";
const ElSlider = withInstall(Slider);
export default ElSlider;
