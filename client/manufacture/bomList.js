import { ReactiveVar } from "meteor/reactive-var";
import { ProductService } from "../product/product-service";

// Template.BOMList.inheritsHooksFrom('non_transactional_list');
Template.bom_list.onCreated(function(){
    const templateObject = Template.instance()
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
      
})
Template.bom_list.onRendered(function(){
  const templateObject  = Template.instance();
  if(FlowRouter.current().queryParams.success){
    $('.btnRefresh').addClass('btnRefreshAlert');
  }
})
Template.bom_list.events({

})
Template.bom_list.helpers({

})