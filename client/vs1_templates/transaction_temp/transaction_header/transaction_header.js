Template.transaction_header.helpers({
  getUserLabel: () => {
    const cardType = Template.instance().data.cardType;
    switch(cardType){
      case "Invoice":
        return "Customer";
      case "Bill":
      case "PO":
      case "credit": 
        return "Supplier";
      default:
        return "Customer"
    }
  },
  getDateInputLabel: () => {
    const cardType = Template.instance().data.cardType;
    if (cardType === 'Invoice') return "Sales Date";
    else return "Order Date";
  }
})