const colorSchemes = [
  {
    name: 'Custom',
    value: 'CUSTOM',
  },
  {
    name: 'Default',
    value: 'DEFAULT',
    cssClassName: 'color-scheme-default',
    colors: {
      sideBar: '#555FFF',
      sideBarText: '#FFFFFF',
      topBar: '#1E90FF',
      topBarText: '#FFFFFF',
      buttons: '#00DDDD',
      buttonsText: '#FFFFFF',
      background: '#FFFFFF',
      backgroundText: '#000000'
    },
  },
  {
    name: 'Forest',
    value: 'FOREST',
    cssClassName: 'color-scheme-forest',
    colors: {
      sideBar: '#083D06',
      sideBarText: '#FFFFFF',
      topBar: '#0D6102',
      topBarText: '#FFFFFF',
      buttons: '#397E39',
      buttonsText: '#FFFFFF',
      background: '#C5FFC2',
      backgroundText: '#000000',
    },
  },
  {
    name: 'Hacker (Green)',
    value: 'HACKER_GREEN',
    cssClassName: 'color-scheme-hacker-green',
    colors: {
      sideBar: '#000000',
      sideBarText: '#00FF00',
      topBar: '#000000',
      topBarText: '#00FF00',
      buttons: '#000000',
      buttonsText: '#00FF00',
      background: '#000000',
      backgroundText: '#00FF00',
    },
  },
  {
    name: 'Hacker (Pink)',
    value: 'HACKER_PINK',
    cssClassName: 'color-scheme-hacker-pink',
    colors: {
      sideBar: '#000000',
      sideBarText: '#FF00FF',
      topBar: '#000000',
      topBarText: '#FF00FF',
      buttons: '#000000',
      buttonsText: '#FF00FF',
      background: '#000000',
      backgroundText: '#FF00FF',
    },
  },
  {
    name: 'Plum',
    value: 'PLUM',
    cssClassName: 'color-scheme-plum',
    colors: {
      sideBar: '#341236',
      sideBarText: '#F7D0FF',
      topBar: '#612263',
      topBarText: '#D48CD8',
      buttons: '#3F143E',
      buttonsText: '#FDE6FF',
      background: '#EBD1F3',
      backgroundText: '#000000',
    },
  },
  {
    name: 'Ocean',
    value: 'OCEAN',
    cssClassName: 'color-scheme-ocean',
    colors: {
      sideBar: '#5E73BC',
      sideBarText: '#E7E1EC',
      topBar: '#002263',
      topBarText: '#DBE5FF',
      buttons: '#3D4A77',
      buttonsText: '#D1D6F2',
      background: '#353E73',
      backgroundText: '#FFFFFF',
    },
  },
  // { // TODO add gradients for default color schemes
  //   name: 'Sunset',
  //   value: 'SUNSET',
  //   cssClassName: 'color-scheme-sunset',
  //   colors: {
  //     sideBar: '#005580', // UP TO #FF5580
  //     sideBarText: '#E7E1EC',
  //     topBar: '#FF5580', // TO #FFFF80
  //     topBarText: '#DBE5FF',
  //     buttons: '#3D4A77',
  //     buttonsText: '#D1D6F2',
  //     background: '#353E73',
  //     backgroundText: '#FFFFFF',
  //   },
  // },
  {
    name: 'Desert',
    value: 'DESERT',
    cssClassName: 'color-scheme-desert',
    colors: {
      sideBar: '#8A5115',
      sideBarText: '#E7E1EC',
      topBar: '#D79840',
      topBarText: '#F3DD87',
      buttons: '#C97D1A',
      buttonsText: '#F2EFAE',
      background: '#F3DD87',
      backgroundText: '#5D3400',
    },
  },
  // {
  //   name: 'Aurora',
  //   value: 'AURORA',
  //   cssClassName: 'color-scheme-aurora',
  //   colors: {
  //     sideBar: '#002286', // TO #573464
  //     sideBarText: '#FFFFFF', // rgb 231, 225, 236
  //     topBar: '#002286', // TO #573464
  //     topBarText: '#FFFFFF', // rgb 219, 229, 255
  //     buttons: '#FFFFFF', // don't remember
  //     buttonsText: '#000000', // don't remember
  //     background: '#FFFFFF', // rgb 231, 225, 236 same as side bar text
  //     backgroundText: '#000000', // I think this was black
  //   },
  // },
];

export default colorSchemes;