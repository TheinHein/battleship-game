const publisher = {
  subscribers: {
    any: [],
  },

  on(type, fn, context) {
    const subType = type || "any";
    const subFn = typeof fn === "function" ? fn : context[fn];

    if (typeof this.subscribers[subType] === "undefined") {
      this.subscribers[subType] = [];
    }
    this.subscribers[subType].push({ fn: subFn, context: context || this });
  },

  off(type, fn, context) {
    this.visitSubscribers("unsubscribe", type, fn, context);
  },

  emit(type, publication) {
    this.visitSubscribers("publish", type, publication);
  },

  visitSubscribers(action, type, arg, context) {
    const pubType = type || "any";
    const subscribers = this.subscribers[pubType];
    let i;
    const max = subscribers ? subscribers.length : 0;
    for (i = 0; i < max; i += 1) {
      if (action === "publish") {
        subscribers[i].fn.call(subscribers[i].context, arg);
      } else if (
        subscribers[i].fn === arg &&
        subscribers[i].context === context
      ) {
        subscribers.splice(i, 1);
      }
    }
  },
};

function makePublisher(o) {
  const newPublisher = o;
  Object.keys(publisher).forEach((ele) => {
    if (typeof publisher[ele] === "function") {
      newPublisher[ele] = publisher[ele];
    }
  });
  newPublisher.subscribers = { any: [] };
}

export default makePublisher;
