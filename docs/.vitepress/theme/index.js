import DefaultTheme from 'vitepress/theme'

import { default as PreviewAndCode } from '../components/PreviewAndCode.vue';

import './variables.css';
import './custom.scss';
import '../../../src/css/main.scss';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component('PreviewAndCode', PreviewAndCode)
  }
}