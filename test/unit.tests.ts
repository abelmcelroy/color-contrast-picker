import { channelsToHex, hexChannels, linearizedRGB, relativeLuminance, contrastRatio, channelWeights, desiredLuminance, WCAGcontrastRatios } from "../src/index";
import { HexChannel, WCAGStandard } from "../src/types";
import * as tap from "tap";

tap.test("hexChannels() should return the sRGB values from any hexcode", (t: any) => {
  t.equal(hexChannels("#eb4034").join(), [235, 64, 52].join());
  t.equal(hexChannels("#2feb67").join(), [47, 235, 103].join());
  t.equal(hexChannels("#43664e").join(), [67, 102, 78].join());
  t.equal(hexChannels("#e7eda4").join(), [231, 237, 164].join());
  t.equal(hexChannels("#4d4d4d").join(), [77, 77, 77].join());
  t.equal(hexChannels("#6b0b63").join(), [107, 11, 99].join());
  t.equal(hexChannels("#7a25a8").join(), [122, 37, 168].join());
  t.end()
});

tap.test("hexChannels() & channelsToHex() should be inverses", (t: any) => {
  for (let R = 0; R < 256; R+=50) {
    for (let G = 0; G < 256; G+=50) {
      for (let B = 0; B < 256; B+=50) {
        t.equal(hexChannels(channelsToHex(R as HexChannel, G as HexChannel, B as HexChannel)).join(), [R, G, B].join());
      }
    }
  }
  t.end();
});

tap.test("linearizedRGB() should always return a value bewteen 0 & 1", (t: any) => {
  for (let i = 0; i < 256; i++) {
    t.ok(linearizedRGB(i as HexChannel) >= 0 && linearizedRGB(i as HexChannel) <= 1);
  }
  t.end();
});

tap.test("linearizedRGB() should be monotonically increasing", (t: any) => {
  let prev = -1;
  for (let i = 0; i < 256; i++) {
    const curr = linearizedRGB(i as HexChannel);
    t.ok(curr > prev);
    prev = linearizedRGB(i as HexChannel);
  }
  t.end();
});

tap.test("relativeLuminance() should be equal to color weights for 100% saturated colors", (t: any) => {
  t.equal(relativeLuminance("#000000"), 0);
  t.equal(relativeLuminance("#FF0000"), channelWeights[0]);
  t.equal(relativeLuminance("#00FF00"), channelWeights[1]);
  t.equal(relativeLuminance("#0000FF"), channelWeights[2]);
  t.equal(relativeLuminance("#FFFF00"), channelWeights[0] + channelWeights[1]);
  t.equal(relativeLuminance("#FF00FF"), channelWeights[0] + channelWeights[2]);
  t.equal(relativeLuminance("#00FFFF"), channelWeights[1] + channelWeights[2]);
  t.equal(relativeLuminance("#FFFFFF"), channelWeights[0] + channelWeights[1] + channelWeights[2]);
  t.end();
});

tap.test("contrastRatio() should return the exact values from webaim.org's contrast ratio tool", (t: any) => {
  t.equal(Math.floor(100*contrastRatio(relativeLuminance("#eb4034"), relativeLuminance("#2feb6A"))) / 100, 2.48);
  t.equal(Math.floor(100*contrastRatio(relativeLuminance("#2feb6A"), relativeLuminance("#43664e"))) / 100, 4.06);
  t.equal(Math.floor(100*contrastRatio(relativeLuminance("#43664e"), relativeLuminance("#e7eda4"))) / 100, 5.24);
  t.equal(Math.floor(100*contrastRatio(relativeLuminance("#e7eda4"), relativeLuminance("#4d4d4d"))) / 100, 6.86);
  t.equal(Math.floor(100*contrastRatio(relativeLuminance("#4d4d4d"), relativeLuminance("#6b0b63"))) / 100, 1.34);
  t.equal(Math.floor(100*contrastRatio(relativeLuminance("#6b0b63"), relativeLuminance("#7a25a8"))) / 100, 1.43);
  t.equal(Math.floor(100*contrastRatio(relativeLuminance("#7a25a8"), relativeLuminance("#eb4034"))) / 100, 2.00);
  t.end();
});

tap.test("desiredLuminance() should return luminances that are at least the correct contrast ratio, but not too much higher", (t: any) => {
  for (let std in WCAGcontrastRatios) {
    for (let i = 1; i < 1000; i+=10) {
      const lum = 1/i;
      const contrastingLum = desiredLuminance(lum, WCAGcontrastRatios[std as WCAGStandard]);
      const cr = contrastRatio(lum, contrastingLum);
      t.ok(cr >= (WCAGcontrastRatios[std as WCAGStandard] - (1 - .999999999999999)) && cr < WCAGcontrastRatios[std as WCAGStandard] + 1, `${cr} should be in [${WCAGcontrastRatios[std as WCAGStandard]}, ${WCAGcontrastRatios[std as WCAGStandard] + 1})`);
    }
  }
  t.end();
});