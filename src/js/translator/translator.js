import google from './providers/google';

export default {
  provider: 'google',

  providers: {
    google
  },

  translate(text, sourceLanguage, targetLanguage) {
    if (!text.trim()) {
      return Promise.resolve({
        result: '',
        additional: ''
      });
    }

    return this.providers[this.provider].translate(text, sourceLanguage, targetLanguage);
  },

  voice(text, language) {
    if (!text.trim()) {
      return Promise.resolve();
    }

    return this.providers[this.provider].voice(text, language);
  }
}
