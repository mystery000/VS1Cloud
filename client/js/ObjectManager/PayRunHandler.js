import erpObject from "../../lib/global/erp-objects";
import PayRun from "../Api/Model/PayRun";
import ObjectManager from "./ObjectManager";

/**
 * @var {PayRun[]} payruns
 */
export default class PayRunHandler {
  constructor() {
    this.payruns = [];

    //this.loadFromLocal();
  }

  incrementVirtualId() {
    this.nextVirtualId += 1;
    return {Id: this.nextVirtualId, isVirtualId: true};
  }

  /**
     * This will get the data from localindexdb
     * @returns
     */
  async loadFromLocal() {
    let response = await getVS1Data(erpObject.TPayRunHistory);
    if (response.length > 0) {
      let objects = JSON.parse(response[0].data);
      this.payruns = PayRun.fromList(objects);
    }
    return this.payruns;
  }

  /**
     * This will get the data from remote server
     */
  async loadFromRemote() {}

  /**
     *
     * @param {PayRun} object
     * @param {boolean} override
     * @returns
     */
  async add(object, override = false) {
    if (this.findOneById(object) && override == false) {
      const result = await swal({
        title: "Couldn't add PayRun", text: "Cannot save duplicate ID.", type: "error", showCancelButton: false, confirmButtonText: "Ok"
        // cancelButtonText: "Override"
      });

      //   if (result.value) {
      //     return;
      //   }
    } else {
      if (override == true) {
        return this.replace(object);
      }

      // console.log('new object created', object);
      this.payruns.push(object);
      await this.saveToLocal();
    }
  }

  /**
     *
     * @param {PayRun} object
     */
  update(object) {
    console.log("to update", object, this.payruns);
    this.payruns.forEach((p, index) => {
      if (p.Id == object.Id) {
        this.payruns[index] = object;
      }
    });
    console.log("updateed", object, this.payruns);
  }

  /**
     *
     * @param {PayRun[]} objects
     * @param {boolean} override
     */
  set(objects = [], override = false) {
    objects.forEach(object => {
      this.add(object, override);
    });
  }

  /**
     *
     * @param {PayRun} object
     * @returns
     */
  async remove(object) {
    // this.payruns = this.payruns.filter((payrun) => payrun != object);

    // return this.payruns;
    const index = this.payruns.findIndex(p => p.Id == object.Id);
    if (index >= 0) 
      this.payruns.splice(index, 1);
    }
  
  findOneById(object) {
    return this.payruns.find(payrun => (
      payrun.fields.Id != undefined
      ? payrun.fields.Id
      : payrun.Id) == (
      object.fields.Id != undefined
      ? object.fields.Id
      : object.Id));
  }

  findAll() {
    return this.payruns;
  }

  findOneBy(criteries = []) {}

  async saveToLocal() {
    try {
      await addVS1Data(erpObject.TPayRunHistory, JSON.stringify(this.payruns));
    } catch (e) {
      const result = await swal({
        title: "Couldn't save PayRun History",
        //text: "Cannot save duplicate ID.",
        type: "error",
        showCancelButton: true,
        confirmButtonText: "Retry"
      });

      if (result.value) {
        await this.saveToLocal();
      }
    }
  }

  /**
     * This will sync with remote server
     */
  async sync() {}
}
