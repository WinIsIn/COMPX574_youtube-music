// menu + robot main icon 
import { createPlugin } from '@/utils';

const recognizers = {
  AHA: 'AHA Music',
  Shazam: 'Shazam',
} as const;

type Recognizer = typeof recognizers[keyof typeof recognizers];

interface Config {
  enabled: boolean;
  recognizer: Recognizer;
}

const urlFor = (r: Recognizer) =>
  r === recognizers.Shazam ? 'https://www.shazam.com/' : 'https://www.aha-music.com/';

export default createPlugin<unknown, unknown, unknown, Config>({
  name: () => 'Music Recognizer',
  description: () => 'Open AHA Music or Shazam based on your menu choice.',
  restartNeeded: true,

  config: {
    enabled: true,
    recognizer: recognizers.AHA,
  },

  menu: async ({ getConfig, setConfig }) => {
    const cfg = await getConfig();
    return [
      {
        label: 'Recognizer',
        submenu: [recognizers.AHA, recognizers.Shazam].map((r) => ({
          label: r,
          type: 'radio',
          checked: (cfg.recognizer || recognizers.AHA) === r,
          click() {
            setConfig({ recognizer: r as Recognizer });
          },
        })),
      },
      {
        label: 'Open website',
        click() {
          getConfig().then(({ recognizer }) => {
            const { shell } = require('electron') as typeof import('electron');
            shell.openExternal(urlFor((recognizer as Recognizer) || recognizers.AHA));
          });
        },
      },
    ];
  },