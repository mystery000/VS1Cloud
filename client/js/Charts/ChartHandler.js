import DashboardApi from "../Api/DashboardApi";
import Tvs1ChartDashboardPreference from "../Api/Model/Tvs1ChartDashboardPreference";
import Tvs1ChartDashboardPreferenceField from "../Api/Model/Tvs1ChartDashboardPreferenceField";
import ApiService from "../Api/Module/ApiService";

export default class ChartHandler {
  constructor() {}

  static buildPositions() {
    const charts = $(".chart-visibility");
    console.log("Rebuilding list");

    for (let i = 0; i <= charts.length; i++) {
      $(charts[i]).attr("position", i);
    }
  }

  static buildCardPositions(charts = $(".card-visibility")) {
    // const charts = $(".card-visibility");
    for (let i = 0; i <= charts.length; i++) {
      $(charts[i]).attr("position", i);
    }
  }

  static async saveCharts(charts = $(".chart-visibility")) {
       /**
     * Lets load all API colections
     */
    const dashboardApis = new DashboardApi(); // Load all dashboard APIS
    ChartHandler.buildPositions();
  
  
    /**
     * @property {Tvs1ChartDashboardPreference[]}
     */
    let chartList = [];
  
    // now we have to make the post request to save the data in database
    const apiEndpoint = dashboardApis.collection.findByName(
      dashboardApis.collectionNames.Tvs1dashboardpreferences
    );
  
    Array.prototype.forEach.call(charts, (chart) => {
      //console.log(chart);
      chartList.push(
        new Tvs1ChartDashboardPreference({
          type: "Tvs1dashboardpreferences",
          fields: new Tvs1ChartDashboardPreferenceField({
            Active:
              $(chart).find(".on-editor-change-mode").attr("is-hidden") == true ||
              $(chart).find(".on-editor-change-mode").attr("is-hidden") == "true"
                ? false
                : true,
            ChartID: $(chart).attr("chart-id"),
            ID: $(chart).attr("pref-id"), // This is empty when it is the first time, but the next times it is filled
            EmployeeID: Session.get("mySessionEmployeeLoggedID"),
            Chartname: $(chart).attr("chart-name"),
            Position: parseInt($(chart).attr("position")),
            ChartGroup: $(chart).parents(".charts").attr("data-chartgroup"),
            TabGroup: $(chart).parents(".charts").attr("data-tabgroup"),
            ChartWidth: $(chart).find(".ui-resizable").width(),
            ChartHeight: $(chart).find(".ui-resizable").height(),
          }),
        })
      );
    });
    // save into local storage
    localStorage.setItem($(chart).parents(".charts").attr("data-chartgroup"), JSON.stringify(chartList));
    for (const _chart of chartList) {
      // chartList.forEach(async (chart) => {
      //console.log("Saving chart");
  
      const ApiResponse = await apiEndpoint.fetch(null, {
        method: "POST",
        headers: ApiService.getPostHeaders(),
        body: JSON.stringify(_chart),
      });
  
      if (ApiResponse.ok == true) {
        const jsonResponse = await ApiResponse.json();
        // console.log(
        //   "Chart: " +
        //     _chart.ChartName +
        //     " will be hidden ? " +
        //     !_chart.fields.Active
        // );
      }
      //});
    }
  }

  static async saveChart(chart) {
    /**
     * Lets load all API colections
     */
    const dashboardApis = new DashboardApi(); // Load all dashboard APIS

    // now we have to make the post request to save the data in database
    const apiEndpoint = dashboardApis.collection.findByName(
      dashboardApis.collectionNames.Tvs1dashboardpreferences
    );

    let pref = new Tvs1ChartDashboardPreference({
      type: "Tvs1dashboardpreferences",
      fields: new Tvs1ChartDashboardPreferenceField({
        Active:
          $(chart).find(".on-editor-change-mode").attr("is-hidden") == true ||
          $(chart).find(".on-editor-change-mode").attr("is-hidden") == "true"
            ? false
            : true,
        ChartID: $(chart).attr("chart-id"),
        ID: $(chart).attr("pref-id"), // This is empty when it is the first time, but the next times it is filled
        EmployeeID: Session.get("mySessionEmployeeLoggedID"),
        Chartname: $(chart).attr("chart-name"),
        Position: parseInt($(chart).attr("position")),
        ChartGroup: $(chart).parents(".charts").attr("data-chartgroup"),
        TabGroup: $(chart).parents(".charts").attr("data-tabgroup"),
        ChartWidth: $(chart).find(".ui-resizable").width(),
        ChartHeight: $(chart).find(".ui-resizable").height(),
      }),
    });

    const ApiResponse = await apiEndpoint.fetch(null, {
      method: "POST",
      headers: ApiService.getPostHeaders(),
      body: JSON.stringify(pref),
    });
  }
}
