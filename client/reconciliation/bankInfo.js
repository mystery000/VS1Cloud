export default showBankInfo = () => {
    if (!localStorage.getItem("VS1ReconcileShowBankInfo")) {
        setTimeout(function() {
            swal({
                type: 'info',
                title: 'Fully Automated Bank Integration coming in April 2023',
                // input: 'checkbox',
                // inputValue: 1,
                // inputPlaceholder: '   Do not Show again',
                // inputClass: 'custom-input-class',
                html: `<div class="custom-control custom-switch mt-5">
                <input type="checkbox" class="custom-control-input" id="customSwitch1">
                <label class="custom-control-label" for="customSwitch1">Do not show again</label>
              </div>`,
                showCancelButton: false,
                confirmButtonText: 'Ok',
                preConfirm: () => {
                    return [$('#customSwitch1').is(':checked')]
                }
            }).then((result) => {
                if (result && result.value && result.value[0])
                    localStorage.setItem("VS1ReconcileShowBankInfo", true);
            });
        }, 3000);
    }
}
