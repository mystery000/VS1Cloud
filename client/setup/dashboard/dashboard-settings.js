import './dashboard-settings.html'
import { ReactiveVar } from 'meteor/reactive-var';
import '../../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';

Template.wizard_dashboard.onCreated(function () {
  Template.wizard_dashboard.inheritsEventsFrom('non_transactional_list');
  Template.wizard_dashboard.inheritsHelpersFrom('non_transactional_list');
  this.includeSalesDefault = new ReactiveVar(false);
  this.includePurchaseDefault = new ReactiveVar(false);

  this.getDashboardOptions = async function() {
    let data;
    const initialData = require('../../popUps/dashboardoptions.json');
    try {
        const dataObject = await getVS1Data('TVS1DashboardStatus');
        if(dataObject.length) {
            data = JSON.parse(dataObject[0].data)
        } else {
            data = initialData;
        }
    } catch(error) {
        data = initialData;
    }

    return data;
  }
})

Template.wizard_dashboard.events({
  'change [name="optcheckboxDL"]': async function (event){
    const value = $(event.target).val();
    const isChecked = event.target.checked;
    const templateObject = Template.instance();
    let data = await templateObject.getDashboardOptions();
    const updatedIndex = data.findIndex(d => d.name == value);
    data[updatedIndex].isdefaultlogin = isChecked;
    addVS1Data("TVS1DashboardStatus", JSON.stringify(data));
  },
  'change [name="showdefaultinput"]': async function(event){
    const value = $(event.target).val();
    const isChecked = event.target.checked;
    const templateObject = Template.instance();
    let data = await templateObject.getDashboardOptions();
    const updatedIndex = data.findIndex(d => d.name == value);
    if(isChecked){
      for(let i = 0; i < data.length; i ++ ){
        data[i].isshowdefault = false
      }
    }
    data[updatedIndex].isshowdefault = isChecked;
    addVS1Data("TVS1DashboardStatus", JSON.stringify(data));
  }
})