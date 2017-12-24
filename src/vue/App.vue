<template>
  <div class="page-container" :class="{ 'is-visible': allLoaded }">
    <div class="tabs-content">
      <div class="tab-content" v-if="activeTab === 'translate'">
        <div class="toolbar">
          <multiselect
            class="dropdown-language"
            v-model="sourceLanguage"
            label="name"
            track-by="code"
            group-label="groupLabel"
            group-values="items"
            :options="sourceLanguages"
            :allow-empty="false"
            :show-labels="false"
            :custom-label="dropdownCustomLabel"
            :placeholder="sourceLanguage && sourceLanguage.name ? uiStrings.languagesSearch : uiStrings.languagesChoose"
            @open="dropdownTouched(true)"
            @close="dropdownTouched(false)">

            <span slot="option" slot-scope="props">
              {{ props.option.$isLabel ? props.option.$groupLabel : props.option.name }}
              <svg
                class="icon icon-pin"
                v-if="!props.option.$isLabel && props.option.code !== 'auto'"
                @click.stop="pinLanguage(props.option.code, false)">
                <use xlink:href="#icon-pin"></use>
              </svg>
              <!--<span
                v-if="!props.option.$isLabel && props.option.code !== 'auto'"
                class="dropdown-language-pin"
                :class="{ 'is-pinned': pinnedSourceLanguages.includes(props.option.code) }"
                @click.stop="pinLanguage(props.option.code, false)">
              </span>-->
            </span>

            <span slot="noResult">{{ uiStrings.languagesNotFound }}</span>
          </multiselect>

          <button class="button-swap-languages" @click="swapLanguages"></button>

          <multiselect
            class="dropdown-language"
            v-model="targetLanguage"
            label="name"
            track-by="code"
            group-label="groupLabel"
            group-values="items"
            :options="targetLanguages"
            :allow-empty="false"
            :show-labels="false"
            :placeholder="targetLanguage && targetLanguage.name ? uiStrings.languagesSearch : uiStrings.languagesChoose"
            @open="dropdownTouched(true)"
            @close="dropdownTouched(false)">

            <span slot="option" slot-scope="props">
              {{ props.option.$isLabel ? props.option.$groupLabel : props.option.name }}
              <svg
                class="icon icon-pin"
                v-if="!props.option.$isLabel && props.option.code !== 'auto'"
                @click.stop="pinLanguage(props.option.code, true)">
                <use xlink:href="#icon-pin"></use>
              </svg>

              <!--<span
                v-if="!props.option.$isLabel"
                class="dropdown-language-pin"
                :class="{ 'is-pinned': pinnedTargetLanguages.includes(props.option.code) }"
                @click.stop="pinLanguage(props.option.code, true)">
              </span>-->
            </span>

            <span slot="noResult">{{ uiStrings.languagesNotFound }}</span>
          </multiselect>
        </div>

        <div class="input-container" :style="{ height: inputHeight + 'px' }">
          <textarea
            class="input"
            tabindex="1"
            v-model="sourceText"
            :placeholder="uiStrings.inputPlaceholder"
            @input="inputChanged">
          </textarea>

          <button class="button-play" @click="voiceSourceText"></button>
        </div>

        <div class="resizer-input" @mousedown="inputResizerMouseDown"></div>

        <div class="translation-result-container">
          <div class="translation-result" v-html="translationResultFormatted"></div>

          <div class="translation-overlay" :class="{ 'is-visible': translating }">
            <loader></loader>
          </div>

          <button class="button-play" @click="voiceTranslationResult"></button>
        </div>
      </div>

      <div class="tab-content" v-if="activeTab === 'settings'">...</div>
    </div>

    <div class="tabs">
      <div
        class="tab tab-translate"
        :class="{ 'is-active': activeTab === 'translate' }"
        @click="activeTab = 'translate'">
        {{ uiStrings.tabTranslate }}
      </div>

      <div
        class="tab tab-settings"
        :class="{ 'is-active': activeTab === 'settings' }"
        @click="activeTab = 'settings'">
        {{ uiStrings.tabSettings }}
      </div>
    </div>

    <div class="resizer-overlay" :class="'is-' + resizing" v-if="resizing"></div>
    <div class="resizer-corner" @mousedown="cornerResizerMouseDown"></div>
    <div class="dropdown-opened-overlay" :class="{ 'is-visible': dropdownOpened }"></div>

    <div class="svg-icons">
      <symbol id="icon-pin" viewBox="0 0 20 20">
        <path d="M4.774 15.287l-2.105 3.25 0.224 1.063 1.060-0.227 2.104-3.248c-0.224-0.12-0.446-0.248-0.661-0.39-0.218-0.141-0.426-0.292-0.622-0.448zM13.686 14.152c0.014-0.029 0.023-0.061 0.036-0.092 0.053-0.117 0.1-0.234 0.138-0.357 0.006-0.022 0.009-0.044 0.016-0.064 0.039-0.136 0.072-0.27 0.098-0.408 0-0.007 0-0.012 0-0.021 0.195-1.169-0.145-2.473-0.923-3.651l1.11-1.714c1.279 0.163 2.385-0.159 2.917-0.982 0.923-1.423-0.2-3.792-2.505-5.293-2.307-1.502-4.923-1.565-5.844-0.144-0.534 0.824-0.378 1.967 0.293 3.073l-1.112 1.714c-1.389-0.233-2.716-0.016-3.703 0.64-0.006 0.002-0.013 0.004-0.017 0.008-0.115 0.078-0.227 0.164-0.332 0.254-0.017 0.014-0.037 0.027-0.051 0.041-0.098 0.084-0.186 0.178-0.271 0.272-0.020 0.024-0.048 0.045-0.067 0.070-0.106 0.121-0.204 0.249-0.29 0.385-1.384 2.133-0.203 5.361 2.633 7.209 2.838 1.848 6.26 1.614 7.641-0.519 0.087-0.135 0.167-0.276 0.233-0.421zM12.871 4.194c-0.887-0.577-1.32-1.487-0.965-2.036 0.354-0.547 1.361-0.522 2.246 0.055 0.889 0.577 1.318 1.489 0.965 2.036s-1.358 0.522-2.246-0.055z"></path>
      </symbol>
    </div>
  </div>
</template>

<style>
  @import "../../node_modules/normalize.css";
  @import "../../node_modules/vue-multiselect/dist/vue-multiselect.min.css";
  @import "../styles/multiselect.css";
  @import "../styles/popup.css";
</style>

<script>
  import Multiselect from 'vue-multiselect';
  import Loader from './Loader.vue';
  import config from '../config';
  import { between, escapeHTMLEntities, getSelectedText } from '../misc/utils';
  import uiStrings from '../misc/ui-strings';
  import languages from '../translator/languages';
  import translator from '../translator/translator';

  let mouseCoordinates = {};
  let popupSize = {};
  let inputHeight;
  let maxInputHeight = Infinity;
  let debounceTimeout = false;
  let defaultPinnedLanguages;

  function clampPopupWidth(value) {
    return between(value, config.minPopupWidth, config.maxPopupWidth);
  }

  function clampPopupHeight(value) {
    return between(value, config.minPopupHeight, config.maxPopupHeight);
  }

  function clampInputHeight(value) {
    return between(value, config.minInputHeight, maxInputHeight);
  }

  function calcMaxInputHeight() {
    const toolbar = document.querySelector('.toolbar');
    const inputResizer = document.querySelector('.resizer-input');
    const tabs = document.querySelector('.tabs');

    maxInputHeight = (
      document.body.clientHeight -
      toolbar.offsetHeight -
      inputResizer.offsetHeight -
      tabs.offsetHeight -
      config.minTranslationResultHeight
    );
  }

  function findLanguageItem(langCode) {
    langCode = langCode.toLowerCase();
    return languages.find(langItem => langItem.code === langCode);
  }

  function getDefaultPinnedLanguages() {
    if (!defaultPinnedLanguages) {
      defaultPinnedLanguages = ['en'];

      const userLanguage = findLanguageItem(navigator.language);

      if (userLanguage && userLanguage.code !== 'en') {
        defaultPinnedLanguages.push(userLanguage.code);
      }
    }

    return defaultPinnedLanguages;
  }

  export default {
    components: { Multiselect, Loader },

    data() {
      return {
        allLoaded: false,
        provider: localStorage.provider || config.defaultTranslationProvider,
        inputHeight: config.defaultInputHeight,

        uiLanguage: (() => {
          const uiLanguage = localStorage.uiLanguage || navigator.language;
          return uiStrings[uiLanguage] ? uiLanguage : config.fallbackLanguage;
        })(),

        pinnedSourceLanguages: (() => {
          if (localStorage.pinnedSourceLanguages) {
            return localStorage.pinnedSourceLanguages.split(',');
          }

          const pinnedLanguages = getDefaultPinnedLanguages();
          localStorage.pinnedSourceLanguages = pinnedLanguages.join(',');
          return pinnedLanguages;
        })(),

        pinnedTargetLanguages: (() => {
          if (localStorage.pinnedTargetLanguages) {
            return localStorage.pinnedTargetLanguages.split(',');
          }

          const pinnedLanguages = getDefaultPinnedLanguages();
          localStorage.pinnedTargetLanguages = pinnedLanguages.join(',');
          return pinnedLanguages;
        })(),

        sourceLanguage: {},
        targetLanguage: {},

        sourceText: '',
        translationResult: {
          result: '',
          additional: '',
          detectedLanguage: ''
        },

        activeTab: 'translate',

        resizing: false,
        dropdownOpened: false,
        translating: false
      }
    },

    computed: {
      uiStrings() {
        return uiStrings[this.uiLanguage];
      },

      autodetectLanguageItem() {
        return {
          name: this.uiStrings.languageAutodetect,
          code: 'auto'
        };
      },

      sourceLanguages() {
        return [
          {
            groupLabel: this.uiStrings.languagesPinned,
            items: [
              this.autodetectLanguageItem,
              ...this.pinnedSourceLanguages.map(langCode => {
                return {
                  ...findLanguageItem(langCode),
                  pinned: true
                }
              })
            ]
          },
          {
            groupLabel: this.uiStrings.languagesAll,
            items: languages
          }
        ];
      },

      targetLanguages() {
        return [
          {
            groupLabel: this.uiStrings.languagesPinned,
            items: this.pinnedTargetLanguages.map(langCode => {
              return {
                ...findLanguageItem(langCode),
                pinned: true
              }
            })
          },
          {
            groupLabel: this.uiStrings.languagesAll,
            items: languages
          }
        ];
      },

      translationResultFormatted() {
        return (
          escapeHTMLEntities(this.translationResult.result).replace(/\n/g, '<br>') +
          this.translationResult.additional
        )
      }
    },

    watch: {
      provider() {
        translator.provider = this.provider;
        this.translate();
      },

      sourceLanguage() {
        localStorage.sourceLanguage = this.sourceLanguage.code || '';
        this.translate();
      },

      targetLanguage() {
        localStorage.targetLanguage = this.targetLanguage.code || '';
        this.translate();
      }
    },

    mounted() {
      translator.provider = this.provider;

      this.sourceLanguage = localStorage.sourceLanguage && localStorage.sourceLanguage !== 'auto'
        ? findLanguageItem(localStorage.sourceLanguage)
        : this.autodetectLanguageItem;

      this.targetLanguage = findLanguageItem(localStorage.targetLanguage || navigator.language);

      getSelectedText().then(text => {
        this.sourceText = text.trim() || localStorage.sourceText || '';
        this.allLoaded = true;

        if (this.sourceText === localStorage.sourceText && localStorage.translationResult) {
          this.translationResult = JSON.parse(localStorage.translationResult);
        } else {
          this.translate();
        }

        this.$nextTick(() => {
          document.querySelector('.input').select();
        });
      });

      calcMaxInputHeight();
      this.inputHeight = clampInputHeight(localStorage.inputHeight || config.defaultInputHeight);
    },

    methods: {
      translate() {
        if (!this.allLoaded) {
          return false;
        }

        this.translating = true;

        localStorage.sourceText = this.sourceText;
        localStorage.translationResult = '';

        translator
          .translate(
            this.sourceText,
            this.sourceLanguage.code,
            this.targetLanguage.code
          )
          .then(translationResult => {
            this.translationResult = {
              detectedLanguage: this.translationResult.detectedLanguage,
              ...translationResult
            };

            this.translating = false;

            localStorage.translationResult = JSON.stringify(this.translationResult)
          });
      },

      voiceSourceText() {
        translator.voice(
          this.sourceText,
          this.translationResult.detectedLanguage || this.sourceLanguage.code
        );
      },

      voiceTranslationResult() {
        translator.voice(
          this.translationResult.result,
          this.targetLanguage.code
        );
      },

      inputChanged() {
        this.translating = true;

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(this.translate.bind(this), config.autoTranslateDelay);
      },

      inputResizerMouseDown(e) {
        this.resizing = 'input';

        mouseCoordinates.y = e.screenY;
        inputHeight = this.inputHeight;

        const mouseMove = e => {
          this.inputHeight = clampInputHeight(inputHeight + e.screenY - mouseCoordinates.y);
        };

        const mouseUp = () => {
          this.resizing = false;

          document.removeEventListener('mousemove', mouseMove);
          document.removeEventListener('mouseup', mouseUp);

          localStorage.inputHeight = this.inputHeight;
        };

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
      },

      cornerResizerMouseDown(e) {
        this.resizing = 'corner';

        mouseCoordinates.x = e.screenX;
        mouseCoordinates.y = e.screenY;
        popupSize.width = document.documentElement.clientWidth;
        popupSize.height = document.documentElement.clientHeight;

        const mouseMove = e => {
          document.documentElement.style.width = clampPopupWidth(popupSize.width + mouseCoordinates.x - e.screenX) + 'px';
          document.documentElement.style.height = clampPopupHeight(popupSize.height - mouseCoordinates.y + e.screenY) + 'px';

          calcMaxInputHeight();
          this.inputHeight = clampInputHeight(this.inputHeight);
        };

        const mouseUp = () => {
          this.resizing = false;

          document.removeEventListener('mousemove', mouseMove);
          document.removeEventListener('mouseup', mouseUp);

          localStorage.popupWidth = document.documentElement.clientWidth;
          localStorage.popupHeight = document.documentElement.clientHeight;
        };

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
      },

      dropdownTouched(opened) {
        if (opened) {
          this.$nextTick(() => {
            this.dropdownOpened = true;
          })
        } else {
          this.dropdownOpened = false;
        }
      },

      pinLanguage(langCode, isTarget) {
        const list = isTarget ? this.pinnedTargetLanguages : this.pinnedSourceLanguages;
        const index = list.indexOf(langCode);

        if (index !== -1) {
          list.splice(index, 1)
        } else {
          list.push(langCode);
        }

        if (isTarget) {
          localStorage.pinnedTargetLanguages = list.join(',');
        } else {
          localStorage.pinnedSourceLanguages = list.join(',');
        }
      },

      swapLanguages() {
        ;
      },

      dropdownCustomLabel(item) {
        if (item.code === 'auto' && this.translationResult.detectedLanguage) {
          const foundItem = findLanguageItem(this.translationResult.detectedLanguage);

          if (foundItem) {
            return item.name + ': ' + foundItem.name;
          }
        }

        return item.name;
      }
    }
  }
</script>
