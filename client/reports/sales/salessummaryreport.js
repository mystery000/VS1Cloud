import {
  ReportService
} from "../report-service";
import 'jQuery.print/jQuery.print.js';
import {
  UtilityService
} from "../../utility-service";

import { TaxRateService } from "../../settings/settings-service";
import GlobalReportEvents from "../../lib/global/GlobalReportEvents";
import GlobalFunctions from "../../GlobalFunctions";
import LoadingOverlay from "../../LoadingOverlay";
import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import Datehandler from "../../DateHandler";
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "./salessummaryreport.html";

const reportService = new ReportService();
const utilityService = new UtilityService();
const taxRateService = new TaxRateService();

let defaultCurrencyCode = CountryAbbr;

Template.salessummaryreport.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.grandRecords = new ReactiveVar();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.reportrecords = new ReactiveVar([]);
  templateObject.salessummaryreportth = new ReactiveVar([]);



  FxGlobalFunctions.initVars(templateObject);
});

Template.salessummaryreport.onRendered(() => {
  LoadingOverlay.show();
  const templateObject = Template.instance();

  let reset_data = [
    { index: 1, label: 'Company', class: 'colWeekday', active: true, display: true, width: "150" },
    { index: 2, label: 'Type', class: 'colCostAmountBurleigh', active: true, display: true, width: "150" },
    { index: 3, label: 'Sales No.', class: 'colSoldAmountBurleigh', active: true, display: true, width: "150" },
    { index: 4, label: 'Sales Date', class: 'colCostAmountDefault', active: true, display: true, width: "150" },
    { index: 5, label: 'Employee Name', class: 'colSoldAmountDefault', active: true, display: true, width: "150" },
    { index: 6, label: 'Amount (Ex)', class: 'colTotalCostAmount text-right', active: true, display: true, width: "150" },
    { index: 7, label: 'Total Tax', class: 'colTotalSoldAmount text-right', active: true, display: true, width: "150" },
    { index: 8, label: 'Amount (Inc)', class: 'colSoldAmountExDefault text-right', active: true, display: true, width: "150" },
    { index: 9, label: 'Balance', class: 'colSalesTaxDefault text-right', active: true, display: true, width: "150" },
    // { index: 10, label: 'Sold Amount Ex(Hawaii)', class: 'colSoldAmountExHawaii', active: false, display: true, width: "100" },
    // { index: 11, label: 'Sales Tax (Hawaii)', class: 'colSalesTaxHawaii', active: false, display: true, width: "100" },
    // { index: 12, label: 'Cost Amount (Los Angeles)', class: 'colCostAmountLosAngels', active: false, display: true, width: "100" },
    // { index: 13, label: 'Sold Amount (Los Angeles)', class: 'colSoldAmountLosAngels', active: false, display: true, width: "100" },
    // { index: 14, label: 'Sold Amount Ex(Los Angeles)', class: 'colSoldAmountExLosAngels', active: false, display: true, width: "100" },
    // { index: 15, label: 'Sales Tax (Los Angeles)', class: 'colSalesTaxLosAngels', active: false, display: true, width: "100" },
    // { index: 16, label: 'Cost Amount (New York)', class: 'colCostAmountNewYork', active: false, display: true, width: "100" },
    // { index: 17, label: 'Sold Amount (New York)', class: 'colSoldAmountNewYork', active: false, display: true, width: "100" },
    // { index: 18, label: 'Sold Amount Ex(New York)', class: 'colSoldAmountExNewYork', active: false, display: true, width: "100" },
    // { index: 19, label: 'Sales Tax (New York)', class: 'colSalesTaxNewYork', active: false, display: true, width: "100" },
    // { index: 20, label: 'Cost Amount (Sales One)', class: 'colCostAmountSalesOne', active: false, display: true, width: "100" },
    // { index: 21, label: 'Sold Amount (Sales One)', class: 'colSoldAmountSalesOne', active: false, display: true, width: "100" },
    // { index: 22, label: 'Sold Amount Ex(Sales One)', class: 'colSoldAmountSalesExOne', active: false, display: true, width: "100" },
    // { index: 23, label: 'Sales Tax (Sales One)', class: 'colSalesTaxSalesOne', active: false, display: true, width: "100" },
    // { index: 24, label: 'Cost Not Used6', class: 'colCostNotUsed6', active: false, display: true, width: "100" },
    // { index: 25, label: 'Sold Not Used6', class: 'colSoldNotUsed6', active: false, display: true, width: "100" },
    // { index: 26, label: 'Sold Not Used6(Ex)', class: 'colSoldNotUsed6Ex', active: false, display: true, width: "100" },
    // { index: 27, label: 'Sold Not Used6(Tax)', class: 'colSoldNotUsed6Tax', active: false, display: true, width: "100" },
    // { index: 28, label: 'Cost Not Used7', class: 'colCostNotUsed7', active: false, display: true, width: "100" },
    // { index: 29, label: 'Sold Not Used7', class: 'colSoldNotUsed7', active: false, display: true, width: "100" },
    // { index: 30, label: 'Sold Not Used7(Ex)', class: 'colSoldNotUsed7Ex', active: false, display: true, width: "100" },
    // { index: 31, label: 'Sold Not Used7(Tax)', class: 'colSoldNotUsed7Tax', active: false, display: true, width: "100" },
    // { index: 32, label: 'Cost Not Used8', class: 'colCostNotUsed8', active: false, display: true, width: "100" },
    // { index: 33, label: 'Sold Not Used8', class: 'colSoldNotUsed8', active: false, display: true, width: "100" },
    // { index: 34, label: 'Sold Not Used8(Ex)', class: 'colSoldNotUsed8Ex', active: false, display: true, width: "100" },
    // { index: 35, label: 'Sold Not Used8(Tax)', class: 'colSoldNotUsed8Tax', active: false, display: true, width: "100" },
    // { index: 36, label: 'Cost Not Used9', class: 'colCostNotUsed9', active: false, display: true, width: "100" },
    // { index: 37, label: 'Sold Not Used9', class: 'colSoldNotUsed9', active: false, display: true, width: "100" },
    // { index: 38, label: 'Sold Not Used9(Ex)', class: 'colSoldNotUsed9Ex', active: false, display: true, width: "100" },
    // { index: 39, label: 'Sold Not Used9(Tax)', class: 'colSoldNotUsed9Tax', active: false, display: true, width: "100" },
    // { index: 40, label: 'Cost Not Used10', class: 'colCostNotUsed10', active: false, display: true, width: "100" },
    // { index: 41, label: 'Sold Not Used10', class: 'colSoldNotUsed10', active: false, display: true, width: "100" },
    // { index: 42, label: 'Sold Not Used10(Ex)', class: 'colSoldNotUsed10Ex', active: false, display: true, width: "100" },
    // { index: 43, label: 'Sold Not Used10(Tax)', class: 'colSoldNotUsed10Tax', active: false, display: true, width: "100" },
    // { index: 44, label: 'Cost Not Used11', class: 'colCostNotUsed11', active: false, display: true, width: "100" },
    // { index: 45, label: 'Sold Not Used11', class: 'colSoldNotUsed11', active: false, display: true, width: "100" },
    // { index: 46, label: 'Sold Not Used11(Ex)', class: 'colSoldNotUsed11Ex', active: false, display: true, width: "100" },
    // { index: 47, label: 'Sold Not Used11(Tax)', class: 'colSoldNotUsed11Tax', active: false, display: true, width: "100" },
    // { index: 48, label: 'Cost Not Used12', class: 'colCostNotUsed12', active: false, display: true, width: "100" },
    // { index: 49, label: 'Sold Not Used12', class: 'colSoldNotUsed12', active: false, display: true, width: "100" },
    // { index: 50, label: 'Sold Not Used12(Ex)', class: 'colSoldNotUsed12Ex', active: false, display: true, width: "100" },
    // { index: 51, label: 'Sold Not Used12(Tax)', class: 'colSoldNotUsed12Tax', active: false, display: true, width: "100" },
    // { index: 52, label: 'Cost Not Used13', class: 'colCostNotUsed13', active: false, display: true, width: "100" },
    // { index: 53, label: 'Sold Not Used13', class: 'colSoldNotUsed13', active: false, display: true, width: "100" },
    // { index: 54, label: 'Sold Not Used13(Ex)', class: 'colSoldNotUsed13Ex', active: false, display: true, width: "100" },
    // { index: 55, label: 'Sold Not Used13(Tax)', class: 'colSoldNotUsed13Tax', active: false, display: true, width: "100" },
    // { index: 56, label: 'Cost Not Used14', class: 'colCostNotUsed14', active: false, display: true, width: "100" },
    // { index: 57, label: 'Sold Not Used14', class: 'colSoldNotUsed14', active: false, display: true, width: "100" },
    // { index: 58, label: 'Sold Not Used14(Ex)', class: 'colSoldNotUsed14Ex', active: false, display: true, width: "100" },
    // { index: 59, label: 'Sold Not Used14(Tax)', class: 'colSoldNotUsed14Tax', active: false, display: true, width: "100" },
    // { index: 60, label: 'Cost Not Used15', class: 'colCostNotUsed15', active: false, display: true, width: "100" },
    // { index: 61, label: 'Sold Not Used15', class: 'colSoldNotUsed15', active: false, display: true, width: "100" },
    // { index: 62, label: 'Sold Not Used15(Ex)', class: 'colSoldNotUsed15Ex', active: false, display: true, width: "100" },
    // { index: 63, label: 'Sold Not Used15(Tax)', class: 'colSoldNotUsed15Tax', active: false, display: true, width: "100" },
    // { index: 64, label: 'Cost Not Used16', class: 'colCostNotUsed16', active: false, display: true, width: "100" },
    // { index: 65, label: 'Sold Not Used16', class: 'colSoldNotUsed16', active: false, display: true, width: "100" },
    // { index: 66, label: 'Sold Not Used16(Ex)', class: 'colSoldNotUsed16Ex', active: false, display: true, width: "100" },
    // { index: 67, label: 'Sold Not Used16(Tax)', class: 'colSoldNotUsed16Tax', active: false, display: true, width: "100" },
    // { index: 68, label: 'Cost Not Used17', class: 'colCostNotUsed17', active: false, display: true, width: "100" },
    // { index: 69, label: 'Sold Not Used17', class: 'colSoldNotUsed17', active: false, display: true, width: "100" },
    // { index: 70, label: 'Sold Not Used17(Ex)', class: 'colSoldNotUsed17Ex', active: false, display: true, width: "100" },
    // { index: 71, label: 'Sold Not Used17(Tax)', class: 'colSoldNotUsed17Tax', active: false, display: true, width: "100" },
    // { index: 72, label: 'Cost Not Used18', class: 'colCostNotUsed18', active: false, display: true, width: "100" },
    // { index: 73, label: 'Sold Not Used18', class: 'colSoldNotUsed18', active: false, display: true, width: "100" },
    // { index: 74, label: 'Sold Not Used18(Ex)', class: 'colSoldNotUsed18Ex', active: false, display: true, width: "100" },
    // { index: 75, label: 'Sold Not Used18(Tax)', class: 'colSoldNotUsed18Tax', active: false, display: true, width: "100" },
    // { index: 76, label: 'Cost Not Used19', class: 'colCostNotUsed19', active: false, display: true, width: "100" },
    // { index: 77, label: 'Sold Not Used19', class: 'colSoldNotUsed19', active: false, display: true, width: "100" },
    // { index: 78, label: 'Sold Not Used19(Ex)', class: 'colSoldNotUsed19Ex', active: false, display: true, width: "100" },
    // { index: 79, label: 'Sold Not Used19(Tax)', class: 'colSoldNotUsed19Tax', active: false, display: true, width: "100" },
    // { index: 80, label: 'Cost Not Used20', class: 'colCostNotUsed20', active: false, display: true, width: "100" },
    // { index: 81, label: 'Sold Not Used20', class: 'colSoldNotUsed20', active: false, display: true, width: "100" },
    // { index: 82, label: 'Sold Not Used20(Ex)', class: 'colSoldNotUsed20Ex', active: false, display: true, width: "100" },
    // { index: 83, label: 'Sold Not Used20(Tax)', class: 'colSoldNotUsed20Tax', active: false, display: true, width: "100" },
    // { index: 84, label: 'Cost Not Used21', class: 'colCostNotUsed21', active: false, display: true, width: "100" },
    // { index: 85, label: 'Sold Not Used21', class: 'colSoldNotUsed21', active: false, display: true, width: "100" },
    // { index: 86, label: 'Sold Not Used21(Ex)', class: 'colSoldNotUsed21Ex', active: false, display: true, width: "100" },
    // { index: 87, label: 'Sold Not Used21(Tax)', class: 'colSoldNotUsed21Tax', active: false, display: true, width: "100" },
    // { index: 88, label: 'Cost Not Used22', class: 'colCostNotUsed22', active: false, display: true, width: "100" },
    // { index: 89, label: 'Sold Not Used22', class: 'colSoldNotUsed22', active: false, display: true, width: "100" },
    // { index: 90, label: 'Sold Not Used22(Ex)', class: 'colSoldNotUsed22Ex', active: false, display: true, width: "100" },
    // { index: 91, label: 'Sold Not Used22(Tax)', class: 'colSoldNotUsed22Tax', active: false, display: true, width: "100" },
    // { index: 92, label: 'Cost Not Used23', class: 'colCostNotUsed23', active: false, display: true, width: "100" },
    // { index: 93, label: 'Sold Not Used23', class: 'colSoldNotUsed23', active: false, display: true, width: "100" },
    // { index: 94, label: 'Sold Not Used23(Ex)', class: 'colSoldNotUsed23Ex', active: false, display: true, width: "100" },
    // { index: 95, label: 'Sold Not Used23(Tax)', class: 'colSoldNotUsed23Tax', active: false, display: true, width: "100" },
    // { index: 96, label: 'Cost Not Used24', class: 'colCostNotUsed24', active: false, display: true, width: "100" },
    // { index: 97, label: 'Sold Not Used24', class: 'colSoldNotUsed24', active: false, display: true, width: "100" },
    // { index: 98, label: 'Sold Not Used24(Ex)', class: 'colSoldNotUsed24Ex', active: false, display: true, width: "100" },
    // { index: 99, label: 'Sold Not Used24(Tax)', class: 'colSoldNotUsed24Tax', active: false, display: true, width: "100" },
    // { index: 100, label: 'Cost Not Used25', class: 'colCostNotUsed25', active: false, display: true, width: "100" },
    // { index: 101, label: 'Sold Not Used25', class: 'colSoldNotUsed25', active: false, display: true, width: "100" },
    // { index: 102, label: 'Sold Not Used25(Ex)', class: 'colSoldNotUsed25Ex', active: false, display: true, width: "100" },
    // { index: 103, label: 'Sold Not Used25(Tax)', class: 'colSoldNotUsed25Tax', active: false, display: true, width: "100" },
    // { index: 104, label: 'Cost Not Used26', class: 'colCostNotUsed26', active: false, display: true, width: "100" },
    // { index: 105, label: 'Sold Not Used26', class: 'colSoldNotUsed26', active: false, display: true, width: "100" },
    // { index: 106, label: 'Sold Not Used26(Ex)', class: 'colSoldNotUsed26Ex', active: false, display: true, width: "100" },
    // { index: 107, label: 'Sold Not Used26(Tax)', class: 'colSoldNotUsed26Tax', active: false, display: true, width: "100" },
    // { index: 108, label: 'Cost Not Used27', class: 'colCostNotUsed27', active: false, display: true, width: "100" },
    // { index: 109, label: 'Sold Not Used27', class: 'colSoldNotUsed27', active: false, display: true, width: "100" },
    // { index: 110, label: 'Sold Not Used27(Ex)', class: 'colSoldNotUsed27Ex', active: false, display: true, width: "100" },
    // { index: 111, label: 'Sold Not Used27(Tax)', class: 'colSoldNotUsed27Tax', active: false, display: true, width: "100" },
    // { index: 112, label: 'Cost Not Used28', class: 'colCostNotUsed28', active: false, display: true, width: "100" },
    // { index: 113, label: 'Sold Not Used28', class: 'colSoldNotUsed28', active: false, display: true, width: "100" },
    // { index: 114, label: 'Sold Not Used28(Ex)', class: 'colSoldNotUsed28Ex', active: false, display: true, width: "100" },
    // { index: 115, label: 'Sold Not Used28(Tax)', class: 'colSoldNotUsed28Tax', active: false, display: true, width: "100" },
    // { index: 116, label: 'Cost Not Used29', class: 'colCostNotUsed29', active: false, display: true, width: "100" },
    // { index: 117, label: 'Sold Not Used29', class: 'colSoldNotUsed29', active: false, display: true, width: "100" },
    // { index: 118, label: 'Sold Not Used29(Ex)', class: 'colSoldNotUsed29Ex', active: false, display: true, width: "100" },
    // { index: 119, label: 'Sold Not Used29(Tax)', class: 'colSoldNotUsed29Tax', active: false, display: true, width: "100" },
    // { index: 120, label: 'Cost Not Used30', class: 'colCostNotUsed30', active: false, display: true, width: "100" },
    // { index: 121, label: 'Sold Not Used30', class: 'colSoldNotUsed30', active: false, display: true, width: "100" },
    // { index: 122, label: 'Sold Not Used30(Ex)', class: 'colSoldNotUsed30Ex', active: false, display: true, width: "100" },
    // { index: 123, label: 'Sold Not Used30(Tax)', class: 'colSoldNotUsed30Tax', active: false, display: true, width: "100" },
    // { index: 124, label: 'Cost Not Used31', class: 'colCostNotUsed31', active: false, display: true, width: "100" },
    // { index: 125, label: 'Sold Not Used31', class: 'colSoldNotUsed31', active: false, display: true, width: "100" },
    // { index: 126, label: 'Sold Not Used31(Ex)', class: 'colSoldNotUsed31Ex', active: false, display: true, width: "100" },
    // { index: 127, label: 'Sold Not Used31(Tax)', class: 'colSoldNotUsed31Tax', active: false, display: true, width: "100" },
    // { index: 128, label: 'Cost Not Used32', class: 'colCostNotUsed32', active: false, display: true, width: "100" },
    // { index: 129, label: 'Sold Not Used32', class: 'colSoldNotUsed32', active: false, display: true, width: "100" },
    // { index: 130, label: 'Sold Not Used32(Ex)', class: 'colSoldNotUsed32Ex', active: false, display: true, width: "100" },
    // { index: 131, label: 'Sold Not Used32(Tax)', class: 'colSoldNotUsed32Tax', active: false, display: true, width: "100" },
    // { index: 132, label: 'Cost Not Used33', class: 'colCostNotUsed33', active: false, display: true, width: "100" },
    // { index: 133, label: 'Sold Not Used33', class: 'colSoldNotUsed33', active: false, display: true, width: "100" },
    // { index: 134, label: 'Sold Not Used33(Ex)', class: 'colSoldNotUsed33Ex', active: false, display: true, width: "100" },
    // { index: 135, label: 'Sold Not Used33(Tax)', class: 'colSoldNotUsed33Tax', active: false, display: true, width: "100" },
    // { index: 136, label: 'Cost Not Used34', class: 'colCostNotUsed34', active: false, display: true, width: "100" },
    // { index: 137, label: 'Sold Not Used34', class: 'colSoldNotUsed34', active: false, display: true, width: "100" },
    // { index: 138, label: 'Sold Not Used34(Ex)', class: 'colSoldNotUsed34Ex', active: false, display: true, width: "100" },
    // { index: 139, label: 'Sold Not Used34(Tax)', class: 'colSoldNotUsed34Tax', active: false, display: true, width: "100" },
    // { index: 140, label: 'Cost Not Used35', class: 'colCostNotUsed35', active: false, display: true, width: "100" },
    // { index: 141, label: 'Sold Not Used35', class: 'colSoldNotUsed35', active: false, display: true, width: "100" },
    // { index: 142, label: 'Sold Not Used35(Ex)', class: 'colSoldNotUsed35Ex', active: false, display: true, width: "100" },
    // { index: 143, label: 'Sold Not Used35(Tax)', class: 'colSoldNotUsed35Tax', active: false, display: true, width: "100" },
    // { index: 144, label: 'Cost Not Used36', class: 'colCostNotUsed36', active: false, display: true, width: "100" },
    // { index: 145, label: 'Sold Not Used36', class: 'colSoldNotUsed36', active: false, display: true, width: "100" },
    // { index: 146, label: 'Sold Not Used36(Ex)', class: 'colSoldNotUsed36Ex', active: false, display: true, width: "100" },
    // { index: 147, label: 'Sold Not Used36(Tax)', class: 'colSoldNotUsed36Tax', active: false, display: true, width: "100" },
    // { index: 148, label: 'Cost Not Used37', class: 'colCostNotUsed37', active: false, display: true, width: "100" },
    // { index: 149, label: 'Sold Not Used37', class: 'colSoldNotUsed37', active: false, display: true, width: "100" },
    // { index: 150, label: 'Sold Not Used37(Ex)', class: 'colSoldNotUsed37Ex', active: false, display: true, width: "100" },
    // { index: 151, label: 'Sold Not Used37(Tax)', class: 'colSoldNotUsed37Tax', active: false, display: true, width: "100" },
    // { index: 152, label: 'Cost Not Used38', class: 'colCostNotUsed38', active: false, display: true, width: "100" },
    // { index: 153, label: 'Sold Not Used38', class: 'colSoldNotUsed38', active: false, display: true, width: "100" },
    // { index: 154, label: 'Sold Not Used38(Ex)', class: 'colSoldNotUsed38Ex', active: false, display: true, width: "100" },
    // { index: 155, label: 'Sold Not Used38(Tax)', class: 'colSoldNotUsed38Tax', active: false, display: true, width: "100" },
    // { index: 156, label: 'Cost Not Used39', class: 'colCostNotUsed39', active: false, display: true, width: "100" },
    // { index: 157, label: 'Sold Not Used39', class: 'colSoldNotUsed39', active: false, display: true, width: "100" },
    // { index: 158, label: 'Sold Not Used39(Ex)', class: 'colSoldNotUsed39Ex', active: false, display: true, width: "100" },
    // { index: 159, label: 'Sold Not Used39(Tax)', class: 'colSoldNotUsed39Tax', active: false, display: true, width: "100" },
    // { index: 160, label: 'Cost Not Used40', class: 'colCostNotUsed40', active: false, display: true, width: "100" },
    // { index: 161, label: 'Sold Not Used40', class: 'colSoldNotUsed40', active: false, display: true, width: "100" },
    // { index: 162, label: 'Sold Not Used40(Ex)', class: 'colSoldNotUsed40Ex', active: false, display: true, width: "100" },
    // { index: 163, label: 'Sold Not Used40(Tax)', class: 'colSoldNotUsed40Tax', active: false, display: true, width: "100" },
    // { index: 164, label: 'Total Sold Amount Ex', class: 'colAccountName', active: false, display: true, width: "100" },
    // { index: 165, label: 'Total Sale Tax', class: 'colAccountName', active: false, display: true, width: "100" },
  ];
  templateObject.salessummaryreportth.set(reset_data);

  templateObject.initDate = () => {
    Datehandler.initOneMonth();
  };

  templateObject.setDateAs = (dateFrom = null) => {
    templateObject.dateAsAt.set((dateFrom) ? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
  };

  templateObject.getSalesReports = async (dateFrom, dateTo, ignoreDate = false) => {
    LoadingOverlay.show();
    templateObject.setDateAs(dateFrom);
    let data = await CachedHttp.get(erpObject.TSalesList, async () => {
      return await reportService.getSalesDetailsSummaryData(dateFrom, dateTo, ignoreDate);
    }, {
      requestParams: {
        DateFrom: dateFrom,
        DateTo: dateTo,
        IgnoreDates: ignoreDate
      },
      useIndexDb: true,
      useLocalStorage: false,
      validate: (cachedResponse) => {
        if (GlobalFunctions.isSameDay(cachedResponse.response.Params.DateFrom, dateFrom)
          && GlobalFunctions.isSameDay(cachedResponse.response.Params.DateTo, dateTo)
          && cachedResponse.response.Params.IgnoreDates == ignoreDate) {
          return true;
        }
        return false;
      }
    });

    let totalRecord = [];

    if (data.response.tsaleslist) {
      localStorage.setItem('VS1SalesSummary_Report', JSON.stringify(data) || '');
      let records = [];
      let reportrecords = [];
      let allRecords = [];
      let current = [];

      let totalNetAssets = 0;
      let GrandTotalLiability = 0;
      let GrandTotalAsset = 0;
      let incArr = [];
      let cogsArr = [];
      let expArr = [];
      let accountData = data.response.tsaleslist;
      let accountType = '';
      let purchaseID = '';


      // for (let i = 0; i < accountData.length; i++) {
      //     // if(data.tsaleslist[i].Type == "Bill"){
      //     //   purchaseID = data.tsaleslist[i].PurchaseOrderID;
      //     // }
      //     let recordObj = {};
      //     recordObj.Id = data.tsaleslist[i].SaleId;
      //     recordObj.type = data.tsaleslist[i].Type;
      //     recordObj.Company = data.tsaleslist[i].CustomerName;
      //     recordObj.dataArr = [
      //         data.tsaleslist[i].ClientId,
      //         data.tsaleslist[i].Type,
      //         data.tsaleslist[i].SaleId,
      //         // moment(data.tsaleslist[i].InvoiceDate).format("DD MMM YYYY") || '-',
      //         data.tsaleslist[i].SaleDate != '' ? moment(data.tsaleslist[i].SaleDate).format("DD/MM/YYYY") : data.tsaleslist[i].SaleDate,
      //         data.tsaleslist[i].employeename || '-',
      //         utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalAmount) || '0.00',
      //         utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalTax) || '0.00',
      //         utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalAmountinc) || '0.00',
      //         utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].Balance) || '0.00'


      //         //
      //     ];






      //     if ((data.tsaleslist[i].TotalAmount != 0) || (data.tsaleslist[i].TotalTax != 0) ||
      //         (data.tsaleslist[i].TotalAmountinc != 0) || (data.tsaleslist[i].Balance != 0) && (data.tsaleslist[i].CustomerName != "")) {


      //         if ((data.tsaleslist[i].Type != "Sales Order") && (data.tsaleslist[i].Type != "Quote")) {
      //             records.push(recordObj);
      //         }
      //     }



      // }

      accountData.forEach((account) => {
        let obj = {
          Id: account.SaleId,
          type: account.Type,
          Company: account.CustomerName,
          entries: account
        }

        if ((account.TotalAmount != 0) || (account.TotalTax != 0) ||
          (account.TotalAmountinc != 0) || (account.Balance != 0) && (account.CustomerName != "")) {


          if ((account.Type != "Sales Order") && (account.Type != "Quote")) {
            records.push(obj);
          }
        }
      })


      //records = _.sortBy(records, 'Company');
      //records = _.groupBy(records, 'Company');

      for (let key in records) {
        // let obj = [{
        //     key: key
        // }, {
        //     data: records[key]
        // }];

        let obj = {
          title: key,
          entries: records[key],
          total: {}
        }
        allRecords.push(obj);
      }


      allRecords.forEach((record) => {
        let totalAmountEx = 0;
        let totalTax = 0;
        let amountInc = 0;
        let balance = 0;
        let twoMonth = 0;
        let threeMonth = 0;
        let Older = 0;
        const currencyLength = Currency.length;
        let entry = record.entries;
        //record.entries.forEach((entry) => {
          totalAmountEx = totalAmountEx + parseFloat(entry.entries.TotalAmount);
          totalTax = totalTax + parseFloat(entry.entries.TotalTax);
          amountInc = amountInc + parseFloat(entry.entries.TotalAmountinc);
          balance = balance + parseFloat(entry.entries.Balance);

        //});
        var dataList = {
          id: record.entries.SaleId || '',
          clientid: record.entries.ClientId || '',
          contact: record.entries.Company || '',
          type: '',
          orderno: '',
          orderdate: '',
          phone: '',
          totalamountex: totalAmountEx || '0.00',
          totaltax: totalTax || '0.00',
          totalamount: amountInc || '0.00',
          balance: balance || '0.00'
        };
        if (record.entries.SaleId != '') {
          reportrecords.push(dataList);
        }

        record.total = {
          Title: 'Total ' + record.entries.Company,
          AmountEx: totalAmountEx,
          TotalTax: totalTax,
          AmountInc: amountInc,
          Balance: balance
        }

        current.push(record.total);

      });

      // let iterator = 0;
      // for (let i = 0; i < allRecords.length; i++) {
      //     let totalAmountEx = 0;
      //     let totalTax = 0;
      //     let amountInc = 0;
      //     let balance = 0;
      //     let twoMonth = 0;
      //     let threeMonth = 0;
      //     let Older = 0;
      //     const currencyLength = Currency.length;

      //     for (let k = 0; k < allRecords[i][1].data.length; k++) {
      //         totalAmountEx = totalAmountEx + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[5]);
      //         totalTax = totalTax + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[6]);
      //         amountInc = amountInc + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[7]);
      //         balance = balance + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[8]);

      //     }

      //     var dataList = {
      //         id: allRecords[i][1].data[0].dataArr[2] || '',
      //         clientid: allRecords[i][1].data[0].dataArr[0] || '',
      //         contact: allRecords[i][0].key || '',
      //         type: '',
      //         orderno: '',
      //         orderdate: '',
      //         phone: '',
      //         totalamountex: utilityService.modifynegativeCurrencyFormat(totalAmountEx) || '0.00',
      //         totaltax: utilityService.modifynegativeCurrencyFormat(totalTax) || '0.00',
      //         totalamount: utilityService.modifynegativeCurrencyFormat(amountInc) || '0.00',
      //         balance: utilityService.modifynegativeCurrencyFormat(balance) || '0.00'
      //     };
      //     if (allRecords[i][1].data[0].dataArr[2] != '') {
      //         reportrecords.push(dataList);
      //     }



      //     let val = ['Total ' + allRecords[i][0].key + '', '', '', '', '',
      //         utilityService.modifynegativeCurrencyFormat(totalAmountEx), utilityService.modifynegativeCurrencyFormat(totalTax), utilityService.modifynegativeCurrencyFormat(amountInc), utilityService.modifynegativeCurrencyFormat(balance)
      //     ];
      //     current.push(val);

      // }

      templateObject.reportrecords.set(reportrecords);

      //grandtotalRecord
      let grandamountduetotal = 0;
      let grandtotalAmountEx = 0;
      let grandtotalTax = 0;
      let grandamountInc = 0;
      let grandbalance = 0;

      current.forEach((entry) => {

        const grandcurrencyLength = Currency.length;

        grandtotalAmountEx = grandtotalAmountEx + parseFloat(entry.AmountEx);
        grandtotalTax = grandtotalTax + parseFloat(entry.TotalTax);
        grandamountInc = grandamountInc + parseFloat(entry.AmountInc);
        grandbalance = grandbalance + parseFloat(entry.Balance);

      })

      // for (let n = 0; n < current.length; n++) {
      //     const grandcurrencyLength = Currency.length;
      //     grandtotalAmountEx = grandtotalAmountEx + utilityService.convertSubstringParseFloat(current[n][5]);
      //     grandtotalTax = grandtotalTax + utilityService.convertSubstringParseFloat(current[n][6]);
      //     grandamountInc = grandamountInc + utilityService.convertSubstringParseFloat(current[n][7]);
      //     grandbalance = grandbalance + utilityService.convertSubstringParseFloat(current[n][8]);
      // }


      // let grandval = ['Grand Total ' + '', '', '', '', '',
      //     utilityService.modifynegativeCurrencyFormat(grandtotalAmountEx),
      //     utilityService.modifynegativeCurrencyFormat(grandtotalTax),
      //     utilityService.modifynegativeCurrencyFormat(grandamountInc),
      //     utilityService.modifynegativeCurrencyFormat(grandbalance)
      // ];

      const grandval = {
        title: "Grand Total",
        total: {
          AmountEx: grandtotalAmountEx,
          Tax: grandtotalTax,
          AmountInc: grandamountInc,
          Balance: grandbalance
        }
      }


      // for (let key in records) {
      //     let dataArr = current[iterator]
      //     let obj = [{
      //         key: key
      //     }, {
      //         data: records[key]
      //     }, {
      //         total: [{
      //             dataArr: dataArr
      //         }]
      //     }];
      //     totalRecord.push(obj);
      //     iterator += 1;
      // }

      templateObject.records.set(totalRecord);
      templateObject.grandRecords.set(grandval);


      if (templateObject.records.get()) {
        setTimeout(function () {
          $('td a').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
          });
          $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
          });

          $('td').each(function () {

            let lineValue = $(this).first().text()[0];
            if (lineValue != undefined) {
              //if (lineValue.indexOf(Currency) >= 0) $(this).addClass('text-right')
            }

          });

          $('td').each(function () {
            //if ($(this).first().text().indexOf('-' + Currency) >= 0) $(this).addClass('text-right')
          });

          LoadingOverlay.hide();
        }, 100);
      }

    }

    LoadingOverlay.hide();
  };

  // var currentDate2 = new Date();
  // var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
  // let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + currentDate2.getDate();


  templateObject.getDepartments = function () {
    reportService.getDepartment().then(function (data) {
      let deptrecords = [];
      for (let i in data.tdeptclass) {

        let deptrecordObj = {
          id: data.tdeptclass[i].Id || ' ',
          department: data.tdeptclass[i].DeptClassName || ' ',
        };

        deptrecords.push(deptrecordObj);
        templateObject.deptrecords.set(deptrecords);

      }
    });

  }
  // templateObject.getAllProductData();

  templateObject.initDate();
  templateObject.getDepartments();
  templateObject.getSalesReports(
    GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
    GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
    false
  );
  templateObject.setDateAs(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()))
});

Template.salessummaryreport.events({
  'click .chkDatatable': function (event) {
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
    if ($(event.target).is(':checked')) {
      $('.' + columnDataValue).addClass('showColumn');
      $('.' + columnDataValue).removeClass('hiddenColumn');
    } else {
      $('.' + columnDataValue).addClass('hiddenColumn');
      $('.' + columnDataValue).removeClass('showColumn');
    }
  },
  'click .btnOpenReportSettings': () => {
    let templateObject = Template.instance();
    // let currenttranstablename = templateObject.data.tablename||";
    $(`thead tr th`).each(function (index) {
      var $tblrow = $(this);
      var colWidth = $tblrow.width() || 0;
      var colthClass = $tblrow.attr('data-class') || "";
      $('.rngRange' + colthClass).val(colWidth);
    });
    $('.' + templateObject.data.tablename + '_Modal').modal('toggle');
  },
  'change .custom-range': async function (event) {
    //   const tableHandler = new TableHandler();
    let range = $(event.target).val() || 0;
    let colClassName = $(event.target).attr("valueclass");
    await $('.' + colClassName).css('width', range);
    //   await $('.colAccountTree').css('width', range);
    $('.dataTable').resizable();
  },
  'click #btnDetails': function () {
    FlowRouter.go('/salesreport');
  },
  'click .btnRefresh': function () {
    LoadingOverlay.show();
    localStorage.setItem('VS1SalesSummary_Report', '');
    Meteor._reload.reload();
    LoadingOverlay.hide();
  },
  'click td a': function (event) {
    let redirectid = $(event.target).closest('tr').attr('id');

    let transactiontype = $(event.target).closest('tr').attr('class');;

    if (redirectid && transactiontype) {
      if (transactiontype === 'Quote') {
        window.open('/quotecard?id=' + redirectid, '_self');
      } else if (transactiontype === 'Sales Order') {
        window.open('/salesordercard?id=' + redirectid, '_self');
      } else if (transactiontype === 'Invoice') {
        window.open('/invoicecard?id=' + redirectid, '_self');
      } else if (transactiontype === 'Customer Payment') {
        // window.open('/paymentcard?id=' + redirectid,'_self');
      }
    }
    // window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
  },
  'click .btnPrintReport': function (event) {
    playPrintAudio();
    setTimeout(function () {
      document.title = 'Sales Summary Report';
      $(".printReport").print({
        title: document.title + " | Sales Summary | " + loggedCompany,
        noPrintSelector: ".addSummaryEditor",
      });
    }, delayTimeAfterSound);
  },
  'click .btnExportReport': function () {
    LoadingOverlay.show();
    let utilityService = new UtilityService();
    let templateObject = Template.instance();
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));

    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

    const filename = loggedCompany + '-Sales Summary' + '.csv';
    utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
    let rows = [];
    let data = templateObject.reportrecords.get();

    //reportService.getSalesDetailsData(formatDateFrom,formatDateTo,false).then(function (data) {
    // if(data){
    //     rows[0] = ['Company','Type', 'Sales No.', 'Sales Date', 'Employee Name', 'Total Amount (Ex)', 'Total Tax', 'Total Amount (Inc)', 'Balance'];
    //     data.forEach(function (e, i) {
    //         rows.push([
    //           data[i].contact,
    //           '',
    //           '',
    //           '',
    //           '',
    //           data[i].totalamountex || '0.00',
    //           data[i].totaltax || '0.00',
    //           data[i].totalamount || '0.00',
    //           data[i].balance || '0.00']);
    //
    //     });
    //     setTimeout(function () {
    //         utilityService.exportReportToCsv(rows, filename, 'xls');
    //         $('.fullScreenSpin').css('display','none');
    //     }, 1000);
    // }

    //  });
    LoadingOverlay.hide();
  },
  "click #ignoreDate": function () {
    let templateObject = Template.instance();
    LoadingOverlay.show();
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.getSalesReports(null, null, true);
  },
  "change #dateTo, change #dateFrom": (e) => {
    let templateObject = Template.instance();
    LoadingOverlay.show();
    templateObject.getSalesReports(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    )
  },
  ...Datehandler.getDateRangeEvents(),
  'keyup #myInputSearch': function (event) {
    $('.table tbody tr').show();
    let searchItem = $(event.target).val();
    if (searchItem != '') {
      var value = searchItem.toLowerCase();
      $('.table tbody tr').each(function () {
        var found = 'false';
        $(this).each(function () {
          if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            found = 'true';
          }
        });
        if (found == 'true') {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    } else {
      $('.table tbody tr').show();
    }
  },
  'blur #myInputSearch': function (event) {
    $('.table tbody tr').show();
    let searchItem = $(event.target).val();
    if (searchItem != '') {
      var value = searchItem.toLowerCase();
      $('.table tbody tr').each(function () {
        var found = 'false';
        $(this).each(function () {
          if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            found = 'true';
          }
        });
        if (found == 'true') {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    } else {
      $('.table tbody tr').show();
    }
  },



  // CURRENCY MODULE //
  ...FxGlobalFunctions.getEvents(),
  "click .currency-modal-save": (e) => {
    //$(e.currentTarget).parentsUntil(".modal").modal("hide");
    LoadingOverlay.show();

    let templateObject = Template.instance();

    // Get all currency list
    let _currencyList = templateObject.currencyList.get();

    // Get all selected currencies
    const currencySelected = $(".currency-selector-js:checked");
    let _currencySelectedList = [];
    if (currencySelected.length > 0) {
      $.each(currencySelected, (index, e) => {
        const sellRate = $(e).attr("sell-rate");
        const buyRate = $(e).attr("buy-rate");
        const currencyCode = $(e).attr("currency");
        const currencyId = $(e).attr("currency-id");
        let _currency = _currencyList.find((c) => c.id == currencyId);
        _currency.active = true;
        _currencySelectedList.push(_currency);
      });
    } else {
      let _currency = _currencyList.find((c) => c.code == defaultCurrencyCode);
      _currency.active = true;
      _currencySelectedList.push(_currency);
    }

    _currencyList.forEach((value, index) => {
      if (_currencySelectedList.some((c) => c.id == _currencyList[index].id)) {
        _currencyList[index].active = _currencySelectedList.find(
          (c) => c.id == _currencyList[index].id
        ).active;
      } else {
        _currencyList[index].active = false;
      }
    });

    _currencyList = _currencyList.sort((a, b) => {
      if (a.code == defaultCurrencyCode) {
        return -1;
      }
      return 1;
    });

    // templateObject.activeCurrencyList.set(_activeCurrencyList);
    templateObject.currencyList.set(_currencyList);

    LoadingOverlay.hide();
  },

});
Template.salessummaryreport.helpers({
  salessummaryreportth: () => {
    return Template.instance().salessummaryreportth.get();
  },
  records: () => {
    return Template.instance().records.get();
    //   .sort(function(a, b){
    //     if (a.accounttype == 'NA') {
    //   return 1;
    //       }
    //   else if (b.accounttype == 'NA') {
    //     return -1;
    //   }
    // return (a.accounttype.toUpperCase() > b.accounttype.toUpperCase()) ? 1 : -1;
    // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
    // });
  },

  grandRecords: () => {
    return Template.instance().grandRecords.get();
  },
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || '-';
  },
  companyname: () => {
    return loggedCompany;
  },
  deptrecords: () => {
    return Template.instance().deptrecords.get().sort(function (a, b) {
      if (a.department == 'NA') {
        return 1;
      } else if (b.department == 'NA') {
        return -1;
      }
      return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
    });
  },
  reportrecords: () => {
    return Template.instance().reportrecords.get();
  },

  // FX Module //
  convertAmount: (amount, currencyData) => {
    let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

    if (isNaN(amount)) {
      if (!amount || amount.trim() == "") {
        return "";
      }
      amount = utilityService.convertSubstringParseFloat(amount); // This will remove all currency symbol
    }
    // if (currencyData.code == defaultCurrencyCode) {
    //   // default currency
    //   return amount;
    // }


    // Lets remove the minus character
    const isMinus = amount < 0;
    if (isMinus == true) amount = amount * -1; // make it positive for now

    // // get default currency symbol
    // let _defaultCurrency = currencyList.filter(
    //   (a) => a.Code == defaultCurrencyCode
    // )[0];

    // amount = amount.replace(_defaultCurrency.symbol, "");


    // amount =
    //   isNaN(amount) == true
    //     ? parseFloat(amount.substring(1))
    //     : parseFloat(amount);



    // Get the selected date
    let dateTo = $("#dateTo").val();
    const day = dateTo.split("/")[0];
    const m = dateTo.split("/")[1];
    const y = dateTo.split("/")[2];
    dateTo = new Date(y, m, day);
    dateTo.setMonth(dateTo.getMonth() - 1); // remove one month (because we added one before)


    // Filter by currency code
    currencyList = currencyList.filter((a) => a.Code == currencyData.code);

    // Sort by the closest date
    currencyList = currencyList.sort((a, b) => {
      a = GlobalFunctions.timestampToDate(a.MsTimeStamp);
      a.setHours(0);
      a.setMinutes(0);
      a.setSeconds(0);

      b = GlobalFunctions.timestampToDate(b.MsTimeStamp);
      b.setHours(0);
      b.setMinutes(0);
      b.setSeconds(0);

      var distancea = Math.abs(dateTo - a);
      var distanceb = Math.abs(dateTo - b);
      return distancea - distanceb; // sort a before b when the distance is smaller

      // const adate= new Date(a.MsTimeStamp);
      // const bdate = new Date(b.MsTimeStamp);

      // if(adate < bdate) {
      //   return 1;
      // }
      // return -1;
    });

    const [firstElem] = currencyList; // Get the firest element of the array which is the closest to that date



    let rate = currencyData.code == defaultCurrencyCode ? 1 : firstElem.BuyRate; // Must used from tcurrecyhistory




    amount = parseFloat(amount * rate); // Multiply by the rate
    amount = Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }); // Add commas

    let convertedAmount =
      isMinus == true
        ? `- ${currencyData.symbol} ${amount}`
        : `${currencyData.symbol} ${amount}`;


    return convertedAmount;
  },
  count: (array) => {
    return array.length;
  },
  countActive: (array) => {
    if (array.length == 0) {
      return 0;
    }
    let activeArray = array.filter((c) => c.active == true);
    return activeArray.length;
  },
  currencyList: () => {
    return Template.instance().currencyList.get();
  },
  isNegativeAmount(amount) {
    if (Math.sign(amount) === -1) {

      return true;
    }
    return false;
  },
  isOnlyDefaultActive() {
    const array = Template.instance().currencyList.get();
    if (array.length == 0) {
      return false;
    }
    let activeArray = array.filter((c) => c.active == true);

    if (activeArray.length == 1) {

      if (activeArray[0].code == defaultCurrencyCode) {
        return !true;
      } else {
        return !false;
      }
    } else {
      return !false;
    }
  },
  isCurrencyListActive() {
    const array = Template.instance().currencyList.get();
    let activeArray = array.filter((c) => c.active == true);

    return activeArray.length > 0;
  },
  isObject(variable) {
    return typeof variable === "object" && variable !== null;
  },
  currency: () => {
    return Currency;
  },

  formatPrice(amount) {

    let utilityService = new UtilityService();
    if (isNaN(amount)) {
      amount = (amount === undefined || amount === null || amount.length === 0) ? 0 : amount;
      amount = (amount) ? Number(amount.replace(/[^0-9.-]+/g, "")) : 0;
    }
    return utilityService.modifynegativeCurrencyFormat(amount) || 0.00;
  },
  formatTax(amount) {

    if (isNaN(amount)) {
      amount = (amount === undefined || amount === null || amount.length === 0) ? 0 : amount;
      amount = (amount) ? Number(amount.replace(/[^0-9.-]+/g, "")) : 0;
    }
    return amount + "%" || "0.00 %";
  },
});
Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.registerHelper('notEquals', function (a, b) {
  return a != b;
});

Template.registerHelper('containsequals', function (a, b) {
  return (a.indexOf(b) >= 0);
});


