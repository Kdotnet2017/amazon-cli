var Item = function (id, qty) {
    this.Id = id;
    this.Name="";
    this.Quantity = qty;
    this.Price = 0.00;
    this.Sales = 0.00;
    this.stockQuantity=0;
    this.departmentName="";
    this.updateSales = function () {
        this.Sales += this.Quantity * this.Price;
    }
}

module.exports = Item; 