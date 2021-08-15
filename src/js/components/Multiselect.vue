<style lang="scss">
  .multiselect {
    min-height: 0;
  }

  .multiselect--active {
    z-index: 6;
  }

  .multiselect__tags {
    position: relative;
    padding: 2px 26px 0 2px;
    min-height: 0;
    z-index: 2;
    border-radius: 3px;
    border: none;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.1);

    .multiselect--active & {
      border-bottom: none;
    }
  }

  .multiselect__input,
  .multiselect__single {
    margin-bottom: 2px;
    cursor: default;
    font-size: 11px;
    text-transform: uppercase;

    &:focus {
      cursor: auto;
    }
  }

  .multiselect__select {
    height: 24px;
    z-index: 3;
    cursor: default;
    padding: 0 2px;
    width: 26px;
  }

  .multiselect-enter,
  .multiselect-leave-active {
    opacity: 0;
    transform: translateY(-10px);
  }

  .multiselect__content-wrapper {
    padding: 4px 0;
    border: none;
    border-radius: 0 0 3px 3px;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.1),
      0 2px 3px rgba(0, 0, 0, 0.1);
  }

  .multiselect__option {
    min-height: 0;
    text-transform: uppercase;
    padding: 0 8px 0 25px;
    line-height: 30px;
    cursor: default;
    font-size: 11px;
    transition:
      background-color 0.1s ease,
      background-image 0.1s ease,
      color 0.1s ease;
  }

  .multiselect__option--selected {
    background: transparent url('data:image/svg+xml;utf8,<?xml version="1.0" ?><svg height="32" id="check" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z"/></svg>') 8px 50% no-repeat;
    background-size: 12px 12px;
    font-weight: 500;
  }

  .multiselect__option--highlight {
    background-color: #41b883;
  }

  .multiselect__option--selected.multiselect__option--highlight {
    background: #41b883 url('data:image/svg+xml;utf8,<?xml version="1.0" ?><svg height="32" id="check" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z"/></svg>') 8px 50% no-repeat;
    background-size: 12px 12px;
  }

  .multiselect__option--disabled {
    background: none;
    padding: 0 8px !important;
    line-height: 30px;
    color: #cecece;

    &:after {
      content: '';
      display: block;
      position: absolute;
      height: 1px;
      left: 0;
      right: 0;
      top: auto;
      bottom: 0;
      /*top: 100%;*/
      background: #000;
      opacity: 0.05;
      pointer-events: none;
      z-index: 7;
    }
  }

  .dropdown-language-pin {
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    right: 8px;
    top: 50%;
    margin-top: -8px;
    background: url(/images/pin1.svg) 50% no-repeat;
    background-size: 16px 16px;
    opacity: 0;
    transition: opacity 0.1s ease;

    .multiselect__option--highlight & {
      opacity: 0.5;
    }

    &.is-pinned {
      opacity: 0.5;
      background-image: url(/images/pin2.svg);
    }
  }
</style>

<script>
  import Multiselect from 'vue-multiselect';

  export default {
    extends: Multiselect,

    props: {
      optionHeight: { default: 30 },
      label: { default: 'name' },
      trackBy: { default: 'code' },
      groupLabel: { default: 'groupLabel' },
      groupValues: { default: 'items' },
      allowEmpty: { default: false },
      showLabels: { default: false },
    },

    created() {
      this.$on('open', this.onOpen);
    },

    methods: {
      onOpen() {
        for (let index = 0; index < this.filteredOptions.length; index++) {
          const option = this.filteredOptions[index];
          if (this.isSelected(option)) {
            this.pointerSet(index);
            break;
          }
        }
      }
    }
  }
</script>
