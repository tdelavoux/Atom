import DefaultTheme from 'vitepress/theme';

// import { default as PreviewAndCode } from '../components/PreviewAndCode.vue';

import './variables.css';
import './custom.scss';
import '../../../src/css/main.scss';

// TODO import the js library when JQuery will be fixed
// import "../../../dist/latest/js/atom-all.min.js";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    // app.component('PreviewAndCode', PreviewAndCode)
  }
}