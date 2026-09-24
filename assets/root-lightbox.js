import PhotoSwipeLightbox from './vendor/photoswipe/photoswipe-lightbox.esm.min.js';

const labels = {
  en: ['Close', 'Zoom', 'Previous image', 'Next image', 'The image could not be loaded.'],
  'zh-CN': ['关闭', '缩放', '上一张', '下一张', '图片暂时无法加载。'],
  es: ['Cerrar', 'Ampliar', 'Imagen anterior', 'Imagen siguiente', 'No se pudo cargar la imagen.'],
  ar: ['إغلاق', 'تكبير', 'الصورة السابقة', 'الصورة التالية', 'تعذر تحميل الصورة.']
};
const [closeTitle, zoomTitle, arrowPrevTitle, arrowNextTitle, errorMsg] = labels[document.documentElement.lang] || labels.en;
const links = document.querySelectorAll('.yunnan-story a[href$=".webp"]');
for (const link of links) {
  const img = link.querySelector('img');
  if (!img) continue;
  link.dataset.pswpWidth = img.getAttribute('width');
  link.dataset.pswpHeight = img.getAttribute('height');
}
const lightbox = new PhotoSwipeLightbox({
  gallery: '.yunnan-story',
  children: 'a[data-pswp-width]',
  pswpModule: () => import('./vendor/photoswipe/photoswipe.esm.min.js'),
  closeTitle, zoomTitle, arrowPrevTitle, arrowNextTitle, errorMsg,
  showHideAnimationType: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'fade'
});
lightbox.init();
