

/**
 *
 * The console.logs here are only for debug purpose, wont work on production
 */
class CachedHttp {
  constructor(options = {
    limit: 1,
    endpointPrefix: "cached_http/",
    debug: false
  }) {
    this.limit = options.limit;
    this.endpointPrefix = options.endpointPrefix;
    this.debug = options.debug;
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
    validate: cachedResponse => {
      // this function should return true if the request is using any previously used params
      // else if any params has been changed, it should return false
      // this will validate or not the local request
      return false;
    }
  }) {
    const endPointName = this.endpointPrefix + endpoint;
    const cachedData = localStorage.getItem(endPointName);

    const getFromRemote = async () => {
      const response = await onRemoteCall();

      let cachedResponse = {
        requestDate: new Date(),
        response: response
      };

      localStorage.setItem(endPointName, JSON.stringify(cachedResponse));

      if (this.debug)

      return cachedResponse;
    };

    if (options.forceOverride) {
      if (this.debug)
      return getFromRemote();
    }

    if (cachedData) {
      if (this.debug)

      cachedData = JSON.parse(localStorage.getItem(endPointName));

      if (options.validate(cachedData) == true) {
        // if no params has been changed

        // if the data already cached
        const hours = Math.abs(options.date - cachedData.requestDate) / 36e5;

        if (hours > this.limit) {
          if (this.debug)
          return getFromRemote();
        } else {
          if (this.debug)

          return JSON.parse(localStorage.getItem(endPointName));
        }
      } else {
        if (this.debug)

        // the requested params has changed, to we need to make a new request for this time
        return getFromRemote();
      }
    } else {
      return getFromRemote();
    }
  }
}

export default CachedHttp = new CachedHttp();
