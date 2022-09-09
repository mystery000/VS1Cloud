import GlobalFunctions from "../../GlobalFunctions.js";
import "../global/indexdbstorage.js";

/**
 *
 * The console.logs here are only for debug purpose, wont work on production
 */
class CachedHttp {
  constructor(options = {
    limit: 1,
    endpointPrefix: "cached_http/",
    debug: true
  }) {
    this.limit = options.limit;
    this.endpointPrefix = options.endpointPrefix;
    this.debug = options.debug;
  }

  logger(message, ...optionalParams) {
    const prefix = "CachedHttp | ";

    if (this.debug) 
      console.log(prefix, message, ...optionalParams);
    }
  
  findParamByKey(key, params = {}) {
    if (params[key]) {
      return params[key];
    }
    return false;
  }

  async get(endpoint, onRemoteCall = async () => {}, options = {
    date: new Date(),
    forceOverride: false,
    useIndexDb: true,
    useLocalStorage: false,
    requestParams: {},
    validate: cachedResponse => {
      // this function should return true if the request is using any previously used params
      // else if any params has been changed, it should return false
      // this will validate or not the local request
      if (GlobalFunctions.isSameDay(cachedResponse.response.Params.DateFrom, dateFrom) && GlobalFunctions.isSameDay(cachedResponse.response.Params.DateTo, dateTo) && cachedResponse.response.Params.IgnoreDates == ignoreDate) {
        return true;
      }
      return false;
    }
  }) {
    this.logger("=========================================");
    const endPointName = this.endpointPrefix + endpoint;

    const getFromLocalStorage = endpoint => {
      this.logger("Loading from localStorage ----");

      try {
        const _data = JSON.parse(localStorage.getItem(endpoint));
        this.logger("Loaded from local storage: ", _data);
        return;
      } catch (e) {
        // handled error
      }
    };

    const saveToLocalStorage = jsonData => {
      try {
        const _data = JSON.stringify(jsonData);
        this.logger("Saving to localStorage: ", _data);
        return localStorage.setItem(endPointName, _data);
      } catch (e) {
        // handle error
        //this.logger(e);
      }
    };

    const saveToLocalIndexDb = async (endpoint, data) => {
      data.requestDate = new Date();
      this.logger(`Saving ${endpoint} to local IndexDb: `, data);

      try {
        return await addVS1Data(endpoint, JSON.stringify(data));
      } catch (e) {
        // Handle error
        this.logger(e);
      }
    };

    const getFromLocalIndexDb = async (endpoint, onError = async () => {}) => {
      this.logger("Loading from local indexdb ----");

      try {
        let _data = await getVS1Data(endpoint);

        this.logger("Loaded from indexDB: ", _data);

        _data = JSON.parse(_data[0].data);

        const _response = {
          requestDate: new Date(_data.requestDate),
          response: _data,
          fromLocalIndex: true
        };

        this.logger("Index DB data sanitized: ", _response);

        return _response;
      } catch (e) {
        // Handle error
        return await onError();
      }
    };

    const getFromRemote = async () => {
      this.logger("Loading from remote ----");
      const response = await onRemoteCall();

      let cachedResponse = {
        requestDate: new Date(),
        response: response
      };

      if (options.useLocalStorage) {
        saveToLocalStorage(cachedResponse);
      }

      if (options.useIndexDb) {
        await saveToLocalIndexDb(endpoint, response);
      }

      this.logger("Loaded from remote: ", cachedResponse);

      return cachedResponse;
    };

    const cachedData = options.useLocalStorage == true
      ? getFromLocalStorage(endPointName)
      : await getFromLocalIndexDb(endpoint);

    if (options.forceOverride) {
      this.logger("Forced from remote ----");
      return await getFromRemote();
    }

    if (cachedData) {
      this.logger("NOTICE: Cached data is available: ", cachedData);

      // cachedData = await getFromLocalIndexDb(endpoint, async () => {
      //   return getFromLocalStorage(endPointName);
      // });

      if (options.validate(cachedData) == true) {
        // if no params has been changed

        // if the data already cached
        const hours = Math.abs(options.date - cachedData.requestDate) / 36e5;

        if (hours > this.limit) {
          this.logger("NOTICE: Cached data is expired");
          return await getFromRemote();
        } else {
          this.logger("NOTICE: Loading from cache, the last request is recent");

          return await getFromLocalIndexDb(endpoint, async () => {
            return getFromLocalStorage(endPointName);
          });
          // return JSON.parse(localStorage.getItem(endPointName));
        }
      } else {
        this.logger("NOTICE: No cached data is found with these params (mismatch): ", options.requestParams);
        this.logger("NOTICE: Found from cache: ", cachedData.response.Params);

        // the requested params has changed, to we need to make a new request for this time
        return await getFromRemote();
      }
    } else {
      return await getFromRemote();
    }
  }
}

export default CachedHttp = new CachedHttp();