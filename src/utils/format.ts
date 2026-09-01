import { CartItem, DeliveryZone, CustomCakeForm } from '../types';
import { STORE_INFO } from '../data/menuData';

export function formatRWF(amount: number): string {
  return `${amount.toLocaleString('en-US')} RWF`;
}

export function generateWhatsAppOrderUrl(
  items: CartItem[],
  deliveryType: 'delivery' | 'pickup',
  deliveryZone: DeliveryZone | null,
  customerName: string,
  customerPhone: string,
  deliveryAddress: string,
  orderNotes: string,
  subtotal: number,
  deliveryFee: number,
  discount: number,
  total: number,
  orderNumber: string
): string {
  let message = `🎂 *NEW ORDER - TANURI PASTRIES KIGALI*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🔖 *Order Ref:* #${orderNumber}\n`;
  message += `👤 *Customer:* ${customerName || 'Valued Guest'}\n`;
  message += `📞 *Phone:* ${customerPhone || 'Not specified'}\n`;
  message += `🚚 *Fulfillment:* ${deliveryType === 'delivery' ? '🚗 Delivery' : '🏪 Boutique Pickup'}\n`;

  if (deliveryType === 'delivery') {
    message += `📍 *Area:* ${deliveryZone?.name || 'Kigali'}\n`;
    if (deliveryAddress) {
      message += `🏠 *Address / House:* ${deliveryAddress}\n`;
    }
  } else {
    message += `📍 *Pickup Point:* ${deliveryZone?.name || 'Gacuriro Main Kitchen'}\n`;
  }

  message += `\n🍰 *ITEMS ORDERED:*\n`;
  items.forEach((item, index) => {
    message += `\n${index + 1}. *${item.product.name}* (x${item.quantity})\n`;
    if (item.options.size) {
      message += `   • Size/Portion: ${item.options.size}\n`;
    }
    if (item.options.sponge) {
      message += `   • Sponge: ${item.options.sponge}\n`;
    }
    if (item.options.frosting) {
      message += `   • Frosting: ${item.options.frosting}\n`;
    }
    if (item.options.customMessage) {
      message += `   • Custom Text: "${item.options.customMessage}"\n`;
    }
    if (item.options.candleOption) {
      message += `   • Candle: ${item.options.candleOption}\n`;
    }
    if (item.options.specialInstructions) {
      message += `   • Note: ${item.options.specialInstructions}\n`;
    }
    message += `   • Price: ${formatRWF(item.totalPrice)}\n`;
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💵 *Subtotal:* ${formatRWF(subtotal)}\n`;
  if (deliveryType === 'delivery') {
    message += `🛵 *Delivery Fee:* ${formatRWF(deliveryFee)}\n`;
  }
  if (discount > 0) {
    message += `🎁 *Discount Applied:* -${formatRWF(discount)}\n`;
  }
  message += `💰 *TOTAL AMOUNT:* ${formatRWF(total)}\n`;

  if (orderNotes) {
    message += `\n📝 *Additional Notes:* ${orderNotes}\n`;
  }

  message += `\n📱 *MTN MoMo Payment:* ${STORE_INFO.momoCode} (${STORE_INFO.momoMerchantName})\n`;
  message += `Thank you for ordering with Tanuri Pastries Kigali! ✨`;

  return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppCustomCakeUrl(formData: CustomCakeForm, estPrice: number): string {
  let message = `👑 *CUSTOM CELEBRATION CAKE INQUIRY - TANURI PASTRIES*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🎉 *Occasion:* ${formData.celebrationType}\n`;
  message += `🎂 *Tier Style:* ${formData.tiers} (~${formData.sizeKg} kg)\n`;
  message += `🍰 *Sponge Flavor:* ${formData.spongeFlavor}\n`;
  message += `🍓 *Filling / Layer:* ${formData.fillingFlavor}\n`;
  message += `🎨 *Frosting / Finish:* ${formData.outerFrosting}\n`;
  message += `✨ *Color Theme:* ${formData.colorTheme}\n`;
  if (formData.cakeMessage) {
    message += `✍️ *Custom Cake Message:* "${formData.cakeMessage}"\n`;
  }
  message += `🕯️ *Candles Required:* ${formData.candleCount} pcs\n`;
  message += `📅 *Date Needed:* ${formData.deliveryDate || 'ASAP'} at ${formData.deliveryTime || 'Flexible'}\n`;
  message += `📍 *Delivery / Pickup:* ${formData.deliveryType === 'delivery' ? `Delivery to ${formData.deliveryArea}` : 'Pickup at Gacuriro Hub'}\n`;
  message += `👤 *Client Name:* ${formData.customerName}\n`;
  message += `📞 *Client Phone:* ${formData.customerPhone}\n`;
  if (formData.notes) {
    message += `📝 *Design & Decor Notes:* ${formData.notes}\n`;
  }
  message += `\n💰 *Estimated Base Quote:* ~${formatRWF(estPrice)}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Hello Tanuri Pastries team, please review my custom cake request and let me know availability!`;

  return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
