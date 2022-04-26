import { CRMService } from '../../crm-service';
let crmService = new CRMService();

Template.tasklist_sidebar.onCreated(function () {

  console.log('onCreated...')

  const templateObject = Template.instance();
  templateObject.active_projects = new ReactiveVar([]);
  templateObject.archived_projects = new ReactiveVar([]);
  templateObject.favorite_projects = new ReactiveVar([]);

});

Template.tasklist_sidebar.onRendered(function () {

  let templateObject = Template.instance();

  templateObject.getTProjectList = function () {
    crmService.getTProjectList().then(function (data) {

      if (data.tprojectlist && data.tprojectlist.length > 0) {

        let archived_projects = data.tprojectlist.filter(project => project.fields.Active == false);
        let active_projects = data.tprojectlist.filter(project => project.fields.Active == true);
        let favorite_projects = active_projects.slice(0, 2);
        // tempcode because favorite field is no exist yet
        // let favorite_projects = active_projects.filter(project => project.fields.Favorite == true);

        templateObject.active_projects.set(active_projects);
        templateObject.archived_projects.set(archived_projects);
        templateObject.favorite_projects.set(favorite_projects);

        console.log(favorite_projects, favorite_projects.length)
        $('.crm_project_count').html(active_projects.length)
        if (favorite_projects.length > 0) {
          $('#li_favorite').css('display', 'block');
        } else {
          $('#li_favorite').css('display', 'none');
        }

      } else {
        $('.crm_project_count').html(0)
      }

    }).catch(function (err) {

    });
  }

  templateObject.getTProjectList();
});

Template.tasklist_sidebar.events({

  // delete project
  'click .delete-project': function (e) {
    let id = e.target.dataset.id;
    console.log(id)
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Active: false
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        $('.projectName' + id).remove();
        console.log(data)
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  // add to favorite project
  'click .add-favorite': function (e) {
    let id = e.target.dataset.id;
    let projectName = e.target.dataset.name;
    let projecttasks = e.target.dataset.projecttasks;
    let projecttasks_count = '';
    if (projecttasks != null && projecttasks != undefined && projecttasks != "undefined") {
      projecttasks_count = projecttasks.fields.lentgh;
    }
    console.log(id, projecttasks)
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Active: true
          // Favorite: true
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        // $('.projectName' + id).remove();
        $('#li_favorite').css('display', 'block');

        console.log(data);
        let project = `<li class="list-group-item projectmenuoption projectName${id}">
          <i class="fas fa-circle" style="margin-right: 8px; width: 25px; color: purple;"></i>
          <span class="projectName"><a
              href="/projects?id=${id}">${projectName}</a></span>
          <span class="projectMenu">
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle projectDropdown" type="button"
                id="dropdownMenuButton_${id}" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div class="dropdown-menu project-dropdown-menu"
                aria-labelledby="dropdownMenuButton_${id}">
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="far fa-edit" style="margin-right: 8px;"></i>Edit
                  Project</a>
                <a class="dropdown-item remove-favorite" href="#" data-id="${id}" 
                data-name="${projectName}" data-projecttasks="${projecttasks}">
                  <i class="far fa-heart" style="margin-right: 8px;"></i>Remove from favorites</a>
              </div>
            </div>
          </span>
          <span class="projectItems">${projecttasks_count}</span>
        </li>`;
        $('#crmFavoriteUl').append(project);
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  // unarchive project
  'click .remove-favorite': function (e) {
    let id = e.target.dataset.id;
    let projectName = e.target.dataset.name;
    let projecttasks = e.target.dataset.projecttasks;
    let projecttasks_count = '';
    if (projecttasks != null && projecttasks != undefined && projecttasks != "undefined") {
      projecttasks_count = projecttasks.fields.lentgh;
    }
    console.log(id, projecttasks)
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Active: true
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        $('#crmFavoriteUl .projectName' + id).remove();
        console.log(data);
        // let project = `<li class="list-group-item projectmenuoption projectName${id}">
        //   <i class="fas fa-circle" style="margin-right: 8px; width: 25px; color: purple;"></i>
        //   <span class="projectName"><a
        //       href="/projects?id=${id}">${projectName}</a></span>
        //   <span class="projectMenu">
        //     <div class="dropdown">
        //       <button class="btn btn-secondary dropdown-toggle projectDropdown" type="button"
        //         id="dropdownMenuButton_${id}" data-toggle="dropdown" aria-haspopup="true"
        //         aria-expanded="false">
        //         <i class="fas fa-ellipsis-h"></i>
        //       </button>
        //       <div class="dropdown-menu project-dropdown-menu"
        //         aria-labelledby="dropdownMenuButton_${id}">
        //         <a class="dropdown-item" href="#" data-id="${id}">
        //           <i class="fas fa-arrow-up" style="margin-right: 8px;"></i>Add
        //           Project Above</a>
        //         <a class="dropdown-item" href="#" data-id="${id}">
        //           <i class="fas fa-arrow-down" style="margin-right: 8px;"></i>Add
        //           Project Below</a>
        //         <div class="dropdown-divider"></div>
        //         <a class="dropdown-item" href="#" data-id="${id}">
        //           <i class="far fa-edit" style="margin-right: 8px;"></i>Edit
        //           Project</a>
        //         <a class="dropdown-item" href="#" data-id="${id}">
        //           <i class="fas fa-user-plus" style="margin-right: 8px;"></i>Share
        //           Project</a>
        //         <a class="dropdown-item" href="#" data-id="${id}">
        //           <i class="far fa-heart" style="margin-right: 8px;"></i>Add to
        //           Favorites</a>
        //         <div class="dropdown-divider"></div>
        //         <a class="dropdown-item" href="#" data-id="${id}">
        //           <i class="fas fa-copy" style="margin-right: 8px;"></i>Duplicate
        //           Project</a>
        //         <a class="dropdown-item" href="#" data-id="${id}">
        //           <i class="fas fa-envelope" style="margin-right: 8px;"></i>Emals
        //           Tasks to this Project</a>
        //         <a class="dropdown-item" href="#" data-id="${id}">
        //           <i class="fas fa-list" style="margin-right: 8px;"></i>Project
        //           Calendar Feed</a>
        //         <div class="dropdown-divider"></div>
        //         <a class="dropdown-item archive-project" href="#" data-id="${id}" data-name="${projectName}" data-projecttasks="${projecttasks}">
        //           <i class="fas fa-archive" style="margin-right: 8px;"></i>Archive
        //           Project</a>
        //         <a class="dropdown-item delete-project" href="#" data-id="${id}">
        //           <i class="fas fa-trash-alt" style="margin-right: 8px;"></i>Delete
        //           Project</a>
        //       </div>
        //     </div>
        //   </span>
        //   <span class="projectItems">${projecttasks_count}</span>
        // </li>`;
        // $('#crmProjectUl').prepend(project);
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  // archive project
  'click .archive-project': function (e) {
    let id = e.target.dataset.id;
    let projectName = e.target.dataset.name;
    let projecttasks = e.target.dataset.projecttasks;
    let projecttasks_count = '';
    if (projecttasks != null && projecttasks != undefined && projecttasks != "undefined") {
      projecttasks_count = projecttasks.fields.lentgh;
    }
    console.log(id, projecttasks)
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Active: false
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        $('.projectName' + id).remove();
        console.log(data);
        let project = `<li class="list-group-item projectmenuoption projectName${id}">
          <i class="fas fa-circle" style="margin-right: 8px; width: 25px; color: purple;"></i>
          <span class="projectName">
            <a href="/projects?id=${id}"
              style="background: transparent;">${projectName}</a>
          </span>
          <span class="projectMenu">
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle projectDropdown" type="button"
                id="dropdownMenuButton${id}" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div class="dropdown-menu project-dropdown-menu"
                aria-labelledby="dropdownMenuButton${id}">
                <a class="dropdown-item unarchive-project" href="#" data-id="${id}"
                  data-name="${projectName}" data-projecttasks="${projecttasks}">
                  <i class="fas fa-archive" style="margin-right: 8px;"></i>Unarchive
                  Project</a>
                <a class="dropdown-item delete-project" href="#" data-id="${id}">
                  <i class="fas fa-trash-alt" style="margin-right: 8px;"></i>Delete
                  Project</a>
              </div>
            </div>
          </span>
          <span class="projectItems">${projecttasks_count}</span>
        </li>`;
        $('#archivedProjectUl').append(project);
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  // unarchive project
  'click .unarchive-project': function (e) {
    let id = e.target.dataset.id;
    let projectName = e.target.dataset.name;
    let projecttasks = e.target.dataset.projecttasks;
    let projecttasks_count = '';
    if (projecttasks != null && projecttasks != undefined && projecttasks != "undefined") {
      projecttasks_count = projecttasks.fields.lentgh;
    }
    console.log(id, projecttasks)
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Active: true
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        $('.projectName' + id).remove();
        console.log(data);
        let project = `<li class="list-group-item projectmenuoption projectName${id}">
          <i class="fas fa-circle" style="margin-right: 8px; width: 25px; color: purple;"></i>
          <span class="projectName"><a
              href="/projects?id=${id}">${projectName}</a></span>
          <span class="projectMenu">
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle projectDropdown" type="button"
                id="dropdownMenuButton_${id}" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div class="dropdown-menu project-dropdown-menu"
                aria-labelledby="dropdownMenuButton_${id}">
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-arrow-up" style="margin-right: 8px;"></i>Add
                  Project Above</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-arrow-down" style="margin-right: 8px;"></i>Add
                  Project Below</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="far fa-edit" style="margin-right: 8px;"></i>Edit
                  Project</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-user-plus" style="margin-right: 8px;"></i>Share
                  Project</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="far fa-heart" style="margin-right: 8px;"></i>Add to
                  Favorites</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-copy" style="margin-right: 8px;"></i>Duplicate
                  Project</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-envelope" style="margin-right: 8px;"></i>Emals
                  Tasks to this Project</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-list" style="margin-right: 8px;"></i>Project
                  Calendar Feed</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item archive-project" href="#" data-id="${id}" data-name="${projectName}" data-projecttasks="${projecttasks}">
                  <i class="fas fa-archive" style="margin-right: 8px;"></i>Archive
                  Project</a>
                <a class="dropdown-item delete-project" href="#" data-id="${id}">
                  <i class="fas fa-trash-alt" style="margin-right: 8px;"></i>Delete
                  Project</a>
              </div>
            </div>
          </span>
          <span class="projectItems">${projecttasks_count}</span>
        </li>`;
        $('#crmProjectUl').prepend(project);
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  // add new project
  'click .btnNewCrmProject': function (e) {
    let projectName = $('#crmProjectName').val();
    let crmProjectColor = $('#crmProjectColor').val();
    let swtNewCrmProjectFavorite = $("#swtNewCrmProjectFavorite").prop("checked")

    console.log(projectName, crmProjectColor, swtNewCrmProjectFavorite);
    $('.fullScreenSpin').css('display', 'inline-block');

    var objDetails = {
      type: "Tprojectlist",
      fields: {
        Active: true,
        ProjectName: projectName,
        // Favorite: swtNewCrmProjectFavorite
      }
    };
    crmService.updateProject(objDetails).then(function (data) {
      console.log(data)
      let id = data.fields.ID;
      let project = `<li class="list-group-item projectmenuoption projectName${id}">
          <i class="fas fa-circle" style="margin-right: 8px; width: 25px; color: purple;"></i>
          <span class="projectName"><a
              href="/projects?id=${id}">${projectName}</a></span>
          <span class="projectMenu">
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle projectDropdown" type="button"
                id="dropdownMenuButton_${id}" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div class="dropdown-menu project-dropdown-menu"
                aria-labelledby="dropdownMenuButton_${id}">
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-arrow-up" style="margin-right: 8px;"></i>Add
                  Project Above</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-arrow-down" style="margin-right: 8px;"></i>Add
                  Project Below</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="far fa-edit" style="margin-right: 8px;"></i>Edit
                  Project</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-user-plus" style="margin-right: 8px;"></i>Share
                  Project</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="far fa-heart" style="margin-right: 8px;"></i>Add to
                  Favorites</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-copy" style="margin-right: 8px;"></i>Duplicate
                  Project</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-envelope" style="margin-right: 8px;"></i>Emals
                  Tasks to this Project</a>
                <a class="dropdown-item" href="#" data-id="${id}">
                  <i class="fas fa-list" style="margin-right: 8px;"></i>Project
                  Calendar Feed</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item archive-project" href="#" data-id="${id}" data-name="${projectName}">
                  <i class="fas fa-archive" style="margin-right: 8px;"></i>Archive
                  Project</a>
                <a class="dropdown-item delete-project" href="#" data-id="${id}">
                  <i class="fas fa-trash-alt" style="margin-right: 8px;"></i>Delete
                  Project</a>
              </div>
            </div>
          </span>
          <span class="projectItems"></span>
        </li>`;
      $('#crmProjectUl').prepend(project);

      $('.fullScreenSpin').css('display', 'none');
      // Meteor._reload.reload();
    }).catch(function (err) {
      swal({
        title: 'Oooops...',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
      }).then((result) => {
      });
      $('.fullScreenSpin').css('display', 'none');
    });
  }

});

Template.tasklist_sidebar.helpers({

  active_projects: () => {
    return Template.instance().active_projects.get();
  },

  archived_projects: () => {
    return Template.instance().archived_projects.get();
  },

  favorite_projects: () => {
    return Template.instance().favorite_projects.get();
  },

  getProjectCount: (tasks) => {
    if (tasks == null) {
      return '';
    } else {
      return tasks.fields.lentgh;
    }
  }
});
