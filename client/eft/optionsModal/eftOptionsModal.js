import { ReactiveVar } from "meteor/reactive-var";


Template.eftOptionsModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.eftOptionsList = new ReactiveVar([]);
});

Template.eftOptionsModal.onRendered(function () {
  let templateObject = Template.instance();

  templateObject.setInitEftOptions = () => {
    // tempcode
    let eftOptions = [
      {
        id: 'balance',
        label: 'Include Balance Record',
        active: false
      },
      {
        id: 'net',
        label: 'Include Net Total',
        active: false
      },
      {
        id: 'credit',
        label: 'Include Credit Total',
        active: false
      },
      {
        id: 'debit',
        label: 'Include Debit Total',
        active: false
      },
    ];

    templateObject.eftOptionsList.set(eftOptions)
    addVS1Data('TEftOptions', JSON.stringify(eftOptions)).then(function (datareturn) {
    }).catch(function (err) {
    });
  }

  templateObject.loadEftOptions = () => {
      templateObject.setInitEftOptions();
      // getVS1Data("TEftOptions")
      // .then(function (dataObject) {
      //   if (dataObject.length === 0) {
      //     templateObject.setInitEftOptions();
      //   } else {
      //     let data = JSON.parse(dataObject[0].data);
      //     templateObject.eftOptionsList.set(data)
      //   }
      // }).catch(function (err) {
      //   templateObject.setInitEftOptions();
      // });
  };
  templateObject.loadEftOptions();
});

Template.eftOptionsModal.events({

  "click .btnSaveEftOptions": (e) => {
    playSaveAudio();
    let templateObject = Template.instance();
    setTimeout(function(){
    let eftOptions = templateObject.eftOptionsList.get();
    $('.chkEftOptionsList').each(function (index) {
      var $tblrow = $(this);
      var fieldID = $tblrow.attr("optionsid") || 0;
      var colHidden = false;
      if ($tblrow.find(".chkEftOption").is(':checked')) {
        colHidden = true;
      } else {
        colHidden = false;
      }

      eftOptions = eftOptions.map(item => {
        if (item.id === fieldID) {
          return { ...item, active: colHidden };
        }
        return item;
      })

    });

    addVS1Data('TEftOptions', JSON.stringify(eftOptions)).then(function (datareturn) {
      $('#eftOptionsModal').modal('hide');
    }).catch(function (err) {
      $('#eftOptionsModal').modal('hide');
    });
  }, delayTimeAfterSound);
  },

  "click .btnCancelEftOptions": (e) => {
    playCancelAudio();
    setTimeout(function(){
      $('#eftOptionsModal').modal('hide');
    }, delayTimeAfterSound);
  },

  "click .chkEftOption": (e) => {

  }
});

Template.eftOptionsModal.helpers({
  eftOptionsList: () => {
    return Template.instance().eftOptionsList.get();
  },
});
