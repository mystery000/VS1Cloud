import { Template } from 'meteor/templating';
import './vs1_button.html';

const buttonColorTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link']
const butonSizeTypes = ['xl','lg', 'md', 'sm', 'xs']

Template.vs1_button.helpers({
  getClassNames: () => {
    const templateInstance = Template.instance();
    const {outline, size, isBlock, classes, color} = templateInstance.data;
    const buttonColor = buttonColorTypes.indexOf(color) > -1 ? color: 'primary';
    const buttonColorClass = outline ? `btn-outline-${buttonColor}` : `btn-${buttonColor}`;
    const buttonSizeClass = size ? `btn-${size}` : '';
    const buttonLevelClass = isBlock ? `btn-block` : '';

    return `btn ${buttonColorClass} ${buttonSizeClass} ${buttonLevelClass} ${classes}`;
  }
})