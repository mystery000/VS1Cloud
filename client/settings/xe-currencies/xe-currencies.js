import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();

Template.xecurrencies.onCreated(() => {
  const templateObject = Template.instance();
  
});

Template.xecurrencies.onRendered(function () {
  const templateObject = Template.instance();

    templateObject.getXeCurrencySettings = async () => {
      let employeeId = Session.get("mySessionEmployeeLoggedID");
      let xeSettings = await getVS1Data('TXeCurrencySettings');
      if( xeSettings.length ){
          let data = JSON.parse(xeSettings[0].data);
          let currentXeCurrency = data.txecurrencysettings.filter((item) => {
              if ( parseInt( item.fields.EmployeeID ) == parseInt( employeeId ) ) {
                  return item;
              }
          });
          if( currentXeCurrency.length ){
            $('#apiId').val(currentXeCurrency[0].fields.ApiID);
            $('#apiKey').val(currentXeCurrency[0].fields.ApiKey);
          }
      }
    }
    templateObject.getXeCurrencySettings();

});

Template.xecurrencies.events({
  'click #saveXeCurrencySettings': async function(event){
    event.preventDefault();
    $(".fullScreenSpin").css("display", "block");
    let employeeId = Session.get("mySessionEmployeeLoggedID");
    let apiId = $('#apiId').val();
    let apiKey = $('#apiKey').val();
    let xeSettings = await getVS1Data('TXeCurrencySettings');
    let xeCurrenciesList = [];
    if( xeSettings.length ){
        let data = JSON.parse(xeSettings[0].data);
        xeCurrenciesList = data.txecurrencysettings.filter((item) => {
            if ( parseInt( item.fields.EmployeeID ) != parseInt( employeeId ) ) {
                return item;
            }
        });
    }
    xeCurrenciesList.push({
      type: "TXeCurrencySettings",
      fields: {
        ApiID: apiId,
        ApiKey: apiKey,
        EmployeeID: employeeId,
      }
    });

    let tXeSettings = {
      txecurrencysettings: xeCurrenciesList
    }

    await addVS1Data('TXeCurrencySettings', JSON.stringify(tXeSettings));
    $(".fullScreenSpin").css("display", "none");
  }
});
