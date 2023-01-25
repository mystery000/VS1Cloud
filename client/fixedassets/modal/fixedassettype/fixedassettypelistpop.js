import "../../../lib/global/indexdbstorage.js";

Template.fixedassettypelistpop.onCreated(function () {
  const templateObject = Template.instance();
});

Template.fixedassettypelistpop.onRendered(function () {
});

Template.fixedassettypelistpop.events({
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },

});