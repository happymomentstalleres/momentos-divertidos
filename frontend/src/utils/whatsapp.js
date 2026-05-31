import { formatPrice } from './formatters'

/**
 * Genera el enlace de WhatsApp con el resumen del pedido
 * @param {Object} order - datos del pedido
 * @param {string} whatsappNumber - número de WhatsApp sin +
 */
export const generateWhatsAppLink = (order, whatsappNumber = '975335798') => {
  const { items, subtotal, deliveryCost, grandTotal, customerName, address, reference } = order

  const itemsList = items
    .map(i => `  • ${i.name} x${i.quantity} → ${formatPrice(i.price * i.quantity)}`)
    .join('\n')

  const message = `🎂 *NUEVO PEDIDO - Momentos Divertidos*

👤 *Cliente:* ${customerName}
📍 *Dirección:* ${address}${reference ? `\n📝 *Referencia:* ${reference}` : ''}

🛒 *Productos:*
${itemsList}

💰 *Subtotal:* ${formatPrice(subtotal)}
🚚 *Delivery:* ${formatPrice(deliveryCost)}
✅ *TOTAL:* ${formatPrice(grandTotal)}

_Pedido generado desde la tienda web_`

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${whatsappNumber}?text=${encoded}`
}
