function PlatformBadge({ marketplace }) {
  const getBadgeColor = (marketplace) => {
    switch (marketplace) {
      // South Korea
      case 'Naver Smart Store':
        return 'bg-green-500 text-white border-green-600'
      case 'Coupang':
        return 'bg-rose-600 text-white border-rose-700'
      case 'Gmarket':
        return 'bg-emerald-500 text-white border-emerald-600'
      case '11st':
        return 'bg-red-500 text-white border-red-600'
      // North America
      case 'eBay':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Amazon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Shopify':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Walmart':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Etsy':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Target':
        return 'bg-red-100 text-red-800 border-red-200'
      // Japan & Taiwan
      case 'Rakuten':
        return 'bg-red-600 text-white border-red-700'
      case 'Qoo10':
        return 'bg-blue-600 text-white border-blue-700'
      case 'Shopee TW':
        return 'bg-orange-500 text-white border-orange-600'
      case 'Momo':
        return 'bg-pink-500 text-white border-pink-600'
      case 'Ruten':
        return 'bg-orange-400 text-white border-orange-500'
      // South East Asia
      case 'Shopee':
        return 'bg-orange-500 text-white border-orange-600'
      case 'Lazada':
        return 'bg-blue-500 text-white border-blue-600'
      case 'Tokopedia':
        return 'bg-green-600 text-white border-green-700'
      // Europe
      case 'Allegro':
        return 'bg-orange-500 text-white border-orange-600'
      case 'Zalando':
        return 'bg-gray-900 text-white border-black'
      case 'Cdiscount':
        return 'bg-red-600 text-white border-red-700'
      case 'Otto':
        return 'bg-red-500 text-white border-red-600'
      // Latin America & Others
      case 'Mercado Libre':
        return 'bg-yellow-400 text-yellow-900 border-yellow-500'
      case 'Wildberries':
        return 'bg-purple-600 text-white border-purple-700'
      case 'Flipkart':
        return 'bg-blue-600 text-white border-blue-700'
      case 'Ozon':
        return 'bg-blue-500 text-white border-blue-600'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(
        marketplace
      )}`}
    >
      {marketplace || 'eBay'}
    </span>
  )
}

export default PlatformBadge

