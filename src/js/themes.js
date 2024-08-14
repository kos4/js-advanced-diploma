const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain',
  [Symbol.iterator]() {
    return this;
  },
  next(key = null) {
    if (key !== null) {
      this.current = key;
    }

    if (this.current === undefined) {
      this.current = -1;
    }
    const listThemes = Object.values(this);
    this.current += 1;
    if (this.current === listThemes.length - 2) {
      this.current = 0;
    }

    return {
      done: false,
      value: listThemes[this.current],
    }
  }
};

export default themes;
