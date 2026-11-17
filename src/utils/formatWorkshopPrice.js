// Convierte el precio de un taller (numero, tal como lo envia el backend)
// en texto legible en español, con el simbolo de la moneda. Un precio de 0
// se muestra como "Gratis" en vez de "0,00 €", mas claro para las familias.
// Si no hay precio (null/undefined), devuelve una cadena vacía en vez de
// fallar, igual que formatWorkshopDate y formatWorkshopTime
export function formatWorkshopPrice(price) {
  if (price === null || price === undefined) {
    return ''
  }

  const numericPrice = Number(price)

  if (numericPrice === 0) {
    return 'Gratis'
  }

  const formatted = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(numericPrice)

  // Intl.NumberFormat separa el numero del simbolo "€" con un espacio de
  // no separacion ( ) o, segun la version de ICU del motor de Node,
  // con un espacio fino de no separacion ( ) -- visualmente iguales
  // a un espacio normal, pero un caracter distinto por debajo. Lo
  // normalizamos a un espacio normal para que el texto sea siempre el
  // mismo, sin importar donde se ejecute (local, CI, etc.)
  return formatted.replace(/[  ]/g, ' ')
}
