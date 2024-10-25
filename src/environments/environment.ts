export const environment = {
  production: false,
  baseUrl: 'http://93.127.199.17:8080', // URL dasar API

  // URL API
  apiEndpoints: {
    register: '/api/register',
    login: '/api/login',
    product: '/api/product',
  },

  getProductsByNameUrl(productName: string): string {
    return `${this.baseUrl}/product?name=${productName}`;
  },

  getProductPatchurl(productId: string): string {
    return `${this.baseUrl}/product/${productId}`;
  },
};
