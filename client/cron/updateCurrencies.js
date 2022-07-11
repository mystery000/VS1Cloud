import { ReactiveVar } from "meteor/reactive-var";
import { HTTP } from "meteor/http";
import { updateAllCurrencies } from "../settings/currencies-setting/currencies";


const currentDate = new Date();
let currentFormatedDate =currentDate.getDay() +"/" +currentDate.getMonth() +"/" +currentDate.getFullYear();
