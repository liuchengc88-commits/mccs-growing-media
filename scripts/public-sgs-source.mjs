export const publicSgsUrl = 'https://www.ecopluggrow.com/wp-content/uploads/2026/10/XMIN2405000839CM01_EN2.pdf';
export function syncPublicSgsSource(html, language) {
 const label = ({en:'Public factory SGS report (English PDF)',cn:'工厂公开 SGS 原报告（英文 PDF）',es:'Informe SGS público de fábrica (PDF en inglés)',ar:'تقرير SGS العام من المصنع (PDF بالإنجليزية)'})[language];
 const link='<a href="'+publicSgsUrl+'" target="_blank" rel="noopener">'+label+'</a>';
 if(language==='en') {
  html=html.replace('<dd>SGS submitted-sample screening</dd>','<dd>CANIN24009790301 · '+link+'</dd>')
   .replace('<dd>Seedling and cutting substrate block</dd>','<dd>“Cuttings of nursery stock”; test group: brown material, as described in the report.</dd>')
   .replace("Full source files contain controlled business information and are shared with qualified buyers during project review. The summaries below preserve each report's stated scope.","The public factory SGS report is linked below. Other source documents can be reviewed with qualified buyers. Each summary preserves the stated sample and report scope.");
 } else {
  html=html.replace('<p><b>SGS · 21 May 2024</b></p>','<p><b>CANIN24009790301 · 21 May 2024</b></p><p>'+link+'</p>');
 }
 return html;
}
