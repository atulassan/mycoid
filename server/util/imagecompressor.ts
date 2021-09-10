// import sharp from 'sharp';
// import moment from 'moment';
// import path from 'path';

// const image: { width: number; crop: boolean }[] = [
//   { width: 150, crop: true },
//   { width: 236, crop: false },
//   { width: 474, crop: false },
//   { width: 736, crop: false },
//   { width: 1080, crop: false },
// ];

// const imageWithoutCrop = async (orginalURL, value, resizedURL) => {
//   return await sharp(orginalURL)
//     .rotate()
//     .resize({
//       width: value.width,
//     })
//     .toFile(resizedURL);
// };
// const imageCrop = async (orginalURL, value, resizedURL) => {
//   return await sharp(orginalURL)
//     .resize({
//       width: value.width,
//       height: value.width,
//       position: sharp.strategy.entropy,
//     })
//     .toFile(resizedURL);
// };

// export async function imageCompressor(imageId) {
//   return Promise.all(
//     image.map(async value => {
//       let resizedFileName = 'x' + value.width + '_' + imageId;
//       let imagePath = `uploads/images/${moment().format(
//         'YYYY',
//       )}/${moment().format('MMMM')}/`;
//       let resizedURL = imagePath + resizedFileName;
//       let orginalURL = imagePath + `${imageId}.png`;
//       console.log(orginalURL);
//       return value.crop
//         ? await imageCrop(orginalURL, value, resizedURL)
//         : await imageWithoutCrop(orginalURL, value, resizedURL);
//     }),
//   );
// }
