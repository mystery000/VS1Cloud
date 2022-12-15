export default showBankInfo = () => {
    if (!localStorage.getItem("VS1ReconcileShowBankInfo")) {
        setTimeout(function() {
            swal({
                type: 'info',
                title: 'Fully Automated Bank Integration coming in April 2023',
                // input: 'checkbox',
                // inputValue: 1,
                // inputPlaceholder: 'Do not Show again',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                html: `<label for="swal2-checkbox" class="swal2-checkbox" style="display: block;">
                <input type="checkbox" value="1" id="swal2-checkbox" autocomplete="off" style="width: 20px; height: 20px; margin-right: 10px;">
                <span>Do not show again</span></label>`,
            }).then((result) => {
                if (result && result.value)
                    localStorage.setItem("VS1ReconcileShowBankInfo", true);
            });
        }, 3000);
    }
}