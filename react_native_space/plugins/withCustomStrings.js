const { withStringsXml, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const CROP_STRINGS = [
  { $: { name: 'crop_image_menu_crop' }, _: 'Kaydet' },
  { $: { name: 'crop_image_activity_title' }, _: 'Kaydet' },
  { $: { name: 'ucrop_menu_crop' }, _: 'Kaydet' },
  { $: { name: 'ucrop_label_edit_photo' }, _: 'Kaydet' },
];

function withCustomCropStrings(config) {
  // 1. Base values/strings.xml
  config = withStringsXml(config, (modConfig) => {
    const { Strings } = require('@expo/config-plugins').AndroidConfig;
    modConfig.modResults = Strings.setStringItem(CROP_STRINGS, modConfig.modResults);
    return modConfig;
  });

  // 2. Turkish values-tr/strings.xml for devices running Turkish locale
  config = withDangerousMod(config, [
    'android',
    async (modConfig) => {
      try {
        const resDir = path.join(modConfig.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res');
        const valuesTrDir = path.join(resDir, 'values-tr');
        if (!fs.existsSync(valuesTrDir)) {
          fs.mkdirSync(valuesTrDir, { recursive: true });
        }
        const stringsTrPath = path.join(valuesTrDir, 'strings.xml');
        let content = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
        content += '    <string name="crop_image_menu_crop">Kaydet</string>\n';
        content += '    <string name="crop_image_activity_title">Kaydet</string>\n';
        content += '    <string name="ucrop_menu_crop">Kaydet</string>\n';
        content += '    <string name="ucrop_label_edit_photo">Kaydet</string>\n';
        content += '</resources>\n';
        fs.writeFileSync(stringsTrPath, content, 'utf8');
      } catch (err) {
        console.warn('Could not write values-tr/strings.xml', err);
      }
      return modConfig;
    },
  ]);

  return config;
}

module.exports = withCustomCropStrings;
