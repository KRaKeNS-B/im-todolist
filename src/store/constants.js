const constants = {
  defaultTask() {
    return {
      text: '',
      anchorText: null,
      message: {
        id: null,
      },
      ticket: {
        id: null,
        publicId: null,
      },
      group: {
        id: null,
        name: null,
      },
      done: false,
      doneTime: -1,
      important: false,
      id: null,
    };
  },
};

export default constants;
