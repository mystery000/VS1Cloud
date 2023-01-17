import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

var activityTimeout = setTimeout(inActive, 1800000);
var sidebarTimeout = setTimeout(closeSideBar, 3000);

function resetActive(){
    $(document.body).attr('class', 'active');
    clearTimeout(activityTimeout);
    clearTimeout(sidebarTimeout);
    activityTimeout = setTimeout(inActive, 1800000);
    sidebarTimeout = setTimeout(closeSideBar, 3000);
}
function closeSideBar(){
if ($(".collapse.show")[0]){
// $('.nav-item .collapse').removeClass('show');
}
}
function inActive(){
    $(document.body).attr('class', 'inactive');
    var loc = FlowRouter.current().path;

      if ((loc != '/') && (loc != '/register') && (loc != '/registerdb')
      && (loc != '/vs1greentracklogin')&& (loc != '/registersts')
    && (loc != '/paymentmethodSettings')) {
        CloudUser.update({_id: localStorage.getItem('mycloudLogonID')},{ $set: {userMultiLogon: false}});
        if(localStorage.getItem('isGreenTrack')){
          window.open('/vs1greentracklogin','_self');
        }else{
          //window.open('/','_self');
        }

        document.getElementById('apptimer').style.display='block';
        // $('#sessionTimeout').modal('toggle');
      }

}

$(document).bind('mousemove', function(){resetActive()});
