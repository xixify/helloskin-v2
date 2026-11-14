# Hello Skin – retail storefront preview (multipage)

Clickable design preview for the Hello Skin store, built to be rebuilt 1:1 in WordPress with Elementor Pro and the free WooCommerce plugin. No paid WooCommerce extensions are assumed.

Live: https://xixify.github.io/helloskin-v2/

Prices, ratings and some copy are placeholders. The minimal direction lives in [helloskin-V1](https://github.com/xixify/helloskin-V1). Layout inspired by retail beauty stores; name, colours and copy are Hello Skin's own.

## Pages and how each one is built in WordPress

| Preview page | WordPress / WooCommerce page | Built with |
|---|---|---|
| `index.html` | Home (static front page) | Elementor page: Slides (banner), Loop Carousel (product rails), Nested Tabs (combos, concerns), Hotspot (routine photo), Image Box (brands, ingredients) |
| `shop.html` (`?cat=`, `?brand=`, `?s=`) | Shop, product category, brand and search archives | Theme Builder **Products Archive** template: Archive Title, Loop Grid, WooCommerce sorting, free WooCommerce filter blocks (Brand, Price, Active filters) |
| `product.html?p=…` | Single product | Theme Builder **Single Product** template: Product Images, Title, Price, Add to Cart, Accordion, Related/Upsells |
| `cart.html` | Cart (`/cart/`) | Elementor Pro **Cart** widget: quantities, coupon, shipping options, cross-sells |
| `checkout.html` | Checkout (`/checkout/`) | Elementor Pro **Checkout** widget: billing fields, ship-to-different-address, order notes, order review, payment, terms |
| `order-received.html` | Order received (checkout endpoint) | Elementor Pro **Purchase Summary** widget, or WooCommerce's default thank-you page |
| `my-account.html` | My account (`/my-account/`) | Elementor Pro **My Account** widget: login/register, Dashboard, Orders, Addresses, Account details, Log out |
| `about.html`, `shipping-returns.html` | Regular pages | Elementor page: text, image, Accordion (FAQ) |
| `contact.html` | Contact page | Elementor Pro **Form** widget |
| Header / footer / cart drawer | Site-wide | Theme Builder Header/Footer, **Mega menu** (Pro Menu widget with dropdown content), **Search** widget with live results, **Menu Cart** (slide-out, View cart + Checkout), mobile bottom bar as a sticky container |

Combo kits are their own simple products with a regular and sale price. Brands use WooCommerce's built-in Brands; concerns and ingredients are product tags. Sale prices, ratings and reviews are placeholders.

## Store settings this preview assumes (all free WooCommerce)

- Shipping zone Bangladesh: flat rate "Inside Dhaka" ৳60, "Outside Dhaka" ৳120, and Free shipping with a ৳2,000 minimum order.
- Payments: Cash on delivery and Direct bank transfer.
- Coupon `HELLO10` (10% off) is an example.
- Checkout districts come from WooCommerce's built-in Bangladesh states list.
- Policy text on `shipping-returns.html` is example copy to replace.

`retail/` redirects to the root for old links.
