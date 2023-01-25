import { Template } from 'meteor/templating';
import './copyfrequencypop.html';
Template.copyfrequencypop.events({
    'click input[name="frequencyRadio"]': function(event) {
        if (event.target.id == "frequencyMonthly") {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            document.getElementsByClassName("month-checkbox")[today.getMonth()].checked = true;
        
            today = mm + '/' + dd + '/' + yyyy;
            
            document.getElementById('edtMonthlyStartDate').value = today;
            document.getElementById("sltDay").value = 'day' + dd;
            
            var finishdate = new Date();
            var dd = String(finishdate.getDate()).padStart(2, '0');
            var mm = String(finishdate.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = finishdate.getFullYear() + 1;
        
            finishdate = mm + '/' + dd + '/' + yyyy;
        
            document.getElementById('edtMonthlyFinishDate').value = finishdate;
        } else if (event.target.id == "frequencyWeekly") {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        
            today = mm + '/' + dd + '/' + yyyy;
            var todayDate = new Date(today);
            console.log(todayDate.getDay() == 0 ? 6 : todayDate.getDay() - 1)
            $(".chkBoxDays").prop("checked", false);
            document.getElementsByClassName('chkBoxDays')[todayDate.getDay() == 0 ? 6 : todayDate.getDay() - 1].checked = true;
        
            document.getElementById('edtWeeklyStartDate').value = today;

            var finishdate = new Date();
            var dd = String(finishdate.getDate() + 1).padStart(2, '0');
            var mm = String(finishdate.getMonth() + 2).padStart(2, '0'); //January is 0!
            var yyyy = finishdate.getFullYear();
        
            finishdate = mm + '/' + dd + '/' + yyyy;
        
            document.getElementById('edtWeeklyFinishDate').value = finishdate;
        } else if (event.target.id == "frequencyDaily") {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        
            today = mm + '/' + dd + '/' + yyyy;
        
            document.getElementById('edtDailyStartDate').value = today;
            $("#dailyEveryDay").click();
            
            var finishdate = new Date();
            var dd = String(finishdate.getDate() + 1).padStart(2, '0');
            var mm = String(finishdate.getMonth() + 2).padStart(2, '0'); //January is 0!
            var yyyy = finishdate.getFullYear();
        
            finishdate = mm + '/' + dd + '/' + yyyy;
        
            document.getElementById('edtDailyFinishDate').value = finishdate;
        } else if (event.target.id == "frequencyOnetimeonly") {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        
            today = mm + '/' + dd + '/' + yyyy;
        
            document.getElementById('edtOneTimeOnlyDate').value = today;
        }
    }
})