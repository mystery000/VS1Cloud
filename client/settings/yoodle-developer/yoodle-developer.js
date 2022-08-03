import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { TaxRateService } from '../settings-service';


const settingService = new TaxRateService();
const settingFields = ['VS1YODLEEDEVELOPERLOGINNAME', 'VS1YODLEEDEVELOPERCLIENTID', 'VS1YODLEEDEVELOPERAUTHORIZATION'];
const specialSearchKey = "vs1yodleedevelopersettings"

Template.yoodledeveloper.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.settingDetails = new ReactiveVar([]);

});

Template.yoodledeveloper.onRendered(function () {
    
    const templateObject = Template.instance();

    templateObject.getSettingsList = async function () {
        $('.fullScreenSpin').css('display','none');
        let data = [];
        let details = [];
        let dataObject = await getVS1Data('TERPPreference')
        if ( dataObject.length > 0) {
            data = JSON.parse(dataObject[0].data);
            details = data.terppreference.filter(function( item ){
                if( settingFields.includes( item.PrefName ) ){
                    return item;
                }
            }); 
        }
        if( details.length == 0 ){
            dataobj = await settingService.getPreferenceSettings( settingFields );
            details = dataobj.terppreference;
            data.terppreference.push(...details);
            await addVS1Data('TERPPreference', JSON.stringify(data))
        }

        if( details.length > 0 ){
            templateObject.settingDetails.set( details );
            for (const item of details) {
                $('#' + item.PrefName).val( item.Fieldvalue );
            }
        }
        
    };

  templateObject.getSettingsList();

});

Template.yoodledeveloper.events({
  'click #yoodleDeveloperSignUp': function() {
    window.open("https://developer.yodlee.com/user/login");
  },
  'click #saveYoodleDeveloperSettings': async function(){
    swal({
        title: 'Confirm saving',
        text: "You're about to save Yoodle Developer, proceed?.",
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed',
    }).then( async (result) => {
        if (result.value) {
            $('.fullScreenSpin').css('display','block');

            let settingObject = [];
            const templateObject = Template.instance();
            let settingDetails = templateObject.settingDetails.get();
            if( settingDetails.length > 0 ){
                for (const item of settingDetails) {
                    if( settingFields.includes( item.PrefName ) == true ){
                        let FieldValue = $('#' + item.PrefName).val();
                        settingObject.push({
                            type: "TERPPreference",
                            fields: {
                            Id: item.Id,
                            Fieldvalue: FieldValue
                            }
                        });
                    }
                }
            }else{
                for (const PrefName of settingFields) {
                    let FieldValue = $('#' + PrefName).val();
                    settingObject.push({
                        type: "TERPPreference",
                        fields: {
                            FieldType: "ftString",
                            FieldValue: FieldValue,
                            KeyValue: specialSearchKey,
                            PrefName: PrefName,
                            PrefType: "ptCompany",
                            RefType: "None"
                        }
                    })
                }
            }
            if( settingObject.length ){
                let settingJSON = {
                    type: "TERPPreference",
                    objects:settingObject
                };

                const ApiResponse = await settingService.savePreferenceSettings( settingJSON );
                let data = await settingService.getPreferenceSettings( settingFields );
                let dataObject = await getVS1Data('TERPPreference')
                let details = [];
                if ( dataObject.length > 0) {
                    dataObj = JSON.parse(dataObject[0].data);
                    details = dataObj.terppreference.filter(function( item ){
                        if( settingFields.includes( item.PrefName ) == false ){
                            return item;
                        }
                    }); 
                    templateObject.settingDetails.set( data.terppreference );
                    data.terppreference.push(...details);
                    await addVS1Data('TERPPreference', JSON.stringify(data))
                }
            }
            $('.fullScreenSpin').css('display','none');
            swal({
                title: 'Yoodle developer successfully updated!',
                text: '',
                type: 'success',
            })
        }
    })
  }
});
