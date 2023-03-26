import { ServiceContext } from "twilio/lib/rest/chat/v1/service";

export default class TransactionFields {
    // If Back Order: We (ORDERED, SHIPPIED and BO” ) and If not we have Just “QTY”
    static initPurchaseOrderLine = [
        { index: 0,  label: "Product Name",        class: "ProductName",   width: "300",       active: true,   display: true },
        { index: 1,  label: "Description",         class: "Description",   width: "",          active: true,   display: true },
        { index: 2,  label: "Qty",                 class: "Qty",           width: "50",        active: true,   display: true },
        { index: 3,  label: "Price (Ex)",          class: "UnitPriceEx",   width: "122",       active: true,   display: true },
        { index: 4,  label: "Price (Inc)",         class: "UnitPriceInc",  width: "122",       active: false,  display: true },
        { index: 5,  label: "Customer/Job",        class: "CustomerJob",   width: "110",       active: true,   display: true },
        { index: 6,  label: "CustField1",          class: "SalesLinesCustField1", width: "110",active: false,  display: true },
        { index: 7,  label: "Tax Code",            class: "TaxCode",       width: "95",        active: true,   display: true },
        { index: 8,  label: "Tax Amt",             class: "TaxAmount",     width: "75",        active: true,   display: true },
        { index: 9,  label: "Amount (Ex)",         class: "AmountEx",      width: "152",       active: true,   display: true },
        { index: 10, label: "Amount (Inc)",        class: "AmountInc",     width: "152",       active: false,  display: true },
        { index: 11, label: "Fixed Asset",         class: "FixedAsset",    width: "100",       active: true,   display: true },
    ];
    static initBillLine = [
        { index: 0,  label: "Account Name",       class: "AccountName",   width: "300",       active: true,   display: true },
        { index: 1,  label: "Memo",               class: "Memo",          width: "",          active: true,   display: true },
        { index: 2,  label: "Amount (Ex)",        class: "AmountEx",      width: "140",       active: true,   display: true },
        { index: 3,  label: "Amount (Inc)",       class: "AmountInc",     width: "140",       active: false,  display: true },
        { index: 4,  label: "Fixed Asset",        class: "FixedAsset",    width: "124",       active: true,   display: true },
        { index: 5,  label: "Customer/Job",       class: "CustomerJob",   width: "155",       active: true,   display: true },
        { index: 6,  label: "Tax Rate",           class: "TaxRate",       width: "95",        active: true,   display: true },
        { index: 7,  label: "Tax Code",           class: "TaxCode",       width: "95",        active: true,   display: true },
        { index: 8,  label: "Tax Amt",            class: "TaxAmount",     width: "95",        active: true,   display: true },
        { index: 9,  label: "Custom Field 1",     class: "CustomField1",  width: "124",       active: false,  display: true },
        { index: 10, label: "Custom Field 2",     class: "CustomField2",  width: "124",       active: false,  display: true },
    ];
    static initCreditLine = [
        { index: 0,  label: "Account Name",       class: "AccountName",   width: "300",       active: true,   display: true },
        { index: 1,  label: "Memo",               class: "Memo",          width: "",          active: true,   display: true },
        { index: 2,  label: "Amount (Ex)",        class: "AmountEx",      width: "140",       active: true,   display: true },
        { index: 3,  label: "Amount (Inc)",       class: "AmountInc",     width: "140",       active: false,  display: true },
        { index: 4,  label: "Fixed Asset",        class: "FixedAsset",    width: "124",       active: true,   display: true },
        { index: 5,  label: "Tax Rate",           class: "TaxRate",       width: "95",        active: true,   display: true },
        { index: 6,  label: "Tax Code",           class: "TaxCode",       width: "95",        active: true,   display: true },
        { index: 7,  label: "Serial/Lot No",      class: "SerialNo",      width: "110",       active: true,   display: true },
        { index: 8,  label: "Custom Field 1",     class: "CustomField1",  width: "124",       active: false,  display: true },
        { index: 9,  label: "Custom Field 2",     class: "CustomField2",  width: "124",       active: false,  display: true },
    ];
    static initQuoteLine = [
        { index: 0,  label: "Product Name",        class: "ProductName",   width: "300",       active: true,   display: true },
        { index: 1,  label: "Description",         class: "Description",   width: "",          active: true,   display: true },
        { index: 2,  label: "Qty",                 class: "Qty",           width: "55",        active: true,   display: true },
        { index: 3,  label: "Unit Price (Ex)",     class: "UnitPriceEx",   width: "152",       active: true,   display: true },
        { index: 4,  label: "Unit Price (Inc)",    class: "UnitPriceInc",  width: "152",       active: false,  display: true },
        { index: 5,  label: "Disc %",              class: "Discount",      width: "95",        active: true,   display: true },
        { index: 6,  label: "Cost Price",          class: "CostPrice",     width: "110",       active: true,   display: true },
        { index: 7,  label: "SalesLinesCustField1",class: "SalesLinesCustField1", width: "110",active: false,  display: true },
        { index: 8,  label: "Tax Rate",           class: "TaxRate",        width: "95",        active: true,   display: true },
        { index: 9,  label: "Tax Code",           class: "TaxCode",        width: "95",        active: true,   display: true },
        { index: 10, label: "Tax Amt",            class: "TaxAmount",      width: "95",        active: true,   display: true },
        { index: 11, label: "Amount (Ex)",        class: "AmountEx",       width: "140",       active: true,   display: true },
        { index: 12, label: "Amount (Inc)",       class: "AmountInc",      width: "140",       active: false,  display: true },
        
    ];
    static initSalesOrderLine = [
        { index: 0,  label: "Product Name",        class: "ProductName",   width: "300",       active: true,   display: true },
        { index: 1,  label: "Description",         class: "Description",   width: "",          active: true,   display: true },
        { index: 2,  label: "Qty",                 class: "Qty",           width: "55",        active: true,   display: true },
        { index: 3,  label: "Unit Price (Ex)",     class: "UnitPriceEx",   width: "152",       active: true,   display: true },
        { index: 4,  label: "Unit Price (Inc)",    class: "UnitPriceInc",  width: "152",       active: false,  display: true },
        { index: 5,  label: "Disc %",              class: "Discount",      width: "95",        active: true,   display: true },
        { index: 6,  label: "Cost Price",          class: "CostPrice",     width: "110",       active: true,   display: true },
        { index: 7,  label: "SalesLinesCustField1",class: "SalesLinesCustField1", width: "110",active: false,  display: true },
        { index: 8,  label: "Tax Rate",           class: "TaxRate",        width: "95",        active: true,   display: true },
        { index: 9,  label: "Tax Code",           class: "TaxCode",        width: "95",        active: true,   display: true },
        { index: 10, label: "Tax Amt",            class: "TaxAmount",      width: "95",        active: true,   display: true },
        { index: 11, label: "Amount (Ex)",        class: "AmountEx",       width: "140",       active: true,   display: true },
        { index: 12, label: "Amount (Inc)",       class: "AmountInc",      width: "140",       active: false,  display: true },
    ];
    //If Back Order: We Have (ORDERED, SHIPPIED and BO” ) and If not we have Just “QTY”
    static initInvoiceLine = [
        { index: 0,  label: "Product Name",        class: "ProductName",   width: "300",       active: true,   display: true },
        { index: 1,  label: "Description",         class: "Description",   width: "",          active: true,   display: true },
        { index: 2,  label: "Qty",                 class: "Qty",           width: "55",        active: true,   display: true },
        { index: 3,  label: "Unit Price (Ex)",     class: "UnitPriceEx",   width: "152",       active: true,   display: true },
        { index: 4,  label: "Unit Price (Inc)",    class: "UnitPriceInc",  width: "152",       active: false,  display: true },
        { index: 5,  label: "Disc %",              class: "Discount",      width: "95",        active: true,   display: true },
        { index: 6,  label: "Cost Price",          class: "CostPrice",     width: "110",       active: true,   display: true },
        { index: 7,  label: "SalesLinesCustField1",class: "SalesLinesCustField1", width: "110",active: false,  display: true },
        { index: 8,  label: "Tax Rate",           class: "TaxRate",        width: "95",        active: true,   display: true },
        { index: 9,  label: "Tax Code",           class: "TaxCode",        width: "95",        active: true,   display: true },
        { index: 10, label: "Tax Amt",            class: "TaxAmount",      width: "95",        active: true,   display: true },
        { index: 11, label: "Amount (Ex)",        class: "AmountEx",       width: "140",       active: true,   display: true },
        { index: 12, label: "Amount (Inc)",       class: "AmountInc",      width: "140",       active: false,  display: true },
        { index: 13, label: "Units",              class: "Units",          width: "95",        active: true,   display: true },
        { index: 14,  label: "Custom Field 1",     class: "CustomField1",  width: "124",       active: false,  display: true },
        { index: 15,  label: "Custom Field 2",     class: "CustomField2",  width: "124",       active: false,  display: true },
    ];
    static initRefundLine = [
        { index: 0,  label: "Product Name",        class: "ProductName",   width: "300",       active: true,   display: true },
        { index: 1,  label: "Description",         class: "Description",   width: "",          active: true,   display: true },
        { index: 2,  label: "Qty",                 class: "Qty",           width: "55",        active: true,   display: true },
        { index: 3,  label: "Unit Price (Ex)",     class: "UnitPriceEx",   width: "152",       active: true,   display: true },
        { index: 4,  label: "Unit Price (Inc)",    class: "UnitPriceInc",  width: "152",       active: false,  display: true },
        { index: 5,  label: "Disc %",              class: "Discount",      width: "95",        active: true,   display: true },
        { index: 6,  label: "Cost Price",          class: "CostPrice",     width: "110",       active: true,   display: true },
        { index: 7,  label: "SalesLinesCustField1",class: "SalesLinesCustField1", width: "110",active: true,   display: true },
        { index: 8,  label: "Tax Rate",           class: "TaxRate",        width: "95",        active: true,   display: true },
        { index: 9,  label: "Tax Code",           class: "TaxCode",        width: "95",        active: true,   display: true },
        { index: 10, label: "Tax Amt",            class: "TaxAmount",      width: "95",        active: true,   display: true },
        { index: 11, label: "Amount (Ex)",        class: "AmountEx",       width: "140",       active: true,   display: true },
        { index: 12, label: "Amount (Inc)",       class: "AmountInc",      width: "140",       active: false,  display: true },
    ];
    static insertData(src, content) {
        return src.map(item => {
            let findItem = content.find(x => x.class === item.class);
            if(findItem != undefined) return {...findItem, index: item.index};
            return {...item, display: false, active: false};
        });
    }
}
