         
const state = {
    toastMessages: []
};
const mutations = {
    _addToastMessage: (state, toastMessage) => {
        state.toastMessages.pop()     
        state.toastMessages.push(toastMessage)
    },
};

export default {
    state,
    mutations
  };

