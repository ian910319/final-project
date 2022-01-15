const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@Header-background-image': 'url(https://th.bing.com/th/id/R.195b2251a873f84358889289c15c572b?rik=0bMH%2bhNROuMDBw&riu=http%3a%2f%2fwww.ps123.net%2fsucai%2fUploadFiles_0715%2f201011%2f2010111016445252.jpg&ehk=XTvGtXwlHxlBzgKk82rgbSmOTF3iWSESioJNyUiw0Ys%3d&risl=&pid=ImgRaw&r=0)' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};