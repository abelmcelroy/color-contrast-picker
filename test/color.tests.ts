import { makeHexesContrast, getContrastingHex, relativeLuminance, contrastRatio, channelsToHex, WCAGcontrastRatios } from "../src/functions";
import { HexChannel, WCAGStandard } from "../src/types";
import * as tap from "tap";

const INCREMENT_SIZE = 8;

function testUniformSample(stdType: WCAGStandard) {
  tap.test(`Should meet WCAG "${stdType}" standard for large uniform samples of colors`, (t: any) => {
    const minContrastRatio = WCAGcontrastRatios[stdType];
  
    for (let R = 0; R < 256; R+=INCREMENT_SIZE) {
    for (let G = 0; G < 256; G+=INCREMENT_SIZE) {
    for (let B = 0; B < 256; B+=INCREMENT_SIZE) {
      const hexCode = channelsToHex(R as HexChannel, G as HexChannel, B as HexChannel);
      const contrastingHexCode = getContrastingHex(hexCode, stdType);

      if (contrastingHexCode) {

        const lumA = relativeLuminance(hexCode);
        const lumB = relativeLuminance(contrastingHexCode);
        const contrast = contrastRatio(lumA, lumB);
        const contrastIsGood = contrast >= minContrastRatio && contrast < minContrastRatio + 1;
        t.ok(contrastIsGood, `${hexCode} & ${contrastingHexCode} contast should be ${minContrastRatio}, (${Math.floor(contrast*100)/100})`);
      } else {

        const lumA = relativeLuminance(hexCode);
        const lumBlack = relativeLuminance("#000000");
        const lumWhite = relativeLuminance("#FFFFFF");
        const highestContrast = Math.max(contrastRatio(lumA, lumBlack), contrastRatio(lumA, lumWhite));
        t.ok(highestContrast < minContrastRatio, `Greatest possible contrast (${Math.floor(highestContrast*100)/100}) should be less than ${minContrastRatio} (the targeted WCAG standard).`);
      }

      const fixedHex = channelsToHex(B as HexChannel, R as HexChannel, G as HexChannel);
      const contrastingHexCode2 = makeHexesContrast(hexCode, fixedHex, stdType);

      if (contrastingHexCode2) {

        const lumA = relativeLuminance(fixedHex);
        const lumB = relativeLuminance(contrastingHexCode2);
        const contrast = contrastRatio(lumA, lumB);
        const contrastIsGood = contrast >= minContrastRatio && contrast < minContrastRatio + 1;
        t.ok(contrastIsGood, `${fixedHex} & ${contrastingHexCode2} contast should be ${minContrastRatio}, (${Math.floor(contrast*100)/100})`);
      } else {

        const lumA = relativeLuminance(fixedHex);
        const lumBlack = relativeLuminance("#000000");
        const lumWhite = relativeLuminance("#FFFFFF");
        const highestContrast = Math.max(contrastRatio(lumA, lumBlack), contrastRatio(lumA, lumWhite));
        t.ok(highestContrast < minContrastRatio, `Greatest possible contrast (${Math.floor(highestContrast*100)/100}) should be less than ${minContrastRatio} (the targeted WCAG standard).`);
      }
    }}}
    t.end();
  })
}

for (let WCAGstd in WCAGcontrastRatios) {
  testUniformSample(WCAGstd as WCAGStandard);
}