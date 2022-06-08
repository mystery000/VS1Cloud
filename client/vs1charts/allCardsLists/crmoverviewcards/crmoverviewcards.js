import "../../../lib/global/indexdbstorage";
import { CRMService } from "../../../crm/crm-service";
let crmService = new CRMService();

Template.crmoverviewcards.onCreated(function () {
  let templateObject = Template.instance();
});

Template.crmoverviewcards.onRendered(function () {
  let templateObject = Template.instance();

  templateObject.getInitialAllTaskList = function () {
    $(".fullScreenSpin").css("display", "inline-block");
    getVS1Data("TCRMTaskList")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          templateObject.getAllTaskList();
        } else {
          let data = JSON.parse(dataObject[0].data);
          let today = moment().format("YYYY-MM-DD");
          let all_records = data.tprojecttasks;

          all_records = all_records.filter(
            (item) => item.fields.Completed == false
          );

          let today_records = all_records.filter(
            (item) => item.fields.due_date.substring(0, 10) == today
          );
          let upcoming_records = all_records.filter(
            (item) => item.fields.due_date.substring(0, 10) > today
          );
          let overdue_records = all_records.filter(
            (item) =>
              !item.fields.due_date ||
              item.fields.due_date.substring(0, 10) < today
          );

          $(".").text(all_records.length);
          $(".crm_today_count").text(today_records.length);
          $(".crm_upcoming_count").text(upcoming_records.length);

          $(".fullScreenSpin").css("display", "none");
        }
      })
      .catch(function (err) {
        templateObject.getAllTaskList();
      });
  };

  templateObject.getAllTaskList = function () {
    crmService
      .getAllTaskList()
      .then(function (data) {
        if (data.tprojecttasks && data.tprojecttasks.length > 0) {
          let today = moment().format("YYYY-MM-DD");
          let all_records = data.tprojecttasks;

          all_records = all_records.filter(
            (item) => item.fields.Completed == false
          );

          let today_records = all_records.filter(
            (item) => item.fields.due_date.substring(0, 10) == today
          );
          let upcoming_records = all_records.filter(
            (item) => item.fields.due_date.substring(0, 10) > today
          );
          let overdue_records = all_records.filter(
            (item) =>
              !item.fields.due_date ||
              item.fields.due_date.substring(0, 10) < today
          );

          $(".crm_all_count").text(all_records.length);
          $(".crm_today_count").text(today_records.length);
          $(".crm_upcoming_count").text(upcoming_records.length);

          addVS1Data("TCRMTaskList", JSON.stringify(data));
        } else {
          $(".crm_all_count").text(0);
          $(".crm_today_count").text(0);
          $(".crm_upcoming_count").text(0);
        }
        $(".fullScreenSpin").css("display", "none");
      })
      .catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
      });
  };

  templateObject.getInitialAllTaskList();

  // labels tab ----------------- //

  // projects tab -------------------
  templateObject.getInitTProjectList = function () {
    getVS1Data("TCRMProjectList")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          templateObject.getTProjectList();
        } else {
          let data = JSON.parse(dataObject[0].data);
          if (data.tprojectlist && data.tprojectlist.length > 0) {
            let tprojectlist = data.tprojectlist;
            let all_projects = data.tprojectlist;

            tprojectlist = tprojectlist.filter(
              (proj) => proj.fields.Active == true && proj.fields.ID != 11
            );
            all_projects = all_projects.filter((proj) => proj.fields.ID != 11);

            let active_projects = all_projects.filter(
              (project) => project.fields.Active == true
            );
            let deleted_projects = all_projects.filter(
              (project) => project.fields.Active == false
            );
            let favorite_projects = active_projects.filter(
              (project) => project.fields.AddToFavourite == true
            );
            $(".crm_project_count").html(active_projects.length);
          } else {
            $(".crm_project_count").html(0);
          }
        }
      })
      .catch(function (err) {
        templateObject.getTProjectList();
      });
  };

  templateObject.getTProjectList = function () {
    crmService
      .getTProjectList()
      .then(function (data) {
        if (data.tprojectlist && data.tprojectlist.length > 0) {
          let tprojectlist = data.tprojectlist;
          let all_projects = data.tprojectlist;

          tprojectlist = tprojectlist.filter(
            (proj) => proj.fields.Active == true && proj.fields.ID != 11
          );
          all_projects = all_projects.filter((proj) => proj.fields.ID != 11);
          let active_projects = all_projects.filter(
            (project) => project.fields.Active == true
          );
          let deleted_projects = all_projects.filter(
            (project) => project.fields.Active == false
          );
          let favorite_projects = active_projects.filter(
            (project) => project.fields.AddToFavourite == true
          );

          $(".crm_project_count").html(active_projects.length);
        } else {
          $(".crm_project_count").html(0);
        }
        addVS1Data("TCRMProjectList", JSON.stringify(data));
      })
      .catch(function (err) {});
  };

  templateObject.getInitTProjectList();

})

Template.crmoverviewcards.events({
  
});
