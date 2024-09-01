const { DEFAULT_IMAGE_PROFILE, BASE_URL } = require('./utilsService');

exports.getImageUrl = async (req) => {
  let dirFileUrl = 'other';
  if (req.body.dirFileUrl) {
    dirFileUrl = req.body.dirFileUrl;
  }
  const file = req.file;
  if (file) {
    return BASE_URL + dirFileUrl + `/${file.filename}`;
  } 
  return DEFAULT_IMAGE_PROFILE;
};

