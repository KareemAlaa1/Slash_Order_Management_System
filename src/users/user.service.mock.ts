
export class UserServiceMock {
  async getOrderHistory(userId: number) {
    // Mock implementation of getOrderHistory method
    return [
      { id: 1, orderDate: new Date(), status: 'Pending' },
      { id: 2, orderDate: new Date(), status: 'Shipped' },
    ];
  }
}
