<template>
  <div class="page-container" :style="{ width: popupWidth + 'px', height: popupHeight + 'px' }">
    <div class="tabs-content">
      <div class="tab-content" v-if="activeTab === 'translate'">
        <div class="toolbar">
          <multiselect
            class="dropdown-language"
            v-model="sourceLanguage"
            :options="sourceLanguages"
            label="name"
            track-by="code"
            :allow-empty="false"
            :show-labels="false"
            :placeholder="sourceLanguage.name">
          </multiselect>

          <button class="button-swap-languages"></button>

          <multiselect
            class="dropdown-language"
            v-model="targetLanguage"
            :options="targetLanguages"
            label="name"
            track-by="code"
            :allow-empty="false"
            :show-labels="false"
            :placeholder="targetLanguage.name">
          </multiselect>
        </div>

        <div class="input-container" :style="{ height: inputHeight + 'px' }">
          <textarea class="input" tabindex="1" v-model="sourceText" :placeholder="uiStrings.inputPlaceholder"></textarea>

          <button class="button-play"></button>
        </div>

        <div class="resizer-input" @mousedown="inputResizerMouseDown"></div>

        <div class="translation-result-container">
          <div class="translation-result">

          </div>

          <button class="button-play"></button>
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
  </div>
</template>

<style>
  @import "~normalize.css";
  @import "~vue-multiselect/dist/vue-multiselect.min.css";
  @import "./multiselect.css";

  body {
    cursor: default;
    font-size: 11px;
  }

  .page-container {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    border-radius: 0 0 2px 2px;
    overflow: hidden;
  }

  .tabs-content {
    flex: 1;
    background: #f6f6f6;
  }

  .tab-content {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
  }

  .toolbar {
    display: flex;
    padding: 8px;
    border-bottom: 1px solid #e5e5e5;
  }

  .dropdown-language {
    flex: 1;
  }

  .button-swap-languages {
    margin: 0 8px;
    width: 24px;
    border: none;
    outline: none;
    background: url(images/swap-languages.svg) 50% no-repeat;
    background-size: 18px;
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  .button-swap-languages:hover {
    opacity: 1;
  }

  .input-container {
    position: relative;
  }

  .input {
    display: block;
    resize: none;
    outline: none;
    border: none;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-family: system-ui, sans-serif;
    font-size: 13px;
    padding: 8px;
  }

  .resizer-input {
    height: 10px;
    cursor: row-resize;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=") 50% no-repeat;
    border-top: 1px solid #e5e5e5;
    user-select: none;
  }

  .translation-result-container {
    flex: 1;
    position: relative;
  }

  .button-play {
    position: absolute;
    right: 8px;
    bottom: 8px;
  }

  .tabs {
    height: 26px;
    background: linear-gradient(to bottom, #c5c5c5, #dcdcdc);
    border-top: 1px solid #ababab;
    user-select: none;
  }

  .tab {
    float: left;
    line-height: 25px;
    font-weight: 500;
    color: #585858;
    text-transform: uppercase;
    padding: 0 20px 1px;
    position: relative;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    transition: background-color 0.3s ease;
    margin-right: 1px;
  }

  .tab:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .tab-translate {
    padding-left: 24px;
  }

  .tab:after {
    content: '';
    display: block;
    position: absolute;
    right: -1px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.12));
  }

  .tab.is-active {
    background: #f6f6f6;
    margin-top: -1px;
    padding-top: 1px;
    transition: none;
  }

  .tab.is-active:after {
    top: 1px;
  }

  .resizer-overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
  }

  .resizer-overlay.is-input {
    cursor: row-resize;
  }

  .resizer-overlay.is-corner {
    cursor: nesw-resize;
  }

  .resizer-corner {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 12px;
    height: 12px;
    cursor: nesw-resize;
    z-index: 1;
    user-select: none;
    background: url(images/resizer-corner.svg) 0 100% no-repeat;
    background-size: 12px 12px;
    opacity: 0.4;
    transition: opacity 0.3s ease;
  }

  .resizer-corner:hover,
  .resizer-corner:active {
    opacity: 0.6;
  }
</style>

<script>
  import Multiselect from 'vue-multiselect';
  import { between, getSelectedText } from './utils';
  import config from './config';
  import uiStrings from './ui-strings';
  import languages from './languages';

  let mouseCoordinates = {};
  let popupSize = {};
  let inputHeight;
  let maxInputHeight = Infinity;

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

    maxInputHeight = (document.body.clientHeight
      - toolbar.offsetHeight
      - inputResizer.offsetHeight
      - tabs.offsetHeight
      - config.minTranslationResultHeight
    );
  }

  function findLanguage(lang) {
    return uiStrings[lang] ? lang : config.fallbackLanguage;
  }

  export default {
    components: { Multiselect },

    data() {
      return {
        inputHeight: config.defaultPopupHeight,
        popupWidth: clampPopupWidth(localStorage.popupWidth || config.defaultPopupWidth),
        popupHeight: clampPopupHeight(localStorage.popupHeight || config.defaultPopupHeight),
        uiLanguage: findLanguage(localStorage.uiLanguage || navigator.language || navigator.userLanguage),

        sourceLanguage: { name: 'Autodetect', code: 'auto' },
        targetLanguage: { name: 'Russian', code: 'ru' },

        sourceText: '',

        activeTab: 'translate',

        resizing: false
      }
    },

    computed: {
      uiStrings() {
        return uiStrings[this.uiLanguage];
      },

      sourceLanguages() {
        return languages;
      },

      targetLanguages() {
        return languages;
      }
    },

    mounted() {
      getSelectedText().then(text => {
        if (text) {
          this.sourceText = text;
        } else {
          this.sourceText = localStorage.sourceText || '';
        }

        this.$nextTick(() => {
          document.querySelector('.input').select();
        });
      });

      calcMaxInputHeight();
      this.inputHeight = clampInputHeight(localStorage.inputHeight || config.defaultInputHeight);
    },

    methods: {
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
        popupSize.width = this.popupWidth;
        popupSize.height = this.popupHeight;

        const mouseMove = e => {
          calcMaxInputHeight();

          this.popupWidth = clampPopupWidth(popupSize.width + mouseCoordinates.x - e.screenX);
          this.popupHeight = clampPopupHeight(popupSize.height - mouseCoordinates.y + e.screenY);
          this.inputHeight = clampInputHeight(this.inputHeight);
        };

        const mouseUp = () => {
          this.resizing = false;

          document.removeEventListener('mousemove', mouseMove);
          document.removeEventListener('mouseup', mouseUp);

          localStorage.popupWidth = this.popupWidth;
          localStorage.popupHeight = this.popupHeight;
        };

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
      }
    }
  }
</script>
