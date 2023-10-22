module.exports = {
  watch: ['test0','basejs','combu'],
  ignore: 'y'

  // can also be an array:
  // watch: ['src', 'public'],
  // ignore: [/\.s[ac]ss$/i, /\.tsx?$/i]
}

// module.exports = {
//   // Custom middleware function to handle requests
//   middleware: (req, res, next) => {
//     // Ignore requests to the 'y' directory
//     if (req.url.startsWith('/y/')) {
//       return res.status(404).end('Not Found');
//     }
//     // Continue processing other requests
//     next();
//   },

//   // Specify directories to watch
//   watchDirs: ['basejs', 'test0'],

//   // Other configurations...
// };

