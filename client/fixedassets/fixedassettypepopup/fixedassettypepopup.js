import "../../lib/global/indexdbstorage.js";

Template.fixedassettypepopup.onCreated(function () {
  const templateObject = Template.instance();
});

Template.fixedassettypepopup.onRendered(function () {
});

Template.fixedassettypepopup.events({
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },

});